import type { BlockCategory } from './BlockComponent'
import type { FlowDirection, FlowWidth } from './flowLayout'
import type { RasterSpec } from './rasterLayout'
import type {
  PropertyDescription,
  PropertyVisibilityCondition,
} from './PropertyDescription'

export type { BlockCategory }

export interface DefaultChildSpec {
  type: string
  props?: Record<string, unknown>
  children?: readonly DefaultChildSpec[]
}

export interface BindableSpot {
  prop: string
  label: string

  wenn?: PropertyVisibilityCondition

  vorschauProp?: string
}

export interface ActionValueSpot {
  prop: string
  label: string
}

export {
  eintragsFelderLesen,
  eintragsFelderVon,
  eintragsWahlWert,
  eintragsZuordnungLesen,
  feldWahlenLesen,
  fremdeQuelleVon,
  listenStandardTitel,
  listeFuerExport,
  listeLesen,
  schalterAn,
  schalterFuer,
  type EintragsFeldWahl,
  type EintragsSchalter,
  type EintragsWahl,
  type EintragsWahlOption,
  type EintragsZuordnung,
  type ListenBindung,
  type ZuordnungZeile,
} from './listenBindung'
import type { ListenBindung } from './listenBindung'

export type ActionValueSpotsFor<Props> = ReadonlyArray<{
  prop: keyof Props & string
  label: string
}>

export type BindingProp<P extends string = string> = `${P}Field`

export type BindingAttr = `${string}field`

export function bindingProp<P extends string>(prop: P): BindingProp<P> {
  return `${prop}Field`
}

export function bindingAttr(prop: string): BindingAttr {
  return `${prop.toLowerCase()}field`
}

export {
  bindungMitQuelle,
  QUELLEN_TRENNER,
  zerlegeBindung,
  type FeldZiel,
} from './bindung'

export type BindableSpotProp<Props> = keyof Props extends infer K
  ? K extends BindingProp<infer P> ? P : never
  : never

export type BindableSpotsFor<Props> = ReadonlyArray<
  Omit<BindableSpot, 'prop' | 'vorschauProp'> & {
    prop: BindableSpotProp<Props>
    vorschauProp?: keyof Props & string
  }
>

export interface BlockEventSpec {
  key: string
  name: string
}

export interface SatzWahl {
  quelleProp?: string

  wenn?: PropertyVisibilityCondition
}

export type QuellenFaehigkeit = boolean | { wenn: PropertyVisibilityCondition }

// Die Fähigkeit „Erfassungszeile": der Baustein nimmt neue Zeilen entgegen,
// bevor sie im ERP existieren. `wenn` sagt, an welcher Eigenschaft der
// Schalter hängt — Editor (Herkunfts-Wähler), Export (data-ff-block-id) und
// Laufzeit lesen dieselbe Deklaration.
export interface ErfassungsFaehigkeit {
  wenn?: PropertyVisibilityCondition
}

// Die drei Vormerk-Listen eines Bausteins. Ueber diese Vokabel reden Kette,
// Baustein und Statusbalken — der Ketten-Lauf kennt keinen Bausteintyp.
export type VormerkArt = 'erfasst' | 'geaendert' | 'geloescht'

// Der Laufzeit-Vertrag eines Bausteins mit dieser Fähigkeit: die Kette am
// Knopf liest die erfassten Zeilen (Werte je Spalte, in Spalten-Reihenfolge).
// Rein als Typ — die Laufzeit findet den Baustein über data-ff-block-id, nie
// über einen Import (Regel 2).
//
// erfassteSchluessel steht Platz fuer Platz neben erfassteZeilen: eine
// erfasste Zeile hat noch keine Satznummer, und ihr PLATZ taugt nicht als
// Kennung — nimmt der Bediener waehrend eines laufenden GET eine Zeile weg,
// zeigte er hinterher auf die falsche.
export interface ErfassungsTraegerElement {
  erfassteZeilen: readonly (readonly string[])[]
  erfassteSchluessel: readonly string[]
}

// Und derselbe fuer Zeilen, die WEG sollen. Die Werte reisen mit, weil eine
// Loesch-Relation mehr als die Satznummer verlangen kann (Belegart,
// Belegnummer, Positionsnummer stehen in den Spalten).
export interface LoeschTraegerElement {
  geloeschteZeilen: readonly { satz: string; werte: readonly string[] }[]
}

// Derselbe Vertrag fuer GEAENDERTE Zeilen: je Zeile ihre Satznummer (damit
// die Kette weiss, WEN sie schreibt) und die Werte aller Spalten, mit der
// Aenderung darin.
export interface AenderungsTraegerElement {
  geaenderteZeilen: readonly { satz: string; werte: readonly string[] }[]
}

// Der Bericht des Ketten-Laufs an den Baustein, dessen Liste er abarbeitet.
// Ohne ihn waere ein Lauf alles-oder-nichts: ein Fehler in Zeile 3 von 10
// naehme auch den Vormerkungen 4-10 ihre Chance.
//
// laufFertig kommt erst, wenn ALLE Abschnitte durch sind — ein spaeterer
// Abschnitt darf dieselbe Liste noch einmal lesen. Es traegt die
// geschriebenen Zeilen aus und nimmt jede „schreibt"-Marke dieser Liste
// zurueck; die gescheiterte Zeile behaelt ihre.
export interface LaufBerichtElement {
  zeileSchreibt: (art: VormerkArt, schluessel: string) => void
  zeileGescheitert: (art: VormerkArt, schluessel: string, meldung: string) => void
  laufFertig: (art: VormerkArt, geschrieben: readonly string[]) => void
}

export interface BlockDefinition {
  type: string
  tagName: string
  displayName: string
  category: BlockCategory
  defaultProps: Record<string, unknown>
  customProperties: PropertyDescription[]
  acceptsChildren: boolean
  resizableWidth: boolean

  resizableHeight: boolean

  allowedChildTypes?: readonly string[]

  allowedParentTypes?: readonly string[]

  lockedWidth?: FlowWidth

  defaultChildren?: readonly DefaultChildSpec[]

  childDirection?: FlowDirection

  showInPalette?: boolean

  templateChild?: { type: string; label: string }

  containerHint?: boolean

  addChildButton?: { label: string; childType: string }

  acceptsDataSource?: QuellenFaehigkeit

  satzWahl?: SatzWahl

  kannAuswahlFolgen?: boolean

  kannErfassen?: ErfassungsFaehigkeit

  // Wann dieser Baustein Zeilen zum Loeschen vormerken kann — dieselbe Form
  // wie kannErfassen: eine Bedingung an einer Eigenschaft des Bausteins.
  kannLoeschen?: ErfassungsFaehigkeit

  // Der Schluessel des Eintrags-Schalters, der einen Listeneintrag (z. B.
  // eine Spalte) als aenderbar markiert. Gesetzt heisst: dieser Baustein
  // kann einer Kette die GEAENDERTEN Zeilen geben — welcher Baustein das
  // ist, steht damit in der Registry und nicht im Ketten-Code (Regel 2).
  aenderungsSchluessel?: string

  bindableSpots?: readonly BindableSpot[]

  actionValueSpots?: readonly ActionValueSpot[]

  listenBindung?: ListenBindung

  blockEvents?: readonly BlockEventSpec[]

  pageBlock?: boolean

  flaechenSeite?: boolean

  maskenRand?: boolean

  raster?: Partial<RasterSpec>
}
