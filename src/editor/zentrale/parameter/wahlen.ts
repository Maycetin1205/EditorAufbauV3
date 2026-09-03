import type { ReactElement } from 'react'
import type {
  ActionParamBinding,
  ActionParamSource,
  ErgebnisSchritt,
} from '../../../core/data/aktionen'
import type { DataSource } from '../../../core/data/dataSources'
import type {
  AuswahlGeberOption,
  BlockValueOption,
  ErfassungsOption,
} from '../helfer'

// Alles, woraus ein Parameter seinen Wert ziehen kann — als EIN Buendel.
// Vorher reisten dieselben sieben Listen als sieben Props durch zwei Ebenen;
// eine neue Quelle haette an vier Stellen eine achte gebraucht.
export interface ParameterWahlen {
  dataSources: readonly DataSource[]
  blockValues: readonly BlockValueOption[]
  geber: readonly AuswahlGeberOption[]
  erfassungen: readonly ErfassungsOption[]
  aenderungen: readonly ErfassungsOption[]
  loeschungen: readonly ErfassungsOption[]
  schritte: readonly ErgebnisSchritt[]

  // Wenn gesetzt: nur diese Herkuenfte stehen zur Wahl. Eine Datenquelle holt
  // ohne Baustein und ohne laufende Kette — dort waere „Gewaehlte Zeile" oder
  // „Ergebnis von Schritt" kein gesperrter Eintrag, sondern ein sinnloser.
  erlaubt?: readonly ActionParamSource[]
}

export interface BindungsProps {
  binding: ActionParamBinding
  wahlen: ParameterWahlen

  platzhalter?: string
  onChange: (binding: ActionParamBinding) => void
}

// Der Startwert beim Umschalten der Herkunft — ohne `source`, damit ein
// Eintrag der Registry sich nicht auf eine fremde Quelle schreiben kann.
export type BindungsStart = Omit<ActionParamBinding, 'source'>

// Was eine Parameter-Quelle ausmacht, an EINER Stelle je Quelle. Vorher
// stand dasselbe Wissen dreifach verstreut: Anzeigename in einer Tabelle,
// Startwert in `setSource`, Sperrgrund in einem siebenfachen ||-Ausdruck.
export interface QuellenEintrag {
  name: string
  Control: (props: BindungsProps) => ReactElement

  start?: (wahlen: ParameterWahlen) => BindungsStart

  // Wahr = es gibt nichts, woraus diese Quelle waehlen koennte.
  leer?: (wahlen: ParameterWahlen) => boolean
}
