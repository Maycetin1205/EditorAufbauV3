import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { EINGABE_KANTE } from './Feld'

export interface ZahlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  // Steht rechts IM Feld (px, %, …) und wird nie mitgetippt.
  einheit?: string
}

export const Zahl = forwardRef<HTMLInputElement, ZahlProps>(
  ({ einheit, className, ...rest }, ref) => (
    <span className="relative inline-flex min-w-0 items-center">
      <input
        ref={ref}
        type="number"
        inputMode="decimal"
        className={cn(
          EINGABE_KANTE,
          'h-steuer px-2 tabular-nums',
          // Die Pfeilchen des Browsers fressen die halbe Feldbreite und
          // treffen bei 28 px Hoehe ohnehin niemand.
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          einheit !== undefined && einheit !== '' && 'pr-6',
          className,
        )}
        {...rest}
      />
      {einheit !== undefined && einheit !== '' && (
        <span aria-hidden className="pointer-events-none absolute right-2 text-dicht text-matt">
          {einheit}
        </span>
      )}
    </span>
  ),
)
Zahl.displayName = 'Zahl'
