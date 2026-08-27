import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { SchluesselPaar } from '../../core/data/sourceLinks'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import { ART_TEXT } from './spaltenArten'
import type { Spalte } from './spalten'

// Die Zeilen der Nachschlage-Quellen kommen im Produkt aus dem SEDATA-Paket
// (quellenZeilen liest seGlobal()). Hier stehen sie als Testdaten daneben —
// genau dafuer ist ErfassungsUmfeld als Buendel geschnitten.
const zeilen: Record<string, unknown[]> = {}

vi.mock('../formfeld/nachschlagen', async (echte) => {
  const modul = await echte<typeof import('../formfeld/nachschlagen')>()
  return { ...modul, quellenZeilen: (id: string) => zeilen[id] ?? null }
})

const { ErfassungsLauf } = await import('./erfassungsLauf')

const HAUPT = 'q-pos'

function spalte(titel: string, feld: string): Spalte {
  return { titel, feld, art: ART_TEXT }
}

function umfeldVon(
  spalten: readonly Spalte[],
  paare: Record<string, SchluesselPaar[]>,
  partner: Record<string, string> = {},
): ErfassungsUmfeld {
  return {
    spalten,
    quelleId: HAUPT,
    paareZu: (id) => paare[id] ?? [],
    partnerVon: (id) => partner[id] ?? '',
  }
}

beforeEach(() => {
  for (const id of Object.keys(zeilen)) delete zeilen[id]
  zeilen['q-art'] = [
    { artnr: 'ART1', '45_60': 'Kabel', kat: 'K1' },
    { artnr: 'ART2', '45_60': 'Stecker', kat: 'K2' },
  ]
  zeilen['q-grp'] = [
    { kat: 'K1', gruppe: 'Kabelage' },
    { kat: 'K2', gruppe: 'Verbinder' },
  ]
})

// Die Gruppen-Spalte steht VOR der Artikel-Spalte, an der sie haengt: in der
// ersten Runde ist ihr Partner noch nicht gewaehlt. Nur weil gleicheAb bis zum
// Fixpunkt laeuft, fuellt sie sich ueberhaupt.
function kette(): ErfassungsUmfeld {
  return umfeldVon(
    [
      spalte('Artikelnummer', '18_25'),
      spalte('Gruppe', 'q-grp::gruppe'),
      spalte('Bezeichnung', 'q-art::45_60'),
    ],
    {
      'q-art': [{ fromField: '18_25', toField: 'artnr' }],
      'q-grp': [{ fromField: 'kat', toField: 'kat' }],
    },
    { 'q-grp': 'q-art' },
  )
}

describe('gleicheAb laeuft bis zum Fixpunkt', () => {
  test('eine Wahl fuellt die Kette ueber mehrere Runden', () => {
    const umfeld = kette()
    const lauf = new ErfassungsLauf()
    lauf.uebernimm(umfeld, 0, { '18_25': 'ART1' })
    expect(lauf.wertVon(umfeld, 2)).toBe('Kabel')
    expect(lauf.wertVon(umfeld, 1)).toBe('Kabelage')
  })

  test('Gewaehltes faellt, wenn sein Schluessel nicht mehr passt', () => {
    const umfeld = kette()
    const lauf = new ErfassungsLauf()
    lauf.uebernimm(umfeld, 2, zeilen['q-art'][0])
    expect(lauf.wertVon(umfeld, 1)).toBe('Kabelage')

    // Anderer Artikel, andere Kategorie: die alte Gruppe passt nicht mehr,
    // faellt — und die neue waehlt sich selbst (Ein-Treffer-Automatik).
    lauf.uebernimm(umfeld, 2, zeilen['q-art'][1])
    expect(lauf.wertVon(umfeld, 1)).toBe('Verbinder')
  })

  test('ohne passenden Partner bleibt die Zelle leer, statt zu raten', () => {
    const umfeld = kette()
    const lauf = new ErfassungsLauf()
    lauf.uebernimm(umfeld, 0, { '18_25': 'ART9' })
    expect(lauf.wertVon(umfeld, 2)).toBe('')
    expect(lauf.wertVon(umfeld, 1)).toBe('')
  })

  // Sonst waehlte sich in einem Ein-Satz-Stamm der Satz ungefragt selbst.
  test('die Automatik greift nicht ohne einen einzigen bekannten Schluessel', () => {
    const umfeld = kette()
    const lauf = new ErfassungsLauf()
    zeilen['q-art'] = [{ artnr: 'ART1', '45_60': 'Kabel', kat: 'K1' }]

    // Die Gruppe von Hand gewaehlt: sie haengt an q-art, sagt ueber die
    // Hauptquelle also nichts — der Schluessel von q-art bleibt unbekannt.
    lauf.uebernimm(umfeld, 1, zeilen['q-grp'][0])
    expect(lauf.wertVon(umfeld, 1)).toBe('Kabelage')
    expect(lauf.wertVon(umfeld, 2)).toBe('')
  })
})

