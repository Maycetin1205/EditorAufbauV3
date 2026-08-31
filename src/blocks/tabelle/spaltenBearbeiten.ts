import { html, type TemplateResult } from 'lit'
import { starteUmbenennen } from '../shared/umbenennen'
import {
  SPALTEN_MAX,
  SPALTEN_MIN,
  SPALTEN_MIN_BREITE,
  neueSpalte,
  type Spalte,
} from './spalten'

// Was die gezogenen Breiten zusammen belegen. Spalten ohne gezogene Breite
// zaehlen nicht mit — die teilen sich, was uebrig bleibt.
function belegt(spalten: readonly Spalte[]): number {
  return spalten.reduce((summe, s) => summe + (s.breite ?? 0), 0)
}

function ohneBreite(s: Spalte): Spalte {
  const kopie = { ...s }
  delete kopie.breite
  return kopie
}

// Alle gezogenen Breiten anteilig auf eine neue Gesamtbreite bringen.
function skaliereAuf(spalten: readonly Spalte[], ziel: number): Spalte[] {
  const gesamt = belegt(spalten)
  if (gesamt <= 0) return [...spalten]
  const faktor = ziel / gesamt
  return spalten.map((s) => ({
    ...s,
    breite: Math.max(SPALTEN_MIN_BREITE, Math.round((s.breite ?? 0) * faktor)),
  }))
}

// Traegt JEDE Spalte eine gezogene Breite, ist das Raster restlos verteilt.
// Nur dann muss beim Anlegen und Streichen gerechnet werden; sonst holt sich
// die mitwachsende Spalte ihren Platz von allein.
function alleFest(spalten: readonly Spalte[]): boolean {
  return spalten.length > 0 && spalten.every((s) => s.breite !== undefined)
}

// Eine Spalte hinten anfuegen.
//
// Der Fall, der es noetig macht (Nutzer-Befund 2026-08-31, "Spalte
// hinzufuegen funktioniert nicht richtig"): sobald jemand jede Linie einmal
// gezogen hat, tragen alle Spalten feste Pixel, und ihre Summe fuellt die
// Tabelle genau aus — das ist die Regel der Nachbar-Verrechnung. Die neue
// Spalte bekam minmax(0, 1fr), also einen Anteil an einem Rest, den es
// nicht mehr gab: NULL Pixel. Sie war angelegt und unsichtbar, der Knopf sah
// kaputt aus.
//
// Jetzt geben die bisherigen anteilig ab, und die Summe bleibt, wie sie war —
// dieselbe Regel wie beim Ziehen einer Linie.
export function fuegeSpalteAn(spalten: readonly Spalte[]): Spalte[] {
  const neu = neueSpalte(spalten.length)
  if (!alleFest(spalten)) return [...spalten, neu]

  const gesamt = belegt(spalten)
  const wunsch = Math.max(SPALTEN_MIN_BREITE, Math.round(gesamt / (spalten.length + 1)))
  const rest = gesamt - wunsch

  // Reicht der Platz nicht, um jede bisherige ueber der Mindestbreite zu
  // halten, waere jede Rechnerei Kosmetik: dann geben alle ihre gezogene
  // Breite ab und teilen sich die Tabelle wieder gleichmaessig. Lieber die
  // Handarbeit verlieren als Spalten, die man nicht mehr sieht.
  if (rest < spalten.length * SPALTEN_MIN_BREITE) {
    return [...spalten.map(ohneBreite), neu]
  }

  return [...skaliereAuf(spalten, rest), { ...neu, breite: wunsch }]
}

// Eine Spalte streichen — von ueberall her, nicht nur hinten. EINE Stelle
// fuer beide Wege: das Kreuz am Spaltenkopf nennt seinen Platz, der
// Minus-Knopf meint immer den letzten. Die letzte verbliebene Spalte bleibt
// stehen: eine Tabelle ohne Spalte waere ein leerer Kasten ohne Weg zurueck.
export function entferneSpalte(
  index: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  if (l.length <= SPALTEN_MIN || index < 0 || index >= l.length) return
  const gesamt = belegt(l)
  l.splice(index, 1)

  // Spiegelbild zum Anfuegen: sind alle Spalten fest, faellt der Platz der
  // gestrichenen sonst als Luecke am rechten Rand an. Die Verbliebenen nehmen
  // ihn anteilig auf, die Summe bleibt gleich.
  aendere(alleFest(l) ? skaliereAuf(l, gesamt) : l)
}

