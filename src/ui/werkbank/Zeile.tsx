import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ZeileKind {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}

export interface ZeileProps {
  // Links, 40 % der Breite. Ohne Beschriftung nimmt das Bedienelement die
  // ganze Zeile.
  label?: ReactNode

  // Erklaerung. Sie haengt als Tooltip an der Beschriftung, statt eine
  // zweite Textzeile zu kosten — im Inspector sind 30 solche Zeilen
  // untereinander.
  hinweis?: string
  fehler?: ReactNode

  // Fuer Bedienelemente, die keine 28-px-Zeile sind (Textfeld mehrzeilig,
  // Bild, Farbkacheln): Beschriftung darueber, Element ueber die volle
  // Breite. In 320 px Inspector blieben ihnen sonst 180 px.
  breit?: boolean
  className?: string
  children: (kind: ZeileKind) => ReactNode
}

export function Zeile({ label, hinweis, fehler, breit = false, className, children }: ZeileProps) {
  const id = useId()
  const fehlerId = fehler ? `${id}-fehler` : undefined
  const kind: ZeileKind = {
    id,
    'aria-describedby': fehlerId,
    'aria-invalid': fehler ? true : undefined,
  }

  const beschriftung = (klasse: string) => (
    <label
      htmlFor={id}
      title={hinweis}
      className={cn(klasse, hinweis !== undefined && hinweis !== '' && 'cursor-help')}
    >
      {label}
    </label>
  )

  if (label === undefined || breit) {
    return (
      <div className={cn('flex min-w-0 flex-col gap-1', className)}>
        {label !== undefined && beschriftung('truncate text-ui text-matt')}
        {children(kind)}
        {fehler && <p id={fehlerId} className="break-words text-dicht text-fehler">{fehler}</p>}
      </div>
    )
  }

  return (
    <div className={cn('grid min-w-0 grid-cols-[2fr_3fr] items-center gap-x-2 gap-y-1', className)}>
      {beschriftung('min-h-steuer flex items-center truncate text-ui text-matt')}
      <div className="flex min-w-0 items-center">{children(kind)}</div>
      {fehler && (
        <p id={fehlerId} className="col-span-2 break-words text-dicht text-fehler">{fehler}</p>
      )}
    </div>
  )
}
