import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ZeileKind {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}

export interface ZeileProps {
  // Steht UEBER dem Bedienelement, nicht daneben. Ohne Beschriftung nimmt
  // das Element die Zeile allein.
  label?: ReactNode

  // Erklaerung. Sie haengt als Tooltip an der Beschriftung, statt eine
  // zweite Textzeile zu kosten — im Inspector sind viele solche Zeilen
  // untereinander.
  hinweis?: string
  fehler?: ReactNode

  // Nimmt die GANZE Reihe, auch dort, wo zwei Zeilen nebeneinander stehen
  // (Inspector ab 26rem Panelbreite). Fuer Bedienelemente, die von Natur aus
  // breit sind: mehrzeiliger Text, Bild, Farbkacheln.
  breit?: boolean
  className?: string
  children: (kind: ZeileKind) => ReactNode
}

// Eine Beschriftung mit ihrem Bedienelement — EINSPALTIG, Beschriftung oben.
//
// Bis 2026-08-31 stand die Beschriftung links in einem 2fr/3fr-Raster. Im
// damals 270 px breiten Inspector waren das rund 98 px, also gut ein Dutzend
// Zeichen: fast jede Beschriftung brach auf zwei Zeilen um, wodurch die
// Zeilen unterschiedlich hoch wurden — genau der ungleiche Takt, den man als
// „kaputt" liest. Dem Bedienelement blieben gleichzeitig nur 178 px, weshalb
// in den Waehlern Klarnamen abgeschnitten standen. Uebereinander bekommen
// beide die volle Breite.
//
// Beschriftung und Wert sind gleich GROSS und unterscheiden sich nur in der
// Farbe — so steht es in der Schriftskala (tailwind.config: „Rangfolge macht
// der Editor ueber Fettung und Farbe, nicht ueber ein Achtel Millimeter").
export function Zeile({ label, hinweis, fehler, breit = false, className, children }: ZeileProps) {
  const id = useId()
  const fehlerId = fehler ? `${id}-fehler` : undefined
  const kind: ZeileKind = {
    id,
    'aria-describedby': fehlerId,
    'aria-invalid': fehler ? true : undefined,
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5', breit && 'col-span-full', className)}>
      {label !== undefined && (
        <label
          htmlFor={id}
          title={hinweis}
          className={cn(
            'text-ui leading-tight text-matt',
            hinweis !== undefined && hinweis !== '' && 'cursor-help',
          )}
        >
          {label}
        </label>
      )}
      {/* SPALTE, nicht Reihe: eine Reihe mit items-center laesst ihre Kinder
          auf Inhaltsbreite schrumpfen — die Farbkacheln und das Bild-Element
          waeren zusammengefallen, und der Waehler-Knopf haette wieder nur so
          viel Platz genommen, wie sein laengster Eintrag braucht. Eine Spalte
          streckt sie auf die volle Breite; wer schmal bleiben will, sagt es
          selbst (Zahl w-16, Segment w-fit). */}
      <div className="flex min-w-0 flex-col">{children(kind)}</div>
      {fehler && <p id={fehlerId} className="break-words text-dicht text-fehler">{fehler}</p>}
    </div>
  )
}
