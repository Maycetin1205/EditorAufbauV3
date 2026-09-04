import { html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { vorschlagListeTpl, type Vorschlag } from '../shared/vorschlagListe'
import { zellenzielVon } from './erfassungsZellen'
import { ZELLE_PLATZHALTER, type Spalte } from './spalten'

export interface ErfassungsLage {
  spalten: readonly Spalte[]
  plaetze: readonly number[]

  quelleId: string

  cols: Readonly<Record<string, string>>

  imEditor: boolean

  wert: (index: number) => string

  tippSpalte: number
  vorschlaege: readonly Vorschlag[]
  marke: number

  listeNachOben: boolean
}

export interface ErfassungsHandeln {
  tippen: (index: number, text: string) => void
  taste: (index: number, e: KeyboardEvent) => void
  verlassen: (index: number) => void

  waehleVorschlag: (listenIndex: number) => void
  setzeMarke: (listenIndex: number) => void
}

function eingabe(
  lage: ErfassungsLage,
  tun: ErfassungsHandeln,
  index: number,
  platz: number,
): TemplateResult {
  return html`<input
    class="erf-eingabe"
    type="text"
    data-spalte=${platz}
    placeholder=${lage.spalten[index]?.titel ?? ''}
    .value=${lage.wert(platz)}
    @input=${(e: Event) => tun.tippen(platz, (e.target as HTMLInputElement).value)}
    @keydown=${(e: KeyboardEvent) => tun.taste(platz, e)}
    @blur=${() => tun.verlassen(platz)}
  />`
}

// Keine Lupe in der Erfassungszelle: das große Fenster öffnet F4 oder
// Alt+Pfeil-runter, Enter springt im leeren Feld weiter (Nutzer 2026-09-01).
// Die Lupe am Formularfeld bleibt.
function laufzeitZelle(
  lage: ErfassungsLage,
  tun: ErfassungsHandeln,
  index: number,
  platz: number,
  frei: boolean,
): TemplateResult {
  if (frei) {
    return html`<div class="erf-halter">
      ${eingabe(lage, tun, index, platz)}
    </div>`
  }
  const liste = lage.tippSpalte === platz && lage.vorschlaege.length > 0
  return html`<div class=${lage.listeNachOben ? 'erf-halter nach-oben' : 'erf-halter'}>
    ${eingabe(lage, tun, index, platz)}
    ${liste ? vorschlagListeTpl({
      eintraege: lage.vorschlaege,
      marke: lage.marke,
      onWaehlen: (i) => tun.waehleVorschlag(i),
      onMarke: (i) => tun.setzeMarke(i),
    }) : nothing}
  </div>`
}

export function erfassungsZeileTpl(
  lage: ErfassungsLage,
  tun: ErfassungsHandeln,
): TemplateResult {
  return html`<div class="zeile erfassung" role="row" style=${styleMap(lage.cols)}>
    ${lage.spalten.map((spalte, i) => {
      if (lage.imEditor) {
        return html`<div
          class=${spalte.versteckt === true ? 'versteckt' : nothing}
          role="cell"
        >${ZELLE_PLATZHALTER}</div>`
      }
      const frei = zellenzielVon(spalte, lage.quelleId).art === 'frei'
      return html`<div role="cell">${laufzeitZelle(lage, tun, i, lage.plaetze[i], frei)}</div>`
    })}
  </div>`
}
