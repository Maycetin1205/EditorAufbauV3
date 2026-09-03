import type { TemplateResult } from 'lit'
import {
  fensterBreiteFuer,
  FENSTER_HOEHE,
  oeffneNachschlagen,
} from '../shared/nachschlagen'
import type { ErfassungsLauf } from './erfassungsLauf'
import {
  fensterSpaltenIn,
  zielIn,
  type ErfassungsUmfeld,
} from './erfassungsZellen'
import { erfassungsZeileTpl } from './erfassungsZeile'
import type { Spaltensicht } from './spalten'

// Was die Zellen der Erfassungszeile tun. Getrennt vom Baustein, weil der
// sonst über seinen Zeilen-Deckel liefe — und weil die Bedienung so nur über
// diese schmale Naht an ihn kommt.
export interface ErfassungsWirt {
  baustein: HTMLElement

  lauf: ErfassungsLauf

  umfeld: () => ErfassungsUmfeld

  melde: () => void

  // Setzt den Fokus in die Erfassungszelle der Spalte — NACH dem nächsten
  // Rendern, denn erst dann zeigt die Zelle den neuen Stand.
  fokussiere: (index: number) => void

  // Enter am Zeilenende: die Zeile bleibt stehen, die Erfassung rückt eine
  // Zeile tiefer (G4). Der Baustein hält die erfassten Zeilen. Liefert false,
  // wenn nichts zu erfassen war (ganz leere Zeile) — dann darf der Aufrufer
  // die Taste nicht schlucken, sonst säße der Fokus fest.
  erfasseZeile: () => boolean
}

function waehle(wirt: ErfassungsWirt, index: number, listenIndex: number): void {
  const treffer = wirt.lauf.vorschlaege[listenIndex]
  if (treffer === undefined) return
  wirt.lauf.uebernimm(wirt.umfeld(), index, treffer.satz)
  wirt.melde()
}

// Das große Fenster zeigt GENAU dieselben Sätze wie die Liste daneben: die
// Einträge reisen fertig mit, damit keine zweite Wahrheit entsteht. Ohne sie
// legte das Fenster die Auswahl-Folgen der TABELLE auf diese Sätze und ließe
// keinen übrig.
function fenster(wirt: ErfassungsWirt, index: number): void {
  const umfeld = wirt.umfeld()
  const spalte = umfeld.spalten[index]
  const ziel = zielIn(umfeld, index)
  if (spalte === undefined || ziel.quelleId === '' || ziel.code === '') return
  const spalten = fensterSpaltenIn(umfeld, index)
  oeffneNachschlagen({
    el: wirt.baustein,
    // Die Quelle DIESER Spalte: die der Tabelle oder eine verknüpfte.
    quelleId: ziel.quelleId,
    speicherFeld: ziel.code,
    speicherTitel: spalte.titel,
    spalten,
    titel: spalte.titel,
    breite: fensterBreiteFuer(spalten.length),
    hoehe: FENSTER_HOEHE,
    eintraege: wirt.lauf.eintraege(umfeld, index),
    rueckFokus: null,
    suchtext: wirt.lauf.wertVon(umfeld, index),
    onUebernehmen: (_anzeige, _wert, satz) => {
      wirt.lauf.uebernimm(wirt.umfeld(), index, satz)
      wirt.melde()
      // Genau wie nach einer Uebernahme aus der Liste: der Fokus kommt zurueck
      // in die Zeile und rueckt weiter. Ohne das stand der Bediener nach dem
      // Fenster ohne Cursor da — `rueckFokus: null` gibt ihn nicht zurueck,
      // und die Erfassungszeile hat keinen Ersatzweg dafuer.
      springe(wirt, index, 'Enter')
    },
  })
}

// Weiterrücken — auf ZWEI Arten, die sich nicht vermischen dürfen:
//
// Enter folgt dem Fluss (G3b/G4): die nächste LEERE Zelle, und ist rechts
// nichts Leeres mehr, ist die Zeile fertig. Selbstgefülltes wird dabei
// übersprungen — das ist der Sinn.
//
// Tab geht dagegen Zelle für Zelle, auch in gefüllte. Vorher sprang es
// ebenfalls nur auf Leeres; damit war eine einmal gefüllte Zelle vorwärts
// nie wieder erreichbar, während Shift+Tab rückwärts an jede kam. Zwei
// Richtungen mit zwei Regeln — genau daran lief der Bediener auf.
//
// Hinter der letzten Spalte schliesst Tab die Zeile ab, genau wie Enter —
// der Griff, den jede Tabellenkalkulation hat. Vorher gab Tab dort an den
// Browser ab: der Fokus verliess die Tabelle, und die getippte Zeile blieb
// UNERFASST stehen. Nur wenn es nichts zu erfassen gibt (ganz leere Zeile),
// gehoert die Taste weiter dem Browser — sonst saesse der Fokus fest.
export function springe(wirt: ErfassungsWirt, index: number, taste: string): boolean {
  const umfeld = wirt.umfeld()
  if (taste === 'Tab') {
    const naechste = wirt.lauf.nachbarPlatz(umfeld, index, 1)
    if (naechste !== -1) {
      wirt.fokussiere(naechste)
      return true
    }
    return wirt.erfasseZeile()
  }
  const ziel = wirt.lauf.naechsteLeere(umfeld, index)
  if (ziel !== -1) wirt.fokussiere(ziel)
  else if (taste === 'Enter') wirt.erfasseZeile()
  return true
}

