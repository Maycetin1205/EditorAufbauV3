import { ROOT_ID, type BlockNode, type BlockTree } from '../core/blocks/BlockData'
import { bindingProp, listeFuerExport, listeLesen } from '../core/blocks/BlockDefinition'
import { getBlockDefinition } from '../core/blocks/blockRegistry'
import {
  bindbareStellenVon,
  darfAuswahlFolgen,
  firstDescendantOfType,
  istAuswahlGeber,
  QUELLE_PROP,
  traegtAenderungen,
  traegtEigeneQuelle,
  traegtLoeschungen,
} from '../core/blocks/treeQuery'
import { ACTION_VALUE_ID_ATTR, serializeBlockEvents } from '../core/data/aktionen'
import { propertySichtbar } from '../core/blocks/PropertyDescription'
import { AUSWAHL_FOLGE_PROP } from '../core/data/auswahlFolge'
import {
  felderHinterSchnitt,
  istOffenerSatz,
  holWertFor,
  ladeRelationFor,
  mitEindeutigenNamen,
  satzNummerVon,
  tableIdFor,
  type DataSource,
} from '../core/data/dataSources'
import type { RelationTemplate } from '../core/data/relations'
import { WEITERE_QUELLEN_PROP } from '../core/data/sourceLinks'
import { dataSourceStore } from '../state/DataSourceStore'
import { relationStore } from '../state/RelationStore'
import { seitenDerMaske } from '../state/pageOps'
import { istRasterFlaeche } from '../state/rasterOps'
import {
  resolveChildDirection,
  ROOT_FLOW,
  type FlowDirection,
} from '../core/blocks/flowLayout'
import { randPlatzLinks } from '../core/blocks/maskenRand'
import { rasterFlaecheCss } from '../core/blocks/rasterLayout'
import tokensCssRaw from '../design/masken-tokens.css?raw'
import {
  benutzteFelderJeQuelle,
  collectDataSources,
  holSchluesselJeGeber,
} from './benutzteQuellen'
import { collectRelations } from './benutzteRelationen'
import { baueSevariablen } from './sevariablen'
import { vorschauRoh, vorschauStellenVon } from './bindungsVorschau'
import { styleAttr } from './knotenStil'
import runtimeJsRaw from './generated/ff-runtime.js?raw'
import {
  escapeHtmlAttr,
  escapeHtmlText,
  escapeNonAsciiJs,
  guardJsonScript,
  guardScriptContent,
  stripCssComments,
} from './serializer'

const SE_INTERFACE_SCRIPT = '<script src="<!--SOFTENGINE-VAR!EditorPfad-->/JS/JS/basis.html.interface.js"></script>'

const LAYOUT_ATTR_AUSNAHME = new Set(['width', 'height', 'rasterX', 'rasterY', 'rasterW', 'rasterH'])

const EIGENE_QUELLE_PROPS = new Set([QUELLE_PROP, WEITERE_QUELLEN_PROP])

export interface MaskExport {
  html: string
  sevariablen: string
}

function attributWert(value: unknown): string {
  return Array.isArray(value) ? JSON.stringify(value) : String(value ?? '')
}

interface TemplateCtx {
  type: string
  id: string | undefined
}

// Spalten-Kennung -> Platz fuer die Ketten-Parameter (aktionen.ts,
// ZELLEN_PARAM_QUELLEN): generisch ueber die Listen-Bindung des Ziel-
// Bausteins, kein Bausteintyp-Sondercode (Regel 2). Unbekannt -> '-1',
// die Laufzeit liefert dann den leeren Wert — dieselbe Antwort wie ueberall.
function spaltenIndexFuer(tree: BlockTree): (blockId: string, kennung: string) => string {
  return (blockId, kennung) => {
    const ziel = tree[blockId]
    const bindung = ziel ? getBlockDefinition(ziel.type)?.listenBindung : undefined
    const key = bindung?.kennungKey
    if (!ziel || !bindung || key === undefined) return '-1'
    return String(listeLesen(ziel.props[bindung.prop], bindung)
      .findIndex((eintrag) => eintrag[key] === kennung))
  }
}

