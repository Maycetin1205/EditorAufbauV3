import type { PointerEvent as ReactPointerEvent } from 'react'

// Die Breite des Inspectors ist eine VOREINSTELLUNG des Arbeitsplatzes, kein
// Teil der Maske: sie geht nicht in den Baum, nicht in die Historie und nicht
// in den Export. Darum liegt sie unter einem eigenen Schluessel und nicht im
// Speicher der Maske.
const SCHLUESSEL = 'aufbau_editor_inspector_breite'

// PIXEL, kein rem. Alles in rem haengt an der Grundgroesse (index.css,
// 13.5px) — eine Panelbreite in rem wuerde sich also aendern, sobald jemand
// an der Schrift dreht. Genau die Falle, die bei der Grundgroesse selbst
// schon zugeschlagen hat: `w-80` sind nicht 320 px, sondern 270.
export const INSPECTOR_MIN = 300
export const INSPECTOR_MAX = 600
export const INSPECTOR_STANDARD = 400

export function begrenzeBreite(n: number): number {
  if (!Number.isFinite(n)) return INSPECTOR_STANDARD
  return Math.min(INSPECTOR_MAX, Math.max(INSPECTOR_MIN, Math.round(n)))
}

export function leseBreite(): number {
  try {
    if (typeof localStorage === 'undefined') return INSPECTOR_STANDARD
    const roh = localStorage.getItem(SCHLUESSEL)
    return roh === null ? INSPECTOR_STANDARD : begrenzeBreite(Number(roh))
  } catch {
    // Speicher gesperrt (Privatmodus) — dann eben jedes Mal die Vorgabe.
    return INSPECTOR_STANDARD
  }
}

export function merkeBreite(breite: number): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SCHLUESSEL, String(breite))
    }
  } catch {
    // Nicht merken zu koennen ist kein Grund, den Zug scheitern zu lassen —
    // die gezogene Breite gilt fuer diese Sitzung trotzdem.
  }
}

// Der Griff sitzt an der LINKEN Kante des Panels. Nach links ziehen macht
// breiter, darum das umgekehrte Vorzeichen gegenueber der Mausbewegung.
//
// Bewusst NICHT ueber `canvas/zieheGroesse`: die schreibt ihr Ergebnis in den
// Baum und klammert es zu einem Undo-Schritt. Hier gibt es nichts
// rueckgaengig zu machen, weil nichts an der Maske haengt.
export function starteBreitenZug(
  e: ReactPointerEvent<HTMLElement>,
  startBreite: number,
  zeige: (breite: number) => void,
  uebernimm: (breite: number) => void,
): void {
  if (e.button !== 0) return
  e.preventDefault()

  const startX = e.clientX
  let letzte = startBreite

  // Ohne das markiert der Zug quer ueber die Flaeche jeden Text, den er
  // ueberstreicht.
  const auswahlVorher = document.body.style.userSelect
  document.body.style.userSelect = 'none'

  const aufraeumen = (): void => {
    window.removeEventListener('pointermove', beiBewegung)
    window.removeEventListener('pointerup', beiLoslassen)
    window.removeEventListener('pointercancel', beiAbbruch)
    window.removeEventListener('keydown', beiTaste)
    window.removeEventListener('blur', beiAbbruch)
    document.body.style.userSelect = auswahlVorher
  }

  function beiBewegung(ev: PointerEvent): void {
    letzte = begrenzeBreite(startBreite + (startX - ev.clientX))
    zeige(letzte)
  }

  function beiLoslassen(): void {
    aufraeumen()
    uebernimm(letzte)
  }

  function beiAbbruch(): void {
    aufraeumen()
    zeige(startBreite)
  }

  function beiTaste(ev: KeyboardEvent): void {
    if (ev.key !== 'Escape') return
    ev.preventDefault()
    beiAbbruch()
  }

  window.addEventListener('pointermove', beiBewegung)
  window.addEventListener('pointerup', beiLoslassen)
  window.addEventListener('pointercancel', beiAbbruch)
  window.addEventListener('keydown', beiTaste)
  window.addEventListener('blur', beiAbbruch)
}

// Pfeiltasten am Griff — ohne sie ist die Breite nur mit der Maus erreichbar.
export const BREITEN_SCHRITT = 16
