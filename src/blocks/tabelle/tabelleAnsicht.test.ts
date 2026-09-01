import { expect, test } from 'vitest'
import { tabelleAnsicht, type AnsichtFrage } from './tabelleAnsicht'
import type { Spalte } from './spalten'

// P4: Suche und Sortierung lesen denselben Zellwert wie die Summe — die
// vorgemerkte Aenderung eingerechnet. Vorher lasen sie die rohen Daten: der
// Bediener aenderte eine Menge, suchte nach dem, was er gerade getippt
// hatte, und seine eigene Zeile fiel aus der Liste.

const SPALTEN: Spalte[] = [
  { kennung: 's1', titel: 'Artikel', feld: '18_25' },
  { kennung: 's2', titel: 'Menge', feld: '164_8' },
]

const DATEN = [['ART1', '5'], ['ART2', '7'], ['ART3', '9']]

// Zeile 0 traegt eine vorgemerkte Aenderung: statt 5 steht 99 in der Zelle.
function frage(zusatz: Partial<AnsichtFrage> = {}): AnsichtFrage {
  return {
    spalten: SPALTEN,
    hatQuelle: true,
    datenGeliefert: true,
    datenzeilen: DATEN,
    suchtext: '',
    sortSpalte: -1,
    sortAuf: true,
    wunschSeite: 0,
    gemessen: null,
    erfassungAn: false,
    erfassteAnzahl: 0,
    wertVon: (zeile, spalte) => (zeile === 0 && spalte === 1 ? '99' : DATEN[zeile][spalte]),
    blaettert: false,
    ...zusatz,
  }
}

// Ohne die Aenderung gaebe es keinen Treffer — der Rohwert ist 5.
test('die Suche findet die vorgemerkte Aenderung', () => {
  const ansicht = tabelleAnsicht(frage({ suchtext: '99' }))
  expect(ansicht.gesamt).toBe(1)
  expect(ansicht.zeilen.filter((z) => z !== null)).toEqual([0])
})

// Und sie findet den ueberschriebenen Rohwert NICHT mehr: er steht nirgends
// mehr auf dem Schirm.
test('die Suche findet den ersetzten Rohwert nicht mehr', () => {
  expect(tabelleAnsicht(frage({ suchtext: '5' })).gesamt).toBe(0)
})

// Sortiert wird nach dem, was zu sehen ist: 99 ist die groesste Menge und
// gehoert ans Ende, obwohl die Rohzeile mit 5 die kleinste waere.
test('die Sortierung ordnet nach der vorgemerkten Aenderung', () => {
  const ansicht = tabelleAnsicht(frage({ sortSpalte: 1, sortAuf: true }))
  expect(ansicht.zeilen.filter((z) => z !== null)).toEqual([1, 2, 0])
})

// Die Gegenprobe: ohne Vormerkung entscheiden die Rohwerte, wie bisher.
test('ohne Vormerkung bleibt es bei den Rohwerten', () => {
  const roh = frage({ sortSpalte: 1, sortAuf: true, wertVon: (z, s) => DATEN[z][s] })
  expect(tabelleAnsicht(roh).zeilen.filter((z) => z !== null)).toEqual([0, 1, 2])
})
