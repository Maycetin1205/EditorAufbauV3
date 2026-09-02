import { Check } from '@/ui/zeichen'
import { cn } from '@/lib/utils'

export interface FarbfeldProps {
  // Die Farbe selbst. Sie kommt als fertiger CSS-Wert, nicht als Klasse:
  // welche Farben zur Wahl stehen, entscheidet die Maske, nicht der Bausatz.
  //
  // Fehlt sie, bleibt das Feld leer (nur Rahmen). Das ist kein Sonderfall zum
  // Abfangen, sondern das Ehrlichste, was ein Farbfeld ohne Farbe zeigen kann
  // — und genau das, was die Farbwahl vorher tat.
  farbe?: string

  // Der Klarname der Farbe. Pflicht, denn zu sehen ist nur ein Fleck — ohne
  // Namen ist die Wahl fuer die Vorlesehilfe und im Tooltip stumm.
  name: string

  gewaehlt: boolean
  onWaehle: () => void
}

// Ein Farbfleck zum Anklicken: die gewaehlte Farbe traegt einen Ring und ein
// Haekchen.
//
// Warum das Haekchen und nicht nur der Ring: bei hellen Farben ist der Ring
// gut zu sehen, bei dunklen kaum — und wer Farben schlecht unterscheidet,
// sieht am Ring allein gar nicht, welche Kachel gemeint ist. Das Haekchen
// sagt es unabhaengig von der Farbe. Es ist weiss (`text-grund`), weil die
// Farbwahl aus kraeftigen Farben besteht; auf einer sehr hellen Farbe ist es
// schwach — dann traegt der Ring.
export function Farbfeld({ farbe, name, gewaehlt, onWaehle }: FarbfeldProps) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={gewaehlt}
      title={name}
      onClick={onWaehle}
      style={{ backgroundColor: farbe }}
      className={cn(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded border border-linie',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent focus-visible:ring-offset-1',
        gewaehlt
          ? 'ring-1 ring-akzent ring-offset-1'
          : 'hover:ring-1 hover:ring-matt hover:ring-offset-1',
      )}
    >
      {gewaehlt && <Check size={13} strokeWidth={3} className="text-grund" />}
    </button>
  )
}
