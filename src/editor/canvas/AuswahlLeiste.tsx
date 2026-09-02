import { Plus, X } from '@/ui/zeichen'
import { Knopf } from '@/ui/werkbank/Knopf'
import type { BlockNode } from '../../core/blocks/BlockData'
import type { BlockDefinition } from '../../core/blocks/BlockDefinition'
import { useEditorInstance } from '../../state/EditorContext'
import { wendeProps } from '../../state/propsPatch'

interface AuswahlLeisteProps {
  block: BlockNode
  def: BlockDefinition | undefined

  // Am Maskenrand liegt die Leiste INNEN oben rechts, sonst ueber dem Baustein.
  innen: boolean
  onEntfernen: () => void
}

const halt = (e: { stopPropagation: () => void }): void => e.stopPropagation()

// Die EINE Werkzeugleiste des gewaehlten Bausteins: Kind anlegen, Eintrag
// (Spalte) anfuegen, Baustein entfernen. Vorher lagen zwei runde Abzeichen am
// Rahmen, und die Tabelle zeichnete eigene Plus/Minus-Knoepfe und ein Kreuz
// in die Maske — bei schmalen Spalten standen sie ueber den Titeln.
export function AuswahlLeiste({ block, def, innen, onEntfernen }: AuswahlLeisteProps) {
  const editor = useEditorInstance()
  const kind = def?.addChildButton
  const liste = def?.listenBindung
  const neu = liste?.eintragNeu
  const eintragName = liste?.standardTitel.replace(/\s*\{n\}/, '') ?? 'Eintrag'
  const neuMoeglich = neu !== undefined && Object.keys(neu(block.props)).length > 0
  return (
    <div
      data-ff-editor-helper
      className="absolute z-20 flex items-center gap-0.5 rounded-md border border-linie bg-panel p-0.5 shadow-overlay"
      style={innen ? { top: 4, right: 4 } : { top: -30, right: 0 }}
      onPointerDown={halt}
      onClick={halt}
      onDoubleClick={halt}
      onDragStart={(e) => { e.preventDefault(); e.stopPropagation() }}
    >
      {kind && (
        <Knopf
          className="h-6 px-1.5 text-dicht"
          title={`${kind.label} anlegen`}
          onClick={() => editor.addBlock(kind.childType, block.id)}
        >
          <Plus size={12} /> {kind.label}
        </Knopf>
      )}
      {neu && (
        <Knopf
          className="h-6 px-1.5 text-dicht"
          title={`${eintragName} anfügen`}
          disabled={!neuMoeglich}
          onClick={() => wendeProps(editor, block.id, neu(block.props))}
        >
          <Plus size={12} /> {eintragName}
        </Knopf>
      )}
      <Knopf
        nurZeichen
        aria-label="Baustein entfernen"
        title="Entfernen"
        className="h-6 w-6"
        onClick={onEntfernen}
      >
        <X size={12} />
      </Knopf>
    </div>
  )
}
