import { seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, satzIndexVon } from '../../softengine/data'
import {
  auswahlWiederfinden,
  geberIdVon,
  zeilenNachAuswahl,
} from '../shared/auswahl'
import { macheDatenAnschluss } from '../shared/datenAnschluss'
import { holeDatenVorspann } from '../shared/datenVorspann'
import { tryCoerceSpalten, type Spalte } from './spalten'

export interface RuntimeTableElement extends HTMLElement {
  datenzeilen: string[][]
  rohzeilen: unknown[]
  auswahlIndex: number
  durchAuswahlGefiltert: boolean
  datenGeliefert: boolean

  vergissGeschriebene: () => void
}

function spaltenVon(el: HTMLElement): Spalte[] {
  return tryCoerceSpalten(el.getAttribute('spalten') ?? '')
}

export function zeilenIndexVon(el: HTMLElement, rohzeile: unknown): string {
  const source = findRuntimeDataSource(
    seGlobal().FF_DATA_SOURCES,
    el.getAttribute('source') ?? '',
  )
  return source ? satzIndexVon(source, rohzeile) : ''
}

export function hatSatzNummer(el: HTMLElement): boolean {
  const source = findRuntimeDataSource(
    seGlobal().FF_DATA_SOURCES,
    el.getAttribute('source') ?? '',
  )
  return source !== undefined && source.indexField !== ''
}

function hydrateTable(el: RuntimeTableElement, lieferung: boolean): void {
  // Erst die Lieferung von SoftEngine beweist den neuen Stand; nur dann
  // duerfen die hinausgeschickten Erfassungszeilen weg (Status 'geschrieben').
  if (lieferung) el.vergissGeschriebene()
  const vorspann = holeDatenVorspann(el)
  if (!vorspann) {
    el.datenzeilen = []
    return
  }
  const spalten = spaltenVon(el)

  const { rows, gefiltert } = zeilenNachAuswahl(el, vorspann.zeilen)

  const auswahlIndex = auswahlWiederfinden(geberIdVon(el), rows, (r) => r)[0] ?? -1

  const lies = vorspann.lies

  el.datenGeliefert = true
  el.rohzeilen = rows
  el.auswahlIndex = auswahlIndex
  el.durchAuswahlGefiltert = gefiltert
  el.datenzeilen = rows.map((row) => spalten.map((s) => (s.feld === '' ? '' : lies(row, s.feld))))
}

const anschluss = macheDatenAnschluss<RuntimeTableElement>({ hydriere: hydrateTable })

export const connectTable = anschluss.connect
export const disconnectTable = anschluss.disconnect
