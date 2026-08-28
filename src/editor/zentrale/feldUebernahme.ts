import type { ActionParamBinding } from '../../core/data/aktionen'
import { defaultRelationParams } from '../../core/data/aktionen'
import { tableIdFor, type DataSource } from '../../core/data/dataSources'
import {
  relIdFromIdbId,
  splitFieldCode,
  type RelationTemplate,
} from '../../core/data/relations'

export interface UebernahmeFeld {
  sourceId: string
  sourceName: string
  code: string
  label: string

  // Der Code ohne Feld-Vorsatz, also die reine Form 45_60.
  posLen: string
}

export interface UebernahmeQuelle {
  sourceId: string
  sourceName: string
}

export interface UebernahmeTreffer {
  art: 'pos' | 'len' | 'relid'
  wert: string
}

export interface FeldUebernahmeResult {
  params: ActionParamBinding[]
  gesetzt: UebernahmeTreffer[]
}

export type FeldUebernahmeParameterArt = 'pos' | 'len' | 'relid'
export type FeldUebernahmeZiel = 'feld' | 'idb'

export function feldUebernahmeArt(raw: string): FeldUebernahmeParameterArt | null {
  const match = /^(?:([A-Za-z_]+)|\{([A-Za-z_]+)\})$/.exec(raw)
  const name = (match?.[1] ?? match?.[2])?.toUpperCase()
  if (name === 'POS' || name === 'FELD_POS') return 'pos'
  if (name === 'LEN' || name === 'FELD_LEN') return 'len'
  if (name === 'IDBID' || name === 'RELID') return 'relid'
  return null
}

// Eine ERP-Abfrage darf ihren Feldern einen Vorsatz voranstellen
// (feldVorsatzMoeglich); darunter steckt trotzdem Position_Laenge.
export function feldPosLen(
  source: DataSource,
  code: string,
): { pos: string; len: string } | null {
  const vorsatz = source.feldVorsatz ?? ''
  const ohne = vorsatz !== '' && code.startsWith(vorsatz) ? code.slice(vorsatz.length) : code
  return splitFieldCode(ohne)
}

// Position und Laenge sind Position und Laenge — welche ART die Quelle hat,
// spielt dafuer keine Rolle. Bis 2026-08-28 stand hier `kind !== 'idb'` und
// sperrte jede Tabelle aus, die nicht als IDB-Tabelle angelegt war: eine
// ERP-Abfrage IDB.GET auf dieselbe Tabelle fiel damit heraus.
export function uebernahmeFelder(
  dataSources: readonly DataSource[],
): UebernahmeFeld[] {
  const felder: UebernahmeFeld[] = []
  for (const source of dataSources) {
    for (const field of source.fields) {
      const pl = feldPosLen(source, field.code)
      if (!pl) continue
      felder.push({
        sourceId: source.id,
        sourceName: source.name,
        code: field.code,
        label: field.label,
        posLen: `${pl.pos}_${pl.len}`,
      })
    }
  }
  return felder
}

// Fuer den RELID-Parameter zaehlt nur, dass die Quelle eine Tabellen-Kennung
// hat: IDB-Kennung, ADR/ART/BEL/POS oder die eingetippte einer anderen Datei.
export function uebernahmeTabellen(
  dataSources: readonly DataSource[],
): UebernahmeQuelle[] {
  return dataSources
    .filter((source) => tableIdFor(source) !== '')
    .map((source) => ({ sourceId: source.id, sourceName: source.name }))
}

export function feldUebernehmen(
  params: readonly ActionParamBinding[],
  relation: RelationTemplate,
  source: DataSource,
  code: string,
  ziel: FeldUebernahmeZiel,
): FeldUebernahmeResult {
  const defaults = defaultRelationParams(relation)
  const next = relation.params.map((_, index) => ({
    ...(params[index] ?? defaults[index]),
  }))
  const gesetzt: UebernahmeTreffer[] = []

  relation.params.forEach((param, index) => {
    const art = feldUebernahmeArt(param)
    if (ziel === 'idb' && art === 'relid') {
      const relId = relIdFromIdbId(tableIdFor(source))
      next[index] = { source: 'fixed', value: relId }
      gesetzt.push({ art, wert: relId })
      return
    }
    if (ziel !== 'feld') return
    const posLen = feldPosLen(source, code)
    if (!posLen) return
    if (art === 'pos') {
      next[index] = { source: 'fixed', value: posLen.pos }
      gesetzt.push({ art, wert: posLen.pos })
    } else if (art === 'len') {
      next[index] = { source: 'fixed', value: posLen.len }
      gesetzt.push({ art, wert: posLen.len })
    }
  })

  return { params: next, gesetzt }
}