// Beim Erfassen einer NEUEN Zeile gibt es den Satz der Tabellen-Quelle noch
// nicht. Den Schluessel liefert dann der von Hand gewaehlte verknuepfte Satz
// ueber seine Paare — sonst waere die zweite Nachschlage-Spalte unbenutzbar,
// bis die Position existiert.
test('schluesselWert kommt ueber die Verknuepfungskette, wenn es die Zeile noch nicht gibt', () => {
  zeilen['q-lag'] = [
    { artnr: 'ART1', ort: 'Halle A' },
    { artnr: 'ART1', ort: 'Halle B' },
    { artnr: 'ART2', ort: 'Halle C' },
  ]
  const umfeld = umfeldVon(
    [
      spalte('Artikelnummer', '18_25'),
      spalte('Bezeichnung', 'q-art::45_60'),
      spalte('Lagerort', 'q-lag::ort'),
    ],
    {
      'q-art': [{ fromField: '18_25', toField: 'artnr' }],
      'q-lag': [{ fromField: '18_25', toField: 'artnr' }],
    },
  )
  const lauf = new ErfassungsLauf()

  // Ohne jede Wahl ist der Schluessel unbekannt: alles wird angeboten.
  expect(lauf.eintraege(umfeld, 2).map((e) => e.wert)).toEqual(['Halle A', 'Halle B', 'Halle C'])

  lauf.uebernimm(umfeld, 1, zeilen['q-art'][0])
  expect(lauf.eintraege(umfeld, 2).map((e) => e.wert)).toEqual(['Halle A', 'Halle B'])
})

describe('Tastenentscheid', () => {
  const umfeld = umfeldVon(
    [
      spalte('Notiz', ''),
      spalte('Artikelnummer', '18_25'),
      spalte('Bezeichnung', 'q-art::45_60'),
      spalte('Nirgendwo', 'q-leer::x'),
    ],
    { 'q-art': [] },
  )

  test('Tab ohne offene Liste springt weiter', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 2, 'Tab')).toBe('weiter')
  })

  test('F4 an einer freien Zelle tut nichts', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 0, 'F4')).toBe('nichts')
  })

  test('F4 an einer verknuepften Zelle macht das Fenster auf', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 2, 'F4')).toBe('fenster')
  })

  test('Escape leert die Zelle, wenn keine Liste offen ist', () => {
    const lauf = new ErfassungsLauf()
    expect(lauf.entscheideTaste(umfeld, 0, 'Escape')).toBe('nichts')
    lauf.tippe(0, 'Rest')
    expect(lauf.entscheideTaste(umfeld, 0, 'Escape')).toBe('leeren')
  })

  test('Pfeil-runter macht nur die Liste auf, die es gibt', () => {
    const lauf = new ErfassungsLauf()
    expect(lauf.entscheideTaste(umfeld, 2, 'ArrowDown')).toBe('liste-auf')
    expect(lauf.entscheideTaste(umfeld, 1, 'ArrowDown')).toBe('nichts')
    expect(lauf.entscheideTaste(umfeld, 0, 'ArrowDown')).toBe('nichts')
  })

  test('Enter im leeren Feld holt das Fenster', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 2, 'Enter')).toBe('fenster')
  })

  test('Enter haengt nicht, wenn es keinen einzigen moeglichen Satz gibt', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 3, 'Enter')).toBe('weiter')
  })

  // G1: getippter Text ohne Treffer haelt bewusst an — sonst rauscht der Fluss
  // ueber den Tippfehler hinweg.
  test('Enter auf Getipptem ohne Treffer haelt an, auf Gewaehltem geht es weiter', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'Kab')
    lauf.aktualisiereVorschlaege(umfeld)
    lauf.verlasse(2)
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('nichts')

    lauf.uebernimm(umfeld, 2, zeilen['q-art'][0])
    expect(lauf.wertVon(umfeld, 2)).toBe('Kabel')
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('weiter')
  })

  test('naechsteLeere ueberspringt, was schon steht', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(1, 'ART1')
    expect(lauf.naechsteLeere(umfeld, 0)).toBe(2)
    expect(lauf.naechsteLeere(umfeld, 2)).toBe(3)
    expect(lauf.naechsteLeere(umfeld, 3)).toBe(-1)
  })
})
