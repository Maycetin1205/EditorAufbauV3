// Eine Eingabestelle in einer Zelle: dasselbe Feld, ob die Zeile neu oder gebucht ist.
import { css, html, nothing, type TemplateResult } from 'lit'
import { vorschlagListeTpl, type Vorschlag } from './vorschlagListe'

// Ruhig = der Wert steht so in den Daten. Geaendert = vorgemerkt, noch nicht
// geschrieben. Automatisch = aus einem gewaehlten Satz gefuellt.
export type ZellenZustand = 'ruhig' | 'geaendert' | 'automatisch'

export interface ZellenEingabeLage {
  wert: string

  titel: string

  // Leer heisst keiner; er erscheint erst, wenn der Bediener in der Zeile steht.
  platzhalter: string

  // Der Platz in der VOLLEN Spaltenliste, nicht die Nummer des gezeichneten
  // Feldes: eine versteckte Spalte davor traefe sonst die falsche Zelle.
  platz: number

  zustand: ZellenZustand

  vorschlaege: readonly Vorschlag[]

  marke: number

  listeNachOben: boolean
}

export interface ZellenEingabeHandeln {
  tippen: (text: string) => void

  taste: (e: KeyboardEvent) => void

  verlassen: (text: string) => void

  waehleVorschlag: (index: number) => void

  setzeMarke: (index: number) => void
}

const KLASSE: Record<ZellenZustand, string> = {
  ruhig: 'zell-eingabe',
  geaendert: 'zell-eingabe geaendert',
  automatisch: 'zell-eingabe auto',
}

export function zellenEingabeTpl(
  lage: ZellenEingabeLage,
  tun: ZellenEingabeHandeln,
): TemplateResult {
  return html`<div class=${lage.listeNachOben ? 'zell-halter nach-oben' : 'zell-halter'}>
    <input
      class=${KLASSE[lage.zustand]}
      type="text"
      data-spalte=${lage.platz}
      aria-label=${lage.titel}
      placeholder=${lage.platzhalter}
      .value=${lage.wert}
      @input=${(e: Event) => tun.tippen((e.target as HTMLInputElement).value)}
      @keydown=${(e: KeyboardEvent) => tun.taste(e)}
      @blur=${(e: Event) => tun.verlassen((e.target as HTMLInputElement).value)}
    />
    ${lage.vorschlaege.length === 0 ? nothing : vorschlagListeTpl({
      eintraege: lage.vorschlaege,
      marke: lage.marke,
      onWaehlen: (i) => tun.waehleVorschlag(i),
      onMarke: (i) => tun.setzeMarke(i),
    })}
  </div>`
}

// Die Eingabestellen eines Bereichs an DIESEM Platz, in Zeilenreihenfolge.
export function zellenFelder(
  wurzel: ShadowRoot | null | undefined,
  bereich: string,
  platz: number,
): HTMLInputElement[] {
  const gefunden = wurzel?.querySelectorAll<HTMLInputElement>(
    `${bereich} .zell-eingabe[data-spalte="${platz}"]`,
  )
  return gefunden === undefined ? [] : Array.from(gefunden)
}

// In eine Eingabestelle gehen: Fokus, Text markiert, ins Bild gerollt.
export function geheInZelle(feld: HTMLInputElement | null | undefined): boolean {
  if (!feld) return false
  feld.focus()
  feld.select()
  feld.scrollIntoView({ block: 'nearest' })
  return true
}

export const zellenEingabeStil = css`
      .zell-halter {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
      }

      .zell-halter.nach-oben .vorschlaege {
        top: auto;
        bottom: 100%;
        margin: 0 0 2px;
      }

      .zell-eingabe {
        box-sizing: border-box;
        width: 100%;
        height: calc(var(--zeilen-hoehe) - 8px);
        min-width: 0;
        padding: 0 var(--se-eingabe-x);
        font-family: var(--se-font);
        font-size: var(--se-fs);
        color: var(--se-ink);
        background: transparent;
        border: var(--se-border) solid transparent;
        border-radius: var(--se-r-sm);
      }

      .zell-eingabe:focus { outline: none; }

      .zell-eingabe::placeholder { color: transparent; }
      .zeile:focus-within .zell-eingabe::placeholder { color: var(--se-faint); }

      .zell-eingabe.geaendert {
        background: var(--se-amber-shell);
        border-color: var(--se-amber-line);
        color: var(--se-ink);
        font-weight: 600;
      }

      .zell-eingabe.auto {
        color: var(--se-accent);
        font-style: italic;
        background: var(--se-accent-soft);
      }
`
