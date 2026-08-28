import { expect, test } from 'vitest'
import { ROOT_ID, type BlockNode } from './BlockData'
import type { BlockDefinition, ListenBindung } from './BlockDefinition'
import { feldWahlenLesen, listeFuerExport, schalterAn } from './listenBindung'
import { registerBlockType } from './blockRegistry'
import { traegtAenderungen } from './treeQuery'

// Eine Liste mit zwei Schaltern: einer aus (Summe), einer an (aenderbar) —
// und beide gelten nur fuer bestimmte Darstellungen.
const BINDUNG: ListenBindung = {
  prop: 'spalten',
  titelKey: 'titel',
  feldKey: 'feld',
  standardTitel: 'Spalte {n}',
  eintragsWahl: {
    key: 'art',
    label: 'Darstellung',
    optionen: [{ wert: 'text', name: 'Text' }, { wert: 'bild', name: 'Bild' }],
    standard: 'text',
  },
  eintragsSchalter: [
    { key: 'summe', label: 'Summe', nurBeiWahl: ['text'] },
    { key: 'aenderbar', label: 'Änderbar', nurBeiWahl: ['text'], standard: true },
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
  expect(schalterAn(AUS, { art: 'text' })).toBe(false)
  expect(schalterAn(AN, { art: 'text' })).toBe(true)
})

// Sonst liesse sich ein Schalter mit Standard „ja" nie ausschalten.
test('ein ausdrueckliches Nein schlaegt den Standard', () => {
  expect(schalterAn(AN, { art: 'text', aenderbar: false })).toBe(false)
  expect(schalterAn(AUS, { art: 'text', summe: true })).toBe(true)
})

// Gespeichert wird nur die Abweichung: sonst stuende in jedem Eintrag
// derselbe Wert und jede Vorgabe-Aenderung ginge an alten Masken vorbei.
test('der Export behaelt nur, was vom Standard abweicht', () => {
  const roh = [
    { titel: 'A', feld: '1_1', art: 'text', summe: false, aenderbar: true },
    { titel: 'B', feld: '2_2', art: 'text', summe: true, aenderbar: false },
  ]
  expect(listeFuerExport(roh, BINDUNG)).toEqual([
    { titel: 'A', feld: '1_1', art: 'text' },
    { titel: 'B', feld: '2_2', art: 'text', summe: true, aenderbar: false },
  ])
})

// Ein Schalter, den die gewaehlte Darstellung gar nicht zeigt, hat auch
// nichts im Export zu suchen.
test('ein verborgener Schalter faellt aus dem Export', () => {
  const roh = [{ titel: 'A', feld: '1_1', art: 'bild', aenderbar: false, summe: true }]
  expect(listeFuerExport(roh, BINDUNG)).toEqual([{ titel: 'A', feld: '1_1', art: 'bild' }])
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

test('eine gebundene Spalte traegt Aenderungen, auch ohne gesetzten Schalter', () => {
  expect(traegtAenderungen(knoten([{ titel: 'A', feld: '1_1', art: 'text' }]))).toBe(true)
})

test('ohne Feld gibt es nichts zu schreiben', () => {
  expect(traegtAenderungen(knoten([{ titel: 'A', feld: '', art: 'text' }]))).toBe(false)
})

test('ausgeschaltet oder verborgen traegt die Spalte nichts', () => {
  expect(traegtAenderungen(knoten([{ feld: '1_1', art: 'text', aenderbar: false }]))).toBe(false)
  expect(traegtAenderungen(knoten([{ feld: '1_1', art: 'bild' }]))).toBe(false)
})
