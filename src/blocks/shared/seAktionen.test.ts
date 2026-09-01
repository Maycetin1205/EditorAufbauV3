import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { ActionParamBinding, RuntimeStep } from '../../core/data/aktionen'
import type { VormerkArt } from '../../core/blocks/BlockDefinition'

const laeufe: string[] = []
const fehler: string[] = []
const gerufen: { id: string; params: string[] }[] = []
let gleichzeitig = 0
let hoechstensGleichzeitig = 0

// Der Ruf kommt nicht durch, wenn die Vorlage so heisst oder ein Parameter so
// lautet. Das Zweite ist der Weg, EINE Zeile scheitern zu lassen: die Kette
// ist fuer jede Zeile dieselbe, verschieden sind nur die Zellwerte.
const KAPUTT = 'FEHLER'

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
    resolveActionParam: (
      binding: { source: string; value: string; blockId?: string },
      werte: {
        context: Record<string, string | undefined>
        zeilenZelle?: (blockId: string, spalte: number) => string
        stepResults?: readonly string[]
        previousResult?: string
      },
    ) => {
      if (binding.source === 'context') return werte.context[binding.value] ?? ''
      if (binding.source.endsWith('zelle')) {
        return werte.zeilenZelle?.(binding.blockId ?? '', Number(binding.value)) ?? ''
      }
      if (binding.source === 'step_result') {
        return werte.stepResults?.[Number(binding.value)] ?? ''
      }
      if (binding.source === 'previous_result') return werte.previousResult ?? ''
      return binding.value
    },
    executeRelation: async (vorlage: { id: string }, params: readonly string[]) => {
      gleichzeitig += 1
      hoechstensGleichzeitig = Math.max(hoechstensGleichzeitig, gleichzeitig)
      laeufe.push(`start ${vorlage.id}`)
      gerufen.push({ id: vorlage.id, params: [...params] })
      await new Promise((fertig) => setTimeout(fertig, 5))
      laeufe.push(`ende ${vorlage.id}`)
      gleichzeitig -= 1
      if (vorlage.id.startsWith('kaputt') || params.includes(KAPUTT)) {
        return { wert: '', roh: undefined, fehler: 'Nicht durchgekommen' }
      }
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

function ausKontext(name: string): ActionParamBinding {
  return { source: 'context', value: name }
}

const el = {
  hasAttribute: () => false,
  getAttribute: () => null,
} as unknown as HTMLElement

// Eine Tabelle, wie die Kette sie sieht: eine Vormerk-Liste und der
// Lauf-Bericht. Mehr braucht runEvent von einem Baustein nicht. Die Kennung
// einer Zeile steht zugleich in ihrer ersten Zelle — so kann der Test sagen,
// WELCHE Zeile haengen bleibt.
interface Attrappe {
  el: HTMLElement
  bericht: string[]
  offen: () => readonly string[]
}

function tabelle(blockId: string, art: VormerkArt, kennungen: readonly string[]): Attrappe {
  let liste = [...kennungen]
  const bericht: string[] = []
  const zeilen = (): { satz: string; werte: readonly string[] }[] =>
    liste.map((k) => ({ satz: k, werte: [k] }))
  const traeger = {
    getAttribute: (name: string) => (name === 'data-ff-block-id' ? blockId : null),
    get erfassteZeilen(): string[][] | undefined {
      return art === 'erfasst' ? liste.map((k) => [k]) : undefined
    },
    get erfassteSchluessel(): string[] | undefined {
      return art === 'erfasst' ? [...liste] : undefined
    },
    get geaenderteZeilen(): { satz: string; werte: readonly string[] }[] | undefined {
      return art === 'geaendert' ? zeilen() : undefined
    },
    get geloeschteZeilen(): { satz: string; werte: readonly string[] }[] | undefined {
      return art === 'geloescht' ? zeilen() : undefined
    },
    zeileSchreibt: (a: VormerkArt, k: string) => { bericht.push(`schreibt ${a} ${k}`) },
    zeileGescheitert: (a: VormerkArt, k: string, m: string) => {
      bericht.push(`fehler ${a} ${k} ${m}`)
    },
    laufFertig: (a: VormerkArt, fertig: readonly string[]) => {
      bericht.push(`fertig ${a} [${fertig.join(',')}]`)
      liste = liste.filter((k) => !fertig.includes(k))
    },
  }
  return {
    el: traeger as unknown as HTMLElement,
    bericht,
    offen: () => liste,
  }
}

function knopf(kette: Record<string, RuntimeStep[]>, traeger: Attrappe): HTMLElement {
  return {
    hasAttribute: (name: string) => name === 'data-ff-aktionen',
    getAttribute: (name: string) => (name === 'data-ff-aktionen' ? JSON.stringify(kette) : null),
    ownerDocument: { querySelectorAll: () => [traeger.el] },
  } as unknown as HTMLElement
}

beforeEach(() => {
  laeufe.length = 0
  fehler.length = 0
  gerufen.length = 0
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
    const gelesen = await laufeSchritte(el, [relationsSchritt('get-a')], {}, undefined)
    const geschrieben = await laufeSchritte(el, [relationsSchritt('put-a')], {}, undefined)
    expect(gelesen).toMatchObject({ geschrieben: false, fehler: '' })
    expect(geschrieben).toMatchObject({ geschrieben: true, fehler: '' })
  })

  // Ein Schritt ohne Vorlage kann nichts tun. Weiterzulaufen hiesse, die
  // Schritte dahinter auf ein Ergebnis zu setzen, das nie kam — still.
  test('eine unbekannte Vorlage stoppt die Kette mit Meldung', async () => {
    const steps: RuntimeStep[] = [relationsSchritt(''), relationsSchritt('put-b')]
    const ergebnis = await laufeSchritte(el, steps, {}, undefined)
    expect(ergebnis.geschrieben).toBe(false)
    expect(ergebnis.fehler).toContain('Relation fehlt')
    expect(laeufe).toEqual([])
  })

  // Ein PUT mit leerem {PINDEX} schriebe ins Nichts — und meldet das nie.
  test('ein Schritt mit {PINDEX} laeuft nicht ohne Satznummer', async () => {
    const steps: RuntimeStep[] = [
      relationsSchritt('put-a', [{ source: 'context', value: 'PINDEX' }]),
      relationsSchritt('put-b'),
    ]
    const ohne = await laufeSchritte(el, steps, {}, undefined)
    expect(ohne.geschrieben).toBe(false)
    expect(ohne.fehler).toContain('Satznummer')
    expect(laeufe).toEqual([])

    const mit = await laufeSchritte(el, steps, { PINDEX: '48' }, undefined)
    expect(mit.fehler).toBe('')
    expect(gerufen.map((g) => g.params)).toEqual([['48'], []])
  })

  // Ein Werkzeugstart, der nie hinausgeht, darf nicht als gelaufen gelten —
  // sonst schreibt der Schritt dahinter, als stuende das Werkzeug schon.
  test('START_TOOL ohne Bruecke stoppt die Kette mit Meldung', async () => {
    const steps: RuntimeStep[] = [
      { type: 'START_TOOL', resultKey: '', toolNr: '508', toolParams: [] },
      relationsSchritt('put-b'),
    ]
    const ergebnis = await laufeSchritte(el, steps, {}, undefined)
    expect(ergebnis.fehler).toContain('START_TOOL 508')
    expect(fehler.at(-1)).toContain('SoftEngine')
    expect(gerufen).toEqual([])
  })

  // Weiterlaufen hiesse, die naechsten Schritte auf ein Ergebnis zu setzen,
  // das es nicht gibt.
  test('ein nicht durchgekommener Ruf stoppt die restlichen Schritte', async () => {
    const steps: RuntimeStep[] = [relationsSchritt('kaputt-put'), relationsSchritt('put-b')]
    expect(await laufeSchritte(el, steps, {}, undefined))
      .toMatchObject({ geschrieben: true, fehler: 'Nicht durchgekommen' })
    expect(laeufe).toEqual(['start kaputt-put', 'ende kaputt-put'])
  })
})

