import type { BlockNode, BlockTree } from '../core/blocks/BlockData'
import type { BlockDefinition } from '../core/blocks/BlockDefinition'
import { listeLesen } from '../core/blocks/listenBindung'
import {
  ZELLEN_PARAM_QUELLEN,
  type ActionParamBinding,
  type ActionStep,
} from '../core/data/aktionen'

// Wird eine Spalte gestrichen, zeigen Ketten-Parameter weiter auf ihre
// Kennung. Sichtbar wird das nirgends: der Export macht daraus die Platznummer
// -1 (exportMask.ts, spaltenIndexFuer) und die Laufzeit schreibt kommentarlos
// einen Leerstring ins ERP. Darum wird der Zeiger beim Loeschen abgeraeumt —
// Bedienung am Ding statt Warnung. Generisch ueber die Listen-Bindung, kein
// Bausteintyp-Sondercode.
//
// Damit ist zugleich egal, dass die naechste neue Spalte dieselbe Kennung
// wieder bekommen kann (Vergabe = hoechste + 1, spalten.ts): nach dem Loeschen
// zeigt nichts mehr auf sie.

export function gestricheneKennungen(
  def: BlockDefinition | undefined,
  attr: string,
  alt: unknown,
  neu: unknown,
): string[] {
  const b = def?.listenBindung
  const key = b?.kennungKey
  if (!b || key === undefined || b.prop !== attr) return []
  const kennungen = (wert: unknown): string[] => listeLesen(wert, b)
    .map((eintrag) => String(eintrag[key] ?? ''))
    .filter((kennung) => kennung !== '')
  const bleibt = new Set(kennungen(neu))
  return kennungen(alt).filter((kennung) => !bleibt.has(kennung))
}

function schrittOhneZeiger(
  schritt: ActionStep,
  blockId: string,
  weg: ReadonlySet<string>,
): ActionStep | null {
  if (schritt.type !== 'RELATION') return null
  let getroffen = false
  const abraeumen = (liste: ActionParamBinding[]): ActionParamBinding[] =>
    liste.map((b) => {
      const zeigt = (ZELLEN_PARAM_QUELLEN as readonly string[]).includes(b.source)
        && (b.blockId ?? '') === blockId
        && weg.has(b.value)
      if (!zeigt) return b
      getroffen = true
      // 'aus' ist die sichtbare Antwort: die Steuerung zeigt den Parameter
      // ausgegraut, die Laufzeit liefert '' (relations.ts).
      return { source: 'aus' as const, value: '' }
    })
  const params = abraeumen(schritt.params)
  const extraParams = abraeumen(schritt.extraParams)
  return getroffen ? { ...schritt, params, extraParams } : null
}

// Alle Ketten im Baum, die auf eine gestrichene Spalte DIESES Bausteins
// zeigen, auf 'aus' stellen. Ketten stehen auf beliebigen Bausteinen, nicht
// nur auf dem mit der Liste — darum laeuft das ueber den ganzen Baum.
export function ohneSpaltenZeiger(
  tree: BlockTree,
  blockId: string,
  gestrichen: readonly string[],
): BlockTree {
  if (gestrichen.length === 0) return tree
  const weg = new Set(gestrichen)
  let geaendert = false
  const next: BlockTree = { ...tree }
  for (const node of Object.values(tree) as BlockNode[]) {
    if (!node.events) continue
    const events: Record<string, ActionStep[]> = {}
    let nodeGeaendert = false
    for (const [key, schritte] of Object.entries(node.events)) {
      events[key] = schritte.map((s) => {
        const neu = schrittOhneZeiger(s, blockId, weg)
        if (neu) nodeGeaendert = true
        return neu ?? s
      })
    }
    if (!nodeGeaendert) continue
    next[node.id] = { ...node, events }
    geaendert = true
  }
  return geaendert ? next : tree
}
