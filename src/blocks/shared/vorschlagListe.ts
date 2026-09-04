import { css, html, nothing, type TemplateResult } from 'lit'
import { ref } from 'lit/directives/ref.js'
import { schlichtText, zeilePasst } from './textSuche'

// Die Tipp-Vorschlagsliste. Sie entsteht EINMAL hier und wird geteilt: das
// Formularfeld „nachschlagen" zeigt sie zuerst (G1), die Erfassungszeile der
// Tabelle bekommt dieselbe (G2). Geteilt sind Logik UND Aussehen — zwei
// Fassungen wuerden auseinanderlaufen, genau wie beim Nachschlage-Fenster
// vor V7.

// Mehr als acht Treffer liest niemand im Vorbeitippen; wer alle sehen will,
// nimmt das grosse Fenster (Wellen-Kopf G: „bis ~8 Treffer").
export const VORSCHLAEGE_MAX = 8

export interface Vorschlag {
  anzeige: string

  wert: string
}

// Gesucht wird in BEIDEM, Anzeige und gespeichertem Wert: Geuebte tippen
// „bay" fuer Baytril, andere die Nummer (Wellen-Kopf G). Leer getippt = KEINE
// Liste — bei leerem Feld ist Enter der Weg ins grosse Fenster, und alle
// Saetze untereinander waeren dort nur im Weg.
// Umlaute sortieren wie ihr Grundbuchstabe (Ä bei A), Zahlen im Text nach
// Groesse statt nach Ziffernfolge — sonst stuende Pos. 10 vor Pos. 2.
const textVergleich = new Intl.Collator('de', { numeric: true, sensitivity: 'base' })

// Wer „Schr" tippt, meint zuerst Schraube und Schraubendreher, nicht
// Holzschraube (Nutzer-Entscheidung 2026-09-04). Also: erst was VORN
// anfaengt, dann der Rest — und beides in sich alphabetisch. Vorher stand die
// Liste in der Reihenfolge da, in der SoftEngine die Saetze liefert.
// Derselbe Massstab wie die Suche (textSuche.ts): Ä zaehlt als A. Sonst
// stuende ein Treffer, den die Suche gefunden hat, in der Sortierung ploetzlich
// nicht mehr „am Anfang".
function beginntMit(eintrag: Vorschlag, getippt: string): boolean {
  const t = schlichtText(getippt.trim())
  if (t === '') return false
  return schlichtText(eintrag.anzeige.trim()).startsWith(t)
    || schlichtText(eintrag.wert.trim()).startsWith(t)
}

export function ordneVorschlaege<T extends Vorschlag>(
  treffer: readonly T[],
  getippt: string,
): T[] {
  return [...treffer].sort((a, b) => {
    const va = beginntMit(a, getippt)
    const vb = beginntMit(b, getippt)
    if (va !== vb) return va ? -1 : 1
    return textVergleich.compare(a.anzeige.trim(), b.anzeige.trim())
  })
}

export function passendeVorschlaege<T extends Vorschlag>(
  eintraege: readonly T[],
  getippt: string,
  max: number = VORSCHLAEGE_MAX,
): T[] {
  if (getippt.trim() === '') return []
  // ALLE Treffer sammeln und erst DANN kuerzen: wer vorher abbricht, wirft
  // womoeglich den besten Treffer weg, nur weil er in den Daten weit hinten
  // steht.
  const treffer: T[] = []
  for (const eintrag of eintraege) {
    if (zeilePasst([eintrag.anzeige, eintrag.wert], getippt)) treffer.push(eintrag)
  }
  return ordneVorschlaege(treffer, getippt).slice(0, max)
}

// Die Marke laeuft um: unter dem letzten Treffer geht es oben wieder los.
// Ohne Treffer gibt es nichts zu markieren — dann steht sie auf 0.
export function bewegteMarke(marke: number, anzahl: number, schritt: 1 | -1): number {
  if (anzahl <= 0) return 0
  return (((marke + schritt) % anzahl) + anzahl) % anzahl
}

// Jeder Tastendruck kann die Liste kuerzen; eine Marke hinter dem Ende waere
// eine Uebernahme ins Leere. Sie faellt dann auf den ersten Treffer zurueck.
export function gueltigeMarke(marke: number, anzahl: number): number {
  if (anzahl <= 0) return 0
  return marke < 0 || marke >= anzahl ? 0 : marke
}

