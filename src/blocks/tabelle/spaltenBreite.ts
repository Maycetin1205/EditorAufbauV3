import { html, type TemplateResult } from 'lit'
import { SPALTEN_MIN_BREITE } from './spalten'

export interface BreitenAenderung {
  index: number
  breite: number
}

// Was der Zug an der Spaltenkante braucht und wohin er sein Ergebnis gibt.
// Wer die Breite haelt, entscheidet der Baustein — im Editor der Baum (ein
// Undo-Schritt), in der Maske ein fluechtiger Stand bis zum Neuladen.
export interface BreitenWirt {
  // Waehrend des Zugs: neu zeichnen, noch nichts festschreiben.
  zeige: (aenderung: readonly BreitenAenderung[]) => void

  // Beim Loslassen: der Stand gilt.
  uebernimm: (aenderung: readonly BreitenAenderung[]) => void

  // Zug abgebrochen (Escape, Fensterwechsel) — zurueck auf den Stand davor.
  verwirf: () => void
}

// Eine Linie gehoert ZWEI Spalten: der links von ihr und der rechts von ihr.
// Was die eine gewinnt, gibt die andere ab — die Summe der beiden bleibt
// gleich, und darum bleibt auch der Platz gleich, den sich alle uebrigen
// Spalten teilen. Ohne diese Rechnung wuerde jede andere Spalte bei jedem Zug
// neu aufgeteilt, obwohl der Bediener nur EINE Linie angefasst hat.
export function verteileZug(
  linksStart: number,
  rechtsStart: number,
  wunschDx: number,
): { links: number; rechts: number } {
  const untenDx = SPALTEN_MIN_BREITE - linksStart
  const obenDx = rechtsStart - SPALTEN_MIN_BREITE
  // Sind beide Spalten schon an der Mindestbreite, ist `unten` groesser als
  // `oben` — dann darf sich gar nichts bewegen.
  const dx = untenDx > obenDx ? 0 : Math.min(obenDx, Math.max(untenDx, Math.round(wunschDx)))
  return { links: Math.round(linksStart + dx), rechts: Math.round(rechtsStart - dx) }
}

// Der Griff faengt seinen pointerdown ab — das ist die AUSNAHME von der
// Zug-Regel (editor/canvas/rasterMove.ts: Druecken + Bewegen zieht sonst
// immer den ganzen Baustein). Ohne den Stop verschoebe jeder Spaltenzug im
// Editor die Tabelle auf der Flaeche, statt die Spalte zu weiten.
function starteZug(e: PointerEvent, index: number, wirt: BreitenWirt): void {
  if (e.button !== 0) return
  const griff = e.currentTarget as HTMLElement | null
  const links = griff?.parentElement
  const rechts = links?.nextElementSibling
  if (!links || !(rechts instanceof HTMLElement)) return

  e.stopPropagation()
  e.preventDefault()

  const startX = e.clientX
  const linksStart = links.getBoundingClientRect().width
  const rechtsStart = rechts.getBoundingClientRect().width
  let letzte = verteileZug(linksStart, rechtsStart, 0)

  const aufraeumen = (): void => {
    window.removeEventListener('pointermove', beiBewegung)
    window.removeEventListener('pointerup', beiLoslassen)
    window.removeEventListener('pointercancel', beiAbbruch)
    window.removeEventListener('keydown', beiTaste)
    window.removeEventListener('blur', beiAbbruch)
  }

  const alsPaar = (): BreitenAenderung[] => [
    { index, breite: letzte.links },
    { index: index + 1, breite: letzte.rechts },
  ]

  function beiBewegung(ev: PointerEvent): void {
    letzte = verteileZug(linksStart, rechtsStart, ev.clientX - startX)
    wirt.zeige(alsPaar())
  }

  function beiLoslassen(): void {
    aufraeumen()
    wirt.uebernimm(alsPaar())
  }

  function beiAbbruch(): void {
    aufraeumen()
    wirt.verwirf()
  }

  function beiTaste(ev: KeyboardEvent): void {
    if (ev.key !== 'Escape') return
    ev.preventDefault()
    beiAbbruch()
  }

  window.addEventListener('pointermove', beiBewegung)
  window.addEventListener('pointerup', beiLoslassen)
  window.addEventListener('pointercancel', beiAbbruch)
  window.addEventListener('keydown', beiTaste)
  window.addEventListener('blur', beiAbbruch)
}

// Der Greifstreifen auf der Linie zwischen zwei Spalten. Er schluckt auch
// Klick und Doppelklick: sonst oeffnete das Loslassen am Ende des Zugs den
// Feld-Picker der Spalte (Editor) oder sortierte die Tabelle um (Maske).
// Die LETZTE Spalte bekommt keinen — ihre rechte Kante ist die Kante der
// Tabelle, und dahinter liegt keine Spalte, die den Platz hergeben koennte.
export function breitenGriff(index: number, wirt: BreitenWirt): TemplateResult {
  return html`<span
    class="breite-griff"
    role="presentation"
    title="Linie ziehen: links breiter, rechts schmaler"
    @pointerdown=${(e: PointerEvent) => starteZug(e, index, wirt)}
    @click=${(e: MouseEvent) => e.stopPropagation()}
    @dblclick=${(e: MouseEvent) => e.stopPropagation()}
  ></span>`
}
