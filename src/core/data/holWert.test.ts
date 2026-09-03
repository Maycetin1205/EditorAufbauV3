import { expect, test } from 'vitest'
import { pruefeHolWert, quellenAusHolWert } from './holWert'

test('ohne Relation ist die Angabe wertlos', () => {
  expect(pruefeHolWert({ relationId: '', params: [] })).toBeNull()
  expect(pruefeHolWert({ params: [] })).toBeNull()
  expect(pruefeHolWert(undefined)).toBeNull()
})

test('eine Relation ohne Parameter reicht', () => {
  expect(pruefeHolWert({ relationId: ' r-408 ', params: [] }))
    .toEqual({ relationId: 'r-408', params: [] })
})

// Eine Quelle holt ohne Baustein und ohne laufende Kette. Ein Parameter, der
// an einer gewaehlten Zeile oder an einem Schritt-Ergebnis haengt, faende
// hier nie etwas und ginge still leer hinaus — die ganze Angabe faellt.
test('Herkuenfte, die es hier nicht gibt, kippen die Angabe', () => {
  const mitZeile = {
    relationId: 'r-408',
    params: [{ source: 'gewaehlte_zeile', value: '2_1', blockId: 'b1' }],
  }
  expect(pruefeHolWert(mitZeile)).toBeNull()

  const mitSchritt = {
    relationId: 'r-408',
    params: [{ source: 'step_result', value: '0' }],
  }
  expect(pruefeHolWert(mitSchritt)).toBeNull()
})

test('Fest, Datenfeld und SE VAR-Array bleiben', () => {
  const roh = {
    relationId: 'r-1020',
    params: [
      { source: 'fixed', value: 'AB' },
      { source: 'data_field', value: '11_8', dataSourceId: 'q-bel' },
      { source: 'se_variable', value: 'ZIMMER' },
    ],
  }
  expect(pruefeHolWert(roh)?.params).toHaveLength(3)
})

// Woraus ein Parameter liest, muss der Export wissen: die Quelle gehoert in
// die Maske und ihr Feld in die Bestellung.
test('quellenAusHolWert nennt Quelle und Feld je Datenfeld-Parameter', () => {
  const quelle = {
    kind: 'relationswert' as const,
    holWert: {
      relationId: 'r-1020',
      params: [
        { source: 'fixed' as const, value: 'AB' },
        { source: 'data_field' as const, value: '11_8', dataSourceId: 'q-bel' },
      ],
    },
  }
  expect(quellenAusHolWert(quelle)).toEqual([{ quelleId: 'q-bel', code: '11_8' }])
})

// Bei einer Art, die den Weg nicht kennt, ist eine mitgeschleppte Angabe
// stumm — sonst holte eine IDB-Tabelle heimlich per Relation.
test('nur die Art „Wert per Relation" holt', () => {
  const quelle = {
    kind: 'idb' as const,
    holWert: { relationId: 'r-408', params: [] },
  }
  expect(quellenAusHolWert(quelle)).toEqual([])
})
