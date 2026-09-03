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
  // Die GEZEICHNETEN Spalten; `plaetze[j]` ist der Platz der j-ten in der
  // vollen Liste. Der Lauf haelt seine Werte an der VOLLEN Liste (dorthin
  // rechnet die Rechnung, von dort schreibt die Kette) — gezeichnet wird in
  // der Maske ohne die versteckten. Siehe spalten.ts, spaltenSicht.
  spalten: readonly Spalte[]
  plaetze: readonly number[]

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
  // Der Spaltenname steht blass IN der leeren Zelle (G5): wer reinklickt,
  // sieht sofort, was reingehört — der Klarname ist die Vorschau.
  //
  // `data-spalte` traegt den VOLLEN Platz: daran findet der Baustein die
  // Zelle wieder, wenn er den Fokus setzt (fokussiereErfassungsZelle) — die
  // Zaehlung der gezeichneten Felder stimmte mit versteckten Spalten nicht.
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

// Eine gebundene Zelle kann eine Vorschlagsliste zeigen und braucht dafür
// einen Halter; eine freie Zelle ist nur ein Eingabefeld. Eine Lupe hat hier
// keine: das große Fenster öffnet F4 oder Alt+Pfeil-runter (Enter springt
// im leeren Feld weiter, Nutzer 2026-09-01). Die Lupe am Formularfeld bleibt.
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
      // Im Editor gibt es keine Daten und keine Eingaben, sondern Striche —
      // der Editor erfindet nie Daten (Regel 7).
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
