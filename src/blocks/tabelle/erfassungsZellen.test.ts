import { expect, test } from 'vitest'
import type { SchluesselPaar } from '../../core/data/sourceLinks'
import {
  fensterSpaltenIn,
  passendeSaetze,
  zellenzielVon,
  zielIn,
  type ErfassungsUmfeld,
} from './erfassungsZellen'
import type { Spalte } from './spalten'

function spalte(titel: string, feld: string): Spalte {
  return { kennung: '', titel, feld }
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

// Der Kern des Fuellfeldes: dieselbe Spalte zeigt in der gebuchten Zeile die
// Belegposition (`feld`) und holt sich beim ERFASSEN den Wert aus dem
// Artikelstamm (`fuellFeld`). Vorher ging nur eines von beiden.
test('das Fuellfeld fuehrt beim Erfassen, nicht das Spaltenfeld', () => {
  const beide: Spalte = {
    kennung: '',
    titel: 'Bezeichnung',
    feld: '45_60',
    fuellFeld: 'q-art::bez',
  }
  expect(zellenzielVon(beide, 'q-pos')).toEqual({
    art: 'verknuepft', quelleId: 'q-art', code: 'bez',
  })
})

test('ohne Fuellfeld bleibt es beim Spaltenfeld', () => {
  const nurSpalte: Spalte = { kennung: '', titel: 'Menge', feld: '164_8', fuellFeld: '' }
  expect(zellenzielVon(nurSpalte, 'q-pos')).toEqual({
    art: 'eigen', quelleId: 'q-pos', code: '164_8',
  })
})

// Eine Spalte ohne Spaltenfeld ist zulaessig: sie schreibt nichts, hilft aber
// beim Aussuchen (die Bezeichnung, an der der Bediener den Artikel erkennt).
test('ein Fuellfeld allein genuegt der Erfassungszeile', () => {
  const nurFuell: Spalte = { kennung: '', titel: 'Suche', feld: '', fuellFeld: 'q-art::bez' }
  expect(zellenzielVon(nurFuell, 'q-pos').art).toBe('verknuepft')
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

// Wer aus einem Stamm mit tausenden Saetzen auswaehlt, braucht im Fenster
// mehr als zwei Spalten — und zwar genau die, die in seiner Tabelle stehen.
const FENSTER_UMFELD: ErfassungsUmfeld = {
  spalten: [
    spalte('Artikelnummer', 'q-art::artnr'),
    spalte('Bezeichnung', 'q-art::name'),
    { kennung: '', titel: 'Preis', feld: 'q-art::preis' },
    spalte('Menge', '164_8'),
    spalte('Tierart', 'q-tier::rasse'),
  ],
  quelleId: 'q-pos',
  paareZu: () => [],
  partnerVon: () => '',
}

test('das Fenster zeigt alle Spalten derselben Quelle, in Tabellenreihenfolge', () => {
  // Fenster-Spalten sind fluechtige Anzeige ohne Kennung — nichts adressiert sie.
  expect(fensterSpaltenIn(FENSTER_UMFELD, 0)).toEqual([
    { kennung: '', titel: 'Artikelnummer', feld: 'artnr' },
    { kennung: '', titel: 'Bezeichnung', feld: 'name' },
    { kennung: '', titel: 'Preis', feld: 'preis' },
  ])
})

// Die Menge gehoert der eigenen Quelle, die Tierart einer anderen: beide
// haben im Artikel-Fenster nichts verloren.
test('fremde und eigene Spalten bleiben draussen', () => {
  const felder = fensterSpaltenIn(FENSTER_UMFELD, 1).map((s) => s.feld)
  expect(felder).toEqual(['artnr', 'name', 'preis'])
  expect(fensterSpaltenIn(FENSTER_UMFELD, 4).map((s) => s.feld)).toEqual(['rasse'])
})

// In die eigene Quelle wird getippt, nicht ausgesucht.
test('eine Spalte der eigenen Quelle hat kein Fenster', () => {
  expect(fensterSpaltenIn(FENSTER_UMFELD, 3)).toEqual([])
})
