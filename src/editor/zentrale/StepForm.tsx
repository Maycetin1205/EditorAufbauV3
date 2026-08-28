import { useMemo, useReducer, useRef } from 'react'
import { Plus } from '@/ui/zeichen'
import { Feld } from '@/ui/werkbank/Feld'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Zeile } from '@/ui/werkbank/Zeile'
import {
  STEP_TYPES,
  defaultRelationParams,
  ergebnisSchritteVor,
  type ActionStep,
  type StepTypeKey,
} from '../../core/data/aktionen'
import { stepProblem } from '../../core/data/schrittPruefung'
import { getBlockDefinition } from '../../core/blocks/blockRegistry'
import {
  actionValueTargets,
  auswahlGeberImBaum,
  aenderungsTraegerImBaum,
  erfassungsTraegerImBaum,
  loeschTraegerImBaum,
} from '../../core/blocks/treeQuery'
import { relationMatchesSearch } from '../../core/data/relations'
import { FeldUebernahmePicker } from './FeldUebernahmePicker'
import {
  feldUebernahmeArt,
  feldUebernehmen,
  type FeldUebernahmeZiel,
} from './feldUebernahme'
import { bausteinName } from '../../core/blocks/bausteinName'
import { istFensterSeite, seitenDerMaske } from '../../state/pageOps'
import {
  auswahlGeberOptionen,
  blockValueKey,
  erfassungsOptionen,
  type BlockValueOption,
} from './helfer'
import {
  bindungFuer,
  entwurfAus,
  kandidatAus,
  schrittReducer,
  uebernahmeMeldung,
  vorlageVon,
} from './schrittEntwurf'
import { ParameterZeile } from './ParameterZeile'
import type { ParameterWahlen } from './parameter/wahlen'
import { RelationAuswahl } from './RelationAuswahl'
import { useRelations } from '../../state/useRelations'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { PickerControl } from '../inspector/controls/PickerControl'
import { SelectControl } from '../inspector/controls/SelectControl'

interface StepFormProps {
  step?: ActionStep

  kette: readonly ActionStep[]
  onSave: (step: ActionStep) => void
  onClose: () => void
}

