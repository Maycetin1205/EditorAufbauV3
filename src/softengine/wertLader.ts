import { meldeAnstoss, seGlobal } from './bridge'
import type { RuntimeHolWert } from './data'
import { setzeGeholteZeilen } from './geholteZeilen'
import { meldeFehler } from './meldung'
import {
  executeRelation,
  extractRelationFeld,
  findRuntimeRelation,
  resolveActionParam,
} from './relations'

export interface WertQuelle {
  id: string
  name: string
}

// Wie beim Positionen-Lader: laeuft schon ein Ruf und kommt ein neuer Anlass,
// gewinnt der neue. Die Antwort des ueberholten Laufs wird verworfen, statt
// den frischeren Stand zu ueberschreiben.
const generationen = new Map<string, number>()

// Der erste Feldname bekommt die blanke Antwort — eine Relation wie 408
// liefert EINEN Wert ohne Namen. Steckt in der Antwort ein Feld dieses
// Namens, gewinnt es; jedes weitere Feld kommt ausschliesslich von dort.
export function zeileAusAntwort(
  wert: string,
  roh: unknown,
  felder: readonly string[],
): Record<string, string> {
  const zeile: Record<string, string> = {}
  felder.forEach((code, platz) => {
    const ausAntwort = extractRelationFeld(roh, code)
    zeile[code] = ausAntwort !== '' ? ausAntwort : (platz === 0 ? wert : '')
  })
  return zeile
}

export function holeWertQuelle(quelle: WertQuelle, hol: RuntimeHolWert): void {
  const gen = (generationen.get(quelle.id) ?? 0) + 1
  generationen.set(quelle.id, gen)

  const relation = findRuntimeRelation(seGlobal().FF_RELATIONS, hol.relationId)
  // Ohne Vorlage kaeme nie ein Wert, und das gebundene Feld bliebe einfach
  // leer — von einer leeren Antwort nicht zu unterscheiden.
  if (!relation) {
    meldeFehler(`Quelle „${quelle.name}“: ihre Relation fehlt in dieser Maske.`)
    return
  }
  if (relation.verb !== 'GET_RELATION') {
    meldeFehler(
      `Quelle „${quelle.name}“ kann nur lesen — ${relation.verb} liefert keinen Wert zurück.`,
    )
    return
  }

  const params = hol.params.map((binding) =>
    resolveActionParam(binding, { context: {}, previousResult: '' }))

  void (async () => {
    const antwort = await executeRelation(relation, params)
    if (generationen.get(quelle.id) !== gen) return
    // executeRelation hat den Fehler schon in den Balken gelegt. Den alten
    // Stand stehen zu lassen ist richtiger, als ihn gegen Leere zu tauschen.
    if (antwort.fehler !== undefined && antwort.fehler !== '') return
    setzeGeholteZeilen(quelle.name, [zeileAusAntwort(antwort.wert, antwort.roh, hol.felder)])
    meldeAnstoss()
  })()
}

export function setzeWertLaderZurueck(): void {
  generationen.clear()
}
