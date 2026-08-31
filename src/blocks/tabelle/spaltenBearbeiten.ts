import { html, type TemplateResult } from 'lit'
import { starteUmbenennen } from '../shared/umbenennen'
import {
  SPALTEN_MAX,
  SPALTEN_MIN,
  neueSpalte,
  type Spalte,
} from './spalten'

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
  l.splice(index, 1)
  aendere(l)
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
        if (l.length < SPALTEN_MAX) {
          l.push(neueSpalte(l.length))
          aendere(l)
        }
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
