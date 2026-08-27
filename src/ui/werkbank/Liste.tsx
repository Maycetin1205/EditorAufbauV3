import { Check } from '@/ui/zeichen'
import { cn } from '@/lib/utils'

export interface ListeEintrag {
  wert: string
  name: string

  // Rechts in der Zeile, technisch (Feldcode, Nummer) — Regel 3: der
  // Klarname fuehrt, die Kennung steht daneben.
  kennung?: string
  deaktiviert?: boolean
}

export interface ListeGruppe {
  key: string
  name?: string
  kennung?: string
  hinweis?: string
  eintraege: readonly ListeEintrag[]
}

export interface ListeProps {
  gruppen: readonly ListeGruppe[]
  wert: string

  // Erste Zeile fuer „nichts gewaehlt". Fehlt sie, ist die Wahl Pflicht.
  leerText?: string
  leerHinweis?: string
  onWaehle: (wert: string) => void
}

const ZEILE = 'flex w-full items-baseline gap-3 rounded px-2 py-1 text-left text-ui transition-colors'

export function Liste({ gruppen, wert, leerText, leerHinweis, onWaehle }: ListeProps) {
  const leer = gruppen.every((g) => g.eintraege.length === 0)

  return (
    <div className="flex flex-col">
      {leerText !== undefined && (
        <button
          type="button"
          onClick={() => onWaehle('')}
          className={cn(ZEILE, 'text-matt hover:bg-control hover:text-tinte',
            wert === '' && 'font-medium text-tinte')}
        >
          <span className="w-3 shrink-0">{wert === '' && <Check size={12} />}</span>
          <span className="min-w-0 flex-1 truncate">{leerText}</span>
        </button>
      )}

      {gruppen.map((g) => (
        <div key={g.key} className="flex flex-col">
          {g.name !== undefined && g.name !== '' && (
            <p className="flex items-baseline gap-2 px-2 pb-0.5 pt-1.5 text-dicht font-semibold uppercase tracking-wide text-matt">
              <span className="min-w-0 truncate">{g.name}</span>
              {g.kennung !== undefined && g.kennung !== '' && (
                <span className="shrink-0 font-mono normal-case tracking-normal">{g.kennung}</span>
              )}
            </p>
          )}
          {g.hinweis !== undefined && g.hinweis !== '' && (
            <p className="px-2 pb-1 text-dicht text-matt">{g.hinweis}</p>
          )}
          {g.eintraege.map((e) => {
            const gewaehlt = e.wert === wert
            return (
              <button
                key={`${g.key}::${e.wert}`}
                type="button"
                disabled={e.deaktiviert}
                onClick={() => onWaehle(e.wert)}
                className={cn(
                  ZEILE,
                  e.deaktiviert
                    ? 'cursor-not-allowed text-matt opacity-50'
                    : 'text-tinte hover:bg-control',
                  gewaehlt && 'bg-akzent/15 font-medium',
                )}
              >
                <span className="w-3 shrink-0 text-akzent">
                  {gewaehlt && <Check size={12} />}
                </span>
                <span className="min-w-0 flex-1 truncate">{e.name}</span>
                {e.kennung !== undefined && e.kennung !== '' && (
                  <span className="shrink-0 font-mono text-dicht text-matt">{e.kennung}</span>
                )}
              </button>
            )
          })}
        </div>
      ))}

      {leer && leerText === undefined && (
        <p className="px-2 py-2 text-ui text-matt">{leerHinweis ?? 'Nichts zur Auswahl.'}</p>
      )}
    </div>
  )
}
