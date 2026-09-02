import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ReiterProps {
  // Die Zunge, auf der die Ansicht gerade steht.
  aktiv?: boolean
  title?: string
  onClick: () => void
  onDoubleClick?: () => void
  className?: string
  children: ReactNode
}

// Eine Registerzunge: flach, ohne Rahmen, die aktive traegt die Akzentflaeche.
//
// Die aktive Zunge wird nicht nur farbig, sondern auch fett. Das ist Absicht:
// Farbe allein unterscheidet fuer manche Augen zu wenig, und die Zunge ist die
// Anzeige, WO man ist — sie muss ohne Vergleich mit den Nachbarn lesbar sein.
// Weil fett breiter baut als mager, huepfte die Leiste beim Wechsel frueher um
// ein paar Pixel; `whitespace-nowrap` und die feste Hoehe halten sie ruhig.
//
// Kein `aria-pressed`: dieselbe Zunge dient auch als Aktion („＋ Neue Seite"),
// und einer Aktion einen Gedrueckt-Zustand anzudichten waere schlechter als
// gar keiner. Wer den Zustand ansagen will, gibt ihn an der Aufrufstelle.
export function Reiter({
  aktiv = false,
  title,
  onClick,
  onDoubleClick,
  className,
  children,
}: ReiterProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        'h-6 shrink-0 whitespace-nowrap rounded px-2.5 text-ui transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent',
        aktiv ? 'bg-akzent/20 font-medium text-tinte' : 'text-matt hover:text-tinte',
        className,
      )}
    >
      {children}
    </button>
  )
}
