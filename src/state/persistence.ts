import { type BlockTree } from '../core/blocks/BlockData'
import { baumAusRohdaten } from './ladeKette'
import { meldungen } from './meldungen'
import { CURRENT_SCHEMA_VERSION, DEMO_CLEANUP_BEFORE_SCHEMA } from './migrations'
import { type EntfernGrund } from './migrationenRoh'
import {
  backupKeyFor,
  kopieSatz,
  legeKopieAn,
  meldeSpeicherPanne,
  merkeSpeicherErfolg,
  sichereUnlesbaren,
} from './notfallkopie'

export const STORAGE_KEY = 'aufbau_editor_mvp_v1'

export const SAVE_DEBOUNCE_MS = 500

try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('aufbau_editor_verknuepfungen_v1')
    localStorage.removeItem(backupKeyFor('aufbau_editor_verknuepfungen_v1'))
  }
} catch {
  // Speicher gesperrt — dann bleibt der tote Schlüssel eben liegen.
}

interface PersistedState {
  schemaVersion: number
  tree: BlockTree
  selectedId: string | null
}

export interface LoadedState {
  tree: BlockTree
  selectedId: string | null

  resaveNeeded: boolean
}

function backupUnreadableState(raw: string): void {
  sichereUnlesbaren(STORAGE_KEY, raw, 'Editor-Stand')
}

export function meldeVerworfeneTypen(verworfen: Map<string, number>): void {
  if (verworfen.size === 0) return
  const anzahl = [...verworfen.values()].reduce((a, b) => a + b, 0)
  const typen = [...verworfen.keys()].map((t) => `"${t}"`).join(', ')
  meldungen.melde(
    `Beim Laden entfernt: ${anzahl} Baustein(e) der nicht mehr vorhandenen Typen ${typen}.\n`
    + 'Diese Bausteintypen gibt es im Editor nicht mehr. Ihr Inhalt wurde — '
    + 'falls vorhanden — an ihrer Stelle eingegliedert; der Rest der Maske ist unverändert.',
  )
}

// Eine Aktionskette, die beim Laden die Pruefung nicht besteht, faellt weg —
// der Baustein bleibt stehen und tut nichts mehr. Das muss man erfahren, denn
// der naechste Auto-Speicher schreibt den gekuerzten Stand fest.
export function meldeVerloreneKetten(anzahl: number): void {
  if (anzahl === 0) return
  meldungen.melde(
    `Beim Laden verworfen: ${anzahl} Aktionskette(n), die nicht mehr lesbar war(en).\n`
    + 'Die betroffenen Bausteine stehen noch in der Maske, ihre Kette ist leer — '
    + 'bitte neu anlegen. Der Rest der Maske ist unverändert.',
  )
}

// Gemeldet wird nur, wo wirklich etwas fehlt: die aufgelösten Hüllen
// (Kanban-Vorlage, Zeile) haben ihre Kinder an Ort und Stelle behalten —
// dafür einen Verlust zu melden wäre die nächste Unwahrheit.
const ENTFERN_TEXT: Partial<Record<EntfernGrund, (anzahl: number) => string>> = {
  'karte-ohne-spalte': (n) => `${n} Kanban-Karte(n), deren Spalte im Stand fehlte`,
  'knopf-in-tabelle': (n) => `${n} Knopf/Knöpfe, die in einer Tabelle lagen`,
}

export function meldeAbsichtlichEntfernte(
  entfernt: ReadonlyMap<string, EntfernGrund>,
): void {
  const gezaehlt = new Map<EntfernGrund, number>()
  for (const grund of entfernt.values()) {
    gezaehlt.set(grund, (gezaehlt.get(grund) ?? 0) + 1)
  }
  const teile: string[] = []
  for (const [grund, anzahl] of gezaehlt) {
    const text = ENTFERN_TEXT[grund]
    if (text) teile.push(text(anzahl))
  }
  if (teile.length === 0) return
  meldungen.melde(
    `Beim Laden entfernt: ${teile.join('; ')}.\n`
    + 'Diese Bausteine gibt es an dieser Stelle nicht mehr; der Rest der Maske '
    + 'ist unverändert.',
  )
}

// Ein Stand aus einem neueren Editor wird weder gelesen noch beim Start
// zurückgeschrieben: das hiesige Verständnis würde ihn beim ersten Speichern
// auf den alten Aufbau eindampfen.
function meldeZukunftsStand(raw: string, gespeichert: number): void {
  const backupKey = legeKopieAn(STORAGE_KEY, raw)
  meldungen.melde(
    'Der im Browser gespeicherte Stand stammt aus einer neueren Version des '
    + `Editors (Aufbau-Version ${gespeichert}, dieser Editor kennt `
    + `${CURRENT_SCHEMA_VERSION}).\n`
    + 'Er wurde NICHT geladen und beim Start NICHT verändert. '
    + `${kopieSatz(STORAGE_KEY, backupKey)}\n`
    + 'Der Editor startet leer. Sobald hier gearbeitet wird, überschreibt das '
    + 'den alten Stand — die Notfallkopie bleibt.',
  )
}

export function loadFromStorage(): LoadedState | null {
  let raw: string | null = null
  try {
    if (typeof localStorage !== 'undefined') raw = localStorage.getItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Browser-Speicher nicht lesbar — der Editor startet leer.', err)
    return null
  }
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as {
      schemaVersion?: unknown
      tree?: unknown
      blocks?: unknown
      selectedId?: unknown
    }

    const schemaVersion = typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : 1
    if (schemaVersion > CURRENT_SCHEMA_VERSION) {
      meldeZukunftsStand(raw, schemaVersion)
      return null
    }
    const baum = baumAusRohdaten(
      { ...parsed, schemaVersion },
      schemaVersion < DEMO_CLEANUP_BEFORE_SCHEMA,
    )
    if (!baum) {
      backupUnreadableState(raw)
      return null
    }
    meldeVerworfeneTypen(baum.verworfen)
    meldeAbsichtlichEntfernte(baum.absichtlichEntfernt)
    meldeVerloreneKetten(baum.verloreneKetten)
    return {
      tree: baum.tree,
      selectedId: baum.selectedId,
      resaveNeeded: baum.schemaAdvanced,
    }
  } catch (error) {
    console.error('Editor: gespeicherter Stand nicht lesbar', error)
    backupUnreadableState(raw)
    return null
  }
}

export function persistState(tree: BlockTree, selectedId: string | null): void {
  try {
    const state: PersistedState = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tree,
      selectedId,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    merkeSpeicherErfolg(STORAGE_KEY)
  } catch (err) {
    meldeSpeicherPanne(STORAGE_KEY, 'Maske', err)
  }
}
