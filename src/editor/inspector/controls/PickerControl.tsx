import { useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from '@/ui/zeichen'
import { cn } from '@/lib/utils'
import { EINGABE_KANTE } from '@/ui/werkbank/Feld'
import { Liste, type ListeGruppe } from '@/ui/werkbank/Liste'
import { Popover } from '@/ui/werkbank/Popover'
import { Zeile, type ZeileKind } from '@/ui/werkbank/Zeile'

export interface PickerControlProps {
  // Ohne Beschriftung steht der Waehler blank in einer Zeile (Feldpaare).
  label?: string
  hinweis?: string
  fehler?: ReactNode

  // Vorlesename des aufklappenden Fensters.
  bezeichnung: string
  gruppen: readonly ListeGruppe[]
  wert: string

  // Zeile fuer „nichts gewaehlt". Fehlt sie, ist die Wahl Pflicht.
  leerText?: string
  platzhalter?: string
  className?: string
  onWaehle: (wert: string) => void
}

// Der eine Waehler des Inspectors: `Wahl` (natives select) kann nicht
// suchen, und eine Datenquelle hat hunderte Felder. Also Popover + Liste,
// wie es der Kommentar in Wahl.tsx vorgibt — aber an EINER Stelle, nicht
// in jedem Panel neu.
export function PickerControl({
  label,
  hinweis,
  fehler,
  bezeichnung,
  gruppen,
  wert,
  leerText,
  platzhalter = '— wählen —',
  className,
  onWaehle,
}: PickerControlProps) {
  const [offen, setOffen] = useState(false)
  const knopfRef = useRef<HTMLButtonElement | null>(null)

  const treffer = gruppen.flatMap((g) => g.eintraege).find((e) => e.wert === wert)

  // Ein Wert, den keine Gruppe kennt (geloeschtes Feld, geloeschte Quelle),
  // faellt rot auf statt lautlos als „nichts gewaehlt" zu erscheinen.
  const unbekannt = wert !== '' && treffer === undefined

  const knopf = (kind?: ZeileKind) => (
    <button
      ref={knopfRef}
      type="button"
      id={kind?.id}
      aria-describedby={kind?.['aria-describedby']}
      aria-invalid={kind?.['aria-invalid']}
      aria-haspopup="dialog"
      aria-expanded={offen}
      aria-label={label === undefined ? bezeichnung : undefined}
      title={label === undefined ? bezeichnung : undefined}
      onClick={() => setOffen(!offen)}
      className={cn(EINGABE_KANTE, 'flex h-steuer items-center gap-2 px-2 text-left', className)}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate',
          wert === '' && 'text-matt',
          unbekannt && 'text-fehler',
        )}
      >
        {unbekannt ? wert : (treffer?.name ?? leerText ?? platzhalter)}
      </span>
      {treffer?.kennung !== undefined && treffer.kennung !== '' && (
        <span className="shrink-0 font-mono text-dicht text-matt">{treffer.kennung}</span>
      )}
      <ChevronDown size={13} aria-hidden className="shrink-0 text-matt" />
    </button>
  )

  return (
    <>
      {label === undefined && fehler === undefined
        ? knopf()
        : <Zeile label={label} hinweis={hinweis} fehler={fehler}>{(kind) => knopf(kind)}</Zeile>}

      {offen && (
        <Popover
          bezeichnung={bezeichnung}
          anker={knopfRef}
          escapeAbfangen
          onClose={() => setOffen(false)}
        >
          <Liste
            suchbar
            gruppen={gruppen}
            wert={wert}
            leerText={leerText}
            onWaehle={(v) => {
              onWaehle(v)
              setOffen(false)
            }}
          />
        </Popover>
      )}
    </>
  )
}