export function StepForm({ step, kette, onSave, onClose }: StepFormProps) {
  const relations = useRelations()
  const dataSources = useDataSources()
  const ed = useEditor()

  const vorlagen = relations.list
  const quellen = dataSources.list
  const baum = ed.tree

  const reducer = useMemo(() => schrittReducer(vorlagen), [vorlagen])
  const [entwurf, dispatch] = useReducer(reducer, undefined, () => entwurfAus(step, vorlagen))
  const pickerAnker = useRef<HTMLElement | null>(null)

  // Die Wahlmoeglichkeiten haengen am Baustein-Baum, nicht am Getippten:
  // ohne Memo laeuft jeder Tastendruck durch den ganzen Baum.
  const auswahlen = useMemo(() => {
    const blockValues: BlockValueOption[] = actionValueTargets(baum).map(({ node, spot }) => {
      const def = getBlockDefinition(node.type)
      const name = bausteinName(node, quellen)
      const mehrereStellen = (def?.actionValueSpots?.length ?? 0) > 1
      return {
        key: blockValueKey(node.id, spot.prop),
        blockId: node.id,
        prop: spot.prop,
        label: mehrereStellen ? `${name} — ${spot.label}` : name,
      }
    })
    const geber = auswahlGeberOptionen(auswahlGeberImBaum(baum), quellen)
    const popupSeiten = seitenDerMaske(baum).filter(istFensterSeite)
    return {
      blockValues,
      actionValueRefs: blockValues.map(({ blockId, prop }) => ({ blockId, prop })),
      geber,
      geberIds: geber.map((g) => g.blockId),
      erfassungen: erfassungsOptionen(erfassungsTraegerImBaum(baum), quellen),

      // Dieselbe Form wie die Erfassungen: Baustein + seine Spalten. Nur die
      // Frage ist eine andere — wer traegt AENDERBARE Spalten?
      aenderungen: erfassungsOptionen(aenderungsTraegerImBaum(baum), quellen),

      loeschungen: erfassungsOptionen(loeschTraegerImBaum(baum), quellen),
      popupSeiten,
      popupIds: popupSeiten.map((seite) => seite.id),
    }
  }, [baum, quellen])

  const ergebnisSchritte = useMemo(
    () => ergebnisSchritteVor(kette, step?.id, vorlagen),
    [kette, step?.id, vorlagen],
  )
  const ergebnisIds = useMemo(() => ergebnisSchritte.map((s) => s.id), [ergebnisSchritte])

  const wahlen: ParameterWahlen = useMemo(() => ({
    dataSources: quellen,
    blockValues: auswahlen.blockValues,
    geber: auswahlen.geber,
    erfassungen: auswahlen.erfassungen,
    aenderungen: auswahlen.aenderungen,
    loeschungen: auswahlen.loeschungen,
    schritte: ergebnisSchritte,
  }), [quellen, auswahlen, ergebnisSchritte])

  const relation = useMemo(
    () => vorlageVon(vorlagen, entwurf.relationId),
    [vorlagen, entwurf.relationId],
  )
  const vorgaben = useMemo(
    () => (relation ? defaultRelationParams(relation) : []),
    [relation],
  )
  const sichtbareRelationen = useMemo(
    () => vorlagen.filter((entry) => relationMatchesSearch(entry, entwurf.suche)),
    [vorlagen, entwurf.suche],
  )

  const kandidat = useMemo(
    () => kandidatAus(entwurf, relation, step),
    [entwurf, relation, step],
  )
  const problem = useMemo(
    () => stepProblem(
      kandidat,
      vorlagen,
      quellen,
      auswahlen.popupIds,
      ergebnisIds,
      auswahlen.actionValueRefs,
      auswahlen.geberIds,
    ),
    [kandidat, vorlagen, quellen, auswahlen, ergebnisIds],
  )

  const bindung = (index: number) => bindungFuer(entwurf, vorgaben, index)
  const fehlerText = entwurf.zeigeFehler ? problem ?? undefined : undefined

  const ausgelassen = relation
    ? relation.params.map((_, index) => index).filter((i) => bindung(i).source === 'aus')
    : []

  const feldAusloeserAktiv = relation
    ? relation.params.some((raw) => feldUebernahmeArt(raw) === 'pos')
      && relation.params.some((raw) => feldUebernahmeArt(raw) === 'len')
    : false

  // Übernommen wird als fixed-Wert (feldUebernehmen) — der Haken im Picker
  // entsteht also aus den POS/LEN-Parametern, nicht aus einer Feld-Bindung.
  const uebernommenerWert = (art: 'pos' | 'len'): string | null => {
    if (!relation) return null
    const index = relation.params.findIndex((raw) => feldUebernahmeArt(raw) === art)
    if (index < 0) return null
    const b = bindung(index)
    return b.source === 'fixed' && /^\d+$/.test(b.value) ? b.value : null
  }
  const uebernahmePos = uebernommenerWert('pos')
  const uebernahmeLen = uebernommenerWert('len')
  const currentUebernahmeCode = uebernahmePos !== null && uebernahmeLen !== null
    ? `${uebernahmePos}_${uebernahmeLen}`
    : ''

  function oeffneUebernahmePicker(ziel: FeldUebernahmeZiel, anchor: HTMLElement) {
    // Zweiter Druck auf denselben Griff macht die Liste wieder zu.
    if (entwurf.pickerZiel === ziel && pickerAnker.current === anchor) {
      dispatch({ art: 'picker', ziel: null })
      return
    }
    pickerAnker.current = anchor
    dispatch({ art: 'picker', ziel })
  }

  function uebernehmeFeld(sourceId: string, code: string) {
    const ziel = entwurf.pickerZiel
    if (!relation || !ziel) return
    const source = quellen.find((entry) => entry.id === sourceId)
    if (!source) return
    const field = ziel === 'feld' ? source.fields.find((entry) => entry.code === code) : undefined
    if (ziel === 'feld' && !field) return
    const aktuelle = relation.params.map((_, index) => bindung(index))
    const result = feldUebernehmen(aktuelle, relation, source, code, ziel)
    dispatch({
      art: 'uebernahme',
      params: result.params,
      meldung: uebernahmeMeldung(result.gesetzt, field?.label ?? source.name),
    })
  }

  function speichern() {
    if (problem) {
      dispatch({ art: 'zeigeFehler' })
      return
    }
    onSave(kandidat)
    onClose()
  }

  return (
    <div className="flex flex-col gap-3">
      <SelectControl
        label="Aktion"
        value={entwurf.typ}
        options={STEP_TYPES.map((entry) => ({ value: entry.key, label: entry.name }))}
        onChange={(value) => dispatch({ art: 'typ', typ: value as StepTypeKey })}
      />

      {(entwurf.typ === 'POPUP_OPEN' || entwurf.typ === 'POPUP_CLOSE') && (
        /* Kein Leer-Eintrag: ohne Popup meldet stepProblem "kein Popup" —
           dieser Zustand darf also nicht waehlbar sein. */
        <PickerControl
          label="Popup"
          fehler={fehlerText}
          bezeichnung="Popup"
          gruppen={[{
            key: 'popups',
            eintraege: auswahlen.popupSeiten.map((seite) => ({ wert: seite.id, name: seite.name })),
          }]}
          wert={entwurf.popupId}
          platzhalter={auswahlen.popupSeiten.length === 0
            ? '(keine Popup-Seite vorhanden)'
            : '— wählen —'}
          onWaehle={(id) => dispatch({ art: 'popup', id })}
        />
      )}

      {entwurf.typ === 'START_TOOL' && (
        <Zeile label="Nummer" fehler={fehlerText}>
          {(kind) => (
            <Feld
              {...kind}
              value={entwurf.toolNr}
              className="w-28"
              onChange={(e) => dispatch({ art: 'toolNr', wert: e.currentTarget.value })}
            />
          )}
        </Zeile>
      )}

      {entwurf.typ === 'BW_LINK' && (
        <Zeile label="Befehl" fehler={fehlerText}>
          {(kind) => (
            <Feld
              {...kind}
              value={entwurf.befehl}
              placeholder="z. B. TABELLEPOS_DETAILS,{PINDEX}"
              onChange={(e) => dispatch({ art: 'befehl', wert: e.currentTarget.value })}
            />
          )}
        </Zeile>
      )}

      {entwurf.typ === 'RELATION' && (
        <>
          <RelationAuswahl
            label="Relation"
            eintraege={sichtbareRelationen}
            relationId={entwurf.relationId}
            suche={entwurf.suche}
            onSuche={(wert) => dispatch({ art: 'suche', wert })}
            onSelect={(id) => dispatch({ art: 'relation', id, gewaehlt: vorlageVon(vorlagen, id) })}
          />

          {relation && (
            <>
              <div className="flex flex-col gap-2">
                {relation.params.map((raw, index) => {
                  if (bindung(index).source === 'aus') return null
                  const parameterArt = feldUebernahmeArt(raw)
                  const ausloeser = parameterArt === 'relid'
                    ? 'idb'
                    : parameterArt === 'pos' && feldAusloeserAktiv
                      ? 'feld'
                      : undefined
                  return (
                    <ParameterZeile
                      key={index}
                      label={`${index + 1}. ${raw === '' ? '(leer)' : raw}`}
                      binding={bindung(index)}
                      wahlen={wahlen}
                      platzhalter={raw === '' ? '(leer)' : raw}
                      entfernen={{
                        label: `Parameter ${index + 1} für diese Aktion weglassen`,
                        onClick: () =>
                          dispatch({ art: 'bindung', index, bindung: { source: 'aus', value: '' } }),
                      }}
                      ausloeser={ausloeser}
                      onChange={(next) => dispatch({ art: 'bindung', index, bindung: next })}
                      onAusloeser={ausloeser
                        ? (anchor) => oeffneUebernahmePicker(ausloeser, anchor)
                        : undefined}
                    />
                  )
                })}
                {relation.params.length === 0 && (
                  <p className="text-ui text-matt">Keine Parameter.</p>
                )}
                {ausgelassen.length > 0 && (
                  <div className="flex items-center justify-between gap-2 text-dicht text-matt">
                    <span>
                      {`Weggelassen: ${ausgelassen.map((i) => i + 1).join(', ')} — gehen leer raus`}
                    </span>
                    <Knopf onClick={() => dispatch({ art: 'zurueckholen' })}>Zurückholen</Knopf>
                  </div>
                )}
              </div>
              {entwurf.uebernahmeBestaetigung && (
                <p className="text-ui text-matt">{entwurf.uebernahmeBestaetigung}</p>
              )}
              {entwurf.pickerZiel && (
                <FeldUebernahmePicker
                  quellen={quellen}
                  ziel={entwurf.pickerZiel}
                  current={currentUebernahmeCode}
                  anker={pickerAnker}
                  onPick={uebernehmeFeld}
                  onClose={() => dispatch({ art: 'picker', ziel: null })}
                />
              )}
            </>
          )}

          {relation?.allowExtraParams && (
            <div className="flex flex-col gap-2 border-t border-linie pt-3">
              <div className="flex items-center justify-between">
                <span className="text-dicht font-medium">Zusatzparameter</span>
                <Knopf onClick={() => dispatch({ art: 'extraHinzu' })}>
                  <Plus size={13} /> Parameter
                </Knopf>
              </div>
              {entwurf.extraParams.map((binding, index) => (
                <ParameterZeile
                  key={index}
                  label={`${index + 1}.`}
                  binding={binding}
                  wahlen={wahlen}
                  entfernen={{
                    label: `Zusatzparameter ${index + 1} entfernen`,
                    onClick: () => dispatch({ art: 'extraWeg', index }),
                  }}
                  onChange={(next) => dispatch({ art: 'extraAendern', index, bindung: next })}
                />
              ))}
            </div>
          )}

        </>
      )}

      {entwurf.zeigeFehler && problem && entwurf.typ === 'RELATION' && (
        <p className="text-ui text-fehler">{problem}</p>
      )}

      <div className="flex justify-end gap-2 border-t border-linie pt-3">
        <Knopf onClick={onClose}>Abbrechen</Knopf>
        <Knopf art="primaer" onClick={speichern}>Speichern</Knopf>
      </div>
    </div>
  )
}
