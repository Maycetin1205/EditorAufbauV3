export interface Spalte {
  // Der dauerhafte Ausweis der Spalte innerhalb ihrer Tabelle ('s1', 's2', …).
  // Ketten-Parameter und die Rechnung zeigen auf IHN — nie auf den Platz und
  // nie auf das Belegfeld: Platznummern verrutschen beim Löschen/Verschieben,
  // und ein Belegfeld kann doppelt vergeben sein (Nutzer-Vorfall 2026-09-01:
  // zweimal 930_3, die Rechnung erwischte stumm die falsche Spalte). Für die
  // Ketten übersetzt der Export die Kennung in den Platz (withoutEditorId);
  // im spalten-Attribut reist sie mit, damit die Rechnung sie zur Laufzeit
  // auflösen kann.
  kennung: string
  titel: string
  feld: string

  // Die von Hand am Spaltenkopf gezogene Breite: der Pixelwert im Moment des
  // Zugs, im Raster als ANTEIL verrechnet (spaltenRaster). Ohne Wert bekommt
  // die Spalte das Mittel der uebrigen, ohne jeden Wert teilen alle gleich.
  // Bewusst nicht vom Inhalt abhaengig — eine inhaltsabhaengige Breite spraenge
  // beim Blaettern, sobald die naechste Seite kuerzere Werte traegt.
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
  return { kennung: '', titel: standardTitelFuer(index), feld: '' }
}

// Die Nummer, ab der neue Kennungen vergeben werden: HÖCHSTE vergebene + 1,
// nie die niedrigste Lücke. Eine gelöschte Spalte hinterlässt ihre Nummer,
// und wer sie neu vergibt, lässt Rechnung und Ketten-Parameter stumm auf die
// frische Spalte zeigen — sie zeigen ja auf die Kennung (Nutzer-Vorfall
// 2026-09-01). Eine Kennung, die nicht 'sN' ist, zählt nicht mit; mit ihr
// kollidieren die neuen ohnehin nicht.
//
// ⚠ Zwilling: `vergebeKennungen` in `state/migrationenRoh.ts` macht dasselbe
// auf den Rohdaten (sie darf nichts aus einem Baustein importieren, Regel 2).
// Wer hier etwas ändert, ändert es dort mit.
function abNummer(vergeben: ReadonlySet<string>): number {
  let hoechste = 0
  for (const k of vergeben) {
    const treffer = /^s(\d+)$/.exec(k)
    if (treffer) hoechste = Math.max(hoechste, Number(treffer[1]))
  }
  return hoechste + 1
}

// Vergibt fehlende Kennungen ('s1', 's2', …) und behebt doppelte — die
// vorderste behält ihre. Bestehende bleiben unangetastet: an ihnen hängen
// Ketten-Parameter und Rechnung, eine neu vergebene zeigte woandershin.
export function mitKennungen(spalten: readonly Spalte[]): Spalte[] {
  const vergeben = new Set<string>()
  // Erst ALLE vorhandenen einsammeln, auch die weiter hinten stehenden: sonst
  // bekäme eine vordere Lücke eine Nummer, die hinten schon vergeben ist.
  for (const s of spalten) {
    const roh = s.kennung.trim()
    if (roh !== '') vergeben.add(roh)
  }
  let naechste = abNummer(vergeben)
  const behalten = new Set<string>()
  return spalten.map((s) => {
    const roh = s.kennung.trim()
    if (roh !== '' && !behalten.has(roh)) {
      behalten.add(roh)
      return s
    }
    while (vergeben.has(`s${naechste}`)) naechste += 1
    const kennung = `s${naechste}`
    vergeben.add(kennung)
    behalten.add(kennung)
    return { ...s, kennung }
  })
}

// Die Spalte mit dieser Kennung — -1 bei leer/unbekannt (Zelle bleibt leer,
// dieselbe Antwort wie überall im Projekt).
export function spalteMitKennung(spalten: readonly Spalte[], kennung: string): number {
  const t = kennung.trim()
  if (t === '') return -1
  return spalten.findIndex((s) => s.kennung === t)
}

export function standardSpalten(): Spalte[] {
  return mitKennungen([0, 1, 2].map((i) => neueSpalte(i)))
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
      kennung: typeof o.kennung === 'string' ? o.kennung.trim() : '',
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
  // Jede Lesung liefert vollstaendige Kennungen — auch das Attribut einer
  // Maske, die vor der Kennung exportiert wurde.
  return mitKennungen(arr)
}

export function tryCoerceSpalten(v: string): Spalte[] {
  try {
    return coerceSpalten(JSON.parse(v))
  } catch {
    return standardSpalten()
  }
}

// Das Raster der Tabelle: Kopf, Zeilen und Lineal benutzen dieselbe Spur —
// EINE Stelle, sonst stehen Kopf und Zellen versetzt.
//
// Die gezogene Zahl gilt als ANTEIL (`fr`), nicht als festes Pixelmass: ein
// fr-Raster fuellt die Tabelle immer genau aus. Feste Pixel taten das nur,
// solange ihre Summe zufaellig die Tabellenbreite traf — sonst stand rechts
// eine leere Flaeche (Nutzer-Befund 2026-08-31), spaetestens nachdem die
// Tabelle auf der Flaeche groesser gezogen war. Zwei Anlaeufe (7f92603,
// 040b73c) haben an dieser Summe gerechnet; jetzt gibt es keine.
//
// Spalten ohne eigene Zahl bekommen das Mittel der gesetzten — so bleiben
// alte Masken stehen, in denen nur einzelne Spalten gezogen wurden. Ohne jede
// Zahl teilen alle gleichmaessig (1fr).
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
