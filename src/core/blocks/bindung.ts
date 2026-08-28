// Die Form einer Feldbindung: „Feldcode" heisst die eigene Quelle,
// „quelleId::Feldcode" eine andere. Steht in einer EIGENEN Datei, weil
// `listenBindung` sie braucht und `BlockDefinition` bereits `listenBindung`
// importiert — ein direkter Import waere ein Ringschluss. `BlockDefinition`
// reicht alles hier unveraendert weiter, kein Aufrufer merkt den Umzug.

export const QUELLEN_TRENNER = '::'

export interface FeldZiel {
  quelleId: string
  code: string
}

export function bindungMitQuelle(quelleId: string, code: string): string {
  if (quelleId === '' || code === '') return code
  return `${quelleId}${QUELLEN_TRENNER}${code}`
}

export function zerlegeBindung(wert: string): FeldZiel {
  const teile = wert.split(QUELLEN_TRENNER)
  if (teile.length !== 2) return { quelleId: '', code: wert }
  const [quelleId, code] = teile
  if (quelleId === '' || code === '') return { quelleId: '', code: wert }
  return { quelleId, code }
}
