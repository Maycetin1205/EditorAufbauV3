// Der eine Einstieg jeder Datenanzeige: Quelle finden, Zeilen holen, Feldleser bauen.
import { seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, rowsFor, type RuntimeDataSource } from '../../softengine/data'
import { macheFeldLeser, type FeldLeser } from './fremdeQuellen'
import { gewaehlterTag } from './gewaehlterTag'
import { zeilenAmTag } from './tagFilter'

export interface DatenVorspann {
  quelle: RuntimeDataSource

  zeilen: unknown[]

  lies: FeldLeser
}

// null = keine oder eine in der Maske unbekannte Quelle angeschlossen.
export function holeDatenVorspann(el: HTMLElement): DatenVorspann | null {
  const sourceId = el.getAttribute('source') ?? ''
  if (sourceId === '') return null
  const quelle = findRuntimeDataSource(seGlobal().FF_DATA_SOURCES, sourceId)
  if (!quelle) return null
  const zeilen = zeilenAmTag(
    rowsFor(seGlobal().SEDATA, quelle.name, quelle.tableId, quelle.offenerSatz),
    el.getAttribute('tagfield') ?? '',
    gewaehlterTag(),
  )
  return { quelle, zeilen, lies: macheFeldLeser(el) }
}
