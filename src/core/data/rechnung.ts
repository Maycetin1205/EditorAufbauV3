// Die Rechnung der Belegerfassung (Auftrag: RECHNUNG-BELEGERFASSUNG.md):
//   Abgabemenge = Anzahl x Dosis x (Tiergewicht / Bezug) x Tage
// Gerechnet wird der EINE leere Platz; Getipptes und aus Quellen Gefuelltes
// gilt als gegeben. Bezug leer (Dosis pro Tier) -> das Paar faellt auf 1.

export type RundungsRichtung = 'auf' | 'ab' | 'kfm'

export interface Rundung {
  stellen: number
  richtung: RundungsRichtung
}

export type EinheitenArt = 'masse' | 'volumen' | 'stueck'

export interface EinheitenEintrag {
  // Die Schreibweise, wie sie in den ERP-Daten steht ('ml', 'Inj.').
  kennung: string
  klarname: string
  art: EinheitenArt
  faktor: number
}

export interface RechnungsPlatz {
  // Spalten-Referenz ueber deren `feld`. Leer = Platz unbenutzt (Faktor 1).
  feld: string
  runden: Rundung
}

export type PlatzKey = 'menge' | 'anzahl' | 'dosis' | 'gewicht' | 'bezug' | 'tage'

export const PLATZ_KEYS: readonly PlatzKey[] = [
  'menge', 'anzahl', 'dosis', 'gewicht', 'bezug', 'tage',
]

export const PLATZ_NAMEN: Record<PlatzKey, string> = {
  menge: 'Abgabemenge',
  anzahl: 'Anzahl Tiere',
  dosis: 'Dosis',
  gewicht: 'Tiergewicht',
  bezug: 'je (kg)',
  tage: 'Behandlungstage',
}

export interface Rechnung {
  menge: RechnungsPlatz
  anzahl: RechnungsPlatz
  dosis: RechnungsPlatz
  gewicht: RechnungsPlatz
  bezug: RechnungsPlatz
  tage: RechnungsPlatz

  // Woher die Ziel-Einheit der Abgabemenge kommt (Spalten-`feld`, z. B. die
  // Einheiten-Spalte mit Fuellfeld Behandlungseinheit). Leer = kein Umrechner.
  einheitFeld: string
  einheiten: EinheitenEintrag[]
}

export const STANDARD_EINHEITEN: readonly EinheitenEintrag[] = [
  { kennung: 'mg', klarname: 'Milligramm', art: 'masse', faktor: 0.001 },
  { kennung: 'g', klarname: 'Gramm', art: 'masse', faktor: 1 },
  { kennung: 'kg', klarname: 'Kilogramm', art: 'masse', faktor: 1000 },
  { kennung: 'ml', klarname: 'Milliliter', art: 'volumen', faktor: 1 },
  { kennung: 'l', klarname: 'Liter', art: 'volumen', faktor: 1000 },
]

const RUNDEN_STANDARD: Rundung = { stellen: 3, richtung: 'kfm' }

export function leereRechnung(): Rechnung {
  return {
    menge: { feld: '', runden: { ...RUNDEN_STANDARD } },
    // Tiere sind ganze Tiere; aufgerundet, damit keines leer ausgeht
    // (Nutzer-Entscheidung 2026-08-31).
    anzahl: { feld: '', runden: { stellen: 0, richtung: 'auf' } },
    dosis: { feld: '', runden: { ...RUNDEN_STANDARD } },
    gewicht: { feld: '', runden: { ...RUNDEN_STANDARD } },
    bezug: { feld: '', runden: { ...RUNDEN_STANDARD } },
    tage: { feld: '', runden: { ...RUNDEN_STANDARD } },
    einheitFeld: '',
    einheiten: [...STANDARD_EINHEITEN],
  }
}

