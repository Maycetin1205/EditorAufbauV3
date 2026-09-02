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

// Eine Spalte hinten anfuegen. Hier wird NICHT gerechnet: die Breiten sind
// Anteile (spalten.ts: spaltenRaster), die neue Spalte bekommt den mittleren
// Anteil, und das Raster fuellt die Tabelle von allein wieder aus. Die zwei
// Anlaeufe davor haben die Summe fester Pixel umverteilt (7f92603, dann
// 040b73c mit einem Wasserfall) — beide behandelten nur das Symptom.
export function fuegeSpalteAn(spalten: readonly Spalte[]): Spalte[] {
  return mitKennungen([...spalten, neueSpalte(spalten.length)])
}

// Die Rechnung zeigt ueber die dauerhafte Kennung auf ihre Spalten. Wird eine
// gestrichen, wird der Platz leer (= unbenutzt) — sonst rechnete die Maske mit
// einer Spalte, die es nicht mehr gibt, und die naechste neue Spalte kann
// dieselbe Kennung wieder bekommen. Rueckgabe: das neue Attribut, oder null,
// wenn nichts abzuraeumen ist. Gegenstueck fuer die Ketten-Parameter im ganzen
// Baum: state/spaltenAufraeumen.ts.
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

// Eine Spalte streichen — von ueberall her, nicht nur hinten. EINE Stelle
// fuer beide Wege: das Kreuz am Spaltenkopf nennt seinen Platz, der
// Minus-Knopf meint immer den letzten. Die letzte verbliebene Spalte bleibt
// stehen: eine Tabelle ohne Spalte waere ein leerer Kasten ohne Weg zurueck.
export function entferneSpalte(
  index: number,
  liste: () => Spalte[],
  aendere: (spalten: Spalte[]) => void,
): void {
  const l = liste()
  const neu = ohneSpalte(l, index)
  if (neu !== l) aendere([...neu])
}

// Streicht GENAU diese Spalte — rein: dieselbe Liste zurueck heisst „nicht
// erlaubt" (letzte Spalte, Platz ausserhalb). Die verbliebenen Anteile
// fuellen die Tabelle wieder aus (spaltenRaster), der Platz der gestrichenen
// bleibt nicht als leere Flaeche stehen (Nutzer-Befund 2026-08-31).
export function ohneSpalte(spalten: readonly Spalte[], index: number): readonly Spalte[] {
  if (spalten.length <= SPALTEN_MIN || index < 0 || index >= spalten.length) return spalten
  return spalten.filter((_, i) => i !== index)
}

// Eine Spalte an einen anderen Platz setzen. `nach` = Ziel-Platz in der
// Liste. Alles Ihre reist im Eintrag mit (Kennung, Titel, Belegfeld,
// Fuellfeld, Breite); Ketten und Rechnung zeigen auf die KENNUNG und
// brauchen deshalb kein Nachziehen — genau dafuer gibt es sie (spalten.ts).

// Eine Spalte an einen anderen Platz setzen — rein: dieselbe Liste zurueck
// heisst „nichts zu tun". Alles Ihre reist im Eintrag mit (Kennung, Titel,
// Belegfeld, Fuellfeld, Breite); Ketten und Rechnung zeigen auf die KENNUNG
// und brauchen kein Nachziehen — genau dafuer gibt es sie (spalten.ts).
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
