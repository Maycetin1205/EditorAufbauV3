export interface Spalte {
  titel: string
  feld: string

  // Breite in Pixeln, von Hand am Spaltenkopf gezogen. OHNE Wert teilt sich
  // die Spalte den freien Platz gleichmaessig mit allen anderen ohne Wert —
  // das ist der Standard, und er ist bewusst nicht vom Inhalt abhaengig
  // (eine inhaltsabhaengige Breite spraenge beim Blaettern, sobald die
  // naechste Seite kuerzere Werte traegt).
  breite?: number

  // Diese Spalte wird unter der Tabelle aufaddiert.
  summe?: boolean

  // In dieser Spalte darf der Bediener den Wert einer GEBUCHTEN Zeile
  // aendern. Die Aenderung bleibt vorgemerkt, bis eine Kette sie schreibt.
  aenderbar?: boolean

  // Nur beim ERFASSEN: die Zelle holt ihren Wert aus diesem Feld einer
  // Hilfsquelle (mit Quellen-Vorsatz), statt aus `feld`. Die gebuchte Zeile
  // zeigt weiter `feld`, und dorthin schreibt auch die Kette.
  fuellFeld?: string
}

// Der Strich, den eine Zelle ohne Wert zeigt: der Editor erfindet nie Daten
// (Regel 7). Eine Stelle, weil Datenzeile und Erfassungszeile denselben
// zeigen muessen.
export const ZELLE_PLATZHALTER = '—'

export const SPALTEN_MIN = 1

// Die Obergrenze stand bis 2026-08-28 auf 8, ohne Grund: sie stammt aus dem
// uebernommenen Altstand (c4bdad7), und nichts haengt an der Zahl — das
// Spaltenraster entsteht dynamisch aus den Spalten (tabelleAnsicht: cols).
// Eine Belegposition braucht allein sieben (ArtNr, Bezeichnung, Menge,
// Einheit, EPreis, Gesamt, Rohertrag), da war bei acht sofort Schluss.
// Die Grenze bleibt, damit der Plus-Knopf irgendwo aufhoert; 16 ist
// grosszuegig genug, dass sie im Arbeitsalltag nicht mehr auffaellt.
export const SPALTEN_MAX = 16

// Schmaler laesst sich eine Spalte nicht ziehen: darunter ist der Titel weg
// und der Greifstreifen der Nachbarin liegt auf demselben Fleck.
export const SPALTEN_MIN_BREITE = 40

export const STANDARD_TITEL = 'Spalte {n}'

export function standardTitelFuer(index: number): string {
  return STANDARD_TITEL.replace('{n}', String(index + 1))
}

export function neueSpalte(index: number): Spalte {
  return { titel: standardTitelFuer(index), feld: '' }
}

export function standardSpalten(): Spalte[] {
  return [0, 1, 2].map((i) => neueSpalte(i))
}

// Eine gezogene Breite kommt aus drei Richtungen: dem Zug selbst, dem
// gespeicherten Baum und dem Attribut der exportierten Maske. Alle drei
// laufen hier durch, damit nirgends eine halbe Zahl (0, negativ, "120px")
// als Spur im Raster landet.
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
      titel: typeof o.titel === 'string' ? o.titel : standardTitelFuer(index),
      feld: typeof o.feld === 'string' ? o.feld : '',

      ...(breite === undefined ? {} : { breite }),

      // Beide Schalter als BOOLEAN uebernehmen, nicht nur ein `true`.
      // Gespeichert wird nur die Abweichung vom Standard (listeFuerExport) —
      // bei „In der Zeile aenderbar" ist der Standard JA, die Abweichung also
      // ein `false`. Wer das hier wegwirft, laesst eine gerechnete Spalte
      // (Gesamt, Rohertrag) in der exportierten Maske tippbar: der Bediener
      // merkt eine Aenderung vor, die keine Kette je schreibt.
      ...(typeof o.summe === 'boolean' ? { summe: o.summe } : {}),

      ...(typeof o.aenderbar === 'boolean' ? { aenderbar: o.aenderbar } : {}),

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
  return arr
}

export function tryCoerceSpalten(v: string): Spalte[] {
  try {
    return coerceSpalten(JSON.parse(v))
  } catch {
    return standardSpalten()
  }
}

// Das Raster der Tabelle: Kopf, Zeilen und Lineal benutzen dieselbe Spur —
// EINE Stelle, sonst stehen Kopf und Zellen versetzt. Eine gezogene Spalte
// bekommt feste Pixel, alle uebrigen teilen sich den Rest zu gleichen
// Teilen. `minmax(0, …)` haelt lange Werte davon ab, ihre Spalte
// aufzublaehen.
export function spaltenRaster(
  spalten: readonly Spalte[],
  breiten: (index: number) => number | undefined = () => undefined,
): string {
  return spalten
    .map((s, i) => {
      const breite = breiten(i) ?? s.breite
      return breite === undefined ? 'minmax(0, 1fr)' : `${breite}px`
    })
    .join(' ')
}
