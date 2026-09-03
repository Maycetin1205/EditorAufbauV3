import type { BlockDefinition } from '../../core/blocks/BlockDefinition'
import { getAllBlockDefinitions } from '../../core/blocks/blockRegistry'
import { propertySichtbar } from '../../core/blocks/PropertyDescription'
import { QUELLE_PROP } from '../../core/blocks/quelleProp'
import { ACTION_VALUE_ID_ATTR } from '../../core/data/aktionen'
import { hasSeData, onSeDaten, seGlobal } from '../../softengine/bridge'
import { findRuntimeDataSource, isRecord } from '../../softengine/data'
import { ladeZeilenPerRelation } from '../../softengine/relationLader'
import { holeWertQuelle } from '../../softengine/wertLader'
import {
  aufAuswahlHoeren,
  auswahlFuer,
  auswahlNummer,
  beimAuswahlZuruecksetzen,
  geberIdVon,
  merkmalVon,
} from './auswahl'

const letzterAbdruck = new Map<string, string>()
// Die Bremse gegen Kreis-Feuer: je Quelle die Abdruecke, die OHNE Bedienung
// (aus der Hydrier-Kette heraus) schon geladen wurden. Jeder darf so nur
// EINMAL laden — erst ein echter Zeilenklick setzt die Spur zurueck. Ohne
// das schaukelten sich zwei Geber derselben Quelle gegenseitig hoch: Laden ->
// Hydrieren -> anderer Geber gewinnt -> Laden -> ... im Halbsekundentakt
// gegen das ERP (Nutzer-Log 2026-09-01).
const stillGeladen = new Map<string, Set<string>>()
let verdrahtet = false

export function defsMitSatzWahl(): Map<string, BlockDefinition> {
  const map = new Map<string, BlockDefinition>()
  for (const def of getAllBlockDefinitions()) {
    if (def.satzWahl) map.set(def.tagName.toLowerCase(), def)
  }
  return map
}

// Welches Attribut DIESES Elements die Geber-Quelle nennt — dieselbe Regel
// wie auswahlQuelleIdVon im Editor: die wenn-Bedingung der satzWahl waehlt
// nur die Eigenschaft, erfuellt das Element sie nicht, gilt `source`. Vorher
// galt je Tag pauschal die quelleProp; ein TEXT-Formularfeld mit uebrig
// gebliebener Nachschlage-Quelle wurde so zum falschen Geber der Beleg-Quelle
// und Relation 69 fragte Datenmuell ab (Nutzer-Befund 2026-09-01). Der Export
// laesst Standardwerte weg, darum springt fuer ein fehlendes Attribut der
// defaultProps-Wert ein.
export function quellenAttrFuer(el: Element, def: BlockDefinition): string {
  const wahl = def.satzWahl
  if (!wahl) return ''
  let aktiv = true
  if (wahl.wenn) {
    const name = wahl.wenn.attributeName
    const wert = el.getAttribute(name.toLowerCase()) ?? def.defaultProps[name]
    aktiv = propertySichtbar(wahl.wenn, { [name]: wert })
  }
  return (aktiv ? wahl.quelleProp ?? QUELLE_PROP : QUELLE_PROP).toLowerCase()
}

// Der letzte Klick gewinnt: zeigen mehrere Bausteine dieselbe Quelle, gilt die
// juengste Auswahl. Frueher nahm diese Stelle den ersten Baustein in
// DOM-Reihenfolge — damit bestimmte bei zwei Tabellen derselben Quelle der
// Zufall des Aufbaus, welche Zeile geholt wurde. Wird die juengste Wahl
// abgewaehlt, faellt sie auf die naechstjuengere zurueck (ihr Eintrag ist weg).
// Die Wurzel ist uebergebbar wie bei applyPopupStep — so ist die Auswahl ohne
// Fenster pruefbar; im Produkt sucht sie im Dokument.
export function gewaehlteZeileDerQuelle(
  quelleId: string,
  defsJeTag: Map<string, BlockDefinition>,
  wurzel: ParentNode | undefined = typeof document === 'undefined' ? undefined : document,
): unknown {
  if (quelleId === '' || wurzel === undefined) return undefined
  let juengste: { zeile: unknown; nummer: number } | null = null
  for (const el of Array.from(wurzel.querySelectorAll(`[${ACTION_VALUE_ID_ATTR}]`))) {
    const def = defsJeTag.get(el.tagName.toLowerCase())
    if (!def) continue
    const attr = quellenAttrFuer(el, def)
    if (attr === '' || el.getAttribute(attr) !== quelleId) continue
    const geberId = geberIdVon(el)
    const zeile = auswahlFuer(geberId)
    if (zeile === undefined) continue
    const nummer = auswahlNummer(geberId)
    if (juengste === null || nummer > juengste.nummer) juengste = { zeile, nummer }
  }
  return juengste?.zeile
}

