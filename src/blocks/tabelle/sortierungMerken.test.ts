import { expect, test } from 'vitest'
import { deuteSortierung } from './sortierungMerken'

// Der gemerkte Stand kommt aus dem Browser-Speicher — also von aussen. Was
// dort steht, kann alt, fremd oder Unfug sein; die Tabelle darf daran nicht
// scheitern, sondern faellt auf "unsortiert" zurueck.

test('ein sauber gemerkter Stand kommt zurueck', () => {
  expect(deuteSortierung({ kennung: 'sp3', auf: true })).toEqual({ kennung: 'sp3', auf: true })
  expect(deuteSortierung({ kennung: 'sp3', auf: false })).toEqual({ kennung: 'sp3', auf: false })
})

test('ohne Kennung gilt nichts — sonst zeigte die Sortierung ins Leere', () => {
  expect(deuteSortierung({ auf: true })).toBeNull()
  expect(deuteSortierung({ kennung: '', auf: true })).toBeNull()
  expect(deuteSortierung({ kennung: '   ', auf: true })).toBeNull()
  expect(deuteSortierung({ kennung: 7, auf: true })).toBeNull()
})

test('Unfug im Speicher wirft die Tabelle nicht um', () => {
  expect(deuteSortierung(null)).toBeNull()
  expect(deuteSortierung('kaputt')).toBeNull()
  expect(deuteSortierung(42)).toBeNull()
  expect(deuteSortierung([])).toBeNull()
})

// Aufsteigend ist der Normalfall: fehlt die Richtung (alter Stand, von Hand
// geschrieben), wird aufwaerts sortiert statt gar nicht.
test('fehlende Richtung heisst aufsteigend', () => {
  expect(deuteSortierung({ kennung: 'sp1' })).toEqual({ kennung: 'sp1', auf: true })
})

test('Leerzeichen um die Kennung stoeren nicht', () => {
  expect(deuteSortierung({ kennung: '  sp2  ', auf: false }))
    .toEqual({ kennung: 'sp2', auf: false })
})
