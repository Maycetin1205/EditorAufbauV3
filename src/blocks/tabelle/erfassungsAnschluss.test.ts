import { expect, test } from 'vitest'
import { ErfassungsAnschluss } from './erfassungsAnschluss'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import { ART_TEXT } from './spaltenArten'
import type { Spalte } from './spalten'

function spalte(titel: string, feld: string): Spalte {
  return { titel, feld, art: ART_TEXT }
}

const UMFELD: ErfassungsUmfeld = {
  spalten: [spalte('Artikel', '18_25'), spalte('Menge', '164_8')],
  quelleId: 'q-pos',
  paareZu: () => [],
  partnerVon: () => '',
}

// Eine Zeile tippen und mit Enter ablegen — der Weg, den jede Erfassung geht.
function lege(a: ErfassungsAnschluss, artikel: string, menge: string): void {
  a.lauf.tippe(0, artikel)
  a.lauf.tippe(1, menge)
  a.erfasse(UMFELD)
}

function werte(a: ErfassungsAnschluss): string[][] {
  return a.zeilen.map((z) => [...z])
}

test('Zurueckholen nimmt die Zeile aus der Liste und legt sie in die Erfassung', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')

  expect(a.zurueckholen(UMFELD, 0)).toBe(true)
  expect(werte(a)).toEqual([['ART2', '2']])
  expect(a.lauf.wertVon(UMFELD, 0)).toBe('ART1')
  expect(a.lauf.wertVon(UMFELD, 1)).toBe('1')
})

// Sonst spraenge eine korrigierte Zeile ans Ende der Liste, und der
// Ketten-Bericht koennte sie nicht wiedererkennen.
test('die korrigierte Zeile geht an ihren Platz zurueck und behaelt ihre Kennung', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')
  const kennungen = [...a.schluessel]

  a.zurueckholen(UMFELD, 0)
  a.lauf.tippe(1, '9')
  a.erfasse(UMFELD)

  expect(werte(a)).toEqual([['ART1', '9'], ['ART2', '2']])
  expect([...a.schluessel]).toEqual(kennungen)
})

// Ohne das schriebe der Knopf ausgerechnet die Zeile nicht, die der Bediener
// vor Augen hat — und der Zaehler zaehlte sie nicht mit.
test('die Kette sieht die oben stehende Zeile mit ihren LEBENDEN Werten', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')

  a.zurueckholen(UMFELD, 0)
  a.lauf.tippe(1, '9')

  expect(a.zeilen.length).toBe(1)
  expect(a.vormerkungen(UMFELD).map((v) => [...v.werte]))
    .toEqual([['ART1', '9'], ['ART2', '2']])
})

// Genau der Weg zur LEERZEILE im ERP: frueher liess sich eine erfasste Zeile
// an Ort und Stelle leer tippen und blieb trotzdem vorgemerkt.
test('eine leer geraeumte Rueckholung ist eine Wegnahme, keine Leerzeile', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')

  a.zurueckholen(UMFELD, 0)
  a.lauf.tippe(0, '')
  a.lauf.tippe(1, '')
  expect(a.erfasse(UMFELD)).toBe(true)

  expect(werte(a)).toEqual([])
  expect(a.vormerkungen(UMFELD)).toEqual([])
})

// Sonst ginge die erste beim Klick auf die zweite verloren.
test('das Zurueckholen legt eine schon oben stehende Zeile erst ab', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')

  a.zurueckholen(UMFELD, 0)
  a.zurueckholen(UMFELD, 0)

  expect(werte(a)).toEqual([['ART1', '1']])
  expect(a.lauf.wertVon(UMFELD, 0)).toBe('ART2')
})

// Bleibt sie oben stehen, tippte der Bediener an einer Zeile weiter, die es
// im ERP schon gibt.
test('eine geschriebene Zeile wird auch oben ausgetragen', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  const kennung = a.schluessel[0]

  a.zurueckholen(UMFELD, 0)
  expect(a.austragen([kennung])).toBe(true)
  expect(a.vormerkungen(UMFELD)).toEqual([])
  expect(a.lauf.wertVon(UMFELD, 0)).toBe('')
})

test('eine ganz leere Erfassungszeile wird weiterhin nicht abgelegt', () => {
  const a = new ErfassungsAnschluss()
  expect(a.erfasse(UMFELD)).toBe(false)
  expect(werte(a)).toEqual([])
})