describe('Lauf-Bericht je Zeile', () => {
  test('alle Zeilen durch: jede gemeldet, alle ausgetragen, frische Daten', async () => {
    const t = tabelle('t1', 'geaendert', ['48', '49'])
    const kette = { klick: [relationsSchritt('put-1', [zelle('aenderungszelle', 't1')])] }
    await runEvent(knopf(kette, t), 'klick', {})
    expect(t.bericht).toEqual([
      'schreibt geaendert 48',
      'schreibt geaendert 49',
      'fertig geaendert [48,49]',
    ])
    expect(t.offen()).toEqual([])
    expect(laeufe.at(-1)).toBe('frische Daten')
  })

  // Der Kern von Etappe 3: ein Fehler in Zeile 2 von 3 darf den Zeilen 2 und 3
  // nicht ihre Vormerkung nehmen — sonst waere die Eingabe verloren.
  test('Fehler stoppt den Lauf, die Zeilen dahinter bleiben vorgemerkt', async () => {
    const t = tabelle('t1', 'erfasst', ['e1', KAPUTT, 'e3'])
    const kette = { klick: [relationsSchritt('put-1', [zelle('erfassungszelle', 't1')])] }
    await runEvent(knopf(kette, t), 'klick', {})
    expect(t.bericht).toEqual([
      'schreibt erfasst e1',
      `schreibt erfasst ${KAPUTT}`,
      `fehler erfasst ${KAPUTT} Nicht durchgekommen`,
      'fertig erfasst [e1]',
    ])
    expect(t.offen()).toEqual([KAPUTT, 'e3'])
    // Zeile 3 kam nie an die Reihe.
    expect(gerufen.map((r) => r.params[0])).toEqual(['e1', KAPUTT])
  })

  test('leere Liste: kein Lauf, kein Bericht, kein Fehler', async () => {
    const t = tabelle('t1', 'geloescht', [])
    const kette = { klick: [relationsSchritt('put-1', [zelle('loeschzelle', 't1')])] }
    await runEvent(knopf(kette, t), 'klick', {})
    expect(t.bericht).toEqual([])
    expect(laeufe).toEqual([])
    expect(fehler).toEqual([])
  })
})

