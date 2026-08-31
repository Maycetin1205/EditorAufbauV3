import { Link2, X } from '@/ui/zeichen'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Marke } from '@/ui/werkbank/Marke'
import { PickerControl } from '../inspector/controls/PickerControl'
import type { ActionParamBinding, ActionParamSource } from '../../core/data/aktionen'
import type { FeldUebernahmeZiel } from './feldUebernahme'
import { PARAM_QUELLEN, herkunftsEintraege, neueBindung } from './parameter/bindungsRegistry'
import type { ParameterWahlen } from './parameter/wahlen'

export function ParameterZeile({
  nummer,
  kennung = '',
  binding,
  wahlen,
  platzhalter,
  entfernen,
  ausloeser,
  onChange,
  onAusloeser,
}: {
  // Der wievielte Parameter. Steht wie die Schrittnummer in der Kette links
  // und grau — dieselbe Zaehlung, dieselbe Form.
  nummer: number

  // Was die Relationsvorlage an dieser Stelle vorsieht ({PINDEX}, 253_30).
  // Das ist eine KENNUNG und keine Beschriftung (Regel 3), darum steht es in
  // derselben Marke wie jede andere Kennung im Editor — vorher war es nackter
  // Schreibmaschinentext auf 47 px, also fast immer abgeschnitten.
  // Zusatzparameter haben keine Vorlage; dort bleibt der Platz leer, damit
  // die Bedienelemente beider Abschnitte an derselben Kante beginnen.
  kennung?: string
  binding: ActionParamBinding
  wahlen: ParameterWahlen

  platzhalter?: string

  entfernen?: { label: string; onClick: () => void }
  ausloeser?: FeldUebernahmeZiel
  onChange: (binding: ActionParamBinding) => void
  onAusloeser?: (anchor: HTMLElement) => void
}) {
  const { Control } = PARAM_QUELLEN[binding.source]
  const label = kennung === '' ? `${nummer}.` : `${nummer}. ${kennung}`

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-5 shrink-0 text-right text-dicht tabular-nums text-matt">
        {nummer}.
      </span>
      {kennung === ''
        ? <span className="w-20 shrink-0" aria-hidden />
        : <Marke className="w-20" hinweis={kennung}>{kennung}</Marke>}

      <div className="min-w-0 flex-1">
        <PickerControl
          bezeichnung={`Herkunft für ${label}`}
          gruppen={[{ key: 'herkunft', eintraege: herkunftsEintraege(binding, wahlen) }]}
          wert={binding.source}
          onWaehle={(source) => onChange(neueBindung(source as ActionParamSource, wahlen))}
        />
      </div>
      <div
        className="min-w-0 flex-1"
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || !ausloeser || !onAusloeser) return
          e.preventDefault()
          onAusloeser(e.currentTarget)
        }}
      >
        <Control
          binding={binding}
          wahlen={wahlen}
          platzhalter={platzhalter}
          onChange={onChange}
        />
      </div>
      {ausloeser && onAusloeser && (
        <Knopf
          nurZeichen
          aria-label={ausloeser === 'feld' ? 'Feld übernehmen' : 'Tabelle übernehmen'}
          onClick={(e) => onAusloeser(e.currentTarget)}
        >
          <Link2 size={13} />
        </Knopf>
      )}
      {entfernen && (
        <Knopf nurZeichen aria-label={entfernen.label} onClick={entfernen.onClick}>
          <X size={13} />
        </Knopf>
      )}
    </div>
  )
}
