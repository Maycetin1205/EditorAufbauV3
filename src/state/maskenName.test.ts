import { expect, test } from 'vitest'
import { ROOT_ID } from '../core/blocks/BlockData'
import { MASKEN_NAME_PROP, MASKEN_NAME_STANDARD, maskenNameVon } from '../core/blocks/maskenName'
import { sanitizeTree } from './ladeKette'
import { createEmptyTree } from './treeOps'

test('ohne Namen heisst die Maske wie bisher', () => {
  expect(maskenNameVon(createEmptyTree())).toBe(MASKEN_NAME_STANDARD)
})

test('der Maskenname ueberlebt Speichern und Laden', () => {
  const roh = {
    [ROOT_ID]: { type: 'root', props: { [MASKEN_NAME_PROP]: 'Behandlung' }, childIds: [] },
  }
  expect(maskenNameVon(sanitizeTree(roh))).toBe('Behandlung')
})

test('ein leerer Name faellt auf die Vorgabe zurueck', () => {
  const roh = {
    [ROOT_ID]: { type: 'root', props: { [MASKEN_NAME_PROP]: '   ' }, childIds: [] },
  }
  expect(maskenNameVon(sanitizeTree(roh))).toBe(MASKEN_NAME_STANDARD)
})
