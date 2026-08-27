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
}

export function rumpfHoehe(ziel: MessZiel): number {
  if (!ziel.hasAttribute('fuellt')) return OHNE_RUMPF
  const rumpf = ziel.renderRoot.querySelector('.koerper')
  return rumpf instanceof HTMLElement ? rumpf.clientHeight : OHNE_RUMPF
}

export function gemessenesMass(ziel: MessZiel, takt: number): Rumpfmessung {
  const hoehe = rumpfHoehe(ziel)
  if (hoehe === OHNE_RUMPF) return { mass: null, hoehe }
  // Ohne Kopfzeile (Schalter „Kopfzeile" aus) gehoert die ganze Hoehe den
  // Zeilen — der Kopf ist dann schlicht 0 hoch, keine Messluecke.
  const kopf = ziel.renderRoot.querySelector('.kopf')
  const kopfHoehe = kopf instanceof HTMLElement ? kopf.offsetHeight : 0
  return { mass: zeilenmass(hoehe, kopfHoehe, takt), hoehe }
}

export function beobachteRumpf(ziel: MessZiel, beiAenderung: () => void): ResizeObserver | null {
  if (typeof ResizeObserver === 'undefined') return null
  const rumpf = ziel.renderRoot.querySelector('.koerper')
  if (!rumpf) return null
  const beobachter = new ResizeObserver(beiAenderung)
  beobachter.observe(rumpf)
  return beobachter
}
