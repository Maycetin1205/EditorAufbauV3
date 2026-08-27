import type { SchluesselPaar } from '../../core/data/sourceLinks'

// Zwei Bausteine-Eigenschaften tragen dieselbe Form: eine Liste von
// Eintraegen, jeder mit EINER Id und einer Liste Schluesselpaare.
// „Folgt der Auswahl von …" nennt die Id `geberId`, „weitere Quellen"
// nennt sie `quelleId` — sonst ist nichts verschieden. Deshalb liest EIN
// Parser beide; der Aufrufer sagt nur, wie sein Id-Feld heisst.
export interface PaarEintrag {
  id: string

  // Nur „weitere Quellen" fuellt das: die Quelle, mit der die Paare
  // verbinden. Leer = die Hauptquelle des Bausteins.
  partnerId: string

  keyPairs: SchluesselPaar[]
}

export interface PaarListeWahl {
  // Eintraege ohne vollstaendiges Paar behalten. Fuer „weitere Quellen":
  // dort ist das Paar freiwillig — eine Quelle ohne Paar ist eine reine
  // Nachschlagequelle. Fuer „Folgt der Auswahl von …" bleibt es aus: eine
  // Auswahl-Folge ohne Paar wuesste nicht, wonach sie filtern soll.
  ohnePaareBehalten?: boolean
}

export function paarListeAusAttribut(
  el: HTMLElement,
  attributName: string,
  idFeld: string,
  wahl: PaarListeWahl = {},
): PaarEintrag[] {
  const roh = el.getAttribute(attributName) ?? ''
  if (roh === '') return []
  try {
    const parsed: unknown = JSON.parse(roh)
    if (!Array.isArray(parsed)) return []
    const acc: PaarEintrag[] = []
    for (const e of parsed) {
      if (!e || typeof e !== 'object') continue
      const ee = e as Record<string, unknown>
      const id = ee[idFeld]
      if (typeof id !== 'string' || id === '') continue
      const keyPairs: SchluesselPaar[] = []
      for (const p of Array.isArray(ee.keyPairs) ? ee.keyPairs : []) {
        if (!p || typeof p !== 'object') continue
        const pp = p as Record<string, unknown>
        if (typeof pp.fromField !== 'string' || typeof pp.toField !== 'string') continue
        if (pp.fromField.trim() === '' || pp.toField.trim() === '') continue
        keyPairs.push({ fromField: pp.fromField, toField: pp.toField })
      }
      if (keyPairs.length === 0 && wahl.ohnePaareBehalten !== true) continue
      const partnerId = typeof ee.partnerId === 'string' && ee.partnerId !== id ? ee.partnerId : ''
      acc.push({ id, partnerId, keyPairs })
    }
    return acc
  } catch {
    return []
  }
}