function nodeToHtml(
  tree: BlockTree,
  node: BlockNode,
  parentDirection: FlowDirection,
  depth: number,

  popupName: (id: string) => string,

  spaltenIndex: (blockId: string, kennung: string) => string,

  sources: readonly DataSource[],
  templateCtx?: TemplateCtx,

  rasterEbene = false,
): string {
  const def = getBlockDefinition(node.type)
  if (!def) return ''

  const pad = '  '.repeat(depth)
  if (templateCtx && node.type === templateCtx.type) {
    if (node.id !== templateCtx.id) return ''
    const inner = nodeToHtml(tree, node, parentDirection, depth + 1, popupName, spaltenIndex, sources, undefined, rasterEbene)
    return `${pad}<template data-ff-template>\n${inner}\n${pad}</template>`
  }

  const bindbareStellen = bindbareStellenVon(node)
  const bindbar = new Set(bindbareStellen.map((spot) => spot.prop))
  const stilleBindungen = new Set<string>(
    (def.bindableSpots ?? [])
      .filter((spot) => !bindbar.has(spot.prop))
      .map((spot) => bindingProp(spot.prop)),
  )

  const vorschauStellen = vorschauStellenVon(node)

  const nurImEditor = new Set(
    def.customProperties.filter((p) => p.nurImEditor).map((p) => p.attributeName),
  )

  const seitenKlarname = new Map<string, string>()
  for (const p of def.customProperties) {
    if (p.kind === 'seite' && p.klarnameProp) seitenKlarname.set(p.klarnameProp, p.attributeName)
  }

  const attrs = Object.keys(def.defaultProps)
    .filter((key) => !LAYOUT_ATTR_AUSNAHME.has(key))
    .map((key) => {
      if (key === AUSWAHL_FOLGE_PROP && !darfAuswahlFolgen(node)) return ''

      if (EIGENE_QUELLE_PROPS.has(key) && !traegtEigeneQuelle(node)) return ''
      if (stilleBindungen.has(key)) return ''

      if (nurImEditor.has(key)) return ''
      const standard = def.defaultProps[key]

      const seitenIdProp = seitenKlarname.get(key)
      const wert = seitenIdProp !== undefined
        ? popupName(String(node.props[seitenIdProp] ?? ''))
        : key === def.listenBindung?.prop
          ? listeFuerExport(node.props[key] ?? standard, def.listenBindung)
          : (node.props[key] ?? standard)
      const roh = vorschauStellen.has(key)
        ? vorschauRoh(node, vorschauStellen.get(key)!, sources, standard)
        : attributWert(wert)

      if (roh === attributWert(standard)) return ''
      return ` ${key.toLowerCase()}="${escapeHtmlAttr(roh)}"`
    })
    .join('')

  const aktionen = serializeBlockEvents(node.events, (def.blockEvents ?? []).map((e) => e.key), popupName, spaltenIndex)
  const aktionenAttr = aktionen ? ` data-ff-aktionen="${escapeHtmlAttr(aktionen)}"` : ''
  // Die EINE Kennung eines Bausteins in der Maske. Sie traegt, wer fuer eine
  // Kette adressierbar sein muss — Werte-Stellen, Erfassungszeile, Traeger
  // geaenderter oder geloeschter Zeilen — und wer eine Zeile gibt
  // (Auswahl-Geber). Alle Leser der Laufzeit greifen ueber dieses Attribut.
  const adressierbar = (def.actionValueSpots?.length ?? 0) > 0
    || (def.kannErfassen !== undefined && propertySichtbar(def.kannErfassen.wenn, node.props))
    || traegtAenderungen(node)
    || traegtLoeschungen(node)
    || istAuswahlGeber(node)
  const kennungAttr = adressierbar ? ` ${ACTION_VALUE_ID_ATTR}="${escapeHtmlAttr(node.id)}"` : ''

  const fuelltAttr = rasterEbene && def.pageBlock !== true ? ' fuellt' : ''

  const verborgenAttr = def.flaechenSeite === true ? ' hidden' : ''
  const open = `${pad}<${def.tagName}${attrs}${aktionenAttr}${kennungAttr}${fuelltAttr}${verborgenAttr}${styleAttr(node, parentDirection, def.lockedWidth, rasterEbene, def.pageBlock === true)}>`
  if (!def.acceptsChildren || node.childIds.length === 0) {
    return `${open}</${def.tagName}>`
  }

  const childDirection = resolveChildDirection(def, node.props)

  const childCtx: TemplateCtx | undefined = def.templateChild
    ? { type: def.templateChild.type, id: firstDescendantOfType(tree, node.id, def.templateChild.type) }
    : templateCtx
  const children = node.childIds
    .map((id) => tree[id])
    .filter((c): c is BlockNode => Boolean(c))
    // Ist dieser Knoten eine FLAECHE, liegen seine Kinder in Zellen: die
    // Ansicht gibt die Rasterebene der Maskenwurzel durch (sie hat keinen
    // eigenen Kasten, display:contents), das Popup oeffnet mit seinem Rumpf
    // eine EIGENE Flaeche (C2). Alles andere reicht Fluss weiter. Gefragt wird
    // die eine Stelle, die auch `Editor.addBlock` und der Canvas fragen —
    // wuerde der Export hier eigenstaendig raten, saessen die Bausteine in
    // SoftEngine woanders als im Editor (Regel 1).
    .map((c) => nodeToHtml(tree, c, childDirection, depth + 1, popupName, spaltenIndex, sources, childCtx, istRasterFlaeche(node)))
    .filter((html) => html !== '')
    .join('\n')
  return children === ''
    ? `${open}</${def.tagName}>`
    : `${open}\n${children}\n${pad}</${def.tagName}>`
}

