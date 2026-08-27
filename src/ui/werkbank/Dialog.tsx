import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@/ui/zeichen'
import { cn } from '@/lib/utils'
import { Knopf } from './Knopf'

export interface DialogProps {
  titel: ReactNode

  // Steht gedimmt hinter dem Titel (Zaehler, Ereignisname).
  nebenTitel?: ReactNode

  // Links im Kopf neben dem Schliessen-Kreuz.
  aktionen?: ReactNode

  // Eine Frage („wirklich loeschen?") nimmt nicht die ganze Flaeche.
  schmal?: boolean

  // Fuss mit den Antwortknoepfen.
  fuss?: ReactNode
  onClose: () => void
  children: ReactNode
}

export function Dialog({
  titel,
  nebenTitel,
  aktionen,
  schmal = false,
  fuss,
  onClose,
  children,
}: DialogProps) {
  useEffect(() => {
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', taste)
    return () => document.removeEventListener('keydown', taste)
  }, [onClose])

  const rumpf = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof titel === 'string' ? titel : undefined}
      className={cn(
        'flex min-h-0 flex-col bg-grund',
        schmal
          ? 'w-full max-w-md rounded border border-linie bg-panel shadow-overlay'
          : 'h-full w-full',
      )}
    >
      <header className="flex h-10 shrink-0 items-center gap-3 border-b border-linie px-3">
        <h2 className="min-w-0 flex-1 truncate text-ui font-semibold text-tinte">
          {titel}
          {nebenTitel !== undefined && (
            <span className="ml-2 font-normal text-matt">{nebenTitel}</span>
          )}
        </h2>
        {aktionen}
        <Knopf nurZeichen aria-label="Schließen" title="Schließen (Esc)" onClick={onClose}>
          <X size={15} />
        </Knopf>
      </header>

      <div className={cn('min-h-0 flex-1 overflow-auto', schmal ? 'p-3' : 'p-4')}>
        {children}
      </div>

      {fuss && (
        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-linie px-3 py-2">
          {fuss}
        </footer>
      )}
    </div>
  )

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-40',
        schmal ? 'flex items-center justify-center bg-grund/80 p-6' : '',
      )}
      onPointerDown={(e) => {
        if (schmal && e.target === e.currentTarget) onClose()
      }}
    >
      {rumpf}
    </div>,
    document.body,
  )
}
