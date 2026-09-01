import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import '../blocks/register'
import { ROOT_ID, ROOT_TYPE } from '../core/blocks/BlockData'
import { type EintragProblem } from '../core/data/ladeProblem'
import { meldungen } from './meldungen'
import { CURRENT_SCHEMA_VERSION } from './migrations'
import { backupKeyFor } from './notfallkopie'
import { loadFromStorage, STORAGE_KEY } from './persistence'
import { VorlagenStore, type VorlagenBauplan } from './VorlagenStore'

// Hier haengt, dass kein Stand des Nutzers stumm verschwindet: was der Editor
// nicht lesen kann, muss er sichern — und was er meldet, muss stimmen.

class SpeicherStub {
  readonly daten = new Map<string, string>()
  schreibsperre = false

  get length(): number { return this.daten.size }
  key(i: number): string | null { return [...this.daten.keys()][i] ?? null }
  getItem(k: string): string | null { return this.daten.get(k) ?? null }

  setItem(k: string, v: string): void {
    if (this.schreibsperre) throw new Error('Speicher voll')
    this.daten.set(k, v)
  }

  removeItem(k: string): void { this.daten.delete(k) }
  clear(): void { this.daten.clear() }
}

let speicher: SpeicherStub

beforeEach(() => {
  speicher = new SpeicherStub()
  vi.stubGlobal('localStorage', speicher)
  meldungen.leere()
})

afterEach(() => {
  vi.unstubAllGlobals()
  meldungen.leere()
})

function kopien(schluessel: string): string[] {
  return [...speicher.daten.keys()].filter((k) => k.startsWith(`${backupKeyFor(schluessel)}_`))
}

function meldungsText(): string {
  return meldungen.liste.map((m) => m.text).join('\n---\n')
}

function wurzelBaum(kinder: string[]): Record<string, unknown> {
  return {
    [ROOT_ID]: { id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: '', childIds: kinder },
  }
}

test('zwei verschiedene Beschaedigungen ergeben zwei Notfallkopien', () => {
  speicher.setItem(STORAGE_KEY, '{kaputt')
  expect(loadFromStorage()).toBeNull()
  speicher.setItem(STORAGE_KEY, '{ganz anders kaputt')
  expect(loadFromStorage()).toBeNull()

  const inhalte = kopien(STORAGE_KEY).map((k) => speicher.getItem(k)).sort()
  expect(inhalte).toEqual(['{ganz anders kaputt', '{kaputt'])
})

test('derselbe beschaedigte Inhalt wird nicht bei jedem Start erneut abgelegt', () => {
  speicher.setItem(STORAGE_KEY, '{kaputt')
  loadFromStorage()
  loadFromStorage()

  expect(kopien(STORAGE_KEY)).toHaveLength(1)
})

test('misslingt die Kopie, behauptet die Meldung nicht sie sei gesichert', () => {
  speicher.setItem(STORAGE_KEY, '{kaputt')
  speicher.schreibsperre = true

  expect(loadFromStorage()).toBeNull()
  expect(kopien(STORAGE_KEY)).toHaveLength(0)
  expect(meldungsText()).not.toContain('gesichert')
  expect(meldungsText()).toContain('NICHT anlegen')
})

test('ein Stand aus einem neueren Editor wird gesichert, gemeldet und nicht geladen', () => {
  const roh = JSON.stringify({
    schemaVersion: CURRENT_SCHEMA_VERSION + 1,
    tree: wurzelBaum([]),
    selectedId: null,
  })
  speicher.setItem(STORAGE_KEY, roh)

  expect(loadFromStorage()).toBeNull()
  expect(speicher.getItem(STORAGE_KEY)).toBe(roh)
  expect(kopien(STORAGE_KEY).map((k) => speicher.getItem(k))).toEqual([roh])
  expect(meldungsText()).toContain('neueren Version')
})

test('Kanban-Karten ohne Zielspalte werden beim Laden gemeldet', () => {
  const tree = {
    ...wurzelBaum(['kb']),
    kb: { id: 'kb', type: 'kanban', props: {}, parentId: ROOT_ID, childIds: ['vor'] },
    vor: { id: 'vor', type: 'kanban-vorlage', props: {}, parentId: 'kb', childIds: ['c1', 'c2'] },
    c1: { id: 'c1', type: 'card', props: {}, parentId: 'vor', childIds: [] },
    c2: { id: 'c2', type: 'card', props: {}, parentId: 'vor', childIds: [] },
  }
  speicher.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: CURRENT_SCHEMA_VERSION, tree, selectedId: null,
  }))

  expect(loadFromStorage()).not.toBeNull()
  expect(meldungsText()).toContain('2 Kanban-Karte(n)')
})

test('eine aufgeloeste Zeile meldet nichts — ihr Inhalt bleibt an Ort und Stelle', () => {
  const tree = {
    ...wurzelBaum(['z1']),
    z1: { id: 'z1', type: 'zeile', props: {}, parentId: ROOT_ID, childIds: ['t1'] },
    t1: { id: 't1', type: 'text', props: {}, parentId: 'z1', childIds: [] },
  }
  speicher.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: CURRENT_SCHEMA_VERSION, tree, selectedId: null,
  }))

  const geladen = loadFromStorage()
  expect(geladen?.tree.t1?.parentId).toBe(ROOT_ID)
  expect(meldungsText()).toBe('')
})

interface TestEintrag { id: string; name?: string }

const TEST_BAUPLAN: VorlagenBauplan<TestEintrag> = {
  schluessel: 'test_vorlagen',
  huelle: 'eintraege',
  klarnameLesen: 'Testvorlagen',
  klarnameSchreiben: 'Testvorlagen',
  pruefe: (roh) => {
    const liste: TestEintrag[] = []
    const probleme: EintragProblem[] = []
    for (const e of Array.isArray(roh) ? roh : []) {
      if (e && typeof e === 'object' && typeof (e as { id?: unknown }).id === 'string') {
        liste.push(e as TestEintrag)
      } else {
        probleme.push({ stelle: 'Eintrag 2', grund: 'die Kennung fehlt' })
      }
    }
    return { liste, probleme }
  },
}

test('uebergangene Vorlagen-Eintraege werden gemeldet und vor dem Kuerzen gesichert', () => {
  const roh = JSON.stringify({ eintraege: [{ id: 'a' }, { name: 'ohne Kennung' }] })
  speicher.setItem(TEST_BAUPLAN.schluessel, roh)

  const store = new VorlagenStore(TEST_BAUPLAN)
  expect(store.list).toHaveLength(1)
  expect(meldungsText()).toContain('die Kennung fehlt')

  const kopie = kopien(TEST_BAUPLAN.schluessel)
  expect(kopie).toHaveLength(1)
  expect(speicher.getItem(kopie[0])).toBe(roh)

  store.add({ name: 'neu' })
  store.speichereJetzt()
  expect(speicher.getItem(TEST_BAUPLAN.schluessel)).not.toBe(roh)
  expect(speicher.getItem(kopie[0])).toBe(roh)
})
