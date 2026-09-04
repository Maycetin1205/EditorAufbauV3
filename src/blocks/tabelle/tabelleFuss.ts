import { html, nothing, type TemplateResult } from 'lit'
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

  erfasst: number

  geaendert: number

  geloescht: number

  blaettert: boolean

  leer: boolean
}

export interface FussHandeln {
  blaettere: (zu: number) => void
}

export function tabelleFuss(
  lage: FussLage,
  tun: FussHandeln,
): TemplateResult | typeof nothing {
  const noetig = lage.seiten > 1
    || lage.summen.length > 0
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
