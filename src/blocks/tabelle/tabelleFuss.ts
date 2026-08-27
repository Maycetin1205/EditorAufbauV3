import { html, nothing, type TemplateResult } from 'lit'
import { vormerkText } from '../shared/vormerkStand'
import { datensatzText } from './suche'

export interface FussLage {
  hatQuelle: boolean

  sichtbar: number
  gesamt: number
  suchtAktiv: boolean
  auswahlAktiv: boolean
  seite: number
  seiten: number

  summen: readonly { titel: string; text: string }[]

  // Die Vormerkungen dieser Tabelle, in ZEILEN. Geschrieben werden sie erst
  // durch eine Kette an einem Knopf — bis dahin sagt die Fusszeile, dass
  // etwas offen ist, und der Knopf sagt es mit denselben Worten.
  erfasst: number

  geaendert: number

  geloescht: number

  // Beim Rollen gibt es nur eine Seite — dann waere „Seite 1 von 1" mit zwei
  // toten Knoepfen daneben. Die Zaehlzeile bleibt, sie traegt den Filterstand.
  blaettert: boolean

  leer: boolean
}

export interface FussHandeln {
  blaettere: (zu: number) => void
}

// Ob es die Fusszeile ueberhaupt gibt, entscheidet sie selbst: sie erscheint
// nur, wenn sie etwas zu sagen hat. Sonst stuende unter jeder kurzen Tabelle
// eine leere Leiste.
export function tabelleFuss(
  lage: FussLage,
  tun: FussHandeln,
): TemplateResult | typeof nothing {
  const vorgemerkt = lage.erfasst + lage.geaendert + lage.geloescht
  const noetig = lage.seiten > 1
    || lage.summen.length > 0
    || vorgemerkt > 0
    || lage.suchtAktiv
    || lage.auswahlAktiv
  if (lage.leer || !noetig) return nothing
  return html`<div class="fusszeile">
    <div class="seiten-info">${datensatzText({
      hatQuelle: lage.hatQuelle,
      sichtbar: lage.sichtbar,
      gesamt: lage.gesamt,
      suchtAktiv: lage.suchtAktiv,
      auswahlAktiv: lage.auswahlAktiv,
    })}</div>
    ${vorgemerkt === 0 ? nothing : html`<div class="vorgemerkt">${
      vormerkText(lage.erfasst, lage.geaendert, lage.geloescht)
    }</div>`}
    ${lage.summen.length === 0 ? nothing : html`<div class="summen">
      ${lage.summen.map((s) => html`<span class="summe">
        <span class="summe-titel">${s.titel}</span>
        <b>${s.text}</b>
      </span>`)}
    </div>`}
    ${!lage.blaettert ? nothing : html`<div class="seiten-nav">
      <button
        aria-label="Seite zurück"
        ?disabled=${lage.seite <= 0}
        @click=${() => tun.blaettere(lage.seite - 1)}
      >‹</button>
      <span>Seite ${lage.seite + 1} von ${lage.seiten}</span>
      <button
        aria-label="Seite vor"
        ?disabled=${lage.seite >= lage.seiten - 1}
        @click=${() => tun.blaettere(lage.seite + 1)}
      >›</button>
    </div>`}
  </div>`
}
