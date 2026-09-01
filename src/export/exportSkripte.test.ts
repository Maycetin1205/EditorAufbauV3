import { expect, test } from 'vitest'
import { ROOT_ID, ROOT_TYPE, type BlockTree } from '../core/blocks/BlockData'
import '../blocks/tabelle/TabelleBlock'
import type { DataSource } from '../core/data/dataSources'
import { exportMask } from './exportMask'

// Die zwei JSON-Skripte der Maske (FF_DATA_SOURCES, FF_RELATIONS) und die
// SEFILELOOP-Bestellung muessen dasselbe sagen: die Laufzeit sucht die Zeilen
// einer Quelle ueber ihren NAMEN (softengine/data.ts) — was SoftEngine unter
// einem anderen Alias liefert, findet sie nie.

function quelle(id: string, name: string): DataSource {
  return {
    id,
    name,
    kind: 'idb',
    idbId: id === 'q1' ? 'IDB0001' : 'IDB0002',
    fields: [{ code: '253_30', label: 'Text' }],
  }
}

function maske(): BlockTree {
  return {
    [ROOT_ID]: {
      id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: null, childIds: ['t1', 't2'],
    },
    t1: {
      id: 't1',
      type: 'tabelle',
      props: { source: 'q1', spalten: [{ kennung: 's1', titel: 'Text', feld: '253_30' }] },
      parentId: ROOT_ID,
      childIds: [],
    },
    t2: {
      id: 't2',
      type: 'tabelle',
      props: { source: 'q2', spalten: [{ kennung: 's1', titel: 'Text', feld: '253_30' }] },
      parentId: ROOT_ID,
      childIds: [],
    },
  }
}

function namenAusSkript(html: string): string[] {
  const roh = /window\.FF_DATA_SOURCES = (\[.*?\]);/s.exec(html)?.[1] ?? '[]'
  return (JSON.parse(roh) as { name: string }[]).map((s) => s.name)
}

function aliasse(sevariablen: string): string[] {
  const bestellung = JSON.parse(sevariablen) as { SEFILELOOP: { ALIAS: string }[] }
  return bestellung.SEFILELOOP.map((e) => e.ALIAS)
}

// Zwei gleich benannte Quellen zeigten in der fertigen Maske stumm dieselben
// Daten: der erste Treffer im SEFILELOOP gewinnt.
test('gleich benannte Quellen bekommen im Export verschiedene Namen', () => {
  const abzug = exportMask(maske(), 'Pruefmaske', [quelle('q1', 'Tiere'), quelle('q2', 'Tiere')], [])
  expect(aliasse(abzug.sevariablen)).toEqual(['Tiere', 'Tiere 2'])
  expect(namenAusSkript(abzug.html)).toEqual(['Tiere', 'Tiere 2'])
})

// Gross/klein und Leerzeichen aussen zaehlen nicht: SoftEngine vergleicht den
// Alias getrimmt und klein geschrieben (data.ts, sameAlias).
test('auch nur anders geschriebene Namen gelten als doppelt', () => {
  const abzug = exportMask(maske(), 'Pruefmaske', [quelle('q1', 'Tiere'), quelle('q2', ' TIERE ')], [])
  expect(aliasse(abzug.sevariablen)).toEqual(['Tiere', 'TIERE 2'])
})

// Ein spitzes Klammerzeichen aus getipptem Text darf das Skript nicht
// verlassen koennen — auch nicht ueber die "double escaped script"-Masche.
test('ein < im Namen steht als Unicode-Fluchtform im Skript', () => {
  const abzug = exportMask(maske(), 'Pruefmaske', [quelle('q1', 'a</script>b'), quelle('q2', 'B')], [])
  const skript = /window\.FF_DATA_SOURCES = .*/.exec(abzug.html)?.[0] ?? ''
  expect(skript).not.toContain('<')
  const ESC = String.fromCharCode(92) + 'u003C'
  expect(skript).toContain(ESC + '/script>b')
})
