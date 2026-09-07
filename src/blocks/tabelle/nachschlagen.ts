// Das Nachschlage-Fenster: dieselbe Flaeche fuer die Editor-Lupe und die Laufzeit-Wahl.
import { html, nothing, render, type TemplateResult } from 'lit'
import type { ListenBindung } from '../../core/blocks/listenBindung'
import { seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, getField, rowsFor } from '../../softengine/data'
import { meldeFehler } from '../../softengine/meldung'
import { zeilenNachAuswahl } from '../shared/auswahl'
import { lupeZeichen } from '../shared/lupeZeichen'
import {
  DIALOG_RAHMEN_TAG,
  type DialogGroesseDetail,
  type DialogRahmen,
} from '../shared/DialogRahmen'
import { coerceSpalten, STANDARD_TITEL, type Spalte } from './spalten'
import type { TabelleBlock } from './TabelleBlock'
import {
  ZEILE_AKTIVIERT_EVENT,
  type ZeileAktiviertDetail,
} from './zeilenAktivierung'

export const FENSTER_BREITE = 520
export const FENSTER_HOEHE = 380

// Das Startmass ist fuer ZWEI Spalten gemacht; die Erfassungszeile gibt alle
// Spalten ihrer Quelle mit, das koennen sechs sein.
export function fensterBreiteFuer(spalten: number): number {
  return Math.min(900, Math.max(FENSTER_BREITE, 160 + 180 * spalten))
}

export function nachschlagFeldTpl(args: {
  wert: string
  onTippen: (wert: string) => void
  onTaste: (e: KeyboardEvent) => void
  onVerlassen: () => void
  onLupe: () => void

  liste: TemplateResult | typeof nothing
}): TemplateResult {
  return html`<div class="nachschlag">
    <input
      class="ctrl"
      type="text"
      .value=${args.wert}
      @input=${(e: Event) => args.onTippen((e.target as HTMLInputElement).value)}
      @keydown=${args.onTaste}
      @blur=${() => args.onVerlassen()}
    />
    <button
      class="lupe"
      type="button"
      aria-label="Nachschlagen"
      title="Nachschlagen"
      @click=${() => args.onLupe()}
    >${lupeZeichen()}</button>
    ${args.liste}
  </div>`
}

// Die Spalten des Fensters wohnen am FELD und werden an der Lupe eingestellt.
// Leer heisst Automatik: eine Spalte, mit eigenem Anzeigefeld zwei.
export const NACHSCHLAG_SPALTEN_BINDUNG: ListenBindung = {
  prop: 'nachschlagSpalten',
  titelKey: 'titel',
  feldKey: 'feld',
  standardTitel: STANDARD_TITEL,
  quelleProp: 'nachschlagQuelle',
}

export function coerceNachschlagSpalten(v: unknown): Spalte[] {
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v)
    } catch {
      return []
    }
  }
  return Array.isArray(v) && v.length > 0 ? coerceSpalten(v) : []
}

export interface NachschlagenArgs {
  el: HTMLElement
  quelleId: string
  speicherFeld: string
  speicherTitel: string

  spalten: readonly Spalte[]
  titel: string

  breite: number
  hoehe: number
  onUebernehmen: (anzeige: string, wert: string, satz: unknown) => void

  // Gesetzt: der Aufrufer hat seine Eintraege schon, dann zeigt das Fenster genau
  // dieselben Saetze wie die Vorschlagsliste daneben.
  eintraege?: readonly Eintrag[]

  // Ohne Angabe die erste Lupe des Bausteins; die Erfassungszeile hat mehrere.
  rueckFokus?: HTMLElement | null

  // Was der Bediener schon getippt hat; es steht beim Aufmachen in der Suche des
  // Fensters.
  suchtext?: string
}

export interface Eintrag {
  anzeige: string
  wert: string

  satz: unknown
}

export interface NachschlagEinstellung {
  el: HTMLElement
  quelleId: string
  speicherFeld: string

  spalten: readonly Spalte[]
}

