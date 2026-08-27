import { geberIdVon, waehleAuswahl } from '../shared/auswahl'
import { meldeKettenFehler, runEvent } from '../shared/seAktionen'
import { zeilenIndexVon } from './seRuntime'
import { sendeZeileAktiviert } from './zeilenAktivierung'

// Was ein Klick auf eine Datenzeile ausloest: die Zeile weitergeben (Auswahl
// folgen), sie als Auswahl setzen und die Kette am Baustein starten. Im
// Editor passiert nichts davon — dort ist der Klick Bedienung des Editors.
// Getrennt vom Baustein, damit der unter seinem Zeilen-Deckel bleibt.
export function aktiviereZeile(
  el: HTMLElement,
  rohzeilen: readonly unknown[],
  rohIndex: number | null,
  ansichtIndex: number,
): void {
  if (rohIndex === null || el.hasAttribute('data-ff-editor')) return
  const rohzeile = rohzeilen[rohIndex]
  if (rohzeile === undefined) return
  sendeZeileAktiviert(el, { rohzeile, rohIndex, ansichtIndex })
  setzeAuswahl(el, rohzeile)
  runEvent(el, 'onRowClick', { PINDEX: zeilenIndexVon(el, rohzeile) })
    .catch(meldeKettenFehler)
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

function setzeAuswahl(el: HTMLElement, rohzeile: unknown): void {
  const geberId = geberIdVon(el)
  if (geberId === '') return
  waehleAuswahl(geberId, rohzeile)
}
