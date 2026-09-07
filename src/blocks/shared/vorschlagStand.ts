// Der Stand der Vorschlagsliste an EINER Eingabestelle: Treffer, Marke, zugemacht.
import type { Vorschlag } from './vorschlagListe'

// Die Marke laeuft um: unter dem letzten Treffer geht es oben wieder los.
function bewegteMarke(marke: number, anzahl: number, schritt: 1 | -1): number {
  if (anzahl <= 0) return 0
  return (((marke + schritt) % anzahl) + anzahl) % anzahl
}

// Eine Marke hinter dem Ende waere eine Uebernahme ins Leere.
function gueltigeMarke(marke: number, anzahl: number): number {
  if (anzahl <= 0) return 0
  return marke < 0 || marke >= anzahl ? 0 : marke
}

export type TastenFolge =
  | 'marke-hoch'
  | 'marke-runter'
  | 'uebernehmen'
  | 'liste-zu'
  | 'fenster'
  | 'nichts'

function tastenFolge(taste: string, args: {
  listeOffen: boolean

  feldLeer: boolean

  treffer: number

  // Hat der Bediener selbst ausgesucht, gilt seine Wahl.
  markeVonHand: boolean
}): TastenFolge {
  if (taste === 'ArrowDown') return args.listeOffen ? 'marke-runter' : 'nichts'
  if (taste === 'ArrowUp') return args.listeOffen ? 'marke-hoch' : 'nichts'
  if (taste === 'Escape') return args.listeOffen ? 'liste-zu' : 'nichts'
  if (taste !== 'Enter') return 'nichts'
  // Genau ein Treffer ist keine Auswahl, sondern das Ergebnis; bei mehreren geht
  // das grosse Fenster auf, statt stumm den ersten zu nehmen.
  if (args.listeOffen) {
    return args.markeVonHand || args.treffer === 1 ? 'uebernehmen' : 'fenster'
  }
    // Getippter Text ohne Treffer laesst das Fenster ZU: sonst belohnt es den
    // Tippfehler und der Bediener verliert seinen Text aus den Augen.
  return args.feldLeer ? 'fenster' : 'nichts'
}

export class VorschlagStand<T extends Vorschlag = Vorschlag> {
  private _treffer: readonly T[] = []

  private _marke = 0

  // Nur eine SELBST getroffene Wahl schlaegt die Trefferzahl.
  private _vonHand = false

  // Escape macht die Liste zu, ohne das Getippte anzuruehren.
  private _zu = false

  get treffer(): readonly T[] {
    return this._treffer
  }

  get marke(): number {
    return this._marke
  }

  get offen(): boolean {
    return this._treffer.length > 0
  }

  get zugemacht(): boolean {
    return this._zu
  }

  // Eindeutig ist die Wahl, wenn der Bediener sie selbst markiert hat oder nur
  // ein Treffer dasteht. Tab uebernimmt nur dann.
  get eindeutig(): boolean {
    return this._vonHand || this._treffer.length === 1
  }

  // Einmal je Darstellung: Tastatur und Anzeige muessen denselben Stand sehen.
  zeige(treffer: readonly T[]): void {
    this._treffer = treffer
    this._marke = gueltigeMarke(this._marke, treffer.length)
  }

  // Ein neuer Tastendruck im Feld: die Liste faengt oben an und ist wieder auf.
  vonVorn(): void {
    this._marke = 0
    this._vonHand = false
    this._zu = false
  }

  // Aufgemacht heisst alles zeigen; die Marke gilt dann als selbst gesetzt.
  aufmachen(): void {
    this._marke = 0
    this._vonHand = true
    this._zu = false
  }

  ruhe(): void {
    this._treffer = []
    this._marke = 0
    this._vonHand = false
    this._zu = false
  }

  setzeMarke(marke: number): void {
    this._marke = marke
  }

  // Was eine Taste an dieser Stelle bedeutet. Marke und Zumachen zieht der
  // Stand selbst nach; der Aufrufer macht nur, was nach aussen wirkt.
  folgeFuer(taste: string, args: { feldLeer: boolean; listeOffen: boolean }): TastenFolge {
    const folge = tastenFolge(taste, {
      listeOffen: args.listeOffen,
      feldLeer: args.feldLeer,
      treffer: this._treffer.length,
      markeVonHand: this._vonHand,
    })
    if (folge === 'marke-hoch' || folge === 'marke-runter') {
      this._marke = bewegteMarke(this._marke, this._treffer.length, folge === 'marke-hoch' ? -1 : 1)
      this._vonHand = true
    } else if (folge === 'liste-zu') this._zu = true
    return folge
  }
}
