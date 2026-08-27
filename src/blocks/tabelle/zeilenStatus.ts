import type { VormerkArt } from '../../core/blocks/BlockDefinition'

// Woran eine Zeile gerade ist. Gezeigt wird das ausschliesslich als schmaler
// Balken am linken Zeilenrand plus Klartext im title — nie als Wort in der
// Zeile (Nutzer-Vorgabe: keine Text-Marken wie „NEU").
export type ZeilenStatus =
  | 'gebucht'
  | 'erfasst'
  | 'geaendert'
  | 'loeschung'
  | 'schreibt'
  | 'fehler'

export interface ZeilenZeichen {
  status: ZeilenStatus

  // Leer bei 'gebucht': eine Zeile ohne Vormerkung braucht keinen Hinweis.
  titel: string
}

const TITEL: Record<ZeilenStatus, string> = {
  gebucht: '',
  erfasst: 'Neue Zeile — noch nicht geschrieben',
  geaendert: 'Geändert — noch nicht geschrieben',
  loeschung: 'Zum Löschen vorgemerkt — noch nicht geschrieben',
  schreibt: 'Wird geschrieben …',
  fehler: 'Nicht geschrieben',
}

// Was der Ketten-Lauf ueber einzelne Zeilen gemeldet hat. Getrennt von den
// Vormerkungen selbst, weil es etwas anderes ist: eine Vormerkung macht der
// Bediener, diese Marken macht der Lauf — und die Fehlermarke muss den
// Daten-Push ueberleben, den derselbe Lauf ausloest.
export class LaufStand {
  private readonly melde: () => void

  private readonly schreibend = new Map<VormerkArt, Set<string>>()

  private readonly fehler = new Map<VormerkArt, Map<string, string>>()

  constructor(melde: () => void) {
    this.melde = melde
  }

  // Diese Zeile ist dran. Ein frueherer Fehlversuch derselben Zeile faellt
  // damit weg — der zweite Anlauf faengt sauber an.
  schreibt(art: VormerkArt, kennung: string): void {
    this.fehler.get(art)?.delete(kennung)
    const liste = this.schreibend.get(art) ?? new Set<string>()
    liste.add(kennung)
    this.schreibend.set(art, liste)
    this.melde()
  }

  gescheitert(art: VormerkArt, kennung: string, meldung: string): void {
    this.schreibend.get(art)?.delete(kennung)
    const liste = this.fehler.get(art) ?? new Map<string, string>()
    liste.set(kennung, meldung)
    this.fehler.set(art, liste)
    this.melde()
  }

  // Der Lauf ist durch. Jede „schreibt"-Marke dieser Liste faellt weg; die
  // Fehlermarke der haengengebliebenen Zeile bleibt stehen — sie ist das
  // Einzige, was von dem Lauf noch zu sehen sein soll.
  fertig(art: VormerkArt, geschrieben: readonly string[]): void {
    this.schreibend.get(art)?.clear()
    const offene = this.fehler.get(art)
    if (offene) {
      for (const kennung of geschrieben) offene.delete(kennung)
    }
    this.melde()
  }

  // Der Lauf schlaegt jede Vormerkung: was gerade geschrieben wird oder
  // haengengeblieben ist, ist die dringendere Auskunft.
  zeigt(art: VormerkArt, kennung: string, grund: ZeilenStatus): ZeilenZeichen {
    const meldung = this.fehler.get(art)?.get(kennung)
    if (meldung !== undefined) return { status: 'fehler', titel: TITEL.fehler + ': ' + meldung }
    if (this.schreibend.get(art)?.has(kennung) === true) {
      return { status: 'schreibt', titel: TITEL.schreibt }
    }
    return { status: grund, titel: TITEL[grund] }
  }
}
