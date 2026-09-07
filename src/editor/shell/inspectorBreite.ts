// Die Breite des Inspectors — eine Voreinstellung des Arbeitsplatzes.
import type { PointerEvent as ReactPointerEvent } from 'react'

// Sie geht nicht in den Baum, nicht in die Historie und nicht in den Export,
// darum ein eigener Schluessel.
const SCHLUESSEL = 'aufbau_editor_inspector_breite'

// PIXEL, kein rem: alles in rem haengt an der Grundgroesse und wuerde sich
// aendern, sobald jemand an der Schrift dreht.
export const INSPECTOR_MIN = 300
export const INSPECTOR_MAX = 600
const INSPECTOR_STANDARD = 400

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
    // Speicher gesperrt — dann eben jedes Mal die Vorgabe.
    return INSPECTOR_STANDARD
  }
}

export function merkeBreite(breite: number): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SCHLUESSEL, String(breite))
    }
  } catch {
  // Nicht merken zu koennen ist kein Grund, den Zug scheitern zu lassen.
  }
}

// Der Griff sitzt an der LINKEN Kante: nach links ziehen macht breiter, darum das
// umgekehrte Vorzeichen. Bewusst nicht ueber canvas/zieheGroesse: hier haengt
// nichts an der Maske, es gibt nichts rueckgaengig zu machen.
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

  // Ohne das markiert der Zug jeden Text, den er ueberstreicht.
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

// Pfeiltasten am Griff: ohne sie ist die Breite nur mit der Maus erreichbar.
export const BREITEN_SCHRITT = 16