export function exportMask(
  tree: BlockTree,
  title = 'Maske',

  sources: readonly DataSource[] = dataSourceStore.list,

  relations: readonly RelationTemplate[] = relationStore.list,
): MaskExport {
  const root = tree[ROOT_ID]

  const seitenNameById = new Map(seitenDerMaske(tree).map((s) => [s.id, s.name]))
  const popupName = (id: string): string => seitenNameById.get(id) ?? ''
  const spaltenIndex = spaltenIndexFuer(tree)

  const blocks = (root?.childIds ?? [])
    .map((id) => tree[id])
    .filter((n): n is BlockNode => Boolean(n))
    // Direkte Wurzel-Kinder = Raster-Ebene (rasterEbene=true).
    .map((n) => nodeToHtml(tree, n, 'column', 2, popupName, spaltenIndex, sources, undefined, true))
    .join('\n')

  // Eindeutige Namen VOR beiden Verbrauchern: die SEFILELOOP-Bestellung
  // (baueSevariablen) und FF_DATA_SOURCES muessen denselben Namen tragen,
  // sonst sucht die Laufzeit einen Alias, den SoftEngine nie geliefert hat.
  const used = mitEindeutigenNamen(collectDataSources(tree, sources))

  const benutzteFelder = benutzteFelderJeQuelle(tree, sources)

  const holSchluessel = holSchluesselJeGeber(used)
  const usedRelations = collectRelations(tree, relations, used)

  const tokensCss = stripCssComments(tokensCssRaw)
  const runtimeJs = guardScriptContent(escapeNonAsciiJs(runtimeJsRaw.trim()))

  const sourcesJs = guardJsonScript(escapeNonAsciiJs(
    'window.FF_DATA_SOURCES = ' + JSON.stringify(used.map((s) => {
      const lade = ladeRelationFor(s)
      const hol = holWertFor(s)
      return {
        id: s.id,
        name: s.name,
        tableId: tableIdFor(s),
        indexField: satzNummerVon(s),
        ...(istOffenerSatz(s) ? { offenerSatz: true } : {}),
        ...(lade
          ? { ladeRelation: { ...lade, zusatzFelder: felderHinterSchnitt(benutzteFelder.get(s.id)) } }
          : {}),
        // Die Feldnamen reisen mit: nur so weiss der Wert-Lader, unter
        // welchem Namen die Antwort abzulegen ist.
        ...(hol ? { holWert: { ...hol, felder: s.fields.map((f) => f.code) } } : {}),
      }
    })) + ';',
  ))

  const relationsJs = guardJsonScript(escapeNonAsciiJs(
    'window.FF_RELATIONS = ' + JSON.stringify(usedRelations.map((r) => ({
      id: r.id,
      verb: r.verb,
      nr: r.nr,
      params: r.params,
      allowExtraParams: r.allowExtraParams === true,
    }))) + ';',
  ))

  const randLinks = randPlatzLinks(tree)
  const wurzelPadding = randLinks === 0
    ? `${ROOT_FLOW.padding}px`
    : `${ROOT_FLOW.padding}px ${ROOT_FLOW.padding}px ${ROOT_FLOW.padding}px ${ROOT_FLOW.padding + randLinks}px`

  const html = [
    '<!--SOFTENGINE-VAR!JWHtmlStart-->',
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '<meta charset="UTF-8" />',
    `<title>${escapeHtmlText(title)}</title>`,
    SE_INTERFACE_SCRIPT,
    '<style>',
    tokensCss,
    '',
    '/* Grundgeruest + Wurzel-Raster (identisch zum Editor-Canvas, rasterFlaecheStyle) */',
    'html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }',
    'body { background: var(--se-bg); font-family: var(--se-font); font-size: var(--se-fs); line-height: var(--se-lh); color: var(--se-ink); }',
    `.ff-root { box-sizing: border-box; width: 100%; height: 100%; overflow: auto; ${rasterFlaecheCss()}; padding: ${wurzelPadding}; }`,
    '</style>',
    '</head>',
    '<body>',
    '  <div class="ff-root">',
    blocks,
    '  </div>',
    '<script>',
    sourcesJs,
    relationsJs,
    runtimeJs,
    '</script>',
    '</body>',
    '</html>',
    '<!--SOFTENGINE-VAR!JWHtmlEnde-->',
  ].join('\n')

  const sevariablen = baueSevariablen(used, benutzteFelder, holSchluessel)

  return { html, sevariablen }
}
