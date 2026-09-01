import { expect, test } from 'vitest'
import { listeFuerExport } from '../../core/blocks/BlockDefinition'
import { coerceSpalten, mitKennungen, spalteMitKennung, SPALTEN_MIN_BREITE } from './spalten'
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
  expect(rundlauf({ titel: 'Gesamt', feld: '280_12', aenderbar: false }))
    .toMatchObject({ aenderbar: false })
})

test('ein eingeschaltetes "summe" ueberlebt genauso', () => {
  expect(rundlauf({ titel: 'Gesamt', feld: '280_12', summe: true }))
    .toMatchObject({ summe: true })
})

// Ohne Angabe bleibt es beim Standard des Schalters — es steht nichts im
// Eintrag, und genau das ist gewollt (sonst stuende in jeder Spalte derselbe
// Wert und eine spaetere Vorgabe-Aenderung ginge an alten Masken vorbei).
test('ohne Abweichung steht der Schalter gar nicht im Eintrag', () => {
  const raus = rundlauf({ titel: 'Menge', feld: '164_8', aenderbar: true })
  expect('aenderbar' in raus).toBe(false)
})

// Das Fuellfeld darf den Schalter NICHT kippen: geschrieben wird das
// Spaltenfeld, und das gehoert der Hauptquelle.
test('eine Spalte mit Fuellfeld bleibt aenderbar', () => {
  const raus = rundlauf({
    titel: 'Bezeichnung', feld: '45_60', fuellFeld: 'q-art::bez', aenderbar: false,
  })
  expect(raus).toMatchObject({ fuellFeld: 'q-art::bez', aenderbar: false })
})

// Die von Hand gezogene Spaltenbreite. Ohne sie stuende in der exportierten
// Maske wieder die gleichmaessige Aufteilung — die Arbeit am Spaltenkopf
// waere beim Export weg.
test('eine gezogene Breite ueberlebt Export und Einlesen', () => {
  expect(rundlauf({ titel: 'Menge', feld: '164_8', breite: 132 }))
    .toMatchObject({ breite: 132 })
})

// Eine Spalte ohne Zug traegt KEINE Breite — sie teilt sich den Platz mit den
// anderen. Stuende hier eine Zahl, waere jede Spalte sofort festgenagelt.
test('ohne Zug steht keine Breite im Eintrag', () => {
  expect('breite' in rundlauf({ titel: 'Menge', feld: '164_8' })).toBe(false)
})

// Was von aussen kommt (alte Maske, Handarbeit an der Datei), wird auf ein
// benutzbares Mass gezogen statt uebernommen: eine 0 oder eine negative Zahl
// waere eine unsichtbare Spalte ohne Weg zurueck.
test('eine unbrauchbare Breite faellt auf die Mindestbreite', () => {
  expect(coerceSpalten([{ titel: 'A', feld: '1_1', breite: 0 }])[0].breite)
    .toBe(SPALTEN_MIN_BREITE)
  expect(coerceSpalten([{ titel: 'A', feld: '1_1', breite: 'breit' }])[0].breite)
    .toBeUndefined()
})

// Die Kennung ist der dauerhafte Ausweis der Spalte: Ketten und Rechnung
// zeigen auf sie. Jede Lesung muss sie vollstaendig liefern — auch aus einer
// Maske, die vor der Kennung exportiert wurde.
//
// Vergeben wird ueber der hoechsten schon vorhandenen (hier s7), nicht in
// deren Luecken: eine niedrigere Nummer koennte einer geloeschten Spalte
// gehoert haben. Frueher standen hier s1 und s2 — genau der Fehler.
test('coerceSpalten vergibt fehlende Kennungen und behaelt vorhandene', () => {
  const raus = coerceSpalten([
    { titel: 'A', feld: '1_1' },
    { kennung: 's7', titel: 'B', feld: '2_1' },
    { titel: 'C', feld: '3_1' },
  ])
  expect(raus.map((s) => s.kennung)).toEqual(['s8', 's7', 's9'])
})

// Der Kern von P4: der Bediener loescht eine Spalte in der Mitte und legt
// eine neue an. Bekaeme die neue die frei gewordene Kennung, zeigten
// Rechnung und Ketten-Parameter der geloeschten Spalte ab sofort stumm auf
// sie — sie zeigen ja auf die Kennung, nicht auf den Platz.
test('eine geloeschte Kennung wird nicht wiedervergeben', () => {
  const vorher = mitKennungen([
    { kennung: '', titel: 'A', feld: '' },
    { kennung: '', titel: 'B', feld: '' },
    { kennung: '', titel: 'C', feld: '' },
  ])
  expect(vorher.map((s) => s.kennung)).toEqual(['s1', 's2', 's3'])

  // 's2' faellt weg, eine frische Spalte kommt hinten dazu.
  const nachher = mitKennungen([vorher[0], vorher[2], { kennung: '', titel: 'D', feld: '' }])
  expect(nachher.map((s) => s.kennung)).toEqual(['s1', 's3', 's4'])
})

// Auch mehrere frische Spalten auf einmal duerfen sich nicht in die Luecken
// setzen — und untereinander nicht kollidieren.
test('mehrere frische Spalten zaehlen ueber der hoechsten weiter', () => {
  const raus = mitKennungen([
    { kennung: 's4', titel: 'A', feld: '' },
    { kennung: '', titel: 'B', feld: '' },
    { kennung: '', titel: 'C', feld: '' },
  ])
  expect(raus.map((s) => s.kennung)).toEqual(['s4', 's5', 's6'])
})

// Eine doppelte Kennung waere zwei Ausweise mit derselben Nummer: die
// vorderste behaelt ihre, die zweite bekommt eine frische.
test('mitKennungen behebt Doppelte, ohne die erste anzufassen', () => {
  const raus = mitKennungen([
    { kennung: 's1', titel: 'A', feld: '' },
    { kennung: 's1', titel: 'B', feld: '' },
  ])
  expect(raus[0].kennung).toBe('s1')
  expect(raus[1].kennung).not.toBe('s1')
  expect(raus[1].kennung).not.toBe('')
})

test('spalteMitKennung findet den Platz, leer und unbekannt sind -1', () => {
  const spalten = coerceSpalten([
    { kennung: 'a', titel: 'A', feld: '' },
    { kennung: 'b', titel: 'B', feld: '' },
  ])
  expect(spalteMitKennung(spalten, 'b')).toBe(1)
  expect(spalteMitKennung(spalten, '')).toBe(-1)
  expect(spalteMitKennung(spalten, 'zzz')).toBe(-1)
})

// Die Kennung reist im spalten-Attribut in die exportierte Maske — dort
// loest die Rechnung sie zur Laufzeit auf. Faellt sie im Export weg, rechnet
// die Maske nichts mehr.
test('die Kennung ueberlebt Export und Einlesen', () => {
  expect(rundlauf({ kennung: 's3', titel: 'Menge', feld: '164_8' }))
    .toMatchObject({ kennung: 's3' })
})
