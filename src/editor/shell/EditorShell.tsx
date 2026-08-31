import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Trenner } from '@/ui/werkbank/Trenner'
import { useKeyboardShortcuts } from '../../state/useKeyboardShortcuts'
import { Canvas } from '../canvas/Canvas'
import { SeitenLeiste } from '../canvas/SeitenLeiste'
import { Inspector } from '../inspector/Inspector'
import { Sidebar } from '../sidebar/Sidebar'
import { Kommandozentrale } from '../zentrale/Kommandozentrale'
import {
  begrenzeBreite,
  BREITEN_SCHRITT,
  INSPECTOR_MAX,
  INSPECTOR_MIN,
  leseBreite,
  merkeBreite,
  starteBreitenZug,
} from './inspectorBreite'
import { Meldungen } from './Meldungen'
import { StatusBar } from './StatusBar'
import { Toolbar, VerlaufKnoepfe } from './Toolbar'

export function EditorShell() {
  useKeyboardShortcuts()

  const [datencenterOffen, setDatencenterOffen] = useState(false)
  const [paletteOffen, setPaletteOffen] = useState(true)

  // Der gemerkte Stand wird EINMAL beim Aufbau gelesen (useState mit
  // Funktion), nicht bei jedem Zeichnen.
  const [inspektorBreite, setInspektorBreite] = useState(leseBreite)

  // Waehrend des Zugs wird nur gezeichnet; gemerkt wird beim Loslassen und
  // bei jedem Tastenschritt.
  const setzeUndMerke = (breite: number): void => {
    setInspektorBreite(breite)
    merkeBreite(breite)
  }

  const beiGriffTaste = (e: ReactKeyboardEvent<HTMLElement>): void => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dx = e.key === 'ArrowLeft' ? BREITEN_SCHRITT : -BREITEN_SCHRITT
    setzeUndMerke(begrenzeBreite(inspektorBreite + dx))
  }

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

        {/* Der Greifstreifen traegt die Trennlinie des Inspectors: waere die
            Linie am Panel und der Streifen daneben, saehe man zwei Kanten. */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Breite des Inspectors"
          aria-valuenow={inspektorBreite}
          aria-valuemin={INSPECTOR_MIN}
          aria-valuemax={INSPECTOR_MAX}
          tabIndex={0}
          title="Breite ziehen"
          className="w-1.5 shrink-0 cursor-col-resize border-l border-linie bg-panel transition-colors hover:bg-akzent focus-visible:bg-akzent focus-visible:outline-none"
          onPointerDown={(e) => starteBreitenZug(e, inspektorBreite, setInspektorBreite, setzeUndMerke)}
          onKeyDown={beiGriffTaste}
        />
        <aside
          style={{ width: inspektorBreite }}
          className="shrink-0 overflow-hidden bg-panel"
        >
          <Inspector />
        </aside>
      </div>

      <StatusBar />

      <Meldungen />
    </div>
  )
}
