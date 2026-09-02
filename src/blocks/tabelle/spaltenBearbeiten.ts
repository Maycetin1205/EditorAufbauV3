import {
  ohneSpalten,
  rechnungAlsAttribut,
  rechnungVonAttribut,
} from '../../core/data/rechnung'
import { starteUmbenennen } from '../shared/umbenennen'
import {
  SPALTEN_MIN,
  mitKennungen,
  neueSpalte,
  type Spalte,
} from './spalten'

// Eine Spalte hinten anfuegen. Hier wird NICHT gerechnet: die Breiten sind
// Anteile (spalten.ts: spaltenRaster), die neue Spalte bekommt den mittleren
// Anteil, und das Raster fuellt die Tabelle von allein wieder aus. Die zwei
// Anlaeufe davor haben die Summe fester Pixel umverteilt (7f92603, dann
// 040b73c mit einem Wasserfall) — beide behandelten nur das Symptom.
export function fuegeSpalteAn(spalten: readonly Spalte[]): Spalte[] {
  return mitKennungen([...spalten, neueSpalte(spalten.length)])
}

// Die Rechnung zeigt ueber die dauerhafte Kennung auf ihre Spalten. Wird eine
// gestrichen, wird der Platz leer (= unbenutzt) — sonst rechnete die Maske mit
// einer Spalte, die es nicht mehr gibt, und die naechste neue Spalte kann
// dieselbe Kennung wieder bekommen. Rueckgabe: das neue Attribut, oder null,
// wenn nichts abzuraeumen ist. Gegenstueck fuer die Ketten-Parameter im ganzen
// Baum: state/spaltenAufraeumen.ts.
export function rechnungNachSpalten(
  roh: unknown,
  alt: readonly Spalte[],
  neu: readonly Spalte[],
): string | null {
  const rechnung = rechnungVonAttribut(roh)
  if (!rechnung) return null
  const bleibt = new Set(neu.map((s) => s.kennung))
  const gestrichen = alt.map((s) => s.kennung).filter((k) => k !== '' && !bleibt.has(k))
  const geputzt = ohneSpalten(rechnung, gestrichen)
  return geputzt === rechnung ? null : rechnungAlsAttribut(geputzt)
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
  const neu = ohneSpalte(l, index)
  if (neu !== l) aendere([...neu])
}

// Streicht GENAU diese Spalte — rein: dieselbe Liste zurueck heisst „nicht
// erlaubt" (letzte Spalte, Platz ausserhalb). Die verbliebenen Anteile
// fuellen die Tabelle wieder aus (spaltenRaster), der Platz der gestrichenen
// bleibt nicht als leere Flaeche stehen (Nutzer-Befund 2026-08-31).
export function ohneSpalte(spalten: readonly Spalte[], index: number): readonly Spalte[] {
  if (spalten.length <= SPALTEN_MIN || index < 0 || index >= spalten.length) return spalten
  return spalten.filter((_, i) => i !== index)
}

// Eine Spalte an einen anderen Platz setzen. `nach` = Ziel-Platz in der
// Liste. Alles Ihre reist im Eintrag mit (Kennung, Titel, Belegfeld,
// Fuellfeld, Breite); Ketten und Rechnung zeigen auf die KENNUNG und
// brauchen deshalb kein Nachziehen — genau dafuer gibt es sie (spalten.ts).
export function verschiebeSpalteAn(
  von: number,
  nach: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  if (von < 0 || von >= l.length) return
  const ziel = Math.max(0, Math.min(nach, l.length - 1))
  if (ziel === von) return
  const [spalte] = l.splice(von, 1)
  l.splice(ziel, 0, spalte)
  aendere(l)
}

export interface SpaltenZugWirt {
  editable: () => boolean

  liste: () => Spalte[]

  aendere: (spalten: Spalte[]) => void

  // Ein anstehender Feld-Picker (Einzelklick kurz davor) gehoert abbestellt,
  // bevor der Zug die Spalten umbaut.
  vorZug: () => void
}