// Was eine Taste an der Vorschlagsliste bedeutet — als eigene Entscheidung,
// weil die Erfassungszeile der Tabelle (G2/G3) genau dieselbe braucht (dort
// kommt nur der Sprung in die naechste Zelle hinzu) und weil sie sich so ohne
// Feld und ohne Browser pruefen laesst. Benannte Schalter statt zwei
// boolean hintereinander: vertauscht sieht man an der Aufrufstelle nicht.
export type TastenFolge =
  | 'marke-hoch'
  | 'marke-runter'
  | 'uebernehmen'
  | 'liste-zu'
  | 'fenster'
  | 'nichts'

export function tastenFolge(taste: string, args: {
  listeOffen: boolean

  feldLeer: boolean

  // Wie viele Vorschlaege gerade dastehen. Die Liste zeigt hoechstens acht;
  // bei Tausenden Saetzen ist der erste davon eine willkuerliche Wahl.
  treffer: number

  // Hat der Bediener SELBST in der Liste ausgesucht (Pfeiltasten, Liste
  // aufgemacht)? Dann gilt seine Wahl — sonst entscheidet die Trefferzahl.
  markeVonHand: boolean
}): TastenFolge {
  if (taste === 'ArrowDown') return args.listeOffen ? 'marke-runter' : 'nichts'
  if (taste === 'ArrowUp') return args.listeOffen ? 'marke-hoch' : 'nichts'
  if (taste === 'Escape') return args.listeOffen ? 'liste-zu' : 'nichts'
  if (taste !== 'Enter') return 'nichts'
  // Genau ein Treffer ist keine Auswahl, sondern das Ergebnis: Enter nimmt
  // ihn. Bei mehreren nahm Enter frueher stumm den ersten der acht — bei
  // tausenden Saetzen war das Raten. Jetzt geht das grosse Fenster auf, das
  // suchen, sortieren und blaettern kann (Nutzer-Entscheidung 2026-08-28).
  if (args.listeOffen) {
    return args.markeVonHand || args.treffer === 1 ? 'uebernehmen' : 'fenster'
  }
  // Enter im LEEREN Feld oeffnet das grosse Fenster (Wellen-Kopf G).
  // Getippter Text ohne Treffer laesst es ZU: sonst belohnt das Fenster den
  // Tippfehler und der Bediener verliert seinen Text aus den Augen.
  return args.feldLeer ? 'fenster' : 'nichts'
}

// Schritt 18: Die Vorschlagsliste darf breiter werden als der Halter
// (width: max-content, min-width: 100%), damit Artikelbezeichnungen bei
// schmalen Spalten nicht mehr abgeschnitten werden.
// Regeln: sie bleibt links verankert und waechst nach rechts; sie wird nie
// schmaler als der Halter; tritt sie rechts ueber den Rand der Flaeche
// hinaus, waechst sie nach links (.nach-links).
export function flaecheGrenzen(el: HTMLElement): { links: number; rechts: number } {
  let links = 0
  let rechts = typeof window !== 'undefined' && window.innerWidth > 0
    ? window.innerWidth
    : (typeof document !== 'undefined' && document.documentElement?.clientWidth > 0
        ? document.documentElement.clientWidth
        : 10000)

  // In einer Tabelle bildet der sichtbare Tabellenrahmen (.tabelle mit overflow: hidden)
  // die aeussere Begrenzung:
  const tabelle = el.closest?.('.tabelle')
  if (tabelle instanceof (globalThis.HTMLElement ?? Object) && typeof tabelle.getBoundingClientRect === 'function') {
    const tRect = tabelle.getBoundingClientRect()
    if (tRect.width > 0) {
      links = Math.max(links, tRect.left)
      rechts = Math.min(rechts, tRect.right)
    }
    return { links, rechts }
  }

  // Ausserhalb der Tabelle (z. B. am Formularfeld): Begrenzung durch Wurzel-Container / Fenster
  const wurzel = typeof el.getRootNode === 'function' ? el.getRootNode() : null
  if (wurzel instanceof (globalThis.ShadowRoot ?? Object) && (wurzel as ShadowRoot).host instanceof (globalThis.HTMLElement ?? Object)) {
    const eltern = (wurzel as ShadowRoot).host.parentElement
    if (eltern && typeof eltern.getBoundingClientRect === 'function') {
      const pRect = eltern.getBoundingClientRect()
      if (pRect.width > 0) {
        links = Math.max(links, pRect.left)
        rechts = Math.min(rechts, pRect.right)
      }
    }
  }

  return { links, rechts }
}

