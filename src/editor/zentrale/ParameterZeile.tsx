import { Link2, X } from '@/ui/zeichen'
import { Knopf } from '@/ui/werkbank/Knopf'
import { PickerControl } from '../inspector/controls/PickerControl'
import type { ActionParamBinding, ActionParamSource } from '../../core/data/aktionen'
import type { FeldUebernahmeZiel } from './feldUebernahme'
import { PARAM_QUELLEN, herkunftsEintraege, neueBindung } from './parameter/bindungsRegistry'
import type { ParameterWahlen } from './parameter/wahlen'

export function ParameterZeile({
  label,
  binding,
  wahlen,
  platzhalter,
  entfernen,
  ausloeser,
  onChange,
  onAusloeser,
}: {
  label: string
  binding: ActionParamBinding
  wahlen: ParameterWahlen

  platzhalter?: string

  entfernen?: { label: string; onClick: () => void }
  ausloeser?: FeldUebernahmeZiel
  onChange: (binding: ActionParamBinding) => void
  onAusloeser?: (anchor: HTMLElement) => void
}) {
  const { Control } = PARAM_QUELLEN[binding.source]

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-14 shrink-0 truncate font-mono text-dicht" title={label}>{label}</span>

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
