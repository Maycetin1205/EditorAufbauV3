import { kennungenVergeben } from '../../core/blocks/listenBindung'

export interface Spalte {
  // Ketten-Parameter und Rechnung zeigen auf die Kennung, nie auf Platz oder
  // Belegfeld: ein Belegfeld kann doppelt vergeben sein (Nutzer-Vorfall
  // 2026-09-01: zweimal 930_3, die Rechnung erwischte stumm die falsche Spalte).
  kennung: string
  titel: string
  feld: string

  breite?: number

  summe?: boolean

  aenderbar?: boolean

  fuellFeld?: string

  // Jeder Zustand und jeder ERP-Kontrakt haengt am PLATZ der Spalte in dieser
  // vollen Liste: wer versteckte Spalten herauswirft, verschiebt alle Plaetze
  // dahinter und schreibt stumm falsche Werte ins ERP. Filtern nur beim Zeichnen.
  versteckt?: boolean
}

export interface Spaltensicht {
  spalten: readonly Spalte[]
  plaetze: readonly number[]
}

export function spaltenSicht(
  spalten: readonly Spalte[],
  alleZeigen: boolean,
  wegDurchBediener: ReadonlySet<string> = new Set(),
): Spaltensicht {
  const weg = (s: Spalte): boolean => s.versteckt === true || wegDurchBediener.has(s.kennung)
  if (alleZeigen || !spalten.some(weg)) {
    return { spalten, plaetze: spalten.map((_, i) => i) }
  }
  const gezeigt: Spalte[] = []
  const plaetze: number[] = []
  spalten.forEach((s, i) => {
    if (weg(s)) return
    gezeigt.push(s)
    plaetze.push(i)
  })
  if (gezeigt.length === 0 && spalten.length > 0) return { spalten: [spalten[0]], plaetze: [0] }
  return { spalten: gezeigt, plaetze }
}

export const ZELLE_PLATZHALTER = '—'

export const SPALTEN_MIN = 1

export const SPALTEN_MAX = 16

export const SPALTEN_MIN_BREITE = 40

export const STANDARD_TITEL = 'Spalte {n}'

export function standardTitelFuer(index: number): string {
  return STANDARD_TITEL.replace('{n}', String(index + 1))
}

export function neueSpalte(index: number): Spalte {
  return { kennung: '', titel: standardTitelFuer(index), feld: '' }
}

export function mitKennungen(spalten: readonly Spalte[]): Spalte[] {
  const kennungen = kennungenVergeben(spalten.map((s) => s.kennung))
  return spalten.map((s, i) => (s.kennung === kennungen[i] ? s : { ...s, kennung: kennungen[i] }))
}

export function spalteMitKennung(spalten: readonly Spalte[], kennung: string): number {
  const t = kennung.trim()
  if (t === '') return -1
  return spalten.findIndex((s) => s.kennung === t)
}

// Eine neue Tabelle startet mit EINER leeren Spalte (Nutzer-Entscheidung
// 2026-09-01).
export function standardSpalten(): Spalte[] {
  return mitKennungen([neueSpalte(0)])
}

export function alsBreite(v: unknown): number | undefined {
  const zahl = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(zahl)) return undefined
  const gerundet = Math.round(zahl)
  return gerundet < SPALTEN_MIN_BREITE ? SPALTEN_MIN_BREITE : gerundet
}

function alsSpalte(x: unknown, index: number): Spalte {
  if (x && typeof x === 'object') {
    const o = x as Record<string, unknown>
    const breite = o.breite === undefined ? undefined : alsBreite(o.breite)
    return {
      kennung: typeof o.kennung === 'string' ? o.kennung.trim() : '',
      titel: typeof o.titel === 'string' ? o.titel : standardTitelFuer(index),
      feld: typeof o.feld === 'string' ? o.feld : '',

      ...(breite === undefined ? {} : { breite }),

      ...(typeof o.summe === 'boolean' ? { summe: o.summe } : {}),

      ...(typeof o.aenderbar === 'boolean' ? { aenderbar: o.aenderbar } : {}),

      ...(typeof o.versteckt === 'boolean' ? { versteckt: o.versteckt } : {}),

      ...(typeof o.fuellFeld === 'string' && o.fuellFeld.trim() !== ''
        ? { fuellFeld: o.fuellFeld.trim() }
        : {}),
    }
  }

  if (typeof x === 'string') return { ...neueSpalte(index), titel: x }
  return neueSpalte(index)
}

export function coerceSpalten(v: unknown): Spalte[] {
  let arr: Spalte[]
  if (Array.isArray(v)) {
    arr = v.map((x, i) => alsSpalte(x, i))
  } else if ((typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && /^\d+$/.test(v))) {
    const n = Math.max(1, Math.floor(Number(v)))
    arr = [...Array(n).keys()].map((i) => neueSpalte(i))
  } else {
    arr = standardSpalten()
  }
  if (arr.length > SPALTEN_MAX) arr = arr.slice(0, SPALTEN_MAX)
  if (arr.length < SPALTEN_MIN) arr = [neueSpalte(0)]
  return mitKennungen(arr)
}

export function tryCoerceSpalten(v: string): Spalte[] {
  try {
    return coerceSpalten(JSON.parse(v))
  } catch {
    return standardSpalten()
  }
}

// Die gezogene Zahl gilt als ANTEIL (`fr`), nicht als festes Pixelmass: feste
// Pixel liessen rechts eine leere Flaeche stehen, sobald ihre Summe die
// Tabellenbreite verfehlte (Nutzer-Befund 2026-08-31).
export function spaltenRaster(
  spalten: readonly Spalte[],
  breiten: (index: number) => number | undefined = () => undefined,
): string {
  const eigene = spalten.map((s, i) => breiten(i) ?? s.breite)
  const gesetzt = eigene.filter((w): w is number => w !== undefined)
  const mittel = gesetzt.length === 0
    ? 1
    : Math.max(1, Math.round(gesetzt.reduce((a, b) => a + b, 0) / gesetzt.length))
  return eigene.map((w) => `minmax(0, ${w ?? mittel}fr)`).join(' ')
}
