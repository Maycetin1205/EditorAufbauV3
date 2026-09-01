import { ROOT_ID, ROOT_TYPE, type BlockNode, type BlockTree } from '../../core/blocks/BlockData'
import type { DataSource } from '../../core/data/dataSources'
import type { RelationTemplate } from '../../core/data/relations'
import type { ActionStep } from '../../core/data/aktionen'
import { WEITERE_QUELLEN_PROP } from '../../core/data/sourceLinks'

// Die feste Referenzmaske des Referenzabzugs: jeder Bausteintyp einmal,
// dazu gebundene Spalten, Hilfsquelle, Erfassung und eine Kette mit allen
// Schritt-Arten. Feste Kennungen — der Export muss byte-gleich bleiben.

export const REFERENZ_QUELLEN: readonly DataSource[] = [
  {
    id: 'q-pos',
    name: 'Belegpositionen',
    kind: 'belegposition',
    indexField: '645_10',
    fields: [
      { code: '18_25', label: 'ArtNr' },
      { code: '45_60', label: 'Bezeichnung' },
      { code: '164_8', label: 'Menge' },
    ],
  },
  {
    id: 'q-art',
    name: 'Artikelstamm',
    kind: 'artikelstamm',
    fields: [
      { code: 'bez', label: 'Bezeichnung' },
      { code: 'einheit', label: 'Einheit' },
    ],
  },
]

export const REFERENZ_RELATIONEN: readonly RelationTemplate[] = [
  {
    id: 'r-get',
    name: 'Positionsfeld lesen',
    verb: 'GET_RELATION',
    nr: '69',
    params: ['BELART', 'POS', 'LEN', 'BELNR'],
  },
  {
    id: 'r-put',
    name: 'Feld schreiben',
    verb: 'PUT_RELATION',
    nr: '174',
    params: ['{PINDEX}', '45_60', 'L', ''],
    allowExtraParams: true,
  },
]

const KETTE: ActionStep[] = [
  {
    id: 's0',
    type: 'RELATION',
    resultKey: 'gelesen',
    relationId: 'r-get',
    params: [
      { source: 'fixed', value: 'R' },
      { source: 'fixed', value: '0' },
      { source: 'fixed', value: '255' },
      { source: 'previous_result', value: '' },
    ],
    extraParams: [],
  },
  {
    id: 's1',
    type: 'RELATION',
    resultKey: '',
    relationId: 'r-put',
    params: [
      { source: 'context', value: 'PINDEX' },
      { source: 'erfassungszelle', value: 'sp-menge', blockId: 't1' },
      { source: 'fixed', value: 'L' },
      { source: 'step_result', value: 's0' },
    ],
    extraParams: [{ source: 'fixed', value: 'X' }],
  },
  { id: 's2', type: 'START_TOOL', resultKey: '', toolNr: '42', toolParams: ['a b'] },
  { id: 's3', type: 'BW_LINK', resultKey: '', befehl: '0,REFRESH' },
  { id: 's4', type: 'POPUP_OPEN', resultKey: '', popupId: 'p1' },
]

function knoten(
  id: string,
  type: string,
  parentId: string,
  props: Record<string, unknown>,
  childIds: string[] = [],
): BlockNode {
  return { id, type, props, parentId, childIds }
}

export function referenzBaum(): BlockTree {
  const tree: BlockTree = {
    [ROOT_ID]: knoten(ROOT_ID, ROOT_TYPE, '', {}, [
      't1', 'f1', 'b1', 'c1', 'k1', 'n1', 'tx1', 'bi1', 'd1', 'tr1', 'p1',
    ]),
    t1: knoten('t1', 'tabelle', ROOT_ID, {
      source: 'q-pos',
      [WEITERE_QUELLEN_PROP]: [{ quelleId: 'q-art', partnerId: '', keyPairs: [] }],
      spalten: [
        { kennung: 'sp-art', titel: 'ArtNr', feld: '18_25', art: 'text' },
        { kennung: 'sp-bez', titel: 'Bezeichnung', feld: '45_60', art: 'text', fuellFeld: 'q-art::bez' },
        { kennung: 'sp-menge', titel: 'Menge', feld: '164_8', art: 'text', aenderbar: true },
      ],
      erfassung: 'ja',
      loeschbar: 'ja',
    }),
    f1: knoten('f1', 'formfeld', ROOT_ID, {
      fieldType: 'text',
      placeholder: 'Bezeichnung',
      source: 'q-pos',
      valueField: '45_60',
    }),
    b1: knoten('b1', 'button', ROOT_ID, { label: 'Schreiben' }),
    c1: knoten('c1', 'card', ROOT_ID, { heading: 'Karte', headingField: '45_60' }),
    k1: knoten('k1', 'kanban', ROOT_ID, { source: 'q-pos', statusField: '18_25' }, ['ks1']),
    ks1: knoten('ks1', 'kanban-spalte', 'k1', { heading: 'Offen', variant: 'info' }, ['kz1']),
    kz1: knoten('kz1', 'kanban-zimmer', 'ks1', { heading: 'Zimmer 1' }),
    n1: knoten('n1', 'navi', ROOT_ID, {}, ['ne1']),
    ne1: knoten('ne1', 'navi-eintrag', 'n1', {}),
    tx1: knoten('tx1', 'text', ROOT_ID, {}),
    bi1: knoten('bi1', 'bild', ROOT_ID, {}),
    d1: knoten('d1', 'datum', ROOT_ID, {}),
    tr1: knoten('tr1', 'trenner', ROOT_ID, {}),
    p1: knoten('p1', 'popup', ROOT_ID, { name: 'Hinweis' }, ['tx2']),
    tx2: knoten('tx2', 'text', 'p1', {}),
  }
  tree.b1 = { ...tree.b1, events: { onClick: KETTE } }
  return tree
}
