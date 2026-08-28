import { useState } from 'react'
import { Plus } from '@/ui/zeichen'
import { Dialog } from '@/ui/werkbank/Dialog'
import { Knopf } from '@/ui/werkbank/Knopf'
import type { BlockNode } from '../../core/blocks/BlockData'
import type { ActionStep } from '../../core/data/aktionen'
import { bausteinName } from '../../core/blocks/bausteinName'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { SchrittListe } from './SchrittListe'
import { StepForm } from './StepForm'

interface KettenFensterProps {
  block: BlockNode
  eventKey: string
  eventName: string
  onClose: () => void
}

export function KettenFenster({ block, eventKey, eventName, onClose }: KettenFensterProps) {
  const ed = useEditor()
  const quellen = useDataSources()

  const [offeneId, setOffeneId] = useState<string | null>(null)

  const [neu, setNeu] = useState(false)

  const kette = ed.tree[block.id]?.events?.[eventKey] ?? []
  const offen = offeneId === null ? undefined : kette.find((s) => s.id === offeneId)

  const setzeKette = (steps: ActionStep[]): void => {
    const node = ed.tree[block.id]
    if (!node) return
    ed.updateBlockEvents(block.id, { ...(node.events ?? {}), [eventKey]: steps })
  }

  const speichere = (step: ActionStep): void => {
    setzeKette(offen ? kette.map((s) => (s.id === step.id ? step : s)) : [...kette, step])
    setNeu(false)
    setOffeneId(step.id)
  }

  return (
    <Dialog
      randlos
      titel={bausteinName(block, quellen.list)}
      nebenTitel={`${eventName} · ${kette.length} ${kette.length === 1 ? 'Schritt' : 'Schritte'}`}
      aktionen={
        <Knopf
          onClick={() => {
            setOffeneId(null)
            setNeu(true)
          }}
        >
          <Plus size={13} /> Schritt
        </Knopf>
      }
      onClose={onClose}
    >
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <SchrittListe
          steps={kette}
          aktivId={offeneId ?? undefined}
          onWaehle={(s) => {
            setNeu(false)

            setOffeneId((jetzt) => (jetzt === s.id ? null : s.id))
          }}
          onAendern={setzeKette}
          aufgeklappt={
            <StepForm

              key={offeneId ?? 'keiner'}
              step={offen}
              kette={kette}
              onClose={() => setOffeneId(null)}
              onSave={speichere}
            />
          }
        />

        {neu && (
          <div className="border-t border-linie bg-panel px-3 py-3">
            <StepForm
              key="neu"
              kette={kette}
              onClose={() => setNeu(false)}
              onSave={speichere}
            />
          </div>
        )}
        {kette.length === 0 && !neu && (

          <p className="px-3 py-3 text-ui text-matt">Noch kein Schritt.</p>
        )}
      </div>
    </Dialog>
  )
}
