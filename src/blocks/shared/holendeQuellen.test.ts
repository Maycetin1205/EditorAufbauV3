import { beforeEach, expect, test } from 'vitest'
import {
  letzteWahlDurchBedienung,
  setzeAuswahl,
  setzeAuswahlZurueck,
  waehleAuswahl,
} from './auswahl'
import {
  darfLaden,
  defsMitSatzWahl,
  gewaehlteZeileDerQuelle,
  setzeLadeSpurZurueck,
} from './holendeQuellen'
import '../formfeld/FormFeldBlock'
import '../tabelle/TabelleBlock'

beforeEach(() => {
  setzeAuswahlZurueck()
  setzeLadeSpurZurueck()
})

// Die Testumgebung hat kein Fenster — die Wurzel ist genau dafuer
// uebergebbar (s. gewaehlteZeileDerQuelle). Die Attrappen koennen nur, was
// die Funktion liest: tagName und getAttribute.
function fakeEl(tag: string, attrs: Record<string, string>): Element {
  return {
    tagName: tag.toUpperCase(),
    getAttribute: (name: string) => attrs[name] ?? null,
  } as unknown as Element
}

function fakeWurzel(...els: Element[]): ParentNode {
  return { querySelectorAll: () => els } as unknown as ParentNode
}

// Der Befund vom 2026-09-01: ein TEXT-Formularfeld trug noch eine alte
// Nachschlage-Quelle als Attribut und galt darum als Geber der Beleg-Quelle —
// seine veroeffentlichte Zeile (aus einer ANDEREN Quelle) fuetterte Relation
// 69 mit Datenmuell, im Halbsekundentakt. Die Quelle eines Gebers haengt am
// FELDTYP, nicht pauschal am Tag.
test('ein Text-Feld mit uebriger Nachschlage-Quelle ist NICHT deren Geber', () => {
  const feld = fakeEl('ff-formfeld', {
    'data-ff-block-id': 'f1',
    source: 'q-adr',
    nachschlagquelle: 'q-bel',
  })
  const wurzel = fakeWurzel(feld)
  setzeAuswahl('f1', { wert: 'x' })

  const defs = defsMitSatzWahl()
  expect(gewaehlteZeileDerQuelle('q-bel', defs, wurzel)).toBeUndefined()
  expect(gewaehlteZeileDerQuelle('q-adr', defs, wurzel)).toEqual({ wert: 'x' })
})

test('das Nachschlage-Feld gibt weiterhin ueber seine Nachschlage-Quelle', () => {
  const feld = fakeEl('ff-formfeld', {
    'data-ff-block-id': 'f2',
    fieldtype: 'nachschlagen',
    source: 'q-adr',
    nachschlagquelle: 'q-bel',
  })
  const wurzel = fakeWurzel(feld)
  setzeAuswahl('f2', { wert: 'y' })

  const defs = defsMitSatzWahl()
  expect(gewaehlteZeileDerQuelle('q-bel', defs, wurzel)).toEqual({ wert: 'y' })
  expect(gewaehlteZeileDerQuelle('q-adr', defs, wurzel)).toBeUndefined()
})

test('die Tabelle gibt wie bisher ueber ihr source-Attribut', () => {
  const tab = fakeEl('ff-tabelle', { 'data-ff-block-id': 't1', source: 'q-bel' })
  const wurzel = fakeWurzel(tab)
  setzeAuswahl('t1', { satz: '4' })

  expect(gewaehlteZeileDerQuelle('q-bel', defsMitSatzWahl(), wurzel)).toEqual({ satz: '4' })
})

// Die Bremse: eine Bedienung laedt immer, eine Programm-Meldung jeden Abdruck
// nur einmal. Kommt derselbe Abdruck ohne Bedienung wieder, ist das der Kreis
// (Laden -> Hydrieren -> anderer Geber gewinnt -> Laden -> ...) und es wird
// still nichts mehr geladen, bis der Bediener wieder klickt.
test('die Bremse stoppt Kreis-Feuer, laesst Bedienung aber immer durch', () => {
  expect(darfLaden('q', 'A', true)).toBe(true)

  expect(darfLaden('q', 'A', true)).toBe(false)

  // Hydrier-Kette waehlt eine andere Zeile: einmal laden ist erlaubt ...
  expect(darfLaden('q', 'B', false)).toBe(true)
  // ... aber der Rueckfall auf die schon geladene Zeile ist der Kreis.
  expect(darfLaden('q', 'A', false)).toBe(false)
  expect(darfLaden('q', 'B', false)).toBe(false)

  // Ein echter Klick setzt die Spur zurueck und laedt.
  expect(darfLaden('q', 'A', true)).toBe(true)
})

test('waehleAuswahl gilt als Bedienung, setzeAuswahl nicht', () => {
  waehleAuswahl('g1', { a: 1 })
  expect(letzteWahlDurchBedienung()).toBe(true)
  setzeAuswahl('g2', { b: 2 })
  expect(letzteWahlDurchBedienung()).toBe(false)
})
