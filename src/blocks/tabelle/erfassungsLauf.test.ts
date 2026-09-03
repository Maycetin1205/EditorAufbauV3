import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { SchluesselPaar } from '../../core/data/sourceLinks'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import type { Spalte } from './spalten'
import { leereRechnung } from '../../core/data/rechnung'

// Die Zeilen der Nachschlage-Quellen kommen im Produkt aus dem SEDATA-Paket
// (quellenZeilen liest seGlobal()). Hier stehen sie als Testdaten daneben —
// genau dafuer ist ErfassungsUmfeld als Buendel geschnitten.
const zeilen: Record<string, unknown[]> = {}

vi.mock('../shared/nachschlagen', async (echte) => {
  const modul = await echte<typeof import('../shared/nachschlagen')>()
  return { ...modul, quellenZeilen: (id: string) => zeilen[id] ?? null }
})

const { ErfassungsLauf } = await import('./erfassungsLauf')

const HAUPT = 'q-pos'

function spalte(titel: string, feld: string): Spalte {
  return { kennung: '', titel, feld }
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

// Der Fall, fuer den das Fuellfeld gebaut ist: die Tabelle zeigt und schreibt
// die Belegposition, ausgesucht wird im Artikelstamm. OHNE Schluesselpaare —
// zwischen einer noch nicht existierenden Position und dem Stamm gibt es
// nichts zu verknuepfen, der Bediener sucht von Hand.
describe('Belegerfassung ueber Fuellfelder', () => {
  function belegUmfeld(): ErfassungsUmfeld {
    const mit = (titel: string, feld: string, fuellFeld: string): Spalte =>
      ({ kennung: '', titel, feld, fuellFeld })
    return umfeldVon(
      [
        mit('Artikelnummer', '18_25', 'q-art::artnr'),
        mit('Bezeichnung', '45_60', 'q-art::45_60'),
        spalte('Menge', '164_8'),
      ],
      {},
    )
  }

  test('ein gewaehlter Artikel fuellt alle Zellen seiner Quelle', () => {
    const umfeld = belegUmfeld()
    const lauf = new ErfassungsLauf()
    lauf.uebernimm(umfeld, 0, zeilen['q-art'][1])
    expect(lauf.wertVon(umfeld, 0)).toBe('ART2')
    expect(lauf.wertVon(umfeld, 1)).toBe('Stecker')

    // Die Menge haengt an keiner Quelle: sie bleibt dem Bediener.
    expect(lauf.wertVon(umfeld, 2)).toBe('')
    lauf.tippe(2, '3')
    expect(lauf.wertVon(umfeld, 2)).toBe('3')
  })

  // Ohne Paar darf nichts eingeschraenkt werden — sonst steht der Bediener vor
  // einer leeren Artikelliste, weil es die Position noch gar nicht gibt.
  test('ohne Schluesselpaar steht der ganze Stamm zur Wahl', () => {
    const umfeld = belegUmfeld()
    expect(new ErfassungsLauf().eintraege(umfeld, 1).map((e) => e.wert))
      .toEqual(['Kabel', 'Stecker'])
  })

  // Das Spaltenfeld zeigt auf die Hauptquelle; wuerde es beim Erfassen
  // fuehren, boete die Zelle die schon gebuchten Positionen an — und eine
  // davon zu waehlen klonte eine alte Zeile.
  test('das Spaltenfeld allein boete nichts an', () => {
    const ohne = umfeldVon([spalte('Bezeichnung', '45_60')], {})
    expect(new ErfassungsLauf().eintraege(ohne, 0)).toEqual([])
  })
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

  // Tab ist die Weiter-Taste — IMMER (Nutzer 2026-09-01). Vorher riss sie
  // bei mehreren Treffern das grosse Fenster auf, mitten im Durchtabben.
  test('Tab bei mehreren Treffern springt weiter statt Fenster', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'e')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.vorschlaege.length).toBeGreaterThan(1)
    expect(lauf.entscheideTaste(umfeld, 2, 'Tab')).toBe('weiter')
  })

  test('Tab nimmt den einzigen Treffer im Vorbeigehen mit', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'Kab')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.vorschlaege).toHaveLength(1)
    expect(lauf.entscheideTaste(umfeld, 2, 'Tab')).toBe('uebernehmen')
  })

  test('Tab nimmt die von Hand markierte Wahl mit', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'e')
    lauf.aktualisiereVorschlaege(umfeld)
    lauf.entscheideTaste(umfeld, 2, 'ArrowDown')
    expect(lauf.entscheideTaste(umfeld, 2, 'Tab')).toBe('uebernehmen')
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

  // Leer lassen ist eine Aussage (die Lücke rechnet die Rechnung) — Enter
  // hält dort nicht an. Das Fenster bleibt auf F4/Alt+Pfeil-runter.
  test('Enter im leeren Feld springt weiter', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 2, 'Enter')).toBe('weiter')
  })

  test('Enter haengt nicht, wenn es keinen einzigen moeglichen Satz gibt', () => {
    expect(new ErfassungsLauf().entscheideTaste(umfeld, 3, 'Enter')).toBe('weiter')
  })

  // Der Fall, an dem der Fluss jedes Mal abbrach: eine Spalte auf der EIGENEN
  // Quelle (in der Belegerfassung die Menge) hat keine Liste und keinen
  // Treffer — dort IST das Getippte der Wert. Enter tat dort vorher nichts.
  test('Enter auf Getipptem geht weiter, wo es gar nichts zu treffen gibt', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(1, '3')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.entscheideTaste(umfeld, 1, 'Enter')).toBe('weiter')
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

  // Genau ein Treffer ist keine Auswahl mehr, sondern das Ergebnis.
  test('Enter nimmt den einzigen Treffer', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'Kab')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.vorschlaege).toHaveLength(1)
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('uebernehmen')
  })

  // Vorher nahm Enter hier stumm den ersten der acht — bei tausenden Saetzen
  // war das Raten.
  test('Enter macht bei mehreren Treffern das Fenster auf', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'e')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.vorschlaege.length).toBeGreaterThan(1)
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('fenster')
  })

  // Wer selbst in der Liste ausgesucht hat, bekommt seine Wahl — sonst risse
  // Enter ihm die Liste unter der Marke weg.
  test('nach Pfeiltasten gilt die Wahl, auch bei mehreren Treffern', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'e')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.entscheideTaste(umfeld, 2, 'ArrowDown')).toBe('marke-runter')
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('uebernehmen')
  })

  // Ein neuer Anschlag verwirft die alte Wahl: sonst uebernaehme Enter einen
  // Eintrag, der zum neuen Suchwort gar nicht mehr gehoert.
  test('neues Tippen macht die Marken-Wahl wieder ungueltig', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(2, 'e')
    lauf.aktualisiereVorschlaege(umfeld)
    lauf.entscheideTaste(umfeld, 2, 'ArrowDown')
    lauf.tippe(2, 'e')
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('fenster')
  })

  // Die Liste per Pfeil-runter aufzumachen IST die Absicht auszusuchen.
  test('die aufgemachte Liste laesst Enter uebernehmen', () => {
    const lauf = new ErfassungsLauf()
    lauf.oeffneListe(2)
    lauf.aktualisiereVorschlaege(umfeld)
    expect(lauf.vorschlaege.length).toBeGreaterThan(1)
    expect(lauf.entscheideTaste(umfeld, 2, 'Enter')).toBe('uebernehmen')
  })

  test('naechsteLeere ueberspringt, was schon steht', () => {
    const lauf = new ErfassungsLauf()
    lauf.tippe(1, 'ART1')
    expect(lauf.naechsteLeere(umfeld, 0)).toBe(2)
    expect(lauf.naechsteLeere(umfeld, 2)).toBe(3)
    expect(lauf.naechsteLeere(umfeld, 3)).toBe(-1)
  })

  // Eine in der Maske ausgeblendete Spalte hat dort keine Zelle: der Fokus
  // liefe ins Leere und der Bediener saesse fest. Gefuellt wird sie trotzdem
  // — von der Rechnung.
  test('die Tastatur ueberspringt ausgeblendete Spalten', () => {
    const mitVersteckter = umfeldVon(
      umfeld.spalten.map((s, i) => (i === 2 ? { ...s, versteckt: true } : s)),
      {},
    )
    const lauf = new ErfassungsLauf()
    expect(lauf.naechsteLeere(mitVersteckter, 1)).toBe(3)
    expect(lauf.nachbarPlatz(mitVersteckter, 1, 1)).toBe(3)
    expect(lauf.nachbarPlatz(mitVersteckter, 3, -1)).toBe(1)
    expect(lauf.nachbarPlatz(mitVersteckter, 0, -1)).toBe(-1)
  })
})

