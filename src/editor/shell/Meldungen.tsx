import { X } from '@/ui/zeichen'
import { Knopf } from '@/ui/werkbank/Knopf'
import { useMeldungen } from '../../state/useMeldungen'

export function Meldungen() {
  const stelle = useMeldungen()
  const liste = stelle.liste
  if (liste.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-8 right-3 z-50 flex w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col gap-2">
      {liste.map((m) => (
        <div
          key={m.id}
          role="alert"
          className="pointer-events-auto flex items-start gap-1 rounded border border-linie border-l-2 border-l-fehler bg-panel p-2 pl-3 shadow-overlay"
        >
          <p className="min-w-0 flex-1 whitespace-pre-line text-ui leading-relaxed text-tinte">
            {m.text}
          </p>
          <Knopf
            nurZeichen
            aria-label="Meldung schließen"
            title="Schließen"
            onClick={() => stelle.schliesse(m.id)}
          >
            <X size={13} />
          </Knopf>
        </div>
      ))}
    </div>
  )
}
