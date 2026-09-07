// Wie eine Baustein-Eigenschaft im Inspector aussieht und was sie speichert.
export type PropertyKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'segment'
// jaNein ist eine eigene Art und kein segment mit zwei Optionen: der Inspector
// zeichnet eine Kachel statt einer Zeile. Gespeichert werden weiter die zwei
// Zeichenketten, damit exportierte Masken unveraendert bleiben.
  | 'jaNein'
  | 'field'
// quelle speichert die id einer Datenquelle: eine ZWEITE Quelle am Baustein
// neben der, aus der er seinen Inhalt liest. Der Export sammelt sie mit in die
// SEFILELOOP, sonst bliebe das Fenster in der fertigen Maske leer.
  | 'quelle'
  | 'relation'
// seite speichert die id einer Seite DIESER Maske. Die id bleibt daheim; was die
// fertige Maske braucht, ist der Klarname, und der wandert ueber klarnameProp.
  | 'seite'
// bild speichert eine Bilddatei als eingebetteten Daten-URI: die Maske laedt nie
// etwas nach. Waehlen und Verkleinern macht das Inspector-Control, damit kein
// Dateidialog im Runtime-Buendel landet.
  | 'bild'

export interface PropertySelectOption {
  value: string
  label: string
}

export interface PropertyVisibilityCondition {
  attributeName: string

  equals?: unknown
  notEquals?: unknown

  keinesVon?: readonly unknown[]
}

export function propertySichtbar(
  bedingung: PropertyVisibilityCondition | undefined,
  props: Record<string, unknown>,
): boolean {
  if (!bedingung) return true
  const wert = props[bedingung.attributeName]
  if (bedingung.keinesVon) {
    return !bedingung.keinesVon.some((v) => Object.is(wert, v))
  }
  if ('notEquals' in bedingung) {
    return !Object.is(wert, bedingung.notEquals)
  }
  return Object.is(wert, bedingung.equals)
}

export interface PropertyDescription {
  attributeName: string
  name: string
  description: string
  maxLength?: number
  kind: PropertyKind
  options?: PropertySelectOption[]

  unit?: string
  min?: number
  max?: number

  inspectorRow?: string
  visibleWhen?: PropertyVisibilityCondition
  requiresDataSource?: boolean
  exclusiveAmongSiblings?: boolean

  quelleProp?: string

  klarnameProp?: string

  nurImEditor?: boolean
}
