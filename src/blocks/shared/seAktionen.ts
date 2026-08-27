import { ACTION_VALUE_ID_ATTR, parseBlockEvents, type RuntimeStep } from '../../core/data/aktionen'
import type {
  AenderungsTraegerElement,
  ErfassungsTraegerElement,
  LoeschTraegerElement,
} from '../../core/blocks/BlockDefinition'
import { auswahlFuer } from './auswahl'
import { PopupBlock } from '../popup/PopupBlock'
import {
  formatNowDate,
  resolveParams,
  type RelationContext,
} from '../../core/data/relations'
import { bootSe, frischeDatenAnfordern, seGlobal } from '../../softengine/bridge'
import { meldeFehler } from '../../softengine/meldung'
import {
  executeRelation,
  findRuntimeRelation,
  resolveActionParam,
} from '../../softengine/relations'

export function buildStartToolLink(nr: string, params: readonly string[]): string {
  let link = '0,START_TOOL,' + nr
  if (params.length > 0) {
    link += ',' + params.map((p) => encodeURIComponent(p)).join(',')
  }
  return link
}

function seBwLink(befehl: string): void {
  const zeile = befehl.trim()
  if (zeile === '') return
  const g = seGlobal()
  try {
    if (typeof g.sendBWLink === 'function') {
      g.sendBWLink(zeile)
      return
    }
  } catch { /* faellt auf den internen Weg zurueck */ }
  try {
    if (typeof g.sendBWLinkIntern === 'function') g.sendBWLinkIntern(zeile)
  } catch { /* nicht in SE */ }
}

function seStartTool(nr: string, params: readonly string[]): void {
  if (nr.trim() === '') return
  const g = seGlobal()
  try {
    if (typeof g.sendBWLinkIntern === 'function') {
      g.sendBWLinkIntern(buildStartToolLink(nr, params))
      return
    }
  } catch { /* faellt auf den obj-Weg zurueck, wie die Referenz */ }
  try {
    if (typeof g.basisHTML_SND_MSG === 'function') {
      const obj: Record<string, unknown> = { NR: nr }
      if (params.length > 0) obj.PARAMS = [...params]
      g.basisHTML_SND_MSG('START_TOOL', obj)
    }
  } catch { /* nicht in SE */ }
}

export function applyPopupStep(root: ParentNode, name: string, oeffnen: boolean): void {
  if (name.trim() === '') return
  const alle = Array.from(root.querySelectorAll(PopupBlock.tagName))

  const treffer = alle.filter(
    (el) => (el.getAttribute('name') ?? PopupBlock.defaultProps.name) === name,
  )
  if (treffer.length === 0) {
    meldeFehler('Fenster „' + name + '“ gibt es in dieser Maske nicht.')
    return
  }
  if (treffer.length > 1) {
    meldeFehler('Fenster „' + name + '“ gibt es mehrfach — keines ist gemeint.')
    return
  }
  const ziel = treffer[0]
  if (!oeffnen) {
    ziel.removeAttribute('offen')
    return
  }
  for (const el of alle) {
    if (el !== ziel) el.removeAttribute('offen')
  }
  ziel.setAttribute('offen', '')
}

const laufend = new WeakMap<HTMLElement, Set<string>>()

export function meldeKettenFehler(fehler: unknown): void {
  const text = fehler instanceof Error ? fehler.message : String(fehler)
  meldeFehler('Aktionskette fehlgeschlagen: ' + text)
}

type ListenArt = 'einmal' | 'erfasst' | 'geaendert' | 'geloescht'

const ZELLEN_HERKUNFT: Record<string, ListenArt> = {
  erfassungszelle: 'erfasst',
  aenderungszelle: 'geaendert',
  loeschzelle: 'geloescht',
}

interface Abschnitt {
  art: ListenArt

  // Der Baustein, dessen Liste den Takt gibt. Leer bei 'einmal'.
  blockId: string

  // Die Plaetze IN DER GANZEN KETTE — die Schrittzahl bleibt dadurch
  // stabil, auch wenn nur ein Teil laeuft.
  plaetze: Set<number>
}