export function istRechnungLeer(r: Rechnung): boolean {
  return PLATZ_KEYS.every((k) => r[k].feld.trim() === '')
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

// Umgerechnet wird nur innerhalb derselben Art (Masse<->Masse). Gleiche
// Kennung braucht keine Liste (Stab -> Stab). Unbekannt/unpassend -> null.
export function umgerechnet(
  wert: number,
  von: string,
  nach: string,
  einheiten: readonly EinheitenEintrag[],
): number | null {
  const vonK = von.trim()
  const nachK = nach.trim()
  if (vonK === '' || nachK === '') return null
  if (vonK === nachK) return wert
  const a = einheiten.find((e) => e.kennung === vonK)
  const b = einheiten.find((e) => e.kennung === nachK)
  if (!a || !b || a.art !== b.art) return null
  return (wert * a.faktor) / b.faktor
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
  const bezug = konfiguriert.has('bezug') ? werte.bezug : null
  if (bezug === 'fehler') return null
  // Bezug mit Wert -> Dosis gilt je Bezugsgewicht, das Tiergewicht zaehlt.
  // Bezug leer -> Dosis gilt pro Tier, das Paar faellt komplett weg.
  const paarAktiv = typeof bezug === 'number'
  if (paarAktiv && bezug === 0) return null

  const noetig: PlatzKey[] = ['menge']
  for (const k of ['anzahl', 'dosis', 'tage'] as const) {
    if (konfiguriert.has(k)) noetig.push(k)
  }
  if (paarAktiv && konfiguriert.has('gewicht')) noetig.push('gewicht')

  const luecken: PlatzKey[] = []
  for (const k of noetig) {
    const w = werte[k]
    if (w === 'fehler') return null
    if (w === null) luecken.push(k)
  }
  if (luecken.length !== 1) return null
  const luecke = luecken[0]

  const zahl = (k: PlatzKey): number => {
    const w = werte[k]
    return typeof w === 'number' ? w : 1
  }

  let wert: number
  if (luecke === 'gewicht') {
    const nenner = zahl('anzahl') * zahl('dosis') * zahl('tage')
    if (nenner === 0) return null
    wert = (zahl('menge') / nenner) * (bezug as number)
  } else {
    const ratio = paarAktiv ? zahl('gewicht') / (bezug as number) : 1
    const rechte = zahl('anzahl') * zahl('dosis') * zahl('tage') * ratio
    if (luecke === 'menge') wert = rechte
    else {
      // Der Luecken-Faktor steht in `rechte` als 1 — teilen loest nach ihm auf.
      if (rechte === 0) return null
      wert = zahl('menge') / rechte
    }
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
  if (!roh || typeof roh !== 'object') return { feld: '', runden: { ...standard } }
  const o = roh as Record<string, unknown>
  return {
    feld: typeof o.feld === 'string' ? o.feld : '',
    runden: alsRundung(o.runden, standard),
  }
}

function alsEinheiten(roh: unknown): EinheitenEintrag[] {
  if (!Array.isArray(roh)) return []
  const raus: EinheitenEintrag[] = []
  for (const e of roh) {
    if (!e || typeof e !== 'object') continue
    const o = e as Record<string, unknown>
    const kennung = typeof o.kennung === 'string' ? o.kennung.trim() : ''
    const art = o.art === 'masse' || o.art === 'volumen' || o.art === 'stueck' ? o.art : null
    const faktor = typeof o.faktor === 'number' && Number.isFinite(o.faktor) && o.faktor > 0
      ? o.faktor
      : null
    if (kennung === '' || art === null || faktor === null) continue
    raus.push({
      kennung,
      klarname: typeof o.klarname === 'string' && o.klarname.trim() !== ''
        ? o.klarname
        : kennung,
      art,
      faktor,
    })
  }
  return raus
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
    gewicht: alsPlatz(o.gewicht, leer.gewicht.runden),
    bezug: alsPlatz(o.bezug, leer.bezug.runden),
    tage: alsPlatz(o.tage, leer.tage.runden),
    einheitFeld: typeof o.einheitFeld === 'string' ? o.einheitFeld : '',
    einheiten: alsEinheiten(o.einheiten),
  }
}

export function rechnungAlsAttribut(r: Rechnung): string {
  return JSON.stringify(r)
}
