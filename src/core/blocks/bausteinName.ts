import type { BlockNode } from './BlockData'
import { bindingProp } from './BlockDefinition'
import { getBlockDefinition } from './blockRegistry'
import { bindbareStellenVon, QUELLE_PROP } from './treeQuery'
import { feldKlarname, type DataSource } from '../data/dataSources'

const TEXT_PROPS = ['label', 'heading', 'title', 'text', 'placeholder'] as const

const MAX_LAENGE = 28

export function eigenerText(
  props: Record<string, unknown>,
  defaults?: Record<string, unknown>,

  verdeckt?: ReadonlySet<string>,
): string {
  for (const key of TEXT_PROPS) {
    if (verdeckt?.has(key)) continue
    const value = props[key]
    if (typeof value !== 'string' || value.trim() === '') continue
    if (defaults && value === defaults[key]) continue
    const text = value.trim()
    return text.length > MAX_LAENGE ? `${text.slice(0, MAX_LAENGE - 1)}…` : text
  }
  return ''
}

// Die Props, deren gespeicherten Text der Nutzer gerade GAR NICHT sieht: an
// einer gebundenen Stelle schreibt der Editor den Klarnamen des gebundenen
// Feldes in die Vorschau-Prop (useLitElement) — im Feld steht also der
// Klarname, nicht der Platzhalter. Ein Name aus dem ueberdeckten Text
// widerspraeche dem Bild („im Waehler heissen die anders als im Feld",
// Nutzer-Befund 2026-09-01).
function verdeckteProps(node: BlockNode): Set<string> {
  const raus = new Set<string>()
  for (const stelle of bindbareStellenVon(node)) {
    const bindung = String(node.props[bindingProp(stelle.prop)] ?? '')
    if (bindung !== '') raus.add(stelle.vorschauProp ?? stelle.prop)
  }
  return raus
}

function gebundenerAlias(node: BlockNode, quellen: readonly DataSource[]): string {
  const eigeneQuelle = String(node.props[QUELLE_PROP] ?? '')
  for (const stelle of bindbareStellenVon(node)) {
    const bindung = String(node.props[bindingProp(stelle.prop)] ?? '')
    if (bindung === '') continue
    const alias = feldKlarname(bindung, eigeneQuelle, quellen)
    if (alias !== '') return alias
  }
  return ''
}

export function bausteinName(node: BlockNode, quellen: readonly DataSource[]): string {
  const def = getBlockDefinition(node.type)
  const text = eigenerText(node.props, def?.defaultProps, verdeckteProps(node))
  if (text !== '') return text
  const alias = gebundenerAlias(node, quellen)
  if (alias !== '') return alias
  return def?.displayName ?? node.type
}
