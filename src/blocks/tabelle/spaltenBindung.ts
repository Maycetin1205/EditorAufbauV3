import type { ListenBindung } from '../../core/blocks/BlockDefinition'
import { STATUS_BEDEUTUNGEN } from '../shared/statusVariant'
import { STANDARD_TITEL } from './spalten'
import {
  AENDERBARE_ARTEN,
  ART_STATUS,
  ART_TEXT,
  FELDER_KEY,
  SPALTEN_ART_OPTIONEN,
  SUMMIERBARE_ARTEN,
} from './spaltenArten'

export const SPALTEN_BINDUNG: ListenBindung = {
  prop: 'spalten',
  titelKey: 'titel',
  feldKey: 'feld',
  standardTitel: STANDARD_TITEL,

  eintragsWahl: {
    key: 'art',
    label: 'Darstellung',
    optionen: SPALTEN_ART_OPTIONEN,
    standard: ART_TEXT,
    felderKey: FELDER_KEY,
  },

  eintragsSchalter: [
    {
      key: 'summe',
      label: 'Summe in der Fußzeile',
      nurBeiWahl: SUMMIERBARE_ARTEN,
    },
    {
      key: 'aenderbar',
      label: 'In der Zeile änderbar',
      nurBeiWahl: AENDERBARE_ARTEN,
    },
  ],

  eintragsZuordnung: {
    key: 'zuordnung',
    label: 'Status-Zuordnung',
    nurBeiWahl: ART_STATUS,
    wertLabel: 'Datenwert',
    nameLabel: 'Klarname',
    bedeutungLabel: 'Bedeutung',
    bedeutungen: STATUS_BEDEUTUNGEN,
  },
}
