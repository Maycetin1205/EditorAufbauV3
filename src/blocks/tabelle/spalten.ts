import { kennungenVergeben } from '../../core/blocks/listenBindung'

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

  // Das Suchfenster dieser Zelle (F4 beim Erfassen) — genau wie beim
  // Formularfeld „nachschlagen" einstellbar (Nutzer-Ansage 2026-09-04).
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

  // Diese Spalte wird in der exportierten Maske NICHT gezeichnet — im Editor
  // schon, gedaempft. Sie bleibt eine vollwertige Spalte: die Rechnung rechnet
  // in sie hinein, die Kette schreibt sie ins ERP. Nur sehen soll der
  // Bediener sie nicht (Hilfsspalte).
  //
  // WICHTIG: Versteckt heisst NICHT weg. Jeder Zustand und jeder ERP-Kontrakt
  // haengt am PLATZ der Spalte in dieser vollen Liste — `datenzeilen`
  // (seRuntime), die Ketten-Parameter (exportMask friert Kennung -> Platz ein)
  // und die Rechnung (spalteMitKennung). Wer versteckte Spalten aus der Liste
  // wirft, verschiebt alle Plaetze dahinter und schreibt stumm falsche Werte
  // ins ERP. Gefiltert wird darum AUSSCHLIESSLICH beim Zeichnen, ueber
  // `spaltenSicht` — mit einer Abbildung zurueck auf den vollen Platz.
  versteckt?: boolean
}

// Was gezeichnet wird — und wo die gezeichnete Spalte in der VOLLEN Liste
// steht. `plaetze[j]` ist der volle Platz der j-ten gezeichneten Spalte.
// Im Editor ist alles gezeichnet, die Abbildung also die Identitaet.
export interface Spaltensicht {
  spalten: readonly Spalte[]
  plaetze: readonly number[]
}

export function spaltenSicht(
  spalten: readonly Spalte[],
  alleZeigen: boolean,

  // Was der BEDIENER in der fertigen Maske weggenommen hat (Kennungen,
  // spaltenWahl.ts). Im Editor gilt es nicht — dort baut man die Maske.
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
  // Ganz ohne Spalte haette die Maske kein Raster und keinen Kopf. Sind alle
  // versteckt, zeigt sie die erste — sonst stuende der Bediener vor einer
  // Tabelle ohne jede Spur und haelte sie fuer kaputt.
  if (gezeigt.length === 0 && spalten.length > 0) return { spalten: [spalten[0]], plaetze: [0] }
  return { spalten: gezeigt, plaetze }
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

// Vergibt fehlende Kennungen ('s1', 's2', …) und behebt doppelte — die
// vorderste behält ihre. Die Regel wohnt an EINER Stelle
// (core/blocks/listenBindung.ts, kennungenVergeben); die Roh-Migration in
// state/migrationenRoh.ts ruft dieselbe.
export function mitKennungen(spalten: readonly Spalte[]): Spalte[] {
  const kennungen = kennungenVergeben(spalten.map((s) => s.kennung))
  return spalten.map((s, i) => (s.kennung === kennungen[i] ? s : { ...s, kennung: kennungen[i] }))
}

// Die Spalte mit dieser Kennung — -1 bei leer/unbekannt (Zelle bleibt leer,
// dieselbe Antwort wie überall im Projekt).
export function spalteMitKennung(spalten: readonly Spalte[], kennung: string): number {
  const t = kennung.trim()
  if (t === '') return -1
  return spalten.findIndex((s) => s.kennung === t)
}

// Eine neue Tabelle startet mit EINER leeren Spalte (Nutzer-Entscheidung
// 2026-09-01): drei Platzhalter-Spalten waren drei Klicks zum Wegräumen.
export function standardSpalten(): Spalte[] {
  return mitKennungen([neueSpalte(0)])
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

      // Beide Schalter als BOOLEAN uebernehmen, nicht nur ein `true`.
      // Gespeichert wird nur die Abweichung vom Standard (listeFuerExport) —
      // bei „In der Zeile aenderbar" ist der Standard JA, die Abweichung also
      // ein `false`. Wer das hier wegwirft, laesst eine gerechnete Spalte
      // (Gesamt, Rohertrag) in der exportierten Maske tippbar: der Bediener
      // merkt eine Aenderung vor, die keine Kette je schreibt.
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
