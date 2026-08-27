import { alsZahl } from './sortierung'

// Der ERP liefert dieselbe Zahl in drei Schreibweisen ("1999.00", "1999,00",
// "1.999,00"). Gelesen wird sie mit demselben Parser, mit dem die Tabelle
// sortiert — eine Stelle, ein Verstaendnis. Was sich nicht als Zahl lesen
// laesst, bleibt UNVERAENDERT stehen: der Editor erfindet nichts, und ein
// Textwert in einer Zahlenspalte soll sichtbar bleiben, nicht zu 0 werden.
export function zahlText(roh: string, min: number, max: number): string {
  const zahl = alsZahl(roh)
  if (zahl === null) return roh
  return zahl.toLocaleString('de-DE', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  })
}

// Menge und Stueckzahl: keine erzwungene Nachkommastelle, aber bis zu drei,
// wo der ERP sie liefert (0,25 Stunden).
export const ZAHL_NACHKOMMA = { min: 0, max: 3 } as const

// Betraege: immer zwei Stellen, damit die Spalte eine Kante hat.
export const BETRAG_NACHKOMMA = { min: 2, max: 2 } as const

export function summeText(werte: readonly string[], min: number, max: number): string {
  let summe = 0
  let gezaehlt = 0
  for (const wert of werte) {
    const zahl = alsZahl(wert)
    if (zahl === null) continue
    summe += zahl
    gezaehlt++
  }
  if (gezaehlt === 0) return ''
  return summe.toLocaleString('de-DE', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  })
}
