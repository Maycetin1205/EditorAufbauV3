// Eine Formelspalte rechnet in JEDER Zeile, nicht nur in der Erfassungszeile:
// sonst stuende dieselbe Spalte an den gelieferten Zeilen leer.
import { rechneFormel, zahlText } from '../../core/data/rechnung'
import { alsZahl } from './sortierung'
import { spalteMitKennung, type Spalte } from './spalten'

// Was in der Zeile steht, ehe eine Formel darueber geht. Eine Formelspalte hat
// kein Feld und meldet darum leer.
export type GegebenerWert = (platz: number) => string

function zahlAn(
  spalten: readonly Spalte[],
  platz: number,
  gegeben: GegebenerWert,
  unterwegs: Set<number>,
): number | null {
  const spalte = spalten[platz]
  if (spalte === undefined || unterwegs.has(platz)) return null
  const wert = gegeben(platz)
  if (wert !== '') return alsZahl(wert)
  if (spalte.formel === undefined) return null
  // Eine Formel, die sich selbst braucht, bleibt leer statt endlos zu rechnen.
  unterwegs.add(platz)
  const zahl = rechneFormel(
    spalte.formel,
    (kennung) => {
      const i = spalteMitKennung(spalten, kennung)
      return i === -1 ? null : zahlAn(spalten, i, gegeben, unterwegs)
    },
  )
  unterwegs.delete(platz)
  return zahl
}

// Der Wert dieser Zelle: das Gegebene, und wo nichts gegeben ist und eine
// Formel haengt, das Gerechnete. Gegebenes geht vor, wie in der Erfassungszeile.
export function zellWertGerechnet(
  spalten: readonly Spalte[],
  platz: number,
  gegeben: GegebenerWert,
): string {
  const eigen = gegeben(platz)
  if (eigen !== '') return eigen
  const formel = spalten[platz]?.formel
  if (formel === undefined) return ''
  const zahl = zahlAn(spalten, platz, gegeben, new Set())
  return zahl === null ? '' : zahlText(zahl, formel.runden.stellen)
}

// Dieselbe Rechnung fuer eine ganze Zeile. Ohne Formelspalte bleibt jeder Wert,
// wie er kam.
export function zeileGerechnet(
  spalten: readonly Spalte[],
  gegeben: GegebenerWert,
): string[] {
  if (!spalten.some((s) => s.formel !== undefined)) {
    return spalten.map((_, i) => gegeben(i))
  }
  return spalten.map((_, i) => zellWertGerechnet(spalten, i, gegeben))
}
