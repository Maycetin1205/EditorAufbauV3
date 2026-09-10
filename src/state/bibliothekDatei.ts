// Die Bibliothek als eigene Datei: Datenquellen und Relationen ohne Baustein-Baum.
import { pruefeDatenquellen, type DataSource } from '../core/data/dataSources'
import {
  BEREICH_QUELLEN,
  BEREICH_RELATIONEN,
  mitBereich,
  type EintragProblem,
  type LadeProblem,
} from '../core/data/ladeProblem'
import { pruefeRelationsVorlagen, type RelationTemplate } from '../core/data/relations'
import { downloadFile } from '../lib/dateiDownload'
import { dataSourceStore } from './DataSourceStore'
import type { Editor } from './Editor'
import { ersteAbweichung, keinVerlust } from './ladeKette'
import { meldungen } from './meldungen'
import { relationStore } from './RelationStore'

export const BIBLIOTHEK_DATEI_ART = 'aufbau-editor-bibliothek'

const BIBLIOTHEK_DATEI_VERSION = 1

export interface BibliothekInhalt {
  datenquellen: DataSource[]
  relationen: RelationTemplate[]
}

export type BibliothekErgebnis =
  | { ok: true; inhalt: BibliothekInhalt }
  | { ok: false; grund: string; probleme: readonly LadeProblem[] }

// Aeltere Masken speicherten in der Hol-Relation eine Feldliste mit. Die
// errechnet der Export aus den benutzten Feldern, ohne sie geht nichts verloren.
export function ohneErrechnetes(eintrag: unknown): unknown {
  if (!eintrag || typeof eintrag !== 'object') return eintrag
  const e = eintrag as Record<string, unknown>
  if (!e.ladeRelation || typeof e.ladeRelation !== 'object') return eintrag
  const lade = { ...(e.ladeRelation as Record<string, unknown>) }
  delete lade.zusatzFelder
  return { ...e, ladeRelation: lade }
}

export function bibliothekPruefen<T>(
  roh: unknown,
  pruefe: (raw: unknown) => { liste: T[]; probleme: EintragProblem[] },
  klarname: string,
  bereinige: (eintrag: unknown) => unknown = (eintrag) => eintrag,
): { ok: true; liste: T[] } | { ok: false; grund: string; probleme: LadeProblem[] } {
  if (!Array.isArray(roh)) {
    return {
      ok: false,
      grund: `Die Datei ist beschädigt: der Abschnitt „${klarname}" fehlt oder ist unlesbar.`,
      probleme: [{ bereich: klarname, stelle: '', grund: 'der Abschnitt fehlt oder ist unlesbar' }],
    }
  }
  const bereinigt = roh.map(bereinige)
  const { liste, probleme } = pruefe(bereinigt)
  if (!keinVerlust(bereinigt, liste)) {
    const stelle = ersteAbweichung(bereinigt, liste)
    return {
      ok: false,
      grund: `Die Datei ist beschädigt: im Abschnitt „${klarname}" stimmt eine Angabe nicht: `
        + `${stelle}. Sie wird nicht geladen, damit nicht unbemerkt Teile deiner Maske verlorengehen.`,
      probleme: probleme.length > 0
        ? mitBereich(klarname, probleme)
        : [{ bereich: klarname, stelle: '', grund: stelle }],
    }
  }
  return { ok: true, liste }
}

// Der Grund, darunter die Fundstellen; mehr als zehn wuerden den Balken fluten.
export function problemText(grund: string, probleme: readonly LadeProblem[]): string {
  const liste = probleme.slice(0, 10)
    .map((p) => `• ${p.bereich}${p.stelle === '' ? '' : ` (${p.stelle})`}: ${p.grund}`)
  const rest = probleme.length - liste.length
  return [
    grund,
    ...(liste.length > 0 ? ['', ...liste] : []),
    ...(rest > 0 ? [`… und ${rest} weitere.`] : []),
  ].join('\n')
}

function packeBibliothek(inhalt: BibliothekInhalt): string {
  return JSON.stringify(
    {
      art: BIBLIOTHEK_DATEI_ART,
      dateiVersion: BIBLIOTHEK_DATEI_VERSION,
      datenquellen: inhalt.datenquellen,
      relationen: inhalt.relationen,
    },
    null,
    2,
  ) + '\n'
}

export function speichereBibliothekAlsDatei(): void {
  const text = packeBibliothek({
    datenquellen: [...dataSourceStore.list],
    relationen: [...relationStore.list],
  })
  const heute = new Date().toISOString().slice(0, 10)
  downloadFile(`aufbau-bibliothek-${heute}.json`, text, 'application/json')
}

function abgelehnt(grund: string): BibliothekErgebnis {
  return { ok: false, grund, probleme: [] }
}

