import type { PropertySelectOption } from '../../../core/blocks/PropertyDescription'
import { Farbfeld } from '@/ui/werkbank/Farbfeld'
import { Zeile } from '@/ui/werkbank/Zeile'
import { optionColor } from '../optionColors'

interface ColorTileControlProps {
  label: string
  description?: string
  value: string
  options: PropertySelectOption[]
  onChange: (value: string) => void
}

export function ColorTileControl({ label, description, value, options, onChange }: ColorTileControlProps) {
  return (
    <Zeile breit label={label} hinweis={description}>
      {(kind) => (
        <div {...kind} className="flex flex-wrap items-center gap-1.5">
          {options.map((o) => (
            <Farbfeld
              key={o.value}
              farbe={optionColor(o.value)}
              name={o.label}
              gewaehlt={o.value === value}
              onWaehle={() => onChange(o.value)}
            />
          ))}
        </div>
      )}
    </Zeile>
  )
}
