import { zeilenmass, type Zeilenmass } from './seitengroesse'

// „Nicht gemessen": kein fuellt-Attribut, oder der Rumpf steht noch nicht.
export const OHNE_RUMPF = -1

export interface MessZiel {
  hasAttribute(name: string): boolean
  renderRoot: { querySelector(auswahl: string): Element | null }
}

export interface Rumpfmessung {
  mass: Zeilenmass | null

  // Die Rumpfhoehe, aus der das Mass entstand — gemerkt, weil sie sich NACH
  // der Messung noch aendert: die Fusszeile haengt an der Seitenzahl, die
  // Seitenzahl am Mass. Sie erscheint also erst, wenn schon gerechnet ist,
  // und nimmt dem Rumpf dann ihren Platz weg. Passt die gemerkte Hoehe nicht
  // mehr zur echten, ist das Mass veraltet und die letzte Zeile angeschnitten.
  hoehe: number

  // Die Kopfhoehe, mit der gerechnet wurde — aus demselben Grund gemerkt, und
  // sie ist der haeufigere Fall: im Editor wird der Kopf ZWEIZEILIG, sobald
  // eine Spalte an eine Hilfsquelle gebunden ist (der graue Quellname unter
  // dem Titel). Der ResizeObserver sieht das nicht, der Rumpf behaelt ja seine
  // Hoehe — nur der Kopf darin waechst. Ohne diesen Vergleich rechnet die
  // Tabelle mit einer Zeile zu viel: der Rumpf rollt, die Bildlaufleiste
  // nimmt allen Spalten Breite weg, und erst ein Neuladen raeumt es weg
  // (Nutzer-Befund 2026-08-31).
  kopf: number
}

export function rumpfHoehe(ziel: MessZiel): number {
  if (!ziel.hasAttribute('fuellt')) return OHNE_RUMPF
  const rumpf = ziel.renderRoot.querySelector('.koerper')
  return rumpf instanceof HTMLElement ? rumpf.clientHeight : OHNE_RUMPF
}

// Ohne Kopfzeile (Schalter „Kopfzeile" aus) gehoert die ganze Hoehe den
// Zeilen — der Kopf ist dann schlicht 0 hoch, keine Messluecke.
export function kopfHoehe(ziel: MessZiel): number {
  const kopf = ziel.renderRoot.querySelector('.kopf')
  return kopf instanceof HTMLElement ? kopf.offsetHeight : 0
}

export function gemessenesMass(ziel: MessZiel, takt: number): Rumpfmessung {
  const hoehe = rumpfHoehe(ziel)
  if (hoehe === OHNE_RUMPF) return { mass: null, hoehe, kopf: 0 }
  const kopf = kopfHoehe(ziel)
  return { mass: zeilenmass(hoehe, kopf, takt), hoehe, kopf }
}

export function beobachteRumpf(ziel: MessZiel, beiAenderung: () => void): ResizeObserver | null {
  if (typeof ResizeObserver === 'undefined') return null
  const rumpf = ziel.renderRoot.querySelector('.koerper')
  if (!rumpf) return null
  const beobachter = new ResizeObserver(beiAenderung)
  beobachter.observe(rumpf)
  return beobachter
}
