import { useState } from 'react'
import { Trenner } from '@/ui/werkbank/Trenner'
import { useKeyboardShortcuts } from '../../state/useKeyboardShortcuts'
import { Canvas } from '../canvas/Canvas'
import { SeitenLeiste } from '../canvas/SeitenLeiste'
import { Inspector } from '../inspector/Inspector'
import { Sidebar } from '../sidebar/Sidebar'
import { Kommandozentrale } from '../zentrale/Kommandozentrale'
import { Meldungen } from './Meldungen'
import { StatusBar } from './StatusBar'
import { Toolbar, VerlaufKnoepfe } from './Toolbar'

export function EditorShell() {
  useKeyboardShortcuts()

  const [datencenterOffen, setDatencenterOffen] = useState(false)
  const [paletteOffen, setPaletteOffen] = useState(true)

  return (
    <div className="flex h-screen w-screen flex-col bg-grund text-tinte">
      <header className="grid h-9 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-linie bg-panel px-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 truncate text-ui font-semibold text-tinte">Aufbau-Editor</span>
          <Trenner senkrecht />
          <VerlaufKnoepfe />
        </div>
        <div className="justify-self-center">
          <SeitenLeiste />
        </div>
        <Toolbar onDatencenter={() => setDatencenterOffen(true)} />
      </header>

      {datencenterOffen && <Kommandozentrale onClose={() => setDatencenterOffen(false)} />}

      <div className="flex min-h-0 flex-1">
        <aside
          className={`${paletteOffen ? 'w-60' : 'w-9'} shrink-0 overflow-hidden border-r border-linie bg-panel`}
        >
          <Sidebar offen={paletteOffen} onSchalte={setPaletteOffen} />
        </aside>

        <main className="min-w-0 flex-1 overflow-auto bg-[hsl(var(--canvas-bg))] p-4">
          <Canvas />
        </main>

        <aside className="w-80 shrink-0 overflow-hidden border-l border-linie bg-panel">
          <Inspector />
        </aside>
      </div>

      <StatusBar />

      <Meldungen />
    </div>
  )
}
