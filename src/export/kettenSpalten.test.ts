import { expect, test } from 'vitest'
import { ROOT_ID, ROOT_TYPE, type BlockTree } from '../core/blocks/BlockData'
import '../blocks/tabelle/TabelleBlock'
import '../blocks/button/ButtonBlock'
import { exportMask } from './exportMask'

// Im BAUM sprechen Ketten-Parameter die Spalte ueber ihre dauerhafte KENNUNG
// an (verrutscht nicht beim Verschieben/Loeschen); die LAUFZEIT greift die
// Zeilenwerte ueber werte[index] (seAktionen). Dazwischen sitzt genau eine
// Uebersetzung: der Export (withoutEditorId + spaltenIndexFuer). Bricht sie,
// schreibt jeder Knopf die falsche Spalte ins ERP — stumm.
function maske(zellenKennung: string): BlockTree {
  return {
    [ROOT_ID]: {
      id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: null, childIds: ['t1', 'k1'],
    },
    t1: {
      id: 't1',
      type: 'tabelle',
      props: {
        source: 'q-pos',
        erfassung: 'ja',
        spalten: [
          { kennung: 's1', titel: 'Artikel', feld: '18_25' },
          { kennung: 's2', titel: 'Menge', feld: '164_8' },
          { kennung: 's3', titel: 'Tage', feld: '933_3' },
        ],
      },
      parentId: ROOT_ID,
      childIds: [],
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
          params: [{ source: 'erfassungszelle', value: zellenKennung, blockId: 't1' }],
          extraParams: [],
        }],
      },
    },
  }
}

function aktionenVon(html: string): string {
  const roh = /data-ff-aktionen="([^"]*)"/.exec(html)?.[1] ?? ''
  return roh.replace(/&quot;/g, '"')
}

test('der Export uebersetzt die Spalten-Kennung in den Platz', () => {
  const html = exportMask(maske('s3'), 'Pruefmaske', [], []).html
  expect(aktionenVon(html)).toContain('"value":"2"')
})

test('eine unbekannte Kennung wird -1: die Laufzeit liefert leer statt falsch', () => {
  const html = exportMask(maske('geloescht'), 'Pruefmaske', [], []).html
  expect(aktionenVon(html)).toContain('"value":"-1"')
})

// Und die Kennung selbst reist im spalten-Attribut mit — die Rechnung loest
// sie zur Laufzeit dort auf (spalteMitKennung).
test('das spalten-Attribut der Maske traegt die Kennungen', () => {
  const html = exportMask(maske('s3'), 'Pruefmaske', [], []).html
  const tag = /<ff-tabelle[^>]*>/.exec(html)?.[0] ?? ''
  expect(tag).toContain('s1')
  expect(tag).toContain('kennung')
})