// Die Lade-Entscheidung samt Bremse, als eigene Funktion pruefbar. Eine
// Bedienung laedt immer (und beginnt die Spur neu, mit sich selbst darin);
// eine Programm-Meldung laedt jeden Abdruck nur einmal — kommt derselbe
// wieder, ist das der Kreis, und es passiert nichts mehr.
export function darfLaden(quelleId: string, abdruck: string, durchBedienung: boolean): boolean {
  if (letzterAbdruck.get(quelleId) === abdruck) return false
  if (durchBedienung) {
    stillGeladen.set(quelleId, new Set([abdruck]))
  } else {
    const spur = stillGeladen.get(quelleId) ?? new Set<string>()
    if (spur.has(abdruck)) return false
    spur.add(abdruck)
    stillGeladen.set(quelleId, spur)
  }
  letzterAbdruck.set(quelleId, abdruck)
  return true
}

export function setzeLadeSpurZurueck(): void {
  letzterAbdruck.clear()
  stillGeladen.clear()
}

function pruefeHolendeQuellen(durchBedienung: boolean): void {
  const liste: unknown = seGlobal().FF_DATA_SOURCES
  if (!Array.isArray(liste)) return
  const defsJeTag = defsMitSatzWahl()
  for (const eintrag of liste) {
    if (!isRecord(eintrag) || typeof eintrag.id !== 'string') continue
    const quelle = findRuntimeDataSource(liste, eintrag.id)
    if (!quelle?.ladeRelation) continue
    const zeile = gewaehlteZeileDerQuelle(quelle.ladeRelation.geberQuelleId, defsJeTag)
    if (!darfLaden(quelle.id, merkmalVon(zeile), durchBedienung)) continue
    ladeZeilenPerRelation(quelle, quelle.ladeRelation, zeile)
  }
}

// Die Quellen, die EINEN Wert holen (Art „Wert per Relation"). Sie haengen an
// keiner Auswahl: ihr Anlass ist eine neue Lieferung von SoftEngine.
export function holeWertQuellen(): void {
  const liste: unknown = seGlobal().FF_DATA_SOURCES
  if (!Array.isArray(liste)) return
  for (const eintrag of liste) {
    if (!isRecord(eintrag) || typeof eintrag.id !== 'string') continue
    const quelle = findRuntimeDataSource(liste, eintrag.id)
    if (!quelle?.holWert) continue
    holeWertQuelle(quelle, quelle.holWert)
  }
}

export function verdrahteHolendeQuellen(): void {
  if (verdrahtet) return
  verdrahtet = true
  aufAuswahlHoeren(pruefeHolendeQuellen)

  // NUR bei einer echten Lieferung. Das Ablegen der Antwort stoesst selbst an
  // (meldeAnstoss), und ein Anstoss, der wieder holt, ist genau der Kreis vom
  // 2026-09-01 — hier waere er sogar unbremsbar, weil der Ruf keine Auswahl
  // hat, an der ein Abdruck haengen koennte.
  onSeDaten((lieferung) => { if (lieferung) holeWertQuellen() })

  // Stand die Lieferung schon, als der erste Baustein sich anschloss, kommt
  // fuer sie kein `lieferung`-Ruf mehr.
  if (hasSeData()) holeWertQuellen()
  // Faellt die Auswahl komplett weg, muss der Abdruck mit weg: sonst gilt der
  // alte Stand weiter als "schon geholt" und es wird nichts mehr neu geholt.
  beimAuswahlZuruecksetzen(setzeLadeSpurZurueck)
}