// Kein Stop auf pointerdown (Zug-Regel in editor/canvas/rasterMove.ts) — der
// Stop auf CLICK bleibt, sonst waehlte jeder Knopfdruck die Tabelle mit aus.
export function spaltenSteuerung(
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
  stop: (e: Event) => void,
): TemplateResult {
  return html`<div class="steuerung">
    <button
      title="Letzte Spalte entfernen"
      @click=${(e: Event) => {
        stop(e)
        entferneSpalte(liste().length - 1, liste, aendere)
      }}
    >−</button>
    <button
      title="Spalte hinzufügen"
      @click=${(e: Event) => {
        stop(e)
        const l = liste()
        if (l.length < SPALTEN_MAX) aendere(fuegeSpalteAn(l))
      }}
    >+</button>
  </div>`
}

export function starteTitelEdit(
  e: MouseEvent,
  uebernehmen: (neu: string) => void,
): void {
  const ziel = e.currentTarget as HTMLElement | null
  if (!ziel) return
  e.stopPropagation()
  e.preventDefault()
  starteUmbenennen(ziel, (neu, original) => {
    // Ein leerer oder unveraenderter Titel wird nicht uebernommen — die
    // Anzeige faellt auf den alten Stand zurueck.
    if (neu === '' || neu === original.trim()) return false
    uebernehmen(neu)
    return true
  })
}

export function benenneSpalteUm(
  e: MouseEvent,
  index: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  starteTitelEdit(e, (neu) => {
    const l = liste()
    if (index >= l.length) return
    l[index] = { ...l[index], titel: neu }
    aendere(l)
  })
}

const DOPPELKLICK_FENSTER = 220

const wartenderPicker = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

export function feldPickerAbbestellen(baustein: HTMLElement): void {
  const t = wartenderPicker.get(baustein)
  if (t === undefined) return
  clearTimeout(t)
  wartenderPicker.delete(baustein)
}

export interface FeldPickerRuf {
  prop: string
  index: number

  // Der gerade ANGEZEIGTE Stand reist mit: der Editor braucht ihn als
  // Rückfallebene, wenn die Eigenschaft selbst noch leer ist (Automatik-
  // Spalten des Nachschlagens) — sonst zeigt der Index ins Leere.
  liste?: () => Spalte[]
}

// Das Kreuz am Spaltenkopf: streicht GENAU diese Spalte. Es faengt seinen
// Klick ab, sonst oeffnete derselbe Druck noch den Feld-Picker der Spalte,
// die es gerade weggenommen hat.
export function spaltenKreuz(
  titel: string,
  index: number,
  tun: (index: number) => void,
): TemplateResult {
  return html`<button
    class="kopf-weg"
    type="button"
    title=${`Spalte „${titel}" entfernen`}
    aria-label=${`Spalte „${titel}" entfernen`}
    @pointerdown=${(e: PointerEvent) => e.stopPropagation()}
    @click=${(e: MouseEvent) => { e.stopPropagation(); tun(index) }}
    @dblclick=${(e: MouseEvent) => e.stopPropagation()}
  >&#x2715;</button>`
}

export interface KopfGriffWirt {
  baustein: HTMLElement

  // Im Editor gehoert der Kopfklick dem Binden, an der Maske dem Sortieren.
  editable: () => boolean

  prop: string

  liste: () => Spalte[]

  aendere: (spalten: Spalte[]) => void

  sortiere: (index: number) => void
}

// Was ein Klick und ein Doppelklick auf den Spaltenkopf tun. Steht hier, weil
// alles daran Spaltenbearbeitung ist — der Baustein reicht es nur durch.
export function kopfGriffe(wirt: KopfGriffWirt): {
  dblklickKopf: (e: MouseEvent, index: number) => void
  klickKopf: (e: MouseEvent, index: number) => void
} {
  return {
    dblklickKopf: (e, index) => {
      if (!wirt.editable()) return
      feldPickerAbbestellen(wirt.baustein)
      benenneSpalteUm(e, index, wirt.liste, wirt.aendere)
    },
    klickKopf: (e, index) => {
      if (wirt.editable()) {
        oeffneFeldPicker(wirt.baustein, e, { prop: wirt.prop, index, liste: wirt.liste })
      }
      wirt.sortiere(index)
    },
  }
}

export function oeffneFeldPicker(
  baustein: HTMLElement,
  e: MouseEvent,
  ruf: FeldPickerRuf,
): void {
  e.stopPropagation()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  feldPickerAbbestellen(baustein)
  wartenderPicker.set(baustein, setTimeout(() => {
    wartenderPicker.delete(baustein)
    baustein.dispatchEvent(
      new CustomEvent('ff-listen-bind', {
        detail: {
          prop: ruf.prop,
          index: ruf.index,
          top: rect.bottom + 4,
          left: rect.left,
          ...(ruf.liste ? { liste: ruf.liste() } : {}),
        },
        bubbles: true,
        composed: true,
      }),
    )
  }, DOPPELKLICK_FENSTER))
}
