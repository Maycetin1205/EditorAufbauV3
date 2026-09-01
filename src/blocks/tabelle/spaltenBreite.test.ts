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

// Das Raster selbst: kein Pixelmass, nur Anteile. Eine Spalte ohne eigene
// Zahl bekommt das Mittel der gesetzten — 120 und 80 ergeben 100.
test('gezogene Spalten werden Anteile, ungezogene bekommen das Mittel', () => {
  const spalten = coerceSpalten([
    { titel: 'A', feld: '1_1', breite: 120 },
    { titel: 'B', feld: '2_1' },
    { titel: 'C', feld: '3_1', breite: 80 },
  ])
  expect(spaltenRaster(spalten)).toBe('minmax(0, 120fr) minmax(0, 100fr) minmax(0, 80fr)')
})

test('ohne gezogene Breite teilen alle gleichmaessig', () => {
  const spalten = coerceSpalten([{ titel: 'A', feld: '1_1' }, { titel: 'B', feld: '2_1' }])
  expect(spaltenRaster(spalten)).toBe('minmax(0, 1fr) minmax(0, 1fr)')
})

// Feste Pixel summierten sich nur zufaellig auf die Tabellenbreite; die
// Differenz stand rechts als leere Flaeche (Nutzer-Befund 2026-08-31).
test('im Raster steht nie ein Pixelmass', () => {
  const spalten = coerceSpalten([
    { titel: 'A', feld: '1_1', breite: 120 },
    { titel: 'B', feld: '2_1', breite: 80 },
  ])
  expect(spaltenRaster(spalten)).not.toContain('px')
})

// Der fluechtige Stand (Zug im Gange, oder in der Maske von Hand gesetzt)
// schlaegt den gespeicherten.
test('die gezogene Breite schlaegt die gespeicherte', () => {
  const spalten = coerceSpalten([
    { titel: 'A', feld: '1_1', breite: 120 },
    { titel: 'B', feld: '2_1', breite: 60 },
  ])
  expect(spaltenRaster(spalten, (i) => (i === 0 ? 200 : undefined)))
    .toBe('minmax(0, 200fr) minmax(0, 60fr)')
})

// Und er gilt auch fuer eine Spalte, die noch GAR KEINE gespeicherte Breite
// traegt. Genau dort wurde er verworfen: beim Ziehen bewegte sich nichts, und
// erst das Loslassen liess die Spalte springen (Nutzer-Befund 2026-08-31).
test('der fluechtige Stand gilt auch ohne gespeicherte Breite', () => {
  const spalten = coerceSpalten([{ titel: 'A', feld: '1_1' }, { titel: 'B', feld: '2_1' }])
  expect(spaltenRaster(spalten, (i) => (i === 0 ? 300 : 200)))
    .toBe('minmax(0, 300fr) minmax(0, 200fr)')
})
