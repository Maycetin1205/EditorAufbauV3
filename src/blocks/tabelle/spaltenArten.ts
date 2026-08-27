import { html, nothing, type TemplateResult } from 'lit'
import type { EintragsWahlOption } from '../../core/blocks/BlockDefinition'
import { coerceStatusVariant } from '../shared/statusVariant'
import { tierBild } from '../shared/tierIcon'
import { ZEILEN_HOEHE } from './seitengroesse'
import { BETRAG_NACHKOMMA, ZAHL_NACHKOMMA, zahlText } from './zahlFormat'

export interface Zuordnung {
  wert: string
  name: string
  bedeutung: string
}

export function findeZuordnung(
  zuordnung: readonly Zuordnung[],
  wert: string,
): Zuordnung | undefined {
  const gesucht = wert.trim().toLowerCase()
  return zuordnung.find((z) => z.wert.trim().toLowerCase() === gesucht)
}

export interface ZusatzFeld {
  key: string

  label: string
}

export interface SpaltenArt {
  wert: string

  name: string

  spur: string

  klasse: string

  zusatzFelder?: readonly ZusatzFeld[]

  // Gesetzt: diese Darstellung laesst sich aufaddieren, und zwar mit genau
  // diesen Nachkommastellen. Nicht gesetzt heisst: die Fusszeile bietet fuer
  // sie keine Summe an (Text, Status, Bild).
  summe?: { min: number; max: number }

  // Diese Darstellung laesst sich in der Zeile tippen. Marke und Bild sind
  // keine Eingaben, sondern Uebersetzungen eines Datenwerts — sie stuenden
  // in einem Eingabefeld nur im Weg.
  aenderbar?: boolean

  hoehe?: (felder: Record<string, string>) => number

  zelle: (
    wert: string,
    zuordnung: readonly Zuordnung[],
    zusatz: Record<string, string>,
  ) => TemplateResult | string
}

export const ART_TEXT = 'text'

export const ART_STATUS = 'status'

export const ART_BILD = 'bild'

export const ART_ZAHL = 'zahl'

export const ART_BETRAG = 'betrag'

const FELD_BILD = 'bild'
const FELD_UNTER = 'unter'

export const ZEILEN_HOEHE_BILD = 44

export const SPALTEN_ARTEN: readonly SpaltenArt[] = [
  {
    wert: ART_TEXT,
    name: 'Text',

    spur: 'minmax(0, 1fr)',
    klasse: '',
    aenderbar: true,
    zelle: (wert) => wert,
  },
  {
    wert: ART_ZAHL,
    name: 'Zahl',
    spur: '90px',
    klasse: 'zahl',
    summe: ZAHL_NACHKOMMA,
    aenderbar: true,
    zelle: (wert) => zahlText(wert, ZAHL_NACHKOMMA.min, ZAHL_NACHKOMMA.max),
  },
  {
    wert: ART_BETRAG,
    name: 'Betrag',
    spur: '100px',
    klasse: 'zahl',
    summe: BETRAG_NACHKOMMA,
    aenderbar: true,
    zelle: (wert) => zahlText(wert, BETRAG_NACHKOMMA.min, BETRAG_NACHKOMMA.max),
  },
  {
    wert: 'datum',
    name: 'Datum',
    spur: '100px',
    klasse: 'zahl',
    aenderbar: true,
    zelle: (wert) => wert,
  },
  {
    wert: ART_STATUS,
    name: 'Status',
    spur: '120px',
    klasse: 'status',

    zelle: (wert, zuordnung) => {
      const treffer = findeZuordnung(zuordnung, wert)
      if (!treffer) return html`<span class="chip">${wert}</span>`
      return html`<span class="chip v-${coerceStatusVariant(treffer.bedeutung)}">${
        treffer.name.trim() === '' ? wert : treffer.name
      }</span>`
    },
  },
  {
    wert: ART_BILD,
    name: 'Bild + Name',

    spur: 'minmax(0, 1fr)',
    klasse: 'bild',
    zusatzFelder: [
      { key: FELD_BILD, label: 'Bild' },
      { key: FELD_UNTER, label: 'Unterzeile' },
    ],

    hoehe: (felder) =>
      (felder[FELD_BILD] ?? '') !== '' || (felder[FELD_UNTER] ?? '') !== ''
        ? ZEILEN_HOEHE_BILD
        : ZEILEN_HOEHE,

    zelle: (wert, _zuordnung, zusatz) => {
      const bild = tierBild(zusatz[FELD_BILD] ?? '')
      const unter = zusatz[FELD_UNTER] ?? ''
      return html`<div class="bild-name">
        ${bild === undefined ? nothing : html`<span class="bild-zeichen">${bild}</span>`}
        <div class="bild-text">
          <div class="bild-titel">${wert}</div>
          ${unter === '' ? nothing : html`<div class="bild-unter">${unter}</div>`}
        </div>
      </div>`
    },
  },
]

export function zeilenHoeheFuer(
  spalten: readonly { art: string; felder?: Record<string, string> }[],
): number {
  return spalten.reduce((hoch, s) => {
    const art = spaltenArt(s.art)
    return Math.max(hoch, art.hoehe?.(s.felder ?? {}) ?? ZEILEN_HOEHE)
  }, ZEILEN_HOEHE)
}

// Die Darstellungen, die sich summieren lassen — daraus entsteht die
// Bedingung des Summen-Schalters, statt sie ein zweites Mal aufzuzaehlen.
export const SUMMIERBARE_ARTEN: readonly string[] =
  SPALTEN_ARTEN.filter((a) => a.summe !== undefined).map((a) => a.wert)

export const AENDERBARE_ARTEN: readonly string[] =
  SPALTEN_ARTEN.filter((a) => a.aenderbar === true).map((a) => a.wert)

// Was in der Zelle STEHT — als reiner Text, so wie die Darstellung ihn zeigt.
// Das Eingabefeld einer aenderbaren Spalte braucht ihn (ein Feld traegt
// keinen Baum), und beim Verlassen wird der getippte Wert damit in dieselbe
// Form gebracht. Darstellungen mit Baum (Marke, Bild) sind nicht aenderbar.
export function zellText(art: SpaltenArt, wert: string): string {
  const gezeigt = art.zelle(wert, [], {})
  return typeof gezeigt === 'string' ? gezeigt : wert
}

export function spaltenArt(wert: unknown): SpaltenArt {
  return SPALTEN_ARTEN.find((a) => a.wert === wert) ?? SPALTEN_ARTEN[0]
}

export const SPALTEN_ART_OPTIONEN: readonly EintragsWahlOption[] =
  SPALTEN_ARTEN.map((a) => ({
    wert: a.wert,
    name: a.name,
    ...(a.zusatzFelder ? { felder: a.zusatzFelder } : {}),
  }))

export const FELDER_KEY = 'felder'
