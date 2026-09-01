// Die Rechnung der Belegerfassung:
//   Abgabemenge = Anzahl x Dosis x Tage
// Gerechnet wird der EINE leere Platz; Getipptes und aus Quellen Gefuelltes
// gilt als gegeben.
//
// Tiergewicht und "je kg" sind am 2026-09-01 auf Nutzer-Ansage RAUS: die
// Dosis gilt pro Tier. Mit ihnen war ein Artikel, bei dem in der IDB ein
// Koerpergewicht steht (313_5, z. B. Baytril "5 ml / 50 kg"), nur zu rechnen,
// wenn der Bediener zusaetzlich ein Tiergewicht tippte — sonst waren es zwei
// Luecken und die Rechnung schwieg. Genau das war der Nutzer-Befund. Nicht
// ohne neue Entscheidung wieder einbauen.

export type RundungsRichtung = 'auf' | 'ab' | 'kfm'

export interface Rundung {
  stellen: number
  richtung: RundungsRichtung
}

export interface RechnungsPlatz {
  // Spalten-Referenz ueber die dauerhafte KENNUNG der Spalte (Spalte.kennung),
  // nie ueber Platz oder Belegfeld: Plaetze verrutschen beim Verschieben/
  // Loeschen, und ein doppelt vergebenes Belegfeld traf stumm die falsche
  // Spalte (Nutzer-Vorfall 2026-09-01). Leer = Platz unbenutzt (Faktor 1).
  spalte: string
  runden: Rundung
}

export type PlatzKey = 'menge' | 'anzahl' | 'dosis' | 'tage'

export const PLATZ_KEYS: readonly PlatzKey[] = ['menge', 'anzahl', 'dosis', 'tage']

export const PLATZ_NAMEN: Record<PlatzKey, string> = {
  menge: 'Abgabemenge',
  anzahl: 'Anzahl Tiere',
  dosis: 'Dosis',
  tage: 'Behandlungstage',
}

// Einheiten trägt die Rechnung KEINE (ein Einheiten-Umrechner an der
// Abgabemenge ist am 2026-09-01 auf Nutzer-Ansage wieder ausgebaut): die
// Einheit kommt aus den Daten der Zeile (Behandlungseinheit) und ist oft
// gar nicht umrechenbar ('Inj.', 'Stab') — getippt wird in genau ihr.
export interface Rechnung {
  menge: RechnungsPlatz
  anzahl: RechnungsPlatz
  dosis: RechnungsPlatz
  tage: RechnungsPlatz
}

const RUNDEN_STANDARD: Rundung = { stellen: 3, richtung: 'kfm' }

export function leereRechnung(): Rechnung {
  return {
    menge: { spalte: '', runden: { ...RUNDEN_STANDARD } },
    // Tiere sind ganze Tiere; aufgerundet, damit keines leer ausgeht
    // (Nutzer-Entscheidung 2026-08-31).
    anzahl: { spalte: '', runden: { stellen: 0, richtung: 'auf' } },
    dosis: { spalte: '', runden: { ...RUNDEN_STANDARD } },
    tage: { spalte: '', runden: { ...RUNDEN_STANDARD } },
  }
}

export function istRechnungLeer(r: Rechnung): boolean {
  return PLATZ_KEYS.every((k) => r[k].spalte.trim() === '')
}

// Getippte Zahl, deutsch und STRENG: Komma ist das Dezimalzeichen, Punkte
// nur als gueltige Tausender-Gruppen. '0.750' ist KEINE davon und bleibt
// ungelesen (null) — raten hiesse hier Faktor 1000 (Dosierfehler).
const STRENG = /^-?\d+(,\d+)?$|^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/

