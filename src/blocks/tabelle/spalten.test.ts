import { expect, test } from 'vitest'
import { listeFuerExport } from '../../core/blocks/BlockDefinition'
import { rechnungAlsAttribut, rechnungVonAttribut, leereRechnung } from '../../core/data/rechnung'
import {
  coerceSpalten,
  entferneSpalte,
  fuegeSpalteAn,
  mitKennungen,
  rechnungNachSpalten,
  spalteMitKennung,
  spaltenRaster,
  spaltenSicht,
  SPALTEN_MAX,
  SPALTEN_MIN,
  SPALTEN_MIN_BREITE,
  verschiebeSpalteAn,
  type Spalte,
} from './spalten'
import { SPALTEN_BINDUNG } from './tabelleEigenschaften'

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
// gehoert haben.
test('coerceSpalten vergibt fehlende Kennungen und behaelt vorhandene', () => {
  const raus = coerceSpalten([
    { titel: 'A', feld: '1_1' },
    { kennung: 's7', titel: 'B', feld: '2_1' },
    { titel: 'C', feld: '3_1' },
  ])
  expect(raus.map((s) => s.kennung)).toEqual(['s8', 's7', 's9'])
})

// Der Bediener loescht eine Spalte in der Mitte und legt eine neue an.
// Bekaeme die neue die frei gewordene Kennung, zeigten Rechnung und
// Ketten-Parameter der geloeschten Spalte ab sofort stumm auf sie — sie
// zeigen ja auf die Kennung, nicht auf den Platz.
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

// Ausgeblendet heisst: die Maske zeichnet die Spalte nicht. Ueberlebt der
// Schalter den Weg in die Maske nicht, zeichnet sie sie doch.
test('ein gesetztes "versteckt" ueberlebt Export und Einlesen', () => {
  expect(rundlauf({ titel: 'Intern', feld: '930_3', versteckt: true }))
    .toMatchObject({ versteckt: true })
})

function liste(...versteckt: boolean[]): Spalte[] {
  return versteckt.map((v, i) => ({
    kennung: `s${i + 1}`,
    titel: `S${i + 1}`,
    feld: `f${i}`,
    ...(v ? { versteckt: true } : {}),
  }))
}

// JEDER Wert und jeder Ketten-Parameter haengt am
// Platz in der VOLLEN Liste (datenzeilen, exportMask, Rechnung). Die Sicht
// darf nur sagen, WAS gezeichnet wird — und wo das Gezeichnete voll steht.
test('spaltenSicht laesst im Editor alles stehen', () => {
  const alle = liste(false, true, false)
  const sicht = spaltenSicht(alle, true)
  expect(sicht.spalten).toBe(alle)
  expect(sicht.plaetze).toEqual([0, 1, 2])
})

test('spaltenSicht nimmt in der Maske die versteckten heraus und merkt sich ihren Platz', () => {
  const sicht = spaltenSicht(liste(true, false, false), false)
  expect(sicht.spalten.map((s) => s.kennung)).toEqual(['s2', 's3'])
  // Die zweite gezeichnete Spalte ist die dritte der vollen Liste: genau
  // diese Zahl adressiert Wert, Aenderung und Ketten-Parameter.
  expect(sicht.plaetze).toEqual([1, 2])
})

// Ohne jede Spur haette die Maske kein Raster und keinen Kopf — der Bediener
// haelt eine Tabelle ohne Spalten fuer kaputt.
test('sind alle Spalten versteckt, bleibt die erste stehen', () => {
  const sicht = spaltenSicht(liste(true, true), false)
  expect(sicht.spalten.map((s) => s.kennung)).toEqual(['s1'])
  expect(sicht.plaetze).toEqual([0])
})

// Die Wahl des BEDIENERS (Rechtsklick in der Maske) filtert auf demselben
// Weg — und aendert genauso wenig an den Plaetzen.
test('spaltenSicht nimmt auch weg, was der Bediener weggenommen hat', () => {
  const sicht = spaltenSicht(liste(false, false, false), false, new Set(['s2']))
  expect(sicht.spalten.map((s) => s.kennung)).toEqual(['s1', 's3'])
  expect(sicht.plaetze).toEqual([0, 2])
})

test('im Editor gilt die Wahl des Bedieners nicht', () => {
  const sicht = spaltenSicht(liste(false, false), true, new Set(['s1']))
  expect(sicht.spalten.map((s) => s.kennung)).toEqual(['s1', 's2'])
})

test('nimmt der Bediener alles weg, bleibt die erste Spalte stehen', () => {
  const sicht = spaltenSicht(liste(false, false), false, new Set(['s1', 's2']))
  expect(sicht.spalten.map((s) => s.kennung)).toEqual(['s1'])
})

