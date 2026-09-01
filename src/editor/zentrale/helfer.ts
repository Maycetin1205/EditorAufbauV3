import { Boxes, Database, FileText, Users } from '@/ui/zeichen'
import type { BlockNode } from '../../core/blocks/BlockData'
import { bausteinName } from '../../core/blocks/bausteinName'
import type { PropertySelectOption } from '../../core/blocks/PropertyDescription'
import { getBlockDefinition } from '../../core/blocks/blockRegistry'
import { auswahlQuelleIdVon } from '../../core/blocks/treeQuery'
import type { DataSource, DataSourceField, DataSourceKind } from '../../core/data/dataSources'
import type { RelationTemplate } from '../../core/data/relations'
import type { Frage } from '../shell/Frage'

const KIND_ICONS: Partial<Record<DataSourceKind, typeof Database>> = {
  idb: Database,
  adressstamm: Users,
  artikelstamm: Boxes,
  beleg: FileText,
}

export function ikonFuer(kind: DataSourceKind): typeof Database {
  return KIND_ICONS[kind] ?? Database
}

export const VERB_KURZ: Record<RelationTemplate['verb'], string> = {
  GET_RELATION: 'GET',
  PUT_RELATION: 'PUT',
  PUTADD_RELATION: 'PUTADD',
}

export function loeschFrage(
  art: string,
  name: string,
  benutzt: boolean,
  folge: string,
): Frage {
  return {
    titel: `${art} löschen?`,
    text: benutzt
      ? `„${name}“ wird in der Maske BENUTZT.\n\n${folge}`
      : `„${name}“ wird aus der Bibliothek entfernt.`,
    jaText: 'Löschen',
    gefahr: true,
  }
}

export const RELATION_GRUPPEN: PropertySelectOption[] = [
  { value: 'lesen', label: 'Lesen' },
  { value: 'schreiben', label: 'Schreiben' },
]

// Zwei Texte je Platzhalter, weil zwei Stellen ihn zeigen: `name` steht in
// Menuezeilen (dort ist ein Satz zu lang und reisst die Zeile auf),
// `hinweis` in der Parameter-Tabelle der Relation.
export const PLATZHALTER_KLARTEXT: Record<string, { name: string; hinweis: string }> = {
  FELD_POS: {
    name: 'Feld-Position',
    hinweis: 'Feld-Position (aus dem gebundenen Feld)',
  },
  FELD_LEN: {
    name: 'Feld-Länge',
    hinweis: 'Feld-Länge (aus dem gebundenen Feld)',
  },
  PINDEX: {
    name: 'Satznummer der Zeile',
    hinweis: 'Nummer des Datensatzes',
  },
  SELKEY: {
    name: 'Schlüssel der Zeile',
    hinweis: 'Schlüssel der gewählten Zeile',
  },
  DROP_PINDEX: {
    name: 'Satznummer der Löschzeile',
    hinweis: 'Satznummer der Löschzeile (automatisch)',
  },
  RELID: {
    name: 'Tabellen-ID der Quelle',
    hinweis: 'Tabellen-ID der Datenquelle (ohne IDB-Präfix)',
  },
  VALUE: {
    name: 'Neuer Wert',
    hinweis: 'Neuer Wert (z. B. Titel der Zielspalte)',
  },
  ZIMMER: {
    name: 'Ziel-Zimmer',
    hinweis: 'Titel des Ziel-Zimmers beim Ablegen (leer ohne Zimmer)',
  },
  NOW_DATE: {
    name: 'Heutiges Datum',
    hinweis: 'Heutiges Datum',
  },
}

export function parameterBedeutung(param: string): string {
  if (param === '') return 'Leerer Parameter (Position bleibt erhalten)'
  const gefunden = [...param.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])
  if (gefunden.length === 0) return 'Fester Wert'
  return gefunden
    .map((name) => PLATZHALTER_KLARTEXT[name]?.hinweis ?? `Eigener Platzhalter {${name}}`)
    .join(' · ')
}

export interface BlockValueOption {
  key: string
  blockId: string
  prop: string
  label: string
}

export function blockValueKey(blockId: string, prop: string): string {
  return `${encodeURIComponent(blockId)}:${encodeURIComponent(prop)}`
}

export interface AuswahlGeberOption {
  blockId: string
  label: string
  felder: readonly DataSourceField[]
}

// Eine Tabelle mit eingeschalteter Erfassungszeile, deren Zellen eine Kette
// als „Wert aus Erfassungszelle" lesen kann (G4). Die Spalten kommen generisch
// aus der Listen-Bindung des Bausteins — kein Bausteintyp-Sondercode.
export interface ErfassungsOption {
  blockId: string
  label: string

  // Angesprochen wird die Spalte ueber ihre dauerhafte KENNUNG, nie ueber den
  // Platz — der verrutscht beim Verschieben/Loeschen (aktionen.ts,
  // ZELLEN_PARAM_QUELLEN). Eintraege ohne Kennung sind nicht adressierbar.
  spalten: readonly { kennung: string; titel: string }[]
}

export function erfassungsOptionen(
  traeger: readonly BlockNode[],
  sources: readonly DataSource[],
): ErfassungsOption[] {
  return traeger.map((node) => {
    const bindung = getBlockDefinition(node.type)?.listenBindung
    const kennungKey = bindung?.kennungKey
    const roh = bindung ? node.props[bindung.prop] : undefined
    const spalten = bindung && kennungKey !== undefined && Array.isArray(roh)
      ? roh.flatMap((eintrag) => {
          const e = eintrag as Record<string, unknown>
          const kennung = e[kennungKey]
          if (typeof kennung !== 'string' || kennung === '') return []
          const titel = e[bindung.titelKey]
          return [{
            kennung,
            titel: typeof titel === 'string' && titel !== '' ? titel : bindung.standardTitel,
          }]
        })
      : []
    return { blockId: node.id, label: bausteinName(node, sources), spalten }
  })
}

export function auswahlGeberOptionen(
  geber: readonly BlockNode[],
  sources: readonly DataSource[],
): AuswahlGeberOption[] {
  return geber.map((node) => {
    const quelle = sources.find((s) => s.id === auswahlQuelleIdVon(node))
    return {
      blockId: node.id,
      label: quelle
        ? `${bausteinName(node, sources)} (${quelle.name})`
        : bausteinName(node, sources),
      felder: quelle?.fields ?? [],
    }
  })
}