// Was im FELD steht, ist die erste Spalte des Fensters.
function anzeigeFeldVon(spalten: readonly Spalte[], speicherFeld: string): string {
  const erste = spalten[0]
  return erste === undefined ? speicherFeld : erste.feld
}

function nurEineSpalte(anzeigeFeld: string, speicherFeld: string): boolean {
  const anzeige = anzeigeFeld.trim()
  return anzeige === '' || anzeige === speicherFeld.trim()
}

export function nachschlagEintraege(
  rows: readonly unknown[],
  anzeigeFeld: string,
  speicherFeld: string,
): Eintrag[] {
  const anzeigeCode = anzeigeFeld.trim()
  const eintraege: Eintrag[] = []
  const einspaltig = nurEineSpalte(anzeigeFeld, speicherFeld)
  const gesehen = new Set<string>()
  for (const row of rows) {
    const wert = getField(row, speicherFeld).trim()
    const anzeige = anzeigeCode === '' ? wert : getField(row, anzeigeCode).trim()
    if (anzeige === '' && wert === '') continue
    if (einspaltig) {
      if (gesehen.has(wert)) continue
      gesehen.add(wert)
    }
    eintraege.push({ anzeige, wert, satz: row })
  }
  return eintraege
}

function fensterEintraege(
  el: HTMLElement,
  rows: unknown[],
  anzeigeFeld: string,
  speicherFeld: string,
): Eintrag[] {
  return nachschlagEintraege(zeilenNachAuswahl(el, rows).rows, anzeigeFeld, speicherFeld)
}

export type EintraegeErgebnis =
  | { ok: true; eintraege: Eintrag[] }
  | { ok: false; grund: 'unvollstaendig' | 'quelleFehlt' }

// Getrennt von holeEintraege: die Erfassungszeile braucht dieselben Saetze, aber
// NICHT die Auswahl-Folgen ihres Bausteins — die wuerden jeden Nachschlage-Satz
// wegfiltern.
export function quellenZeilen(quelleId: string): unknown[] | null {
  const quelle = findRuntimeDataSource(seGlobal().FF_DATA_SOURCES, quelleId)
  if (!quelle) return null
  return rowsFor(seGlobal().SEDATA, quelle.name, quelle.tableId, quelle.offenerSatz)
}

export function holeEintraege(e: NachschlagEinstellung): EintraegeErgebnis {
  if (e.quelleId === '' || e.speicherFeld === '') {
    return { ok: false, grund: 'unvollstaendig' }
  }
  const rows = quellenZeilen(e.quelleId)
  if (rows === null) return { ok: false, grund: 'quelleFehlt' }
  const anzeigeFeld = anzeigeFeldVon(coerceNachschlagSpalten([...e.spalten]), e.speicherFeld)
  return { ok: true, eintraege: fensterEintraege(e.el, rows, anzeigeFeld, e.speicherFeld) }
}

export function einzigenTrefferFinden(
  eintraege: readonly Eintrag[],
  feldLeer: boolean,
): Eintrag | null {
  return feldLeer && eintraege.length === 1 ? eintraege[0] : null
}

export function satzPasstZurAuswahl(el: HTMLElement, satz: unknown): boolean {
  const { rows, gefiltert } = zeilenNachAuswahl(el, [satz])
  return !gefiltert || rows.length > 0
}

export type VerlassenFolge = 'nichts' | 'leeren' | 'zurueck'

export function folgeBeimVerlassen(

  getippt: string,

  bestaetigteAnzeige: string,
  bestaetigterWert: string,
): VerlassenFolge {
  if (getippt === '') {
    return bestaetigteAnzeige === '' && bestaetigterWert === '' ? 'nichts' : 'leeren'
  }
  return getippt === bestaetigteAnzeige ? 'nichts' : 'zurueck'
}

// Der Lit-Halter am document.body; ihn zu entfernen raeumt Fenster und Listener ab.
let offen: HTMLElement | null = null
let offenFuer: HTMLElement | null = null
let rueckFokus: HTMLElement | null = null

function lupeVon(el: HTMLElement): HTMLElement | null {
  return el.shadowRoot?.querySelector<HTMLElement>('.lupe') ?? null
}

