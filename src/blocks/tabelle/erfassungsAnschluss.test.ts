import { expect, test } from 'vitest'
import { ErfassungsAnschluss } from './erfassungsAnschluss'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import type { Spalte } from './spalten'

function spalte(titel: string, feld: string): Spalte {
  return { kennung: '', titel, feld }
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
test('die oben stehende Zeile geht beim Schreiben markiert an ihren Platz', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  const kennung = a.schluessel[0]

  a.zurueckholen(UMFELD, 0)
  expect(a.markiereGeschrieben(UMFELD, [kennung])).toBe(true)
  expect(a.vormerkungen(UMFELD)).toEqual([])
  expect(a.lauf.wertVon(UMFELD, 0)).toBe('')
  // Und sie ist trotzdem noch zu sehen — genau darum geht es.
  expect(werte(a)).toEqual([['ART1', '1']])
  expect(a.istGeschrieben(0)).toBe(true)
})

// Der eigentliche Datenverlust: frueher flog die Zeile hier aus der Liste,
// und blieb die Lieferung aus, war die Eingabe spurlos weg.
test('eine geschriebene Zeile bleibt sichtbar und zaehlt nicht mehr mit', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')

  expect(a.markiereGeschrieben(UMFELD, [a.schluessel[0] ?? ''])).toBe(true)
  expect(werte(a)).toEqual([['ART1', '1'], ['ART2', '2']])
  expect(a.vormerkungen(UMFELD).map((v) => [...v.werte])).toEqual([['ART2', '2']])
  expect(a.istGeschrieben(0)).toBe(true)
  expect(a.istGeschrieben(1)).toBe(false)
})

// Ein zweites Enter wuerde sie ein zweites Mal hinausschicken.
test('eine geschriebene Zeile laesst sich nicht zurueckholen', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  a.markiereGeschrieben(UMFELD, [a.schluessel[0] ?? ''])

  expect(a.zurueckholen(UMFELD, 0)).toBe(false)
  expect(a.lauf.wertVon(UMFELD, 0)).toBe('')
})

// Erst die echte Lieferung raeumt weg; ohne sie bleibt alles stehen.
test('vergissGeschriebene nimmt nur die geschriebenen Zeilen', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')
  a.markiereGeschrieben(UMFELD, [a.schluessel[0] ?? ''])

  expect(a.vergissGeschriebene()).toBe(true)
  expect(werte(a)).toEqual([['ART2', '2']])
  expect(a.vergissGeschriebene()).toBe(false)
})

// Die zur Korrektur oben stehende Zeile haelt ihren Platz auch dann, wenn vor
// ihr schon geschriebene Zeilen stehen.
test('die oben stehende Zeile behaelt ihren Platz zwischen geschriebenen', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')
  lege(a, 'ART3', '3')
  a.markiereGeschrieben(UMFELD, [a.schluessel[0] ?? ''])

  a.zurueckholen(UMFELD, 1)
  expect(a.vormerkungen(UMFELD).map((v) => [...v.werte])).toEqual([
    ['ART2', '2'],
    ['ART3', '3'],
  ])
})

test('eine ganz leere Erfassungszeile wird weiterhin nicht abgelegt', () => {
  const a = new ErfassungsAnschluss()
  expect(a.erfasse(UMFELD)).toBe(false)
  expect(werte(a)).toEqual([])
})

// Die Tipp-Zeile zeichnet AN ORT UND STELLE der geoeffneten Zeile
// (korrekturPlatz), nicht unten — nichts springt, nichts sortiert sich um
// (Nutzer 2026-09-01). Enter legt sie dort wieder ab, und die Tipp-Zeile
// sitzt wieder unten (null).
test('korrekturPlatz nennt den Platz der geoeffneten Zeile', () => {
  const a = new ErfassungsAnschluss()
  lege(a, 'ART1', '1')
  lege(a, 'ART2', '2')
  lege(a, 'ART3', '3')
  expect(a.korrekturPlatz).toBeNull()

  a.zurueckholen(UMFELD, 1)
  expect(a.korrekturPlatz).toBe(1)

  a.erfasse(UMFELD)
  expect(a.korrekturPlatz).toBeNull()
  expect(werte(a)).toEqual([['ART1', '1'], ['ART2', '2'], ['ART3', '3']])
})
