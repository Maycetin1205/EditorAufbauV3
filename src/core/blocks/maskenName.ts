// Der Name der Maske: eine Eigenschaft der Maskenwurzel.
import { ROOT_ID, type BlockTree } from './BlockData'

// Der Export schreibt ihn als <title>, und genau der ist der Anmeldename der
// Maske bei SoftEngine.
export const MASKEN_NAME_PROP = 'maskenName'
export const MASKEN_NAME_STANDARD = 'Maske'

export function maskenNameVon(tree: BlockTree): string {
  const roh = tree[ROOT_ID]?.props[MASKEN_NAME_PROP]
  const name = typeof roh === 'string' ? roh.trim() : ''
  return name === '' ? MASKEN_NAME_STANDARD : name
}
