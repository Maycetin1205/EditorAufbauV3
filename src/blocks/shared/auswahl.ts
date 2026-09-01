import { ACTION_VALUE_ID_ATTR } from '../../core/data/aktionen'
import { AUSWAHL_FOLGE_PROP, type AuswahlFolge } from '../../core/data/auswahlFolge'
import { getField } from '../../softengine/data'
import { paarListeAusAttribut } from './paarListe'

export function merkmalVon(zeile: unknown): string {
  if (zeile == null) return ''
  try {
    return JSON.stringify(zeile) ?? ''
  } catch {
    return ''
  }
}

// Die Wahl-Nummer sagt, WANN gewaehlt wurde: zeigen zwei Bausteine dieselbe
// Quelle, gewinnt die juengste Wahl (s. gewaehlteZeileDerQuelle).
const zustand = new Map<string, { zeile: unknown; merkmal: string; nummer: number }>()
const hoerer = new Set<(durchBedienung: boolean) => void>()
const zuruecksetzer = new Set<() => void>()

let wahlZaehler = 0

// Ob eine Auswahl-Aenderung vom BEDIENER kam (Zeilenklick, Satz im
// Nachschlage-Fenster) oder aus einem Programm-Lauf (Hydrieren), reist als
// Argument MIT der Meldung zu jedem Hoerer. Die holenden Quellen lesen das als
// Bremse gegen Kreis-Feuer: nur eine Bedienung darf dieselbe Zeile beliebig
// oft neu laden lassen (Nutzer-Befund 2026-09-01: zwei Geber schaukelten sich
// hoch, Relation 69 feuerte im Halbsekundentakt gegen das ERP). Frueher stand
// die Herkunft in einem globalen Flag — das ueberschrieb der ERSTE Hoerer
// (Hydrierung eines Folge-Felds ruft setzeAuswahl), bevor der zweite las, und
// der dritte Klick auf denselben Beleg holte keine Positionen mehr.
let meldungLaeuft = false
let nachmeldung = false
let nachBedienung = false

function melde(durchBedienung: boolean): void {
  if (meldungLaeuft) {
    nachmeldung = true
    nachBedienung ||= durchBedienung
    return
  }
  meldungLaeuft = true
  let herkunft = durchBedienung
  try {
    do {
      nachmeldung = false
      nachBedienung = false
      hoerer.forEach((cb) => cb(herkunft))
      herkunft = nachBedienung
    } while (nachmeldung)
  } finally {
    meldungLaeuft = false
  }
}

export function aufAuswahlHoeren(cb: (durchBedienung: boolean) => void): void {
  hoerer.add(cb)
}

export function auswahlFuer(geberId: string): unknown | undefined {
  return zustand.get(geberId)?.zeile
}

export function auswahlMerkmal(geberId: string): string {
  return zustand.get(geberId)?.merkmal ?? ''
}

// 0 = dieser Geber hat keine Auswahl. Groesser heisst juenger.
export function auswahlNummer(geberId: string): number {
  return zustand.get(geberId)?.nummer ?? 0
}

// Die eine Baustein-Kennung der Maske (exportMask schreibt sie fuer jeden
// adressierbaren Baustein, den Auswahl-Geber eingeschlossen).
export function geberIdVon(el: Element): string {
  return el.getAttribute(ACTION_VALUE_ID_ATTR) ?? ''
}

export function auswahlWiederfinden<T>(
  geberId: string,
  kandidaten: readonly T[],
  zeileVon: (kandidat: T) => unknown,
): number[] {
  if (geberId === '') return []
  const merkmal = auswahlMerkmal(geberId)
  if (merkmal === '') return []
  const treffer: number[] = []
  kandidaten.forEach((kandidat, i) => {
    if (merkmalVon(zeileVon(kandidat)) === merkmal) treffer.push(i)
  })
  if (treffer.length === 0) klareAuswahl(geberId)
  return treffer
}

export function waehleAuswahl(geberId: string, zeile: unknown): void {
  if (geberId === '') return
  const merkmal = merkmalVon(zeile)
  if (merkmal === '') return
  const alt = zustand.get(geberId)
  if (alt && alt.merkmal === merkmal) zustand.delete(geberId)
  else zustand.set(geberId, { zeile, merkmal, nummer: ++wahlZaehler })
  melde(true)
}

// Setzt die Auswahl ohne Umschalten (nochmal derselbe Satz bleibt gewaehlt).
// `durchBedienung` sagt, ob ein Mensch den Satz gewaehlt hat (Nachschlagen,
// Vorschlag) — die Hydrierung laesst es weg.
export function setzeAuswahl(geberId: string, zeile: unknown, durchBedienung = false): void {
  if (geberId === '') return
  const merkmal = merkmalVon(zeile)
  if (merkmal === '') return
  if (zustand.get(geberId)?.merkmal === merkmal) return
  zustand.set(geberId, { zeile, merkmal, nummer: ++wahlZaehler })
  melde(durchBedienung)
}

export function klareAuswahl(geberId: string): void {
  if (!zustand.has(geberId)) return
  zustand.delete(geberId)
  melde(false)
}

// Wer eigene Spuren zur Auswahl haelt, laesst sie hier mitloeschen.
export function beimAuswahlZuruecksetzen(cb: () => void): void {
  zuruecksetzer.add(cb)
}

export function setzeAuswahlZurueck(): void {
  zustand.clear()
  wahlZaehler = 0
  zuruecksetzer.forEach((cb) => cb())
}

const AUSWAHL_FOLGE_ATTR = AUSWAHL_FOLGE_PROP.toLowerCase()

export function folgenAusAttribut(el: HTMLElement): AuswahlFolge[] {
  return paarListeAusAttribut(el, AUSWAHL_FOLGE_ATTR, 'geberId')
    .map((e) => ({ geberId: e.id, keyPairs: e.keyPairs }))
}

export function zeilenNachAuswahl(
  el: HTMLElement,
  rows: unknown[],
): { rows: unknown[]; gefiltert: boolean } {
  let raus = rows
  let gefiltert = false
  for (const folge of folgenAusAttribut(el)) {
    const auswahl = auswahlFuer(folge.geberId)
    if (auswahl === undefined) continue
    gefiltert = true
    raus = raus.filter((row) =>
      folge.keyPairs.every((p) => {
        const soll = getField(auswahl, p.fromField)
        return soll !== '' && soll === getField(row, p.toField)
      }),
    )
  }
  return { rows: raus, gefiltert }
}

export function ersteZeileNachAuswahl(el: HTMLElement, rows: unknown[]): unknown {
  if (folgenAusAttribut(el).length === 0) return rows[0]
  const { rows: passende, gefiltert } = zeilenNachAuswahl(el, rows)
  return gefiltert ? passende[0] : undefined
}
