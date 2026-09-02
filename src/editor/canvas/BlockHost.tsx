import { useLayoutEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { BlockNode } from '../../core/blocks/BlockData'
import {
  quellenAufloesen,
  WEITERE_QUELLEN_PROP,
  type QuelleInReichweite,
} from '../../core/data/sourceLinks'
import { getBlockDefinition } from '../../core/blocks/blockRegistry'
import { istRandBaustein } from '../../core/blocks/maskenRand'
import { rasterSpecOf } from '../../core/blocks/rasterLayout'
import { bindbareStellenVon, traegtEigeneQuelle } from '../../core/blocks/treeQuery'
import { useEditorInstance } from '../../state/EditorContext'
import { loescheBaustein } from '../../state/loescheBaustein'
import { quellenTraeger } from '../../state/quellenOps'
import { useDataSources } from '../../state/useDataSources'
import { AuswahlLeiste } from './AuswahlLeiste'
import { SpaltenBedienung } from './SpaltenBedienung'
import { useFeldBindung } from './FeldBindung'
import { useBlockResize } from './useBlockResize'
import { useLitElement } from './useLitElement'

interface BlockHostProps {
  block: BlockNode
  selected?: boolean

  onSelect?: (aufStelle: boolean) => void

  raster?: boolean

  children?: ReactNode
}

const KEINE_QUELLEN: readonly QuelleInReichweite[] = []

export function BlockHost({ block, selected, onSelect, raster = false, children }: BlockHostProps) {
  const editor = useEditorInstance()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const def = getBlockDefinition(block.type)
  const isContainer = def?.acceptsChildren ?? false

  const quellenBibliothek = useDataSources()

  const bindableSpots = useMemo(() => bindbareStellenVon(block), [block])

  const traeger = quellenTraeger(editor.tree, block.id)
  const braucht = bindableSpots.length > 0 || traegtEigeneQuelle(block)
  const bibliothek = quellenBibliothek.list
  const quellen = useMemo(
    () => (braucht && traeger
      ? quellenAufloesen(traeger.props.source, traeger.props[WEITERE_QUELLEN_PROP], bibliothek)
      : KEINE_QUELLEN),
    [braucht, traeger, bibliothek],
  )

  const blockRef = useRef<BlockNode>(block)
  useLayoutEffect(() => {
    blockRef.current = block
  })

  const { containerRef, elementRef, element } = useLitElement({
    editor,
    blockRef,
    block,
    selected,
    bindableSpots,
    quellen,
    raster,
  })

  const { onClick, onDoubleClick, pickers } = useFeldBindung({
    editor,
    blockRef,
    block,
    selected,
    bindableSpots,
    listenBindung: def?.listenBindung,
    quellen,
    containerRef,
    onSelect,
  })

  const { startResize, startRasterResize } = useBlockResize(editor, blockRef, elementRef, rootRef)

  const resizable = def?.resizableWidth ?? true
  const heightResizable = def?.resizableHeight === true

  const rasterSpec = rasterSpecOf(def, block.props)

  const rand = istRandBaustein(block)
  const rasterZiehbar = raster && !rand

  const eltern = block.parentId ? editor.getNode(block.parentId) : undefined
  const amRand = rand || (eltern ? istRandBaustein(eltern) : false)


  const templateMark = editor.templateMarkFor(block.id)

  return (
    <div
      ref={rootRef}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-block-id={block.id}
      style={{
        display: 'block',
        position: 'relative',

        height: '100%',
        cursor: selected ? 'default' : 'pointer',
        outline: selected ? '2px solid hsl(var(--wb-auswahl))' : '2px solid transparent',
        outlineOffset: amRand ? -2 : 1,
        borderRadius: 6,
        userSelect: 'none',
      }}
    >
      <div
        ref={containerRef}
        style={{
          pointerEvents: 'auto',
          height: '100%',

          ...(isContainer && def?.containerHint !== false
            ? {
                border: '1.5px dashed hsl(var(--wb-linie))',
                borderRadius: 4,
                minHeight: 40,
              }
            : null),
        }}
      >
        {element && isContainer && children != null
          ? createPortal(children, element)
          : null}
      </div>
      {pickers}
      {def?.listenBindung?.eintragStellen !== undefined && (
        <SpaltenBedienung
          block={block}
          bindung={def.listenBindung}
          selektor={def.listenBindung.eintragStellen}
          element={element}
          wirt={rootRef}
          container={containerRef}
          onSelect={onSelect}
        />
      )}
      {selected && !templateMark && (
        <AuswahlLeiste
          block={block}
          def={def}
          wirt={rootRef}
          amRand={amRand}
          onEntfernen={() => loescheBaustein(editor, blockRef.current.id)}
        />
      )}

      {selected && rasterZiehbar && rasterSpec.breiteZiehbar && (
        <Anfasser
          achse="x"
          title="Breite ziehen (rastet auf Zellen) · Doppelklick: Startgröße"
          onStart={(e) => startRasterResize(e, 'x')}
          onReset={() => {
            const node = blockRef.current
            editor.updateProperty(node.id, 'rasterW', rasterSpecOf(getBlockDefinition(node.type), node.props).startW)
          }}
        />
      )}
      {selected && rasterZiehbar && (
        <Anfasser
          achse="y"
          title="Höhe ziehen (rastet auf Zellen) · Doppelklick: Startgröße"
          onStart={(e) => startRasterResize(e, 'y')}
          onReset={() => {
            const node = blockRef.current
            editor.updateProperty(node.id, 'rasterH', rasterSpecOf(getBlockDefinition(node.type), node.props).startH)
          }}
        />
      )}
      {selected && !raster && resizable && (
        <Anfasser
          achse="x"
          title="Breite ziehen · Doppelklick: Standard"
          onStart={(e) => startResize(e, 'width', 40)}
          onReset={() => {
            const node = blockRef.current
            editor.updateProperty(node.id, 'width', getBlockDefinition(node.type)?.defaultProps.width ?? 'auto')
          }}
        />
      )}
      {selected && !raster && heightResizable && (
        <Anfasser
          achse="y"
          title="Höhe ziehen · Doppelklick: Standard"
          onStart={(e) => startResize(e, 'height', 120)}
          onReset={() => {
            const node = blockRef.current
            editor.updateProperty(node.id, 'height', getBlockDefinition(node.type)?.defaultProps.height ?? 'auto')
          }}
        />
      )}
    </div>
  )
}

interface AnfasserProps {
  achse: 'x' | 'y'
  title: string
  onStart: (e: ReactPointerEvent<HTMLDivElement>) => void
  onReset: () => void
}

// Der eine Anfasser fuer Breite und Hoehe: ein Pillenstrich in der
// Auswahlfarbe, mittig auf der Kante. Vorher standen vier Kopien desselben
// Stilblocks im BlockHost.
function Anfasser({ achse, title, onStart, onReset }: AnfasserProps) {
  return (
    <div
      draggable={false}
      title={title}
      onPointerDown={onStart}
      onDragStart={(e) => e.preventDefault()}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onReset()
      }}
      className={cn(
        'absolute rounded-[4px] bg-[hsl(var(--wb-auswahl))]',
        achse === 'x'
          ? '-right-1 top-1/2 h-[26px] w-[7px] -translate-y-1/2 cursor-ew-resize'
          : '-bottom-1 left-1/2 h-[7px] w-[26px] -translate-x-1/2 cursor-ns-resize',
      )}
    />
  )
}
