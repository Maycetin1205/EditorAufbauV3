// Die Arten einer Datenquelle und was jede kann.
export type DataSourceKind =
  | 'idb'
  | 'adressstamm'
  | 'artikelstamm'
  | 'beleg'
  | 'belegposition'
  | 'datei'
  | 'erpabfrage'
  | 'dataset'
  | 'relationswert'

export interface ArtFeld {
  code: string
  label: string
}

export interface QuellenArt {
  id: DataSourceKind

  name: string

  tabellenId: string

  felderEinzeln: boolean

  kennungLabel: string

  kennungBeispiel: string

  kopfsatzMoeglich: boolean

  kopfsatzStandard: string

  relationLadenMoeglich: boolean

  // Zeilen dieser Art tragen eine Satznummer ({PINDEX}). Reine Lesequellen haben
  // keine; dort machte sie Aendern und Loeschen scheinbar moeglich.
  satzNummerMoeglich: boolean

  varMoeglich: boolean

  bestellBlock: 'sefileloop' | 'erpapicall' | 'dataset'

  // Die Felder dieser Art heissen mit Klarnamen, nicht mit Position und Laenge.
  // Steuert Eingabe UND Pruefung.
  spaltenNamen: boolean

  // Wie die Namensspalte in der Feldliste heisst; leer, wo `spaltenNamen` falsch
  // ist. Die Wortwahl gehoert der Art.
  spaltenLabel: string
  spaltenBeispiel: string

  // 'ID0001' zur IDB-Langform ausschreiben. Bei DataSets ist 'ID0001' die echte
  // Kennung und bleibt stehen.
  idbKurzform: boolean

  feldVorsatzMoeglich: boolean

  // Diese Art holt ihren Wert selbst per Relation und wird nie bestellt.
  holWertMoeglich: boolean

  standardFelder: readonly ArtFeld[]
}

// Ohne feste Tabellen-ID traegt die Quelle sie als eigene Kennung; wer nichts
// bestellt, braucht sie nicht.
export function tabellenKennungNoetig(art: QuellenArt): boolean {
  return art.tabellenId === '' && !art.holWertMoeglich
}

