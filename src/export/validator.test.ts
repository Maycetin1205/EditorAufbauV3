import { describe, expect, test } from 'vitest'
import { ROOT_ID, ROOT_TYPE, type BlockTree } from '../core/blocks/BlockData'
import { exportMask } from './exportMask'
import { END_MARKER, START_MARKER, failedChecks, validateMaskHtml } from './validator'

function maske(): BlockTree {
  return {
    [ROOT_ID]: { id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: null, childIds: [] },
  }
}

function echterExport(): string {
  return exportMask(maske(), 'Pruefmaske', [], []).html
}

function beanstandet(html: string): string[] {
  return failedChecks(validateMaskHtml(html)).map((f) => f.name)
}

test('eine echt exportierte Maske wird nicht beanstandet', () => {
  const html = echterExport()
  expect(beanstandet(html)).toEqual([])
  expect(html.startsWith(START_MARKER)).toBe(true)
  expect(html.trimEnd().endsWith(END_MARKER)).toBe(true)
})

describe('kaputte Maske', () => {
  test('CR-Zeichen: SoftEngine laedt die Datei nicht', () => {
    expect(beanstandet(echterExport().replace(/\n/g, '\r\n'))).toContain('LF-only')
  })

  test('Umlaut statt Entity', () => {
    const html = echterExport().replace('class="ff-root"', 'class="ff-root" title="Grün"')
    expect(beanstandet(html)).toContain('ASCII-only')
  })

  test('fehlender Start-Marker', () => {
    const html = echterExport().split('\n').slice(1).join('\n')
    expect(beanstandet(html)).toContain('Start-Marker Zeile 1')
  })

  test('fehlendes Interface-Script', () => {
    const html = echterExport().replace(
      '<script src="<!--SOFTENGINE-VAR!EditorPfad-->/JS/JS/basis.html.interface.js"></script>\n',
      '',
    )
    expect(beanstandet(html)).toContain('SoftEngine-Interface vorhanden')
  })

  test('Runtime-Buendel fehlt: die Maske waere stumm', () => {
    const html = echterExport().replaceAll('customElements.define', 'nichtsDergleichen')
    expect(beanstandet(html)).toContain('Runtime-Buendel eingebettet')
  })

  // Jede Beanstandung muss dem Bediener sagen, WAS sie gefunden hat — die
  // Toolbar zeigt genau dieses Feld an (editor/shell/Toolbar.tsx).
  test('die Meldung nennt den Fund', () => {
    const html = echterExport().replace(/\n/g, '\r\n')
    const lf = failedChecks(validateMaskHtml(html)).find((f) => f.name === 'LF-only')
    expect(lf?.detail).toMatch(/CR-Zeichen/)
  })
})
