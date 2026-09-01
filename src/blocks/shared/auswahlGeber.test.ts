import { expect, test } from 'vitest'
import type { BlockNode } from '../../core/blocks/BlockData'
import { auswahlQuelleIdVon, istAuswahlGeber } from '../../core/blocks/treeQuery'
import '../formfeld/FormFeldBlock'
import '../tabelle/TabelleBlock'
import '../text/TextBlock'

function knoten(type: string, props: Record<string, unknown>): BlockNode {
  return { id: 'k1', type, props, parentId: null, childIds: [] }
}

// Wer eine Zeile hat, kann sie hergeben (Nutzer 2026-09-01): das gebundene
// Formularfeld gibt seine ANGEZEIGTE Zeile — nicht nur das Nachschlage-Feld
// seine gewaehlte. Die wenn-Bedingung der satzWahl waehlt nur die
// Quell-Eigenschaft, sie schaltet die Faehigkeit nicht ab.
test('ein gebundenes Formularfeld ist Geber seiner Quelle', () => {
  const feld = knoten('formfeld', { fieldType: 'text', source: 'q-bel' })
  expect(istAuswahlGeber(feld)).toBe(true)
  expect(auswahlQuelleIdVon(feld)).toBe('q-bel')
})

test('ohne Quelle gibt es nichts herzugeben', () => {
  expect(istAuswahlGeber(knoten('formfeld', { fieldType: 'text', source: '' }))).toBe(false)
})

test('das Nachschlage-Feld gibt weiterhin seine Nachschlage-Quelle', () => {
  const feld = knoten('formfeld', {
    fieldType: 'nachschlagen',
    source: 'q-bel',
    nachschlagQuelle: 'q-art',
  })
  expect(istAuswahlGeber(feld)).toBe(true)
  expect(auswahlQuelleIdVon(feld)).toBe('q-art')
})

test('die Tabelle gibt wie bisher ueber ihre eigene Quelle', () => {
  expect(auswahlQuelleIdVon(knoten('tabelle', { source: 'q-pos' }))).toBe('q-pos')
  expect(istAuswahlGeber(knoten('tabelle', { source: 'q-pos' }))).toBe(true)
})

// Der Text-Baustein deklariert keine satzWahl: reine Anzeige, keine Zeilenwahl.
test('der Text-Baustein bleibt kein Geber, auch gebunden', () => {
  expect(istAuswahlGeber(knoten('text', { source: 'q-bel', textField: 'x' }))).toBe(false)
})
