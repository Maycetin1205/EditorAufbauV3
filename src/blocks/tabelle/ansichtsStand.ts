import {
  beobachteRumpf,
  gemessenesMass,
  kopfHoehe,
  OHNE_RUMPF,
  rumpfHoehe,
  type MessZiel,
} from './rumpfMessung'
import type { Zeilenmass } from './seitengroesse'
import { fokussierterRohIndex, stelleZeilenFokusHer } from './zeilenAktivierung'

// Der Stand, in dem die Tabelle gerade DASTEHT: Suchtext, Sortierung, Seite,
// die Rumpf-Messung und der Zeilenfokus. Nichts davon ist eine Einstellung
// des Bausteins — es entsteht beim Bedienen und faellt mit dem Zweckwechsel.
// Als eigene Naht wie der Erfassungs-Stand (erfassungsAnschluss.ts), damit
// der Baustein unter seinem Zeilen-Deckel bleibt.
export interface AnsichtsWirt {
  baustein: HTMLElement & MessZiel

  // Im Editor wird nicht sortiert: dort ist der Kopfklick der Feld-Waehler.
  editable: () => boolean

  zeilenHoehe: () => number

  melde: () => void
}

export class AnsichtsStand {
  private readonly wirt: AnsichtsWirt

  private _suchtext = ''

  private _sortSpalte = -1
  private _sortAuf = true

  private _seite = 0

  private _mass: Zeilenmass | null = null
  private _beobachter: ResizeObserver | null = null

  private _taktGemessen = 0

  private _rumpfGemessen = OHNE_RUMPF

  private _kopfGemessen = 0

  private _fokusZeile: number | null = null
  private _fokusHolen = false

  constructor(wirt: AnsichtsWirt) {
    this.wirt = wirt
  }

  get suchtext(): string {
    return this._suchtext
  }

  get suchtAktiv(): boolean {
    return this._suchtext.trim() !== ''
  }

  get sortSpalte(): number {
    return this._sortSpalte
  }

  get sortAuf(): boolean {
    return this._sortAuf
  }

  get seite(): number {
    return this._seite
  }

  get mass(): Zeilenmass | null {
    return this._mass
  }

  setzeSuchtext(text: string): void {
    this.merkeZeilenFokus()
    this._suchtext = text
    this._seite = 0
    this.wirt.melde()
  }

  klickSortiere(index: number): void {
    if (this.wirt.editable()) return
    this.merkeZeilenFokus()
    if (this._sortSpalte === index) {
      this._sortAuf = !this._sortAuf
    } else {
      this._sortSpalte = index
      this._sortAuf = true
    }
    this._seite = 0
    this.wirt.melde()
  }

  blaettere(zu: number): void {
    this.merkeZeilenFokus()
    this._seite = zu
    this.wirt.melde()
  }

  fokussiereSuche(): boolean {
    const feld = this.wirt.baustein.shadowRoot
      ?.querySelector<HTMLInputElement>('.suchzeile input')
    if (!feld) return false
    feld.focus()
    return true
  }

  private merkeZeilenFokus(): void {
    const roh = fokussierterRohIndex(this.wirt.baustein.shadowRoot)
    this._fokusHolen = roh !== undefined
    this._fokusZeile = roh ?? null
  }

  private messeRumpf(): void {
    const takt = this.wirt.zeilenHoehe()
    this._taktGemessen = takt
    const { mass, hoehe, kopf } = gemessenesMass(this.wirt.baustein, takt)
    this._rumpfGemessen = hoehe
    this._kopfGemessen = kopf
    if (mass?.passen === this._mass?.passen && mass?.zeilenHoehe === this._mass?.zeilenHoehe) return
    this._mass = mass
    this.wirt.melde()
  }

  beobachte(): void {
    if (this._beobachter) return
    this._beobachter = beobachteRumpf(this.wirt.baustein, () => this.messeRumpf())
    if (this._beobachter) this.messeRumpf()
  }

  nachRendern(): void {
    // Neu messen, sobald Rumpf ODER Kopf nicht mehr so hoch sind wie beim
    // Rechnen. Beides aendert sich NACH der Messung: die Fusszeile haengt an
    // der Seitenzahl und die an der Messung; der Kopf wird zweizeilig, sobald
    // eine Spalte an eine Hilfsquelle gebunden ist. Den Kopf sieht der
    // ResizeObserver ueberhaupt nie (er haengt am Rumpf, und der behaelt seine
    // Hoehe) — ohne den Vergleich bleibt eine Zeile zu viel gerechnet.
    if (this._taktGemessen !== this.wirt.zeilenHoehe()
      || this._rumpfGemessen !== rumpfHoehe(this.wirt.baustein)
      || this._kopfGemessen !== kopfHoehe(this.wirt.baustein)) {
      this.messeRumpf()
    }
    if (!this._fokusHolen) return
    this._fokusHolen = false
    stelleZeilenFokusHer(this.wirt.baustein.shadowRoot, this._fokusZeile)
  }

  loese(): void {
    this._beobachter?.disconnect()
    this._beobachter = null
  }

  // Ein Daten-Push liefert eine neue Liste: Seite und Messung gelten nicht
  // mehr. Suchtext und Sortierung bleiben — die hat der Bediener gesetzt.
  nachPush(): void {
    this._seite = 0
    this._mass = null
    this._taktGemessen = 0
    this._rumpfGemessen = OHNE_RUMPF
    this._kopfGemessen = 0
  }

  zuruecksetzen(): void {
    this._suchtext = ''
    this._sortSpalte = -1
    this._sortAuf = true
    this.nachPush()
    this._fokusZeile = null
    this._fokusHolen = false
  }
}