// P4: Eine erfasste Zeile zur Korrektur zurueckholen. In ihr steht ALLES
// gefuellt — auch der Platz, den die Rechnung selbst ausgerechnet hat. Wird
// er als getippt uebernommen, gilt er als GEGEBEN: die Rechnung hat keine
// Luecke mehr und schweigt. Der Bediener aendert die Tiere, und die alte
// Abgabemenge geht ins ERP (Nutzer-Befund 2026-09-01).
describe('Zurueckholen und die Rechnung', () => {
  const spalten: Spalte[] = [
    { kennung: 's1', titel: 'Artikel', feld: '18_25' },
    { kennung: 's2', titel: 'Tiere', feld: '164_8' },
    { kennung: 's3', titel: 'Dosis', feld: '930_3' },
    { kennung: 's4', titel: 'Menge', feld: '280_12' },
  ]

  const rechnung = {
    ...leereRechnung(),
    menge: { spalte: 's4', runden: { stellen: 3, richtung: 'kfm' as const } },
    anzahl: { spalte: 's2', runden: { stellen: 0, richtung: 'auf' as const } },
    dosis: { spalte: 's3', runden: { stellen: 3, richtung: 'kfm' as const } },
  }

  const umfeld: ErfassungsUmfeld = { ...umfeldVon(spalten, {}), rechnung }

  // Die Zeile, wie sie beim Erfassen entsteht: die Menge ist gerechnet.
  function abgelegteZeile(): string[] {
    const lauf = new ErfassungsLauf()
    lauf.tippe(1, '10')
    lauf.tippe(2, '2')
    lauf.rechne(umfeld)
    return spalten.map((_, i) => lauf.wertVon(umfeld, i))
  }

  test('die gerechnete Menge steht in der abgelegten Zeile', () => {
    expect(abgelegteZeile()).toEqual(['', '10', '2', '20'])
  })

  test('nach dem Zurueckholen folgt die Menge einer geaenderten Tierzahl', () => {
    const lauf = new ErfassungsLauf()
    lauf.uebernimmWerte(umfeld, abgelegteZeile())
    expect(lauf.wertVon(umfeld, 3)).toBe('20')

    lauf.tippe(1, '20')
    lauf.rechne(umfeld)
    expect(lauf.wertVon(umfeld, 3)).toBe('40')
  })

  // Die Gegenprobe: eine von Hand getippte Menge, die NICHT dem Ergebnis
  // entspricht, ist eine Ansage des Bedieners. Sie bleibt stehen — dann
  // rechnet sich die Dosis, nicht die Menge.
  test('eine abweichende Menge bleibt gegeben', () => {
    const lauf = new ErfassungsLauf()
    lauf.uebernimmWerte(umfeld, ['', '10', '2', '25'])
    expect(lauf.wertVon(umfeld, 3)).toBe('25')

    lauf.tippe(1, '20')
    lauf.rechne(umfeld)
    expect(lauf.wertVon(umfeld, 3)).toBe('25')
  })

  // Ohne Rechnung aendert sich am Zurueckholen nichts: jeder Wert ist
  // getippt, keiner rechnet sich nach.
  test('ohne Rechnung bleibt jeder Wert stehen', () => {
    const lauf = new ErfassungsLauf()
    lauf.uebernimmWerte(umfeldVon(spalten, {}), ['', '10', '2', '20'])
    expect(spalten.map((_, i) => lauf.wertVon(umfeldVon(spalten, {}), i)))
      .toEqual(['', '10', '2', '20'])
  })
})
