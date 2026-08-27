import { expect, test } from 'vitest'
import type { ActionParamBinding, ActionStep, RelationStep } from './aktionen'
import type { RelationTemplate } from './relations'
import { stepProblem } from './schrittPruefung'

// Der Nutzer kann nicht am Code nachsehen, warum ein Schritt rot ist — er
// liest allein diese Sätze. Darum jeder einmal.

function relation(params: readonly string[], extra = false): RelationTemplate {
  return {
    id: 'r1',
    name: 'Standard-Schreiben (PUT)',
    verb: 'PUT_RELATION',
    nr: '174',
    params,
    ...(extra ? { allowExtraParams: true } : {}),
  }
}

function fest(wert: string): ActionParamBinding {
  return { source: 'fixed', value: wert }
}

function relationSchritt(teile: Partial<RelationStep> = {}): ActionStep {
  return {
    id: 's1',
    type: 'RELATION',
    resultKey: '',
    relationId: 'r1',
    params: [],
    extraParams: [],
    ...teile,
  }
}

test('Popup-Schritt ohne Popup', () => {
  const schritt: ActionStep = {
    id: 's1', type: 'POPUP_OPEN', resultKey: '', popupId: '  ',
  }
  expect(stepProblem(schritt)).toBe('Schritt "Popup öffnen" hat kein Popup gewählt.')
})

test('Popup-Schritt auf geloeschter Seite', () => {
  const schritt: ActionStep = {
    id: 's1', type: 'POPUP_CLOSE', resultKey: '', popupId: 'weg',
  }
  expect(stepProblem(schritt, undefined, undefined, ['seite-1'])).toBe(
    'Schritt "Popup schließen" verweist auf eine gelöschte Popup-Seite.',
  )
})

test('BW-Befehl ohne Befehl', () => {
  const schritt: ActionStep = { id: 's1', type: 'BW_LINK', resultKey: '', befehl: '' }
  expect(stepProblem(schritt)).toBe('Schritt "BW-Befehl" hat keinen Befehl.')
})

test('START_TOOL ohne Nummer', () => {
  const schritt: ActionStep = {
    id: 's1', type: 'START_TOOL', resultKey: '', toolNr: '', toolParams: [],
  }
  expect(stepProblem(schritt)).toBe('Schritt "START_TOOL" hat keine Nummer.')
})

test('START_TOOL mit leerem Parameter', () => {
  const schritt: ActionStep = {
    id: 's1', type: 'START_TOOL', resultKey: '', toolNr: '508', toolParams: ['ok', ' '],
  }
  expect(stepProblem(schritt)).toBe('Schritt "START_TOOL" hat einen leeren Parameter.')
})

test('START_TOOL mit unbekanntem Platzhalter', () => {
  const schritt: ActionStep = {
    id: 's1', type: 'START_TOOL', resultKey: '', toolNr: '508', toolParams: ['{ZIMMERNR}'],
  }
  expect(stepProblem(schritt)).toBe('Schritt "START_TOOL" hat einen unbekannten Platzhalter.')
})

test('START_TOOL mit bekanntem Platzhalter ist in Ordnung', () => {
  const schritt: ActionStep = {
    id: 's1', type: 'START_TOOL', resultKey: '', toolNr: '508', toolParams: ['{PINDEX}'],
  }
  expect(stepProblem(schritt)).toBeNull()
})

test('Relation ohne Vorlage', () => {
  expect(stepProblem(relationSchritt({ relationId: '' }))).toBe(
    'Schritt "Relation" hat keine Vorlage.',
  )
})

test('Relation auf geloeschter Vorlage', () => {
  const andere: RelationTemplate = { ...relation([]), id: 'andere' }
  expect(stepProblem(relationSchritt(), [andere])).toBe(
    'Schritt "Relation" verweist auf eine gelöschte Vorlage.',
  )
})

test('Relation mit zu wenig Syntaxparametern', () => {
  const schritt = relationSchritt({ params: [fest('a')] })
  expect(stepProblem(schritt, [relation(['{PINDEX}', '{VALUE}'])])).toBe(
    'Schritt "Relation" hat nicht alle Syntaxparameter übernommen.',
  )
})

test('Relation mit unvollstaendigem Parameter nennt die Nummer', () => {
  const schritt = relationSchritt({
    params: [fest('a'), { source: 'context', value: '' }],
  })
  expect(stepProblem(schritt, [relation(['{PINDEX}', '{VALUE}'])])).toBe(
    'Schritt "Relation": Parameter 2 ist unvollständig.',
  )
})

test('Relation mit nicht erlaubten Zusatzparametern', () => {
  const schritt = relationSchritt({ extraParams: [fest('a')] })
  expect(stepProblem(schritt, [relation([])])).toBe(
    'Schritt "Relation" hat nicht erlaubte Zusatzparameter.',
  )
})

test('Relation mit leerem Zusatzparameter', () => {
  const schritt = relationSchritt({ extraParams: [{ source: 'context', value: '' }] })
  expect(stepProblem(schritt, [relation([], true)])).toBe(
    'Schritt "Relation" hat einen leeren Zusatzparameter.',
  )
})

test('Relation auf geloeschter Datenquelle', () => {
  const schritt = relationSchritt({
    extraParams: [{ source: 'data_field', dataSourceId: 'weg', value: '2_1' }],
  })
  expect(stepProblem(schritt, [relation([], true)], [])).toBe(
    'Schritt "Relation" verweist auf eine gelöschte Datenquelle.',
  )
})

test('Relation auf geloeschtem Baustein', () => {
  const schritt = relationSchritt({
    extraParams: [{ source: 'block_value', blockId: 'weg', value: 'text' }],
  })
  expect(stepProblem(schritt, [relation([], true)], [], [], [], [])).toBe(
    'Schritt "Relation" verweist auf einen gelöschten Baustein.',
  )
})

test('Relation liest die gewaehlte Zeile eines Bausteins, den es nicht gibt', () => {
  const schritt = relationSchritt({
    extraParams: [{ source: 'gewaehlte_zeile', blockId: 'weg', value: '0' }],
  })
  expect(stepProblem(schritt, [relation([], true)], [], [], [], [], [])).toBe(
    'Schritt "Relation" liest die gewählte Zeile eines Bausteins, den es nicht mehr gibt'
    + ' (oder der keine Auswahl mehr gibt).',
  )
})

test('Relation mit Ergebnis-Parameter ohne GET-Schritt davor', () => {
  const schritt = relationSchritt({
    extraParams: [{ source: 'step_result', value: 's-weg' }],
  })
  expect(stepProblem(schritt, [relation([], true)], [], [], ['s-anders'])).toBe(
    'Schritt "Relation": ein Parameter zeigt auf keinen GET-Schritt davor.',
  )
})

test('ein vollstaendiger Relations-Schritt hat kein Problem', () => {
  const schritt = relationSchritt({
    params: [{ source: 'context', value: 'PINDEX' }, fest('Wert')],
    extraParams: [{ source: 'data_field', dataSourceId: 'q1', value: '2_1' }],
  })
  const problem = stepProblem(
    schritt,
    [relation(['{PINDEX}', '{VALUE}'], true)],
    [{ id: 'q1', name: 'BEL', kind: 'beleg', fields: [] }],
    [], [], [], [],
  )
  expect(problem).toBeNull()
})
