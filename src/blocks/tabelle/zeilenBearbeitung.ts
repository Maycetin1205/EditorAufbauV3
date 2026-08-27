import { AenderungsSpeicher } from './aenderungen'
import { zeilenIndexVon } from './seRuntime'
import type { Spalte } from './spalten'
import { spaltenArt, zellText } from './spaltenArten'

// Was an einer GEBUCHTEN Zeile passiert: die Vormerkungen (geaendert, weg)
// und die Bedienung der aenderbaren Zellen. Getrennt vom Baustein wie die
// Erfassungszeile (erfassungsBedienung.ts), damit der unter seinem
// Zeilen-Deckel bleibt — mehr als diesen Wirt sieht die Bedienung von ihm
// nicht.
export interface ZeilenWirt {
  baustein: HTMLElement

  spalten: () => readonly Spalte[]

  rohzeilen: () => readonly unknown[]

  datenzeilen: () => readonly string[][]

  melde: () => void

  // Enter unter der letzten Zeile rueckt in die Erfassungszeile — die haelt
  // der Baustein.
  erfassungAn: () => boolean

  fokussiereErfassungsZelle: (index: number) => void
}

export class ZeilenBearbeitung {
  private readonly wirt: ZeilenWirt

  // Vorgemerkte Aenderungen an GEBUCHTEN Zeilen. Ueberleben jeden Push
  // (sie haengen an der Satznummer, nicht am Platz in der Liste).
  private readonly aenderungen = new AenderungsSpeicher()

  // Satznummern der Zeilen, die weg sollen. Auch sie ueberleben einen Push.
  private readonly geloescht = new Set<string>()

  constructor(wirt: ZeilenWirt) {
    this.wirt = wirt
  }

