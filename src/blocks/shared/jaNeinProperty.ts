// Die eine Stelle fuer eine Ja/Nein-Eigenschaft im Inspector.
import type { PropertyDescription } from '../../core/blocks/PropertyDescription'

// Die eine Stelle fuer eine Ja/Nein-Eigenschaft. Die REIHENFOLGE der Optionen
// ist ein Kontrakt: erste = aus, zweite = ein; der Inspector liest sie hier heraus.
export function jaNeinProperty(
  attributeName: string,
  name: string,
  description: string,
  extra?: Partial<PropertyDescription>,
): PropertyDescription {
  return {
    attributeName,
    name,
    description,
    kind: 'jaNein',
    options: [
      { value: 'nein', label: 'Nein' },
      { value: 'ja', label: 'Ja' },
    ],
    ...extra,
  }
}
