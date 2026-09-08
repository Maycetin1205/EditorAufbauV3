// Zeichnet Kopf, Zeilen und Fuss der Tabelle; Stand und Bedienung kommen von aussen.
import { html, nothing, type TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { leerZustand } from '../shared/leerZustand'
import { spaltenWahlTpl, type SpaltenWahlHandeln, type SpaltenWahlLage } from './spaltenWahl'
import { markiereTreffer } from '../shared/textMarke'
import { alsZahl } from './sortierung'
import { ZELLE_PLATZHALTER, type Spalte } from './spalten'
import { breitenGriffe, type BreitenWirt } from './spaltenBreite'
import { spalteAenderbar } from './tabelleEigenschaften'
import { zellenEingabeTpl } from '../shared/zellenEingabe'
import { bewegeZeilenFokus, fokussiereErsteZeile, fokussiereSuchzeile } from './zeilenAktivierung'
import type { ZeilenZeichen } from './zeilenStatus'
import { datensatzText } from './tabelleAnsicht'

export interface ZeilenStand {
  zellWert: (rohIndex: number, spalte: number) => string

  istGeaendert: (rohIndex: number, spalte: number) => boolean

  istGeloescht: (rohIndex: number) => boolean

  statusVon: (rohIndex: number) => ZeilenZeichen

  tippeZelle: (rohIndex: number, spalte: number, text: string) => void

  verlasseZelle: (rohIndex: number, spalte: number, text: string) => void

  tasteZelle: (rohIndex: number, spalte: number, e: KeyboardEvent) => void
}

export interface KoerperLage {
  spalten: readonly Spalte[]

  // plaetze[j] ist der Platz der j-ten gezeichneten Spalte in der vollen
  // Liste; jeder Wert und jeder Zustand haengt am vollen Platz.
  plaetze: readonly number[]

  cols: Readonly<Record<string, string>>

  editable: boolean

  imEditor: boolean

  zeigeKopf: boolean

  spaltenwahlAn: boolean

  spaltenwahl: SpaltenWahlLage | null

  auswahlSemantik: boolean
  zeigeSuche: boolean
  suchtext: string

  sortSpalte: number
  sortAuf: boolean

  zeilen: readonly (number | null)[]
  datenzeilen: readonly string[][]

  linealTakte: number | null

  hatQuelle: boolean
  auswahlIndex: number

  aendernMoeglich: boolean

  zeilenStand: ZeilenStand

  loeschbar: boolean

  leer: boolean
  leerText: string

  erfasste: readonly (readonly string[])[]

  erfasstStand: (index: number) => ZeilenZeichen

  // Sie gehoert an die naechste FREIE Zeile: direkt unter die letzte
  // Datenzeile, vor alles, was nur fuellt.
  erfassung: TemplateResult | typeof nothing

  // null: die Tipp-Zeile sitzt unten und legt neue Zeilen an; sonst der Platz,
  // an dem sie eine erfasste Zeile an Ort und Stelle korrigiert.
  korrekturPlatz: number | null
}

export interface KoerperHandeln {
  setzeSuchtext: (text: string) => void

  breiten: BreitenWirt

  // Im Editor liegt die Spalten-Bedienung als eigene Schicht darueber; hier
  // wird nur sortiert.
  klickKopf: (index: number) => void

  oeffneSpaltenwahl: (e: MouseEvent) => void
  spaltenwahl: SpaltenWahlHandeln

  aktiviereZeile: (rohIndex: number | null, ansichtIndex: number) => void

  zeileDoppelt: (rohIndex: number | null) => void

  nimmErfassteZeile: (index: number) => void

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
        ${
          // Kopfzelle und Greifstreifen nennen ihren Gitterplatz beide
          // ausdruecklich, sonst rutschen die Zellen in eine zweite Reihe.
          lage.spalten.map(
          (s, i) => html`<div
            class=${[s.versteckt === true ? 'versteckt' : '', s.summe === true ? 'z' : '']
              .filter((k) => k !== '').join(' ') || nothing}
            role="columnheader"
            data-ff-editable
            data-ff-eintrag=${lage.imEditor ? lage.plaetze[i] : nothing}
            style="grid-row: 1; grid-column: ${i + 1}"
            @click=${() => tun.klickKopf(lage.plaetze[i])}
            @contextmenu=${lage.spaltenwahlAn
              ? (e: MouseEvent) => tun.oeffneSpaltenwahl(e)
              : nothing}
          ><span class="kopf-text">${s.titel}</span>${!lage.editable && lage.sortSpalte === lage.plaetze[i]
            ? html`<span class="sort-pfeil">${lage.sortAuf ? ' ▲' : ' ▼'}</span>`
            : ''}</div>`,
        )}
        ${breitenGriffe(lage.spalten.length, tun.breiten)}
      </div>` : nothing}
        ${ ''}
        ${lage.leer ? leerZustand(lage.leerText, true) : html`
        ${lage.hatQuelle || lage.korrekturPlatz !== null ? nothing : lage.erfassung}
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
            @click=${() => {
              tun.aktiviereZeile(rohIndex, ansichtIndex)
            }}
            @dblclick=${(e: MouseEvent) => {
              // Der Doppelklick gehoert der Zeile, in einer Eingabezelle dem Text.
              if ((e.target as HTMLElement).closest('.zell-eingabe')) return
              tun.zeileDoppelt(rohIndex)
            }}
            @keydown=${(e: KeyboardEvent) => {
              // In einer Eingabezelle gehoeren die Pfeile dem Text, auf dem
              // Kreuz gehoert Enter dem Knopf.
              if ((e.target as HTMLElement).closest('.zell-eingabe, button')) return
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const hoch = e.key === 'ArrowUp'
                const bewegt = bewegeZeilenFokus(e.target, hoch ? -1 : 1)
                if (bewegt || (hoch && fokussiereSuchzeile(e.target))) e.preventDefault()
                return
              }
              if (e.key === 'Delete' && lage.loeschbar && rohIndex !== null && !lage.imEditor) {
                e.preventDefault()
                tun.schalteLoeschung(rohIndex)
                return
              }
              if (e.key !== 'Enter') return
              e.preventDefault()
              tun.aktiviereZeile(rohIndex, ansichtIndex)
            }}
          >
            ${ ''}
            ${lage.spalten.map((s, i) => {
              const platz = lage.plaetze[i]
              const wert = rohIndex !== null
                ? (lage.datenzeilen[rohIndex]?.[platz] ?? '')
                : ZELLE_PLATZHALTER
              // Ohne Kopfzeile uebernimmt die Zelle im Editor den Kopf-Griff.
              const kopfGriff = lage.imEditor && !lage.zeigeKopf && lage.editable

              if (lage.aendernMoeglich && rohIndex !== null && spalteAenderbar(s)) {
                const stand = lage.zeilenStand
                return html`<div class="tippbar" role="cell">${zellenEingabeTpl({
                  wert: stand.zellWert(rohIndex, platz),
                  titel: s.titel,
                  platzhalter: '',
                  platz,
                  zustand: stand.istGeaendert(rohIndex, platz) ? 'geaendert' : 'ruhig',
                  vorschlaege: [],
                  marke: 0,
                  listeNachOben: false,
                }, {
                  tippen: (text) => stand.tippeZelle(rohIndex, platz, text),
                  taste: (e) => stand.tasteZelle(rohIndex, platz, e),
                  verlassen: (text) => stand.verlasseZelle(rohIndex, platz, text),
                  waehleVorschlag: () => {},
                  setzeMarke: () => {},
                })}</div>`
              }
              const klassen = [
                s.versteckt === true ? 'versteckt' : '',
                rohIndex !== null && alsZahl(wert) !== null ? 'zahl' : '',
              ].filter((k) => k !== '').join(' ')
              // Der Fehler des Ketten-Laufs steht als Wort in der ersten Zelle,
              // nicht nur im Tooltip.
              const fehltext = i === 0 && zeichen.status === 'fehler'
                ? html`<span class="fehltext">${zeichen.titel}</span>`
                : nothing
              return html`<div
                class=${klassen === '' ? nothing : klassen}
                role="cell"
                data-ff-editable=${kopfGriff ? '' : nothing}
                data-ff-eintrag=${kopfGriff && ansichtIndex === 0 ? platz : nothing}
              >${markiereTreffer(wert, lage.suchtext)}${fehltext}</div>`
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
            ${lage.loeschbar && lage.imEditor
              ? html`<span
                  class="zeile-weg zeile-weg-anzeige"
                  title="Zeilen l\u00F6schbar \u2014 in der Maske per Kreuz oder Entf-Taste"
                >&#x2715;</span>`
              : nothing}
          </div>`
        })}
        ${lage.erfasste.map((werte, zeilenIndex) => {
          const zeichen = lage.erfasstStand(zeilenIndex)
          // Hinausgeschickt heisst: nicht mehr anfassen, im ERP steht sie schon.
          const fest = zeichen.status === 'geschrieben'
          return html`${zeilenIndex === lage.korrekturPlatz ? lage.erfassung : nothing}<div
          class="zeile erfasst"
          role="row"
          data-status=${zeichen.status}
          title=${lage.imEditor || fest ? zeichen.titel : `${zeichen.titel} — zum Korrigieren anklicken`}
          style=${styleMap(lage.cols)}
          @click=${lage.imEditor || fest ? nothing : () => tun.holeErfassteZeile(zeilenIndex)}
        >
          ${lage.spalten.map((_s, i) => {
            const wert = werte[lage.plaetze[i]] ?? ''
            const fehltext = i === 0 && zeichen.status === 'fehler'
              ? html`<span class="fehltext">${zeichen.titel}</span>`
              : nothing
            return html`<div class=${alsZahl(wert) !== null ? 'zahl' : nothing} role="cell">${wert}${fehltext}</div>`
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
        ${
          // Korrektur an der letzten (oder entfallenen) Zeile: die Tipp-Zeile
          // steht hinter allen erfassten.
          lage.korrekturPlatz !== null && lage.korrekturPlatz >= lage.erfasste.length
            ? lage.erfassung
            : nothing}
        ${lage.hatQuelle && lage.korrekturPlatz === null ? lage.erfassung : nothing}
        ${lineal(lage)}`}
      </div>
      ${spaltenWahlTpl(lage.spaltenwahl, tun.spaltenwahl)}
    `
}

export interface FussLage {
  hatQuelle: boolean

  sichtbar: number
  gesamt: number
  suchtAktiv: boolean
  auswahlAktiv: boolean
  seite: number
  seiten: number

  summen: readonly { titel: string; text: string }[]

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
  // Der Fuss steht auch ohne Quelle: im Editor zeigt er die Form der Maske,
  // die Zahlen sind Striche. Nur der Leerzustand nimmt ihm den Platz.
  if (lage.leer) return nothing
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
    <div class="fuss-rechts">
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
    </div>
  </div>`
}
