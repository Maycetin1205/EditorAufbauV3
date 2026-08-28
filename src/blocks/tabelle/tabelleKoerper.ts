import { html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { leerZustand } from '../shared/leerZustand'
import { markiereTreffer } from '../shared/textMarke'
import { ZELLE_PLATZHALTER, type Spalte } from './spalten'
import { spaltenArt } from './spaltenArten'
import { spalteAenderbar } from './spaltenBindung'
import {
  bewegeZeilenFokus,
  fokussiereErsteZeile,
  fokussiereSuchzeile,
} from './zeilenAktivierung'
import type { ZeilenZeichen } from './zeilenStatus'

// Was eine GEBUCHTE Zeile zeigt und was mit ihr passiert — als EIN Gegenueber
// statt als sieben Rueckrufe. Die Tabelle reicht dafuer ihre ZeilenBearbeitung
// durch; der Rumpf sieht nur diese Form.
export interface ZeilenStand {
  // Was in der Zelle steht — vorgemerkter Wert, sonst der Wert der Zeile.
  zellWert: (rohIndex: number, spalte: number) => string

  istGeaendert: (rohIndex: number, spalte: number) => boolean

  istGeloescht: (rohIndex: number) => boolean

  // Der Balken links plus sein Klartext.
  statusVon: (rohIndex: number) => ZeilenZeichen

  tippeZelle: (rohIndex: number, spalte: number, text: string) => void

  verlasseZelle: (rohIndex: number, spalte: number, text: string) => void

  tasteZelle: (rohIndex: number, spalte: number, e: KeyboardEvent) => void
}

export interface KoerperLage {
  spalten: readonly Spalte[]

  cols: Readonly<Record<string, string>>

  editable: boolean

  imEditor: boolean

  // Schalter „Kopfzeile": aus = keine Titelzeile (Editor UND Maske). Die
  // Kopf-Griffe (Feld-Picker, Umbenennen) wandern im Editor auf die Zellen;
  // Sortieren per Titelklick entfaellt an der Maske.
  zeigeKopf: boolean

  auswahlSemantik: boolean
  zeigeSuche: boolean
  suchtext: string

  sortSpalte: number
  sortAuf: boolean

  zeilen: readonly (number | null)[]
  datenzeilen: readonly string[][]

  zusatzzeilen: readonly Record<string, string>[][]

  linealTakte: number | null

  hatQuelle: boolean
  auswahlIndex: number

  // Aendern in der Zeile ist moeglich: Laufzeit, echte Quelle, Satznummer da.
  // Aus heisst: auch eine als aenderbar gestellte Spalte bleibt Text.
  aendernMoeglich: boolean

  zeilenStand: ZeilenStand

  // Zeilen lassen sich zum Loeschen vormerken (Schalter am Baustein).
  loeschbar: boolean

  leer: boolean
  leerText: string

  // Erfasste, noch nicht geschriebene Zeilen (G4): sie stehen zwischen der
  // letzten Datenzeile und der Erfassungszeile, links markiert — erst der
  // Ketten-Lauf des Knopfs macht aus ihnen echte Positionen.
  erfasste: readonly (readonly string[])[]

  erfasstStand: (index: number) => ZeilenZeichen

  // Die fertige Erfassungszeile. Der Rumpf kennt ihre Rollen nicht — er
  // setzt sie nur an die richtige Stelle: sie ist die naechste FREIE Zeile,
  // also direkt unter der letzten DATENzeile und vor allem, was nur fuellt.
  // Ohne echte Daten (Editor, leere Quelle) ist das Zeile 1 ganz oben —
  // nicht unten hinter den Platzhalter-Strichen.
  erfassung: TemplateResult | typeof nothing
}

export interface KoerperHandeln {
  setzeSuchtext: (text: string) => void

  dblklickKopf: (e: MouseEvent, index: number) => void
  klickKopf: (e: MouseEvent, index: number) => void

  aktiviereZeile: (rohIndex: number | null, ansichtIndex: number) => void

  zeileDoppelt: (rohIndex: number | null) => void

  nimmErfassteZeile: (index: number) => void

  // Eine erfasste Zeile ist noch nichts als eine Vormerkung: der Bediener
  // muss den Vertipper geradeziehen koennen, ohne sie wegzuwerfen und neu zu
  // tippen. Sie geht dafuer ZURUECK in die Erfassungszeile — dort hat sie
  // wieder Vorschlagsliste, Fenster und Enter-Fluss.
  holeErfassteZeile: (index: number) => void

  schalteLoeschung: (rohIndex: number) => void
}

function lineal(lage: KoerperLage): TemplateResult | typeof nothing {
  if (lage.linealTakte === 0) return nothing
  const stil = lage.linealTakte === null
    ? lage.cols
    : {
        ...lage.cols,
        flex: '0 1 auto',
        height: `calc(var(--zeilen-hoehe) * ${lage.linealTakte})`,
      }
  return html`<div class="lineal" role="presentation" style=${styleMap(stil)}>
          ${lage.spalten.map(() => html`<div></div>`)}
        </div>`
}

export function tabelleKoerper(lage: KoerperLage, tun: KoerperHandeln): TemplateResult {
  return html`
      ${lage.zeigeSuche ? html`<div class="suchzeile">
        <input
          type="search"
          placeholder="Tabelle durchsuchen…"
          aria-label="Tabelle durchsuchen"
          .value=${lage.suchtext}
          @input=${(e: Event) => tun.setzeSuchtext((e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key !== 'ArrowDown') return
            if (fokussiereErsteZeile(e.target)) e.preventDefault()
          }}
        />
      </div>` : ''}
      <div class="koerper" role=${lage.leer ? nothing : 'table'} tabindex="-1">
      ${lage.zeigeKopf ? html`<div class="kopf" role="row" style=${styleMap(lage.cols)}>
        ${lage.spalten.map(
          (s, i) => html`<div
            class=${spaltenArt(s.art).klasse}
            role="columnheader"
            data-ff-editable
            @dblclick=${(e: MouseEvent) => tun.dblklickKopf(e, i)}
            @click=${(e: MouseEvent) => tun.klickKopf(e, i)}
          >${s.titel}${!lage.editable && lage.sortSpalte === i
            ? html`<span class="sort-pfeil">${lage.sortAuf ? ' ▲' : ' ▼'}</span>`
            : ''}</div>`,
        )}
      </div>` : nothing}
        ${ ''}
        ${lage.leer ? leerZustand(lage.leerText, true) : html`
        ${lage.hatQuelle ? nothing : lage.erfassung}
        ${lage.zeilen.map((rohIndex, ansichtIndex) => {
          const aktivierbar = rohIndex !== null && !lage.imEditor
          const geloescht = rohIndex !== null && lage.zeilenStand.istGeloescht(rohIndex)
          const zeichen: ZeilenZeichen = rohIndex === null
            ? { status: 'gebucht', titel: '' }
            : lage.zeilenStand.statusVon(rohIndex)
          return html`<div
            class="zeile${ansichtIndex % 2 === 1 ? ' zebra' : ''}${
              rohIndex !== null && lage.hatQuelle ? ' waehlbar' : ''}${
              rohIndex !== null && rohIndex === lage.auswahlIndex ? ' gewaehlt' : ''}${
              geloescht ? ' geloescht' : ''}"
            role="row"
            data-status=${zeichen.status === 'gebucht' ? nothing : zeichen.status}
            title=${zeichen.titel === '' ? nothing : zeichen.titel}
            data-ff-roh=${rohIndex ?? nothing}
            tabindex=${aktivierbar ? '0' : nothing}
            aria-selected=${lage.auswahlSemantik && rohIndex !== null
              ? String(rohIndex === lage.auswahlIndex)
              : nothing}
            style=${styleMap(lage.cols)}
            @click=${() => tun.aktiviereZeile(rohIndex, ansichtIndex)}
            @dblclick=${(e: MouseEvent) => {
              // In einer aenderbaren Zelle heisst Doppelklick „Wort markieren".
              // Die Kette gehoert der ZEILE, nicht dem Eingabefeld.
              if ((e.target as HTMLElement).closest('.zell-eingabe')) return
              tun.zeileDoppelt(rohIndex)
            }}
            @keydown=${(e: KeyboardEvent) => {
              // In einer Eingabezelle gehoeren die Pfeile dem Text.
              if ((e.target as HTMLElement).closest('.zell-eingabe')) return
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const hoch = e.key === 'ArrowUp'
                const bewegt = bewegeZeilenFokus(e.target, hoch ? -1 : 1)
                if (bewegt || (hoch && fokussiereSuchzeile(e.target))) e.preventDefault()
                return
              }
              if (e.key !== 'Enter') return
              e.preventDefault()
              tun.aktiviereZeile(rohIndex, ansichtIndex)
            }}
          >
            ${ ''}
            ${lage.spalten.map((s, i) => {
              const art = spaltenArt(s.art)
              const wert = rohIndex !== null
                ? (lage.datenzeilen[rohIndex]?.[i] ?? '')
                : ZELLE_PLATZHALTER

              const zusatz = rohIndex !== null
                ? (lage.zusatzzeilen[rohIndex]?.[i] ?? {})
                : {}
              // Ohne Kopfzeile uebernimmt die Zelle im Editor den Kopf-Griff:
              // Klick oeffnet den Feld-Picker der Spalte. Umbenennen laeuft
              // ueber das kurze Einschalten der Kopfzeile (Inspector).
              const kopfGriff = lage.imEditor && !lage.zeigeKopf && lage.editable

              // Aenderbare Zelle einer gebuchten Zeile: ein Eingabefeld statt
              // Text. Es traegt den vorgemerkten Wert, solange einer da ist.
              if (lage.aendernMoeglich && rohIndex !== null && spalteAenderbar(s)) {
                const stand = lage.zeilenStand
                return html`<div class="${art.klasse} tippbar" role="cell">
                <input
                  class=${stand.istGeaendert(rohIndex, i) ? 'zell-eingabe geaendert' : 'zell-eingabe'}
                  type="text"
                  data-spalte=${i}
                  aria-label=${s.titel}
                  .value=${stand.zellWert(rohIndex, i)}
                  @input=${(e: Event) =>
                    stand.tippeZelle(rohIndex, i, (e.target as HTMLInputElement).value)}
                  @blur=${(e: Event) =>
                    stand.verlasseZelle(rohIndex, i, (e.target as HTMLInputElement).value)}
                  @keydown=${(e: KeyboardEvent) => stand.tasteZelle(rohIndex, i, e)}
                />
              </div>`
              }
              // Was die Suche gefunden hat, soll man auch SEHEN. Nur wo die
              // Darstellung reinen Text liefert — eine Marke oder ein Bild
              // traegt keinen Treffer.
              const gezeigt = art.zelle(wert, s.zuordnung ?? [], zusatz)
              return html`<div
                class=${art.klasse}
                role="cell"
                data-ff-editable=${kopfGriff ? '' : nothing}
                @click=${kopfGriff ? (e: MouseEvent) => tun.klickKopf(e, i) : nothing}
              >${
                typeof gezeigt === 'string' ? markiereTreffer(gezeigt, lage.suchtext) : gezeigt
              }</div>`
            })}
            ${lage.loeschbar && rohIndex !== null && !lage.imEditor
              ? html`<button
                  class="zeile-weg"
                  type="button"
                  title=${geloescht ? 'Löschen zurücknehmen' : 'Diese Position zum Löschen vormerken'}
                  aria-label=${geloescht ? 'Löschen zurücknehmen' : 'Position zum Löschen vormerken'}
                  @click=${(e: MouseEvent) => { e.stopPropagation(); tun.schalteLoeschung(rohIndex) }}
                >${geloescht ? '\u21BA' : '\u2715'}</button>`
              : nothing}
          </div>`
        })}
        ${lage.erfasste.map((werte, zeilenIndex) => {
          const zeichen = lage.erfasstStand(zeilenIndex)
          // Hinausgeschickt heisst: nicht mehr anfassen. Ein Zurueckholen
          // wuerde eine Zeile zum Tippen anbieten, die im ERP schon steht.
          const fest = zeichen.status === 'geschrieben'
          return html`<div
          class="zeile erfasst"
          role="row"
          data-status=${zeichen.status}
          title=${lage.imEditor || fest ? zeichen.titel : `${zeichen.titel} — zum Korrigieren anklicken`}
          style=${styleMap(lage.cols)}
          @click=${lage.imEditor || fest ? nothing : () => tun.holeErfassteZeile(zeilenIndex)}
        >
          ${lage.spalten.map((s, i) => {
            const art = spaltenArt(s.art)
            // Genau wie eine gebuchte Zeile: die Darstellung der Spalte
            // entscheidet, was in der Zelle steht — Marke bleibt Marke, Zahl
            // bleibt formatiert. Vorher stand hier in JEDER Spalte ein rohes
            // Eingabefeld mit dem Rohwert; deshalb sah eine erfasste Zeile
            // nicht aus wie die Zeilen darueber. Korrigiert wird sie durch
            // Zurueckholen in die Erfassungszeile, nicht an Ort und Stelle.
            return html`<div class=${art.klasse} role="cell">${
              art.zelle(werte[i] ?? '', s.zuordnung ?? [], {})
            }</div>`
          })}
          ${lage.imEditor ? nothing : html`<button
              class="zeile-weg"
              type="button"
              title=${fest
                ? 'Aus der Ansicht nehmen — geschrieben ist sie schon'
                : 'Diese erfasste Zeile wieder wegnehmen'}
              aria-label="Erfasste Zeile wegnehmen"
              @click=${(e: MouseEvent) => {
                e.stopPropagation()
                tun.nimmErfassteZeile(zeilenIndex)
              }}
            >&#x2715;</button>`}
        </div>`
        })}
        ${lage.hatQuelle ? lage.erfassung : nothing}
        ${lineal(lage)}`}
      </div>
    `
}