function taste(wirt: ErfassungsWirt, index: number, e: KeyboardEvent): void {
  // Rückwärts (Shift+Tab) ist GARANTIERT eine Zelle zurück, egal was
  // drinsteht — komplette Tastatursteuerung in beide Richtungen (Nutzer
  // 2026-09-01). Vorher war es dem Browser überlassen, und der Weg durch
  // die Schatten-Wurzeln war nicht verlässlich. Vor der ersten Zelle
  // gehört die Taste dem Browser: raus aus der Tabelle.
  if (e.key === 'Tab' && e.shiftKey) {
    const vorige = wirt.lauf.nachbarPlatz(wirt.umfeld(), index, -1)
    if (vorige === -1) return
    e.preventDefault()
    wirt.fokussiere(vorige)
    wirt.melde()
    return
  }
  // Alt+Pfeil-runter ist derselbe Wunsch wie F4: das große Fenster. Der
  // Entscheid kennt nur Tastennamen, darum hier abgebildet.
  const gedrueckt = e.key === 'ArrowDown' && e.altKey ? 'F4' : e.key
  const folge = wirt.lauf.entscheideTaste(wirt.umfeld(), index, gedrueckt)
  if (folge === 'nichts') {
    // Enter darf trotzdem kein Formular abschicken.
    if (e.key === 'Enter') e.preventDefault()
    return
  }
  let behalte = true
  if (folge === 'uebernehmen') {
    waehle(wirt, index, wirt.lauf.marke)
    behalte = springe(wirt, index, e.key)
  } else if (folge === 'fenster') fenster(wirt, index)
  else if (folge === 'liste-auf') wirt.lauf.oeffneListe(index)
  else if (folge === 'weiter') behalte = springe(wirt, index, e.key)
  else if (folge === 'leeren') wirt.lauf.leere(wirt.umfeld(), index)
  // Nur was wir selbst erledigen, nehmen wir dem Browser weg: Tab hinter
  // der letzten Spalte gehört ihm, sonst säße der Fokus in der Zeile fest.
  if (behalte) e.preventDefault()
  wirt.melde()
}

export function erfassungsZeileFuer(
  wirt: ErfassungsWirt,
  cols: Readonly<Record<string, string>>,
  listeNachOben: boolean,

  // Was gezeichnet wird — in der Maske ohne die ausgeblendeten Spalten. Die
  // WERTE holt der Lauf weiter ueber den vollen Platz.
  sicht: Spaltensicht,
): TemplateResult {
  const umfeld = wirt.umfeld()
  return erfassungsZeileTpl({
    spalten: sicht.spalten,
    plaetze: sicht.plaetze,
    quelleId: umfeld.quelleId,
    cols,
    imEditor: wirt.baustein.hasAttribute('data-ff-editor'),
    wert: (i) => wirt.lauf.wertVon(umfeld, i),
    tippSpalte: wirt.lauf.tippSpalte,
    vorschlaege: wirt.lauf.vorschlaege,
    marke: wirt.lauf.marke,
    listeNachOben,
  }, {
    // Was der Bediener tippt, gehört der Zeile — kein Daten-Push räumt es weg
    // (das tut nur ein Zweckwechsel des Bausteins).
    tippen: (i, text) => {
      wirt.lauf.tippe(i, text)
      wirt.melde()
    },
    taste: (i, e) => taste(wirt, i, e),
    verlassen: (i) => {
      wirt.lauf.verlasse(i)
      wirt.melde()
    },
    waehleVorschlag: (listenIndex) => waehle(wirt, wirt.lauf.tippSpalte, listenIndex),
    setzeMarke: (listenIndex) => {
      wirt.lauf.setzeMarke(listenIndex)
      wirt.melde()
    },
  })
}
