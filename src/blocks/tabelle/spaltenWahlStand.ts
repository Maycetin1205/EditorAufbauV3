import { ladeWahl, sichereWahl, wahlSchluessel } from './spaltenWahl'

// Der Stand der Bediener-Spaltenwahl: WAS weggenommen ist und OB das Fenster
// gerade offen steht (und wo). Nichts davon ist eine Einstellung des
// Bausteins — es entsteht beim Bedienen der fertigen Maske.
//
// Als eigene Naht wie AnsichtsStand und ErfassungsAnschluss, damit der
// Baustein unter seinem Zeilen-Deckel bleibt. Was die Wahl BEDEUTET und wie
// sie gezeichnet wird, steht weiter in spaltenWahl.ts; hier liegt nur, in
// welchem Zustand sie gerade ist.

const LEERE_WAHL: ReadonlySet<string> = new Set()

export interface SpaltenWahlWirt {
  baustein: HTMLElement

  // Nur in der fertigen Maske und nur mit Kopfzeile — ohne Ueberschrift gibt
  // es keinen Platz fuer den Rechtsklick.
  an: () => boolean

  // Neu zeichnen, und die fluechtigen Spaltenbreiten vergessen: die haengen
  // am Platz der GEZEICHNETEN Spalten, mit einer mehr oder weniger stimmen
  // sie nicht mehr.
  melde: () => void
  breitenVergessen: () => void
}

export class SpaltenWahlStand {
  private readonly wirt: SpaltenWahlWirt

  // Erst beim ersten Lesen aus dem Speicher geholt: `wahlSchluessel` braucht
  // den Maskennamen und das fertige Dokument, beides steht im Konstruktor
  // noch nicht.
  private _weg: Set<string> | null = null

  private _offen: { links: number; oben: number } | null = null

  constructor(wirt: SpaltenWahlWirt) {
    this.wirt = wirt
  }

  get offen(): { links: number; oben: number } | null {
    return this._offen
  }

  weg(): ReadonlySet<string> {
    if (!this.wirt.an()) return LEERE_WAHL
    if (this._weg === null) this._weg = ladeWahl(wahlSchluessel(this.wirt.baustein))
    return this._weg
  }

  private readonly nimmTaste = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return
    this.schliesse()
  }

  // Das eigene Fenster statt des Browser-Menues — genau dafuer ist der
  // Rechtsklick hier vergeben (Nutzer-Entscheidung 2026-09-03).
  oeffne(e: MouseEvent, rahmen: DOMRect): void {
    e.preventDefault()
    e.stopPropagation()
    this._offen = {
      links: Math.max(4, Math.min(e.clientX - rahmen.left, Math.max(4, rahmen.width - 170))),
      oben: Math.max(4, Math.min(e.clientY - rahmen.top, Math.max(4, rahmen.height - 60))),
    }
    window.addEventListener('keydown', this.nimmTaste)
    this.wirt.melde()
  }

  schliesse(): void {
    if (this._offen === null) return
    this._offen = null
    window.removeEventListener('keydown', this.nimmTaste)
    this.wirt.melde()
  }

  // Eine Spalte weg oder wieder her.
  schalte(kennung: string): void {
    const weg = new Set(this.weg())
    if (weg.has(kennung)) weg.delete(kennung)
    else weg.add(kennung)
    this.merke(weg)
  }

  alleZeigen(): void {
    this.merke(new Set())
  }

  private merke(weg: Set<string>): void {
    this._weg = weg
    sichereWahl(wahlSchluessel(this.wirt.baustein), weg)
    this.wirt.breitenVergessen()
    this.wirt.melde()
  }

  // Beim Abhaengen des Bausteins: die Taste darf nicht am Fenster
  // haengenbleiben (sonst horcht sie weiter, obwohl es die Tabelle nicht
  // mehr gibt).
  loese(): void {
    window.removeEventListener('keydown', this.nimmTaste)
    this._offen = null
  }
}