  // Der Vertrag der Faehigkeit aenderungsSchluessel (AenderungsTraegerElement
  // in core/blocks/BlockDefinition.ts): je vorgemerkter Zeile ihre Satznummer
  // und ALLE Spaltenwerte — die geaenderten inbegriffen. So kann die Kette
  // auch unveraenderte Felder derselben Zeile mitschreiben.
  get geaenderteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    const spaltenAnzahl = this.wirt.spalten().length
    const plaetze = this.satzPlaetze()
    const raus: { satz: string; werte: readonly string[] }[] = []
    for (const { satz } of this.aenderungen.proSatz()) {
      const rohIndex = plaetze.get(satz)
      // Die Zeile ist seit der Aenderung aus der Liste verschwunden (ein Push
      // hat sie weggenommen). Sie wird NICHT geschrieben: mit leeren Werten
      // zu schreiben hiesse, den Satz in der ERP leerzuraeumen.
      if (rohIndex === undefined) continue
      raus.push({
        satz,
        werte: Array.from({ length: spaltenAnzahl }, (_, spalte) => this.zellWert(rohIndex, spalte)),
      })
    }
    return raus
  }

  aenderungenLeeren(): void {
    if (this.aenderungen.leeren()) this.wirt.melde()
  }

  // Der Vertrag der Faehigkeit kannLoeschen (LoeschTraegerElement): je
  // vorgemerkter Zeile ihre Satznummer und alle Spaltenwerte. Zeilen, die
  // ein Push inzwischen weggenommen hat, fallen raus — sie sind schon weg.
  get geloeschteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    const spaltenAnzahl = this.wirt.spalten().length
    const plaetze = this.satzPlaetze()
    const raus: { satz: string; werte: readonly string[] }[] = []
    for (const satz of this.geloescht) {
      const rohIndex = plaetze.get(satz)
      if (rohIndex === undefined) continue
      raus.push({
        satz,
        werte: Array.from({ length: spaltenAnzahl }, (_, spalte) => this.zellWert(rohIndex, spalte)),
      })
    }
    return raus
  }

  loeschungenLeeren(): void {
    if (this.geloescht.size === 0) return
    this.geloescht.clear()
    this.wirt.melde()
  }

  // Vorgemerkt heisst: noch schreibbar. Eine Zeile, die ein Push aus der
  // Liste genommen hat, zaehlt nicht mehr mit — sonst stuende unter der
  // Tabelle eine Zahl, die der Knopf nicht einloest.
  vorgemerkteAnzahl(): number {
    if (this.aenderungen.anzahl === 0) return 0
    const plaetze = this.satzPlaetze()
    let anzahl = 0
    for (const eintrag of this.aenderungen.proSatz()) {
      if (plaetze.has(eintrag.satz)) anzahl += eintrag.aenderungen.length
    }
    return anzahl
  }

  vorgemerkteLoeschungen(): number {
    return this.geloeschteZeilen.length
  }

  // Satznummer -> Platz in der Liste. Einmal gebaut statt je Vormerkung
  // gesucht: bei tausenden Zeilen waere das Suchen je Aenderung spuerbar.
  private satzPlaetze(): Map<string, number> {
    const plaetze = new Map<string, number>()
    this.wirt.rohzeilen().forEach((zeile, index) => {
      const satz = zeilenIndexVon(this.wirt.baustein, zeile)
      if (satz !== '' && !plaetze.has(satz)) plaetze.set(satz, index)
    })
    return plaetze
  }

  // Der Schluessel einer Vormerkung ist die Satznummer der Zeile. Ohne sie
  // wird gar nicht erst ein Eingabefeld gezeigt (aendernMoeglich).
  private satzVon(rohIndex: number): string {
    const rohzeile = this.wirt.rohzeilen()[rohIndex]
    return rohzeile === undefined ? '' : zeilenIndexVon(this.wirt.baustein, rohzeile)
  }

  private zellAnzeige(spaltenIndex: number, roh: string): string {
    const spalte = this.wirt.spalten()[spaltenIndex]
    return spalte === undefined ? roh : zellText(spaltenArt(spalte.art), roh)
  }

  // Eine Zeile, die weg soll, braucht keine Zell-Aenderung mehr: was an ihr
  // vorgemerkt war, faellt mit. Sonst schriebe derselbe Klick erst einen
  // neuen Wert und loeschte die Zeile gleich danach.
  schalteLoeschung(rohIndex: number): void {
    const satz = this.satzVon(rohIndex)
    if (satz === '') return
    if (this.geloescht.has(satz)) this.geloescht.delete(satz)
    else {
      this.geloescht.add(satz)
      this.wirt.spalten().forEach((_, spalte) => {
        this.aenderungen.nimmZurueck(satz, spalte)
      })
    }
    this.wirt.melde()
  }

  istGeloescht(rohIndex: number): boolean {
    const satz = this.satzVon(rohIndex)
    return satz !== '' && this.geloescht.has(satz)
  }

  zellWert(rohIndex: number, spaltenIndex: number): string {
    const vorgemerkt = this.aenderungen.wert(this.satzVon(rohIndex), spaltenIndex)
    if (vorgemerkt !== undefined) return vorgemerkt
    return this.zellAnzeige(spaltenIndex, this.wirt.datenzeilen()[rohIndex]?.[spaltenIndex] ?? '')
  }

  istGeaendert(rohIndex: number, spaltenIndex: number): boolean {
    return this.aenderungen.wert(this.satzVon(rohIndex), spaltenIndex) !== undefined
  }

  // Waehrend des Tippens bleibt stehen, was getippt ist — nicht formatiert,
  // sonst spraenge die Schreibmarke. Geformt wird beim Verlassen.
  tippeZelle(rohIndex: number, spaltenIndex: number, text: string): void {
    if (this.aenderungen.setze(this.satzVon(rohIndex), spaltenIndex, text)) {
      this.wirt.melde()
    }
  }

  // Beim Verlassen wird der getippte Wert in die Form der Spalte gebracht.
  // Steht danach wieder der urspruengliche Wert da, ist es keine Aenderung
  // mehr — die Vormerkung faellt weg, samt Marke.
  verlasseZelle(rohIndex: number, spaltenIndex: number, text: string): void {
    const satz = this.satzVon(rohIndex)
    const geformt = this.zellAnzeige(spaltenIndex, text)
    const urspruenglich = this.zellAnzeige(
      spaltenIndex,
      this.wirt.datenzeilen()[rohIndex]?.[spaltenIndex] ?? '',
    )
    const geaendert = geformt === urspruenglich
      ? this.aenderungen.nimmZurueck(satz, spaltenIndex)
      : this.aenderungen.setze(satz, spaltenIndex, geformt)
    if (geaendert) this.wirt.melde()
  }

  // Senkrecht durch DIESELBE Spalte, wie in der Handmaske (dort der „Anker"
  // ueber die Mengen-Spalte). Der Fokuswechsel loest das Verlassen der alten
  // Zelle aus — geformt und verglichen wird dort. Waagerecht bleibt Tab:
  // eine Zeile kann mehrere aenderbare Spalten haben, und dann ist die
  // Nachbarzelle rechts das Naheliegende.
  private zelleNachbar(
    spaltenIndex: number,
    von: HTMLInputElement,
    schritt: number,
    enterModus: boolean,
  ): void {
    const felder = Array.from(this.wirt.baustein.shadowRoot?.querySelectorAll<HTMLInputElement>(
      `.koerper > .zeile:not(.erfassung) .zell-eingabe[data-spalte="${spaltenIndex}"]`,
    ) ?? [])
    const jetzt = felder.indexOf(von)
    if (jetzt < 0) return
    let ziel = jetzt + schritt
    if (ziel > felder.length - 1) {
      // Enter unter der letzten Zeile: weiter in die Erfassungszeile — dort
      // tippt der Bediener die naechste Position (Handmaske: enterModus).
      if (enterModus && this.wirt.erfassungAn()) {
        this.wirt.fokussiereErfassungsZelle(0)
        return
      }
      ziel = felder.length - 1
    }
    if (ziel < 0) ziel = 0
    const feld = felder[ziel]
    if (!feld || feld === von) return
    feld.focus()
    // Der Inhalt steht markiert da: wer weitertippt, ueberschreibt — genau
    // der Editier-Start der Handmaske (dort selectNodeContents).
    feld.select()
    feld.scrollIntoView({ block: 'nearest' })
  }

  // Escape nimmt die Vormerkung zurueck (der Wert der Zeile gilt wieder).
  // Keine dieser Tasten darf bis zur Zeile durchfallen: dort loeste Enter die
  // Kette „Zeile gewaehlt" aus, und Pfeile blaetterten den Rumpf.
  tasteZelle(rohIndex: number, spaltenIndex: number, e: KeyboardEvent): void {
    const feld = e.target as HTMLInputElement
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (this.aenderungen.nimmZurueck(this.satzVon(rohIndex), spaltenIndex)) {
        this.wirt.melde()
      }
      return
    }
    const schritte: Record<string, number> = {
      Enter: 1,
      ArrowDown: 1,
      ArrowUp: -1,
      PageDown: 10,
      PageUp: -10,
    }
    const schritt = schritte[e.key]
    if (schritt === undefined) return
    e.preventDefault()
    e.stopPropagation()
    this.zelleNachbar(spaltenIndex, feld, schritt, e.key === 'Enter')
  }
}
