import { expect, test } from 'vitest'
import { type RuntimeTableElement } from './seRuntime'
import { aktiviereZeile } from './zeilenEreignisse'

function dummyTable(auswahlIndex = -1): RuntimeTableElement {
  const attrs: Record<string, string> = { 'data-ff-block-id': 'test-tabelle' }
  const el = {
    tagName: 'FF-TABELLE',
    auswahlIndex,
    getAttribute: (name: string) => attrs[name] ?? null,
    hasAttribute: (name: string) => name in attrs,
    dispatchEvent: () => true,
  } as unknown as RuntimeTableElement
  return el
}

test('erster Klick auf eine Zeile markiert sie', () => {
  const table = dummyTable(-1)
  const rows = [{ id: 1 }, { id: 2 }]
  aktiviereZeile(table, rows, 0, 0)
  expect(table.auswahlIndex).toBe(0)
})

test('Klick auf eine andere Zeile wechselt die Auswahl', () => {
  const table = dummyTable(0)
  const rows = [{ id: 1 }, { id: 2 }]
  aktiviereZeile(table, rows, 1, 1)
  expect(table.auswahlIndex).toBe(1)
})

test('zweiter Klick auf dieselbe Zeile hebt die Auswahl auf (ausklicken)', () => {
  const table = dummyTable(0)
  const rows = [{ id: 1 }, { id: 2 }]
  aktiviereZeile(table, rows, 0, 0)
  expect(table.auswahlIndex).toBe(-1)
})

test('Klick ins Eingabefeld einer bereits gewaehlten Zeile deselektiert nicht', () => {
  const table = dummyTable(0)
  const rows = [{ id: 1 }, { id: 2 }]
  aktiviereZeile(table, rows, 0, 0, true)
  expect(table.auswahlIndex).toBe(0)
})

test('Klick ins Eingabefeld einer noch ungewaehlten Zeile markiert sie', () => {
  const table = dummyTable(-1)
  const rows = [{ id: 1 }, { id: 2 }]
  aktiviereZeile(table, rows, 1, 1, true)
  expect(table.auswahlIndex).toBe(1)
})
