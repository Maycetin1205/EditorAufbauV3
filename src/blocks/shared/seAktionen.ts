import { ACTION_VALUE_ID_ATTR, parseBlockEvents, type RuntimeStep } from '../../core/data/aktionen'
import type {
  AenderungsTraegerElement,
  ErfassungsTraegerElement,
  LaufBerichtElement,
  LoeschTraegerElement,
  VormerkArt,
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

type ListenArt = 'einmal' | VormerkArt

const ZELLEN_HERKUNFT: Record<string, VormerkArt> = {
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
function zeilenBezug(step: RuntimeStep): { art: VormerkArt; blockId: string } | null {
  if (step.type !== 'RELATION') return null
  let treffer: { art: VormerkArt; blockId: string } | null = null
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
export function abschnitteVon(steps: readonly RuntimeStep[]): Abschnitt[] {
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

// Was ein Baustein KANN, steht in seiner Deklaration — hier ist jedes Stueck
// des Vertrags optional, damit die Kette auch einen Baustein bedienen kann,
// der nur eine der drei Listen fuehrt.
type ZeilenTraeger = HTMLElement
  & Partial<ErfassungsTraegerElement>
  & Partial<AenderungsTraegerElement>
  & Partial<LoeschTraegerElement>
  & Partial<LaufBerichtElement>

// Die EINE Stelle, die data-ff-block-id in ein Element aufloest.
export function sucheTraeger(root: ParentNode, blockId: string): ZeilenTraeger | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>(`[${ACTION_VALUE_ID_ATTR}]`))
    .find((el) => el.getAttribute(ACTION_VALUE_ID_ATTR) === blockId)
}

// Eine Zeile, wie die Kette sie abarbeitet. satz ist die Satznummer ({PINDEX})
// und leer, solange die Zeile im ERP nicht existiert; schluessel ist ihre
// Kennung im Bericht und immer gesetzt.
interface LaufZeile {
  satz: string
  schluessel: string
  werte: readonly string[]
}

export interface LaufErgebnis {
  geschrieben: boolean

  // Leer = durchgelaufen. Sonst der Klartext, an dem es haengengeblieben ist.
  fehler: string

  mitschrift: Mitschrift
}

// Was ein Lauf an Ergebnissen hinterlaesst. Sie reisen von einem Abschnitt in
// den naechsten: eine Kette „einmal die Belegnummer holen, dann je Zeile eine
// Position schreiben" besteht aus ZWEI Abschnitten, und ohne das Weiterreichen
// bekaeme der Schreib-Schritt fuer „Ergebnis von Schritt 1" nichts — still,
// ohne Meldung, mit einem leeren Parameter im PUT.
//
// Weitergereicht wird nur, was ein EINMAL-Abschnitt hinterlaesst. Was eine
// Zeile erarbeitet, gehoert ihr allein: sonst saehe Zeile 2 die Ergebnisse
// von Zeile 1.
export interface Mitschrift {
  values: Record<string, string | undefined>

  // Nach Platz IN DER GANZEN KETTE, damit „Ergebnis von Schritt N" ueber
  // Abschnittsgrenzen hinweg dieselbe Zahl meint.
  stepResults: readonly string[]

  rohErgebnisse: readonly unknown[]

  previousResult: string
}

function zeilenDerListe(traeger: ZeilenTraeger, art: VormerkArt): LaufZeile[] | undefined {
  if (art === 'erfasst') {
    const roh = traeger.erfassteZeilen
    if (!Array.isArray(roh)) return undefined
    const kennungen = traeger.erfassteSchluessel
    return roh.map((werte, platz) => ({
      satz: '',
      schluessel: Array.isArray(kennungen) ? (kennungen[platz] ?? String(platz)) : String(platz),
      werte,
    }))
  }
  const roh = art === 'geaendert' ? traeger.geaenderteZeilen : traeger.geloeschteZeilen
  if (!Array.isArray(roh)) return undefined
  return roh.map((z) => ({ satz: z.satz, schluessel: z.satz, werte: z.werte }))
}

// Die Satznummer der Zeile, die gerade dran ist. Beim Loeschen zusaetzlich als
// {DROP_PINDEX}: eine Loesch-Relation nennt ihre Satznummer anders als eine
// Schreib-Relation, und der Bediener soll den Unterschied nicht kennen muessen.
function zeilenKontext(
  context: RelationContext,
  art: VormerkArt,
  zeile: LaufZeile,
): RelationContext {
  if (zeile.satz === '') return context
  if (art === 'geloescht') {
    return { ...context, PINDEX: zeile.satz, DROP_PINDEX: zeile.satz }
  }
  return { ...context, PINDEX: zeile.satz }
}

export async function laufeSchritte(
  el: HTMLElement,
  steps: readonly RuntimeStep[],
  context: RelationContext,
  zeilenZelle: ((blockId: string, spaltenIndex: number) => string) | undefined,

  // Welche Schritte in DIESEM Lauf drankommen (Platz in der Kette).
  // undefined = alle.
  nur?: ReadonlySet<number>,

  // Was frueheren Abschnitte hinterlassen haben (s. Mitschrift).
  start?: Mitschrift,
): Promise<LaufErgebnis> {
  let geschrieben = false
  const values: Record<string, string | undefined> = {
    ...start?.values,
    ...context,
    NOW_DATE: formatNowDate(new Date()),
  }
  let previousResult = start?.previousResult ?? ''

  // Voll besetzt statt angehaengt: ein uebersprungener Schritt darf nicht das
  // Ergebnis ueberschreiben, das ein frueherer Abschnitt an seinem Platz
  // hinterlassen hat.
  const stepResults: string[] = steps.map((_, i) => start?.stepResults[i] ?? '')

  const rohErgebnisse: unknown[] = steps.map((_, i) => start?.rohErgebnisse[i])
  const mitschrift = (): Mitschrift => ({
    values, stepResults, rohErgebnisse, previousResult,
  })
  for (const [platz, step] of steps.entries()) {
    if (nur && !nur.has(platz)) continue
    if (step.type === 'START_TOOL') {
      seStartTool(step.toolNr, resolveParams({ params: step.toolParams }, values))
      continue
    }
    if (step.type === 'BW_LINK') {
      seBwLink(resolveParams({ params: [step.befehl] }, values)[0] ?? '')
      continue
    }
    if (step.type === 'POPUP_OPEN' || step.type === 'POPUP_CLOSE') {
      applyPopupStep(el.ownerDocument ?? document, step.popup ?? '', step.type === 'POPUP_OPEN')
      continue
    }
    const relation = findRuntimeRelation(seGlobal().FF_RELATIONS, step.relationId)
    if (!relation) continue

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
    stepResults[platz] = result
    rohErgebnisse[platz] = antwort.roh

    if (relation.verb === 'GET_RELATION') previousResult = result
    else geschrieben = true
    // Der Ruf ging nicht hinaus oder blieb unbeantwortet. Weiterlaufen hiesse,
    // die naechsten Schritte auf ein Ergebnis zu setzen, das es nicht gibt.
    if (antwort.fehler !== undefined && antwort.fehler !== '') {
      return { geschrieben, fehler: antwort.fehler, mitschrift: mitschrift() }
    }
    if (step.resultKey !== '') values[step.resultKey] = result
  }
  return { geschrieben, fehler: '', mitschrift: mitschrift() }
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
    const berichte: { traeger: ZeilenTraeger; art: VormerkArt; fertige: string[] }[] = []
    let geschrieben = false
    let abgebrochen = false

    // Was die Einmal-Abschnitte erarbeitet haben, reist mit: „Ergebnis von
    // Schritt N" muss auch in den Zeilen-Schritten etwas liefern.
    let mitschrift: Mitschrift | undefined
    for (const abschnitt of abschnitte) {
      if (abschnitt.art === 'einmal') {
        const ergebnis = await laufeSchritte(
          el, steps, context, undefined, abschnitt.plaetze, mitschrift,
        )
        mitschrift = ergebnis.mitschrift
        if (ergebnis.geschrieben) geschrieben = true
        if (ergebnis.fehler !== '') { abgebrochen = true; break }
        continue
      }
      if (abschnitt.blockId === '') {
        meldeFehler('Ein Schritt liest Zellen aus zwei verschiedenen Listen — das geht nicht.')
        break
      }
      const traeger = sucheTraeger(el.ownerDocument ?? document, abschnitt.blockId)
      const zeilen = traeger && zeilenDerListe(traeger, abschnitt.art)
      if (!traeger || !zeilen) {
        meldeFehler('Den Baustein, dessen Zellen die Kette liest, gibt es in dieser Maske nicht.')
        break
      }
      // Keine Zeile: nichts zu schreiben, kein Lauf. Kein Fehler — der
      // Bediener sieht in der Tabelle, dass nichts ansteht.
      if (zeilen.length === 0) continue
      const bericht = { traeger, art: abschnitt.art, fertige: [] as string[] }
      berichte.push(bericht)
      for (const zeile of zeilen) {
        traeger.zeileSchreibt?.(abschnitt.art, zeile.schluessel)
        // Die Mitschrift wird hier nur GELESEN: was eine Zeile erarbeitet,
        // gehoert ihr allein — sonst saehe Zeile 2 die Ergebnisse von Zeile 1.
        const ergebnis = await laufeSchritte(el, steps, zeilenKontext(context, abschnitt.art, zeile),
          (blockId, spaltenIndex) =>
            (blockId === abschnitt.blockId ? String(zeile.werte[spaltenIndex] ?? '') : ''),
          abschnitt.plaetze, mitschrift)
        if (ergebnis.geschrieben) geschrieben = true
        // Haengengeblieben: die Zeile behaelt ihre Vormerkung und traegt die
        // Meldung. Die Zeilen dahinter bleiben unangetastet stehen — sonst
        // naehme ein Fehler in Zeile 3 auch den Zeilen 4-10 ihre Chance.
        if (ergebnis.fehler !== '') {
          traeger.zeileGescheitert?.(abschnitt.art, zeile.schluessel, ergebnis.fehler)
          abgebrochen = true
          break
        }
        bericht.fertige.push(zeile.schluessel)
      }
      if (abgebrochen) break
    }
    // Ausgetragen wird erst, wenn ALLE Abschnitte durch sind: ein spaeterer
    // Abschnitt kann dieselbe Liste noch einmal lesen.
    for (const { traeger, art, fertige } of berichte) traeger.laufFertig?.(art, fertige)
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
