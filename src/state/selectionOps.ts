import { ROOT_ID, type BlockNode, type BlockTree } from '../core/blocks/BlockData'
import { istSeitenBaustein, seiteVon } from './pageOps'

export function auswahlAufSeite(
  tree: BlockTree,
  id: string | null,
  seitenWurzel: string,
): string | null {
  if (id === null || !tree[id]) return null
  return seiteVon(tree, id) === seitenWurzel ? id : null
}

// Escape geht eine Ebene hoch: zum Elternteil, sofern er kein Seiten-Baustein
// und nicht die Wurzel ist. Sonst wird die Auswahl aufgehoben (null).
export function elternZiel(tree: BlockTree, id: string): string | null {
  const node = tree[id]
  const eltern = node?.parentId ? tree[node.parentId] : undefined
  if (!eltern || eltern.id === ROOT_ID || istSeitenBaustein(eltern)) return null
  return eltern.id
}

export function auswahlZiel(
  tree: BlockTree,
  getroffenId: string,
  selectedId: string | null,
  aufStelle: boolean,
): string | null {
  const node = tree[getroffenId]
  if (!node || getroffenId === ROOT_ID) return null
  if (aufStelle || selectedId !== getroffenId) return getroffenId

  const eltern: BlockNode | undefined = node.parentId ? tree[node.parentId] : undefined
  if (!eltern || eltern.id === ROOT_ID || istSeitenBaustein(eltern)) return getroffenId
  return eltern.id
}
