import { expect, test } from 'vitest'
import { FormFeldBlock } from './FormFeldBlock'
import { exportMask } from '../../export/exportMask'
import type { BlockTree } from '../../core/blocks/BlockData'

test('FormFeldBlock hat standardmäßig darstellung standard', () => {
  const feld = new FormFeldBlock()
  expect(feld.darstellung).toBe('standard')
  expect(FormFeldBlock.defaultProps.darstellung).toBe('standard')
})

test('FormFeldBlock customProperties enthaelt darstellung', () => {
  const prop = FormFeldBlock.customProperties.find((p) => p.attributeName === 'darstellung')
  expect(prop).toBeDefined()
  expect(prop?.kind).toBe('select')
  expect(prop?.options).toEqual([
    { value: 'standard', label: 'Standard (Kasten)' },
    { value: 'linie', label: 'Linie (Unterstrichen)' },
  ])
})

test('exportMask exportiert darstellung="linie" wenn abweichend von standard', () => {
  const tree: BlockTree = {
    root: {
      id: 'root',
      type: 'root',
      props: {},
      parentId: null,
      childIds: ['f1'],
    },
    f1: {
      id: 'f1',
      type: 'formfeld',
      props: {
        width: 240,
        fieldType: 'text',
        placeholder: 'Unterschrift',
        darstellung: 'linie',
      },
      parentId: 'root',
      childIds: [],
    },
  }

  const { html } = exportMask(tree, 'Test Maske')
  expect(html).toContain('darstellung="linie"')
})
