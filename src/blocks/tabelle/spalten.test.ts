import { expect, test } from 'vitest'
import { listeFuerExport } from '../../core/blocks/BlockDefinition'
import { coerceSpalten } from './spalten'
import { SPALTEN_BINDUNG } from './spaltenBindung'

// Der Weg, den eine Spalte wirklich nimmt: Editor-Eigenschaft -> Export
// (listeFuerExport) -> Attribut der exportierten Maske -> coerceSpalten. Was
// hier verlorengeht, ist in SoftEngine verloren.
function rundlauf(spalte: Record<string, unknown>): Record<string, unknown> {
  const raus = listeFuerExport([spalte], SPALTEN_BINDUNG)
  return coerceSpalten(JSON.parse(JSON.stringify(raus)))[0] as unknown as Record<string, unknown>
}

// „In der Zeile aenderbar" hat den Standard JA — die Abweichung ist also ein
// `false`. Es fiel beim Einlesen weg: eine gerechnete Spalte (Gesamt,
// Rohertrag) blieb in der exportierten Maske tippbar, der Bediener merkte eine
// Aenderung vor, die keine Kette schreibt.
test('ein ausgeschaltetes "aenderbar" ueberlebt Export und Einlesen', () => {
  expect(rundlauf({ titel: 'Gesamt', feld: '280_12', art: 'zahl', aenderbar: false }))
    .toMatchObject({ aenderbar: false })
})

test('ein eingeschaltetes "summe" ueberlebt genauso', () => {
  expect(rundlauf({ titel: 'Gesamt', feld: '280_12', art: 'zahl', summe: true }))
    .toMatchObject({ summe: true })
})

// Ohne Angabe bleibt es beim Standard des Schalters — es steht nichts im
// Eintrag, und genau das ist gewollt (sonst stuende in jeder Spalte derselbe
// Wert und eine spaetere Vorgabe-Aenderung ginge an alten Masken vorbei).
test('ohne Abweichung steht der Schalter gar nicht im Eintrag', () => {
  const raus = rundlauf({ titel: 'Menge', feld: '164_8', art: 'zahl', aenderbar: true })
  expect('aenderbar' in raus).toBe(false)
})

// Das Fuellfeld darf den Schalter NICHT kippen: geschrieben wird das
// Spaltenfeld, und das gehoert der Hauptquelle.
test('eine Spalte mit Fuellfeld bleibt aenderbar', () => {
  const raus = rundlauf({
    titel: 'Bezeichnung', feld: '45_60', art: 'text', fuellFeld: 'q-art::bez', aenderbar: false,
  })
  expect(raus).toMatchObject({ fuellFeld: 'q-art::bez', aenderbar: false })
})
