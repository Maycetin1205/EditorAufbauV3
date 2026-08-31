import { useState } from 'react'
import { Plus, Search, Share2 } from '@/ui/zeichen'
import { Feld } from '@/ui/werkbank/Feld'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import { relationIdsVon } from '../../core/blocks/treeQuery'
import {
  formatRelationSyntax,
  relationGroup,
  relationMatchesSearch,
  type RelationGroup,
  type RelationTemplate,
} from '../../core/data/relations'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { useRelations } from '../../state/useRelations'
import { useFrage } from '../shell/Frage'
import { SegmentControl } from '../inspector/controls/SegmentControl'
import { RelationForm } from './RelationForm'
import { bausteinName } from '../../core/blocks/bausteinName'
import { loeschFrage, parameterBedeutung, RELATION_GRUPPEN, VERB_KURZ } from './helfer'

export function RelationenBereich() {
  const store = useRelations()
  const ed = useEditor()
  const quellen = useDataSources().list
  const [frageKnoten, frage] = useFrage()
  const [suche, setSuche] = useState('')

  // Start auf dem Reiter, der etwas zu zeigen hat; danach gewinnt der Klick.
  // (Eine dauerhafte Umleitung auf den vollen Reiter machte den Klick auf
  // den leeren wirkungslos — der Reiter war ein toter Knopf.)
  const [filter, setFilter] = useState<RelationGroup>(() =>
    store.list.some((r) => relationGroup(r) === 'lesen') || store.list.length === 0
      ? 'lesen'
      : 'schreiben')
  const [auswahlId, setAuswahlId] = useState<string | null>(store.list[0]?.id ?? null)
  const [modus, setModus] = useState<'lesen' | 'bearbeiten' | 'neu'>('lesen')

  const trefferAlle = store.list.filter((relation) => relationMatchesSearch(relation, suche))
  const zaehler: Record<RelationGroup, number> = {
    lesen: trefferAlle.filter((r) => relationGroup(r) === 'lesen').length,
    schreiben: trefferAlle.filter((r) => relationGroup(r) === 'schreiben').length,
  }
  const aktiverFilter: RelationGroup = filter
  const sichtbareRelationen = trefferAlle.filter((r) => relationGroup(r) === aktiverFilter)

  const sucht = suche.trim().length > 0
  const filterOptionen = RELATION_GRUPPEN.map((gruppe) => ({
    ...gruppe,
    label: sucht ? `${gruppe.label} · ${zaehler[gruppe.value as RelationGroup]}` : gruppe.label,
  }))
  const auswahl = sichtbareRelationen.find((r) => r.id === auswahlId) ?? sichtbareRelationen[0]

  const verwendungFor = (id: string): string[] =>
    Object.values(ed.tree)
      .filter((n) => relationIdsVon(n).includes(id))
      .map((n) => bausteinName(n, quellen))

  async function loeschen(r: RelationTemplate) {
    const ja = await frage(loeschFrage(
      'Relation',
      r.name,
      verwendungFor(r.id).length > 0,
      'Die Bausteine bleiben stehen, ihr Schreibweg ruht.',
    ))
    if (!ja) return
    store.remove(r.id)
    setModus('lesen')
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      {frageKnoten}

      <div className="flex w-64 shrink-0 flex-col border-r border-linie">
        <div className="flex flex-col gap-2 border-b border-linie p-2">
          <Knopf className="w-full" onClick={() => setModus('neu')}>
            <Plus size={14} /> Neue Relation
          </Knopf>
          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-matt"
            />
            <Feld
              aria-label="Relationen durchsuchen"
              value={suche}
              placeholder="Suchen"
              className="pl-7"
              onChange={(e) => setSuche(e.target.value)}
            />
          </div>
          <SegmentControl
            name="Lesen oder Schreiben"
            value={aktiverFilter}
            options={filterOptionen}
            onChange={(value) => setFilter(value as RelationGroup)}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {sichtbareRelationen.map((r) => {
            const aktiv = modus !== 'neu' && auswahl?.id === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => { setAuswahlId(r.id); setModus('lesen') }}
                className={`mb-1 w-full rounded border px-2.5 py-1 text-left text-dicht transition-colors ${
                  aktiv ? 'border-akzent/60 bg-akzent/15' : 'border-transparent hover:bg-control'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Share2 size={12} className="shrink-0 text-matt" />
                  <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
                  <span className="shrink-0 rounded bg-control px-1.5 font-mono text-dicht text-matt">
                    {VERB_KURZ[r.verb]} {r.nr}
                  </span>
                </div>
              </button>
            )
          })}
          {store.list.length === 0 && (
            <p className="px-1 py-2 text-dicht text-matt">
              Noch keine Relationen.
            </p>
          )}
          {store.list.length > 0 && sichtbareRelationen.length === 0 && (
            <p className="px-1 py-2 text-dicht text-matt">Keine Treffer.</p>
          )}
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
        {modus === 'neu' && <RelationForm onClose={() => setModus('lesen')} />}
        {modus === 'bearbeiten' && auswahl && (
          <RelationForm relation={auswahl} onClose={() => setModus('lesen')} />
        )}
        {modus === 'lesen' && !auswahl && (
          <p className="text-dicht text-matt">
            Keine Relation gewählt.
          </p>
        )}
        {modus === 'lesen' && auswahl && (
          <div className="flex flex-col gap-4 text-ui">
            <div>
              <h3 className="text-ui font-semibold text-tinte">{auswahl.name}</h3>
            </div>

            <Gruppe titel="Parameter — in genau dieser Reihenfolge">
              <div className="overflow-hidden rounded border border-linie">
                <table className="w-full">
                  <tbody>
                    {auswahl.params.map((p, i) => (
                      <tr key={i} className="border-b border-linie last:border-b-0">
                        <td className="w-6 px-2 py-1 text-right font-mono text-dicht text-matt">
                          {i + 1}
                        </td>
                        <td className="px-2 py-1 font-mono text-dicht">
                          {p === '' ? <span className="text-matt">(leer)</span> : p}
                        </td>
                        <td className="px-2 py-1 text-matt">{parameterBedeutung(p)}</td>
                      </tr>
                    ))}
                    {auswahl.params.length === 0 && (
                      <tr><td className="px-2.5 py-1 text-matt">Keine Parameter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Gruppe>

            <Gruppe titel="Gespeicherte SoftEngine-Syntax">
              <code className="block overflow-x-auto rounded bg-control px-2.5 py-1.5 font-mono text-dicht">
                {formatRelationSyntax(auswahl)}
              </code>
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
