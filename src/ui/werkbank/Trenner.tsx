import { cn } from '@/lib/utils'

export function Trenner({
  senkrecht = false,
  className,
}: {
  senkrecht?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('shrink-0 bg-linie', senkrecht ? 'h-4 w-px' : 'h-px w-full', className)}
    />
  )
}
