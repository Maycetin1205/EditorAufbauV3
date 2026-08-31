import { html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { vorschlagListeTpl, type Vorschlag } from '../shared/vorschlagListe'
import { zellenzielVon } from './erfassungsZellen'
import { ZELLE_PLATZHALTER, type Spalte } from './spalten'

// Die nächste freie Zeile der Tabelle. Sie ist eine FÄHIGKEIT der Tabelle und
// kein eigener Baustein: ohne den Schalter gibt es sie nicht, und eine Tabelle
// ohne sie exportiert wie zuvor. Einzustellen ist an ihr nichts — was eine
// Zelle tut, leitet erfassungsZellen aus der Bindung der Spalte ab.

export interface ErfassungsLage {
  spalten: readonly Spalte[]

  // Die EINE Quelle der Tabelle — sie entscheidet, ob das Feld einer Spalte
  // ihr eigenes ist oder das einer verknüpften Quelle.
  quelleId: string

  cols: Readonly<Record<string, string>>

  imEditor: boolean

  // Was in der Zelle steht (Laufzeit).
  wert: (index: number) => string

  // Die offene Vorschlagsliste gehört zu GENAU EINER Zelle.
  tippSpalte: number
  vorschlaege: readonly Vorschlag[]
  marke: number

  // Nach OBEN aufklappen. Der Rumpf schneidet ab, was aus ihm herausragt:
  // steht die Zeile ganz unten, wäre eine Liste nach unten unerreichbar.
  // Ist unter ihr noch Platz (leere Tabelle → Zeile 1 ganz oben), klappt sie
  // nach unten — dorthin wächst auch der Rollbereich des Rumpfes mit.
  listeNachOben: boolean

  // Der Einheiten-Umrechner an der Abgabemenge-Zelle (Rechnung): wandelt den
  // getippten Wert einmalig in die Ziel-Einheit um — 5 + „Liter" wird 5000.
  einheitWahl?: {
    index: number
    ziel: string
    optionen: readonly { kennung: string; klarname: string }[]
    umrechnen: (kennung: string) => void
  }
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
): TemplateResult {
  // Der Spaltenname steht blass IN der leeren Zelle (G5): wer reinklickt,
  // sieht sofort, was reingehört — der Klarname ist die Vorschau.
  return html`<input
    class="erf-eingabe"
    type="text"
    placeholder=${lage.spalten[index]?.titel ?? ''}
    .value=${lage.wert(index)}
    @input=${(e: Event) => tun.tippen(index, (e.target as HTMLInputElement).value)}
    @keydown=${(e: KeyboardEvent) => tun.taste(index, e)}
    @blur=${() => tun.verlassen(index)}
  />`
}

// Der Umrechner ist ein Einmal-Griff, kein Zustand: wählen rechnet den
// Zellwert um und die Auswahl springt auf die Kopfzeile (Ziel) zurück.
function einheitenWahl(lage: ErfassungsLage, index: number): TemplateResult | typeof nothing {
  const wahl = lage.einheitWahl
  if (!wahl || wahl.index !== index) return nothing
  return html`<select
    class="erf-einheit"
    title=${`Wert umrechnen — Ziel-Einheit: ${wahl.ziel}`}
    @click=${(e: Event) => e.stopPropagation()}
    @change=${(e: Event) => {
      const select = e.target as HTMLSelectElement
      const kennung = select.value
      select.value = ''
      if (kennung !== '') wahl.umrechnen(kennung)
    }}
  >
    <option value="">${wahl.ziel}</option>
    ${wahl.optionen.map((o) => html`<option value=${o.kennung}>${o.klarname}</option>`)}
  </select>`
}

// Eine gebundene Zelle kann eine Vorschlagsliste zeigen und braucht dafür
// einen Halter; eine freie Zelle ist nur ein Eingabefeld. Eine Lupe hat hier
// keine mehr: Enter in der leeren Zelle öffnet das große Fenster
// (Nutzer-Entscheidung 2026-08-18). Die Lupe am Formularfeld bleibt.
function laufzeitZelle(
  lage: ErfassungsLage,
  tun: ErfassungsHandeln,
  index: number,
  frei: boolean,
): TemplateResult {
  if (frei) {
    return html`<div class="erf-halter">
      ${eingabe(lage, tun, index)}
      ${einheitenWahl(lage, index)}
    </div>`
  }
  const liste = lage.tippSpalte === index && lage.vorschlaege.length > 0
  return html`<div class=${lage.listeNachOben ? 'erf-halter nach-oben' : 'erf-halter'}>
    ${eingabe(lage, tun, index)}
    ${einheitenWahl(lage, index)}
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
      // Im Editor gibt es keine Daten und keine Eingaben, sondern Striche —
      // der Editor erfindet nie Daten (Regel 7).
      if (lage.imEditor) {
        return html`<div role="cell">${ZELLE_PLATZHALTER}</div>`
      }
      const frei = zellenzielVon(spalte, lage.quelleId).art === 'frei'
      return html`<div role="cell">${laufzeitZelle(lage, tun, i, frei)}</div>`
    })}
  </div>`
}
