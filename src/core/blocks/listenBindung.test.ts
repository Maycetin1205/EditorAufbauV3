import { expect, test } from 'vitest'
import { ROOT_ID, type BlockNode } from './BlockData'
import type { BlockDefinition, ListenBindung } from './BlockDefinition'
import { feldWahlenLesen, listeFuerExport, schalterAn, schalterFuer } from './listenBindung'
import { getBlockDefinition, registerBlockType } from './blockRegistry'
import { traegtAenderungen } from './treeQuery'

// Eine Liste mit zwei Schaltern: einer aus (Summe), einer an (aenderbar).
const BINDUNG: ListenBindung = {
  prop: 'spalten',
  titelKey: 'titel',
  feldKey: 'feld',
  standardTitel: 'Spalte {n}',
  eintragsSchalter: [
    { key: 'summe', label: 'Summe' },
    { key: 'aenderbar', label: 'Änderbar', standard: true },
  ],
}

const AUS = BINDUNG.eintragsSchalter![0]
const AN = BINDUNG.eintragsSchalter![1]

// Das zweite Feld je Eintrag. EINE Leseart fuer Formular und Export — laesen
// die verschieden, stuende das Fuellfeld im Editor und fehlte in der Maske.
const MIT_FELDWAHL: ListenBindung = {
  ...BINDUNG,
  eintragsFeldWahl: [{ key: 'fuellFeld', label: 'Füllfeld', nurFremdeQuellen: true }],
}

test('feldWahlenLesen liefert je Deklaration einen Wert, leer wo nichts steht', () => {
  expect(feldWahlenLesen(MIT_FELDWAHL, { fuellFeld: 'q-art::bez' })
    .map((f) => [f.wahl.key, f.wert])).toEqual([['fuellFeld', 'q-art::bez']])
  expect(feldWahlenLesen(MIT_FELDWAHL, {}).map((f) => f.wert)).toEqual([''])

  // Was keine Zeichenkette ist, ist keine Bindung — sonst reiste eine Zahl aus
  // einer alten Maske als Feldcode weiter.
  expect(feldWahlenLesen(MIT_FELDWAHL, { fuellFeld: 7 }).map((f) => f.wert)).toEqual([''])
})

test('ohne Deklaration gibt es keine Feldwahl', () => {
  expect(feldWahlenLesen(BINDUNG, { fuellFeld: 'q-art::bez' })).toEqual([])
})

test('ohne Angabe gilt der Standard des Schalters', () => {
  expect(schalterAn(AUS, {})).toBe(false)
  expect(schalterAn(AN, {})).toBe(true)
})

// Sonst liesse sich ein Schalter mit Standard „ja" nie ausschalten.
test('ein ausdrueckliches Nein schlaegt den Standard', () => {
  expect(schalterAn(AN, { aenderbar: false })).toBe(false)
  expect(schalterAn(AUS, { summe: true })).toBe(true)
})

// Gespeichert wird nur die Abweichung: sonst stuende in jedem Eintrag
// derselbe Wert und jede Vorgabe-Aenderung ginge an alten Masken vorbei.
test('der Export behaelt nur, was vom Standard abweicht', () => {
  const roh = [
    { titel: 'A', feld: '1_1', summe: false, aenderbar: true },
    { titel: 'B', feld: '2_2', summe: true, aenderbar: false },
  ]
  expect(listeFuerExport(roh, BINDUNG)).toEqual([
    { titel: 'A', feld: '1_1' },
    { titel: 'B', feld: '2_2', summe: true, aenderbar: false },
  ])
})

// traegtAenderungen entscheidet, ob der Export den Baustein ueberhaupt
// adressierbar macht (data-ff-block-id). Ohne das findet die Kette ihn nicht.
const TYP = 'test-liste'
registerBlockType({
  type: TYP,
  tagName: 'test-liste',
  displayName: 'Testliste',
  category: 'anzeige',
  defaultProps: {},
  customProperties: [],
  acceptsChildren: false,
  resizableWidth: false,
  resizableHeight: false,
  listenBindung: BINDUNG,
  aenderungsSchluessel: 'aenderbar',
} as BlockDefinition)

function knoten(spalten: unknown[]): BlockNode {
  return { id: ROOT_ID, type: TYP, props: { spalten }, parentId: null, childIds: [] }
}

// Ein Feld aus einer HILFSQUELLE ist kein Schreibziel: die Vormerkung liefe
// ueber die Satznummer der Hauptquellen-Zeile, die Kette schriebe also den
// Stammtext in die Belegposition. Die Regel haengt am Spaltenfeld — dieselbe
// Spalte mit einem Fuellfeld bleibt aenderbar, s. blocks/tabelle/spalten.test.
const NUR_EIGEN: ListenBindung = {
  ...BINDUNG,
  eintragsSchalter: [BINDUNG.eintragsSchalter![0], { ...AN, nurEigeneQuelle: true }],
}

test('ein Feld aus fremder Quelle nimmt den Schalter aus der Auswahl', () => {
  const eigen = { titel: 'A', feld: '45_60', art: 'text' }
  const fremd = { titel: 'A', feld: 'q-art::bez', art: 'text' }
  expect(schalterFuer(NUR_EIGEN, eigen).map((s) => s.key)).toEqual(['summe', 'aenderbar'])
  expect(schalterFuer(NUR_EIGEN, fremd).map((s) => s.key)).toEqual(['summe'])
})

// Verborgen heisst auch: nicht im Export. Sonst stuende in der Maskendatei ein
// Schalterwert, den niemand mehr einstellen kann.
// Geprueft wird mit `false`: ein `true` faellt ohnehin weg, weil es dem
// Standard entspricht — der Fall bewiese die Regel also nicht.
test('der verborgene Schalter faellt aus dem Export', () => {
  const roh = [{ titel: 'A', feld: 'q-art::bez', aenderbar: false }]
  expect(listeFuerExport(roh, NUR_EIGEN)).toEqual([{ titel: 'A', feld: 'q-art::bez' }])

  // Dieselbe Spalte auf der eigenen Quelle behaelt ihn.
  const eigen = [{ titel: 'A', feld: '45_60', aenderbar: false }]
  expect(listeFuerExport(eigen, NUR_EIGEN)).toEqual(eigen)
})

test('eine gebundene Spalte traegt Aenderungen, auch ohne gesetzten Schalter', () => {
  expect(traegtAenderungen(knoten([{ titel: 'A', feld: '1_1' }]))).toBe(true)
})

test('ohne Feld gibt es nichts zu schreiben', () => {
  expect(traegtAenderungen(knoten([{ titel: 'A', feld: '' }]))).toBe(false)
})

test('ausgeschaltet traegt die Spalte nichts', () => {
  expect(traegtAenderungen(knoten([{ feld: '1_1', aenderbar: false }]))).toBe(false)
})

// Der Export darf den Baustein wegen einer Hilfsquellen-Spalte nicht
// adressierbar machen: es gaebe nichts zu schreiben.
const TYP_EIGEN = 'test-liste-eigen'
registerBlockType({
  ...(getBlockDefinition(TYP) as BlockDefinition),
  type: TYP_EIGEN,
  listenBindung: NUR_EIGEN,
} as BlockDefinition)

test('eine Spalte auf fremder Quelle traegt keine Aenderungen', () => {
  const node = (feld: string): BlockNode => ({
    id: ROOT_ID, type: TYP_EIGEN, props: { spalten: [{ feld }] },
    parentId: null, childIds: [],
  })
  expect(traegtAenderungen(node('45_60'))).toBe(true)
  expect(traegtAenderungen(node('q-art::bez'))).toBe(false)
})
