import { seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, getField, rowsFor } from '../../softengine/data'
import { WEITERE_QUELLEN_PROP, type SchluesselPaar } from '../../core/data/sourceLinks'
import { zerlegeBindung } from '../../core/blocks/BlockDefinition'
import { paarListeAusAttribut } from './paarListe'

const WEITERE_QUELLEN_ATTR = WEITERE_QUELLEN_PROP.toLowerCase()

export type FeldLeser = (row: unknown, wert: string) => string

interface Nachschlag {
  nachSchluessel: Map<string, unknown>

  // Die Quelle, deren Felder den Schluessel liefern. Leer = die Hauptquelle.
  partnerId: string

  hierFelder: string[]
}

const SCHLUESSEL_TRENNER = '\x01'

function schluesselAus(werte: readonly string[]): string {
  if (werte.length === 0) return ''
  const teile: string[] = []
  for (const w of werte) {
    const t = w.trim()
    if (t === '') return ''
    teile.push(t)
  }
  return teile.join(SCHLUESSEL_TRENNER)
}

// Die Verknüpfungen dieses Bausteins: je Quelle die Schlüsselpaare und die
// Quelle, mit der sie verbinden („Welche Felder verbinden die beiden
// Datenquellen?"). `partnerId` leer = die Hauptquelle. Auch die
// Erfassungszeile der Tabelle liest das — es ist die EINE Angabe dazu.
//
// Eintraege OHNE Paar bleiben stehen: das Paar ist freiwillig, eine Quelle
// ohne Paar ist eine reine Nachschlagequelle (der Bediener sucht den Satz von
// Hand). In einer schon vorhandenen Datenzeile kann sie nichts anzeigen — es
// gibt keinen Schlüssel, an dem der Satz haengt.
export function verknuepfungenVon(
  el: HTMLElement,
): { quelleId: string; partnerId: string; keyPairs: SchluesselPaar[] }[] {
  return paarListeAusAttribut(el, WEITERE_QUELLEN_ATTR, 'quelleId', { ohnePaareBehalten: true })
    .map((e) => ({ quelleId: e.id, partnerId: e.partnerId, keyPairs: e.keyPairs }))
}

export function macheFeldLeser(el: HTMLElement): FeldLeser {
  const weitere = verknuepfungenVon(el)
  if (weitere.length === 0) return (row, wert) => getField(row, zerlegeBindung(wert).code)

  const sedata = seGlobal().SEDATA
  const quellenListe = seGlobal().FF_DATA_SOURCES
  const nachschlag = new Map<string, Nachschlag>()

  for (const q of weitere) {
    if (q.keyPairs.length === 0) continue
    const source = findRuntimeDataSource(quellenListe, q.quelleId)

    if (!source) continue
    const zeilen = rowsFor(sedata, source.name, source.tableId, source.offenerSatz)
    const nachSchluessel = new Map<string, unknown>()
    for (const zeile of zeilen) {
      const key = schluesselAus(q.keyPairs.map((p) => getField(zeile, p.toField)))
      if (key !== '' && !nachSchluessel.has(key)) nachSchluessel.set(key, zeile)
    }
    nachschlag.set(q.quelleId, {
      nachSchluessel,
      partnerId: q.partnerId,
      hierFelder: q.keyPairs.map((p) => p.fromField),
    })
  }

  // Der zur Zeile gehoerende Satz EINER Quelle. Leere Kennung = die Zeile
  // selbst (Hauptquelle). Sonst wird erst der Satz der PARTNER-Quelle geholt
  // und dessen Felder liefern den Schluessel — so traegt eine Kette
  // (Hauptquelle → 2 → 3) genauso wie der fruehere Stern auf die Hauptquelle.
  // `laufend` bricht einen Kreis ab (2 zeigt auf 3, 3 zurueck auf 2): der
  // Kreis liefert dann keinen Satz statt die Maske haengen zu lassen.
  const satzVon = (quelleId: string, row: unknown, laufend: Set<string>): unknown => {
    if (quelleId === '') return row
    const eintrag = nachschlag.get(quelleId)
    if (!eintrag || laufend.has(quelleId)) return undefined
    laufend.add(quelleId)
    const partner = satzVon(eintrag.partnerId, row, laufend)
    laufend.delete(quelleId)
    if (partner === undefined) return undefined
    const key = schluesselAus(eintrag.hierFelder.map((f) => getField(partner, f)))
    return key === '' ? undefined : eintrag.nachSchluessel.get(key)
  }

  return (row, wert) => {
    const { quelleId, code } = zerlegeBindung(wert)
    if (quelleId === '') return getField(row, code)
    const satz = satzVon(quelleId, row, new Set())
    return satz === undefined ? '' : getField(satz, code)
  }
}