export function packeBibliothekAus(text: string): BibliothekErgebnis {
  let roh: unknown
  try {
    roh = JSON.parse(text)
  } catch {
    return abgelehnt('Die Datei ist keine gültige JSON-Datei und konnte nicht gelesen werden.')
  }
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) {
    return abgelehnt('Die Datei enthält keine Bibliothek.')
  }
  const o = roh as Record<string, unknown>

  if (o.art !== BIBLIOTHEK_DATEI_ART) {
    return abgelehnt(
      'Das ist keine Bibliotheksdatei des Aufbau-Editors. Eine ganze Maske lädt '
      + '„Maske laden…" in den weiteren Aktionen.',
    )
  }

  const dateiVersion = typeof o.dateiVersion === 'number' ? o.dateiVersion : 0
  if (dateiVersion > BIBLIOTHEK_DATEI_VERSION) {
    return abgelehnt(
      'Diese Datei stammt aus einer neueren Version des Editors und kann hier '
      + 'nicht geladen werden.',
    )
  }
  if (dateiVersion < 1) {
    return abgelehnt('Die Datei ist beschädigt: die Formatangabe fehlt.')
  }

  const quellen = bibliothekPruefen(
    o.datenquellen, pruefeDatenquellen, BEREICH_QUELLEN, ohneErrechnetes,
  )
  if (!quellen.ok) return { ok: false, grund: quellen.grund, probleme: quellen.probleme }
  const relationen = bibliothekPruefen(o.relationen, pruefeRelationsVorlagen, BEREICH_RELATIONEN)
  if (!relationen.ok) return { ok: false, grund: relationen.grund, probleme: relationen.probleme }

  return { ok: true, inhalt: { datenquellen: quellen.liste, relationen: relationen.liste } }
}

// Der Vergleich muss die Reihenfolge der Angaben uebergehen: derselbe Eintrag
// kommt aus der Datei anders sortiert als aus dem Formular.
function stabil(wert: unknown): string {
  return JSON.stringify(wert, (_schluessel, w: unknown) => {
    if (!w || typeof w !== 'object' || Array.isArray(w)) return w
    const o = w as Record<string, unknown>
    return Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]))
  })
}

// Laden ergaenzt und aktualisiert nach Kennung; es loescht nie. Was im Editor
// steht und nicht in der Datei steht, bleibt unberuehrt. Aendert sich nichts,
// kommt die alte Liste unveraendert zurueck.
export function fuegeEin<T extends { id: string }>(
  alt: readonly T[],
  ausDatei: readonly T[],
): { liste: readonly T[]; neu: number; ersetzt: number } {
  const liste = [...alt]
  let neu = 0
  let ersetzt = 0
  for (const eintrag of ausDatei) {
    const at = liste.findIndex((e) => e.id === eintrag.id)
    if (at < 0) {
      liste.push(eintrag)
      neu++
      continue
    }
    if (stabil(liste[at]) === stabil(eintrag)) continue
    liste[at] = eintrag
    ersetzt++
  }
  return { liste: neu + ersetzt === 0 ? alt : liste, neu, ersetzt }
}

function bestandsSatz(klarname: string, z: { neu: number; ersetzt: number }): string {
  if (z.neu === 0 && z.ersetzt === 0) return `• ${klarname}: unverändert`
  const teile: string[] = []
  if (z.neu > 0) teile.push(`${z.neu} neu`)
  if (z.ersetzt > 0) teile.push(`${z.ersetzt} aktualisiert`)
  return `• ${klarname}: ${teile.join(', ')}`
}

// Ohne Rueckfrage: das Laden ist EIN Undo-Schritt, Strg+Z nimmt beide
// Bibliotheken zusammen zurueck.
export async function ladeBibliothekAusDatei(editor: Editor, datei: File): Promise<void> {
  let text: string
  try {
    text = await datei.text()
  } catch {
    meldungen.melde('Die Datei konnte nicht gelesen werden.')
    return
  }
  const ergebnis = packeBibliothekAus(text)
  if (!ergebnis.ok) {
    meldungen.melde(problemText(ergebnis.grund, ergebnis.probleme))
    return
  }

  const quellen = fuegeEin(dataSourceStore.list, ergebnis.inhalt.datenquellen)
  const relationen = fuegeEin(relationStore.list, ergebnis.inhalt.relationen)
  if (quellen.liste === dataSourceStore.list && relationen.liste === relationStore.list) {
    meldungen.melde('Alles aus der Bibliotheksdatei war schon da — nichts geändert.', 'hinweis')
    return
  }

  editor.transaktion(() => {
    if (quellen.liste !== dataSourceStore.list) dataSourceStore.ersetzeAlle(quellen.liste)
    if (relationen.liste !== relationStore.list) relationStore.ersetzeAlle(relationen.liste)
  })

  meldungen.melde([
    'Bibliothek geladen.',
    bestandsSatz(BEREICH_QUELLEN, quellen),
    bestandsSatz(BEREICH_RELATIONEN, relationen),
    'Nichts wurde gelöscht; Strg+Z nimmt das Laden zurück.',
  ].join('\n'), 'hinweis')
}