function schliesse(mitFokus = true): void {
  const ziel = mitFokus ? rueckFokus : null
  rueckFokus = null
  offen?.remove()
  offen = null
  offenFuer = null
  ziel?.focus()
}

// Stirbt das Feld, darf sein Fenster nicht als Waise am document.body
// weiterleben — samt keydown-Listener des Dialograhmens.
export function schliesseNachschlagenFuer(el: HTMLElement): void {
  if (offenFuer === el) schliesse(false)
}

type SpaltenQuelle = Pick<NachschlagenArgs, 'speicherFeld' | 'speicherTitel'>

// Die Automatik: EINE Spalte, „Gespeichert wird". Wer mehr will, stellt sie an
// der Lupe ein; die erste davon ist dann, was im Feld steht.
export function automatikSpalten(args: SpaltenQuelle): Spalte[] {
  const titel = args.speicherTitel !== '' ? args.speicherTitel : 'Wert'
  // Ohne Kennung: die Fenster-Spalten des Formularfelds adressiert nichts.
  return [{ kennung: '', titel, feld: args.speicherFeld }]
}

interface FensterArgs {
  titel: string

  breite: number
  hoehe: number

  inhalt: TemplateResult
  onSchliessen: () => void

  // Gesetzt = Editor-Weg: das Fenster ist ziehbar und liegt unter den
  // Editor-Overlays; pointerdown und dblclick bleiben drin, damit Klicks den
  // Baustein nicht ziehen oder waehlen.
  editor?: { onGroesse: (detail: DialogGroesseDetail) => void }
}

// Editor-Lupe und Laufzeit-Lupe bauen hier dasselbe Geruest, nicht zwei Kopien.
function fensterTpl(args: FensterArgs): TemplateResult {
  const stop = (e: Event): void => e.stopPropagation()
  const editor = args.editor
  return html`<ff-dialog-rahmen
    viewport
    escape-schliesst
    ohne-modal
    inhalt-fest
    ?ziehbar=${editor !== undefined}
    ?data-ff-nachschlagen=${editor === undefined}
    style=${editor !== undefined ? 'z-index:40' : nothing}
    .titel=${args.titel !== '' ? args.titel : 'Nachschlagen'}
    .breite=${args.breite}
    .hoehe=${args.hoehe}
    @ff-dialog-groesse=${editor === undefined ? nothing : (e: Event) => {
      e.stopPropagation()
      editor.onGroesse((e as CustomEvent<DialogGroesseDetail>).detail)
    }}
    @ff-dialog-schliessen=${(e: Event) => {
      if (editor !== undefined) e.stopPropagation()
      args.onSchliessen()
    }}
    @click=${stop}
    @pointerdown=${editor === undefined ? nothing : stop}
    @dblclick=${editor === undefined ? nothing : stop}
  >${args.inhalt}</ff-dialog-rahmen>`
}

function laufzeitTabelleTpl(args: NachschlagenArgs, eintraege: readonly Eintrag[]): TemplateResult {
  const eigene = coerceNachschlagSpalten([...args.spalten])
  const einspaltig = nurEineSpalte(
    anzeigeFeldVon(eigene, args.speicherFeld),
    args.speicherFeld,
  )
  // Das Fenster IST eine Tabelle: Spalten wegnehmen und sortieren gilt auch hier,
  // und beides ueberlebt das Schliessen.
  return html`<ff-tabelle
    fuellt
    suche="ja"
    spaltenwahl="ja"
    style="--se-r-lg:0px"
    .besitz=${'provided'}
    .spalten=${eigene.length > 0 ? eigene : automatikSpalten(args)}
    .leerText=${'Diese Quelle hat keine Sätze.'}
    .bereitgestellteZeilen=${eintraege.map((e) => ({
      rohzeile: e.satz,
      zellen: eigene.length > 0
        ? eigene.map((s) => (s.feld === '' ? '' : getField(e.satz, s.feld)))
        : (einspaltig ? [e.wert] : [e.anzeige, e.wert]),
    }))}
  ></ff-tabelle>`
}

