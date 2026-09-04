import { zeilenmass, type Zeilenmass } from './seitengroesse'

export const OHNE_RUMPF = -1

export interface MessZiel {
  hasAttribute(name: string): boolean
  renderRoot: { querySelector(auswahl: string): Element | null }
}

export interface Rumpfmessung {
  mass: Zeilenmass | null

  hoehe: number

  // Der Kopf wird ZWEIZEILIG, sobald eine Spalte an eine Hilfsquelle gebunden ist;
  // der ResizeObserver sieht das nicht, der Rumpf behaelt seine Hoehe. Ohne diesen
  // Vergleich rechnet die Tabelle mit einer Zeile zu viel (Nutzer-Befund 2026-08-31).
  kopf: number
}

export function rumpfHoehe(ziel: MessZiel): number {
  if (!ziel.hasAttribute('fuellt')) return OHNE_RUMPF
  const rumpf = ziel.renderRoot.querySelector('.koerper')
  return rumpf instanceof HTMLElement ? rumpf.clientHeight : OHNE_RUMPF
}

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
