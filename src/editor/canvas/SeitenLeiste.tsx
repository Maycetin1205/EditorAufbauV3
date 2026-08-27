import { Trash } from '@/ui/zeichen'
import { Fragment, useState } from 'react'
import { Feld } from '@/ui/werkbank/Feld'
import { getAllBlockDefinitions } from '../../core/blocks/blockRegistry'
import { useEditor } from '../../state/useEditor'
import { cn } from '@/lib/utils'

const REITER = 'h-6 shrink-0 whitespace-nowrap rounded px-2.5 text-ui transition-colors'

export function SeitenLeiste() {
  const ed = useEditor()
  const pages = ed.pages
  const aktiv = ed.activePageId

  const [umbenennen, setUmbenennen] = useState<{ id: string; text: string } | null>(null)
  const seitenArten = getAllBlockDefinitions().filter((def) => def.pageBlock)

  const uebernehmen = () => {
    if (!umbenennen) return
    const name = umbenennen.text.trim()
    if (name !== '') ed.updateProperty(umbenennen.id, 'name', name)
    setUmbenennen(null)
  }

  return (
    <div
      className="flex max-w-[44vw] items-center gap-0.5 overflow-x-auto rounded border border-linie bg-control p-0.5"
      data-ff-editor-helper
    >
      {pages.map((p) => (
        umbenennen?.id === p.id ? (
          <Feld
            key={p.id}
            autoFocus
            aria-label="Seitenname"
            value={umbenennen.text}
            onChange={(e) => setUmbenennen({ id: p.id, text: e.target.value })}
            onBlur={uebernehmen}
            onKeyDown={(e) => {
              if (e.key === 'Enter') uebernehmen()
              if (e.key === 'Escape') setUmbenennen(null)
            }}
            className="h-6 w-32 shrink-0"
          />
        ) : (
          <Fragment key={p.id}>
            <button
              type="button"
              onClick={() => ed.setActivePage(p.id)}
              onDoubleClick={() => {
                if (!p.istHauptseite) setUmbenennen({ id: p.id, text: p.name })
              }}
              title={p.istHauptseite ? undefined : 'Doppelklick: umbenennen'}
              className={cn(
                REITER,
                p.id === aktiv
                  ? 'bg-akzent/20 font-medium text-tinte'
                  : 'text-matt hover:text-tinte',
              )}
            >
              {p.name}
            </button>
            {p.id === aktiv && !p.istHauptseite && (
              <button
                type="button"
                title="Seite löschen (Strg+Z stellt sie zurück)"
                aria-label={`Seite ${p.name} löschen`}
                onClick={() => ed.removeBlock(p.id)}
                className="flex h-6 shrink-0 items-center rounded bg-akzent/20 pr-1.5 text-matt hover:text-fehler"
              >
                <Trash size={12} />
              </button>
            )}
          </Fragment>
        )
      ))}
      {seitenArten.map((def) => (
        <button
          key={def.type}
          type="button"
          onClick={() => ed.addSeite(def.type)}
          title={`Neue Seite anlegen: ${def.displayName}`}
          className={cn(REITER, 'text-matt hover:text-tinte')}
        >
          ＋ {def.displayName}
        </button>
      ))}
    </div>
  )
}
