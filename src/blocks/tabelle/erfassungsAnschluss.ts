import { verknuepfungenVon } from '../shared/fremdeQuellen'
import { ErfassungsLauf } from './erfassungsLauf'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import type { Spalte } from './spalten'

// Der Erfassungs-Anteil des Tabellen-Bausteins als EIN Stand: der laufende
// Tipp-Zustand (ErfassungsLauf) und die erfassten, noch nicht geschriebenen
// Zeilen. Als eigene Naht, damit der Baustein unter seinem Zeilen-Deckel
// bleibt — er delegiert nur und entscheidet, wann neu gerendert wird.
export class ErfassungsAnschluss {
  readonly lauf = new ErfassungsLauf()

  private _zeilen: { kennung: string; werte: string[] }[] = []

  private naechsteKennung = 1

  // Werte je Spalte, in Spalten-Reihenfolge — das liest die Kette am Knopf
  // (ErfassungsTraegerElement in core/blocks/BlockDefinition.ts).
  get zeilen(): readonly (readonly string[])[] {
    return this._zeilen.map((z) => z.werte)
  }

  // Dieselbe Reihenfolge, aber die Kennungen: der Ketten-Bericht sagt damit,
  // WELCHE Zeile geschrieben ist — der Platz taugt dafuer nicht, er
  // verschiebt sich, sobald der Bediener eine Zeile wegnimmt.
  get schluessel(): readonly string[] {
    return this._zeilen.map((z) => z.kennung)
  }

  // Die Erfassungszeile leitet alles aus zwei vorhandenen Angaben ab: der
  // Bindung jeder Spalte und der Verknuepfung des Bausteins (Attribut am
  // Element) — sie braucht keine eigene Einstellung.
  umfeld(el: HTMLElement, spalten: readonly Spalte[], quelleId: string): ErfassungsUmfeld {
    const verknuepfungen = verknuepfungenVon(el)
    return {
      spalten,
      quelleId,
      paareZu: (id) => verknuepfungen.find((v) => v.quelleId === id)?.keyPairs ?? [],
      partnerVon: (id) => verknuepfungen.find((v) => v.quelleId === id)?.partnerId ?? '',
    }
  }

  // Enter am Zeilenende: die Zeile bleibt stehen, die Erfassung beginnt leer
  // von vorn (G4). Eine ganz leere Zeile wird nicht erfasst.
  erfasse(umfeld: ErfassungsUmfeld): boolean {
    const werte = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
    if (werte.every((w) => w === '')) return false
    this._zeilen = [...this._zeilen, { kennung: `e${this.naechsteKennung}`, werte }]
    this.naechsteKennung += 1
    this.lauf.zuruecksetzen()
    return true
  }

  // Eine erfasste Zeile wieder wegnehmen — vor dem Schreiben ist sie nichts
  // als eine Vormerkung. Ohne diesen Weg bliebe ein Vertipper stehen, bis
  // die Kette ihn in die ERP traegt.
  entferne(index: number): boolean {
    if (index < 0 || index >= this._zeilen.length) return false
    this._zeilen = this._zeilen.filter((_, i) => i !== index)
    return true
  }

  // Was die Kette geschrieben hat, ist keine Vormerkung mehr. Alles andere
  // bleibt stehen — auch die Zeile, an der der Lauf haengengeblieben ist.
  austragen(kennungen: readonly string[]): boolean {
    if (kennungen.length === 0) return false
    const bleibt = this._zeilen.filter((z) => !kennungen.includes(z.kennung))
    if (bleibt.length === this._zeilen.length) return false
    this._zeilen = bleibt
    return true
  }

  zuruecksetzen(): void {
    this._zeilen = []
    this.lauf.zuruecksetzen()
  }
}
