import {
  ohneSpalten,
  rechnungAlsAttribut,
  rechnungVonAttribut,
} from '../../core/data/rechnung'
import {
  SPALTEN_MIN,
  mitKennungen,
  neueSpalte,
  type Spalte,
} from './spalten'

export function fuegeSpalteAn(spalten: readonly Spalte[]): Spalte[] {
  return mitKennungen([...spalten, neueSpalte(spalten.length)])
}

export function rechnungNachSpalten(
  roh: unknown,
  alt: readonly Spalte[],
  neu: readonly Spalte[],
): string | null {
  const rechnung = rechnungVonAttribut(roh)
  if (!rechnung) return null
  const bleibt = new Set(neu.map((s) => s.kennung))
  const gestrichen = alt.map((s) => s.kennung).filter((k) => k !== '' && !bleibt.has(k))
  const geputzt = ohneSpalten(rechnung, gestrichen)
  return geputzt === rechnung ? null : rechnungAlsAttribut(geputzt)
}

export function entferneSpalte(
  index: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  const neu = ohneSpalte(l, index)
  if (neu !== l) aendere([...neu])
}

export function ohneSpalte(spalten: readonly Spalte[], index: number): readonly Spalte[] {
  if (spalten.length <= SPALTEN_MIN || index < 0 || index >= spalten.length) return spalten
  return spalten.filter((_, i) => i !== index)
}

export function mitVerschobenerSpalte(
  spalten: readonly Spalte[],
  von: number,
  nach: number,
): readonly Spalte[] {
  if (von < 0 || von >= spalten.length) return spalten
  const ziel = Math.max(0, Math.min(nach, spalten.length - 1))
  if (ziel === von) return spalten
  const l = [...spalten]
  const [spalte] = l.splice(von, 1)
  l.splice(ziel, 0, spalte)
  return l
}

export function verschiebeSpalteAn(
  von: number,
  nach: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  const neu = mitVerschobenerSpalte(l, von, nach)
  if (neu !== l) aendere([...neu])
}
