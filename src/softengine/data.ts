import { POS_LEN, pruefeLadeRelation, type LadeRelation } from '../core/data/ladeRelation'
import { geholteZeilenFuer } from './geholteZeilen'

export type UnknownRecord = Record<string, unknown>

export function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === 'object' && v !== null
}

export type RuntimeLadeRelation = LadeRelation & { zusatzFelder: readonly string[] }

export interface RuntimeDataSource {
  id: string
  name: string
  tableId: string
  indexField: string

  // Diese Quelle ist nicht eine Liste, sondern DER Satz, der gerade offen
  // ist. SoftEngine liefert ihn im VAR-Abschnitt statt als Zeilenschleife.
  offenerSatz: boolean
  ladeRelation?: RuntimeLadeRelation
}

export function findRuntimeDataSource(list: unknown, id: string): RuntimeDataSource | undefined {
  if (!Array.isArray(list) || id === '') return undefined
  for (const entry of list) {
    if (!isRecord(entry) || entry.id !== id) continue
    if (typeof entry.name !== 'string' || typeof entry.tableId !== 'string') continue

    let ladeRelation: RuntimeLadeRelation | undefined
    const geprueft = pruefeLadeRelation(entry.ladeRelation)
    if (geprueft && isRecord(entry.ladeRelation)) {
      const zf = entry.ladeRelation.zusatzFelder
      const zusatzFelder = Array.isArray(zf)
        ? zf.filter((f): f is string => typeof f === 'string' && POS_LEN.test(f))
        : []
      ladeRelation = { ...geprueft, zusatzFelder }
    }
    return {
      id,
      name: entry.name,
      tableId: entry.tableId,
      indexField: typeof entry.indexField === 'string' ? entry.indexField : '',
      offenerSatz: entry.offenerSatz === true,
      ...(ladeRelation ? { ladeRelation } : {}),
    }
  }
  return undefined
}

function asTrimmedString(v: unknown): string {
  return v == null ? '' : String(v).trim()
}

export function getField(row: unknown, code: string): string {
  if (!isRecord(row) || code === '') return ''
  const key = code.trim()
  const direct = asTrimmedString(row[key])
  if (direct !== '') return direct
  for (const rk of Object.keys(row)) {
    if (rk === key || rk.startsWith(`${key}_`) || rk.endsWith(`_${key}`)) {
      const v = asTrimmedString(row[rk])
      if (v !== '') return v
    }
  }
  const m = /^(\d+)_(\d+)$/.exec(key)
  if (!m) return ''

  const rohQuelle = row.SATZNEU ?? row.SATZ ?? row.satzneu ?? row.satz ?? row.RAW ?? row.raw
  const raw = rohQuelle == null ? '' : String(rohQuelle)
  if (raw === '') return ''
  const pos = Number(m[1])
  const len = Number(m[2])
  if (len <= 0) return ''
  return raw.substring(pos, pos + len).trim()
}

// Die Satznummer EINER Zeile — was Ketten als {PINDEX} weitergeben. Stand
// bis 2026-08-18 wortgleich in feldRuntime und kanban/seRuntime; die
// Tabelle waere die dritte Kopie gewesen.
export function satzIndexVon(source: { indexField: string }, row: unknown): string {
  return source.indexField === '' ? '' : getField(row, source.indexField)
}

export function setField(row: unknown, code: string, value: string): boolean {
  if (!isRecord(row) || code === '') return false
  const key = code.trim()
  let written = false

  for (const rk of Object.keys(row)) {
    if (rk === key || rk.startsWith(`${key}_`) || rk.endsWith(`_${key}`)) {
      row[rk] = value
      written = true
    }
  }

  const m = /^(\d+)_(\d+)$/.exec(key)
  if (m) {
    const rawKeys = ['SATZNEU', 'SATZ', 'satzneu', 'satz', 'RAW', 'raw'] as const
    const rawKey = rawKeys.find((k) => typeof row[k] === 'string')
    if (rawKey) {
      const raw = row[rawKey] as string
      const pos = Number(m[1])
      const len = Number(m[2])
      if (len > 0) {
        const field = value.length > len ? value.slice(0, len) : value.padEnd(len, ' ')
        const padded = raw.length < pos ? raw.padEnd(pos, ' ') : raw
        row[rawKey] = padded.slice(0, pos) + field + padded.slice(pos + len)
        written = true
      }
    }
  }
  return written
}

function rowsOfEntry(entry: unknown): unknown[] {
  if (!isRecord(entry)) return Array.isArray(entry) ? entry : []
  const candidates = [
    entry.Zeilen, entry.zeilen, entry.Saetze, entry.saetze,
    entry.Rows, entry.rows, entry.Daten, entry.daten,
  ]
  for (const c of candidates) {
    if (Array.isArray(c)) return c
    if (typeof c === 'string') {
      try {
        const parsed: unknown = JSON.parse(c)
        if (Array.isArray(parsed)) return parsed
      } catch { /* kein JSON -> nächster Kandidat */ }
    }
  }
  return []
}

function sameAlias(a: unknown, alias: string): boolean {
  return asTrimmedString(a).toLowerCase() === alias.trim().toLowerCase()
}

