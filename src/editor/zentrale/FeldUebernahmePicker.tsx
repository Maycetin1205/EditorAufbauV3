import { useMemo, type RefObject } from 'react'
import { Liste, type ListeGruppe } from '@/ui/werkbank/Liste'
import { Popover } from '@/ui/werkbank/Popover'
import type {
  FeldUebernahmeZiel,
  UebernahmeFeld,
  UebernahmeQuelle,
} from './feldUebernahme'

interface FeldUebernahmePickerProps {
  sources: readonly UebernahmeQuelle[]
  fields: readonly UebernahmeFeld[]
  ziel: FeldUebernahmeZiel

  // Feldcode der bereits uebernommenen POS/LEN — nur zum Anhaken.
  current: string

  // Der Griff, aus dem die Liste aufgegangen ist: das Popover misst sich
  // daran und laesst den Druck darauf durch, sonst ginge sie sofort wieder auf.
  anker: RefObject<HTMLElement | null>
  onPick: (sourceId: string, code: string) => void
  onClose: () => void
}

const TRENNER = '::'

export function FeldUebernahmePicker({
  sources,
  fields,
  ziel,
  current,
  anker,
  onPick,
  onClose,
}: FeldUebernahmePickerProps) {
  const gruppen: ListeGruppe[] = useMemo(() => {
    if (ziel === 'idb') {
      return [{
        key: 'quellen',
        name: 'Datenquelle',
        eintraege: sources.map((source) => ({ wert: source.sourceId, name: source.sourceName })),
      }]
    }
    return sources
      .map((source) => ({
        key: source.sourceId,
        name: source.sourceName,
        eintraege: fields
          .filter((field) => field.sourceId === source.sourceId)
          .map((field) => ({
            wert: `${field.sourceId}${TRENNER}${field.code}`,
            name: field.label,
            kennung: field.code,
          })),
      }))
      .filter((gruppe) => gruppe.eintraege.length > 0)
  }, [ziel, sources, fields])

  // Uebernommen wird als POS/LEN-Wert — welche QUELLE das Feld hergab, steht
  // nirgends. Angehakt wird darum der erste Treffer mit diesem Feldcode.
  const gewaehlt = ziel === 'feld' && current !== ''
    ? gruppen.flatMap((g) => g.eintraege).find((e) => e.kennung === current)?.wert ?? ''
    : ''

  // Zwei verschiedene Gruende fuer eine leere Liste, und der Unterschied
  // entscheidet, was der Nutzer tun muss: gar keine IDB-Quelle, oder eine
  // ohne Felder mit Position + Laenge.
  const leerHinweis = sources.length === 0
    ? 'Keine Datenquelle der Art „IDB-Tabelle". Andere Arten können hier nicht übernommen werden.'
    : ziel === 'idb'
      ? 'Keine IDB-Quellen.'
      : `Keine Felder mit Position + Länge in ${sources.map((s) => s.sourceName).join(', ')}.`
      + ' Felder stehen im Datencenter an der Quelle.'

  return (
    <Popover
      bezeichnung={ziel === 'feld' ? 'Feld übernehmen' : 'Tabelle übernehmen'}
      anker={anker}
      escapeAbfangen
      onClose={onClose}
    >
      <Liste
        suchbar
        gruppen={gruppen}
        wert={gewaehlt}
        leerHinweis={leerHinweis}
        onWaehle={(wert) => {
          const at = wert.indexOf(TRENNER)
          if (at < 0) onPick(wert, '')
          else onPick(wert.slice(0, at), wert.slice(at + TRENNER.length))
        }}
      />
    </Popover>
  )
}
