import type { Editor } from './Editor'

// Mehrere Eigenschaften eines Bausteins in EINER Geste setzen — so, wie die
// reinen Editier-Vorgaenge der Registry (listenBindung.eintragNeu/-Weg) sie
// liefern. Leerer Patch heisst: nichts erlaubt, nichts passiert.
export function wendeProps(
  editor: Editor,
  id: string,
  patch: Readonly<Record<string, unknown>>,
): boolean {
  const eintraege = Object.entries(patch)
  if (eintraege.length === 0) return false
  editor.transaktion(() => {
    for (const [attr, wert] of eintraege) editor.updateProperty(id, attr, wert)
  })
  return true
}
