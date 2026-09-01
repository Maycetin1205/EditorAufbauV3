import { expect, test } from 'vitest'
import { entferneSpalte, fuegeSpalteAn, verschiebeSpalteAn } from './spaltenBearbeiten'
import { SPALTEN_MAX, SPALTEN_MIN, spaltenRaster, type Spalte } from './spalten'

function drei(): Spalte[] {
  return [
    { kennung: 's1', titel: 'A', feld: '1_1' },
    { kennung: 's2', titel: 'B', feld: '2_1', breite: 120 },
    { kennung: 's3', titel: 'C', feld: '3_1' },
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
  const eine = (): Spalte[] => [{ kennung: 's1', titel: 'A', feld: '1_1' }]
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

function feste(...breiten: number[]): Spalte[] {
  return breiten.map((breite, i) => ({ kennung: `s${i + 1}`, titel: `S${i}`, feld: `${i}_1`, breite }))
}

// Der gemeldete Fehler: waren alle Spalten gezogen, war der Rest fuer die
// neue NULL Pixel — sie war angelegt und unsichtbar. Jetzt gibt es keinen
// Rest, sondern Anteile: die neue bekommt den mittleren, die uebrigen ruecken
// anteilig zusammen.
test('die neue Spalte ist sichtbar, auch wenn alle anderen gezogen sind', () => {
  const raus = fuegeSpalteAn(feste(120, 100, 80))
  expect(raus).toHaveLength(4)
  expect(spaltenRaster(raus))
    .toBe('minmax(0, 120fr) minmax(0, 100fr) minmax(0, 80fr) minmax(0, 100fr)')
})

// Was der Bediener gezogen hat, bleibt stehen. Frueher wurde beim Anfuegen
// ALLES neu verteilt.
test('gezogene Breiten bleiben beim Anfuegen unangetastet', () => {
  expect(fuegeSpalteAn(feste(43, 97, 61, 399)).map((s) => s.breite))
    .toEqual([43, 97, 61, 399, undefined])
})

// Spiegelbild: die Verbliebenen behalten ihre Anteile und fuellen die Tabelle
// trotzdem wieder aus. Vorher blieb der Platz der gestrichenen Spalte als
// leere Flaeche am rechten Rand stehen (Nutzer-Befund 2026-08-31).
test('beim Streichen behalten die Verbliebenen ihre Breite', () => {
  let raus: Spalte[] = []
  entferneSpalte(1, () => feste(120, 100, 80), (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['S0', 'S2'])
  expect(raus.map((s) => s.breite)).toEqual([120, 80])
})

// Bis zur Obergrenze klicken: keine Spalte faellt dabei auf den Anteil null.
// Der Fehler fiel nicht beim ersten Klick auf, sondern nach mehreren.
test('auch nach vielen Klicks hat jede Spalte einen Anteil', () => {
  let spalten = feste(120, 100, 80)
  while (spalten.length < SPALTEN_MAX) {
    spalten = fuegeSpalteAn(spalten)
    expect(spaltenRaster(spalten)).not.toMatch(/[^0-9]0fr/)
  }
})

// Verschieben (Ziehen am Spaltenkopf): der ganze Eintrag reist mit (Kennung,
// Titel, Feld, Breite). Ketten und Rechnung zeigen auf die Kennung — sie
// brauchen kein Nachziehen.
test('verschiebeSpalteAn setzt die Spalte an den Ziel-Platz, samt allem Ihren', () => {
  let raus: Spalte[] = []
  verschiebeSpalteAn(0, 2, drei, (l) => { raus = l })
  expect(raus.map((s) => s.kennung)).toEqual(['s2', 's3', 's1'])
  expect(raus.map((s) => s.titel)).toEqual(['B', 'C', 'A'])
  expect(raus[0].breite).toBe(120)

  verschiebeSpalteAn(2, 0, drei, (l) => { raus = l })
  expect(raus.map((s) => s.kennung)).toEqual(['s3', 's1', 's2'])
})

test('derselbe Platz und Unsinns-Plaetze verschieben nichts', () => {
  let gerufen = false
  verschiebeSpalteAn(1, 1, drei, () => { gerufen = true })
  verschiebeSpalteAn(9, 0, drei, () => { gerufen = true })
  verschiebeSpalteAn(-1, 2, drei, () => { gerufen = true })
  expect(gerufen).toBe(false)
})

// Ein Ziel hinter dem Ende landet auf dem letzten Platz — der Zug-Slot
// hinter der letzten Spalte darf nicht ins Leere fallen.
test('ein Ziel hinter dem Ende wird der letzte Platz', () => {
  let raus: Spalte[] = []
  verschiebeSpalteAn(0, 99, drei, (l) => { raus = l })
  expect(raus.map((s) => s.kennung)).toEqual(['s2', 's3', 's1'])
})
