import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AnkreuzProps {
  checked: boolean
  disabled?: boolean
  onChange: () => void

  // Der Rahmen der Zeile, in der das Ankreuzfeld steht (Trennlinie,
  // Innenabstand, Schwebefarbe) — den kennt die Liste, nicht das Bauteil.
  className?: string

  // Die Beschriftung. Meist ein Wort, hier auch mehr: Name, Kennung und eine
  // zweite Zeile darunter.
  children: ReactNode
}

// Kaestchen mit Beschriftung. Das Ganze ist ein `<label>`, damit der Klick auf
// die Beschriftung ankreuzt — bei einer zweizeiligen Beschriftung ist das der
// Unterschied zwischen einem Ziel von zwoelf Pixeln und der ganzen Zeile.
//
// Das Kaestchen sitzt oben (`mt-0.5`, `items-start`) statt mittig: bei
// mehrzeiliger Beschriftung wandert es sonst in die Mitte des Blocks und
// verliert den Bezug zur ersten Zeile.
export function Ankreuz({ checked, disabled = false, onChange, className, children }: AnkreuzProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-2 text-ui',
        disabled ? 'opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        className="mt-0.5 h-[14px] w-[14px] shrink-0 accent-akzent"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  )
}
