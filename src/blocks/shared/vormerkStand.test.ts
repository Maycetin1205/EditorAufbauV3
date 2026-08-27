import { expect, test } from 'vitest'
import type { ActionParamBinding, RuntimeStep } from '../../core/data/aktionen'
import {
  VORMERK_EVENT,
  meldeVormerkungen,
  vormerkStandVon,
  vormerkSumme,
  vormerkText,
} from './vormerkStand'

function zelle(
  quelle: 'erfassungszelle' | 'aenderungszelle' | 'loeschzelle',
  blockId: string,
): ActionParamBinding {
  return { source: quelle, value: '0', blockId }
}

function schritt(relationId: string, params: ActionParamBinding[]): RuntimeStep {
  return { type: 'RELATION', resultKey: '', relationId, params, extraParams: [] }
}

interface Listen {
  erfasst?: number
  geaendert?: number
  geloescht?: number
}

function tabelle(blockId: string, listen: Listen): HTMLElement {
  const leer = (n: number | undefined): string[][] | undefined =>
    (n === undefined ? undefined : Array.from({ length: n }, () => []))
  return {
    getAttribute: (name: string) => (name === 'data-ff-block-id' ? blockId : null),
    erfassteZeilen: leer(listen.erfasst),
    geaenderteZeilen: leer(listen.geaendert),
    geloeschteZeilen: leer(listen.geloescht),
  } as unknown as HTMLElement
}

function knopf(kette: Record<string, RuntimeStep[]>, tabellen: HTMLElement[]): HTMLElement {
  return {
    getAttribute: (name: string) => (name === 'data-ff-aktionen' ? JSON.stringify(kette) : null),
    ownerDocument: { querySelectorAll: () => tabellen },
  } as unknown as HTMLElement
}

test('vormerkText zaehlt Zeilen und nennt sie beim Namen', () => {
  expect(vormerkText(0, 0, 0)).toBe('')
  expect(vormerkText(1, 0, 0)).toBe('1 neue Zeile vorgemerkt')
  expect(vormerkText(0, 2, 0)).toBe('2 geänderte Zeilen vorgemerkt')
  expect(vormerkText(0, 0, 1)).toBe('1 Löschung vorgemerkt')
  expect(vormerkText(2, 1, 3))
    .toBe('2 neue Zeilen, 1 geänderte Zeile, 3 Löschungen vorgemerkt')
})

// Ein gewoehnlicher Knopf bleibt gewoehnlich: kein Zaehler, kein Ausgrauen.
test('eine Kette ohne Vormerk-Listen liefert nichts', () => {
  const t = tabelle('t1', { erfasst: 3 })
  const kette = { onClick: [schritt('put-1', [{ source: 'fixed', value: 'x' }])] }
  expect(vormerkStandVon(knopf(kette, [t]), 'onClick')).toBeUndefined()
})

test('ohne Kette liefert der Knopf nichts', () => {
  const ohne = { getAttribute: () => null } as unknown as HTMLElement
  expect(vormerkStandVon(ohne, 'onClick')).toBeUndefined()
})

test('gezaehlt wird, was die Kette dieses Knopfes wirklich schreibt', () => {
  const t = tabelle('t1', { erfasst: 2, geaendert: 1, geloescht: 4 })
  const kette = {
    onClick: [
      schritt('put-neu', [zelle('erfassungszelle', 't1')]),
      schritt('put-weg', [zelle('loeschzelle', 't1')]),
    ],
  }
  const stand = vormerkStandVon(knopf(kette, [t]), 'onClick')
  // Die geaenderte Zeile steht in keinem Abschnitt — der Knopf schreibt sie
  // nicht und zaehlt sie darum auch nicht mit.
  expect(stand).toEqual({ erfasst: 2, geaendert: 0, geloescht: 4 })
  expect(vormerkSumme(stand!)).toBe(6)
})

// Dieselbe Liste kann in zwei Abschnitten stehen (erst anlegen, dann
// nachtragen). Doppelt gezaehlt waere die Zahl doppelt so hoch wie die Arbeit.
test('dieselbe Liste in zwei Abschnitten zaehlt einmal', () => {
  const t = tabelle('t1', { erfasst: 2, geaendert: 1 })
  const kette = {
    onClick: [
      schritt('put-a', [zelle('erfassungszelle', 't1')]),
      schritt('put-b', [zelle('aenderungszelle', 't1')]),
      schritt('put-c', [zelle('erfassungszelle', 't1')]),
    ],
  }
  expect(vormerkStandVon(knopf(kette, [t]), 'onClick'))
    .toEqual({ erfasst: 2, geaendert: 1, geloescht: 0 })
})

test('zwei Tabellen an einem Knopf werden zusammengezaehlt', () => {
  const eins = tabelle('t1', { erfasst: 2 })
  const zwei = tabelle('t2', { erfasst: 3 })
  const kette = {
    onClick: [
      schritt('put-a', [zelle('erfassungszelle', 't1')]),
      schritt('put-b', [zelle('erfassungszelle', 't2')]),
    ],
  }
  expect(vormerkStandVon(knopf(kette, [eins, zwei]), 'onClick'))
    .toEqual({ erfasst: 5, geaendert: 0, geloescht: 0 })
})

// Gemeldet wird bei jedem Rendern — und das passiert bei jedem Tastendruck in
// einer aenderbaren Zelle. Ohne den Vergleich haette der Knopf pro Anschlag
// ein Ereignis zu verarbeiten.
test('gemeldet wird nur, wenn sich die Zahl wirklich geaendert hat', () => {
  let anzahl = 0
  const gesendet: string[] = []
  const el = {
    get geaenderteZeilen(): string[][] { return Array.from({ length: anzahl }, () => []) },
    dispatchEvent: (e: Event) => { gesendet.push(e.type); return true },
  } as unknown as HTMLElement
  meldeVormerkungen(el)
  meldeVormerkungen(el)
  anzahl = 1
  meldeVormerkungen(el)
  meldeVormerkungen(el)
  expect(gesendet).toEqual([VORMERK_EVENT, VORMERK_EVENT])
})
