// Die Eigenschaften der Tabelle und ihrer Spalten, wie der Inspector sie zeigt.
import type { PropertyDescription } from '../../core/blocks/PropertyDescription'
import { jaNeinProperty } from '../shared/jaNeinProperty'
import { leerTextProperty } from '../shared/leerZustand'
import type { ListenBindung } from '../../core/blocks/BlockDefinition'
import { schalterAn, schalterFuer } from '../../core/blocks/listenBindung'
import {
  coerceSpalten,
  fuegeSpalteAn,
  mitVerschobenerSpalte,
  ohneSpalte,
  rechnungNachSpalten,
  SPALTEN_MAX,
  STANDARD_TITEL,
  type Spalte,
} from './spalten'

export const TABELLE_EIGENSCHAFTEN: PropertyDescription[] = [
  jaNeinProperty(
    'tabelleAnsicht',
    'Suchzeile',
    'Zeigt über der Tabelle ein Feld, mit dem der Bediener den Inhalt durchsucht.',
    { requiresDataSource: true },
  ),

  jaNeinProperty(
    'erfassung',
    'Erfassungszeile',
    'Eine leere Zeile zum Tippen neuer Positionen.',
  ),

  jaNeinProperty(
    'loeschbar',
    'Zeilen löschbar',
    'Kreuz an jeder Zeile: merkt sie zum Löschen vor.',
    { requiresDataSource: true },
  ),

  jaNeinProperty(
    'blaettern',
    'Blättern',
    'Ja: Seiten mit Blätter-Knöpfen. Nein: alles untereinander, der Rumpf rollt.',
  ),

  jaNeinProperty(
    'kopfzeile',
    'Kopfzeile',
    'Aus: keine Titelzeile, kein Sortieren per Titelklick.',
  ),

  jaNeinProperty(
    'spaltenwahl',
    'Spaltenwahl',
    'In der Maske: Rechtsklick auf eine Spaltenüberschrift nimmt Spalten weg '
      + 'und holt sie zurück. Braucht die Kopfzeile.',
  ),
  {
    attributeName: 'tagField',
    name: 'Tag filtern nach',
    description: 'Datumsfeld. Gesetzt: nur Sätze des gewählten Tages.',
    kind: 'field',
  },

  leerTextProperty(),
]

export const SPALTEN_BINDUNG: ListenBindung = {
  prop: 'spalten',
  titelKey: 'titel',
  feldKey: 'feld',
  kennungKey: 'kennung',
  standardTitel: STANDARD_TITEL,

  eintragNeu: (props) => {
    const alt = coerceSpalten(props.spalten)
    return alt.length >= SPALTEN_MAX ? {} : { spalten: fuegeSpalteAn(alt) }
  },
  eintragWeg: (props, index) => {
    const alt = coerceSpalten(props.spalten)
    const neu = ohneSpalte(alt, index)
    if (neu === alt) return {}
    const rechnung = rechnungNachSpalten(props.rechnung, alt, neu)
    return { spalten: [...neu], ...(rechnung === null ? {} : { rechnung }) }
  },
  eintragVerschieben: (props, von, nach) => {
    const alt = coerceSpalten(props.spalten)
    const neu = mitVerschobenerSpalte(alt, von, nach)
    return neu === alt ? {} : { spalten: [...neu] }
  },

  // Ohne Einstellung rechnet sich das Fenster bei jedem Oeffnen aus den
  // Tabellenspalten.
  eintragsUnterFenster: {
    label: 'Suchfenster…',
    hinweis: 'Ohne Einstellung nimmt es die Spalten derselben Hilfsquelle.',
    eigenschaft: 'fensterDialogIndex',
  },

  eintragStellen: '[data-ff-eintrag]',

  eintragsSchalter: [
    {
      key: 'summe',
      label: 'Summe in der Fußzeile',
      kurz: 'Summe',
    },
    {
      key: 'aenderbar',
      label: 'In der Zeile änderbar',
      kurz: 'änderbar',
      standard: true,
      nurEigeneQuelle: true,
    },
    {
      key: 'versteckt',
      label: 'In der Maske ausblenden',
      kurz: 'ausgeblendet',
    },
  ],

  herkunftProp: 'spaltenHerkunft',

  eintragsFeldWahl: [
    {
      key: 'fuellFeld',

      // Die Beschriftung muss sagen, WANN das Feld gilt.
      label: 'Nachschlagen',
      hinweis: 'Beim Erfassen füllt der gewählte Satz der Hilfsquelle diese Zelle.',
      nurFremdeQuellen: true,
    },
  ],
}

export function spalteAenderbar(spalte: Spalte): boolean {
  const eintrag = spalte as unknown as Record<string, unknown>
  const schalter = SPALTEN_BINDUNG.eintragsSchalter?.find((s) => s.key === 'aenderbar')
  return schalter !== undefined
    && spalte.feld !== ''
    && schalterFuer(SPALTEN_BINDUNG, eintrag).includes(schalter)
    && schalterAn(schalter, eintrag)
}
