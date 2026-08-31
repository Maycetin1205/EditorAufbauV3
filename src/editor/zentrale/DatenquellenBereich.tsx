import { useRef, useState } from 'react'
import { FileUp, Plus, TriangleAlert } from '@/ui/zeichen'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Marke } from '@/ui/werkbank/Marke'
import {
  artFuer,
  quellenKennung,
  type DataSource,
} from '../../core/data/dataSources'
import { parseDtkBytes, type DtkTabelle } from '../../core/data/dtkImport'
import { bausteineMitQuelle } from '../../state/quellenOps'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { useFrage } from '../shell/Frage'
import { DataSourceForm } from './DataSourceForm'
import { DtkImportForm } from './DtkImportForm'
import { bausteinName } from '../../core/blocks/bausteinName'
import { loeschFrage, ikonFuer } from './helfer'

export function DatenquellenBereich() {
  const store = useDataSources()
  const ed = useEditor()
  const [frageKnoten, frage] = useFrage()
  const [auswahlId, setAuswahlId] = useState<string | null>(store.list[0]?.id ?? null)

  const [modus, setModus] = useState<'lesen' | 'bearbeiten' | 'neu' | 'import'>('lesen')

  const [importStand, setImportStand] = useState<{
    dateiName: string
    tabellen: DtkTabelle[]
    pannenGrund?: string
  } | null>(null)
  const dateiRef = useRef<HTMLInputElement>(null)

  async function dtkGewaehlt(datei: File) {
    let tabellen: DtkTabelle[]
    let pannenGrund: string | undefined
    try {
      tabellen = parseDtkBytes(new Uint8Array(await datei.arrayBuffer()))
    } catch (fehler) {
      tabellen = []
      pannenGrund = fehler instanceof Error ? fehler.message : String(fehler)
    }
    setImportStand({ dateiName: datei.name, tabellen, pannenGrund })
    setModus('import')
  }

  const auswahl = store.list.find((s) => s.id === auswahlId) ?? store.list[0]

  const verwendungFor = (id: string): string[] =>
    bausteineMitQuelle(ed.tree, id).map((n) => bausteinName(n, store.list))

  const unvollstaendig = (s: DataSource): boolean =>
    artFuer(s.kind).felderEinzeln && s.fields.length === 0

  const kennung = (s: DataSource): string => quellenKennung(s)

  async function loeschen(s: DataSource) {
    const ja = await frage(loeschFrage(
      'Datenquelle',
      s.name,
      verwendungFor(s.id).length > 0,
      'Die Bausteine bleiben stehen, ihre Daten-Bindungen ruhen.',
    ))
    if (!ja) return
    store.remove(s.id)
    setModus('lesen')
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      {frageKnoten}

      <div className="flex w-64 shrink-0 flex-col border-r border-linie">
        <div className="flex flex-col gap-1 border-b border-linie p-2">
          <Knopf className="w-full" onClick={() => setModus('neu')}>
            <Plus size={14} /> Neue Datenquelle
          </Knopf>
          <Knopf className="w-full" onClick={() => dateiRef.current?.click()}>
            <FileUp size={14} /> Aus SoftEngine-Datei…
          </Knopf>

          <input
            ref={dateiRef}
            type="file"
            accept=".dtk"
            className="hidden"
            onChange={(e) => {
              const datei = e.target.files?.[0]
              try {
                if (datei) void dtkGewaehlt(datei)
              } finally {
                e.target.value = ''
              }
            }}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {store.list.map((s) => {
            const verwendet = verwendungFor(s.id).length
            const aktiv =
              (modus === 'lesen' || modus === 'bearbeiten') && auswahl?.id === s.id
            const Icon = ikonFuer(s.kind)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { setAuswahlId(s.id); setModus('lesen') }}
                className={`mb-1 w-full rounded border px-2.5 py-1 text-left text-dicht transition-colors ${
                  aktiv ? 'border-akzent/60 bg-akzent/15' : 'border-transparent hover:bg-control'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon size={12} className="shrink-0 text-matt" />
                  <span className="min-w-0 flex-1 truncate font-medium">{s.name}</span>
                  {unvollstaendig(s) && (
                    <TriangleAlert size={12} className="shrink-0 text-fehler" />
                  )}
                  <Marke technisch={false}>{artFuer(s.kind).name}</Marke>
                </div>
                <div className="mt-0.5 pl-[1.125rem] text-dicht text-matt">

                  {kennung(s) !== '' && (
                    <span className="font-mono">{kennung(s)} · </span>
                  )}
                  {s.fields.length} Felder · {verwendet > 0 ? `verwendet von ${verwendet}` : 'nicht verwendet'}
                </div>
              </button>
            )
          })}
          {store.list.length === 0 && (
            <p className="px-1 py-2 text-dicht text-matt">
              Noch keine Datenquellen.
            </p>
          )}
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
        {modus === 'neu' && (
          <DataSourceForm onClose={() => setModus('lesen')} />
        )}
        {modus === 'import' && importStand && (
          <DtkImportForm
            dateiName={importStand.dateiName}
            tabellen={importStand.tabellen}
            pannenGrund={importStand.pannenGrund}
            onClose={() => setModus('lesen')}
          />
        )}
        {modus === 'bearbeiten' && auswahl && (
          <DataSourceForm source={auswahl} onClose={() => setModus('lesen')} />
        )}
        {modus === 'lesen' && !auswahl && (
          <p className="text-dicht text-matt">Keine Datenquelle gewählt.</p>
        )}
        {modus === 'lesen' && auswahl && (
          <div className="flex flex-col gap-4 text-ui">
            <div>
              <h3 className="text-ui font-semibold text-tinte">{auswahl.name}</h3>
              <p className="text-matt">
                {artFuer(auswahl.kind).name}
                {kennung(auswahl) !== '' ? ` · ${kennung(auswahl)}` : ''}
              </p>
            </div>

            <Gruppe titel="Felder">
              <div className="overflow-hidden rounded border border-linie">
                <table className="w-full">
                  <tbody>
                    {auswahl.fields.map((f) => (
                      <tr key={f.code} className="border-b border-linie last:border-b-0">
                        <td className="px-2.5 py-1">{f.label}</td>
                        <td className="px-2.5 py-1 text-right font-mono text-dicht text-matt">
                          {f.code}
                        </td>
                      </tr>
                    ))}
                    {auswahl.fields.length === 0 && (
                      <tr><td className="px-2.5 py-1 text-matt">Keine Felder.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Gruppe>

            <Gruppe titel="Verwendung in dieser Maske">
              {verwendungFor(auswahl.id).length === 0 ? (
                <p className="text-matt">Von keinem Baustein verwendet.</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {verwendungFor(auswahl.id).map((name, i) => (
                    <li key={i} className="rounded border border-linie bg-control px-2.5 py-1">
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </Gruppe>

            <div className="flex gap-2 border-t border-linie pt-3">
              <Knopf art="primaer" onClick={() => setModus('bearbeiten')}>Bearbeiten</Knopf>
              <Knopf art="gefahr" onClick={() => void loeschen(auswahl)}>
                Löschen…
              </Knopf>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
