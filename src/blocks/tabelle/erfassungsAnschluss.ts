import type { Rechnung } from '../../core/data/rechnung'
import { verknuepfungenVon } from '../shared/fremdeQuellen'
import { ErfassungsLauf } from './erfassungsLauf'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import type { Spalte } from './spalten'

export class ErfassungsAnschluss {
  readonly lauf = new ErfassungsLauf()

  private _zeilen: { kennung: string; werte: string[]; geschrieben?: true }[] = []

  private naechsteKennung = 1

  private _zurueck: { kennung: string; platz: number } | null = null

  // Die Korrektur bleibt AN ORT UND STELLE: nichts springt, nichts sortiert
  // sich um (Nutzer 2026-09-01).
  get korrekturPlatz(): number | null {
    return this._zurueck === null ? null : this._zurueck.platz
  }

  get zeilen(): readonly (readonly string[])[] {
    return this._zeilen.map((z) => z.werte)
  }

  private get obenKennung(): string {
    return `e${this.naechsteKennung}`
  }

  // Auch die unten getippte Zeile zaehlt hier mit: wer sie ausfuellte und
  // buchte, ohne vorher Enter zu druecken, sah sie vor sich und bekam sie
  // trotzdem nicht ins ERP (Nutzer-Befund 2026-09-01).
  vormerkungen(umfeld: ErfassungsUmfeld): { kennung: string; werte: readonly string[] }[] {
    const alle = this._zeilen
      .filter((z) => z.geschrieben !== true)
      .map((z) => ({ kennung: z.kennung, werte: z.werte as readonly string[] }))
    const oben = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
    if (oben.every((w) => w === '')) return alle
    const zurueck = this._zurueck
    if (!zurueck) return [...alle, { kennung: this.obenKennung, werte: oben }]
    const platz = this._zeilen
      .slice(0, zurueck.platz)
      .filter((z) => z.geschrieben !== true).length
    return [
      ...alle.slice(0, platz),
      { kennung: zurueck.kennung, werte: oben },
      ...alle.slice(platz),
    ]
  }

  istGeschrieben(index: number): boolean {
    return this._zeilen[index]?.geschrieben === true
  }

  get schluessel(): readonly string[] {
    return this._zeilen.map((z) => z.kennung)
  }

  umfeld(
    el: HTMLElement,
    spalten: readonly Spalte[],
    quelleId: string,
    rechnung: Rechnung | null = null,
  ): ErfassungsUmfeld {
    const verknuepfungen = verknuepfungenVon(el)
    return {
      spalten,
      quelleId,
      paareZu: (id) => verknuepfungen.find((v) => v.quelleId === id)?.keyPairs ?? [],
      partnerVon: (id) => verknuepfungen.find((v) => v.quelleId === id)?.partnerId ?? '',
      rechnung,
    }
  }

  erfasse(umfeld: ErfassungsUmfeld): boolean {
    this.lauf.rechne(umfeld)
    const werte = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
    const zurueck = this._zurueck
    if (werte.every((w) => w === '')) {
      if (!zurueck) return false
      this._zurueck = null
      this.lauf.zuruecksetzen()
      return true
    }
    if (zurueck) {
      this._zeilen = [
        ...this._zeilen.slice(0, zurueck.platz),
        { kennung: zurueck.kennung, werte },
        ...this._zeilen.slice(zurueck.platz),
      ]
      this._zurueck = null
    } else {
      this._zeilen = [...this._zeilen, { kennung: this.obenKennung, werte }]
      this.naechsteKennung += 1
    }
    this.lauf.zuruecksetzen()
    return true
  }

  zurueckholen(umfeld: ErfassungsUmfeld, index: number): boolean {
    const zeile = this._zeilen[index]
    if (!zeile || zeile.geschrieben === true) return false
    this.erfasse(umfeld)
    const jetzt = this._zeilen.indexOf(zeile)
    if (jetzt === -1) return false
    this._zeilen = this._zeilen.filter((_, i) => i !== jetzt)
    this._zurueck = { kennung: zeile.kennung, platz: jetzt }
    this.lauf.uebernimmWerte(umfeld, zeile.werte)
    return true
  }

  entferne(index: number): boolean {
    if (index < 0 || index >= this._zeilen.length) return false
    this._zeilen = this._zeilen.filter((_, i) => i !== index)
    if (this._zurueck !== null && index < this._zurueck.platz) {
      this._zurueck = { ...this._zurueck, platz: this._zurueck.platz - 1 }
    }
    return true
  }

  // Geschriebene Zeilen bleiben SICHTBAR: PUT ist Einweg und meldet keine
  // Ablehnung — floegen sie hier aus der Liste und SoftEngine lieferte nichts
  // nach, waere die Eingabe des Bedieners spurlos weg.
  markiereGeschrieben(umfeld: ErfassungsUmfeld, kennungen: readonly string[]): boolean {
    if (kennungen.length === 0) return false
    let geaendert = false
    this._zeilen = this._zeilen.map((z) => {
      if (z.geschrieben === true || !kennungen.includes(z.kennung)) return z
      geaendert = true
      return { ...z, geschrieben: true }
    })
    const zurueck = this._zurueck
    if (zurueck !== null && kennungen.includes(zurueck.kennung)) {
      this._zeilen = [
        ...this._zeilen.slice(0, zurueck.platz),
        {
          kennung: zurueck.kennung,
          werte: umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i)),
          geschrieben: true,
        },
        ...this._zeilen.slice(zurueck.platz),
      ]
      this._zurueck = null
      this.lauf.zuruecksetzen()
      geaendert = true
    } else if (zurueck === null && kennungen.includes(this.obenKennung)) {
      const werte = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
      if (!werte.every((w) => w === '')) {
        this._zeilen = [...this._zeilen, { kennung: this.obenKennung, werte, geschrieben: true }]
        this.naechsteKennung += 1
        this.lauf.zuruecksetzen()
        geaendert = true
      }
    }
    return geaendert
  }

  vergissGeschriebene(): boolean {
    const bleibt = this._zeilen.filter((z) => z.geschrieben !== true)
    if (bleibt.length === this._zeilen.length) return false
    this._zeilen = bleibt
    return true
  }

  zuruecksetzen(): void {
    this._zeilen = []
    this._zurueck = null
    this.lauf.zuruecksetzen()
  }
}
