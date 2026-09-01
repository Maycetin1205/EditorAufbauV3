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
  for (const k of ['menge', 'anzahl', 'dosis', 'gewicht', 'bezug', 'tage'] as const) {
    r[k].feld = k
  }
  return r
}

const ALLE = new Set<PlatzKey>(['menge', 'anzahl', 'dosis', 'gewicht', 'bezug', 'tage'])

function werte(teil: Partial<Record<PlatzKey, PlatzWert>>): Record<PlatzKey, PlatzWert> {
  return {
    menge: null, anzahl: null, dosis: null, gewicht: null, bezug: null, tage: null,
    ...teil,
  }
}

// Der Praxisfall aus den Kundendaten: Baytril 5 %, 5 ml je 50 kg, 5 Tage.
// 5000 ml Vorrat, Rinder mit 450 kg -> 22,2 Tiere -> aufgerundet 23.
test('Anzahl Tiere ist die Luecke und wird aufgerundet', () => {
  const geloest = loeseRechnung(rechnung(), werte({
    menge: 5000, dosis: 5, gewicht: 450, bezug: 50, tage: 5,
  }), ALLE)
  expect(geloest).toEqual({ platz: 'anzahl', wert: 23 })
})

test('Abgabemenge ist die Luecke', () => {
  const geloest = loeseRechnung(rechnung(), werte({
    anzahl: 12, dosis: 5, gewicht: 450, bezug: 50, tage: 5,
  }), ALLE)
  expect(geloest).toEqual({ platz: 'menge', wert: 2700 })
})

// Bezug leer = Dosis pro Tier: das Paar Tiergewicht/Bezug faellt weg,
// ein getipptes Tiergewicht darf NICHT mitmultiplizieren.
test('ohne Bezug rechnet die Dosis pro Tier', () => {
  const geloest = loeseRechnung(rechnung(), werte({
    anzahl: 12, dosis: 20, gewicht: 450, tage: 5,
  }), ALLE)
  expect(geloest).toEqual({ platz: 'menge', wert: 1200 })
})

test('zwei Luecken: nichts wird gerechnet', () => {
  expect(loeseRechnung(rechnung(), werte({ dosis: 5, bezug: 50, tage: 5 }), ALLE)).toBeNull()
})

test('alle Plaetze voll: nichts wird ueberschrieben', () => {
  expect(loeseRechnung(rechnung(), werte({
    menge: 5000, anzahl: 23, dosis: 5, gewicht: 450, bezug: 50, tage: 5,
  }), ALLE)).toBeNull()
})

test('unlesbarer Wert: die Rechnung schweigt statt zu raten', () => {
  expect(loeseRechnung(rechnung(), werte({
    menge: 5000, dosis: 'fehler', gewicht: 450, bezug: 50, tage: 5,
  }), ALLE)).toBeNull()
})

test('Division durch null: keine Antwort', () => {
  expect(loeseRechnung(rechnung(), werte({
    menge: 5000, dosis: 0, gewicht: 450, bezug: 50, tage: 5,
  }), ALLE)).toBeNull()
  expect(loeseRechnung(rechnung(), werte({
    menge: 5000, dosis: 5, gewicht: 450, bezug: 0, tage: 5,
  }), ALLE)).toBeNull()
})

test('Tiergewicht als Luecke wird aus dem Bezug zurueckgerechnet', () => {
  const geloest = loeseRechnung(rechnung(), werte({
    menge: 2700, anzahl: 12, dosis: 5, bezug: 50, tage: 5,
  }), ALLE)
  expect(geloest).toEqual({ platz: 'gewicht', wert: 450 })
})

// Der Fall aus der echten Nutzer-Konfiguration 2026-08-31: je-kg belegt,
// Tiergewicht nicht. Mit Bezugswert MUSS die Rechnung schweigen — vorher
// rechnete sie still mit 1/Bezug (Faktor 50 daneben).
test('Bezug mit Wert ohne Tiergewicht-Platz: schweigen', () => {
  const r = rechnung()
  r.gewicht.feld = ''
  const ohneGewicht = new Set<PlatzKey>(['menge', 'anzahl', 'dosis', 'bezug', 'tage'])
  expect(loeseRechnung(r, werte({
    menge: 5000, dosis: 5, bezug: 50, tage: 5,
  }), ohneGewicht)).toBeNull()
  // Pro-Tier-Artikel (Bezug in der Zeile leer) rechnen auch ohne den Platz.
  expect(loeseRechnung(r, werte({
    menge: 1200, dosis: 20, tage: 5,
  }), ohneGewicht)).toEqual({ platz: 'anzahl', wert: 12 })
})

test('ohne belegte Menge gibt es keine Gleichung', () => {
  const r = rechnung()
  r.menge.feld = ''
  const nurRest = new Set<PlatzKey>(['anzahl', 'dosis', 'gewicht', 'bezug', 'tage'])
  expect(loeseRechnung(r, werte({ dosis: 5, gewicht: 450, bezug: 50, tage: 5 }), nurRest)).toBeNull()
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

// Alte Masken tragen im Attribut noch einheitFeld/einheiten (der Umrechner
// von vor 2026-09-01) — die Leser lassen Unbekanntes einfach fallen.
test('unbekannte Attribut-Teile werden beim Lesen fallengelassen', () => {
  const roh = JSON.stringify({
    menge: { feld: 'm' },
    einheitFeld: '1646_5',
    einheiten: [{ kennung: 'ml', klarname: 'Milliliter', art: 'volumen', faktor: 1 }],
  })
  const r = rechnungVonAttribut(roh)
  expect(r?.menge.feld).toBe('m')
  expect(r).not.toHaveProperty('einheiten')
})
