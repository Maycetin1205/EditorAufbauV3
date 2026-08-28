import {
  Download,
  FolderOpen,
  MoreHorizontal,
  Redo2,
  Save,
  SlidersHorizontal,
  Trash2,
  Undo2,
} from '@/ui/zeichen'
import { useRef, useState } from 'react'
import { exportMask } from '../../export/exportMask'
import { failedChecks, validateMaskHtml } from '../../export/validator'
import { downloadFile } from '../../lib/dateiDownload'
import { dataSourceStore } from '../../state/DataSourceStore'
import { uebernehmeMaske } from '../../state/maskeUebernehmen'
import { packeMaske, packeMaskeAus } from '../../state/maskenDatei'
import { meldungen } from '../../state/meldungen'
import { meldeVerworfeneTypen } from '../../state/persistence'
import { relationStore } from '../../state/RelationStore'
import { useEditor } from '../../state/useEditor'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Popover } from '@/ui/werkbank/Popover'
import { Trenner } from '@/ui/werkbank/Trenner'
import { useFrage } from './Frage'

export function Toolbar({ onDatencenter }: { onDatencenter: () => void }) {
  const ed = useEditor()
  const [frageKnoten, frage] = useFrage()

  const handleClear = async () => {
    if (ed.blockCount === 0) return
    const popups = ed.pages.filter((p) => !p.istHauptseite).length
    const zusatz = popups === 0
      ? ''
      : popups === 1
        ? '\n\nDie Popup-Seite fällt mit.'
        : `\n\nDie ${popups} Popup-Seiten fallen mit.`
    const ja = await frage({
      titel: 'Alle Bausteine löschen?',
      text: `${ed.blockCount} Bausteine aller Seiten werden entfernt.${zusatz}`,
      jaText: 'Alle löschen',
      gefahr: true,
    })
    if (!ja) return
    ed.clear()
  }

  const handleExport = () => {
    const sources = dataSourceStore.list
    const relations = relationStore.list
    const { html, sevariablen } = exportMask(ed.tree, 'Maske', sources, relations)
    const failed = failedChecks(validateMaskHtml(html))
    if (failed.length > 0) {
      meldungen.melde(
        'Export abgebrochen — die Datei hätte in SoftEngine nicht geladen:\n\n'
        + failed.map((f) => `• ${f.name}: ${f.detail}`).join('\n'),
      )
      return
    }

    downloadFile('index.basis.source.html', html, 'text/html')
    downloadFile('index.basis.SEvariablen.json', sevariablen, 'application/json')
  }

  const handleSpeichern = () => {
    const text = packeMaske({
      tree: ed.tree,
      datenquellen: [...dataSourceStore.list],
      relationen: [...relationStore.list],
    })
    const heute = new Date().toISOString().slice(0, 10)
    downloadFile(`aufbau-maske-${heute}.json`, text, 'application/json')
  }

  const handleDateiGewaehlt = async (datei: File) => {
    let text: string
    try {
      text = await datei.text()
    } catch {
      meldungen.melde('Die Datei konnte nicht gelesen werden.')
      return
    }
    const ergebnis = packeMaskeAus(text)
    if (!ergebnis.ok) {
      const liste = ergebnis.probleme.slice(0, 10)
        .map((p) => `• ${p.bereich}${p.stelle === '' ? '' : ` (${p.stelle})`}: ${p.grund}`)
      const rest = ergebnis.probleme.length - liste.length
      meldungen.melde([
        ergebnis.grund,
        ...(liste.length > 0 ? ['', ...liste] : []),
        ...(rest > 0 ? [`… und ${rest} weitere.`] : []),
      ].join('\n'))
      return
    }

    const ja = await frage({
      titel: 'Offene Maske ersetzen?',
      text: 'Haben Sie den bisherigen Stand gespeichert?\n\n'
        + 'Die offene Maske wird unwiderruflich ersetzt — das lässt sich nicht '
        + 'rückgängig machen.',
      jaText: 'Ersetzen',
      gefahr: true,
    })
    if (!ja) return

    uebernehmeMaske(ed, ergebnis.inhalt)
    meldeVerworfeneTypen(ergebnis.verworfen)
  }

  return (
    <div className="flex items-center gap-1.5 justify-self-end">
      {frageKnoten}
      <WeitereAktionen
        onClearAll={() => void handleClear()}
        clearDisabled={ed.blockCount === 0}
        onSpeichern={handleSpeichern}
        onDatei={handleDateiGewaehlt}
      />

      <Trenner senkrecht className="mx-1" />

      <Knopf
        onClick={onDatencenter}
        title="Datencenter — Datenquellen und Relationen der Maske"
      >
        <SlidersHorizontal size={14} /> Datencenter
      </Knopf>

      <Knopf
        art="primaer"
        aria-label="Als SoftEngine-Maske exportieren"
        title="Export (SoftEngine-Maske)"
        onClick={handleExport}
        disabled={ed.blockCount === 0}
      >
        <Download size={14} /> Exportieren
      </Knopf>
    </div>
  )
}

