// Ist die hinausgeschickte Zeile im Beleg angekommen? Ein PUT antwortet nicht;
// beweisen kann es allein die naechste Lieferung.
import type { Lieferung } from '../../core/blocks/BlockDefinition'
import { zahlStreng } from '../../core/data/rechnung'
import type { Spalte } from '../tabelle/spalten'

export interface GesendeteZeile {
  // Leer, solange die Kette der Zeile keine Satznummer gegeben hat.
  satz: string

  werte: readonly string[]
}

// SoftEngine gibt eine getippte 7 als „7,000" zurueck; ein reiner Textvergleich
// faende die Zeile darum nie wieder.
function gleich(a: string, b: string): boolean {
  const x = a.trim()
  const y = b.trim()
  if (x === y) return true
  const zx = zahlStreng(x)
  return zx !== null && zx === zahlStreng(y)
}

// Je gesendeter Zeile: steht sie in der Lieferung? Der Schluessel ist die
// Satznummer aus der Kette, sonst die gefuellten Zellen ueber die Feldcodes der
// Spalten. Jede gelieferte Zeile zaehlt nur einmal, sonst deckte eine einzige
// Position zwei gleiche Erfassungen.
export function ankunftPruefen(
  gesendet: readonly GesendeteZeile[],
  spalten: readonly Spalte[],
  lieferung: Lieferung,
): boolean[] {
  const frei = lieferung.zeilen.map(() => true)
  const angekommen = gesendet.map(() => false)

  const nimm = (platz: number, i: number): boolean => {
    if (platz === -1) return false
    frei[platz] = false
    angekommen[i] = true
    return true
  }

  // Erst die Zeilen mit Satznummer: sie ist eindeutig, ein Feldvergleich koennte
  // ihr sonst ihre Zeile wegnehmen.
  gesendet.forEach((zeile, i) => {
    if (zeile.satz === '') return
    nimm(lieferung.zeilen.findIndex(
      (z, k) => frei[k] && gleich(lieferung.satzVon(z), zeile.satz),
    ), i)
  })

  const felder = spalten
    .map((s, platz) => ({ platz, feld: s.feld }))
    .filter((s) => s.feld !== '')

  gesendet.forEach((zeile, i) => {
    if (zeile.satz !== '') return
    const pruefbar = felder.filter((f) => (zeile.werte[f.platz] ?? '').trim() !== '')
    // Nichts zu vergleichen: diese Zeile laesst sich weder finden noch
    // vermissen. Sie festzuhalten hiesse, sie fuer immer festzuhalten.
    if (pruefbar.length === 0) {
      angekommen[i] = true
      return
    }
    nimm(lieferung.zeilen.findIndex((z, k) => frei[k]
      && pruefbar.every((f) => gleich(lieferung.lies(z, f.feld), zeile.werte[f.platz] ?? ''))), i)
  })

  return angekommen
}

export interface FehlendeZeile {
  // Die Satznummer, wenn die Kette eine hatte, sonst der Platz in der Erfassung:
  // der Bediener zaehlt seine eigenen Zeilen.
  nr: string

  artikel: string
}

// Der Balken traegt eine Zeile; bei vielen Fehlenden bliebe von ihr sonst nur
// die letzte lesbar.
const HOECHSTENS = 3

export function fehlenMeldung(fehlende: readonly FehlendeZeile[]): string {
  if (fehlende.length === 0) return ''
  const namen = fehlende.slice(0, HOECHSTENS)
    .map((f) => 'Position ' + f.nr + (f.artikel === '' ? '' : ' (' + f.artikel + ')'))
  const rest = fehlende.length - namen.length
  return namen.join(', ')
    + (rest > 0 ? ' und ' + String(rest) + ' weitere' : '')
    + (fehlende.length === 1 ? ' ist' : ' sind')
    + ' nicht im Beleg angekommen.'
}
