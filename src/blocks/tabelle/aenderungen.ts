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

  setze(satz: string, spalte: number, wert: string): boolean {
    if (satz === '') return false
    const k = schluessel(satz, spalte)
    if (this.werte.get(k) === wert) return false
    this.werte.set(k, wert)
    return true
  }

  nimmZurueck(satz: string, spalte: number): boolean {
    return this.werte.delete(schluessel(satz, spalte))
  }

  wert(satz: string, spalte: number): string | undefined {
    return satz === '' ? undefined : this.werte.get(schluessel(satz, spalte))
  }

  get anzahl(): number {
    return this.werte.size
  }

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

  nimmSatzZurueck(satz: string): boolean {
    let weg = false
    for (const k of [...this.werte.keys()]) {
      if (k.slice(0, k.indexOf(TRENNER)) === satz && this.werte.delete(k)) weg = true
    }
    return weg
  }
}