export function VerlaufKnoepfe() {
  const ed = useEditor()
  return (
    <div className="flex items-center">
      <Knopf
        nurZeichen
        aria-label="Rückgängig (Ctrl+Z)"
        title="Rückgängig"
        onClick={() => ed.undo()}
        disabled={!ed.canUndo}
      >
        <Undo2 size={15} />
      </Knopf>
      <Knopf
        nurZeichen
        aria-label="Wiederholen (Ctrl+Shift+Z)"
        title="Wiederholen"
        onClick={() => ed.redo()}
        disabled={!ed.canRedo}
      >
        <Redo2 size={15} />
      </Knopf>
    </div>
  )
}

const MENUEZEILE =
  'flex h-steuer w-full items-center gap-2 rounded px-2 text-left text-ui text-tinte'
  + ' transition-colors hover:bg-control disabled:pointer-events-none disabled:opacity-40'

function WeitereAktionen({
  onClearAll,
  clearDisabled,
  onSpeichern,
  onDatei,
}: {
  onClearAll: () => void
  clearDisabled: boolean
  onSpeichern: () => void
  onDatei: (datei: File) => void
}) {
  const [offen, setOffen] = useState(false)
  const knopf = useRef<HTMLButtonElement>(null)
  const dateiRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Knopf
        ref={knopf}
        nurZeichen
        aria-label="Weitere Aktionen"
        title="Weitere Aktionen"
        aria-haspopup="menu"
        aria-expanded={offen}
        onClick={() => setOffen((v) => !v)}
      >
        <MoreHorizontal size={15} />
      </Knopf>

      <input
        ref={dateiRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const datei = e.target.files?.[0]
          try {
            if (datei) onDatei(datei)
          } finally {
            e.target.value = ''
          }
        }}
      />

      {offen && (
        <Popover
          bezeichnung="Weitere Aktionen"
          anker={knopf}
          breite={200}
          onClose={() => setOffen(false)}
        >
          <div role="menu" className="flex flex-col">
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOffen(false)
                onSpeichern()
              }}
              className={MENUEZEILE}
            >
              <Save size={13} /> Maske speichern…
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOffen(false)
                dateiRef.current?.click()
              }}
              className={MENUEZEILE}
            >
              <FolderOpen size={13} /> Maske laden…
            </button>
            <Trenner className="my-1" />
            <button
              role="menuitem"
              type="button"
              disabled={clearDisabled}
              onClick={() => {
                setOffen(false)
                onClearAll()
              }}
              className={`${MENUEZEILE} text-fehler hover:bg-fehler/15`}
            >
              <Trash2 size={13} /> Alle Bausteine löschen…
            </button>
          </div>
        </Popover>
      )}
    </>
  )
}