// Woher DIESER Schritt seine Zellen liest. Kein Bausteintyp kommt vor: es
// zaehlt allein, was in seinen Parametern steht (Regel 2).
function zeilenBezug(step: RuntimeStep): { art: ListenArt; blockId: string } | null {
  if (step.type !== 'RELATION') return null
  let treffer: { art: ListenArt; blockId: string } | null = null
  for (const binding of [...step.params, ...step.extraParams]) {
    const art = ZELLEN_HERKUNFT[binding.source]
    const blockId = binding.blockId ?? ''
    if (art === undefined || blockId === '') continue
    if (treffer && (treffer.art !== art || treffer.blockId !== blockId)) {
      return { art, blockId: '' } // zwei Listen in EINEM Schritt -> unten Fehler
    }
    treffer = { art, blockId }
  }
  return treffer
}

// Aufeinanderfolgende Schritte gehoeren zusammen. Ein Schritt ohne
// Zeilen-Bezug haengt sich an den laufenden Abschnitt an — sonst risse das
// Muster „Satz anlegen, dann seine Felder schreiben" auseinander, in dem der
// zweite Schritt vom Ergebnis des ersten lebt.
function abschnitteVon(steps: readonly RuntimeStep[]): Abschnitt[] {
  const raus: Abschnitt[] = []
  for (const [platz, step] of steps.entries()) {
    const bezug = zeilenBezug(step)
    const letzter = raus[raus.length - 1]
    if (bezug === null) {
      if (letzter) letzter.plaetze.add(platz)
      else raus.push({ art: 'einmal', blockId: '', plaetze: new Set([platz]) })
      continue
    }
    if (letzter && letzter.art === bezug.art && letzter.blockId === bezug.blockId) {
      letzter.plaetze.add(platz)
      continue
    }
    raus.push({ art: bezug.art, blockId: bezug.blockId, plaetze: new Set([platz]) })
  }
  return raus
}

function sucheTraeger(
  root: ParentNode,
  blockId: string,
): (HTMLElement
  & Partial<ErfassungsTraegerElement>
  & Partial<AenderungsTraegerElement>
  & Partial<LoeschTraegerElement>)
  | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>(`[${ACTION_VALUE_ID_ATTR}]`))
    .find((el) => el.getAttribute(ACTION_VALUE_ID_ATTR) === blockId)
}

async function laufeSchritte(
  el: HTMLElement,
  steps: readonly RuntimeStep[],
  context: RelationContext,
  zeilenZelle: ((blockId: string, spaltenIndex: number) => string) | undefined,

  // Welche Schritte in DIESEM Lauf drankommen (Platz in der Kette).
  // undefined = alle.
  nur?: ReadonlySet<number>,
): Promise<boolean> {
  let geschrieben = false
  const values: Record<string, string | undefined> = {
    ...context,
    NOW_DATE: formatNowDate(new Date()),
  }
  let previousResult = ''

  const stepResults: string[] = []

  const rohErgebnisse: unknown[] = []
  const ohneErgebnis = (): void => {
    stepResults.push('')
    rohErgebnisse.push(undefined)
  }
  for (const [platz, step] of steps.entries()) {
    if (nur && !nur.has(platz)) {
      ohneErgebnis()
      continue
    }
    if (step.type === 'START_TOOL') {
      seStartTool(step.toolNr, resolveParams({ params: step.toolParams }, values))
      ohneErgebnis()
      continue
    }
    if (step.type === 'BW_LINK') {
      seBwLink(resolveParams({ params: [step.befehl] }, values)[0] ?? '')
      ohneErgebnis()
      continue
    }
    if (step.type === 'POPUP_OPEN' || step.type === 'POPUP_CLOSE') {
      applyPopupStep(el.ownerDocument ?? document, step.popup ?? '', step.type === 'POPUP_OPEN')
      ohneErgebnis()
      continue
    }
    const relation = findRuntimeRelation(seGlobal().FF_RELATIONS, step.relationId)
    if (!relation) {
      ohneErgebnis()
      continue
    }

    const runtimeValues = {
      context: values,
      previousResult,
      stepResults,
      stepRohErgebnisse: rohErgebnisse,
      gewaehlteZeile: auswahlFuer,
      ...(zeilenZelle ? { zeilenZelle } : {}),
    }
    const params = [...step.params, ...step.extraParams]
      .map((binding) => resolveActionParam(binding, runtimeValues))
    const antwort = await executeRelation(relation, params)
    const result = antwort.wert
    stepResults.push(result)
    rohErgebnisse.push(antwort.roh)

    if (relation.verb === 'GET_RELATION') previousResult = result
    else geschrieben = true
    if (step.resultKey !== '') values[step.resultKey] = result
  }
  return geschrieben
}

