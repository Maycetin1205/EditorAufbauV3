import { expect, test } from 'vitest'
import { AenderungsSpeicher } from './aenderungen'

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

// Was die Kette geschrieben hat, faellt weg — und nur das. Ein leeren() gaebe
// es nicht mehr: nach einem abgebrochenen Lauf bleibt der Rest vorgemerkt.
test('nimmSatzZurueck loescht eine ganze Zeile, die anderen bleiben', () => {
  const speicher = new AenderungsSpeicher()
  speicher.setze('48', 0, 'a')
  speicher.setze('48', 2, 'b')
  speicher.setze('49', 0, 'c')
  expect(speicher.nimmSatzZurueck('48')).toBe(true)
  expect(speicher.anzahl).toBe(1)
  expect(speicher.wert('49', 0)).toBe('c')
  expect(speicher.nimmSatzZurueck('48')).toBe(false)
})

// Die Satznummer steht VOR dem Trenner. Ohne die Grenze traefe '4' auch '48'.
test('nimmSatzZurueck trifft nur die genaue Satznummer', () => {
  const speicher = new AenderungsSpeicher()
  speicher.setze('4', 0, 'a')
  speicher.setze('48', 0, 'b')
  expect(speicher.nimmSatzZurueck('4')).toBe(true)
  expect(speicher.wert('48', 0)).toBe('b')
  expect(speicher.anzahl).toBe(1)
})
