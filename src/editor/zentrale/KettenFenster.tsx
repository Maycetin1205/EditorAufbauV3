import { useState } from 'react'
import { Plus } from '@/ui/zeichen'
import { Dialog } from '@/ui/werkbank/Dialog'
import { Knopf } from '@/ui/werkbank/Knopf'
import { ListeDetail } from '@/ui/werkbank/ListeDetail'
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

  // Rechts steht IMMER genau eines: das Formular des neuen Schritts, das
  // des gewaehlten, oder der Hinweis, was zu tun ist.
  const detail = neu
    ? <StepForm key="neu" kette={kette} onClose={() => setNeu(false)} onSave={speichere} />
    : offen
      ? (
          <StepForm
            key={offen.id}
            step={offen}
            kette={kette}
            onClose={() => setOffeneId(null)}
            onSave={speichere}
          />
        )
      : (
          <p className="text-ui text-matt">
            {kette.length === 0 ? 'Noch kein Schritt. Lege links einen an.' : 'Schritt links wählen.'}
          </p>
        )

  // Derselbe Aufbau wie das Datencenter: Liste links mit dem Anlegen-Knopf
  // im Kopf, Detail rechts. Ein Fenster-Aufbau fuer den ganzen Editor.
  return (
    <Dialog
      randlos
      titel={bausteinName(block, quellen.list)}
      nebenTitel={`${eventName} · ${kette.length} ${kette.length === 1 ? 'Schritt' : 'Schritte'}`}
      onClose={onClose}
    >
      <ListeDetail
        listeKopf={
          <Knopf
            className="w-full"
            onClick={() => {
              setOffeneId(null)
              setNeu(true)
            }}
          >
            <Plus size={13} /> Schritt
          </Knopf>
        }
        listeOhneRand
        liste={kette.length === 0
          ? <p className="px-3 py-3 text-ui text-matt">Noch kein Schritt.</p>
          : (
              <SchrittListe
                steps={kette}
                aktivId={offeneId ?? undefined}
                onWaehle={(s) => {
                  setNeu(false)
                  setOffeneId(s.id)
                }}
                onAendern={setzeKette}
              />
            )}
        detail={detail}
      />
    </Dialog>
  )
}
