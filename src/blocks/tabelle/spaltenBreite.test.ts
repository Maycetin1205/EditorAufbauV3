import { expect, test } from 'vitest'
import { coerceSpalten, spaltenRaster, SPALTEN_MIN_BREITE } from './spalten'
import { verteileZug } from './spaltenBreite'

// Der Kern des Zugs: was die linke Spalte gewinnt, gibt die rechte ab. Nur so
// bleibt der Platz gleich, den sich alle uebrigen Spalten teilen — sonst
// rechnet das Raster bei jedem Zug ALLE Spalten neu, obwohl der Bediener nur
// eine Linie angefasst hat (Nutzer-Befund 2026-08-31).
test('die Summe der beiden Nachbarn bleibt gleich', () => {
  const { links, rechts } = verteileZug(200, 300, 40)
  expect(links).toBe(240)
  expect(rechts).toBe(260)
  expect(links + rechts).toBe(500)
})

test('nach links gezogen dreht es sich um', () => {
  const { links, rechts } = verteileZug(200, 300, -50)
  expect(links).toBe(150)
  expect(rechts).toBe(350)
})

// Weiter als bis zur Mindestbreite der Nachbarin geht es nicht: die Linie
// bleibt stehen, statt eine Spalte auf null zu druecken.
test('der Zug stoppt an der Mindestbreite der Nachbarin', () => {
  const { links, rechts } = verteileZug(200, 60, 500)
  expect(rechts).toBe(SPALTEN_MIN_BREITE)
  expect(links).toBe(200 + (60 - SPALTEN_MIN_BREITE))
})

test('und an der eigenen Mindestbreite', () => {
  const { links, rechts } = verteileZug(60, 200, -500)
  expect(links).toBe(SPALTEN_MIN_BREITE)
  expect(rechts).toBe(200 + (60 - SPALTEN_MIN_BREITE))
})

// Beide schon am Anschlag: nichts bewegt sich, und keine Spalte rutscht unter
// die Mindestbreite.
test('sind beide am Anschlag, bleibt alles stehen', () => {
  expect(verteileZug(SPALTEN_MIN_BREITE, SPALTEN_MIN_BREITE, 80))
    .toEqual({ links: SPALTEN_MIN_BREITE, rechts: SPALTEN_MIN_BREITE })
})

// Das Raster selbst: gezogene Spalten stehen fest, alle anderen teilen sich
// den Rest zu gleichen Teilen.
test('nur gezogene Spalten bekommen feste Pixel', () => {
  const spalten = coerceSpalten([
    { titel: 'A', feld: '1_1', breite: 120 },
    { titel: 'B', feld: '2_1' },
    { titel: 'C', feld: '3_1', breite: 80 },
  ])
  expect(spaltenRaster(spalten)).toBe('120px minmax(0, 1fr) 80px')
})

// Der fluechtige Stand (Zug im Gange, oder in der Maske von Hand gesetzt)
// schlaegt den gespeicherten.
test('die gezogene Breite schlaegt die gespeicherte', () => {
  const spalten = coerceSpalten([{ titel: 'A', feld: '1_1', breite: 120 }])
  expect(spaltenRaster(spalten, (i) => (i === 0 ? 200 : undefined))).toBe('200px')
})
