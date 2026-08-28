import { useState } from 'react'
import { Database, Link2 } from '@/ui/zeichen'
import { Dialog } from '@/ui/werkbank/Dialog'
import { useDataSources } from '../../state/useDataSources'
import { useRelations } from '../../state/useRelations'
import { DatenquellenBereich } from './DatenquellenBereich'
import { RelationenBereich } from './RelationenBereich'

type Bereich = 'datenquellen' | 'relationen'

const BEREICHE: ReadonlyArray<{ key: Bereich; name: string; icon: typeof Database }> = [
  { key: 'datenquellen', name: 'Datenquellen', icon: Database },
  { key: 'relationen', name: 'Relationen', icon: Link2 },
]

export function Kommandozentrale({ onClose }: { onClose: () => void }) {
  const [bereich, setBereich] = useState<Bereich>('datenquellen')
  const sources = useDataSources()
  const relations = useRelations()

  const navZahl: Record<Bereich, string> = {
    datenquellen: String(sources.list.length),
    relationen: String(relations.list.length),
  }

  return (
    <Dialog randlos titel="Datencenter" onClose={onClose}>
      <nav className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-linie bg-panel p-2">
        {BEREICHE.map(({ key, name, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setBereich(key)}
            className={`flex h-steuer items-center gap-2 rounded px-2 text-left text-ui transition-colors ${
              bereich === key
                ? 'bg-akzent/15 font-medium text-tinte'
                : 'text-matt hover:bg-control hover:text-tinte'
            }`}
          >
            <Icon size={14} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate">{name}</span>
            <span className="shrink-0 text-dicht tabular-nums text-matt">{navZahl[key]}</span>
          </button>
        ))}
      </nav>
      {bereich === 'datenquellen' && <DatenquellenBereich />}
      {bereich === 'relationen' && <RelationenBereich />}
    </Dialog>
  )
}
