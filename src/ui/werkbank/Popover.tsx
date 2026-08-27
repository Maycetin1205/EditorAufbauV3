import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const RAND = 8

export interface PopoverProps {
  bezeichnung: string

  // Das Ding, unter dem das Fenster haengt. Die Messung passiert HIER, ein
  // einziges Mal — kein Aufrufer rechnet mehr mit getBoundingClientRect.
  anker: RefObject<HTMLElement | null>

  breite?: number
  maxHoehe?: number

  // Die Flaeche und die Bausteine hoeren selbst auf Escape. Ein Fenster
  // darueber muss die Taste abfangen, sonst raeumt der Klick dahinter mit auf.
  escapeAbfangen?: boolean
  onClose: () => void
  children: ReactNode
}

export function Popover({
  bezeichnung,
  anker,
  breite = 256,
  maxHoehe = 320,
  escapeAbfangen = false,
  onClose,
  children,
}: PopoverProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [platz, setPlatz] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const messen = () => {
      const a = anker.current?.getBoundingClientRect()
      if (!a) return
      const eigen = el.getBoundingClientRect()
      const maxLeft = Math.max(RAND, window.innerWidth - RAND - eigen.width)
      const maxTop = Math.max(RAND, window.innerHeight - RAND - eigen.height)
      // Kein Platz mehr unter dem Anker: dann darueber, nicht halb aus dem Bild.
      const untenPasst = a.bottom + 4 <= maxTop
      const top = untenPasst ? a.bottom + 4 : Math.max(RAND, a.top - 4 - eigen.height)
      const links = Math.max(RAND, Math.min(a.left, maxLeft))
      setPlatz((vorher) =>
        vorher?.top === top && vorher.left === links ? vorher : { top, left: links })
    }
    messen()
    const ro = new ResizeObserver(messen)
    ro.observe(el)
    return () => ro.disconnect()
  }, [anker])

  useEffect(() => {
    const drauf = (e: PointerEvent) => {
      const ziel = e.target as Node
      if (ref.current?.contains(ziel) || anker.current?.contains(ziel)) return
      onClose()
    }
    const gerollt = (e: Event) => {
      if (ref.current && e.target instanceof Node && ref.current.contains(e.target)) return
      onClose()
    }
    const taste = (e: Event) => {
      if (!(e instanceof KeyboardEvent) || e.key !== 'Escape') return
      if (escapeAbfangen) {
        e.stopImmediatePropagation()
        e.stopPropagation()
      }
      onClose()
    }
    const tastenZiel: EventTarget = escapeAbfangen ? window : document
    document.addEventListener('pointerdown', drauf, true)
    document.addEventListener('scroll', gerollt, true)
    tastenZiel.addEventListener('keydown', taste, true)
    return () => {
      document.removeEventListener('pointerdown', drauf, true)
      document.removeEventListener('scroll', gerollt, true)
      tastenZiel.removeEventListener('keydown', taste, true)
    }
  }, [anker, onClose, escapeAbfangen])

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={bezeichnung}
      data-ff-editor-helper
      draggable={false}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onDragStart={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      style={{
        position: 'fixed',
        top: platz?.top ?? -9999,
        left: platz?.left ?? -9999,
        width: breite,
        maxHeight: maxHoehe,
        zIndex: 50,
      }}
      className={cn(
        'overflow-y-auto rounded border border-linie bg-panel p-1 text-tinte shadow-overlay',
        platz === null && 'invisible',
      )}
    >
      {children}
    </div>,
    document.body,
  )
}
