export type PropertyKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'segment'
  // jaNein ist eine EIGENE Art und kein segment mit zwei Optionen: der
  // Inspector zeichnet es als Kachel statt als Zeile, und das ist eine
  // Entscheidung ueber die FORM, keine ueber die Werte. Gespeichert werden
  // weiter die zwei Zeichenketten aus blocks/shared/jaNeinProperty, damit
  // exportierte Masken unveraendert bleiben.
  | 'jaNein'
  | 'field'
  // quelle speichert die id einer DATENQUELLE — eine ZWEITE Quelle am
  // Baustein, fuer einen eigenen Zweck neben der Quelle, aus der er seinen
  // Inhalt liest (acceptsDataSource). Beispiel: die Liste, aus der das
  // Nachschlage-Feld waehlen laesst. Der Export sammelt sie mit in die
  // SEFILELOOP; ohne das schickte SoftEngine ihre Daten nie und das Fenster
  // bliebe in der fertigen Maske leer.
  | 'quelle'
  | 'relation'
  // seite speichert die id einer SEITE DIESER MASKE (Hauptseite oder
  // Ansicht) — waehlbar ist nur, was es in der Maske gibt: keine freien
  // Links, keine externen Ziele (Nutzer-Vorgabe zur Navi, 2026-08-12).
  // Die id ist ein Editor-Technikwert und bleibt daheim (nurImEditor); was
  // die fertige Maske braucht, ist der KLARNAME der Seite — er wandert wie
  // beim Feld-Control ueber klarnameProp in eine eigene Prop.
  | 'seite'
  // bild speichert eine BILDDATEI als eingebetteten Daten-URI (N5). Der Wert
  // ist der fertige `data:`-String — die Maske laedt nie etwas nach, und eine
  // Maske bleibt EINE Datei. Das Waehlen und das stille Verkleinern macht das
  // Inspector-Control (controls/BildControl); der Baustein bekommt nur das
  // Ergebnis, damit kein Dateidialog im Runtime-Buendel landet.
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
