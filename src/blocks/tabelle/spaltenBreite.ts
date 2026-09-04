import { html, type TemplateResult } from 'lit'
import { SPALTEN_MIN_BREITE, type Spalte } from './spalten'

export interface BreitenAenderung {
  index: number
  breite: number
}

export interface BreitenWirt {
  zeige: (aenderung: readonly BreitenAenderung[]) => void

  uebernimm: (aenderung: readonly BreitenAenderung[]) => void

  verwirf: () => void
}

export function verteileZug(
  linksStart: number,
  rechtsStart: number,
  wunschDx: number,
): { links: number; rechts: number } {
  const untenDx = SPALTEN_MIN_BREITE - linksStart
  const obenDx = rechtsStart - SPALTEN_MIN_BREITE
  const dx = untenDx > obenDx ? 0 : Math.min(obenDx, Math.max(untenDx, Math.round(wunschDx)))
  return { links: Math.round(linksStart + dx), rechts: Math.round(rechtsStart - dx) }
}

function starteZug(e: PointerEvent, index: number, wirt: BreitenWirt): void {
  if (e.button !== 0) return
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

// Greifstreifen mittig auf der Linie, als eigene Gitter-Kinder: `inset: 0` kennt
// erst Chromium 87, SoftEngines eingebauter Browser ist aelter und gab einer Lage
// dort keine Groesse (Nutzer-Befund 2026-08-31).
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

// Der Stand der von Hand gezogenen Breiten. Zwei Ablagen, EIN Zug: im Editor
// schreibt das Loslassen in den Baum (ein Undo-Schritt), in der Maske bleibt
// es beim fluechtigen Stand bis zum Neuladen.
//
// Als eigene Naht wie AnsichtsStand und SpaltenWahlStand, damit der Baustein
// unter seinem Zeilen-Deckel bleibt.
export interface BreitenStandWirt {
  // Im Editor gilt der Baum, in der Maske der fluechtige Stand.
  imEditor: () => boolean

  // Die Griffe zaehlen die GEZEICHNETEN Spalten, gespeichert wird unter dem
  // vollen Platz — ohne die Uebersetzung landete die gezogene Breite hinter
  // einer ausgeblendeten Spalte auf der falschen.
  vollerPlatz: (gezeichnet: number) => number

  spaltenListe: () => Spalte[]

  // Nur im Editor gerufen: die neue Spaltenliste in den Baum melden.
  schreibeSpalten: (spalten: Spalte[]) => void

  melde: () => void
}

export class BreitenStand {
  private readonly wirt: BreitenStandWirt

  // Der fluechtige Stand: Platz in der VOLLEN Liste -> Breite.
  private readonly _breiten = new Map<number, number>()

  // Wie die gerade gezogenen Spalten VOR dem Zug standen — damit Escape genau
  // diese zuruecksetzt und nicht die Breiten, die der Bediener vorher
  // eingestellt hat.
  private _vorZug: Map<number, number | undefined> | null = null

  constructor(wirt: BreitenStandWirt) {
    this.wirt = wirt
  }

  breiteVon(index: number): number | undefined {
    return this._breiten.get(index)
  }

  // Nach einer Spaltenaenderung: die fluechtigen Breiten haengen am PLATZ der
  // Spalte. Kommt eine dazu oder faellt eine weg, zeigen sie auf die falsche.
  vergessen(): void {
    this._breiten.clear()
  }

  private voll(aenderung: readonly BreitenAenderung[]): BreitenAenderung[] {
    return aenderung.map((a) => ({ index: this.wirt.vollerPlatz(a.index), breite: a.breite }))
  }

  wirtFuerZug(): BreitenWirt {
    return {
      zeige: (roh) => {
        const aenderung = this.voll(roh)
        if (this._vorZug === null) {
          this._vorZug = new Map(aenderung.map((a) => [a.index, this._breiten.get(a.index)]))
        }
        for (const a of aenderung) this._breiten.set(a.index, a.breite)
        this.wirt.melde()
      },
      uebernimm: (roh) => {
        const aenderung = this.voll(roh)
        this._vorZug = null
        if (!this.wirt.imEditor()) {
          for (const a of aenderung) this._breiten.set(a.index, a.breite)
          this.wirt.melde()
          return
        }
        // Im Editor gilt der Baum. Der fluechtige Stand muss WEG, sonst
        // ueberdeckte er die gespeicherte Breite und ein spaeteres Undo
        // aenderte sichtbar nichts.
        const liste = this.wirt.spaltenListe()
        for (const a of aenderung) {
          if (a.index >= liste.length) continue
          this._breiten.delete(a.index)
          liste[a.index] = { ...liste[a.index], breite: a.breite }
        }
        this.wirt.schreibeSpalten(liste)
      },
      verwirf: () => {
        const vorher = this._vorZug
        this._vorZug = null
        if (!vorher) return
        for (const [index, wert] of vorher) {
          if (wert === undefined) this._breiten.delete(index)
          else this._breiten.set(index, wert)
        }
        this.wirt.melde()
      },
    }
  }
}