// Was der Bauer am Suchfenster einer Spalte (F4 beim Erfassen) stellt, muss
// denselben Weg ueberleben wie jede andere Spalten-Angabe — sonst faende er
// seine Einstellung im Editor wieder, waehrend die exportierte Maske weiter
// die Automatik zeigte.
test('eingestellte Fenster-Spalten ueberleben Export und Einlesen', () => {
  const raus = rundlauf({
    titel: 'Artikel',
    feld: '164_8',
    fensterSpalten: [
      { titel: 'Nummer', feld: '164_1' },
      { titel: 'Bezeichnung', feld: '164_2' },
    ],
  })
  expect(raus.fensterSpalten).toMatchObject([
    { titel: 'Nummer', feld: '164_1' },
    { titel: 'Bezeichnung', feld: '164_2' },
  ])
})

// Eine leere Liste ist keine Einstellung, sondern Automatik. Sonst zeigte eine
// Spalte, deren Fenster-Spalten alle wieder geloescht wurden, ein leeres
// Fenster statt der gerechneten Vorgabe.
test('eine leere Fenster-Liste faellt auf die Automatik zurueck', () => {
  expect('fensterSpalten' in rundlauf({ titel: 'Artikel', feld: '164_8', fensterSpalten: [] }))
    .toBe(false)
})

// Ein Fenster von 20 Pixeln ist keins mehr, eines von 9000 passt auf keinen
// Bildschirm — beides koennte der Bediener nicht zurechtruecken.
test('Fenstermasse werden in vernuenftige Grenzen gezogen', () => {
  expect(rundlauf({ titel: 'A', feld: '164_8', fensterBreite: 20 }))
    .toMatchObject({ fensterBreite: 120 })
  expect(rundlauf({ titel: 'A', feld: '164_8', fensterHoehe: 9000 }))
    .toMatchObject({ fensterHoehe: 2000 })
})

// Unsinn im Attribut darf keine Spalte kippen: ohne Zahl gilt die gerechnete
// Groesse.
test('unbrauchbare Fenstermasse fallen weg statt zu stoeren', () => {
  expect('fensterBreite' in rundlauf({ titel: 'A', feld: '164_8', fensterBreite: 'breit' }))
    .toBe(false)
})

function drei(): Spalte[] {
  return [
    { kennung: 's1', titel: 'A', feld: '1_1' },
    { kennung: 's2', titel: 'B', feld: '2_1', breite: 120 },
    { kennung: 's3', titel: 'C', feld: '3_1' },
  ]
}