export async function runEvent(
  el: HTMLElement,
  eventKey: string,
  context: RelationContext,
): Promise<void> {
  if (el.hasAttribute('data-ff-editor')) return
  const steps = parseBlockEvents(el.getAttribute('data-ff-aktionen'))[eventKey]
  if (!steps || steps.length === 0) return

  let locks = laufend.get(el)
  if (!locks) {
    locks = new Set()
    laufend.set(el, locks)
  }
  if (locks.has(eventKey)) return
  locks.add(eventKey)
  try {
    const abschnitte = abschnitteVon(steps)
    const gelaufen: { traeger: HTMLElement & Partial<ErfassungsTraegerElement>
      & Partial<AenderungsTraegerElement> & Partial<LoeschTraegerElement>;
      art: ListenArt }[] = []
    let geschrieben = false

    for (const abschnitt of abschnitte) {
      if (abschnitt.art === 'einmal') {
        if (await laufeSchritte(el, steps, context, undefined, abschnitt.plaetze)) {
          geschrieben = true
        }
        continue
      }
      if (abschnitt.blockId === '') {
        meldeFehler('Ein Schritt liest Zellen aus zwei verschiedenen Listen — das geht nicht.')
        return
      }
      const traeger = sucheTraeger(el.ownerDocument ?? document, abschnitt.blockId)
      const roh = abschnitt.art === 'erfasst'
        ? traeger?.erfassteZeilen
        : abschnitt.art === 'geaendert'
          ? traeger?.geaenderteZeilen
          : traeger?.geloeschteZeilen
      if (!traeger || !Array.isArray(roh)) {
        meldeFehler('Den Baustein, dessen Zellen die Kette liest, gibt es in dieser Maske nicht.')
        return
      }
      // Beide Listen in EINER Form: Werte je Spalte, dazu die Satznummer, wo
      // es eine gibt (geaenderte Zeile).
      const zeilen: { satz: string; werte: readonly string[] }[] = abschnitt.art === 'erfasst'
        ? (roh as readonly (readonly string[])[]).map((werte) => ({ satz: '', werte }))
        : (roh as readonly { satz: string; werte: readonly string[] }[])
          .map((z) => ({ satz: z.satz, werte: z.werte }))
      // Keine Zeile: nichts zu schreiben, kein Lauf. Kein Fehler — der
      // Bediener sieht in der Tabelle, dass nichts ansteht.
      for (const zeile of zeilen) {
        const zeilenKontext = zeile.satz === '' ? context : { ...context, PINDEX: zeile.satz }
        if (await laufeSchritte(el, steps, zeilenKontext, (blockId, spaltenIndex) =>
          (blockId === abschnitt.blockId ? String(zeile.werte[spaltenIndex] ?? '') : ''),
        abschnitt.plaetze)) {
          geschrieben = true
        }
      }
      if (zeilen.length > 0) gelaufen.push({ traeger, art: abschnitt.art })
    }
    // Geleert wird erst, wenn ALLE Abschnitte durch sind: ein spaeterer
    // Abschnitt kann dieselbe Liste noch einmal lesen.
    for (const { traeger, art } of gelaufen) {
      if (art === 'erfasst') traeger.erfassungLeeren?.()
      else if (art === 'geaendert') traeger.aenderungenLeeren?.()
      else traeger.loeschungenLeeren?.()
    }
    // Geschrieben heisst: der Stand auf dem Schirm ist von gestern. Die Maske
    // holt sich den neuen — ohne dass jemand eine Kette dafuer bauen muss.
    if (geschrieben) frischeDatenAnfordern()
  } finally {
    locks.delete(eventKey)
  }
}

const verdrahtet = new WeakSet<HTMLElement>()

export function connectClickAktionen(el: HTMLElement, eventKey: string): void {
  if (el.hasAttribute('data-ff-editor')) return
  if (!el.hasAttribute('data-ff-aktionen')) return
  if (verdrahtet.has(el)) return
  verdrahtet.add(el)
  const chains = parseBlockEvents(el.getAttribute('data-ff-aktionen'))
  if (Object.values(chains).some((steps) => steps.some((step) => step.type === 'RELATION'))) {
    bootSe()
  }
  el.addEventListener('click', () => {
    runEvent(el, eventKey, {}).catch(meldeKettenFehler)
  })
}
