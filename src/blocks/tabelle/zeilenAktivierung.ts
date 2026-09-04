export const ZEILE_AKTIVIERT_EVENT = 'ff-zeile-aktiviert'

export interface ZeileAktiviertDetail {
  rohzeile: unknown

  rohIndex: number

  ansichtIndex: number
}

export const ROH_ATTR = 'data-ff-roh'

export function sendeZeileAktiviert(el: HTMLElement, detail: ZeileAktiviertDetail): void {
  el.dispatchEvent(new CustomEvent<ZeileAktiviertDetail>(ZEILE_AKTIVIERT_EVENT, {
    detail,
    bubbles: true,
    composed: true,
  }))
}

export function fokussierterRohIndex(wurzel: ShadowRoot | null): number | null | undefined {
  const aktiv = wurzel?.activeElement
  if (!(aktiv instanceof HTMLElement)) return undefined
  const zeile = aktiv.closest<HTMLElement>('.zeile')
  if (!zeile) return undefined
  const roh = zeile.getAttribute(ROH_ATTR)
  return roh === null || roh === '' ? null : Number(roh)
}

// Pfeil hoch/runter bewegen den Fokus von Datenzeile zu Datenzeile. Ohne das
// kam man nur mit Tab durch die Liste — im Nachschlage-Fenster hiess das
// praktisch gar nicht. Platzhalter-, Erfassungs- und erfasste Zeilen tragen
// kein data-ff-roh und fallen damit von selbst heraus.
export function bewegeZeilenFokus(von: EventTarget | null, richtung: number): boolean {
  if (!(von instanceof HTMLElement)) return false
  const zeile = von.closest<HTMLElement>('.zeile')
  const rumpf = zeile?.parentElement
  if (!zeile || !rumpf) return false
  const zeilen = [...rumpf.querySelectorAll<HTMLElement>(`.zeile[${ROH_ATTR}]`)]
  const at = zeilen.indexOf(zeile)
  const ziel = at === -1 ? undefined : zeilen[at + richtung]
  if (!ziel) return false
  ziel.focus()
  ziel.scrollIntoView?.({ block: 'nearest' })
  return true
}

// Pfeil-runter aus der Suchzeile springt in die Liste, Pfeil-hoch aus der
// ersten Zeile wieder zurueck: tippen und auswaehlen ohne die Hand von den
// Pfeilen zu nehmen.
export function fokussiereErsteZeile(von: EventTarget | null): boolean {
  if (!(von instanceof HTMLElement)) return false
  const erste = von.closest<HTMLElement>('.tabelle')
    ?.querySelector<HTMLElement>(`.zeile[${ROH_ATTR}]`)
  if (!erste) return false
  erste.focus()
  return true
}

export function fokussiereSuchzeile(von: EventTarget | null): boolean {
  if (!(von instanceof HTMLElement)) return false
  const feld = von.closest<HTMLElement>('.tabelle')
    ?.querySelector<HTMLInputElement>('.suchzeile input')
  if (!feld) return false
  feld.focus()
  return true
}

export function stelleZeilenFokusHer(wurzel: ShadowRoot | null, rohIndex: number | null): void {
  if (!wurzel) return
  const gesucht = rohIndex === null
    ? null
    : wurzel.querySelector<HTMLElement>(`.zeile[${ROH_ATTR}="${rohIndex}"]`)
  const ziel = gesucht
    ?? wurzel.querySelector<HTMLElement>(`.zeile[${ROH_ATTR}]`)
    ?? wurzel.querySelector<HTMLElement>('.koerper')
  ziel?.focus()
}
