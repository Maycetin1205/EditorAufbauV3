import { useState } from 'react'
import { Database, Link2 } from '@/ui/zeichen'
import { Dialog } from '@/ui/werkbank/Dialog'
import { Eintrag } from '@/ui/werkbank/Eintrag'
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

  // Die Bereichsleiste geht als Slot in den gemeinsamen Fenster-Aufbau
  // (ListeDetail) des jeweiligen Bereichs.
  const bereichsleiste = (
    <>
      {BEREICHE.map(({ key, name, icon }) => (
        <Eintrag
          key={key}
          icon={icon}
          name={name}
          aktiv={bereich === key}
          onClick={() => setBereich(key)}
          rechts={(
            <span className="shrink-0 text-dicht tabular-nums text-matt">{navZahl[key]}</span>
          )}
        />
      ))}
    </>
  )

  return (
    <Dialog randlos titel="Datencenter" onClose={onClose}>
      {bereich === 'datenquellen' && <DatenquellenBereich bereiche={bereichsleiste} />}
      {bereich === 'relationen' && <RelationenBereich bereiche={bereichsleiste} />}
    </Dialog>
  )
}
