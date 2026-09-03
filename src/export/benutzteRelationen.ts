import { ROOT_ID, type BlockNode, type BlockTree } from '../core/blocks/BlockData'
import { relationIdsVon } from '../core/blocks/treeQuery'
import { holWertFor, type DataSource } from '../core/data/dataSources'
import type { RelationTemplate } from '../core/data/relations'

export function collectRelations(
  tree: BlockTree,
  relations: readonly RelationTemplate[],

  // Die benutzten Quellen. Eine Quelle der Art „Wert per Relation" ruft ihre
  // Relation selbst — steht sie nicht in FF_RELATIONS, findet die Laufzeit
  // sie nicht und meldet es.
  quellen: readonly DataSource[] = [],
): RelationTemplate[] {
  const seen = new Set<string>()
  const acc: RelationTemplate[] = []
  const add = (id: string): void => {
    const rel = relations.find((r) => r.id === id)
    if (!rel || seen.has(rel.id)) return
    seen.add(rel.id)
    acc.push(rel)
  }
  const visit = (node: BlockNode | undefined): void => {
    if (!node) return
    for (const id of relationIdsVon(node)) add(id)
    node.childIds.forEach((id) => visit(tree[id]))
  }
  visit(tree[ROOT_ID])
  for (const quelle of quellen) {
    const hol = holWertFor(quelle)
    if (hol) add(hol.relationId)
  }
  return acc
}
