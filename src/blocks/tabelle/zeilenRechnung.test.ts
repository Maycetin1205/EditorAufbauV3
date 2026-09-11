import { describe, expect, it } from 'vitest'
import type { Formel } from '../../core/data/rechnung'
import type { Spalte } from './spalten'
import { zeileGerechnet, zellWertGerechnet } from './zeilenRechnung'

function formel(glieder: Formel['glieder'], zeichen: Formel['zeichen'] = []): Formel {
  return { glieder, zeichen, runden: { stellen: 2, richtung: 'kfm' } }
}

const SPALTEN: Spalte[] = [
  { kennung: 'k1', titel: 'Menge', feld: '164_8' },
  { kennung: 'k2', titel: 'Preis', feld: '200_8' },
  { kennung: 'k3', titel: 'Summe', feld: '', formel: formel([{ spalte: 'k1' }, { spalte: 'k2' }], ['*']) },
  { kennung: 'k4', titel: 'Mit Steuer', feld: '', formel: formel([{ spalte: 'k3' }, { zahl: 1.19 }], ['*']) },
]

function ausZeile(werte: readonly string[]): (platz: number) => string {
  return (platz) => werte[platz] ?? ''
}

describe('zeileGerechnet', () => {
  it('fuellt die Formelspalte einer gelieferten Zeile', () => {
    expect(zeileGerechnet(SPALTEN, ausZeile(['5', '2', '', '']))).toEqual(['5', '2', '10', '11,9'])
  })

  it('rechnet eine Formel aus einer anderen Formelspalte', () => {
    // k4 haengt an k3, das selbst erst gerechnet wird.
    expect(zellWertGerechnet(SPALTEN, 3, ausZeile(['4', '10', '', '']))).toBe('47,6')
  })

  it('laesst die Zelle leer, wo ein Glied keine Zahl ist', () => {
    expect(zeileGerechnet(SPALTEN, ausZeile(['—', '2', '', '']))).toEqual(['—', '2', '', ''])
  })

  it('laesst Gegebenes stehen, auch an einer Formelspalte', () => {
    expect(zellWertGerechnet(SPALTEN, 2, ausZeile(['5', '2', '99', '']))).toBe('99')
  })

  it('haelt eine Formel an, die sich selbst braucht', () => {
    const kreis: Spalte[] = [
      { kennung: 'a', titel: 'A', feld: '', formel: formel([{ spalte: 'b' }]) },
      { kennung: 'b', titel: 'B', feld: '', formel: formel([{ spalte: 'a' }]) },
    ]
    expect(zeileGerechnet(kreis, ausZeile(['', '']))).toEqual(['', ''])
  })

  it('reicht eine Zeile ohne Formelspalte unveraendert durch', () => {
    const ohne: Spalte[] = [{ kennung: 'k1', titel: 'ArtNr', feld: '18_25' }]
    expect(zeileGerechnet(ohne, ausZeile(['ART-A']))).toEqual(['ART-A'])
  })
})
