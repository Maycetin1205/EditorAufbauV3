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
  // Die Spalten kommen ueber ihren PLATZ aus der Kopfzeile, nicht ueber
  // Geschwister des Streifens: der Streifen ist selbst ein Kind der
  // Kopfzeile und liegt NEBEN den Kopfzellen, nicht in einer von ihnen.
  const kopf = (e.currentTarget as HTMLElement | null)?.parentElement
  const zellen = [...(kopf?.children ?? [])]
    .filter((k): k is HTMLElement => k instanceof HTMLElement && k.tagName === 'DIV')
  const links = zellen[index]
  const rechts = zellen[index + 1]
  if (!links || !rechts) return

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

  // Beim Anfassen bekommt JEDE Spalte ihren gemessenen Anteil, nicht nur die
  // zwei an der Linie. Damit steht die Summe der Anteile fest, und der Zug
  // verschiebt sichtbar nur die zwei Nachbarn — sonst teilten die uebrigen
  // (noch ungezogenen) Spalten sich bei jedem Zug den Rest neu auf.
  const gemessen = zellen.map((k) => Math.max(1, Math.round(k.getBoundingClientRect().width)))

  const alsPaar = (): BreitenAenderung[] => gemessen.map((breite, i) => {
    if (i === index) return { index: i, breite: letzte.links }
    if (i === index + 1) return { index: i, breite: letzte.rechts }
    return { index: i, breite }
  })

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

// Je Spaltengrenze ein Greifstreifen, MITTIG auf der Linie. Sie sind eigene
// Kinder der Kopfzeile und liegen in derselben Gitter-Spur wie die Kopfzelle
// links von ihnen (`grid-column`) — sie haengen damit an genau derselben
// Gitter-Rechnung wie der Kopf selbst. Keine zweite Spur-Angabe, keine
// Zwischen-Lage, kein `inset`: die Streifen brauchen nichts, was die Tabelle
// nicht ohnehin schon braucht (sie IST ein Gitter). Das ist der Grund fuer
// diese Bauart — `inset: 0` kennt erst Chromium 87, und der eingebaute
// Browser von SoftEngine ist aelter: dort hatte eine Lage keine Groesse und
// kein Streifen war erreichbar (Nutzer-Befund 2026-08-31).
//
// Die Streifen schlucken Klick und Doppelklick — sonst oeffnete das Loslassen
// am Ende des Zugs den Feld-Picker der Spalte (Editor) oder sortierte die
// Tabelle um (Maske).
//
// Vorher lag jeder Streifen INNEN in seiner Kopfzelle und damit vollstaendig
// LINKS der Linie. Gemessen am 2026-08-31: greifbar war `Linie − 9` bis
// `Linie − 1` — der Pixel AUF der Linie und alles rechts davon war tot, und
// weil die Spalten auf Bruchteil-Pixeln liegen, traf dieselbe Handbewegung an
// einer Spalte zu, an der naechsten nicht. Innen lag er, weil die Kopfzelle
// ihren Ueberhang abschneidet (`overflow: hidden`) und ein Streifen ueber der
// Kante zur Haelfte weggeschnitten worden waere — samt seiner Trefferflaeche.
//
// Die LETZTE Grenze fehlt: rechts von der letzten Spalte ist die Kante der
// Tabelle, und dahinter liegt keine Spalte, die Platz hergeben koennte.
export function breitenGriffe(
  spaltenAnzahl: number,
  wirt: BreitenWirt,
): TemplateResult[] {
  return Array.from({ length: Math.max(0, spaltenAnzahl - 1) }, (_, i) => html`<span
    class="breite-griff"
    role="presentation"
    style="grid-row: 1; grid-column: ${i + 1}"
    title="Linie ziehen: links breiter, rechts schmaler"
    @pointerdown=${(e: PointerEvent) => starteZug(e, i, wirt)}
    @click=${(e: MouseEvent) => e.stopPropagation()}
    @dblclick=${(e: MouseEvent) => e.stopPropagation()}
  ></span>`)
}
