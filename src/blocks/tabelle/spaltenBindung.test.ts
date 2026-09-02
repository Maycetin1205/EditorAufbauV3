import { expect, test } from 'vitest'
import { leereRechnung, rechnungAlsAttribut, rechnungVonAttribut } from '../../core/data/rechnung'
import { neueSpalte } from './spalten'
import { SPALTEN_BINDUNG } from './spaltenBindung'

function drei() {
  return ['A', 'B', 'C'].map((titel, i) => ({ ...neueSpalte(i), kennung: `s${i + 1}`, titel }))
}

// Der Editor streicht Spalten ueber den reinen Vorgang der Registry — die
// Rechnung verliert ihren Platz auf der gestrichenen Spalte gleich mit.
test('eintragWeg streicht die Spalte und putzt die Rechnung', () => {
  const weg = SPALTEN_BINDUNG.eintragWeg
  if (!weg) throw new Error('eintragWeg fehlt')
  const rechnung = leereRechnung()
  rechnung.menge = { ...rechnung.menge, spalte: 's2' }

  const patch = weg({ spalten: drei(), rechnung: rechnungAlsAttribut(rechnung) }, 1)
  expect((patch.spalten as { kennung: string }[]).map((s) => s.kennung)).toEqual(['s1', 's3'])
  expect(rechnungVonAttribut(patch.rechnung)?.menge.spalte).not.toBe('s2')
})

test('die letzte Spalte laesst sich nicht streichen', () => {
  const weg = SPALTEN_BINDUNG.eintragWeg
  if (!weg) throw new Error('eintragWeg fehlt')
  expect(weg({ spalten: [neueSpalte(0)] }, 0)).toEqual({})
})

test('eintragNeu fuegt eine Spalte mit Kennung an', () => {
  const neu = SPALTEN_BINDUNG.eintragNeu
  if (!neu) throw new Error('eintragNeu fehlt')
  const patch = neu({ spalten: drei() })
  const spalten = patch.spalten as { kennung: string }[]
  expect(spalten).toHaveLength(4)
  expect(spalten[3].kennung).toBe('s4')
})
