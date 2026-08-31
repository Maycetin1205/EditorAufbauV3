import { expect, test } from 'vitest'
import { entferneSpalte } from './spaltenBearbeiten'
import { SPALTEN_MIN, type Spalte } from './spalten'

function drei(): Spalte[] {
  return [
    { titel: 'A', feld: '1_1' },
    { titel: 'B', feld: '2_1', breite: 120 },
    { titel: 'C', feld: '3_1' },
  ]
}

// Der Punkt der Sache: gestrichen wird die Spalte, die gemeint ist — nicht
// immer die letzte (Nutzer-Befund 2026-08-31). Vorher gab es nur den
// Minus-Knopf, und der nahm hinten weg; wer die mittlere loswerden wollte,
// musste die hintere mit opfern und neu aufbauen.
test('gestrichen wird die genannte Spalte, nicht die letzte', () => {
  let raus: Spalte[] = []
  entferneSpalte(1, drei, (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['A', 'C'])
})

test('die erste geht genauso', () => {
  let raus: Spalte[] = []
  entferneSpalte(0, drei, (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['B', 'C'])
})

// Die gezogenen Breiten haengen am PLATZ. Faellt eine Spalte weg, muss die
// Breite bei IHRER Spalte bleiben — sonst erbt die Nachbarin sie.
test('die gezogene Breite bleibt bei ihrer Spalte', () => {
  let raus: Spalte[] = []
  entferneSpalte(0, drei, (l) => { raus = l })
  expect(raus.map((s) => s.breite)).toEqual([120, undefined])
})

// Eine Tabelle ohne Spalte waere ein leerer Kasten: der Plus-Knopf sitzt an
// der Steuerung, aber es gaebe keinen Kopf mehr, an dem man etwas einstellt.
test('die letzte verbliebene Spalte bleibt stehen', () => {
  const eine = (): Spalte[] => [{ titel: 'A', feld: '1_1' }]
  let gerufen = false
  entferneSpalte(0, eine, () => { gerufen = true })
  expect(gerufen).toBe(false)
  expect(SPALTEN_MIN).toBe(1)
})

test('ein Platz ausserhalb der Liste tut nichts', () => {
  let gerufen = false
  entferneSpalte(7, drei, () => { gerufen = true })
  entferneSpalte(-1, drei, () => { gerufen = true })
  expect(gerufen).toBe(false)
})
