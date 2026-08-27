import { Component, Plus, Search, type Zeichen } from '@/ui/zeichen'
import { createElement, useState } from 'react'
import { Feld } from '@/ui/werkbank/Feld'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { ROOT_ID, ROOT_TYPE } from '../../core/blocks/BlockData'
import { canContain, getAllBlockDefinitions } from '../../core/blocks/blockRegistry'
import type { BlockCategory, BlockDefinition } from '../../core/blocks/BlockDefinition'
import { editorAngabenVon } from '../../core/blocks/editorAngaben'
import { setNewBlockDrag } from '../canvas/dnd'
import { useEditor } from '../../state/useEditor'
import { cn } from '@/lib/utils'

const ERSATZ_SYMBOL = Component

function symbolVon(type: string): Zeichen {
  return (editorAngabenVon(type).symbol ?? ERSATZ_SYMBOL) as Zeichen
}

const CATEGORY_LABEL: Record<BlockCategory, string> = {
  layout: 'Layout',
  eingabe: 'Eingabe',
  anzeige: 'Anzeige',
}

const CATEGORY_ORDER: BlockCategory[] = ['layout', 'eingabe', 'anzeige']

export function BlockPalette() {
  const ed = useEditor()
  const [query, setQuery] = useState('')

  const definitions = getAllBlockDefinitions().filter((d) => d.showInPalette !== false)

  const q = query.trim().toLowerCase()
  const filtered = definitions.filter((d) => {
    if (!q) return true
    return d.displayName.toLowerCase().includes(q)
      || d.type.toLowerCase().includes(q)
      || d.tagName.toLowerCase().includes(q)
  })

  const grouped: Record<BlockCategory, BlockDefinition[]> = {
    layout: [],
    eingabe: [],
    anzeige: [],
  }
  for (const def of filtered) grouped[def.category]?.push(def)

  const insertParentFor = (type: string): string | undefined => {
    let cur = ed.selectedId ? ed.getNode(ed.selectedId) : null
    while (cur) {
      if (canContain(cur.type, type)) return cur.id
      cur = cur.parentId ? ed.getNode(cur.parentId) : null
    }

    const aktiveSeite = ed.getNode(ed.rootId)
    if (aktiveSeite && !canContain(aktiveSeite.type, type) && canContain(ROOT_TYPE, type)) {
      return ROOT_ID
    }
    return undefined
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="relative flex items-center">
        <Search size={13} aria-hidden className="absolute left-2 text-matt" />
        <Feld
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Baustein suchen…"
          aria-label="Baustein suchen"
          className="pl-7"
        />
      </label>

      {filtered.length === 0 && <p className="text-ui text-matt">Keine Treffer.</p>}

      {CATEGORY_ORDER.filter((cat) => (grouped[cat]?.length ?? 0) > 0).map((cat) => (
        <Gruppe key={cat} titel={CATEGORY_LABEL[cat]}>
          <div className="flex flex-col gap-1">
            {grouped[cat].map((def) => (
              <PaletteKarte
                key={def.type}
                def={def}
                onAdd={() => ed.addBlock(def.type, insertParentFor(def.type))}
              />
            ))}
          </div>
        </Gruppe>
      ))}
    </div>
  )
}

interface PaletteKarteProps {
  def: BlockDefinition
  onAdd: () => void
}

function PaletteKarte({ def, onAdd }: PaletteKarteProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      draggable
      onDragStart={(e) => {
        setNewBlockDrag(e.dataTransfer, def.type)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      className={cn(
        'group grid h-steuer min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2',
        'rounded border border-linie bg-control px-2 text-left text-ui text-tinte',
        'transition-colors hover:border-akzent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent',
      )}
    >
      <span className="flex shrink-0 items-center text-matt group-hover:text-tinte">
        {createElement(symbolVon(def.type), { size: 15 })}
      </span>
      <span className="truncate">{def.displayName}</span>
      <span className="flex shrink-0 items-center text-matt opacity-0 transition-opacity group-hover:opacity-100">
        <Plus size={13} />
      </span>
    </button>
  )
}
