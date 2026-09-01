import { expect, test } from 'vitest'
import { ROOT_ID, type BlockNode, type BlockTree } from '../core/blocks/BlockData'
import type { BlockDefinition } from '../core/blocks/BlockDefinition'
import { registerBlockType } from '../core/blocks/blockRegistry'
import type { DataSource } from '../core/data/dataSources'
import { WEITERE_QUELLEN_PROP } from '../core/data/sourceLinks'
import { SPALTEN_BINDUNG } from '../blocks/tabelle/spaltenBindung'
import { benutzteFelderJeQuelle, collectDataSources } from './benutzteQuellen'

// Der Baustein traegt die ECHTE Spalten-Bindung der Tabelle — sonst wuerde der
// Test nur eine Testvorlage pruefen und nicht das, was das Produkt exportiert.
const TYP = 'test-positionen'
registerBlockType({
  type: TYP,
  tagName: 'test-positionen',
  displayName: 'Positionen',
  category: 'anzeige',
  defaultProps: {},
  // Wie das Marken-Feld der echten Tabelle: eine Feld-Eigenschaft OHNE
  // quelleProp (tabelleEigenschaften.ts:37).
  customProperties: [
    { attributeName: 'tagField', name: 'Tag filtern nach', kind: 'field' },
  ],
  acceptsChildren: false,
  resizableWidth: false,
  resizableHeight: false,
  acceptsDataSource: true,
  listenBindung: SPALTEN_BINDUNG,
} as BlockDefinition)

function felder(codes: readonly string[]): DataSource['fields'] {
  return codes.map((code) => ({ code, label: code }))
}

const positionen: DataSource = {
  id: 'q-pos', name: 'POS', kind: 'belegposition', fields: felder(['18_25', '45_60', '164_8']),
}

const artikel: DataSource = {
  id: 'q-art', name: 'ART', kind: 'artikelstamm', fields: felder(['artnr', 'bez']),
}

const BIBLIOTHEK = [positionen, artikel]

function baum(spalten: unknown[]): BlockTree {
  const wurzel: BlockNode = {
    id: ROOT_ID,
    type: TYP,
    props: {
      source: 'q-pos',
      [WEITERE_QUELLEN_PROP]: [{ quelleId: 'q-art', partnerId: '', keyPairs: [] }],
      spalten,
    },
    parentId: null,
    childIds: [],
  }
  return { [ROOT_ID]: wurzel }
}

function codesVon(tree: BlockTree, quelleId: string): string[] {
  return [...(benutzteFelderJeQuelle(tree, BIBLIOTHEK).get(quelleId) ?? [])].sort()
}

// Der Kern: eine Spalte hat ZWEI Felder aus ZWEI Quellen. Bestellt der Export
// nur das Spaltenfeld, schiebt SoftEngine den Artikelstamm ohne die
// Bezeichnung herueber — die Erfassungszeile haette nichts vorzuschlagen, und
// zwar ohne jede Fehlermeldung.
test('Spaltenfeld und Fuellfeld werden bei ihrer je eigenen Quelle bestellt', () => {
  const tree = baum([
    { titel: 'Bezeichnung', feld: '45_60', fuellFeld: 'q-art::bez' },
    { titel: 'Artikelnummer', feld: '18_25', fuellFeld: 'q-art::artnr' },
  ])
  expect(codesVon(tree, 'q-pos')).toEqual(['18_25', '45_60'])
  expect(codesVon(tree, 'q-art')).toEqual(['artnr', 'bez'])
})

test('ohne Fuellfeld bleibt es beim Spaltenfeld', () => {
  const tree = baum([{ titel: 'Menge', feld: '164_8' }])
  expect(codesVon(tree, 'q-pos')).toEqual(['164_8'])
  expect(benutzteFelderJeQuelle(tree, BIBLIOTHEK).has('q-art')).toBe(false)
})

// Eine Spalte ohne Spaltenfeld bestellt trotzdem ihr Fuellfeld: sie schreibt
// nichts, hilft aber beim Aussuchen.
test('ein Fuellfeld allein wird bestellt', () => {
  const tree = baum([{ titel: 'Suche', feld: '', fuellFeld: 'q-art::bez' }])
  expect(codesVon(tree, 'q-art')).toEqual(['bez'])
  expect(benutzteFelderJeQuelle(tree, BIBLIOTHEK).has('q-pos')).toBe(false)
})

// Ohne die Quelle selbst in der Bestellung nuetzen die Feldnamen nichts:
// SoftEngine bekaeme gar keinen Loop fuer den Artikelstamm.
test('die Hilfsquelle steht in der Quellenliste des Exports', () => {
  const tree = baum([{ titel: 'Bezeichnung', feld: '45_60', art: 'text', fuellFeld: 'q-art::bez' }])
  expect(collectDataSources(tree, BIBLIOTHEK).map((s) => s.id)).toEqual(['q-pos', 'q-art'])
})

// Eine Feld-Eigenschaft ohne quelleProp traegt dieselbe Form wie eine Bindung.
// Ungetrennt bestellt der Export den ganzen Token "q-art::bez" als Feldcode bei
// der Quelle in Reichweite — SoftEngine bricht daran laut Kontrakt die ganze
// Loop-Liste ab oder liefert die Marke gar nicht.
test('eine Feld-Eigenschaft mit Quelle im Wert wird bei DIESER Quelle bestellt', () => {
  const tree = baum([{ titel: 'Menge', feld: '164_8' }])
  tree[ROOT_ID].props.tagField = 'q-art::bez'
  expect(codesVon(tree, 'q-art')).toEqual(['bez'])
  expect(codesVon(tree, 'q-pos')).toEqual(['164_8'])
})

// Gegenprobe: ein nackter Feldcode gehoert weiter der Quelle in Reichweite.
test('eine Feld-Eigenschaft ohne Quelle im Wert bleibt bei der eigenen Quelle', () => {
  const tree = baum([{ titel: 'Menge', feld: '164_8' }])
  tree[ROOT_ID].props.tagField = '45_60'
  expect(codesVon(tree, 'q-pos')).toEqual(['164_8', '45_60'])
  expect(benutzteFelderJeQuelle(tree, BIBLIOTHEK).has('q-art')).toBe(false)
})
