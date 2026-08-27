import { parseBlockEvents } from '../../core/data/aktionen'
import type {
  AenderungsTraegerElement,
  ErfassungsTraegerElement,
  LoeschTraegerElement,
  VormerkArt,
} from '../../core/blocks/BlockDefinition'
import { abschnitteVon, sucheTraeger } from './seAktionen'

// Wie viel noch offen ist. Der Baustein, der die Zeilen haelt, sagt es in
// seiner Fusszeile; der Knopf, dessen Kette sie schreibt, sagt es in
// denselben Worten. Beide lesen dieselbe Funktion — sonst haette der
// Bediener zwei Zahlen vor sich und muesste raten, welche gilt.

export const VORMERK_EVENT = 'ff-vormerkungen'

export interface VormerkZahlen {
  erfasst: number
  geaendert: number
  geloescht: number
}

type VormerkTraeger = HTMLElement
  & Partial<ErfassungsTraegerElement>
  & Partial<AenderungsTraegerElement>
  & Partial<LoeschTraegerElement>

// „1 neue Zeile, 2 geänderte Zeilen, 1 Löschung vorgemerkt". Gezaehlt werden
// ZEILEN, nicht Zellen: die Summe ist zugleich die Zahl der Laeufe, die der
// Knopf vor sich hat.
export function vormerkText(erfasst: number, geaendert: number, geloescht: number): string {
  const teile: string[] = []
  if (erfasst > 0) teile.push(erfasst === 1 ? '1 neue Zeile' : `${erfasst} neue Zeilen`)
  if (geaendert > 0) {
    teile.push(geaendert === 1 ? '1 geänderte Zeile' : `${geaendert} geänderte Zeilen`)
  }
  if (geloescht > 0) {
    teile.push(geloescht === 1 ? '1 Löschung' : `${geloescht} Löschungen`)
  }
  return teile.length === 0 ? '' : `${teile.join(', ')} vorgemerkt`
}

export function vormerkSumme(zahlen: VormerkZahlen): number {
  return zahlen.erfasst + zahlen.geaendert + zahlen.geloescht
}

function anzahlVon(traeger: VormerkTraeger, art: VormerkArt): number {
  if (art === 'erfasst') return traeger.erfassteZeilen?.length ?? 0
  if (art === 'geaendert') return traeger.geaenderteZeilen?.length ?? 0
  return traeger.geloeschteZeilen?.length ?? 0
}

// Was DIESE Kette noch zu schreiben hat. Welche Listen das sind, steht in
// ihren eigenen Parametern — kein Bausteintyp kommt vor (Regel 2). undefined
// heisst: die Kette liest gar keine Vormerkungen, der Knopf bleibt ein
// gewoehnlicher Knopf ohne Zaehler.
export function vormerkStandVon(el: HTMLElement, eventKey: string): VormerkZahlen | undefined {
  const steps = parseBlockEvents(el.getAttribute('data-ff-aktionen'))[eventKey]
  if (!steps || steps.length === 0) return undefined
  const zahlen: VormerkZahlen = { erfasst: 0, geaendert: 0, geloescht: 0 }
  const gezaehlt = new Set<string>()
  for (const abschnitt of abschnitteVon(steps)) {
    if (abschnitt.art === 'einmal' || abschnitt.blockId === '') continue
    // Dieselbe Liste kann in mehreren Abschnitten stehen (erst anlegen, dann
    // nachtragen) — gezaehlt wird sie trotzdem nur einmal.
    const kennung = abschnitt.art + ' ' + abschnitt.blockId
    if (gezaehlt.has(kennung)) continue
    const traeger = sucheTraeger(el.ownerDocument ?? document, abschnitt.blockId)
    if (!traeger) continue
    gezaehlt.add(kennung)
    zahlen[abschnitt.art] += anzahlVon(traeger, abschnitt.art)
  }
  return gezaehlt.size === 0 ? undefined : zahlen
}

const zuletzt = new WeakMap<HTMLElement, string>()

// Der Baustein sagt der Maske, dass sich seine Vormerkungen geaendert haben.
// Nur bei echter Aenderung: gemeldet wird bei jedem Rendern, und das passiert
// bei jedem Tastendruck in einer aenderbaren Zelle.
export function meldeVormerkungen(el: VormerkTraeger): void {
  const jetzt = [
    anzahlVon(el, 'erfasst'),
    anzahlVon(el, 'geaendert'),
    anzahlVon(el, 'geloescht'),
  ].join(' ')
  if (zuletzt.get(el) === jetzt) return
  zuletzt.set(el, jetzt)
  el.dispatchEvent(new CustomEvent(VORMERK_EVENT, { bubbles: true, composed: true }))
}
