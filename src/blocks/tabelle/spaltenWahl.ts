import { html, nothing, type TemplateResult } from 'lit'
import { ACTION_VALUE_ID_ATTR } from '../../core/data/aktionen'
import type { Spalte } from './spalten'

// Die Spaltenwahl des BEDIENERS: in der fertigen Maske raeumt er sich seine
// Ansicht selbst auf (Rechtsklick auf eine Spaltenueberschrift) und holt
// Spalten genauso wieder zurueck.
//
// Das ist etwas anderes als `Spalte.versteckt`: DAS ist die Entscheidung des
// Masken-Bauers (eine Hilfsspalte, die nur die Rechnung braucht) und steht
// hier gar nicht zur Wahl. Der Bediener sieht nur, was der Bauer ihm gezeigt
// hat, und darf davon wegnehmen.
//
// Und wie beim Bauer gilt: weggenommen heisst NUR nicht gezeichnet. Werte,
// Ketten-Parameter und Rechnung haengen weiter am Platz in der vollen Liste
// (s. Spalten-Kontrakt in spalten.ts).

const VORSATZ = 'ff_spaltenwahl_'

// Faellt der Browser-Speicher aus (SoftEngines eingebauter Browser ist alt,
// und ob er ihn hergibt, ist unbelegt), haelt die Wahl wenigstens die
// Sitzung. Nichts scheitert still, aber auch nichts laut: eine Ansicht ist
// keine Nachricht wert.
const imGedaechtnis = new Map<string, string[]>()

// Je Maske und Tabelle eine eigene Wahl. Die Baustein-Kennung traegt nicht
// jede Tabelle (nur die adressierbaren), darum der Platz im Dokument als
// Rueckfall.
export function wahlSchluessel(el: HTMLElement): string {
  const titel = typeof document === 'undefined' ? '' : document.title
  const id = el.getAttribute(ACTION_VALUE_ID_ATTR)
  if (id !== null && id !== '') return `${VORSATZ}${titel}|${id}`
  const gleiche = Array.from(el.ownerDocument?.querySelectorAll(el.tagName) ?? [])
  return `${VORSATZ}${titel}|#${Math.max(0, gleiche.indexOf(el))}`
}

export function ladeWahl(schluessel: string): Set<string> {
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

export function sichereWahl(schluessel: string, weg: ReadonlySet<string>): void {
  const liste = [...weg]
  imGedaechtnis.set(schluessel, liste)
  try {
    if (liste.length === 0) localStorage.removeItem(schluessel)
    else localStorage.setItem(schluessel, JSON.stringify(liste))
  } catch { /* dann gilt sie fuer die Sitzung */ }
}

export interface SpaltenWahlLage {
  // Die Spalten, die der BAUER zeigt — nur ueber die entscheidet der
  // Bediener. `kennung` ist der dauerhafte Ausweis (spalten.ts).
  waehlbar: readonly Spalte[]

  weg: ReadonlySet<string>

  // Wo das Fenster steht, gemessen an der Tabelle.
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
        // Die letzte sichtbare Spalte laesst sich nicht auch noch wegnehmen:
        // eine Tabelle ohne jede Spur sieht kaputt aus.
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
