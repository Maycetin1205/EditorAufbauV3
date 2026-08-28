import {
  defaultRelationParams,
  type ActionParamBinding,
  type ActionStep,
  type StepTypeKey,
} from '../../core/data/aktionen'
import type { RelationTemplate } from '../../core/data/relations'
import type { FeldUebernahmeZiel, UebernahmeTreffer } from './feldUebernahme'

export interface SchrittEntwurf {
  // Einmal beim Oeffnen vergeben. Frueher zog jeder Render eine neue UUID,
  // also pruefte die Anzeige einen anderen Schritt, als Speichern schrieb.
  id: string

  typ: StepTypeKey
  toolNr: string
  befehl: string
  popupId: string
  relationId: string
  relationParams: ActionParamBinding[]
  extraParams: ActionParamBinding[]

  // Suchtext der Relationsliste.
  suche: string

  // Fehler stehen erst am Formular, wenn Speichern einmal gedrueckt wurde.
  zeigeFehler: boolean

  pickerZiel: FeldUebernahmeZiel | null
  uebernahmeBestaetigung: string
}

export function vorlageVon(
  relationen: readonly RelationTemplate[],
  id: string | undefined,
): RelationTemplate | undefined {
  return id === undefined || id === '' ? undefined : relationen.find((r) => r.id === id)
}

export function entwurfAus(
  step: ActionStep | undefined,
  relationen: readonly RelationTemplate[],
): SchrittEntwurf {
  const relationStep = step?.type === 'RELATION' ? step : undefined
  const relation = vorlageVon(relationen, relationStep?.relationId)
  return {
    id: step?.id ?? crypto.randomUUID(),
    typ: step?.type ?? 'START_TOOL',
    toolNr: step?.type === 'START_TOOL' ? step.toolNr : '',
    befehl: step?.type === 'BW_LINK' ? step.befehl : '',
    popupId: step?.type === 'POPUP_OPEN' || step?.type === 'POPUP_CLOSE' ? step.popupId : '',
    relationId: relationStep?.relationId ?? '',
    relationParams: anfangsParams(relationStep, relation),
    extraParams: relationStep ? relationStep.extraParams.map((b) => ({ ...b })) : [],
    suche: '',
    zeigeFehler: false,
    pickerZiel: null,
    uebernahmeBestaetigung: '',
  }
}

function anfangsParams(
  step: { params: ActionParamBinding[] } | undefined,
  relation: RelationTemplate | undefined,
): ActionParamBinding[] {
  if (!step) return []
  // Die Vorlage hat seit dem Speichern Parameter bekommen oder verloren:
  // dann zaehlt die Vorlage, nicht der alte Stand.
  if (relation && step.params.length !== relation.params.length) {
    return defaultRelationParams(relation)
  }
  return step.params.map((b) => ({ ...b }))
}

export function bindungFuer(
  entwurf: SchrittEntwurf,
  vorgaben: readonly ActionParamBinding[],
  index: number,
): ActionParamBinding {
  return entwurf.relationParams[index] ?? vorgaben[index] ?? { source: 'fixed', value: '' }
}

// Auf Vorlagenlaenge bringen, ohne das Getippte zu verlieren: eine Relation
// kann sich aendern, waehrend das Formular offen steht.
function aufLaenge(
  aktuell: readonly ActionParamBinding[],
  relation: RelationTemplate | undefined,
): ActionParamBinding[] {
  if (!relation) return [...aktuell]
  const next = defaultRelationParams(relation)
  aktuell.forEach((binding, at) => { if (at < next.length) next[at] = binding })
  return next
}

export function uebernahmeMeldung(
  gesetzt: readonly UebernahmeTreffer[],
  name: string,
): string {
  const details = gesetzt.map((treffer) => {
    const art = treffer.art === 'pos' ? 'Position' : treffer.art === 'len' ? 'Länge' : 'Tabelle'
    return `${art} ${treffer.wert}`
  })
  return name + ' übernommen' + (details.length > 0 ? ' - ' + details.join(' - ') : '')
}

export type SchrittAktion =
  | { art: 'typ'; typ: StepTypeKey }
  | { art: 'toolNr'; wert: string }
  | { art: 'befehl'; wert: string }
  | { art: 'popup'; id: string }
  | { art: 'suche'; wert: string }
  | { art: 'relation'; id: string; gewaehlt: RelationTemplate | undefined }
  | { art: 'bindung'; index: number; bindung: ActionParamBinding }
  | { art: 'zurueckholen' }
  | { art: 'extraHinzu' }
  | { art: 'extraAendern'; index: number; bindung: ActionParamBinding }
  | { art: 'extraWeg'; index: number }
  | { art: 'picker'; ziel: FeldUebernahmeZiel | null }
  | { art: 'uebernahme'; params: ActionParamBinding[]; meldung: string }
  | { art: 'zeigeFehler' }

