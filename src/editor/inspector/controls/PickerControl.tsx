import { useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from '@/ui/zeichen'
import { cn } from '@/lib/utils'
import { EINGABE_KANTE } from '@/ui/werkbank/Feld'
import { Knopf } from '@/ui/werkbank/Knopf'
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

  // Der geschlossene Knopf zeigt NUR den Klarnamen. Die Kennung stand hier bis
  // 2026-08-28 daneben und nahm sich bis zur halben Breite — in der 3/5-Spalte
  // des Inspectors blieben dem Namen dann rund 80 px, waehrend er in der
  // offenen Liste 166 hat. Dieselbe Quelle sah aufgeklappt gut aus und
  // zugeklappt abgehackt (Nutzer-Befund). Die Kennung steht weiter in der
  // Liste und jetzt zusaetzlich im Tooltip — Regel 3 bleibt gewahrt, der
  // Klarname fuehrt.
  const gezeigt = unbekannt ? 'fehlt' : (treffer?.name ?? leerText ?? platzhalter)
  const tooltip = unbekannt
    ? `Nicht mehr vorhanden: ${wert}`
    : [treffer?.name, treffer?.kennung].filter((t) => t !== undefined && t !== '').join(' — ')

  const knopf = (kind?: ZeileKind) => (
    <Knopf
      ref={knopfRef}
      id={kind?.id}
      aria-describedby={kind?.['aria-describedby']}
      aria-invalid={kind?.['aria-invalid']}
      aria-haspopup="dialog"
      aria-expanded={offen}
      aria-label={label === undefined ? `${bezeichnung}: ${gezeigt}` : undefined}
      title={tooltip === '' ? (label === undefined ? bezeichnung : undefined) : tooltip}
      onClick={() => setOffen(!offen)}
      className={cn(EINGABE_KANTE, 'flex h-steuer items-center gap-2 px-2 text-left', className)}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate',
          wert === '' && 'text-matt',
          unbekannt ? 'text-fehler' : wert !== '' && 'font-medium',
        )}
      >
        {gezeigt}
      </span>
      <ChevronDown size={13} aria-hidden className="shrink-0 text-matt" />
    </Knopf>
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