function varBlockVon(daten: UnknownRecord): UnknownRecord | undefined {
  for (const key of ['Var', 'VAR', 'var']) {
    const block = daten[key]
    if (isRecord(block)) return block
  }
  return undefined
}

// Der offene Satz liegt nicht als Zeilenliste vor, sondern im VAR-Abschnitt
// unter der Tabellen-ID (Daten.Var.BEL). Belegt an der Handmaske Rahmen00001
// V11: sie liest den Belegkopf genau dort und nimmt WINDOW_VARIABLE, wo der
// eigene Eintrag leer bleibt (B.BEL_3_8 || W.BEL_3_8) — dasselbe hier. Aus
// dem Fenster kommt nur, was zu DIESER Tabelle gehoert (Vorsatz 'BEL_'),
// sonst zoege ein fremder Eintrag (BELERF_...) in den Satz ein.
// Herausgereicht wird EINE Zeile, damit jede vorhandene Bindung unveraendert
// weiterliest: gelesen wird ohnehin aus der ersten Zeile der Quelle.
export function offenerSatzZeilen(seData: unknown, tableId: string): unknown[] {
  if (!isRecord(seData) || !isRecord(seData.Daten)) return []
  const id = tableId.trim()
  if (id === '') return []
  const varBlock = varBlockVon(seData.Daten)
  if (!varBlock) return []

  const satz: UnknownRecord = {}
  const fenster = varBlock.WINDOW_VARIABLE ?? varBlock.Window_Variable
  if (isRecord(fenster)) {
    const vorsatz = id.toUpperCase() + '_'
    for (const key of Object.keys(fenster)) {
      if (key.toUpperCase().startsWith(vorsatz)) satz[key] = fenster[key]
    }
  }
  const eigen = varBlock[id] ?? varBlock[id.toUpperCase()]
  if (isRecord(eigen)) {
    for (const key of Object.keys(eigen)) {
      if (asTrimmedString(eigen[key]) !== '' || !(key in satz)) satz[key] = eigen[key]
    }
  }
  return Object.keys(satz).length === 0 ? [] : [satz]
}

export function rowsFor(
  seData: unknown,
  alias: string,
  idbId: string,

  // Der offene Satz kommt AUSSCHLIESSLICH aus dem VAR-Abschnitt. Ohne den
  // Schalter bleibt VAR ungelesen: eine Listen-Quelle, deren Schleife gerade
  // leer ist, soll nicht heimlich den Kopfsatz als Zeile ausgeben.
  offenerSatz = false,
): unknown[] {
  if (!isRecord(seData) || !isRecord(seData.Daten)) return []
  if (offenerSatz) return offenerSatzZeilen(seData, idbId)
  const daten = seData.Daten

  const sfl = daten.SEFileLoop
  if (Array.isArray(sfl)) {
    for (const entry of sfl) {
      if (isRecord(entry) && (sameAlias(entry.ALIAS, alias) || sameAlias(entry.alias, alias))) {
        const rows = rowsOfEntry(entry)
        if (rows.length > 0) return rows
      }
    }
  } else if (isRecord(sfl)) {
    for (const key of Object.keys(sfl)) {
      const entry = sfl[key]
      if (sameAlias(key, alias)
        || (isRecord(entry) && (sameAlias(entry.ALIAS, alias) || sameAlias(entry.alias, alias)))) {
        const rows = rowsOfEntry(entry)
        if (rows.length > 0) return rows
      }
    }
  }

  for (const key of ['ErpApiCall', 'ERPAPICALL', 'erpapicall']) {
    const api = daten[key]
    if (!isRecord(api)) continue
    for (const eintrag of Object.keys(api)) {
      if (!sameAlias(eintrag, alias)) continue
      const rows = rowsOfEntry(api[eintrag])
      if (rows.length > 0) return rows
    }
  }

  const tab = daten.Tabellen
  if (isRecord(tab)) {
    const keys = [alias, alias.toUpperCase(), alias.toLowerCase(), idbId]
    for (const key of keys) {
      if (key !== '' && key in tab) {
        const rows = rowsOfEntry(tab[key])
        if (rows.length > 0) return rows
      }
    }
    for (const key of Object.keys(tab)) {
      if (sameAlias(key, alias)) {
        const rows = rowsOfEntry(tab[key])
        if (rows.length > 0) return rows
      }
    }
  }

  return geholteZeilenFuer(alias) ?? []
}

export function payloadDaten(raw: unknown): UnknownRecord | undefined {
  let data = raw
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch { return undefined }
  }
  if (!isRecord(data) || !isRecord(data.Daten)) return undefined
  const daten = data.Daten
  if (!daten.SEFileLoop && !daten.Tabellen && !daten.ErpApiCall && !varBlockVon(daten)) {
    return undefined
  }
  return daten
}

export function messagePayload(eventData: unknown): unknown {
  let d = eventData
  if (typeof d === 'string') {
    try { d = JSON.parse(d) } catch { return undefined }
  }
  if (!isRecord(d) || !isRecord(d.MSG)) return undefined
  return d.MSG.DATA
}