// Die Vorlagen stecken im Reducer statt in jeder Aktion: nur sie wissen, wie
// viele Parameter es gibt und was ein zurueckgeholter Parameter wieder wird.
export function schrittReducer(relationen: readonly RelationTemplate[]) {
  return (entwurf: SchrittEntwurf, aktion: SchrittAktion): SchrittEntwurf => {
    const relation = vorlageVon(relationen, entwurf.relationId)
    switch (aktion.art) {
      case 'typ':
        return { ...entwurf, typ: aktion.typ, pickerZiel: null, uebernahmeBestaetigung: '' }
      case 'toolNr':
        return { ...entwurf, toolNr: aktion.wert }
      case 'befehl':
        return { ...entwurf, befehl: aktion.wert }
      case 'popup':
        return { ...entwurf, popupId: aktion.id }
      case 'suche':
        return { ...entwurf, suche: aktion.wert }
      case 'relation': {
        const gewaehlt = aktion.gewaehlt
        const rumpf = {
          ...entwurf,
          relationId: aktion.id,
          pickerZiel: null,
          uebernahmeBestaetigung: '',
        }
        if (!gewaehlt) return rumpf
        return {
          ...rumpf,
          relationParams: defaultRelationParams(gewaehlt),
          extraParams: gewaehlt.allowExtraParams ? rumpf.extraParams : [],
        }
      }
      case 'bindung': {
        const params = aufLaenge(entwurf.relationParams, relation)
        params[aktion.index] = aktion.bindung
        return { ...entwurf, relationParams: params, uebernahmeBestaetigung: '' }
      }
      case 'zurueckholen': {
        const vorgaben = relation ? defaultRelationParams(relation) : []
        return {
          ...entwurf,
          relationParams: entwurf.relationParams.map((binding, index) =>
            binding.source === 'aus'
              ? vorgaben[index] ?? { source: 'fixed', value: '' }
              : binding),
        }
      }
      case 'extraHinzu':
        return { ...entwurf, extraParams: [...entwurf.extraParams, { source: 'fixed', value: '' }] }
      case 'extraAendern':
        return {
          ...entwurf,
          extraParams: entwurf.extraParams.map((b, at) => (at === aktion.index ? aktion.bindung : b)),
        }
      case 'extraWeg':
        return {
          ...entwurf,
          extraParams: entwurf.extraParams.filter((_, at) => at !== aktion.index),
        }
      case 'picker':
        return { ...entwurf, pickerZiel: aktion.ziel }
      case 'uebernahme':
        return {
          ...entwurf,
          relationParams: aktion.params,
          pickerZiel: null,
          uebernahmeBestaetigung: aktion.meldung,
        }
      case 'zeigeFehler':
        return { ...entwurf, zeigeFehler: true }
    }
  }
}

export function kandidatAus(
  entwurf: SchrittEntwurf,
  relation: RelationTemplate | undefined,
  vorher: ActionStep | undefined,
): ActionStep {
  const { id, typ } = entwurf
  // Das Formular zeigt toolParams/resultKey nicht an (Entscheidung: nur die
  // Nummer) — geladene Werte darf Speichern trotzdem nicht wegwerfen.
  if (typ === 'POPUP_OPEN' || typ === 'POPUP_CLOSE') {
    return {
      id,
      type: typ,
      resultKey: vorher?.type === typ ? vorher.resultKey : '',
      popupId: entwurf.popupId,
    }
  }
  if (typ === 'BW_LINK') {
    return {
      id,
      type: 'BW_LINK',
      resultKey: vorher?.type === 'BW_LINK' ? vorher.resultKey : '',
      befehl: entwurf.befehl.trim(),
    }
  }
  if (typ === 'START_TOOL') {
    const alt = vorher?.type === 'START_TOOL' ? vorher : undefined
    return {
      id,
      type: 'START_TOOL',
      resultKey: alt?.resultKey ?? '',
      toolNr: entwurf.toolNr.trim(),
      toolParams: alt ? [...alt.toolParams] : [],
    }
  }
  const vorgaben = relation ? defaultRelationParams(relation) : []
  return {
    id,
    type: 'RELATION',
    relationId: entwurf.relationId,
    params: relation
      ? relation.params.map((_, index) => {
          const binding = bindungFuer(entwurf, vorgaben, index)
          return { ...binding, value: binding.value.trim() }
        })
      : [],
    extraParams: entwurf.extraParams.map((b) => ({ ...b, value: b.value.trim() })),
    resultKey: vorher?.resultKey ?? '',
  }
}