export function oeffneNachschlagen(args: NachschlagenArgs): void {
  let eintraege = args.eintraege
  if (eintraege === undefined) {
    const ergebnis = holeEintraege(args)
    if (!ergebnis.ok) {
      meldeFehler(ergebnis.grund === 'unvollstaendig'
        ? 'Nachschlagen braucht an diesem Feld eine Quelle und „Gespeichert wird".'
        : 'Die Nachschlage-Quelle dieses Feldes ist in der Maske nicht vorhanden.')
      return
    }
    eintraege = ergebnis.eintraege
  }

  schliesse(false)

  const halter = document.createElement('div')
  halter.style.display = 'contents'
  render(fensterTpl({
    titel: args.titel,
    breite: args.breite,
    hoehe: args.hoehe,
    inhalt: laufzeitTabelleTpl(args, eintraege),
    onSchliessen: () => schliesse(),
  }), halter)

  const dialog = halter.querySelector<DialogRahmen>(DIALOG_RAHMEN_TAG)
  const tabelle = halter.querySelector<TabelleBlock>('ff-tabelle')
  tabelle?.addEventListener(ZEILE_AKTIVIERT_EVENT, (event) => {
    const detail = (event as CustomEvent<ZeileAktiviertDetail>).detail
    const eintrag = eintraege[detail.rohIndex]
    if (!eintrag) return
    schliesse()
    args.onUebernehmen(eintrag.anzeige, eintrag.wert, eintrag.satz)
  })

  rueckFokus = args.rueckFokus ?? lupeVon(args.el)
  document.body.appendChild(halter)
  offen = halter
  offenFuer = args.el

  const mitgebracht = args.suchtext ?? ''
  if (tabelle && mitgebracht !== '') tabelle.setzeSuchtext(mitgebracht)

  if (dialog && tabelle) {
    void Promise.all([dialog.updateComplete, tabelle.updateComplete]).then(() => {
      if (dialog.isConnected) tabelle.fokussiereSuche()
    })
  }
}

export interface SpaltenStellenArgs {
  titel: string

  spalten: readonly Spalte[]

  breite: number
  hoehe: number

  onAendern: (spalten: Spalte[]) => void

  onGroesse: (detail: DialogGroesseDetail) => void

  onFeldWahl: (detail: { index: number; top: number; left: number; liste?: Spalte[] }) => void
  onSchliessen: () => void
}

// Editor-Weg der Lupe: dasselbe Fenster, aber die Tabelle im Editor-Modus mit
// ihrer Spalten-Bedienung. Sie lebt im Shadow-DOM des Feldes, damit die
// Aenderungen als normale Ereignisse beim Editor ankommen (Undo).
export function spaltenStellenTpl(args: SpaltenStellenArgs): TemplateResult {
  return fensterTpl({
    titel: args.titel,
    breite: args.breite,
    hoehe: args.hoehe,
    onSchliessen: args.onSchliessen,
    editor: { onGroesse: args.onGroesse },
    inhalt: html`<ff-tabelle
      data-ff-editor
      fuellt
      suche="ja"
      style="--se-r-lg:0px"
      .spalten=${[...args.spalten]}
      .editable=${true}
      @ff-prop-change=${(e: Event) => {
        e.stopPropagation()
        const detail = (e as CustomEvent<{ attr?: string; value?: unknown }>).detail
        if (detail?.attr !== 'spalten') return
        args.onAendern(coerceSpalten(detail.value))
      }}
      @ff-listen-bind=${(e: Event) => {
        e.stopPropagation()
        const d = (e as CustomEvent<{
          index?: number
          top?: number
          left?: number
          liste?: Spalte[]
        }>).detail
        if (typeof d?.index !== 'number') return
        args.onFeldWahl({
          index: d.index,
          top: d.top ?? 0,
          left: d.left ?? 0,
          ...(Array.isArray(d.liste) ? { liste: d.liste } : {}),
        })
      }}
    ></ff-tabelle>`,
  })
}
