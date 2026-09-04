import { html, nothing, type TemplateResult } from 'lit'
import { ACTION_VALUE_ID_ATTR } from '../../core/data/aktionen'
import type { Spalte } from './spalten'

const VORSATZ = 'ff_spaltenwahl_'

const imGedaechtnis = new Map<string, string[]>()

function wahlSchluessel(el: HTMLElement): string {
  const titel = typeof document === 'undefined' ? '' : document.title
  const id = el.getAttribute(ACTION_VALUE_ID_ATTR)
  if (id !== null && id !== '') return `${VORSATZ}${titel}|${id}`
  const gleiche = Array.from(el.ownerDocument?.querySelectorAll(el.tagName) ?? [])
  return `${VORSATZ}${titel}|#${Math.max(0, gleiche.indexOf(el))}`
}

function ladeWahl(schluessel: string): Set<string> {
  const ausGedaechtnis = imGedaechtnis.get(schluessel)
  if (ausGedaechtnis) return new Set(ausGedaechtnis)
  try {
    const roh = localStorage.getItem(schluessel)
    if (roh === null) return new Set()
    const liste: unknown = JSON.parse(roh)
    if (!Array.isArray(liste)) return new Set()
    return new Set(liste.filter((k): k is string => typeof k === 'string'))
  } catch {
    return new Set()
  }
}

function sichereWahl(schluessel: string, weg: ReadonlySet<string>): void {
  const liste = [...weg]
  imGedaechtnis.set(schluessel, liste)
  try {
    if (liste.length === 0) localStorage.removeItem(schluessel)
    else localStorage.setItem(schluessel, JSON.stringify(liste))
  } catch { /* dann gilt sie fuer die Sitzung */ }
}

export interface SpaltenWahlLage {
  waehlbar: readonly Spalte[]

  weg: ReadonlySet<string>

  links: number
  oben: number
}

export interface SpaltenWahlHandeln {
  schalte: (kennung: string) => void
  alleZeigen: () => void
  schliesse: () => void
}

export function spaltenWahlTpl(
  lage: SpaltenWahlLage | null,
  tun: SpaltenWahlHandeln,
): TemplateResult | typeof nothing {
  if (lage === null) return nothing
  const sichtbare = lage.waehlbar.filter((s) => !lage.weg.has(s.kennung)).length
  return html`<div class="sw-schirm" @pointerdown=${tun.schliesse}></div>
    <div
      class="spaltenwahl"
      role="dialog"
      aria-label="Spalten zeigen oder verbergen"
      style="left: ${lage.links}px; top: ${lage.oben}px"
      @pointerdown=${(e: Event) => e.stopPropagation()}
      @contextmenu=${(e: Event) => e.preventDefault()}
    >
      <p class="sw-titel">Spalten</p>
      ${lage.waehlbar.map((s) => {
        const an = !lage.weg.has(s.kennung)
        const letzte = an && sichtbare <= 1
        return html`<button
          class=${an ? 'sw-zeile an' : 'sw-zeile'}
          type="button"
          role="menuitemcheckbox"
          aria-checked=${an ? 'true' : 'false'}
          ?disabled=${letzte}
          title=${letzte ? 'Die letzte Spalte bleibt stehen.' : ''}
          @click=${() => tun.schalte(s.kennung)}
        ><span class="sw-haken">${an ? '✓' : ''}</span>${s.titel}</button>`
      })}
      ${lage.weg.size === 0 ? nothing : html`<button
        class="sw-alle"
        type="button"
        @click=${tun.alleZeigen}
      >Alle zeigen</button>`}
    </div>`
}

// Der Stand der Bediener-Spaltenwahl: WAS weggenommen ist und OB das Fenster
// gerade offen steht (und wo). Nichts davon ist eine Einstellung des
// Bausteins — es entsteht beim Bedienen der fertigen Maske.
//
// Als eigene Naht wie AnsichtsStand und ErfassungsAnschluss, damit der
// Baustein unter seinem Zeilen-Deckel bleibt. Was die Wahl BEDEUTET und wie
// sie gezeichnet wird, steht weiter in spaltenWahl.ts; hier liegt nur, in
// welchem Zustand sie gerade ist.

const LEERE_WAHL: ReadonlySet<string> = new Set()

export interface SpaltenWahlWirt {
  baustein: HTMLElement

  // Nur in der fertigen Maske und nur mit Kopfzeile — ohne Ueberschrift gibt
  // es keinen Platz fuer den Rechtsklick.
  an: () => boolean

  // Neu zeichnen, und die fluechtigen Spaltenbreiten vergessen: die haengen
  // am Platz der GEZEICHNETEN Spalten, mit einer mehr oder weniger stimmen
  // sie nicht mehr.
  melde: () => void
  breitenVergessen: () => void
}

export class SpaltenWahlStand {
  private readonly wirt: SpaltenWahlWirt

  // Erst beim ersten Lesen aus dem Speicher geholt: `wahlSchluessel` braucht
  // den Maskennamen und das fertige Dokument, beides steht im Konstruktor
  // noch nicht.
  private _weg: Set<string> | null = null

  private _offen: { links: number; oben: number } | null = null

  constructor(wirt: SpaltenWahlWirt) {
    this.wirt = wirt
  }

  get offen(): { links: number; oben: number } | null {
    return this._offen
  }

  weg(): ReadonlySet<string> {
    if (!this.wirt.an()) return LEERE_WAHL
    if (this._weg === null) this._weg = ladeWahl(wahlSchluessel(this.wirt.baustein))
    return this._weg
  }

  private readonly nimmTaste = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return
    this.schliesse()
  }

  // Das eigene Fenster statt des Browser-Menues — genau dafuer ist der
  // Rechtsklick hier vergeben.
  oeffne(e: MouseEvent, rahmen: DOMRect): void {
    e.preventDefault()
    e.stopPropagation()
    this._offen = {
      links: Math.max(4, Math.min(e.clientX - rahmen.left, Math.max(4, rahmen.width - 170))),
      oben: Math.max(4, Math.min(e.clientY - rahmen.top, Math.max(4, rahmen.height - 60))),
    }
    window.addEventListener('keydown', this.nimmTaste)
    this.wirt.melde()
  }

  schliesse(): void {
    if (this._offen === null) return
    this._offen = null
    window.removeEventListener('keydown', this.nimmTaste)
    this.wirt.melde()
  }

  // Eine Spalte weg oder wieder her.
  schalte(kennung: string): void {
    const weg = new Set(this.weg())
    if (weg.has(kennung)) weg.delete(kennung)
    else weg.add(kennung)
    this.merke(weg)
  }

  alleZeigen(): void {
    this.merke(new Set())
  }

  private merke(weg: Set<string>): void {
    this._weg = weg
    sichereWahl(wahlSchluessel(this.wirt.baustein), weg)
    this.wirt.breitenVergessen()
    this.wirt.melde()
  }

  // Beim Abhaengen des Bausteins: die Taste darf nicht am Fenster
  // haengenbleiben (sonst horcht sie weiter, obwohl es die Tabelle nicht
  // mehr gibt).
  loese(): void {
    window.removeEventListener('keydown', this.nimmTaste)
    this._offen = null
  }
}
