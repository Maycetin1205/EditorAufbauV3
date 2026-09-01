import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import '../blocks/register'
import { ROOT_ID, ROOT_TYPE, type BlockNode, type BlockTree } from '../core/blocks/BlockData'
import { canContain, getAllBlockDefinitions } from '../core/blocks/blockRegistry'
import { WEITERE_QUELLEN_PROP } from '../core/data/sourceLinks'
import { exportMask } from './exportMask'
import { referenzBaum, REFERENZ_QUELLEN, REFERENZ_RELATIONEN } from './referenz/referenzMaske'

const HTML_PFAD = fileURLToPath(new URL('./referenz/referenz.html', import.meta.url))
const SV_PFAD = fileURLToPath(new URL('./referenz/referenz.sevariablen.json', import.meta.url))

// Erneuern (nur bei ABSICHTLICHER Exportänderung, im eigenen Commit):
//   REFERENZ_ERNEUERN=1 npx vitest run src/export/referenzabzug.test.ts
const erneuern = process.env.REFERENZ_ERNEUERN === '1'

test('der Export der Referenzmaske ist byte-gleich zur eingecheckten Referenz', () => {
  const { html, sevariablen } = exportMask(
    referenzBaum(), 'Referenzmaske', REFERENZ_QUELLEN, REFERENZ_RELATIONEN,
  )
  if (erneuern) {
    writeFileSync(HTML_PFAD, html)
    writeFileSync(SV_PFAD, sevariablen)
  }
  expect(html).toBe(readFileSync(HTML_PFAD, 'utf8'))
  expect(sevariablen).toBe(readFileSync(SV_PFAD, 'utf8'))
})

// Jeder Baustein einmal in einen Baum: an die Wurzel, wenn erlaubt, sonst
// unter den ersten Typ, der ihn aufnimmt (Kanban-Spalte, Navi-Eintrag, ...).
function alleBausteineBaum(marker: (type: string) => Record<string, unknown>): BlockTree {
  const defs = [...getAllBlockDefinitions()].sort((a, b) => a.type.localeCompare(b.type))
  const tree: BlockTree = {
    [ROOT_ID]: { id: ROOT_ID, type: ROOT_TYPE, props: {}, parentId: '', childIds: [] },
  }
  const instanz = new Map<string, string>()

  const platziere = (type: string): string => {
    const vorhanden = instanz.get(type)
    if (vorhanden !== undefined) return vorhanden
    const id = `g-${type}`
    const node: BlockNode = { id, type, props: marker(type), parentId: ROOT_ID, childIds: [] }
    if (canContain(ROOT_TYPE, type)) {
      tree[ROOT_ID].childIds.push(id)
    } else {
      const elternDef = defs.find((p) => p.type !== type && canContain(p.type, type))
      if (!elternDef) throw new Error(`Baustein ${type} ist nirgends platzierbar`)
      const elternId = platziere(elternDef.type)
      node.parentId = elternId
      tree[elternId].childIds.push(id)
    }
    tree[id] = node
    instanz.set(type, id)
    return id
  }

  for (const def of defs) platziere(def.type)
  return tree
}

test('jeder Registry-Baustein exportiert seinen Tag', () => {
  const html = exportMask(alleBausteineBaum(() => ({})), 'Alle', [], []).html
  for (const def of getAllBlockDefinitions()) {
    expect(html, `Baustein ${def.type} fehlt im Export`).toContain('<' + def.tagName)
  }
})

// Round-Trip je Baustein: eine geaenderte Text-Eigenschaft muss als Attribut
// hinausgehen. Der Tabellen-Bug 2026-07-24 (umbenannte Spalten fielen im
// Export still auf die Standardtitel zurueck) war genau diese Luecke.
test('eine geänderte Eigenschaft erreicht den Export als Attribut', () => {
  const LAYOUT = new Set(['width', 'height', 'rasterX', 'rasterY', 'rasterW', 'rasterH'])
  const pruefbar = new Map<string, string>()
  for (const def of getAllBlockDefinitions()) {
    const seitenProps = new Set(def.customProperties
      .filter((p) => p.kind === 'seite')
      .flatMap((p) => [p.attributeName, p.klarnameProp ?? '']))
    const nurEditor = new Set(def.customProperties
      .filter((p) => p.nurImEditor === true)
      .map((p) => p.attributeName))
    const key = Object.keys(def.defaultProps).find((k) =>
      typeof def.defaultProps[k] === 'string'
      && !LAYOUT.has(k)
      && k !== 'source'
      && k !== WEITERE_QUELLEN_PROP
      && !k.toLowerCase().endsWith('field')
      && !seitenProps.has(k)
      && !nurEditor.has(k))
    if (key !== undefined) pruefbar.set(def.type, key)
  }
  expect(pruefbar.size, 'kaum ein Baustein hat eine pruefbare Text-Eigenschaft').toBeGreaterThan(7)

  const html = exportMask(
    alleBausteineBaum((type) => {
      const attr = pruefbar.get(type)
      return attr === undefined ? {} : { [attr]: `pruefwert-${type}` }
    }),
    'Alle', [], [],
  ).html
  for (const [type, attr] of pruefbar) {
    expect(html, `${type}: ${attr} kam nicht im Export an`)
      .toContain(`${attr.toLowerCase()}="pruefwert-${type}"`)
  }
})
