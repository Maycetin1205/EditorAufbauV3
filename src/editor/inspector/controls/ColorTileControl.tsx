import { Check } from '@/ui/zeichen'
import type { PropertySelectOption } from '../../../core/blocks/PropertyDescription'
import { Zeile } from '@/ui/werkbank/Zeile'
import { cn } from '@/lib/utils'
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
          {options.map((o) => {
            const gewaehlt = o.value === value
            return (
              <button
                key={o.value}
                type="button"

                aria-label={o.label}
                aria-pressed={gewaehlt}
                title={o.label}
                onClick={() => onChange(o.value)}

                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded border border-linie',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent focus-visible:ring-offset-1',
                  gewaehlt ? 'ring-1 ring-akzent ring-offset-1' : 'hover:ring-1 hover:ring-matt hover:ring-offset-1',
                )}
                style={{ backgroundColor: optionColor(o.value) }}
              >
                {gewaehlt && <Check size={13} strokeWidth={3} className="text-grund" />}
              </button>
            )
          })}
        </div>
      )}
    </Zeile>
  )
}
