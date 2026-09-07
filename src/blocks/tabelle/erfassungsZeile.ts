// Das Umfeld einer Erfassungszeile: Zellenziele, Hilfsquellen, Fensterspalten.
import { html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { vorschlagListeTpl, type Vorschlag } from '../shared/vorschlagListe'
import { fensterSpaltenOder } from './nachschlagen'
import { ZELLE_PLATZHALTER, type Spalte } from './spalten'
import { zerlegeBindung } from '../../core/blocks/BlockDefinition'
import type { Rechnung } from '../../core/data/rechnung'
import type { SchluesselPaar } from '../../core/data/sourceLinks'
import { getField } from '../../softengine/data'

export interface ErfassungsLage {
  spalten: readonly Spalte[]
  plaetze: readonly number[]

  quelleId: string

  cols: Readonly<Record<string, string>>

  imEditor: boolean

  wert: (index: number) => string

  automatisch: (index: number) => boolean

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
    class=${lage.automatisch(platz) ? 'erf-eingabe auto' : 'erf-eingabe'}
    type="text"
    data-spalte=${platz}
    placeholder=${lage.spalten[index]?.titel ?? ''}
    .value=${lage.wert(platz)}
    @input=${(e: Event) => tun.tippen(platz, (e.target as HTMLInputElement).value)}
    @keydown=${(e: KeyboardEvent) => tun.taste(platz, e)}
    @blur=${() => tun.verlassen(platz)}
  />`
}

// Keine Lupe in der Erfassungszelle: das grosse Fenster oeffnet F4 oder
// Alt+Pfeil-runter.
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

export type Zellenart = 'frei' | 'eigen' | 'verknuepft'

export interface Zellenziel {
  art: Zellenart

  quelleId: string

  code: string
}

export interface ErfassungsUmfeld {
  spalten: readonly Spalte[]

  quelleId: string

  paareZu: (quelleId: string) => readonly SchluesselPaar[]

  partnerVon: (quelleId: string) => string

  rechnung?: Rechnung | null
}

export function zellenzielVon(
  spalte: Spalte | undefined,
  tabellenQuelleId: string,
): Zellenziel {
  const fuell = (spalte?.fuellFeld ?? '').trim()
  const feld = fuell !== '' ? fuell : (spalte?.feld ?? '').trim()
  if (feld === '') return { art: 'frei', quelleId: '', code: '' }
  const { quelleId, code } = zerlegeBindung(feld)
  if (quelleId === '') return { art: 'eigen', quelleId: tabellenQuelleId, code }
  return { art: 'verknuepft', quelleId, code }
}

export function zielIn(umfeld: ErfassungsUmfeld, index: number): Zellenziel {
  return zellenzielVon(umfeld.spalten[index], umfeld.quelleId)
}

export function verknuepfteQuellenIn(umfeld: ErfassungsUmfeld): string[] {
  const raus: string[] = []
  for (const spalte of umfeld.spalten) {
    const ziel = zellenzielVon(spalte, umfeld.quelleId)
    if (ziel.art !== 'verknuepft' || ziel.quelleId === '') continue
    if (!raus.includes(ziel.quelleId)) raus.push(ziel.quelleId)
  }
  return raus
}

export function anzeigeSpalteIn(
  umfeld: ErfassungsUmfeld,
  index: number,
): { titel: string; code: string } | undefined {
  const ziel = zielIn(umfeld, index)
  if (ziel.quelleId === '' || ziel.code === '') return undefined
  for (let i = 0; i < umfeld.spalten.length; i++) {
    if (i === index) continue
    const spalte = umfeld.spalten[i]
    const anderes = zellenzielVon(spalte, umfeld.quelleId)
    if (anderes.quelleId !== ziel.quelleId) continue
    if (anderes.code === '' || anderes.code === ziel.code) continue
    return { titel: spalte.titel, code: anderes.code }
  }
  return undefined
}

export function fensterSpaltenIn(umfeld: ErfassungsUmfeld, index: number): Spalte[] {
  return fensterSpaltenOder(
    umfeld.spalten[index]?.fensterSpalten,
    () => automatikSpaltenIn(umfeld, index),
  )
}

// Die Automatik der Tabellenspalte: alle Spalten, die auf dieselbe Hilfsquelle
// zeigen, jedes Feld einmal.
function automatikSpaltenIn(umfeld: ErfassungsUmfeld, index: number): Spalte[] {
  const ziel = zielIn(umfeld, index)
  if (ziel.art !== 'verknuepft' || ziel.quelleId === '' || ziel.code === '') return []
  const raus: Spalte[] = []
  for (const spalte of umfeld.spalten) {
    const anderes = zellenzielVon(spalte, umfeld.quelleId)
    if (anderes.quelleId !== ziel.quelleId || anderes.code === '') continue
    if (raus.some((s) => s.feld === anderes.code)) continue
    raus.push({ kennung: '', titel: spalte.titel, feld: anderes.code })
  }
  return raus
}

export function passendeSaetze(
  paare: readonly SchluesselPaar[],
  schluesselWert: (feld: string) => string | undefined,
  kandidaten: readonly unknown[],
): unknown[] {
  const bekannte = paare
    .map((p) => ({ toField: p.toField, soll: schluesselWert(p.fromField) }))
    .filter((b): b is { toField: string; soll: string } => b.soll !== undefined)
  if (bekannte.length === 0) return [...kandidaten]
  return kandidaten.filter((satz) => bekannte.every(
    (b) => b.soll !== '' && b.soll === getField(satz, b.toField),
  ))
}
