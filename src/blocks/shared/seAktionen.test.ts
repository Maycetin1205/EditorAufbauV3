import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { ActionParamBinding, RuntimeStep } from '../../core/data/aktionen'

const laeufe: string[] = []
const fehler: string[] = []
let gleichzeitig = 0
let hoechstensGleichzeitig = 0

vi.mock('../../softengine/relations', async (echte) => {
  const modul = await echte<typeof import('../../softengine/relations')>()
  return {
    ...modul,
    findRuntimeRelation: (_list: unknown, id: string) => (id === ''
      ? undefined
      : {
          id,
          verb: id.startsWith('get') ? 'GET_RELATION' : 'PUT_RELATION',
          nr: '174',
          params: [],
        }),
    resolveActionParam: (binding: { value: string }) => binding.value,
    executeRelation: async (vorlage: { id: string }) => {
      gleichzeitig += 1
      hoechstensGleichzeitig = Math.max(hoechstensGleichzeitig, gleichzeitig)
      laeufe.push(`start ${vorlage.id}`)
      await new Promise((fertig) => setTimeout(fertig, 5))
      laeufe.push(`ende ${vorlage.id}`)
      gleichzeitig -= 1
      return { wert: `W-${vorlage.id}`, roh: undefined }
    },
  }
})

vi.mock('../../softengine/bridge', async (echte) => {
  const modul = await echte<typeof import('../../softengine/bridge')>()
  return {
    ...modul,
    bootSe: () => {},
    frischeDatenAnfordern: () => { laeufe.push('frische Daten') },
    seGlobal: () => ({ FF_RELATIONS: [] }),
  }
})

vi.mock('../../softengine/meldung', async (echte) => {
  const modul = await echte<typeof import('../../softengine/meldung')>()
  return { ...modul, meldeFehler: (text: string) => { fehler.push(text) } }
})

const { abschnitteVon, laufeSchritte, runEvent } = await import('./seAktionen')

function relationsSchritt(relationId: string, params: ActionParamBinding[] = []): RuntimeStep {
  return { type: 'RELATION', resultKey: '', relationId, params, extraParams: [] }
}

function zelle(
  quelle: 'erfassungszelle' | 'aenderungszelle' | 'loeschzelle',
  blockId: string,
): ActionParamBinding {
  return { source: quelle, value: '0', blockId }
}

const el = {
  hasAttribute: () => false,
  getAttribute: () => null,
} as unknown as HTMLElement

beforeEach(() => {
  laeufe.length = 0
  fehler.length = 0
  gleichzeitig = 0
  hoechstensGleichzeitig = 0
})

