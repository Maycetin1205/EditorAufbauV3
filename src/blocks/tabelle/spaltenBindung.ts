import type { ListenBindung } from '../../core/blocks/BlockDefinition'
import { schalterAn, schalterFuer } from '../../core/blocks/listenBindung'
import type { Spalte } from './spalten'
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

      // An, solange niemand ihn ausschaltet: der Bediener erwartet, in jeder
      // Zeile tippen zu koennen (Nutzer-Ansage). Ausschalten braucht, wer eine
      // vom ERP gerechnete Spalte zeigt — Gesamt, Rohertrag: dort schreibt
      // ohnehin keine Kette, und der naechste Datenschub raeumt das Getippte weg.
      standard: true,
    },
  ],

  eintragsFeldWahl: [
    {
      key: 'fuellFeld',
      label: 'Füllfeld',
      hinweis: 'Beim Erfassen füllt der gewählte Satz der Hilfsquelle diese Zelle.'
        + ' Die gebuchte Zeile zeigt weiter das Feld oben.',
      nurFremdeQuellen: true,
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

// Darf der Bediener in dieser Spalte einer GEBUCHTEN Zeile tippen? Dieselbe
// Frage beantwortet der Export ueber traegtAenderungen (treeQuery) — beide
// lesen den Standard aus dem Schalter oben, damit es nur EINE Vorgabe gibt.
export function spalteAenderbar(spalte: Spalte): boolean {
  const eintrag = spalte as unknown as Record<string, unknown>
  const schalter = SPALTEN_BINDUNG.eintragsSchalter?.find((s) => s.key === 'aenderbar')
  return schalter !== undefined
    && spalte.feld !== ''
    && schalterFuer(SPALTEN_BINDUNG, eintrag).includes(schalter)
    && schalterAn(schalter, eintrag)
}
