import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EintragProps {
  // Das Zeichen ganz links. Gleiche Groesse in allen Listen, damit die Namen
  // darunter an derselben Kante beginnen.
  icon: ComponentType<{ size?: number; className?: string }>

  name: string

  // Rechts neben dem Namen: die Kennung als Marke, ein Warnzeichen, ein
  // Zaehler. Was genau, weiss die Liste.
  rechts?: ReactNode

  // Zweite Zeile unter dem Namen, an dessen Kante ausgerichtet.
  unten?: ReactNode
  aktiv?: boolean
  onClick: () => void
}

// Eine Zeile in einer der Listen des Datencenters.
//
// Die Datenquellen-Liste und die Relationen-Liste trugen dieselben
// dreiundzwanzig Klassen zweimal wortgleich im Code. Wortgleich heisst: bis
// jemand eine davon anfasst — dann sehen die zwei Listen im selben Fenster
// verschieden aus, ohne dass es jemand beschlossen haette. Genau das ist mit
// „einheitlich" gemeint (Nutzer-Auftrag 2026-08-31).
//
// Die Einrueckung der zweiten Zeile ist die Breite des Zeichens plus der
// Abstand dahinter (12 + 6 px): so beginnt sie unter dem NAMEN und nicht
// unter dem Zeichen.
export function Eintrag({ icon: Icon, name, rechts, unten, aktiv = false, onClick }: EintragProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'mb-1 w-full rounded border px-2.5 py-1 text-left text-dicht transition-colors',
        aktiv ? 'border-akzent/60 bg-akzent/15' : 'border-transparent hover:bg-control',
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={12} className="shrink-0 text-matt" />
        <span className="min-w-0 flex-1 truncate font-medium">{name}</span>
        {rechts}
      </div>
      {unten !== undefined && (
        <div className="mt-0.5 pl-[1.125rem] text-dicht text-matt">{unten}</div>
      )}
    </button>
  )
}