describe('abschnitteVon', () => {
  test('ein Schritt ohne Zeilenbezug haengt am laufenden Abschnitt', () => {
    const steps: RuntimeStep[] = [
      relationsSchritt('put-1', [zelle('erfassungszelle', 't1')]),
      { type: 'START_TOOL', resultKey: '', toolNr: '508', toolParams: [] },
    ]
    const abschnitte = abschnitteVon(steps)
    expect(abschnitte).toHaveLength(1)
    expect(abschnitte[0].art).toBe('erfasst')
    expect(abschnitte[0].blockId).toBe('t1')
    expect([...abschnitte[0].plaetze]).toEqual([0, 1])
  })

  test('ohne vorangehenden Abschnitt laeuft der Schritt genau einmal', () => {
    const abschnitte = abschnitteVon([
      { type: 'BW_LINK', resultKey: '', befehl: 'irgendwas' },
      relationsSchritt('put-1', [zelle('erfassungszelle', 't1')]),
    ])
    expect(abschnitte.map((a) => a.art)).toEqual(['einmal', 'erfasst'])
    expect([...abschnitte[0].plaetze]).toEqual([0])
  })

  test('verschiedene Listen werden verschiedene Abschnitte', () => {
    const abschnitte = abschnitteVon([
      relationsSchritt('put-1', [zelle('erfassungszelle', 't1')]),
      relationsSchritt('put-2', [zelle('aenderungszelle', 't1')]),
      relationsSchritt('put-3', [zelle('loeschzelle', 't1')]),
    ])
    expect(abschnitte.map((a) => a.art)).toEqual(['erfasst', 'geaendert', 'geloescht'])
  })

  test('dieselbe Liste in Folge bleibt EIN Abschnitt', () => {
    const abschnitte = abschnitteVon([
      relationsSchritt('put-1', [zelle('erfassungszelle', 't1')]),
      relationsSchritt('put-2', [zelle('erfassungszelle', 't1')]),
    ])
    expect(abschnitte).toHaveLength(1)
    expect([...abschnitte[0].plaetze]).toEqual([0, 1])
  })

  test('dieselbe Liste in ZWEI Tabellen sind zwei Abschnitte', () => {
    const abschnitte = abschnitteVon([
      relationsSchritt('put-1', [zelle('erfassungszelle', 't1')]),
      relationsSchritt('put-2', [zelle('erfassungszelle', 't2')]),
    ])
    expect(abschnitte.map((a) => a.blockId)).toEqual(['t1', 't2'])
  })

  // Zwei Listen in EINEM Schritt sind nicht entscheidbar: der Schritt kann
  // nicht gleichzeitig je erfasster und je geaenderter Zeile laufen.
  test('zwei Listen in einem Schritt sind als kaputt markiert', () => {
    const abschnitte = abschnitteVon([
      relationsSchritt('put-1', [
        zelle('erfassungszelle', 't1'),
        zelle('aenderungszelle', 't1'),
      ]),
    ])
    expect(abschnitte).toHaveLength(1)
    expect(abschnitte[0].art).not.toBe('einmal')
    expect(abschnitte[0].blockId).toBe('')
  })
})

describe('laufeSchritte', () => {
  test('laeuft streng nacheinander, nie zwei Relationen gleichzeitig', async () => {
    const steps: RuntimeStep[] = [
      relationsSchritt('get-a'),
      relationsSchritt('get-b'),
      relationsSchritt('put-c'),
    ]
    await laufeSchritte(el, steps, {}, undefined)
    expect(laeufe).toEqual([
      'start get-a', 'ende get-a',
      'start get-b', 'ende get-b',
      'start put-c', 'ende put-c',
    ])
    expect(hoechstensGleichzeitig).toBe(1)
  })

  test('nur die genannten Plaetze laufen', async () => {
    const steps: RuntimeStep[] = [
      relationsSchritt('get-a'),
      relationsSchritt('get-b'),
      relationsSchritt('get-c'),
    ]
    await laufeSchritte(el, steps, {}, undefined, new Set([1]))
    expect(laeufe).toEqual(['start get-b', 'ende get-b'])
  })

  test('geschrieben meldet nur, wer wirklich schreibt', async () => {
    expect(await laufeSchritte(el, [relationsSchritt('get-a')], {}, undefined)).toBe(false)
    expect(await laufeSchritte(el, [relationsSchritt('put-a')], {}, undefined)).toBe(true)
  })

  test('eine unbekannte Vorlage laesst den Rest der Kette laufen', async () => {
    const steps: RuntimeStep[] = [relationsSchritt(''), relationsSchritt('put-b')]
    expect(await laufeSchritte(el, steps, {}, undefined)).toBe(true)
    expect(laeufe).toEqual(['start put-b', 'ende put-b'])
  })
})

test('runEvent meldet Klartext, wenn ein Schritt zwei Listen liest', async () => {
  const kette = {
    klick: [{
      type: 'RELATION',
      resultKey: '',
      relationId: 'put-1',
      params: [zelle('erfassungszelle', 't1'), zelle('loeschzelle', 't1')],
      extraParams: [],
    }],
  }
  const mitKette = {
    hasAttribute: (name: string) => name === 'data-ff-aktionen',
    getAttribute: (name: string) => (name === 'data-ff-aktionen' ? JSON.stringify(kette) : null),
  } as unknown as HTMLElement
  await runEvent(mitKette, 'klick', {})
  expect(fehler).toEqual([
    'Ein Schritt liest Zellen aus zwei verschiedenen Listen — das geht nicht.',
  ])
  expect(laeufe).toEqual([])
})