export function richteVorschlaegeAus(el: HTMLElement): void {
  if (!el || typeof el.getBoundingClientRect !== 'function') return
  const eltern = el.parentElement
  if (!eltern) return

  // Vor der Messung eventuelle alte Breiten-Begrenzung aufheben:
  el.style.maxWidth = ''

  const halterRect = typeof eltern.getBoundingClientRect === 'function'
    ? eltern.getBoundingClientRect()
    : { left: 0, right: 0, width: 0 }
  const halterBreite = eltern.offsetWidth || halterRect.width || 0
  const halterLinks = halterRect.left || 0
  const halterRechts = halterRect.right || (halterLinks + halterBreite)

  const bedarf = el.offsetWidth || (typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect().width : 0)
  if (bedarf <= 0) return

  const grenzen = flaecheGrenzen(el)
  const waereRechts = halterLinks + bedarf

  // Uebertritt die Liste am linken Rand verankert den rechten Rand der Flaeche,
  // waechst sie nach links (rechts buendig am Halter verankert):
  const nachLinks = waereRechts > grenzen.rechts
  el.classList.toggle('nach-links', nachLinks)

  // Sie wird nie schmaler als der Halter, darf aber auch nach links gewachsen
  // nicht ueber die Flaeche treten:
  const maxBreite = nachLinks
    ? Math.max(halterBreite, halterRechts - grenzen.links)
    : Math.max(halterBreite, grenzen.rechts - halterLinks)

  if (maxBreite > 0 && Number.isFinite(maxBreite)) {
    el.style.maxWidth = `${Math.floor(maxBreite)}px`
  }
}

export function vorschlagListeTpl(args: {
  eintraege: readonly Vorschlag[]

  marke: number

  onWaehlen: (index: number) => void

  onMarke: (index: number) => void
}): TemplateResult {
  // mousedown abfangen: ohne das verliert das Feld den Fokus, BEVOR der
  // Klick ankommt — das Verlassen raeumt die Liste ab und der Klick landet
  // im Leeren.
  return html`<ul
    class="vorschlaege"
    ${ref((el) => {
      if (el && 'classList' in el && 'style' in el) {
        richteVorschlaegeAus(el as HTMLElement)
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => {
            if ((el as HTMLElement).isConnected) richteVorschlaegeAus(el as HTMLElement)
          })
        }
      }
    })}
    @mousedown=${(e: MouseEvent) => e.preventDefault()}
  >${args.eintraege.map((eintrag, i) => html`<li
      class=${i === args.marke ? 'vorschlag marke' : 'vorschlag'}
      @click=${() => args.onWaehlen(i)}
      @mouseenter=${() => args.onMarke(i)}
    ><span class="vorschlag-anzeige">${eintrag.anzeige !== '' ? eintrag.anzeige : eintrag.wert}</span>${
      eintrag.wert !== '' && eintrag.wert !== eintrag.anzeige
        ? html`<span class="vorschlag-wert">${eintrag.wert}</span>`
        : nothing
    }</li>`)}</ul>`
}

// Der Halter der Liste braucht `position: relative` und muss ueber seinen
// Nachbarn liegen — das steht beim jeweiligen Baustein, weil nur er weiss,
// welches Element sein Halter ist.
export const vorschlagStil = css`
  .vorschlaege {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 3;
    width: max-content;
    min-width: 100%;
    box-sizing: border-box;
    max-height: 240px;
    overflow: auto;
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    background: var(--se-panel);
    border: var(--se-border) solid var(--se-accent);
    border-radius: var(--se-r-md);
    font-family: var(--se-font);
    font-size: var(--se-fs);
    color: var(--se-ink);
  }

  /* Tritt die Liste ueber den rechten Rand der Flaeche hinaus, waechst sie
     nach links statt weiter nach rechts (Schritt 18). */
  .vorschlaege.nach-links {
    left: auto;
    right: 0;
  }

  .vorschlag {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--se-gap);
    padding: 4px 10px;
    white-space: nowrap;
    cursor: pointer;
  }
  .vorschlag + .vorschlag { border-top: 1px solid var(--se-line-soft); }

  .vorschlag-anzeige { overflow: hidden; text-overflow: ellipsis; }

  .vorschlag-wert {
    flex: none;
    color: var(--se-muted);
    font-size: var(--se-fs-sm);
  }

  .vorschlag.marke { background: var(--se-accent-soft); }
`
