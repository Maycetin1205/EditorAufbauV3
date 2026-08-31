import { expect, test } from 'vitest'
import { entferneSpalte, fuegeSpalteAn } from './spaltenBearbeiten'
import { SPALTEN_MIN, SPALTEN_MIN_BREITE, type Spalte } from './spalten'

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

function dreiFeste(): Spalte[] {
  return [
    { titel: 'A', feld: '1_1', breite: 120 },
    { titel: 'B', feld: '2_1', breite: 100 },
    { titel: 'C', feld: '3_1', breite: 80 },
  ]
}

const summe = (l: readonly Spalte[]): number =>
  l.reduce((s, sp) => s + (sp.breite ?? 0), 0)

// Der gemeldete Fehler: sobald jede Linie einmal gezogen ist, tragen alle
// Spalten feste Pixel und fuellen die Tabelle genau aus. Die neue bekam einen
// Anteil an einem Rest, den es nicht gab — null Pixel breit, unsichtbar. Der
// Plus-Knopf sah kaputt aus, obwohl er die Spalte angelegt hatte.
test('eine neue Spalte ist sichtbar, auch wenn alle anderen fest sind', () => {
  const raus = fuegeSpalteAn(dreiFeste())
  expect(raus).toHaveLength(4)
  expect(raus[3].breite).toBeGreaterThanOrEqual(SPALTEN_MIN_BREITE)
})

// Dieselbe Regel wie beim Ziehen einer Linie: was die eine bekommt, geben die
// anderen ab. Waechst die Summe stattdessen, laeuft die Tabelle aus ihrem
// Kasten und die hinteren Spalten werden abgeschnitten.
test('die Gesamtbreite bleibt beim Anfuegen gleich', () => {
  expect(summe(fuegeSpalteAn(dreiFeste()))).toBe(summe(dreiFeste()))
})

// Waechst noch irgendeine Spalte mit, holt sich die neue ihren Platz von
// allein — dann darf nichts umgerechnet werden, sonst verloere der Bediener
// seine Handarbeit ohne Grund.
test('mit einer mitwachsenden Spalte bleibt alles, wie es war', () => {
  const raus = fuegeSpalteAn(drei())
  expect(raus.map((s) => s.breite)).toEqual([undefined, 120, undefined, undefined])
})

// Stehen alle schon auf der Mindestbreite, ist nichts mehr zu holen. Dann
// lieber die gezogenen Breiten aufgeben als eine Spalte anlegen, die niemand
// sieht.
test('ohne Platz geben alle ihre gezogene Breite ab', () => {
  const eng: Spalte[] = [
    { titel: 'A', feld: '1_1', breite: SPALTEN_MIN_BREITE },
    { titel: 'B', feld: '2_1', breite: SPALTEN_MIN_BREITE },
    { titel: 'C', feld: '3_1', breite: SPALTEN_MIN_BREITE },
  ]
  expect(fuegeSpalteAn(eng).every((s) => s.breite === undefined)).toBe(true)
})

// Spiegelbild: sonst bliebe der Platz der gestrichenen Spalte als Luecke am
// rechten Rand stehen.
test('beim Streichen nehmen die Verbliebenen den Platz auf', () => {
  let raus: Spalte[] = []
  entferneSpalte(1, dreiFeste, (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['A', 'C'])
  expect(summe(raus)).toBe(summe(dreiFeste()))
})
