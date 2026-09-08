// Die Tabelle am SoftEngine-Datenstrom: anmelden, Zeilen ableiten, Satznummer lesen.
import { seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, satzIndexVon } from '../../softengine/data'
import { auswahlWiederfinden, geberIdVon, zeilenNachAuswahl } from '../shared/auswahl'
import { macheDatenAnschluss } from '../shared/datenAnschluss'
import { holeDatenVorspann } from '../shared/datenVorspann'
import { tryCoerceSpalten, type Spalte } from './spalten'

export interface RuntimeTableElement extends HTMLElement {
  datenzeilen: string[][]
  rohzeilen: unknown[]
  durchAuswahlGefiltert: boolean
  datenGeliefert: boolean

  // Nur die Erfassung hat Geschriebenes zu vergessen.
  vergissGeschriebene?: () => void
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
  // Erst die Lieferung von SoftEngine beweist den neuen Stand.
  if (lieferung) el.vergissGeschriebene?.()
  const vorspann = holeDatenVorspann(el)
  if (!vorspann) {
    el.datenzeilen = []
    return
  }
  const spalten = spaltenVon(el)

  const { rows, gefiltert } = zeilenNachAuswahl(el, vorspann.zeilen)

  // Ist die gewaehlte Zeile aus der Liste gefallen, faellt hier die Wahl.
  auswahlWiederfinden(geberIdVon(el), rows, (r) => r)

  const lies = vorspann.lies

  el.datenGeliefert = true
  el.rohzeilen = rows
  el.durchAuswahlGefiltert = gefiltert
  el.datenzeilen = rows.map((row) => spalten.map((s) => (s.feld === '' ? '' : lies(row, s.feld))))
}

const anschluss = macheDatenAnschluss<RuntimeTableElement>({ hydriere: hydrateTable })

export const connectTable = anschluss.connect
export const disconnectTable = anschluss.disconnect

export type Datenbesitz = 'softengine' | 'provided'

export interface BereitgestellteZeile {
  rohzeile: unknown

  zellen: readonly string[]
}

export interface AbgeleiteteZeilen {
  rohzeilen: unknown[]
  datenzeilen: string[][]
}

export function leiteZeilenAb(zeilen: readonly BereitgestellteZeile[]): AbgeleiteteZeilen {
  return {
    rohzeilen: zeilen.map((z) => z.rohzeile),
    datenzeilen: zeilen.map((z) => [...z.zellen]),
  }
}