// Der Punkt der Sache: gestrichen wird die Spalte, die gemeint ist — nicht
// immer die letzte. Naehme nur ein Minus-Knopf hinten weg, muesste, wer die
// mittlere loswerden will, die hintere mit opfern und neu aufbauen.
test('gestrichen wird die genannte Spalte, nicht die letzte', () => {
  let raus: Spalte[] = []
  entferneSpalte(1, drei, (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['A', 'C'])
})

test('die erste geht genauso', () => {
  let raus: Spalte[] = []
  entferneSpalte(0, drei, (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['B', 'C'])
})

// Die gezogenen Breiten haengen am PLATZ. Faellt eine Spalte weg, muss die
// Breite bei IHRER Spalte bleiben — sonst erbt die Nachbarin sie.
test('die gezogene Breite bleibt bei ihrer Spalte', () => {
  let raus: Spalte[] = []
  entferneSpalte(0, drei, (l) => { raus = l })
  expect(raus.map((s) => s.breite)).toEqual([120, undefined])
})

// Eine Tabelle ohne Spalte waere ein leerer Kasten: der Plus-Knopf sitzt an
// der Steuerung, aber es gaebe keinen Kopf mehr, an dem man etwas einstellt.
test('die letzte verbliebene Spalte bleibt stehen', () => {
  const eine = (): Spalte[] => [{ kennung: 's1', titel: 'A', feld: '1_1' }]
  let gerufen = false
  entferneSpalte(0, eine, () => { gerufen = true })
  expect(gerufen).toBe(false)
  expect(SPALTEN_MIN).toBe(1)
})

test('ein Platz ausserhalb der Liste tut nichts', () => {
  let gerufen = false
  entferneSpalte(7, drei, () => { gerufen = true })
  entferneSpalte(-1, drei, () => { gerufen = true })
  expect(gerufen).toBe(false)
})

function feste(...breiten: number[]): Spalte[] {
  return breiten.map((breite, i) => ({ kennung: `s${i + 1}`, titel: `S${i}`, feld: `${i}_1`, breite }))
}

// Der gemeldete Fehler: waren alle Spalten gezogen, war der Rest fuer die
// neue NULL Pixel — sie war angelegt und unsichtbar. Jetzt gibt es keinen
// Rest, sondern Anteile: die neue bekommt den mittleren, die uebrigen ruecken
// anteilig zusammen.
test('die neue Spalte ist sichtbar, auch wenn alle anderen gezogen sind', () => {
  const raus = fuegeSpalteAn(feste(120, 100, 80))
  expect(raus).toHaveLength(4)
  expect(spaltenRaster(raus))
    .toBe('minmax(0, 120fr) minmax(0, 100fr) minmax(0, 80fr) minmax(0, 100fr)')
})

// Was der Bediener gezogen hat, bleibt stehen — beim Anfuegen wird nicht
// ALLES neu verteilt.
test('gezogene Breiten bleiben beim Anfuegen unangetastet', () => {
  expect(fuegeSpalteAn(feste(43, 97, 61, 399)).map((s) => s.breite))
    .toEqual([43, 97, 61, 399, undefined])
})

// Spiegelbild: die Verbliebenen behalten ihre Anteile und fuellen die Tabelle
// trotzdem wieder aus — der Platz der gestrichenen Spalte bleibt nicht als
// leere Flaeche am rechten Rand stehen.
test('beim Streichen behalten die Verbliebenen ihre Breite', () => {
  let raus: Spalte[] = []
  entferneSpalte(1, () => feste(120, 100, 80), (l) => { raus = l })
  expect(raus.map((s) => s.titel)).toEqual(['S0', 'S2'])
  expect(raus.map((s) => s.breite)).toEqual([120, 80])
})

// Bis zur Obergrenze klicken: keine Spalte faellt dabei auf den Anteil null.
// Der Fehler fiel nicht beim ersten Klick auf, sondern nach mehreren.
test('auch nach vielen Klicks hat jede Spalte einen Anteil', () => {
  let spalten = feste(120, 100, 80)
  while (spalten.length < SPALTEN_MAX) {
    spalten = fuegeSpalteAn(spalten)
    expect(spaltenRaster(spalten)).not.toMatch(/[^0-9]0fr/)
  }
})

// Verschieben (Ziehen am Spaltenkopf): der ganze Eintrag reist mit (Kennung,
// Titel, Feld, Breite). Ketten und Rechnung zeigen auf die Kennung — sie
// brauchen kein Nachziehen.
test('verschiebeSpalteAn setzt die Spalte an den Ziel-Platz, samt allem Ihren', () => {
  let raus: Spalte[] = []
  verschiebeSpalteAn(0, 2, drei, (l) => { raus = l })
  expect(raus.map((s) => s.kennung)).toEqual(['s2', 's3', 's1'])
  expect(raus.map((s) => s.titel)).toEqual(['B', 'C', 'A'])
  expect(raus[0].breite).toBe(120)

  verschiebeSpalteAn(2, 0, drei, (l) => { raus = l })
  expect(raus.map((s) => s.kennung)).toEqual(['s3', 's1', 's2'])
})

test('derselbe Platz und Unsinns-Plaetze verschieben nichts', () => {
  let gerufen = false
  verschiebeSpalteAn(1, 1, drei, () => { gerufen = true })
  verschiebeSpalteAn(9, 0, drei, () => { gerufen = true })
  verschiebeSpalteAn(-1, 2, drei, () => { gerufen = true })
  expect(gerufen).toBe(false)
})

// Ein Ziel hinter dem Ende landet auf dem letzten Platz — der Zug-Slot
// hinter der letzten Spalte darf nicht ins Leere fallen.
test('ein Ziel hinter dem Ende wird der letzte Platz', () => {
  let raus: Spalte[] = []
  verschiebeSpalteAn(0, 99, drei, (l) => { raus = l })
  expect(raus.map((s) => s.kennung)).toEqual(['s2', 's3', 's1'])
})

// Die Rechnung zeigt ueber die dauerhafte Kennung auf ihre Spalten. Bleibt der
// Zeiger nach dem Loeschen stehen, rechnet die Maske weiter mit einer Spalte,
// die es nicht mehr gibt — und die naechste neue Spalte bekommt dieselbe
// Kennung (Vergabe = hoechste + 1).
function rechnungMit(menge: string, anzahl: string): string {
  const r = leereRechnung()
  r.menge = { ...r.menge, spalte: menge }
  r.anzahl = { ...r.anzahl, spalte: anzahl }
  return rechnungAlsAttribut(r)
}

test('der Rechnungs-Platz der geloeschten Spalte wird leer', () => {
  const roh = rechnungNachSpalten(rechnungMit('s1', 's3'), drei(), drei().slice(0, 2))
  const r = rechnungVonAttribut(roh)
  expect(r?.anzahl.spalte).toBe('')
  expect(r?.menge.spalte).toBe('s1')
})

test('bleibt jede Spalte, ist nichts abzuraeumen', () => {
  expect(rechnungNachSpalten(rechnungMit('s1', 's3'), drei(), drei())).toBeNull()
})

test('ohne Rechnung gibt es nichts abzuraeumen', () => {
  expect(rechnungNachSpalten('', drei(), drei().slice(0, 2))).toBeNull()
})
