import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MarkeProps {
  children: ReactNode

  // Technische Werte — Feldcode, Relations-Nummer, Kennung — stehen in der
  // Schreibmaschinenschrift: dort zaehlt jede Stelle, und gleich lange Werte
  // sollen gleich breit sein. Der Name einer ART ist kein technischer Wert
  // und steht normal.
  technisch?: boolean
  hinweis?: string
  className?: string
}

// Die kleine Plakette am rechten Ende einer Zeile: das, was Regel 3 als
// KENNUNG neben den Klarnamen stellt — Feldcode, Relations-Nummer, Art der
// Quelle. Der Klarname fuehrt, die Kennung steht daneben und draengelt nicht.
//
// Warum als eigenes Bauteil: es gab dieselbe Sache in drei Formen — im
// Datencenter mit Fuellung, in den Waehlerlisten ohne, in den Schritten gar
// nicht. Genau die Art Unterschied, an der Flaechen auseinanderlaufen. Wem
// die Plakette zu laut ist, aendert sie hier einmal statt an fuenf Stellen.
export function Marke({ children, technisch = true, hinweis, className }: MarkeProps) {
  return (
    <span
      title={hinweis}
      className={cn(
        'min-w-0 shrink-0 truncate rounded bg-control px-1.5 text-dicht text-matt',
        technisch && 'font-mono',
        className,
      )}
    >
      {children}
    </span>
  )
}
