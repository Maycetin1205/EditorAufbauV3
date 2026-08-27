import type { DataSource } from './dataSources'

export interface SchluesselPaar {
  fromField: string
  toField: string
}

export const MAX_SCHLUESSELPAARE = 3

export function vollstaendigePaare(traeger: { keyPairs: readonly SchluesselPaar[] }): SchluesselPaar[] {
  return traeger.keyPairs.filter((p) => p.fromField.trim() !== '' && p.toField.trim() !== '')
}

export interface BausteinQuelle {
  quelleId: string

  // Die Quelle, mit der die Schlüsselpaare verbinden. Leer = die Hauptquelle
  // des Bausteins. Damit hängen nicht mehr alle Quellen sternförmig an der
  // ersten: Quelle 2 darf an Quelle 3 hängen, 3 an 4 (Nutzer 2026-08-27).
  partnerId: string

  keyPairs: SchluesselPaar[]
}

export const WEITERE_QUELLEN_PROP = 'weitereQuellen'

export const QUELLEN_DEFAULTS: Record<string, BausteinQuelle[]> = {
  [WEITERE_QUELLEN_PROP]: [],
}

// Eine gewählte Quelle genügt. Das Schlüsselpaar ist AUSDRÜCKLICH freiwillig
// (Nutzer 2026-08-27): eine Quelle ohne Paar ist eine reine Nachschlagequelle
// — der Bediener sucht den Satz von Hand aus, es gibt nichts zu verknüpfen.
// Vorher verlangte diese Stelle ein vollständiges Paar; auf einem leeren Beleg
// gibt es aber gar keine Zeile, an die man etwas hätte knüpfen können, und die
// Quelle fiel damit still aus Feldwähler und Export.
export function quelleBrauchbar(q: BausteinQuelle): boolean {
  return q.quelleId !== ''
}

export function weitereQuellenAus(roh: unknown): BausteinQuelle[] {
  if (!Array.isArray(roh)) return []
  const acc: BausteinQuelle[] = []
  for (const entry of roh) {
    if (!entry || typeof entry !== 'object') continue
    const e = entry as Record<string, unknown>
    if (typeof e.quelleId !== 'string') continue
    const keyPairs: SchluesselPaar[] = []
    for (const p of Array.isArray(e.keyPairs) ? e.keyPairs : []) {
      if (!p || typeof p !== 'object') continue
      const pp = p as Record<string, unknown>
      if (typeof pp.fromField !== 'string' || typeof pp.toField !== 'string') continue
      keyPairs.push({ fromField: pp.fromField, toField: pp.toField })
    }
    acc.push({
      quelleId: e.quelleId,
      // Alte Masken kennen die Angabe nicht: leer heisst Hauptquelle, also
      // genau das Verhalten von vorher. Deshalb braucht es keine Migration.
      partnerId: typeof e.partnerId === 'string' ? e.partnerId : '',
      keyPairs: keyPairs.slice(0, MAX_SCHLUESSELPAARE),
    })
  }
  return acc
}

export interface QuelleInReichweite {
  source: DataSource

  paare?: SchluesselPaar[]

  // Leer = Hauptquelle; fehlt ganz bei der Hauptquelle selbst.
  partnerId?: string
}

export function quellenAufloesen(
  sourceId: unknown,
  weitereRoh: unknown,
  bibliothek: readonly DataSource[],
): QuelleInReichweite[] {
  const erste = typeof sourceId === 'string' && sourceId !== ''
    ? bibliothek.find((s) => s.id === sourceId)
    : undefined
  if (!erste) return []
  const acc: QuelleInReichweite[] = [{ source: erste }]
  const gesehen = new Set<string>([erste.id])
  for (const q of weitereQuellenAus(weitereRoh)) {
    if (gesehen.has(q.quelleId) || !quelleBrauchbar(q)) continue
    const source = bibliothek.find((s) => s.id === q.quelleId)
    if (!source) continue
    gesehen.add(source.id)
    // Eine Quelle, die auf sich selbst zeigt, ist kein Partner — sie fiele
    // sonst der Kettenauflösung zur Laufzeit als Kreis vor die Füsse.
    const partnerId = q.partnerId === source.id ? '' : q.partnerId
    acc.push({ source, paare: vollstaendigePaare(q), partnerId })
  }
  return acc
}

export function paarKlartext(
  paare: readonly SchluesselPaar[],
  erste: DataSource | undefined,
): string {
  return paare
    .map((p) => erste?.fields.find((f) => f.code === p.fromField)?.label ?? '')
    .filter((n) => n !== '')
    .join(' + ')
}
