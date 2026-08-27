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

interface AuswahlFensterProps {
  bezeichnung: string

  oben: number
  links: number

  // Der Griff, aus dem das Fenster aufgegangen ist. Ein Zeigerdruck DARAUF
  // schliesst hier nicht — sonst raeumt dieser Druck das Fenster ab und der
  // Klick unmittelbar danach oeffnet es wieder: das Fenster liess sich mit
  // seinem eigenen Knopf nicht zumachen (Nutzer-Befund 2026-08-27).
  anker?: RefObject<HTMLElement | null>

  className: string
  imBildHalten?: boolean
  escapeAbfangen?: boolean
  onClose: () => void
  children: ReactNode
}

export function AuswahlFenster({
  bezeichnung,
  oben,
  links,
  anker,
  className,
  imBildHalten = false,
  escapeAbfangen = false,
  onClose,
  children,
}: AuswahlFensterProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [geklemmt, setGeklemmt] = useState({ top: oben, left: links })

  const position = imBildHalten ? geklemmt : { top: oben, left: links }

  useLayoutEffect(() => {
    const el = ref.current
    if (!imBildHalten || !el) return
    const klemmen = () => {
      const rect = el.getBoundingClientRect()
      const maxLeft = Math.max(RAND, window.innerWidth - RAND - rect.width)
      const maxTop = Math.max(RAND, window.innerHeight - RAND - rect.height)
      const nextLeft = Math.max(RAND, Math.min(links, maxLeft))
      const nextTop = Math.max(RAND, Math.min(oben, maxTop))
      setGeklemmt((prev) =>
        prev.left === nextLeft && prev.top === nextTop ? prev : { top: nextTop, left: nextLeft },
      )
    }
    klemmen()
    const ro = new ResizeObserver(klemmen)
    ro.observe(el)
    return () => ro.disconnect()
  }, [oben, links, imBildHalten])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const ziel = e.target as Node
      if (ref.current?.contains(ziel) || anker?.current?.contains(ziel)) return
      onClose()
    }
    const onScroll = (e: Event) => {
      if (ref.current && e.target instanceof Node && ref.current.contains(e.target)) return
      onClose()
    }
    const onKeyDown = (e: Event) => {
      if (!(e instanceof KeyboardEvent) || e.key !== 'Escape') return
      if (escapeAbfangen) {
        e.stopImmediatePropagation()
        e.stopPropagation()
      }
      onClose()
    }

    const tastenZiel: EventTarget = escapeAbfangen ? window : document
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('scroll', onScroll, true)
    tastenZiel.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('scroll', onScroll, true)
      tastenZiel.removeEventListener('keydown', onKeyDown, true)
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
      style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 50 }}
      className={cn(
        'overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  )
}
