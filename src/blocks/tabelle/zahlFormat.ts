import { alsZahl } from './sortierung'

// Die Summe unter der Tabelle: gezaehlt wird, was sich als Zahl lesen laesst
// — der ERP liefert dieselbe Zahl in drei Schreibweisen ("1999.00",
// "1999,00", "1.999,00"), gelesen wird sie mit demselben Parser, mit dem die
// Tabelle sortiert. Werte, die keine Zahl sind, zaehlen NICHT mit: seit die
// Spalten keine Darstellung mehr tragen, darf jede Spalte summiert werden,
// und in einer Textspalte waere jede andere Rechnung geraten.
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

// Keine erzwungene Nachkommastelle, aber bis zu drei, wo der ERP sie liefert
// (0,25 Stunden). Eine Zahl fuer alle Summen — die Spalte sagt nicht mehr, ob
// sie Menge oder Betrag ist.
export const SUMME_NACHKOMMA = { min: 0, max: 3 } as const
