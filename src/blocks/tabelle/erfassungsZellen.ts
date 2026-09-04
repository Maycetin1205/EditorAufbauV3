import { zerlegeBindung } from '../../core/blocks/BlockDefinition'
import type { Rechnung } from '../../core/data/rechnung'
import type { SchluesselPaar } from '../../core/data/sourceLinks'
import { getField } from '../../softengine/data'
import type { Spalte } from './spalten'

export type Zellenart = 'frei' | 'eigen' | 'verknuepft'

export interface Zellenziel {
  art: Zellenart

  quelleId: string

  code: string
}

export interface ErfassungsUmfeld {
  spalten: readonly Spalte[]

  quelleId: string

  paareZu: (quelleId: string) => readonly SchluesselPaar[]

  partnerVon: (quelleId: string) => string

  rechnung?: Rechnung | null
}

export function zellenzielVon(
  spalte: Spalte | undefined,
  tabellenQuelleId: string,
): Zellenziel {
  const fuell = (spalte?.fuellFeld ?? '').trim()
  const feld = fuell !== '' ? fuell : (spalte?.feld ?? '').trim()
  if (feld === '') return { art: 'frei', quelleId: '', code: '' }
  const { quelleId, code } = zerlegeBindung(feld)
  if (quelleId === '') return { art: 'eigen', quelleId: tabellenQuelleId, code }
  return { art: 'verknuepft', quelleId, code }
}

export function zielIn(umfeld: ErfassungsUmfeld, index: number): Zellenziel {
  return zellenzielVon(umfeld.spalten[index], umfeld.quelleId)
}

export function verknuepfteQuellenIn(umfeld: ErfassungsUmfeld): string[] {
  const raus: string[] = []
  for (const spalte of umfeld.spalten) {
    const ziel = zellenzielVon(spalte, umfeld.quelleId)
    if (ziel.art !== 'verknuepft' || ziel.quelleId === '') continue
    if (!raus.includes(ziel.quelleId)) raus.push(ziel.quelleId)
  }
  return raus
}

export function anzeigeSpalteIn(
  umfeld: ErfassungsUmfeld,
  index: number,
): { titel: string; code: string } | undefined {
  const ziel = zielIn(umfeld, index)
  if (ziel.quelleId === '' || ziel.code === '') return undefined
  for (let i = 0; i < umfeld.spalten.length; i++) {
    if (i === index) continue
    const spalte = umfeld.spalten[i]
    const anderes = zellenzielVon(spalte, umfeld.quelleId)
    if (anderes.quelleId !== ziel.quelleId) continue
    if (anderes.code === '' || anderes.code === ziel.code) continue
    return { titel: spalte.titel, code: anderes.code }
  }
  return undefined
}

export function fensterSpaltenIn(umfeld: ErfassungsUmfeld, index: number): Spalte[] {
  const ziel = zielIn(umfeld, index)
  if (ziel.art !== 'verknuepft' || ziel.quelleId === '' || ziel.code === '') return []
  const raus: Spalte[] = []
  for (const spalte of umfeld.spalten) {
    const anderes = zellenzielVon(spalte, umfeld.quelleId)
    if (anderes.quelleId !== ziel.quelleId || anderes.code === '') continue
    if (raus.some((s) => s.feld === anderes.code)) continue
    raus.push({ kennung: '', titel: spalte.titel, feld: anderes.code })
  }
  return raus
}

export function passendeSaetze(
  paare: readonly SchluesselPaar[],
  schluesselWert: (feld: string) => string | undefined,
  kandidaten: readonly unknown[],
): unknown[] {
  const bekannte = paare
    .map((p) => ({ toField: p.toField, soll: schluesselWert(p.fromField) }))
    .filter((b): b is { toField: string; soll: string } => b.soll !== undefined)
  if (bekannte.length === 0) return [...kandidaten]
  return kandidaten.filter((satz) => bekannte.every(
    (b) => b.soll !== '' && b.soll === getField(satz, b.toField),
  ))
}
