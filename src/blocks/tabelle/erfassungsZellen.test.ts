import { expect, test } from 'vitest'
import type { SchluesselPaar } from '../../core/data/sourceLinks'
import { passendeSaetze, zellenzielVon, zielIn, type ErfassungsUmfeld } from './erfassungsZellen'
import { ART_TEXT } from './spaltenArten'
import type { Spalte } from './spalten'

function spalte(titel: string, feld: string): Spalte {
  return { titel, feld, art: ART_TEXT }
}

const paare: readonly SchluesselPaar[] = [{ fromField: '18_25', toField: 'artnr' }]

const kandidaten = [
  { artnr: 'ART1', name: 'Kabel' },
  { artnr: 'ART2', name: 'Stecker' },
  { artnr: '', name: 'Ohne Nummer' },
]

// Der Unterschied, an dem die ganze Erfassungszeile haengt: der Bediener darf
// die Spalten in beliebiger Reihenfolge fuellen (unbekannt = keine
// Einschraenkung), aber „kein Partner" darf keine Zeile verschwinden lassen.
test('unbekannter Schluessel (undefined) schraenkt nicht ein', () => {
  expect(passendeSaetze(paare, () => undefined, kandidaten)).toEqual(kandidaten)
})

test('bekannt-leerer Schluessel ("") trifft nichts', () => {
  expect(passendeSaetze(paare, () => '', kandidaten)).toEqual([])
})

test('bekannter Schluessel laesst die passenden Saetze uebrig', () => {
  expect(passendeSaetze(paare, () => 'ART1', kandidaten)).toEqual([kandidaten[0]])
})

test('ohne Paare bleibt alles stehen', () => {
  expect(passendeSaetze([], () => 'ART1', kandidaten)).toEqual(kandidaten)
})

test('zwei Paare gelten UND-verknuepft', () => {
  const zwei: SchluesselPaar[] = [
    { fromField: '18_25', toField: 'artnr' },
    { fromField: '45_60', toField: 'name' },
  ]
  const werte: Record<string, string> = { '18_25': 'ART1', '45_60': 'Stecker' }
  expect(passendeSaetze(zwei, (feld) => werte[feld], kandidaten)).toEqual([])
  werte['45_60'] = 'Kabel'
  expect(passendeSaetze(zwei, (feld) => werte[feld], kandidaten)).toEqual([kandidaten[0]])
})

// Ein Paar, dessen Wert unbekannt ist, faellt aus der Pruefung — das andere
// schraenkt weiter ein. Sonst muesste der Bediener von links nach rechts
// arbeiten.
test('ein unbekanntes Paar setzt die anderen nicht ausser Kraft', () => {
  const zwei: SchluesselPaar[] = [
    { fromField: '18_25', toField: 'artnr' },
    { fromField: '45_60', toField: 'name' },
  ]
  expect(passendeSaetze(zwei, (feld) => (feld === '18_25' ? 'ART2' : undefined), kandidaten))
    .toEqual([kandidaten[1]])
})

test('Zellenart: frei, eigen oder verknuepft', () => {
  expect(zellenzielVon(spalte('Frei', ''), 'q-pos').art).toBe('frei')
  expect(zellenzielVon(spalte('Menge', '164_8'), 'q-pos')).toEqual({
    art: 'eigen', quelleId: 'q-pos', code: '164_8',
  })
  expect(zellenzielVon(spalte('Artikel', 'q-art::18_25'), 'q-pos')).toEqual({
    art: 'verknuepft', quelleId: 'q-art', code: '18_25',
  })
})

test('zielIn liest die Spalte aus dem Umfeld', () => {
  const umfeld: ErfassungsUmfeld = {
    spalten: [spalte('Artikel', 'q-art::18_25')],
    quelleId: 'q-pos',
    paareZu: () => [],
    partnerVon: () => '',
  }
  expect(zielIn(umfeld, 0).quelleId).toBe('q-art')
  expect(zielIn(umfeld, 9).art).toBe('frei')
})
