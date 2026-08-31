import { expect, test } from 'vitest'
import { alsZahl } from './sortierung'

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
