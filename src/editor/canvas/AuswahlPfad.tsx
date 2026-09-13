import { ROOT_ID, type BlockNode } from '../../core/blocks/BlockData'
import { bausteinName } from '../../core/blocks/bausteinName'
import { useEditor } from '../../state/useEditor'

export function AuswahlPfad() {
  const ed = useEditor()
  const pfad: BlockNode[] = []
  let node = ed.selectedNode
  while (node && node.id !== ROOT_ID && node.id !== ed.rootId) {
    pfad.unshift(node)
    node = node.parentId ? ed.getNode(node.parentId) ?? null : null
  }
  return (
    <nav aria-label="Auswahlpfad" className="flex min-w-0 items-center gap-1 overflow-x-auto text-dicht">
      <button type="button" className="shrink-0 rounded px-2 py-1 hover:bg-grund"
        onClick={() => ed.selectBlock(null)}>Fläche</button>
      {pfad.map((teil) => (
        <span key={teil.id} className="flex shrink-0 items-center gap-1">
          <span aria-hidden="true" className="text-matt">/</span>
          <button type="button" className="rounded px-2 py-1 hover:bg-grund"
            aria-current={teil.id === ed.selectedId ? 'true' : undefined}
            onClick={() => ed.selectBlock(teil.id)}>
            {bausteinName(teil, ed.datenquellen.list)}
          </button>
        </span>
      ))}
    </nav>
  )
}
