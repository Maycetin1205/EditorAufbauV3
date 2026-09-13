// Die Tabelle am SoftEngine-Datenstrom: anmelden, Zeilen ableiten, Satznummer lesen.
import type { GesendeteZeilenElement } from '../../core/blocks/BlockDefinition'
import { definitionFuerTag } from '../../core/blocks/blockRegistry'
import { seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, satzIndexVon } from '../../softengine/data'
import { auswahlWiederfinden, geberIdVon, merkmalVon, zeilenNachAuswahl } from '../shared/auswahl'
import { macheDatenAnschluss } from '../shared/datenAnschluss'
import { holeDatenVorspann, type DatenVorspann } from '../shared/datenVorspann'
import { tryCoerceSpalten, type Spalte } from './spalten'
import { zeileGerechnet } from './zeilenRechnung'

export interface RuntimeTableElement extends HTMLElement {
  datenzeilen: string[][]
  rohzeilen: unknown[]
  durchAuswahlGefiltert: boolean
  datenGeliefert: boolean
}

// Wer gesendete Zeilen haelt, sagt die Registry; die Liste selbst haelt keine.
// Danach ist der Ruf unbedingt: eine gemeldete Faehigkeit ohne Vertrag faellt
// auf, statt still nichts zu tun.
function pruefeAnkunft(el: HTMLElement, vorspann: DatenVorspann | null): void {
  if (definitionFuerTag(el.tagName)?.haeltGesendete !== true) return
  const traeger = el as unknown as GesendeteZeilenElement
  traeger.pruefeAnkunft(vorspann === null ? null : {
    // Vor der Auswahl gefiltert: eine Position, die der Auswahlfilter
    // wegnimmt, steht trotzdem im Beleg.
    zeilen: vorspann.zeilen,
    satzVon: (zeile) => satzIndexVon(vorspann.quelle, zeile),
    lies: vorspann.lies,
  })
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

export function zeilenMerkmalVon(el: HTMLElement, rohzeile: unknown): string {
  if (rohzeile == null) return ''
  const satz = zeilenIndexVon(el, rohzeile)
  return satz === '' ? merkmalVon(rohzeile) : JSON.stringify([el.getAttribute('source'), satz])
}

export function hatSatzNummer(el: HTMLElement): boolean {
  const source = findRuntimeDataSource(
    seGlobal().FF_DATA_SOURCES,
    el.getAttribute('source') ?? '',
  )
  return source !== undefined && source.indexField !== ''
}

function hydrateTable(el: RuntimeTableElement, lieferung: boolean): void {
  const vorspann = holeDatenVorspann(el)
  // Erst die Lieferung von SoftEngine beweist den neuen Stand.
  if (lieferung) pruefeAnkunft(el, vorspann)
  if (!vorspann) {
    el.datenzeilen = []
    return
  }
  const spalten = spaltenVon(el)

  const { rows, gefiltert } = zeilenNachAuswahl(el, vorspann.zeilen)

  // Ist die gewaehlte Zeile aus der Liste gefallen, faellt hier die Wahl.
  auswahlWiederfinden(geberIdVon(el), rows, (r) => r, (r) => zeilenMerkmalVon(el, r))

  const lies = vorspann.lies

  el.datenGeliefert = true
  el.rohzeilen = rows
  el.durchAuswahlGefiltert = gefiltert
  el.datenzeilen = rows.map((row) => zeileGerechnet(
    spalten,
    (platz) => {
      const feld = spalten[platz]?.feld ?? ''
      return feld === '' ? '' : lies(row, feld)
    },
  ))
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

export function leiteZeilenAb(
  zeilen: readonly BereitgestellteZeile[],
  spalten: readonly Spalte[],
): AbgeleiteteZeilen {
  return {
    rohzeilen: zeilen.map((z) => z.rohzeile),
    datenzeilen: zeilen.map((z) => zeileGerechnet(spalten, (platz) => z.zellen[platz] ?? '')),
  }
}
