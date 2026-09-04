import { kennungenVergeben } from '../../core/blocks/listenBindung'
import { ohneSpalten, rechnungAlsAttribut, rechnungVonAttribut } from '../../core/data/rechnung'

export interface Spalte {
  // Ketten-Parameter und Rechnung zeigen auf die Kennung, nie auf Platz oder
  // Belegfeld: ein Belegfeld kann doppelt vergeben sein (zweimal 930_3), und
  // die Rechnung erwischte dann stumm die falsche Spalte.
  kennung: string
  titel: string
  feld: string

  breite?: number

  summe?: boolean

  aenderbar?: boolean

  fuellFeld?: string

  // Das Suchfenster dieser Zelle (F4 beim Erfassen) — genau wie beim
  // Formularfeld „nachschlagen" einstellbar.
  //
  // LEER heisst Automatik: das Fenster nimmt die Spalten der Tabelle, die auf
  // dieselbe Hilfsquelle zeigen (fensterSpaltenIn). Das ist der Normalfall und
  // bleibt es. Erst wer etwas ANDERES sehen will — ein Feld, das die Tabelle
  // gar nicht fuehrt, andere Titel, andere Reihenfolge — stellt hier ein.
  //
  // Die Eintraege sind fluechtige Anzeige: nichts adressiert sie, darum tragen
  // sie keine Kennung.
  fensterSpalten?: Spalte[]

  // Groesse des Suchfensters. Ohne Wert rechnet sie sich aus der Spaltenzahl
  // (fensterBreiteFuer).
  fensterBreite?: number
  fensterHoehe?: number

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

function standardTitelFuer(index: number): string {
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

// Eine neue Tabelle startet mit EINER leeren Spalte.
export function standardSpalten(): Spalte[] {
  return mitKennungen([neueSpalte(0)])
}

function alsBreite(v: unknown): number | undefined {
  const zahl = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(zahl)) return undefined
  const gerundet = Math.round(zahl)
  return gerundet < SPALTEN_MIN_BREITE ? SPALTEN_MIN_BREITE : gerundet
}

// Fenstermasse kommen aus dem Baum und aus dem Attribut der exportierten
// Maske. Unter 120 px ist kein Fenster mehr, ueber 2000 passt es auf keinen
// Bildschirm — beides waere ein Fenster, das der Bediener nicht mehr
// zurechtruecken kann.
const FENSTER_MIN = 120
const FENSTER_MAX = 2000

function fensterMass(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined
  const zahl = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(zahl)) return undefined
  return Math.min(FENSTER_MAX, Math.max(FENSTER_MIN, Math.round(zahl)))
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

      // Eine leere Liste ist dasselbe wie keine: Automatik. So faellt eine
      // Spalte, deren Fenster-Spalten der Bauer alle wieder geloescht hat,
      // von selbst auf die Automatik zurueck, statt ein leeres Fenster zu
      // zeigen.
      ...(Array.isArray(o.fensterSpalten) && o.fensterSpalten.length > 0
        ? { fensterSpalten: o.fensterSpalten.map((s, i) => alsSpalte(s, i)) }
        : {}),

      ...(fensterMass(o.fensterBreite) === undefined
        ? {} : { fensterBreite: fensterMass(o.fensterBreite) as number }),

      ...(fensterMass(o.fensterHoehe) === undefined
        ? {} : { fensterHoehe: fensterMass(o.fensterHoehe) as number }),
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
  // Nie kuerzen: die Obergrenze gilt fuer das Anlegen neuer Spalten
  // (spaltenBindung). Eine gespeicherte Liste mit mehr Spalten bleibt ganz,
  // sonst verschoeben sich die Plaetze dahinter und Ketten schrieben stumm
  // falsche Werte ins ERP.
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
// Tabellenbreite verfehlte.
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

// Eine Spalte hinten anfuegen. Hier wird NICHT gerechnet: die Breiten sind
// Anteile (spalten.ts: spaltenRaster), die neue Spalte bekommt den mittleren
// Anteil, und das Raster fuellt die Tabelle von allein wieder aus. Feste
// Pixel umzuverteilen behandelte nur das Symptom.
export function fuegeSpalteAn(spalten: readonly Spalte[]): Spalte[] {
  return mitKennungen([...spalten, neueSpalte(spalten.length)])
}

// Die Rechnung zeigt ueber die dauerhafte Kennung auf ihre Spalten. Wird eine
// gestrichen, wird der Platz leer (= unbenutzt) — sonst rechnete die Maske mit
// einer Spalte, die es nicht mehr gibt, und die naechste neue Spalte kann
// dieselbe Kennung wieder bekommen. Rueckgabe: das neue Attribut, oder null,
// wenn nichts abzuraeumen ist. Gegenstueck fuer die Ketten-Parameter im ganzen
// Baum: state/spaltenAufraeumen.ts.
export function rechnungNachSpalten(
  roh: unknown,
  alt: readonly Spalte[],
  neu: readonly Spalte[],
): string | null {
  const rechnung = rechnungVonAttribut(roh)
  if (!rechnung) return null
  const bleibt = new Set(neu.map((s) => s.kennung))
  const gestrichen = alt.map((s) => s.kennung).filter((k) => k !== '' && !bleibt.has(k))
  const geputzt = ohneSpalten(rechnung, gestrichen)
  return geputzt === rechnung ? null : rechnungAlsAttribut(geputzt)
}

// Eine Spalte streichen — von ueberall her, nicht nur hinten. EINE Stelle
// fuer beide Wege: das Kreuz am Spaltenkopf nennt seinen Platz, der
// Minus-Knopf meint immer den letzten. Die letzte verbliebene Spalte bleibt
// stehen: eine Tabelle ohne Spalte waere ein leerer Kasten ohne Weg zurueck.
export function entferneSpalte(
  index: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  const neu = ohneSpalte(l, index)
  if (neu !== l) aendere([...neu])
}

// Streicht GENAU diese Spalte — rein: dieselbe Liste zurueck heisst „nicht
// erlaubt" (letzte Spalte, Platz ausserhalb). Die verbliebenen Anteile
// fuellen die Tabelle wieder aus (spaltenRaster), der Platz der gestrichenen
// bleibt nicht als leere Flaeche stehen.
export function ohneSpalte(spalten: readonly Spalte[], index: number): readonly Spalte[] {
  if (spalten.length <= SPALTEN_MIN || index < 0 || index >= spalten.length) return spalten
  return spalten.filter((_, i) => i !== index)
}

// Eine Spalte an einen anderen Platz setzen — rein: dieselbe Liste zurueck
// heisst „nichts zu tun". Alles Ihre reist im Eintrag mit (Kennung, Titel,
// Belegfeld, Fuellfeld, Breite); Ketten und Rechnung zeigen auf die KENNUNG
// und brauchen kein Nachziehen — genau dafuer gibt es sie (spalten.ts).
export function mitVerschobenerSpalte(
  spalten: readonly Spalte[],
  von: number,
  nach: number,
): readonly Spalte[] {
  if (von < 0 || von >= spalten.length) return spalten
  const ziel = Math.max(0, Math.min(nach, spalten.length - 1))
  if (ziel === von) return spalten
  const l = [...spalten]
  const [spalte] = l.splice(von, 1)
  l.splice(ziel, 0, spalte)
  return l
}

export function verschiebeSpalteAn(
  von: number,
  nach: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  const neu = mitVerschobenerSpalte(l, von, nach)
  if (neu !== l) aendere([...neu])
}
