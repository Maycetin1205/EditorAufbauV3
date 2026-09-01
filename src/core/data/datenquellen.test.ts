import { expect, test } from 'vitest'
import { mitEindeutigenNamen, pruefeDatenquellen, type DataSource } from './dataSources'

function quelle(id: string, name: string): DataSource {
  return { id, name, kind: 'idb', idbId: 'IDB0001', fields: [] }
}

// SoftEngine legt die Zeilen unter dem Namen ab, die Laufzeit sucht sie ueber
// ihn und nimmt den ersten Treffer: zwei gleich benannte Quellen zeigten in
// der fertigen Maske stumm dieselben Daten.
test('gleiche Namen werden maschinell eindeutig', () => {
  const namen = mitEindeutigenNamen([
    quelle('a', 'Tiere'), quelle('b', 'Tiere'), quelle('c', 'Tiere'),
  ]).map((s) => s.name)
  expect(namen).toEqual(['Tiere', 'Tiere 2', 'Tiere 3'])
})

// Gross/klein und Leerzeichen aussen zaehlen nicht — SoftEngine vergleicht den
// Alias getrimmt und klein geschrieben (softengine/data.ts, sameAlias).
test('anders geschriebene gleiche Namen gelten als doppelt', () => {
  const namen = mitEindeutigenNamen([quelle('a', 'Tiere'), quelle('b', ' tiere ')])
    .map((s) => s.name)
  expect(namen).toEqual(['Tiere', 'tiere 2'])
})

test('verschiedene Namen bleiben unangetastet', () => {
  const liste = [quelle('a', 'Tiere'), quelle('b', 'Artikel')]
  expect(mitEindeutigenNamen(liste)).toEqual(liste)
})

// Arten ohne feste Tabellen-ID tragen sie als eigene Kennung. Fehlt sie, ging
// bisher ein SEFILELOOP-Eintrag mit ID:"" hinaus — SoftEngine findet dazu
// nichts und bricht laut Kontrakt die ganze Loop-Liste ab.
test('eine IDB-Quelle ohne Kennung wird gemeldet statt still bestellt', () => {
  const { liste, probleme } = pruefeDatenquellen([
    { id: 'a', name: 'Ohne', kind: 'idb', fields: [] },
  ])
  expect(liste).toEqual([])
  expect(probleme).toHaveLength(1)
  expect(probleme[0].grund).toContain('Tabellen-Kennung')
})

// Gegenprobe: Arten MIT fester Tabellen-ID brauchen keine eigene Kennung.
test('eine Stammquelle ohne Kennung bleibt gueltig', () => {
  const { liste, probleme } = pruefeDatenquellen([
    { id: 'a', name: 'Artikel', kind: 'artikelstamm', fields: [] },
  ])
  expect(liste.map((s) => s.id)).toEqual(['a'])
  expect(probleme).toEqual([])
})
