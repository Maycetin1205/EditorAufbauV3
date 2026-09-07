// Zeilen anfassen: Fokus mit den Pfeiltasten bewegen, eine Zeile aktivieren.
import { geberIdVon, klareAuswahl, setzeAuswahl as globalSetzeAuswahl } from '../shared/auswahl'
import { meldeKettenFehler, runEvent } from '../shared/seAktionen'
import { zeilenIndexVon, type RuntimeTableElement } from './seRuntime'

export const ZEILE_AKTIVIERT_EVENT = 'ff-zeile-aktiviert'

export interface ZeileAktiviertDetail {
  rohzeile: unknown

  rohIndex: number

  ansichtIndex: number
}

export const ROH_ATTR = 'data-ff-roh'

function sendeZeileAktiviert(el: HTMLElement, detail: ZeileAktiviertDetail): void {
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

// Im Editor loest der Klick nichts davon aus: dort ist er Bedienung des Editors.
export function aktiviereZeile(
  el: HTMLElement,
  rohzeilen: readonly unknown[],
  rohIndex: number | null,
  ansichtIndex: number,
): void {
  if (rohIndex === null || el.hasAttribute('data-ff-editor')) return
  const rohzeile = rohzeilen[rohIndex]
  if (rohzeile === undefined) return

  const table = el as RuntimeTableElement
  const istSchonGewaehlt = table.auswahlIndex === rohIndex

  const neuerIndex = istSchonGewaehlt ? -1 : rohIndex
  table.auswahlIndex = neuerIndex

  const geberId = geberIdVon(el)
  if (istSchonGewaehlt) {
    if (geberId !== '') klareAuswahl(geberId)
    sendeZeileAktiviert(el, { rohzeile, rohIndex: -1, ansichtIndex })
  } else {
    if (geberId !== '') globalSetzeAuswahl(geberId, rohzeile, true)
    sendeZeileAktiviert(el, { rohzeile, rohIndex, ansichtIndex })
    runEvent(el, 'onRowClick', { PINDEX: zeilenIndexVon(el, rohzeile) })
      .catch(meldeKettenFehler)
  }
}

export function zeileDoppelt(
  el: HTMLElement,
  rohzeilen: readonly unknown[],
  rohIndex: number | null,
): void {
  if (rohIndex === null || el.hasAttribute('data-ff-editor')) return
  const rohzeile = rohzeilen[rohIndex]
  if (rohzeile === undefined) return
  runEvent(el, 'onRowDblClick', { PINDEX: zeilenIndexVon(el, rohzeile) })
    .catch(meldeKettenFehler)
}
