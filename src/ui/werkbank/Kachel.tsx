import { Check } from '@/ui/zeichen'
import { cn } from '@/lib/utils'

export interface KachelProps {
  // Die Beschriftung IST die Kachel — sie nennt, was der Baustein kann.
  beschriftung: string
  an: boolean
  hinweis?: string
  id?: string
  onSchalte: (an: boolean) => void
}

// Ein Ja/Nein als anklickbare Kachel statt als Zeile mit Umschalter.
//
// Warum: ein Baustein hat mehrere davon (die Tabelle fuenf). Als Zeilen
// untereinander kosten sie fuenf Zeilen Hoehe, obwohl jede nur ein Bit
// traegt, und der frueher benutzte Zweiknopf „Nein | Ja" verlangte, dass man
// erkennt, WELCHE Haelfte dunkel ist — zwei Woerter fuer ein Bit. Als
// Kacheln stehen sie nebeneinander, und man sieht auf einen Blick, was der
// Baustein kann und was davon an ist.
//
// Das Haekchen bleibt im Aus-Zustand als unsichtbarer Platzhalter stehen:
// sonst huepfte die Kachel beim Schalten in der Breite.
export function Kachel({ beschriftung, an, hinweis, id, onSchalte }: KachelProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={an}
      title={hinweis}
      onClick={() => onSchalte(!an)}
      className={cn(
        'flex h-steuer min-w-0 max-w-full shrink-0 items-center gap-1.5 rounded border px-2',
        'text-ui transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent',
        an
          ? 'border-akzent bg-akzent/15 font-medium text-tinte'
          : 'border-linie text-matt hover:border-matt hover:text-tinte',
      )}
    >
      <Check size={12} aria-hidden className={cn('shrink-0', !an && 'invisible')} />
      <span className="min-w-0 truncate">{beschriftung}</span>
    </button>
  )
}
