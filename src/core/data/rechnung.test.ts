import { expect, test } from 'vitest'
import {
  leereRechnung,
  loeseRechnung,
  platzText,
  rechnungAlsAttribut,
  rechnungVonAttribut,
  rundeWert,
  zahlStreng,
  type PlatzKey,
  type PlatzWert,
} from './rechnung'

function rechnung() {
  const r = leereRechnung()
  for (const k of ['menge', 'anzahl', 'dosis', 'tage'] as const) {
    r[k].spalte = k
  }
  return r
}

const ALLE = new Set<PlatzKey>(['menge', 'anzahl', 'dosis', 'tage'])

function werte(teil: Partial<Record<PlatzKey, PlatzWert>>): Record<PlatzKey, PlatzWert> {
  return { menge: null, anzahl: null, dosis: null, tage: null, ...teil }
}

// Der Praxisfall aus den Kundendaten: Baytril 5 % (IDB-Satz ART00005/Rind),
// Behandlungsmenge 5, Behandlungsdauer 5. 5000 ml Vorrat -> 200 Tiere.
// In der IDB steht bei diesem Artikel auch ein Koerpergewicht (50) — es
// zaehlt seit 2026-09-01 NICHT mehr mit, die Dosis gilt pro Tier.
test('Anzahl Tiere ist die Luecke und wird aufgerundet', () => {
  const geloest = loeseRechnung(rechnung(), werte({ menge: 5000, dosis: 5, tage: 5 }), ALLE)
  expect(geloest).toEqual({ platz: 'anzahl', wert: 200 })
})

test('krumme Anzahl wird aufgerundet, damit kein Tier leer ausgeht', () => {
  const geloest = loeseRechnung(rechnung(), werte({ menge: 100, dosis: 3, tage: 5 }), ALLE)
  expect(geloest).toEqual({ platz: 'anzahl', wert: 7 })
})

test('Abgabemenge ist die Luecke', () => {
  const geloest = loeseRechnung(rechnung(), werte({ anzahl: 12, dosis: 5, tage: 5 }), ALLE)
  expect(geloest).toEqual({ platz: 'menge', wert: 300 })
})

// Nicht belegte Plaetze fallen auf 1: eine Tabelle ohne Behandlungsdauer
// rechnet Menge = Anzahl x Dosis.
test('unbelegte Plaetze zaehlen als Faktor 1', () => {
  const r = rechnung()
  r.tage.spalte = ''
  const ohneTage = new Set<PlatzKey>(['menge', 'anzahl', 'dosis'])
  expect(loeseRechnung(r, werte({ menge: 60, dosis: 5 }), ohneTage))
    .toEqual({ platz: 'anzahl', wert: 12 })
})

test('zwei Luecken: nichts wird gerechnet', () => {
  expect(loeseRechnung(rechnung(), werte({ dosis: 5 }), ALLE)).toBeNull()
})

test('alle Plaetze voll: nichts wird ueberschrieben', () => {
  expect(loeseRechnung(rechnung(), werte({
    menge: 5000, anzahl: 200, dosis: 5, tage: 5,
  }), ALLE)).toBeNull()
})

test('unlesbarer Wert: die Rechnung schweigt statt zu raten', () => {
  expect(loeseRechnung(rechnung(), werte({
    menge: 5000, dosis: 'fehler', tage: 5,
  }), ALLE)).toBeNull()
})

test('Division durch null: keine Antwort', () => {
  expect(loeseRechnung(rechnung(), werte({ menge: 5000, dosis: 0, tage: 5 }), ALLE)).toBeNull()
})

test('ohne belegte Menge gibt es keine Gleichung', () => {
  const r = rechnung()
  r.menge.spalte = ''
  const nurRest = new Set<PlatzKey>(['anzahl', 'dosis', 'tage'])
  expect(loeseRechnung(r, werte({ dosis: 5, tage: 5 }), nurRest)).toBeNull()
})

test('zahlStreng liest deutsch und raet nie', () => {
  expect(zahlStreng('0,5')).toBe(0.5)
  expect(zahlStreng('0,750')).toBe(0.75)
  expect(zahlStreng('12')).toBe(12)
  expect(zahlStreng('1.500')).toBe(1500)
  expect(zahlStreng('1.999,00')).toBe(1999)
  // Punkt mit drei Ziffern hinter fuehrender Null ist keine Tausendergruppe —
  // '0.750' als 750 zu lesen war der Faktor-1000-Fehler.
  expect(zahlStreng('0.750')).toBeNull()
  expect(zahlStreng('')).toBeNull()
  expect(zahlStreng('abc')).toBeNull()
})

test('rundeWert kennt auf, ab und kaufmaennisch', () => {
  expect(rundeWert(22.2, { stellen: 0, richtung: 'auf' })).toBe(23)
  expect(rundeWert(22.8, { stellen: 0, richtung: 'ab' })).toBe(22)
  expect(rundeWert(22.5, { stellen: 0, richtung: 'kfm' })).toBe(23)
  expect(rundeWert(2.666, { stellen: 2, richtung: 'kfm' })).toBe(2.67)
  // Gleitkomma-Rest darf nicht aufrunden: 9 bleibt 9.
  expect(rundeWert(45 / 5, { stellen: 0, richtung: 'auf' })).toBe(9)
})

test('platzText schreibt ohne Tausenderpunkte, mit Komma', () => {
  expect(platzText(5000, 3)).toBe('5000')
  expect(platzText(2.7, 3)).toBe('2,7')
  expect(platzText(23, 0)).toBe('23')
})

test('Attribut-Rundreise erhaelt die Rechnung', () => {
  const r = rechnung()
  const zurueck = rechnungVonAttribut(rechnungAlsAttribut(r))
  expect(zurueck).toEqual(r)
})

test('kaputtes Attribut liefert null statt Truemmer', () => {
  expect(rechnungVonAttribut('')).toBeNull()
  expect(rechnungVonAttribut('kein json')).toBeNull()
  expect(rechnungVonAttribut(7)).toBeNull()
  expect(rechnungVonAttribut('[1,2]')).toBeNull()
})

// Alte Masken tragen im Attribut noch die ausgebauten Teile: einheitFeld/
// einheiten (Umrechner), gewicht/bezug (Tiergewicht und je-kg, beide raus am
// 2026-09-01) und `feld` statt `spalte` (vor der Spalten-Kennung) — die Leser
// lassen Unbekanntes einfach fallen; `feld` uebersetzt die Lade-Migration
// (migrationenRoh), nicht dieser Leser.
test('unbekannte Attribut-Teile werden beim Lesen fallengelassen', () => {
  const roh = JSON.stringify({
    menge: { spalte: 's5', feld: 'm' },
    gewicht: { spalte: 's9', runden: { stellen: 3, richtung: 'kfm' } },
    bezug: { spalte: 's6', runden: { stellen: 3, richtung: 'kfm' } },
    einheitFeld: '1646_5',
    einheiten: [{ kennung: 'ml', klarname: 'Milliliter', art: 'volumen', faktor: 1 }],
  })
  const r = rechnungVonAttribut(roh)
  expect(r?.menge.spalte).toBe('s5')
  expect(r).not.toHaveProperty('einheiten')
  expect(r).not.toHaveProperty('gewicht')
  expect(r).not.toHaveProperty('bezug')
  expect(r?.menge).not.toHaveProperty('feld')
})