// Der Bediener soll den Unterschied zwischen den Platzhalter-Namen zweier
// Relationen nicht kennen muessen: beim Loeschen traegt die Satznummer beide.
test('die Loeschzeile fuellt PINDEX UND DROP_PINDEX', async () => {
  const t = tabelle('t1', 'geloescht', ['48'])
  const kette = {
    klick: [relationsSchritt('put-weg', [
      zelle('loeschzelle', 't1'),
      ausKontext('PINDEX'),
      ausKontext('DROP_PINDEX'),
    ])],
  }
  await runEvent(knopf(kette, t), 'klick', {})
  expect(gerufen).toEqual([{ id: 'put-weg', params: ['48', '48', '48'] }])
})

// Eine geaenderte Zeile kennt DROP_PINDEX nicht: der Platzhalter gehoert der
// Loeschung, und ein leerer Parameter ist besser als ein falscher.
test('eine geaenderte Zeile fuellt nur PINDEX', async () => {
  const t = tabelle('t1', 'geaendert', ['48'])
  const kette = {
    klick: [relationsSchritt('put-1', [
      zelle('aenderungszelle', 't1'),
      ausKontext('PINDEX'),
      ausKontext('DROP_PINDEX'),
    ])],
  }
  await runEvent(knopf(kette, t), 'klick', {})
  expect(gerufen).toEqual([{ id: 'put-1', params: ['48', '48', ''] }])
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

// Der Fall aus der Belegerfassung: einmal die Belegnummer holen, dann je
// erfasster Zeile eine Position schreiben. Frueher baute jeder Abschnitt seine
// Ergebnisliste neu auf — der Schreib-Schritt bekam fuer „Ergebnis von
// Schritt 1" einen leeren String, still, mit leerem Parameter im PUT.
describe('Ergebnisse ueber die Abschnittsgrenze', () => {
  function ausSchritt(platz: number): ActionParamBinding {
    return { source: 'step_result', value: String(platz) }
  }

  test('ein Einmal-GET liefert seinen Wert an die Zeilen-Schritte', async () => {
    const t = tabelle('t1', 'erfasst', ['z1', 'z2'])
    const kette = {
      klick: [
        relationsSchritt('get-nummer'),
        relationsSchritt('put-pos', [ausSchritt(0), zelle('erfassungszelle', 't1')]),
      ],
    }
    await runEvent(knopf(kette, t), 'klick', {})

    expect(gerufen.map((r) => r.id)).toEqual(['get-nummer', 'put-pos', 'put-pos'])
    expect(gerufen[1].params).toEqual(['W-get-nummer', 'z1'])
    expect(gerufen[2].params).toEqual(['W-get-nummer', 'z2'])
  })

  test('auch der resultKey eines Einmal-Schritts gilt weiter', async () => {
    const t = tabelle('t1', 'erfasst', ['z1'])
    const kette = {
      klick: [
        { ...relationsSchritt('get-nummer'), resultKey: 'BELNR' },
        relationsSchritt('put-pos', [ausKontext('BELNR'), zelle('erfassungszelle', 't1')]),
      ],
    }
    await runEvent(knopf(kette, t), 'klick', {})

    expect(gerufen[1].params).toEqual(['W-get-nummer', 'z1'])
  })

  // Innerhalb EINER Zeile darf ein GET seinen Wert an den PUT geben.
  test('in einem Zeilen-Abschnitt gilt das Ergebnis fuer dieselbe Zeile', async () => {
    const t = tabelle('t1', 'erfasst', ['z1', 'z2'])
    const kette = {
      klick: [
        relationsSchritt('get-je-zeile', [zelle('erfassungszelle', 't1')]),
        relationsSchritt('put-pos', [ausSchritt(0)]),
      ],
    }
    await runEvent(knopf(kette, t), 'klick', {})

    expect(gerufen.map((r) => r.id))
      .toEqual(['get-je-zeile', 'put-pos', 'get-je-zeile', 'put-pos'])
    expect(gerufen[1].params).toEqual(['W-get-je-zeile'])
    expect(gerufen[3].params).toEqual(['W-get-je-zeile'])
  })

  // Und er bleibt DORT: ein spaeterer Abschnitt (hier die Aenderungen) darf
  // nicht mit dem Ergebnis weiterrechnen, das eine erfasste Zeile erarbeitet
  // hat. Sonst haengt der zweite Abschnitt an einer beliebigen Zeile des
  // ersten — an der letzten, die zufaellig durchlief.
  test('ein spaeterer Abschnitt erbt die Zeilen-Ergebnisse nicht', async () => {
    const erfasst = tabelle('t1', 'erfasst', ['z1'])
    const geaendert = tabelle('t2', 'geaendert', ['g1'])
    const kette = {
      klick: [
        relationsSchritt('get-je-zeile', [zelle('erfassungszelle', 't1')]),
        relationsSchritt('put-aend', [ausSchritt(0), zelle('aenderungszelle', 't2')]),
      ],
    }
    const el2 = {
      hasAttribute: (name: string) => name === 'data-ff-aktionen',
      getAttribute: (name: string) => (name === 'data-ff-aktionen' ? JSON.stringify(kette) : null),
      ownerDocument: { querySelectorAll: () => [erfasst.el, geaendert.el] },
    } as unknown as HTMLElement
    await runEvent(el2, 'klick', {})

    const aenderung = gerufen.find((r) => r.id === 'put-aend')
    expect(aenderung?.params).toEqual(['', 'g1'])
  })

  test('ein uebersprungener Schritt loescht das Ergebnis an seinem Platz nicht', async () => {
    const t = tabelle('t1', 'erfasst', ['z1'])
    const kette = {
      klick: [
        relationsSchritt('get-eins'),
        relationsSchritt('get-zwei'),
        relationsSchritt('put-pos', [ausSchritt(0), ausSchritt(1), zelle('erfassungszelle', 't1')]),
      ],
    }
    await runEvent(knopf(kette, t), 'klick', {})

    expect(gerufen[2].params).toEqual(['W-get-eins', 'W-get-zwei', 'z1'])
  })
})
