import { expect, test } from 'vitest'
import type { DataSource } from '../core/data/dataSources'
import { baueSevariablen } from './sevariablen'

interface Bestellung {
  VAR?: { ID: string; FELDER: string }[]
  SEFILELOOP: { ALIAS: string; ID: string; KOPFSATZ_INDEX?: string; FELDER: string }[]
  ERPAPICALL: unknown[]
}

function bestellung(used: readonly DataSource[]): Bestellung {
  return JSON.parse(baueSevariablen(used, new Map(), new Map())) as Bestellung
}

function felder(codes: readonly string[]): DataSource['fields'] {
  return codes.map((code) => ({ code, label: code }))
}

const artikel: DataSource = {
  id: 'q-art', name: 'ART', kind: 'artikelstamm', fields: felder(['18_25', '45_60']),
}

const positionen: DataSource = {
  id: 'q-pos',
  name: 'POS',
  kind: 'belegposition',
  kopfsatzIndex: 'BEL_0_11',
  fields: felder(['18_25', '164_8']),
}

const belegkopf: DataSource = {
  id: 'q-bel',
  name: 'BEL',
  kind: 'beleg',
  lieferung: 'offenerSatz',
  fields: felder(['2_1', '3_8']),
}

// Der harte Beleg dahinter: steht ein Kopfsatz-Loop VORNE, liefert SoftEngine
// aus KEINER Quelle Daten (A/B-Echttest 2026-08-11, in CLAUDE.md festgehalten).
test('Kopfsatz-Loops stehen zwangsweise zuletzt', () => {
  const zuerstPos = bestellung([positionen, artikel])
  expect(zuerstPos.SEFILELOOP.map((e) => e.ALIAS)).toEqual(['ART', 'POS'])

  // Auch die andere Eingabereihenfolge muss dieselbe Datei ergeben.
  const zuerstArt = bestellung([artikel, positionen])
  expect(zuerstArt.SEFILELOOP.map((e) => e.ALIAS)).toEqual(['ART', 'POS'])
})

test('der Kopfsatz-Loop traegt seinen KOPFSATZ_INDEX', () => {
  const pos = bestellung([positionen]).SEFILELOOP.find((e) => e.ALIAS === 'POS')
  expect(pos?.KOPFSATZ_INDEX).toBe('BEL_0_11')
  expect(pos?.ID).toBe('POS')
})

test('offener Satz wird nicht als Loop bestellt, sondern im VAR-Abschnitt', () => {
  const raus = bestellung([belegkopf])
  expect(raus.SEFILELOOP).toEqual([])
  expect(raus.VAR).toEqual([{ ID: 'BEL', FELDER: '2_1,3_8' }])
})

// varZusammen: Kopfsatz-Index und offener Satz zeigen auf DIESELBE Tabelle
// (POS haengt an BEL_0_11, der Belegkopf IST BEL). Zwei VAR-Eintraege mit
// derselben ID waeren eine doppelte Bestellung.
test('Kopfsatz und offener Satz derselben Tabelle werden EIN VAR-Eintrag', () => {
  const raus = bestellung([positionen, belegkopf])
  expect(raus.VAR).toEqual([{ ID: 'BEL', FELDER: '0_11,2_1,3_8' }])
})

test('dasselbe Feld zweimal bestellt wird einmal geschrieben', () => {
  const belegMitSatzschluessel: DataSource = {
    ...belegkopf,
    fields: felder(['0_11', '2_1']),
  }
  const raus = bestellung([positionen, belegMitSatzschluessel])
  expect(raus.VAR).toEqual([{ ID: 'BEL', FELDER: '0_11,2_1' }])
})

test('ohne VAR-Bedarf fehlt der VAR-Abschnitt ganz', () => {
  expect(bestellung([artikel]).VAR).toBeUndefined()
})
