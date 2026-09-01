import { expect, test } from 'vitest'
import '../blocks/tabelle/TabelleBlock'
import '../blocks/button/ButtonBlock'
import { ROOT_ID, type BlockTree } from '../core/blocks/BlockData'
import { getBlockDefinition } from '../core/blocks/blockRegistry'
import type { RelationStep } from '../core/data/aktionen'
import { Editor } from './Editor'
import { gestricheneKennungen, ohneSpaltenZeiger } from './spaltenAufraeumen'

// Ketten-Parameter zeigen auf eine Spalte ueber ihre dauerhafte Kennung. Wird
// die Spalte geloescht, sieht der Bediener davon nichts: der Export macht aus
// der unbekannten Kennung den Platz -1 und die Laufzeit schreibt einen
// Leerstring ins ERP. Darum wird der Zeiger beim Loeschen abgeraeumt.

const SPALTEN = [
  { kennung: 's1', titel: 'Artikel', feld: '18_25' },
  { kennung: 's2', titel: 'Menge', feld: '164_8' },
  { kennung: 's3', titel: 'Tage', feld: '933_3' },
]

function baum(kennung: string, blockId = 't1'): BlockTree {
  return {
    [ROOT_ID]: {
      id: ROOT_ID, type: 'tabelle', props: {}, parentId: null, childIds: ['k1'],
    },
    k1: {
      id: 'k1',
      type: 'button',
      props: {},
      parentId: ROOT_ID,
      childIds: [],
      events: {
        onClick: [{
          id: 'st1',
          type: 'RELATION',
          resultKey: '',
          relationId: 'r1',
          params: [{ source: 'erfassungszelle', value: kennung, blockId }],
          extraParams: [],
        }],
      },
    },
  }
}

function parameter(tree: BlockTree): { source: string; value: string } {
  const schritt = tree.k1.events?.onClick[0] as RelationStep
  const b = schritt.params[0]
  return { source: b.source, value: b.value }
}

const TABELLE = getBlockDefinition('tabelle')

test('die geloeschte Kennung wird als gestrichen erkannt', () => {
  expect(gestricheneKennungen(TABELLE, 'spalten', SPALTEN, SPALTEN.slice(0, 2))).toEqual(['s3'])
})

test('Umbenennen oder Verschieben streicht keine Kennung', () => {
  const umbenannt = [{ ...SPALTEN[0], titel: 'Ware' }, SPALTEN[2], SPALTEN[1]]
  expect(gestricheneKennungen(TABELLE, 'spalten', SPALTEN, umbenannt)).toEqual([])
})

test('eine andere Eigenschaft streicht nie eine Kennung', () => {
  expect(gestricheneKennungen(TABELLE, 'leerText', SPALTEN, '')).toEqual([])
})

test('der Ketten-Parameter der geloeschten Spalte steht danach auf aus', () => {
  const tree = ohneSpaltenZeiger(baum('s3'), 't1', ['s3'])
  expect(parameter(tree)).toEqual({ source: 'aus', value: '' })
})

test('ein Parameter auf eine gebliebene Spalte bleibt stehen', () => {
  const tree = ohneSpaltenZeiger(baum('s1'), 't1', ['s3'])
  expect(parameter(tree)).toEqual({ source: 'erfassungszelle', value: 's1' })
})

// Zwei Tabellen koennen dieselbe Kennung tragen — die Kennung gilt je
// Baustein, nicht je Maske.
test('eine gleichnamige Kennung an einer anderen Tabelle bleibt stehen', () => {
  const tree = ohneSpaltenZeiger(baum('s3', 't2'), 't1', ['s3'])
  expect(parameter(tree)).toEqual({ source: 'erfassungszelle', value: 's3' })
})

// Und dasselbe durch die Tuer, durch die es im Betrieb kommt: der Baustein
// meldet die neue Spaltenliste als Eigenschafts-Aenderung, sonst nichts.
test('ueber den Store: das Loeschen der Spalte raeumt die Kette ab', () => {
  const editor = new Editor()
  const tabelle = editor.addBlock('tabelle')
  const knopf = editor.addBlock('button')
  if (!tabelle || !knopf) throw new Error('Bausteine fehlen')

  editor.updateProperty(tabelle.id, 'spalten', SPALTEN)
  editor.updateBlockEvents(knopf.id, {
    onClick: [{
      id: 'st1',
      type: 'RELATION',
      resultKey: '',
      relationId: 'r1',
      params: [{ source: 'erfassungszelle', value: 's3', blockId: tabelle.id }],
      extraParams: [],
    }],
  })

  editor.updateProperty(tabelle.id, 'spalten', SPALTEN.slice(0, 2))

  const schritt = editor.tree[knopf.id].events?.onClick[0] as RelationStep
  expect(schritt.params[0]).toEqual({ source: 'aus', value: '' })
})
