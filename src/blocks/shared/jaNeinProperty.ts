import type { PropertyDescription } from '../../core/blocks/PropertyDescription'

// Die EINE Stelle fuer eine Ja/Nein-Eigenschaft: gleiche Antwortliste,
// gleiche Reihenfolge, gleiche Darstellung. Vorher lag dieselbe Liste
// dreimal im Code, in zwei Reihenfolgen und zwei Darstellungen.
//
// Die REIHENFOLGE der Optionen ist ein Kontrakt: erste = aus, zweite = ein.
// Der Inspector zeichnet daraus eine Kachel (controls/KachelControl) und
// liest die beiden Werte hier heraus, statt "ja"/"nein" selbst zu kennen.
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
