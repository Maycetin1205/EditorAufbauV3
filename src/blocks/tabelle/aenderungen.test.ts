import { expect, test } from 'vitest'
import { AenderungsSpeicher, vormerkText } from './aenderungen'

test('geschluesselt wird nach Satznummer, nicht nach Platz in der Liste', () => {
  const speicher = new AenderungsSpeicher()
  speicher.setze('48', 1, 'neu')
  speicher.setze('49', 1, 'anders')
  expect(speicher.wert('48', 1)).toBe('neu')
  expect(speicher.wert('49', 1)).toBe('anders')
  expect(speicher.anzahl).toBe(2)
})

// Ohne Satznummer gibt es kein Aendern: ein Platz-Schluessel zeigte nach dem
// Sortieren auf die falsche Zeile.
test('ohne Satznummer wird nichts vorgemerkt', () => {
  const speicher = new AenderungsSpeicher()
  expect(speicher.setze('', 0, 'neu')).toBe(false)
  expect(speicher.wert('', 0)).toBeUndefined()
  expect(speicher.anzahl).toBe(0)
})

test('derselbe Wert nochmal geschrieben meldet keine Aenderung', () => {
  const speicher = new AenderungsSpeicher()
  expect(speicher.setze('48', 2, 'x')).toBe(true)
  expect(speicher.setze('48', 2, 'x')).toBe(false)
  expect(speicher.anzahl).toBe(1)
})

// Der Weg zurueck: TabelleBlock.verlasseZelle ruft nimmZurueck, sobald der
// getippte Wert wieder der Wert der Zeile ist. Die Vormerkung VERSCHWINDET
// dann — sie wird nicht auf den alten Text gesetzt.
test('Ruecknahme loescht die Vormerkung, nicht nur ihren Wert', () => {
  const speicher = new AenderungsSpeicher()
  speicher.setze('48', 2, 'getippt')
  expect(speicher.nimmZurueck('48', 2)).toBe(true)
  expect(speicher.wert('48', 2)).toBeUndefined()
  expect(speicher.anzahl).toBe(0)
  expect(speicher.nimmZurueck('48', 2)).toBe(false)
})

test('proSatz buendelt je Zeile, in der Reihenfolge der ersten Aenderung', () => {
  const speicher = new AenderungsSpeicher()
  speicher.setze('49', 0, 'a')
  speicher.setze('48', 1, 'b')
  speicher.setze('49', 3, 'c')
  expect(speicher.proSatz()).toEqual([
    { satz: '49', aenderungen: [
      { satz: '49', spalte: 0, wert: 'a' },
      { satz: '49', spalte: 3, wert: 'c' },
    ] },
    { satz: '48', aenderungen: [{ satz: '48', spalte: 1, wert: 'b' }] },
  ])
})

test('leeren meldet nur beim ersten Mal etwas', () => {
  const speicher = new AenderungsSpeicher()
  speicher.setze('48', 0, 'a')
  expect(speicher.leeren()).toBe(true)
  expect(speicher.leeren()).toBe(false)
})

test('vormerkText: eine Stelle fuer Fusszeile und Knopf', () => {
  expect(vormerkText(0)).toBe('')
  expect(vormerkText(1)).toBe('1 Änderung vorgemerkt')
  expect(vormerkText(3)).toBe('3 Änderungen vorgemerkt')
  expect(vormerkText(0, 1)).toBe('1 Löschung vorgemerkt')
  expect(vormerkText(3, 2)).toBe('3 Änderungen, 2 Löschungen vorgemerkt')
})
