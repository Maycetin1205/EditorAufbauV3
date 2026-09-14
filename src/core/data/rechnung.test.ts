import { describe, expect, it } from 'vitest'
import { formelVonRoh, rechneFormel, type Formel } from './rechnung'

const runden = { stellen: 3, richtung: 'kfm' as const }

describe('Rechnung mit Datenfeldern', () => {
  it('rechnet Spalten, Datenfelder und feste Zahlen zusammen', () => {
    const formel: Formel = {
      glieder: [
        { spalte: 'tiere' },
        { feld: 'dosierung::wert' },
        { zahl: 2 },
      ],
      zeichen: ['*', '/'],
      runden,
    }

    expect(rechneFormel(
      formel,
      (kennung) => kennung === 'tiere' ? 5 : null,
      (bindung) => bindung === 'dosierung::wert' ? 20 : null,
    )).toBe(50)
  })

  it('liest Datenfeld-Glieder aus gespeicherten Formeln', () => {
    const formel = formelVonRoh({
      glieder: [{ feld: 'hilfsquelle::dosierung' }],
      zeichen: [],
      runden,
    })

    expect(formel?.glieder[0]).toEqual({ feld: 'hilfsquelle::dosierung' })
  })
})
