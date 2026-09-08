// Die Werkzeugleiste des Editors: Maskenname, Seiten, Datencenter, Export.
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
import { ROOT_ID } from '../../core/blocks/BlockData'
import { MASKEN_NAME_PROP, MASKEN_NAME_STANDARD, maskenNameVon } from '../../core/blocks/maskenName'
import { exportMask } from '../../export/exportMask'
import { failedChecks, validateMaskHtml } from '../../export/validator'
import { downloadFile } from '../../lib/dateiDownload'
import { dataSourceStore } from '../../state/DataSourceStore'
import { ladeMaskeAusDatei, speichereMaskeAlsDatei } from '../../state/maskenDatei'
import { meldungen } from '../../state/meldungen'
import { relationStore } from '../../state/RelationStore'
import { useEditor } from '../../state/useEditor'
import { Feld } from '@/ui/werkbank/Feld'
import { Knopf } from '@/ui/werkbank/Knopf'
import { MenueZeile } from '@/ui/werkbank/MenueZeile'
import { Popover } from '@/ui/werkbank/Popover'
import { Trenner } from '@/ui/werkbank/Trenner'
import { useEingabeSitzung } from '../inspector/controls/eingabeSitzung'

export function Toolbar({ onDatencenter }: { onDatencenter: () => void }) {
  const ed = useEditor()

  // Der Maskenname wird wie jede Eigenschaft im Baum gefuehrt; eine Tipp-Sitzung
  // ist EIN Undo-Schritt.
  const nameSitzung = useEingabeSitzung(() => ed.beginTransaction(), () => ed.endTransaction())
  const maskenName = String(ed.tree[ROOT_ID]?.props[MASKEN_NAME_PROP] ?? '')

  const handleExport = () => {
    const sources = dataSourceStore.list
    const relations = relationStore.list
    const { html, sevariablen } = exportMask(
      ed.tree, maskenNameVon(ed.tree), sources, relations,
    )
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

  return (
    <div className="flex items-center gap-1.5 justify-self-end">
      <WeitereAktionen
        onClearAll={() => ed.clear()}
        clearDisabled={ed.blockCount === 0}
        onSpeichern={() => speichereMaskeAlsDatei(ed)}
        onDatei={(datei) => void ladeMaskeAusDatei(ed, datei)}
      />

      <Trenner senkrecht className="mx-1" />

      <Feld
        value={maskenName}
        placeholder={MASKEN_NAME_STANDARD}
        aria-label="Name der Maske"
        title="Name der Maske — wird der Titel der exportierten Maske und ihr Anmeldename in SoftEngine"
        className="w-40"
        onChange={(e) => {
          nameSitzung.beginnen()
          ed.updateProperty(ROOT_ID, MASKEN_NAME_PROP, e.currentTarget.value)
        }}
        onBlur={nameSitzung.beenden}
      />

      <Knopf
        onClick={onDatencenter}
        title="Datencenter — Datenquellen und Relationen der Maske"
      >
        <SlidersHorizontal size={14} /> Datencenter
      </Knopf>

      <Knopf
        art="primaer"
        aria-label="Als SoftEngine-Maske exportieren"
        title="Export — Maskendatei und SEvariablen, beide in denselben Ordner"
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

// Speichern, Laden und Leeren fragen nicht nach: Strg+Z nimmt jedes davon
// zurueck, auch eine geladene Maskendatei.
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
            <MenueZeile
              role="menuitem"
              zeichen={<Save size={14} />}
              onClick={() => {
                setOffen(false)
                onSpeichern()
              }}
            >
              Maske speichern (Strg+S)
            </MenueZeile>
            <MenueZeile
              role="menuitem"
              zeichen={<FolderOpen size={14} />}
              onClick={() => {
                setOffen(false)
                dateiRef.current?.click()
              }}
            >
              Maske laden…
            </MenueZeile>
            <Trenner className="my-1" />
            <MenueZeile
              role="menuitem"
              art="gefahr"
              zeichen={<Trash2 size={14} />}
              disabled={clearDisabled}
              onClick={() => {
                setOffen(false)
                onClearAll()
              }}
            >
              Alle Bausteine löschen
            </MenueZeile>
          </div>
        </Popover>
      )}
    </>
  )
}
