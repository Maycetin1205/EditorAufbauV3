import { beforeEach, expect, test, vi } from 'vitest'

// Die Testumgebung hat kein Fenster; die Bruecke liest nur diese wenigen
// Stuecke. `activeElement: null` heisst „der Bediener tippt gerade nicht" —
// dann verteilt die Bruecke sofort, statt in den Nachlauf zu gehen.
const g = globalThis as unknown as Record<string, unknown>
g.HTMLElement = class {}
g.HTMLInputElement = class {}
g.HTMLTextAreaElement = class {}
g.HTMLSelectElement = class {}
g.document = { activeElement: null, title: 'Pruefmaske' }
g.window = { addEventListener: () => {} }

// Der 300-ms-Poll aus bootSe darf hier nie feuern — er verteilte sonst
// mitten in einem Test ein zweites Mal.
vi.useFakeTimers()

let schiebe: ((raw: unknown) => void) | undefined
g.basisHTML_REGISTER = (cb: (raw: unknown) => void) => { schiebe = cb }

const { bootSe, meldeAnstoss, onSeDaten } = await import('./bridge')

const gerufen: string[] = []
let wirft = false

// Zwei echte Zuhoerer: nur so ist zu sehen, ob ein werfender die uebrigen
// abschneidet. onSeDaten kennt kein Abmelden, darum stehen sie fuer die
// ganze Datei und lesen ihren Zustand je Test.
onSeDaten(() => {
  gerufen.push('A')
  if (wirft) throw new Error('Baustein kaputt')
})
onSeDaten((lieferung) => { gerufen.push(lieferung ? 'B:lieferung' : 'B:anstoss') })

bootSe()

function schub(marke: string): void {
  schiebe?.({ Daten: { Tabellen: { T: [{ wert: marke }] } } })
}

beforeEach(() => {
  gerufen.length = 0
  wirft = false
})

test('ein werfender Zuhoerer schneidet die uebrigen nicht ab', () => {
  wirft = true
  schub('eins')
  expect(gerufen).toEqual(['A', 'B:lieferung'])
})

// Ohne diesen Riegel galt der Stand nach dem Wurf als „schon gezeigt": der
// werfende Baustein bekam denselben Schub nie wieder zu sehen.
test('nach einem Fehler beim Verteilen kommt derselbe Stand noch einmal', () => {
  wirft = true
  schub('zwei')
  wirft = false
  gerufen.length = 0
  schub('zwei')
  expect(gerufen).toEqual(['A', 'B:lieferung'])
})

// Gegenprobe: der Riegel darf den Signatur-Vergleich nicht aushebeln, sonst
// zeichnete die Maske bei jedem der unveraenderten Schuebe neu.
test('ein fehlerfrei verteilter Stand wird nicht noch einmal verteilt', () => {
  schub('drei')
  expect(gerufen).toEqual(['A', 'B:lieferung'])
  gerufen.length = 0
  schub('drei')
  expect(gerufen).toEqual([])
})

// An diesem Schalter haengt, ob eine hinausgeschickte Erfassungszeile aus der
// Maske verschwinden darf (tabelle/seRuntime: vergissGeschriebene).
test('ein Anstoss ist keine Lieferung', () => {
  meldeAnstoss()
  expect(gerufen).toEqual(['A', 'B:anstoss'])
})
