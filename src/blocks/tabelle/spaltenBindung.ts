import type { ListenBindung } from '../../core/blocks/BlockDefinition'
import { schalterAn, schalterFuer } from '../../core/blocks/listenBindung'
import type { Spalte } from './spalten'
import { coerceSpalten, SPALTEN_MAX, STANDARD_TITEL } from './spalten'
import {
  fuegeSpalteAn,
  mitVerschobenerSpalte,
  ohneSpalte,
  rechnungNachSpalten,
} from './spaltenBearbeiten'

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

  // Das Suchfenster dieser Spalte (F4 in der Erfassungszeile). Ohne
  // Einstellung rechnet es sich bei jedem Oeffnen aus den Tabellenspalten.
  // Der Knopf oeffnet dieselbe Flaeche, die das Formularfeld ueber die Lupe
  // zeigt.
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

      // Nicht „Füllfeld"/„Spaltenfeld" nennen: die Beschriftung muss sagen,
      // WANN das Feld gilt.
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