const ARTEN: Record<DataSourceKind, QuellenArt> = {
  idb: {
    id: 'idb',
    name: 'IDB-Tabelle',
    tabellenId: '',
    felderEinzeln: false,
    kennungLabel: 'Kennung',
    kennungBeispiel: 'ID0001',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: true,
    varMoeglich: false,
    bestellBlock: 'sefileloop',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [],
  },
  adressstamm: {
    id: 'adressstamm',
    name: 'Adressstamm',
    tabellenId: 'ADR',
    felderEinzeln: true,
    kennungLabel: '',
    kennungBeispiel: '',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: true,
    varMoeglich: true,
    bestellBlock: 'sefileloop',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [],
  },
  artikelstamm: {
    id: 'artikelstamm',
    name: 'Artikelstamm',
    tabellenId: 'ART',
    felderEinzeln: true,
    kennungLabel: '',
    kennungBeispiel: '',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: true,
    varMoeglich: false,
    bestellBlock: 'sefileloop',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [],
  },
  beleg: {
    id: 'beleg',
    name: 'Beleg',
    tabellenId: 'BEL',
    felderEinzeln: true,
    kennungLabel: '',
    kennungBeispiel: '',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: true,
    varMoeglich: true,

    bestellBlock: 'sefileloop',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [
      { code: '0_11', label: 'Satzschlüssel' },
      { code: '2_1', label: 'Belegart' },
      { code: '3_8', label: 'Belegnummer' },
      { code: '11_8', label: 'Kundennummer' },
      { code: '19_10', label: 'Belegdatum' },
      { code: '393_12', label: 'Warenwert' },
      { code: '441_12', label: 'MwSt-Betrag' },
      { code: '453_12', label: 'Gesamtbetrag' },
      { code: '3440_60', label: 'Name' },
    ],
  },

  belegposition: {
    id: 'belegposition',
    name: 'Belegpositionen',
    tabellenId: 'POS',
    felderEinzeln: true,
    kennungLabel: '',
    kennungBeispiel: '',
    kopfsatzMoeglich: true,
    kopfsatzStandard: 'BEL_0_11',
    relationLadenMoeglich: true,
    satzNummerMoeglich: true,

    varMoeglich: true,

    bestellBlock: 'sefileloop',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [

      { code: '2_1', label: 'Belegart' },
      { code: '3_8', label: 'Belegnummer' },
      { code: '11_6', label: 'Positionsnummer' },

      { code: '17_1', label: 'Zeilenart' },
      { code: '18_25', label: 'Artikelnummer' },
      { code: '45_60', label: 'Bezeichnung' },
      { code: '164_8', label: 'Menge' },
      { code: '246_9', label: 'Einzelpreis' },
      { code: '280_12', label: 'Gesamtpreis' },
      { code: '372_5', label: 'MwSt-Satz' },

      { code: '645_10', label: 'Satznummer' },
      { code: '689_5', label: 'Mengeneinheit' },
      { code: '1401_12', label: 'Rohertrag' },

      { code: '2558_1', label: 'Farbkennzeichen' },
      { code: '3164_12', label: 'Rabatt' },
    ],
  },

  datei: {
    id: 'datei',
    name: 'Andere Datei',
    tabellenId: '',
    felderEinzeln: true,
    kennungLabel: 'Kennung',
    kennungBeispiel: 'SERPOS',
    kopfsatzMoeglich: true,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: true,
    varMoeglich: false,
    bestellBlock: 'sefileloop',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [],
  },

  erpabfrage: {
    id: 'erpabfrage',
    name: 'ERP-Abfrage',
    tabellenId: '',
    felderEinzeln: true,
    kennungLabel: 'Kennung',
    kennungBeispiel: 'LIEFERADRESSE.GET',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: false,
    varMoeglich: false,
    bestellBlock: 'erpapicall',
    spaltenNamen: false,
    spaltenLabel: '',
    spaltenBeispiel: '',
    idbKurzform: true,
    feldVorsatzMoeglich: true,
    holWertMoeglich: false,

    standardFelder: [],
  },
  dataset: {
    id: 'dataset',
    name: 'DataSet',
    tabellenId: '',
    felderEinzeln: true,
    kennungLabel: 'DataSet-ID',
    kennungBeispiel: 'ID0001',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: false,
    varMoeglich: false,
    bestellBlock: 'dataset',
    spaltenNamen: true,
    spaltenLabel: 'Spalte im DataSet',
    spaltenBeispiel: 'z. B. Chargennummer',
    idbKurzform: false,
    feldVorsatzMoeglich: false,
    holWertMoeglich: false,
    standardFelder: [],
  },

  // Kein Loop, kein VAR-Abschnitt, keine Satznummer: EIN Relations-Ruf, seine
  // Antwort als eine Zeile.
  relationswert: {
    id: 'relationswert',
    name: 'Wert per Relation',
    tabellenId: '',
    felderEinzeln: true,
    kennungLabel: '',
    kennungBeispiel: '',
    kopfsatzMoeglich: false,
    kopfsatzStandard: '',
    relationLadenMoeglich: false,
    satzNummerMoeglich: false,
    varMoeglich: false,
    bestellBlock: 'sefileloop',
    spaltenNamen: true,
    spaltenLabel: 'Name in der Antwort',
    spaltenBeispiel: 'z. B. NUMMER',
    idbKurzform: false,
    feldVorsatzMoeglich: false,
    holWertMoeglich: true,
    standardFelder: [],
  },
}

export function artFuer(kind: DataSourceKind): QuellenArt {
  return ARTEN[kind]
}

export const QUELLEN_ARTEN: readonly QuellenArt[] = Object.values(ARTEN)

export const DATA_SOURCE_KINDS: readonly DataSourceKind[] =
  QUELLEN_ARTEN.map((a) => a.id)