export function zahlStreng(text: string): number | null {
  const t = text.trim()
  if (t === '' || !STRENG.test(t)) return null
  const n = Number(t.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export function rundeWert(wert: number, runden: Rundung): number {
  const f = Math.pow(10, Math.max(0, runden.stellen))
  const x = wert * f
  // Epsilon gegen Gleitkomma-Reste: 9.000000001 darf nicht auf 10 aufrunden.
  const grob = runden.richtung === 'auf'
    ? Math.ceil(x - 1e-9)
    : runden.richtung === 'ab' ? Math.floor(x + 1e-9) : Math.round(x)
  return grob / f
}

// Gerechnete Werte reisen OHNE Tausender-Gruppierung ('2,7', '5000'): so
// liest jeder Parser sie eindeutig zurueck.
export function platzText(wert: number, stellen: number): string {
  return wert.toLocaleString('de-DE', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.max(0, stellen),
  })
}

// null = leer (Luecke) · 'fehler' = belegt, aber nicht als Zahl lesbar.
export type PlatzWert = number | null | 'fehler'

export function loeseRechnung(
  r: Rechnung,
  werte: Readonly<Record<PlatzKey, PlatzWert>>,
  konfiguriert: ReadonlySet<PlatzKey>,
): { platz: PlatzKey; wert: number } | null {
  if (!konfiguriert.has('menge')) return null

  const noetig: PlatzKey[] = ['menge']
  for (const k of ['anzahl', 'dosis', 'tage'] as const) {
    if (konfiguriert.has(k)) noetig.push(k)
  }

  const luecken: PlatzKey[] = []
  for (const k of noetig) {
    const w = werte[k]
    if (w === 'fehler') return null
    if (w === null) luecken.push(k)
  }
  if (luecken.length !== 1) return null
  const luecke = luecken[0]

  // Ein unbelegter oder leerer Platz zaehlt als Faktor 1: die Luecke selbst
  // steht so als 1 in der rechten Seite, und Teilen loest nach ihr auf.
  const zahl = (k: PlatzKey): number => {
    const w = werte[k]
    return typeof w === 'number' ? w : 1
  }

  const rechte = zahl('anzahl') * zahl('dosis') * zahl('tage')
  let wert: number
  if (luecke === 'menge') wert = rechte
  else {
    if (rechte === 0) return null
    wert = zahl('menge') / rechte
  }
  if (!Number.isFinite(wert)) return null
  return { platz: luecke, wert: rundeWert(wert, r[luecke].runden) }
}

function alsRundung(roh: unknown, standard: Rundung): Rundung {
  if (!roh || typeof roh !== 'object') return { ...standard }
  const o = roh as Record<string, unknown>
  const stellen = typeof o.stellen === 'number'
    && Number.isInteger(o.stellen) && o.stellen >= 0 && o.stellen <= 6
    ? o.stellen
    : standard.stellen
  const richtung = o.richtung === 'auf' || o.richtung === 'ab' || o.richtung === 'kfm'
    ? o.richtung
    : standard.richtung
  return { stellen, richtung }
}

function alsPlatz(roh: unknown, standard: Rundung): RechnungsPlatz {
  if (!roh || typeof roh !== 'object') return { spalte: '', runden: { ...standard } }
  const o = roh as Record<string, unknown>
  return {
    spalte: typeof o.spalte === 'string' ? o.spalte : '',
    runden: alsRundung(o.runden, standard),
  }
}

// Liest das `rechnung`-Attribut der Tabelle (JSON-String im Baum/Export).
// null nur, wenn gar nichts Brauchbares dasteht — eine Rechnung ohne
// belegte Plaetze kommt coerct zurueck, damit das Formular nichts verliert.
export function rechnungVonAttribut(roh: unknown): Rechnung | null {
  let wert: unknown = roh
  if (typeof roh === 'string') {
    const t = roh.trim()
    if (t === '') return null
    try {
      wert = JSON.parse(t)
    } catch {
      return null
    }
  }
  if (!wert || typeof wert !== 'object' || Array.isArray(wert)) return null
  const o = wert as Record<string, unknown>
  const leer = leereRechnung()
  return {
    menge: alsPlatz(o.menge, leer.menge.runden),
    anzahl: alsPlatz(o.anzahl, leer.anzahl.runden),
    dosis: alsPlatz(o.dosis, leer.dosis.runden),
    tage: alsPlatz(o.tage, leer.tage.runden),
  }
}

export function rechnungAlsAttribut(r: Rechnung): string {
  return JSON.stringify(r)
}
