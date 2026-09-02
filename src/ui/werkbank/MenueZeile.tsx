import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type MenueZeileArt = 'still' | 'gefahr'

const ART: Record<MenueZeileArt, { farbe: string; schweben: string }> = {
  still: { farbe: 'text-tinte', schweben: 'hover:bg-control' },
  gefahr: { farbe: 'text-fehler', schweben: 'hover:bg-fehler/15' },
}

export interface MenueZeileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  // Das Zeichen links vom Text. Nicht jede Zeile hat eines.
  zeichen?: ReactNode

  // Die Zeile, auf der die Wahl gerade steht.
  aktiv?: boolean
  art?: MenueZeileArt
  children: ReactNode
}

// Eine Zeile in einem Popover: der Menuepunkt der Werkzeugleiste ebenso wie
// die Feld-Zeile des Feld-Waehlers. Beide waren dieselbe Sache mit eigenen
// Klassenlisten — die Werkzeugleiste trug sie als Konstante MENUEZEILE, der
// Feld-Waehler wortgleich noch einmal. Wortgleich heisst: bis jemand eine
// davon anfasst.
//
// Ihre Rolle bekommt die Zeile vom Aufrufer (`role="menuitem"` im Menue,
// `aria-pressed` in der Wahl): fuer die Vorlesehilfe ist ein Menuepunkt
// etwas anderes als eine Wahl, zu sehen ist dasselbe.
export function MenueZeile({
  zeichen,
  aktiv = false,
  art = 'still',
  className,
  children,
  type = 'button',
  ...rest
}: MenueZeileProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex h-steuer w-full min-w-0 items-center gap-2 rounded px-2 text-left text-ui',
        'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent',
        'disabled:pointer-events-none disabled:opacity-40',
        ART[art].farbe,
        aktiv ? 'bg-akzent/15' : ART[art].schweben,
        className,
      )}
      {...rest}
    >
      {zeichen}
      {children}
    </button>
  )
}
