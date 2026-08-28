import type { PropertyDescription } from '../../../core/blocks/PropertyDescription'
import { useEingabeSitzung } from './eingabeSitzung'
import { FeldMehrzeilig } from '@/ui/werkbank/Feld'
import { Zeile } from '@/ui/werkbank/Zeile'

interface TextareaControlProps {
  property: PropertyDescription
  value: string
  onChange: (value: string) => void

  onBeginBearbeitung?: () => void
  onEndeBearbeitung?: () => void
}

export function TextareaControl({
  property,
  value,
  onChange,
  onBeginBearbeitung,
  onEndeBearbeitung,
}: TextareaControlProps) {
  const sitzung = useEingabeSitzung(onBeginBearbeitung, onEndeBearbeitung)
  return (
    <Zeile breit label={property.name} hinweis={property.description}>
      {(kind) => (
        <FeldMehrzeilig
          {...kind}
          value={value ?? ''}
          maxLength={property.maxLength || undefined}
          onChange={(e) => {
            sitzung.beginnen()
            onChange(e.currentTarget.value)
          }}
          onBlur={sitzung.beenden}
        />
      )}
    </Zeile>
  )
}
