import { expect, test } from 'vitest'
import { ROOT_ID, ROOT_TYPE, type BlockTree } from '../core/blocks/BlockData'
import { fremdeQuelleVon } from '../core/blocks/BlockDefinition'
import type { DataSource } from '../core/data/dataSources'
import { WEITERE_QUELLEN_PROP } from '../core/data/sourceLinks'
import { SPALTEN_BINDUNG } from '../blocks/tabelle/spaltenBindung'
import '../blocks/tabelle/TabelleBlock'
import { exportMask } from './exportMask'

// Die Regel hinter dem gedimmten Quellnamen am Spaltenkopf: gezeigt wird nur
// eine FREMDE Quelle, und das Fuellfeld fuehrt — es ist die, die beim Erfassen
// zieht und die man der Spalte sonst nicht ansieht.
test('die fremde Quelle: Fuellfeld vor Spaltenfeld, sonst nichts', () => {
  const f = (e: Record<string, unknown>): string => fremdeQuelleVon(SPALTEN_BINDUNG, e)

  expect(f({ feld: '45_60' })).toBe('')
  expect(f({ feld: '' })).toBe('')
  expect(f({ feld: '45_60', fuellFeld: 'q-art::bez' })).toBe('q-art')
  expect(f({ feld: 'q-art::bez' })).toBe('q-art')

  // Zeigen beide auf Fremdes, gilt das Fuellfeld.
  expect(f({ feld: 'q-lag::ort', fuellFeld: 'q-art::bez' })).toBe('q-art')
})

const POS: DataSource = {
  id: 'q-pos', name: 'Belegpositionen', kind: 'belegposition',
  fields: [{ code: '45_60', label: 'Bezeichnung' }],
}

const ART: DataSource = {
  id: 'q-art', name: 'Artikelstamm', kind: 'artikelstamm',
  fields: [{ code: 'bez', label: 'Bezeichnung' }],
}

function maskeMitTabelle(): BlockTree {
  return {
    [ROOT_ID]: {
      id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: null, childIds: ['t1'],
    },
    t1: {
      id: 't1',
      type: 'tabelle',
      props: {
        source: 'q-pos',
        [WEITERE_QUELLEN_PROP]: [{ quelleId: 'q-art', partnerId: '', keyPairs: [] }],
        spalten: [
          { titel: 'Bezeichnung', feld: '45_60', art: 'text', fuellFeld: 'q-art::bez' },
        ],
      },
      parentId: ROOT_ID,
      childIds: [],
    },
  }
}

// Die Auflage des Nutzers: „nur im Editor, nie im Export" wird als eigener
// Test festgenagelt. Der in CLAUDE.md genannte Referenzabzug existiert in
// diesem Repo NICHT — er beschreibt ein frueheres Repo und taugt nicht als
// Absicherung. Der Name der Hilfsquelle ist die Probe: er steht im Editor
// unter dem Spaltentitel und darf in der Maskendatei nirgends auftauchen.
test('der Quellname steht nicht am exportierten Baustein', () => {
  const html = exportMask(maskeMitTabelle(), 'Pruefmaske', [POS, ART], []).html
  const tag = /<ff-tabelle[^>]*>/.exec(html)?.[0] ?? ''

  // Gegenprobe zuerst: der Baustein ist wirklich da und traegt seine Spalte
  // samt Fuellfeld. Ohne sie bewiesen die Zeilen darunter nur, dass gar nichts
  // exportiert wurde.
  expect(tag).toContain('source="q-pos"')
  expect(tag).toContain('fuellFeld')
  expect(tag).toContain('q-art::bez')

  // Und jetzt die Zusage: keine Herkunfts-Angabe am Baustein. Der Klarname der
  // Quelle steht nur im Editor unter dem Spaltentitel.
  expect(tag).not.toContain('Artikelstamm')
  expect(tag.toLowerCase()).not.toContain('herkunft')
})

// Der Quellname darf ueberhaupt nur an EINER Stelle stehen: in FF_DATA_SOURCES,
// woher die Laufzeit ihre Zeilen holt (rowsFor liest ueber den Namen). Steht er
// zusaetzlich irgendwo im Maskenkoerper, ist eine Editor-Angabe durchgesickert.
test('der Quellname steht nur in der Quellenliste, nicht im Maskenkoerper', () => {
  const html = exportMask(maskeMitTabelle(), 'Pruefmaske', [POS, ART], []).html

  // Der Koerper OHNE Skripte: der Quellname gehoert in FF_DATA_SOURCES (die
  // Laufzeit holt ihre Zeilen ueber ihn, rowsFor) und sonst nirgendwohin.
  const koerper = html
    .slice(html.indexOf('<body'))
    .replace(/<script[\s\S]*?<\/script>/g, '')

  expect(koerper).toContain('<ff-tabelle')
  expect(koerper).not.toContain('Artikelstamm')
  expect(koerper).not.toContain('Belegpositionen')
})
