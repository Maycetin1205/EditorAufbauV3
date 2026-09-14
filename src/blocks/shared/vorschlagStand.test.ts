import { describe, expect, it } from 'vitest'
import { VorschlagStand } from './vorschlagStand'

const basis = {
  listeOffen: false,
  feldLeer: false,
  getippt: false,
  nachschlagbar: false,
  hatSaetze: () => false,
  springt: true,
}

describe('VorschlagStand', () => {
  it('laesst Enter nach getipptem Nachschlagwert ohne Treffer weitergehen', () => {
    const stand = new VorschlagStand()
    expect(stand.folgeFuer('Enter', {
      ...basis,
      getippt: true,
      nachschlagbar: true,
      hatSaetze: () => true,
    })).toBe('weiter')
  })
})
