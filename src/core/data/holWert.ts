import {
  pruefeParameterBindung,
  type ActionParamBinding,
  type ActionParamSource,
} from './aktionen'
import { artFuer, type DataSourceKind } from './quellenArten'

// Woher ein Parameter DIESER Quelle seinen Wert ziehen darf. Eine Quelle holt
// ohne Baustein und ohne laufende Kette: alles, was an einem Klick, einer
// Zeile oder einem Schritt-Ergebnis haengt, gaebe es hier nicht und ginge
// still leer hinaus.
export const HOL_WERT_QUELLEN = ['fixed', 'data_field', 'se_variable'] as const

export function holWertQuelleErlaubt(source: ActionParamSource): boolean {
  // 'aus' ist kein Angebot, nur Nachsicht mit Gespeichertem: ein
  // weggelassener Parameter geht leer hinaus, und das ist gewollt.
  return source === 'aus' || (HOL_WERT_QUELLEN as readonly string[]).includes(source)
}

export interface HolWert {
  relationId: string

  params: readonly ActionParamBinding[]
}

export function pruefeHolWert(raw: unknown): HolWert | null {
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Record<string, unknown>
  const relationId = typeof e.relationId === 'string' ? e.relationId.trim() : ''
  if (relationId === '') return null
  if (!Array.isArray(e.params)) return null
  const params: ActionParamBinding[] = []
  for (const roh of e.params) {
    const binding = pruefeParameterBindung(roh)
    // Ein unlesbarer oder hier sinnloser Parameter macht die ganze Angabe
    // ungueltig. Ihn einzeln wegzulassen hiesse, die Relation mit einem
    // stillschweigend verschobenen Parameter-Feld hinauszuschicken.
    if (!binding || !holWertQuelleErlaubt(binding.source)) return null
    params.push(binding)
  }
  return { relationId, params }
}

export function holWertFor(
  source: { kind: DataSourceKind; holWert?: HolWert },
): HolWert | null {
  if (!artFuer(source.kind).holWertMoeglich) return null
  return source.holWert ?? null
}

// Die Quellen, aus denen ein Parameter dieser Quelle liest — sie muessen mit
// in die Maske, sonst faende die Laufzeit sie nicht.
export function quellenAusHolWert(
  source: { kind: DataSourceKind; holWert?: HolWert },
): { quelleId: string; code: string }[] {
  const raus: { quelleId: string; code: string }[] = []
  for (const binding of holWertFor(source)?.params ?? []) {
    if (binding.source !== 'data_field') continue
    const quelleId = binding.dataSourceId ?? ''
    if (quelleId !== '') raus.push({ quelleId, code: binding.value })
  }
  return raus
}
