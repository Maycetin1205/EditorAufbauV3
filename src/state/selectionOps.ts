// Direkte Auswahl und ihre Zugehoerigkeit zur aktiven Seite.
import { ROOT_ID, type BlockTree } from '../core/blocks/BlockData'
import { seiteVon } from './pageOps'

export function auswahlAufSeite(
  tree: BlockTree,
  id: string | null,
  seitenWurzel: string,
): string | null {
  if (id === null || !tree[id]) return null
  return seiteVon(tree, id) === seitenWurzel ? id : null
}

export function auswahlZiel(
  tree: BlockTree,
  getroffenId: string,
): string | null {
  return tree[getroffenId] && getroffenId !== ROOT_ID ? getroffenId : null
}