// Ab so vielen Pixeln ist der Druck ein ZUG — darunter bleibt er Klick
// (Feld waehlen) oder Doppelklick (umbenennen). Derselbe Gedanke wie die
// Zug-Regel der Bausteine (editor/canvas/rasterMove.ts).
const ZUG_SCHWELLE = 5

// Spalte am Kopf anfassen und an ihren neuen Platz ziehen (Nutzer 2026-09-01:
// „anklicken, halten, verschieben" statt Pfeil-Knoepfen, an denen man sich
// verklickt). Der Kopf behaelt dafuer seinen pointerdown — wie die
// Breiten-Griffe; der Baustein selbst bleibt von ueberall sonst ziehbar.
export function starteSpaltenZug(e: PointerEvent, index: number, wirt: SpaltenZugWirt): void {
  if (e.button !== 0 || !wirt.editable()) return
  // Waehrend des Umbenennens gehoert die Maus dem Text.
  if (e.target instanceof HTMLElement && e.target.isContentEditable) return
  const kopf = (e.currentTarget as HTMLElement | null)?.parentElement
  if (!kopf) return
  const zellen = [...kopf.children]
    .filter((k): k is HTMLElement => k instanceof HTMLElement && k.tagName === 'DIV')
  if (zellen.length < 2) return
  e.stopPropagation()

  const startX = e.clientX
  let zieht = false
  let slot = index

  // Der Einfuege-Slot: vor welcher Zelle der Zeiger steht (die Zellmitte
  // trennt); hinter der letzten ist Slot = Anzahl.
  const slotVon = (x: number): number => {
    for (let i = 0; i < zellen.length; i++) {
      const r = zellen[i].getBoundingClientRect()
      if (x < r.left + r.width / 2) return i
    }
    return zellen.length
  }

  const zeige = (s: number): void => {
    zellen.forEach((z, i) => {
      z.classList.toggle('zug-quelle', zieht && i === index)
      z.classList.toggle('zug-slot', zieht && i === s)
      z.classList.toggle('zug-slot-ende', zieht && s === zellen.length && i === zellen.length - 1)
    })
  }

  // Der Klick, der nach dem Loslassen folgt, gehoert dem Zug — nicht dem
  // Feld-Picker oder dem Sortieren.
  const schluckeKlick = (ev: MouseEvent): void => {
    ev.stopPropagation()
    ev.preventDefault()
  }

  const aufraeumen = (): void => {
    window.removeEventListener('pointermove', beiBewegung)
    window.removeEventListener('pointerup', beiEnde)
    window.removeEventListener('pointercancel', beiAbbruch)
    window.removeEventListener('blur', beiAbbruch)
    const war = zieht
    zieht = false
    zeige(-1)
    if (war) document.body.style.cursor = ''
  }

  function beiBewegung(ev: PointerEvent): void {
    if (!zieht) {
      if (Math.abs(ev.clientX - startX) < ZUG_SCHWELLE) return
      zieht = true
      wirt.vorZug()
      document.body.style.cursor = 'grabbing'
      window.addEventListener('click', schluckeKlick, { capture: true, once: true })
    }
    ev.preventDefault()
    slot = slotVon(ev.clientX)
    zeige(slot)
  }

  function beiEnde(): void {
    const war = zieht
    const s = slot
    aufraeumen()
    if (!war) return
    // Slot -> Ziel-Platz: rechts vom alten Platz sitzt die Liste nach dem
    // Herausnehmen einen Platz weiter links.
    verschiebeSpalteAn(index, s > index ? s - 1 : s, wirt.liste, wirt.aendere)
  }

  function beiAbbruch(): void {
    // Es folgt kein Klick, den es zu schlucken gaebe.
    if (zieht) window.removeEventListener('click', schluckeKlick, true)
    aufraeumen()
  }

  window.addEventListener('pointermove', beiBewegung)
  window.addEventListener('pointerup', beiEnde)
  window.addEventListener('pointercancel', beiAbbruch)
  window.addEventListener('blur', beiAbbruch)
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
