// Vormerkungen an gebuchten Zeilen: Zellwerte aendern, Zeilen zum Loeschen merken.
import type { VormerkArt } from '../../core/blocks/BlockDefinition'
import { geheInZelle, zellenFelder } from '../shared/zellenEingabe'
import { zeilenIndexVon } from './seRuntime'
import type { Spalte } from './spalten'
import type { LaufStand, ZeilenZeichen } from './zeilenStatus'

// Die gebuchten Zeilen, ohne die Erfassungszeile: die haengt unten und waere
// beim Wandern durch eine Spalte die falsche Nachbarin.
const GEBUCHTE_ZEILEN = '.koerper > .zeile:not(.erfassung)'

export interface ZeilenWirt {
  baustein: HTMLElement

  spalten: () => readonly Spalte[]

  rohzeilen: () => readonly unknown[]

  datenzeilen: () => readonly string[][]

  melde: () => void

  lauf: LaufStand

  erfassungAn: () => boolean

  fokussiereErfassungsZelle: (index: number) => void
}

export class ZeilenBearbeitung {
  private readonly wirt: ZeilenWirt

  // Sie ueberleben jeden Push: sie haengen an der Satznummer, nicht am Platz.
  private readonly aenderungen = new AenderungsSpeicher()

  private readonly geloescht = new Set<string>()

  constructor(wirt: ZeilenWirt) {
    this.wirt = wirt
  }

  // Der Vertrag der Faehigkeit aenderungsSchluessel: je Zeile ihre Satznummer
  // und ALLE Spaltenwerte, damit die Kette auch unveraenderte Felder mitschreibt.
  get geaenderteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    // satzPlaetze liefe sonst bei jedem Rendern ueber alle Zeilen der Liste.
    if (this.aenderungen.anzahl === 0) return []
    const spaltenAnzahl = this.wirt.spalten().length
    const plaetze = this.satzPlaetze()
    const raus: { satz: string; werte: readonly string[] }[] = []
    for (const { satz } of this.aenderungen.proSatz()) {
      const rohIndex = plaetze.get(satz)
      // Die Zeile ist seit der Aenderung aus der Liste verschwunden; mit leeren
      // Werten zu schreiben hiesse, den Satz im ERP leerzuraeumen.
      if (rohIndex === undefined) continue
      raus.push({
        satz,
        werte: Array.from({ length: spaltenAnzahl }, (_, spalte) => this.zellWert(rohIndex, spalte)),
      })
    }
    return raus
  }

  // Der Vertrag der Faehigkeit kannLoeschen, gleiche Form wie geaenderteZeilen.
  get geloeschteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    if (this.geloescht.size === 0) return []
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

  austragen(art: VormerkArt, kennungen: readonly string[]): void {
    let weg = false
    for (const satz of kennungen) {
      if (art === 'geaendert') weg = this.aenderungen.nimmSatzZurueck(satz) || weg
      else weg = this.geloescht.delete(satz) || weg
    }
    if (weg) this.wirt.melde()
  }

  vorgemerkteAenderungen(): number {
    return this.geaenderteZeilen.length
  }

  vorgemerkteLoeschungen(): number {
    return this.geloeschteZeilen.length
  }

  // Was der Lauf meldet, schlaegt die Vormerkung; unter den Vormerkungen
  // schlaegt die Loeschung die Aenderung.
  statusVon(rohIndex: number): ZeilenZeichen {
    const satz = this.satzVon(rohIndex)
    if (satz === '') return { status: 'gebucht', titel: '' }
    if (this.geloescht.has(satz)) return this.wirt.lauf.zeigt('geloescht', satz, 'loeschung')
    const geaendert = this.wirt.spalten()
      .some((_, spalte) => this.aenderungen.wert(satz, spalte) !== undefined)
    return this.wirt.lauf.zeigt('geaendert', satz, geaendert ? 'geaendert' : 'gebucht')
  }

  // Einmal gebaut statt je Vormerkung gesucht: bei tausenden Zeilen spuerbar.
  private satzPlaetze(): Map<string, number> {
    const plaetze = new Map<string, number>()
    this.wirt.rohzeilen().forEach((zeile, index) => {
      const satz = zeilenIndexVon(this.wirt.baustein, zeile)
      if (satz !== '' && !plaetze.has(satz)) plaetze.set(satz, index)
    })
    return plaetze
  }

  private satzVon(rohIndex: number): string {
    const rohzeile = this.wirt.rohzeilen()[rohIndex]
    return rohzeile === undefined ? '' : zeilenIndexVon(this.wirt.baustein, rohzeile)
  }

  // Eine Zeile, die weg soll, braucht keine Zell-Aenderung mehr: sonst schriebe
  // derselbe Klick erst einen neuen Wert und loeschte die Zeile danach.
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
    return this.wirt.datenzeilen()[rohIndex]?.[spaltenIndex] ?? ''
  }

  istGeaendert(rohIndex: number, spaltenIndex: number): boolean {
    return this.aenderungen.wert(this.satzVon(rohIndex), spaltenIndex) !== undefined
  }

  tippeZelle(rohIndex: number, spaltenIndex: number, text: string): void {
    if (this.aenderungen.setze(this.satzVon(rohIndex), spaltenIndex, text)) {
      this.wirt.melde()
    }
  }

  // Steht wieder der urspruengliche Wert da, faellt die Vormerkung weg.
  // Verglichen wird roh gegen roh, wie der ERP-Wert kommt.
  verlasseZelle(rohIndex: number, spaltenIndex: number, text: string): void {
    const satz = this.satzVon(rohIndex)
    const urspruenglich = this.wirt.datenzeilen()[rohIndex]?.[spaltenIndex] ?? ''
    const geaendert = text === urspruenglich
      ? this.aenderungen.nimmZurueck(satz, spaltenIndex)
      : this.aenderungen.setze(satz, spaltenIndex, text)
    if (geaendert) this.wirt.melde()
  }

  // Senkrecht durch DIESELBE Spalte; der Fokuswechsel loest das Verlassen der
  // alten Zelle aus. Waagerecht bleibt Tab.
  private zelleNachbar(
    spaltenIndex: number,
    von: HTMLInputElement,
    schritt: number,
    enterModus: boolean,
  ): void {
    const felder = zellenFelder(
      this.wirt.baustein.shadowRoot,
      GEBUCHTE_ZEILEN,
      spaltenIndex,
    )
    const jetzt = felder.indexOf(von)
    if (jetzt < 0) return
    let ziel = jetzt + schritt
    if (ziel > felder.length - 1) {
      // Enter unter der letzten Zeile: weiter in die Erfassungszeile.
      if (enterModus && this.wirt.erfassungAn()) {
        this.wirt.fokussiereErfassungsZelle(0)
        return
      }
      ziel = felder.length - 1
    }
    if (ziel < 0) ziel = 0
    const feld = felder[ziel]
    if (feld === von) return
    geheInZelle(feld)
  }

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
