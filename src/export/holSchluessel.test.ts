import { expect, test } from 'vitest'
import '../blocks/register'
import { ROOT_ID, ROOT_TYPE, type BlockTree } from '../core/blocks/BlockData'
import type { DataSource } from '../core/data/dataSources'
import { holSchluesselJeGeber } from './benutzteQuellen'

// Woher eine holende Quelle ihren Beleg nimmt, steht am BAUSTEIN. Der Export
// muss die Schluesselfelder trotzdem bei der Geber-Quelle bestellen, sonst ginge
// der Parameter der Relation leer hinaus.

const belege: DataSource = {
  id: 'q-bel',
  name: 'Belege',
  kind: 'beleg',
  fields: [{ code: '3_8', label: 'Belegnummer' }],
}

const positionen: DataSource = {
  id: 'q-pos',
  name: 'Positionen',
  kind: 'belegposition',
  ladeRelation: {
    nr: '69',
    belegartFeld: '2_1',
    belegnummerFeld: '3_8',
    jahrFeld: '0_1',
    archivFeld: '',
    endeFelder: ['11_6'],
  },
  fields: [{ code: '18_25', label: 'Artikelnummer' }],
}

function baum(folge: unknown): BlockTree {
  return {
    [ROOT_ID]: {
      id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: '', childIds: ['bel', 'pos'],
    },
    bel: {
      id: 'bel', type: 'tabelle', props: { source: 'q-bel' }, parentId: ROOT_ID, childIds: [],
    },
    pos: {
      id: 'pos',
      type: 'tabelle',
      props: { source: 'q-pos', folgtAuswahl: folge },
      parentId: ROOT_ID,
      childIds: [],
    },
  } as unknown as BlockTree
}

test('die Schluesselfelder werden bei der Quelle des Geber-Bausteins bestellt', () => {
  const proGeber = holSchluesselJeGeber(
    baum([{ geberId: 'bel', keyPairs: [] }]),
    [belege, positionen],
  )
  // Ohne Archivfeld: ein leerer Code wird nicht bestellt.
  expect(proGeber.get('q-bel')).toEqual(['2_1', '3_8', '0_1'])
})

test('ohne Auswahl-Geber bestellt niemand etwas', () => {
  expect(holSchluesselJeGeber(baum([]), [belege, positionen]).size).toBe(0)
})

test('Feldpaare sind fuer die Bestellung gleichgueltig', () => {
  const mitPaaren = holSchluesselJeGeber(
    baum([{ geberId: 'bel', keyPairs: [{ fromField: '3_8', toField: '3_8' }] }]),
    [belege, positionen],
  )
  expect(mitPaaren.get('q-bel')).toEqual(['2_1', '3_8', '0_1'])
})
