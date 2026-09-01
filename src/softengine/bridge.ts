import { isRecord, messagePayload, payloadDaten, type UnknownRecord } from './data'

import { meldeFehler } from './meldung'

/* eslint-disable @typescript-eslint/no-explicit-any -- SEDATA/selib sind
   fremde, untypisierte SoftEngine-Globals (Formen siehe Referenzmaske). */
export function seGlobal(): any {
  return globalThis as any
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function hasSeData(): boolean {
  const g = seGlobal()
  return isRecord(g.SEDATA) && isRecord(g.SEDATA.Daten)
}

function tryInitSe(): void {
  const g = seGlobal()
  try { g.selib?.Json?.InitializeERPConnection?.() } catch { /* nicht in SE */ }
  try { if (typeof g.InitialisiereSchnittstelle === 'function') g.InitialisiereSchnittstelle() } catch { /* s.o. */ }
}

function refreshDataBasis(): void {
  const g = seGlobal()
  try { if (typeof g.ResetDataBasis === 'function') g.ResetDataBasis() } catch { /* nicht in SE */ }
  try { if (typeof g.InitialisiereDatenBasis === 'function') g.InitialisiereDatenBasis() } catch { /* s.o. */ }
}

// Der Schalter sagt, ob wirklich NEUE Daten da sind. Nur dann darf eine
// geschriebene Zeile aus der Maske verschwinden: ein blosser Anstoss
// (meldeAnstoss, frischeDatenAnfordern) beweist keine Lieferung.
const zuhoerer = new Set<(lieferung: boolean) => void>()
const antwortZuhoerer = new Set<(raw: unknown) => void>()

// Die ERP schiebt weiter, waehrend der Bediener tippt. Zeichnete die Maske
// dabei neu, spraenge ihm die Schreibmarke aus der Zelle. Belegt an der
// Handmaske Rahmen00001 V11: sie merkt sich den Push und wendet ihn erst an,
// wenn kein Feld mehr den Fokus hat (dort mit 800 ms Nachlauf).
const NACHLAUF_MS = 800

let ausstehend = false
let ausstehendeLieferung = false
let nachlauf: ReturnType<typeof setInterval> | null = null

// Das wirklich fokussierte Element — durch die Schatten-Wurzeln hindurch,
// denn jeder Baustein traegt seine Eingaben in seiner eigenen.
function tiefstesAktives(): Element | null {
  let el: Element | null = document.activeElement
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement
  return el
}

export function fokusBeiUns(): boolean {
  const el = tiefstesAktives()
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable
    || el instanceof HTMLInputElement
    || el instanceof HTMLTextAreaElement
    || el instanceof HTMLSelectElement
}

function nachlaufStarten(): void {
  if (nachlauf !== null) return
  nachlauf = setInterval(() => {
    if (fokusBeiUns()) return
    nachlaufBeenden()
    if (!ausstehend) return
    ausstehend = false
    const lief = ausstehendeLieferung
    ausstehendeLieferung = false
    verteile(lief)
  }, NACHLAUF_MS)
}

function nachlaufBeenden(): void {
  if (nachlauf === null) return
  clearInterval(nachlauf)
  nachlauf = null
}

export function onSeDaten(cb: (lieferung: boolean) => void): void {
  zuhoerer.add(cb)
}

export function onSeAntwort(cb: (raw: unknown) => void): () => void {
  antwortZuhoerer.add(cb)
  return () => { antwortZuhoerer.delete(cb) }
}

// Ein werfender Baustein darf weder die uebrigen Zuhoerer abschneiden noch
// den Empfang stilllegen. Er meldet nur, dass diese Runde unvollstaendig war:
// dann bleibt die Signatur ungesetzt und derselbe Stand wird beim naechsten
// Schub noch einmal verteilt, statt als schon gezeigt verworfen zu werden.
function verteile(lieferung: boolean): void {
  let vollstaendig = true
  zuhoerer.forEach((cb) => {
    try { cb(lieferung) } catch { vollstaendig = false }
  })
  if (vollstaendig && offeneSignatur !== null) letzteSignatur = offeneSignatur
  offeneSignatur = null
}

function klingeln(lieferung: boolean): void {
  if (lieferung) ausstehendeLieferung = true
  if (fokusBeiUns()) {
    ausstehend = true
    nachlaufStarten()
    return
  }
  ausstehend = false
  const lief = ausstehendeLieferung
  ausstehendeLieferung = false
  verteile(lief)
}

// Anstoss OHNE Lieferungs-Beweis: die Maske zeichnet neu, aber kein Baustein
// darf daran etwas verwerfen (s. datenAnschluss). Eine Lieferung meldet allein
// der Push-Weg, der sie belegen kann.
export function meldeAnstoss(): void {
  klingeln(false)
}

// Nach dem Schreiben will der Bediener den neuen Stand sehen. SoftEngine
// schiebt von sich aus — wir stossen ihre Datenbasis an und zeichnen neu.
// ⚠ Ob der Anstoss SoftEngine wirklich zu einer neuen Lieferung bewegt, ist
// an KEINER echten Maske belegt (die Handmaske Rahmen00001 V11 schreibt gar
// nicht zurueck). Das gehoert in den SE-Echttest.
export function frischeDatenAnfordern(): void {
  refreshDataBasis()
  klingeln(false)
}

// „Sind das andere Daten als zuletzt?" — dieselbe Signatur wie im Push-Weg.
// SoftEngine ruft Erstellen/ReloadData auch dann, wenn sich nichts geaendert
// hat; daran darf keine hinausgeschickte Zeile verschwinden. Eine leere
// Signatur heisst „zu gross zum Vergleichen" und gilt als neu.
function datenSindNeu(): boolean {
  const g = seGlobal()
  const roh = isRecord(g.SEDATA) ? g.SEDATA.Daten : undefined
  if (!isRecord(roh)) return false
  const signatur = signaturVon(roh)
  if (signatur !== '' && signatur === letzteSignatur) return false
  offeneSignatur = signatur
  return true
}

function antwortKlingeln(raw: unknown): void {
  antwortZuhoerer.forEach((cb) => {
    try { cb(raw) } catch { /* ein Konsument darf den Empfang nie stoppen */ }
  })
}

// Jeder Push traegt den GANZEN Datenstand, auch wenn sich nichts geaendert
// hat — die Handmaske vergleicht deshalb eine Signatur und zeichnet nur bei
// echter Aenderung neu. Sehr grosse Staende werden nicht signiert (der
// Vergleich kostete dann mehr als das Neuzeichnen): eine leere Signatur
// heisst „unbekannt" und zeichnet immer.
const SIGNATUR_GRENZE = 2_000_000

let letzteSignatur = ''
let offeneSignatur: string | null = null

function signaturVon(daten: UnknownRecord): string {
  try {
    const roh = JSON.stringify(daten)
    return roh.length > SIGNATUR_GRENZE ? '' : roh
  } catch {
    return ''
  }
}

function seConsume(raw: unknown): void {
  const daten = payloadDaten(raw)
  if (!daten) {
    antwortKlingeln(raw)
    return
  }
  const g = seGlobal()
  if (!isRecord(g.SEDATA)) g.SEDATA = {}
  g.SEDATA.Daten = daten
  refreshDataBasis()

  const signatur = signaturVon(daten)
  if (signatur !== '' && signatur === letzteSignatur) return
  offeneSignatur = signatur
  klingeln(true)
}

function registerSe(tries = 0): void {
  const g = seGlobal()
  if (typeof g.basisHTML_REGISTER === 'function') {
    try { g.basisHTML_SetConsoleLog?.(true, true) } catch { /* optional */ }
    try {
      g.basisHTML_REGISTER((data: unknown) => { seConsume(data) }, document.title, '1.0')
      return
    } catch (error) {
      // Die Funktion ist da, aber das Interface noch nicht bereit: weiter
      // versuchen statt aufgeben — aufgegeben hiesse eine Maske ohne Daten.
      if (tries >= 400) {
        meldeFehler(
          'SoftEngine-Anmeldung fehlgeschlagen: '
          + (error instanceof Error ? error.message : String(error)),
        )
        return
      }
    }
  }
  if (tries < 400) {
    setTimeout(() => { registerSe(tries + 1) }, 25)
  } else {
    meldeFehler('SoftEngine-Anschluss nicht gefunden — die Maske bleibt ohne Daten.')
  }
}

// Gibt die ERP der Maske den Fokus, ruft sie basisHTML_DoSetFocusToHTML.
// Die Bruecke weiss NICHT, welcher Baustein ihn nimmt (Regel: softengine
// kennt keinen Baustein) — sie fragt per Ereignis. Wer ihn nimmt, ruft
// preventDefault; nimmt ihn keiner, faellt der Fokus an die ERP zurueck.
// Bei mehreren Bewerbern gewinnt der zuerst angemeldete.
export const SE_FOKUS_EVENT = 'ff-se-fokus'

function fokusBrueckeBauen(): void {
  seGlobal().basisHTML_DoSetFocusToHTML = (): boolean => {
    const frage = new CustomEvent(SE_FOKUS_EVENT, { cancelable: true })
    document.dispatchEvent(frage)
    return frage.defaultPrevented
  }
}

let booted = false

export function bootSe(): void {
  if (booted) return
  booted = true
  tryInitSe()
  const g = seGlobal()
  g.Erstellen = () => { refreshDataBasis(); klingeln(datenSindNeu()) }
  g.initData = g.Erstellen
  g.ReloadData = () => { klingeln(datenSindNeu()) }
  fokusBrueckeBauen()
  registerSe()

  window.addEventListener('message', (evt) => {
    if (typeof seGlobal().basisHTML_REGISTER === 'function') return
    const payload = messagePayload(evt.data)
    if (payload !== undefined) seConsume(payload)
  }, true)
  let tries = 0
  const poll = setInterval(() => {
    tries += 1
    if (hasSeData()) {
      clearInterval(poll)
      refreshDataBasis()
      klingeln(datenSindNeu())
    } else if (tries > 100) {
      clearInterval(poll)
      meldeFehler('Keine Daten von SoftEngine empfangen — die Maske zeigt nichts an.')
    }
  }, 300)
}
