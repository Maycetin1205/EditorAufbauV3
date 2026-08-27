// Vorgemerkte Zell-Aenderungen einer Tabelle: was der Bediener in einer
// GEBUCHTEN Zeile geaendert hat, aber noch nicht geschrieben ist. Geschrieben
// wird nur ueber eine sichtbare Kette an einem Knopf (feste Zusage: kein
// Auto-PUT) — bis dahin lebt der neue Wert hier.
//
// Geschluesselt wird ueber die SATZNUMMER der Zeile, nicht ueber ihren Platz
// in der Liste: sortiert der Bediener um oder filtert er, wandert die Zeile,
// und ein Platz-Schluessel zeigte danach auf die falsche. Ohne Satznummer
// gibt es deshalb kein Aendern (der Baustein schaltet es dann ab).

export interface Aenderung {
  satz: string

  spalte: number

  wert: string
}

const TRENNER = '\u0000'

function schluessel(satz: string, spalte: number): string {
  return satz + TRENNER + String(spalte)
}

export class AenderungsSpeicher {
  private werte = new Map<string, string>()

  // true, wenn sich dadurch etwas geaendert hat — nur dann muss neu
  // gezeichnet werden.
  setze(satz: string, spalte: number, wert: string): boolean {
    if (satz === '') return false
    const k = schluessel(satz, spalte)
    if (this.werte.get(k) === wert) return false
    this.werte.set(k, wert)
    return true
  }

  // Zuruecknehmen heisst: der Wert der Zeile gilt wieder. Das ist etwas
  // anderes als „auf den alten Text setzen" — die Vormerkung verschwindet.
  nimmZurueck(satz: string, spalte: number): boolean {
    return this.werte.delete(schluessel(satz, spalte))
  }

  wert(satz: string, spalte: number): string | undefined {
    return satz === '' ? undefined : this.werte.get(schluessel(satz, spalte))
  }

  get anzahl(): number {
    return this.werte.size
  }

  // Die Zeilen, die etwas Vorgemerktes tragen — je Satz einmal, in der
  // Reihenfolge, in der zuerst geaendert wurde. Das liest spaeter die Kette
  // am Buchen-Knopf: ein Lauf je Zeile.
  proSatz(): { satz: string; aenderungen: Aenderung[] }[] {
    const raus: { satz: string; aenderungen: Aenderung[] }[] = []
    for (const [k, wert] of this.werte) {
      const [satz, spalteRoh] = k.split(TRENNER)
      const spalte = Number(spalteRoh)
      const vorhanden = raus.find((e) => e.satz === satz)
      const eintrag = { satz, spalte, wert }
      if (vorhanden) vorhanden.aenderungen.push(eintrag)
      else raus.push({ satz, aenderungen: [eintrag] })
    }
    return raus
  }

  // Alles, was an EINER Zeile vorgemerkt war, faellt weg — die Zeile ist
  // geschrieben. Nicht dasselbe wie leeren: die anderen Zeilen bleiben.
  nimmSatzZurueck(satz: string): boolean {
    let weg = false
    for (const k of [...this.werte.keys()]) {
      if (k.slice(0, k.indexOf(TRENNER)) === satz && this.werte.delete(k)) weg = true
    }
    return weg
  }
}
