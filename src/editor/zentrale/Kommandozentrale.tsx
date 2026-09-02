import { useState } from 'react'
import { Component, Database, Link2 } from '@/ui/zeichen'
import { Dialog } from '@/ui/werkbank/Dialog'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { useRelations } from '../../state/useRelations'
import { DatenquellenBereich } from './DatenquellenBereich'
import { RechnungenBereich } from './RechnungenBereich'
import { RelationenBereich } from './RelationenBereich'

type Bereich = 'datenquellen' | 'relationen' | 'rechnungen'

const BEREICHE: ReadonlyArray<{ key: Bereich; name: string; icon: typeof Database }> = [
  { key: 'datenquellen', name: 'Datenquellen', icon: Database },
  { key: 'relationen', name: 'Relationen', icon: Link2 },
  { key: 'rechnungen', name: 'Rechnungen', icon: Component },
]

export function Kommandozentrale({ onClose }: { onClose: () => void }) {
  const [bereich, setBereich] = useState<Bereich>('datenquellen')
  const sources = useDataSources()
  const relations = useRelations()
  const ed = useEditor()

  const rechnungen = Object.values(ed.tree)
    .filter((n) => typeof n.props.rechnung === 'string' && n.props.rechnung.trim() !== '')
    .length

  const navZahl: Record<Bereich, string> = {
    datenquellen: String(sources.list.length),
    relationen: String(relations.list.length),
    rechnungen: String(rechnungen),
  }

  // Die Bereichsleiste geht als Slot in den gemeinsamen Fenster-Aufbau
  // (ListeDetail) des jeweiligen Bereichs.
  const bereichsleiste = (
    <>
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
    </>
  )

  return (
    <Dialog randlos titel="Datencenter" onClose={onClose}>
      {bereich === 'datenquellen' && <DatenquellenBereich bereiche={bereichsleiste} />}
      {bereich === 'relationen' && <RelationenBereich bereiche={bereichsleiste} />}
      {/* Fliegt in Schritt 3 (Rechnung wandert in den Tabellen-Inspector). */}
      {bereich === 'rechnungen' && (
        <>
          <nav className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-linie bg-panel p-2">
            {bereichsleiste}
          </nav>
          <RechnungenBereich />
        </>
      )}
    </Dialog>
  )
}
