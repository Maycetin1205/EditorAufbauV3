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

export interface ErfassungsWirt {
  baustein: HTMLElement

  lauf: ErfassungsLauf

  umfeld: () => ErfassungsUmfeld

  melde: () => void

  fokussiere: (index: number) => void

  erfasseZeile: () => boolean
}

function waehle(wirt: ErfassungsWirt, index: number, listenIndex: number): void {
  const treffer = wirt.lauf.vorschlaege[listenIndex]
  if (treffer === undefined) return
  wirt.lauf.uebernimm(wirt.umfeld(), index, treffer.satz)
  wirt.melde()
}

function fenster(wirt: ErfassungsWirt, index: number): void {
  const umfeld = wirt.umfeld()
  const spalte = umfeld.spalten[index]
  const ziel = zielIn(umfeld, index)
  if (spalte === undefined || ziel.quelleId === '' || ziel.code === '') return
  const spalten = fensterSpaltenIn(umfeld, index)
  oeffneNachschlagen({
    el: wirt.baustein,
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
      springe(wirt, index, 'Enter')
    },
  })
}

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
  // Shift+Tab setzt den Fokus selbst eine Zelle zurück: der Browser-Weg durch
  // die Schatten-Wurzeln war nicht verlässlich, und die Tastatursteuerung soll
  // in beide Richtungen vollständig sein (Nutzer 2026-09-01).
  if (e.key === 'Tab' && e.shiftKey) {
    const vorige = wirt.lauf.nachbarPlatz(wirt.umfeld(), index, -1)
    if (vorige === -1) return
    e.preventDefault()
    wirt.fokussiere(vorige)
    wirt.melde()
    return
  }
  const gedrueckt = e.key === 'ArrowDown' && e.altKey ? 'F4' : e.key
  const folge = wirt.lauf.entscheideTaste(wirt.umfeld(), index, gedrueckt)
  if (folge === 'nichts') {
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
  if (behalte) e.preventDefault()
  wirt.melde()
}

export function erfassungsZeileFuer(
  wirt: ErfassungsWirt,
  cols: Readonly<Record<string, string>>,
  listeNachOben: boolean,

  // Gezeichnet wird nur die gefilterte Sicht; die WERTE holt der Lauf weiter
  // ueber den PLATZ in der vollen Spaltenliste.
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
