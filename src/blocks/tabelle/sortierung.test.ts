import { expect, test } from 'vitest'
import { alsZahl, deuteSortierung } from './sortierung'

// Regression Faktor 1000: der Leser hielt jeden Punkt mit drei Ziffern
// dahinter fuer einen Tausenderpunkt — aus '0.750' wurde 750. Auf eine
// alleinstehende Null folgt aber nie eine Tausendergruppe.
test('fuehrende Null: Punkt ist Dezimalzeichen, kein Tausenderpunkt', () => {
  expect(alsZahl('0.750')).toBe(0.75)
  expect(alsZahl('0.75')).toBe(0.75)
  expect(alsZahl('0.7500')).toBe(0.75)
})

test('die drei ERP-Schreibweisen derselben Zahl lesen sich gleich', () => {
  expect(alsZahl('1999.00')).toBe(1999)
  expect(alsZahl('1999,00')).toBe(1999)
  expect(alsZahl('1.999,00')).toBe(1999)
})

test('echte Tausendergruppen bleiben Tausender', () => {
  expect(alsZahl('1.500')).toBe(1500)
  expect(alsZahl('12.345.678')).toBe(12345678)
  expect(alsZahl('-1.500')).toBe(-1500)
})

test('was keine Zahl ist, bleibt keine', () => {
  expect(alsZahl('')).toBeNull()
  expect(alsZahl('5 ml')).toBeNull()
  expect(alsZahl('1.99')).toBe(1.99)
  expect(alsZahl('0,5')).toBe(0.5)
})

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
