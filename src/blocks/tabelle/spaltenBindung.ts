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
      // WANN das Feld gilt (Nutzer-Entscheidung 2026-08-28).
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
