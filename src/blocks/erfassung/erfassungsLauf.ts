// Der Tipp-Lauf einer Erfassungszeile: getippte Werte, gewaehlte Saetze, Vorschlaege, Tasten.
import {
  nachschlagEintraege,
  quellenZeilen,
  type Eintrag,
} from '../tabelle/nachschlagen'
import { getField } from '../../softengine/data'
import { vorschlaegeImFensterStand } from '../tabelle/nachschlagStand'
import { VorschlagStand, type TastenFolge } from '../shared/vorschlagStand'
import { rechneFormel, zahlStreng, zahlText } from '../../core/data/rechnung'
import { zerlegeBindung } from '../../core/blocks/bindung'
import { alsZahl } from '../tabelle/sortierung'
import { spalteMitKennung } from '../tabelle/spalten'
import {
  anzeigeSpalteIn,
  fensterSpaltenIn,
  passendeSaetze,
  verknuepfteQuellenIn,
  zellenzielVon,
  zielIn,
  type ErfassungsUmfeld,
} from './erfassungsZeile'

// null = leer, 'fehler' = belegt, aber nicht als Zahl lesbar.
type GegebeneZahl = number | null | 'fehler'

export class ErfassungsLauf {
  private getippt = new Map<number, string>()

  private gewaehlt = new Map<string, unknown>()

  private vonHand = new Set<string>()

  private _tippSpalte = -1

  private _listeAuf = -1

  private readonly liste = new VorschlagStand<Eintrag>()

  // Je Formelspalte ihr gerechneter Text, solange nichts Getipptes davor steht.
  private readonly _gerechnet = new Map<number, string>()

  get tippSpalte(): number {
    return this._tippSpalte
  }

  get marke(): number {
    return this.liste.marke
  }

  get vorschlaege(): readonly Eintrag[] {
    return this.liste.treffer
  }

  wertVon(umfeld: ErfassungsUmfeld, index: number): string {
    const getippt = this.getippt.get(index)
    if (getippt !== undefined && getippt !== '') return getippt
    const gerechnet = this._gerechnet.get(index)
    if (gerechnet !== undefined) return gerechnet
    if (getippt !== undefined) return getippt
    const ziel = zielIn(umfeld, index)
    if (ziel.quelleId === '' || ziel.code === '') return ''
    const satz = this.gewaehlt.get(ziel.quelleId)
    return satz === undefined ? '' : getField(satz, ziel.code)
  }

  private gegebeneZahl(umfeld: ErfassungsUmfeld, index: number): GegebeneZahl {
    const getippt = this.getippt.get(index)
    if (getippt !== undefined) {
      if (getippt.trim() === '') return null
      const zahl = zahlStreng(getippt)
      return zahl === null ? 'fehler' : zahl
    }
    const ziel = zielIn(umfeld, index)
    if (ziel.quelleId === '' || ziel.code === '') return null
    const satz = this.gewaehlt.get(ziel.quelleId)
    if (satz === undefined) return null
    const wert = getField(satz, ziel.code).trim()
    if (wert === '') return null
    const zahl = alsZahl(wert)
    return zahl === null ? 'fehler' : zahl
  }

  // Ein Formelglied darf direkt auf ein Feld eines bereits gewaehlten Satzes
  // zeigen. Leer vor dem Trenner bedeutet die Hauptquelle; weitere Quellen
  // tragen ihre id in der Bindung.
  private feldZahl(umfeld: ErfassungsUmfeld, bindung: string): number | null {
    const { quelleId, code } = zerlegeBindung(bindung)
    if (code === '') return null
    const id = quelleId === '' ? umfeld.quelleId : quelleId
    if (id === '') return null
    const satz = this.gewaehlt.get(id)
    if (satz === undefined) return null
    const wert = getField(satz, code).trim()
    if (wert === '') return null
    return alsZahl(wert)
  }

  // Jede Formelspalte rechnet aus Gegebenem, Datenfeldern und aus anderen
  // Formelspalten; ein Kreis bleibt leer.
  rechne(umfeld: ErfassungsUmfeld): void {
    this._gerechnet.clear()
    const zahlen = new Map<number, number | null>()
    const unterwegs = new Set<number>()
    const zahlVon = (index: number): number | null => {
      const bekannt = zahlen.get(index)
      if (bekannt !== undefined) return bekannt
      if (unterwegs.has(index)) return null
      unterwegs.add(index)
      const gegeben = this.gegebeneZahl(umfeld, index)
      let zahl: number | null = gegeben === 'fehler' ? null : gegeben
      const formel = umfeld.spalten[index]?.formel
      if (gegeben === null && formel !== undefined) {
        zahl = rechneFormel(
          formel,
          (kennung) => {
            const i = spalteMitKennung(umfeld.spalten, kennung)
            return i === -1 ? null : zahlVon(i)
          },
          (bindung) => this.feldZahl(umfeld, bindung),
        )
        if (zahl !== null) this._gerechnet.set(index, zahlText(zahl, formel.runden.stellen))
      }
      unterwegs.delete(index)
      zahlen.set(index, zahl)
      return zahl
    }
    umfeld.spalten.forEach((spalte, index) => {
      if (spalte.formel !== undefined) zahlVon(index)
    })
  }

  tippe(index: number, text: string): void {
    this.getippt.set(index, text)
    this._tippSpalte = index
    this.liste.vonVorn()
  }

  verlasse(index: number): void {
    if (this._tippSpalte !== index) return
    this._tippSpalte = -1
    this._listeAuf = -1
    this.liste.ruhe()
  }

  // Eine leergetippte Formelzelle zeigt wieder ihren gerechneten Wert.
  istAutomatisch(umfeld: ErfassungsUmfeld, index: number): boolean {
    const getippt = this.getippt.get(index)
    const gerechnet = getippt === '' && this._gerechnet.has(index)
    return (getippt === undefined || gerechnet) && this.wertVon(umfeld, index) !== ''
  }

  // Die Zelle entscheidet nichts selbst: sie sagt dem Stand, wie sie steht, und
  // der Stand kennt die Tasten (dieselbe Logik wie im Formularfeld).
  entscheideTaste(umfeld: ErfassungsUmfeld, index: number, taste: string): TastenFolge {
    const ziel = zielIn(umfeld, index)
    const folge = this.liste.folgeFuer(taste, {
      listeOffen: this._tippSpalte === index && this.liste.offen,
      feldLeer: this.wertVon(umfeld, index) === '',
      getippt: this.getippt.get(index) !== undefined,
      nachschlagbar: ziel.art === 'verknuepft',
      hatSaetze: () => this.eintraege(umfeld, index).length > 0,
      springt: true,
    })
    if (folge === 'liste-zu') this._listeAuf = -1
    return folge
  }

  oeffneListe(index: number): void {
    this._tippSpalte = index
    this._listeAuf = index
    this.liste.aufmachen()
  }

  naechsteLeere(umfeld: ErfassungsUmfeld, ab: number): number {
    for (let i = ab + 1; i < umfeld.spalten.length; i++) {
      if (umfeld.spalten[i]?.versteckt === true) continue
      if (this.wertVon(umfeld, i) === '') return i
    }
    return -1
  }

  nachbarPlatz(umfeld: ErfassungsUmfeld, ab: number, richtung: 1 | -1): number {
    for (let i = ab + richtung; i >= 0 && i < umfeld.spalten.length; i += richtung) {
      if (umfeld.spalten[i]?.versteckt !== true) return i
    }
    return -1
  }

  leere(umfeld: ErfassungsUmfeld, index: number): void {
    this.getippt.delete(index)
    const ziel = zielIn(umfeld, index)
    if (ziel.quelleId !== '' && this.gewaehlt.has(ziel.quelleId)) {
      this.setze(umfeld, ziel.quelleId, undefined)
    }
    this.liste.vonVorn()
  }

  setzeMarke(marke: number): void {
    this.liste.setzeMarke(marke)
  }

  uebernimm(umfeld: ErfassungsUmfeld, index: number, satz: unknown): void {
    const ziel = zielIn(umfeld, index)
    if (ziel.quelleId === '') return
    this.setze(umfeld, ziel.quelleId, satz)
    this.vonHand.add(ziel.quelleId)
    if (ziel.art === 'eigen') {
      for (const id of [...this.gewaehlt.keys()]) {
        if (id !== ziel.quelleId) this.setze(umfeld, id, undefined)
      }
    }
    this.gleicheAb(umfeld)
    this._tippSpalte = -1
    this.liste.ruhe()
  }

  private setze(umfeld: ErfassungsUmfeld, quelleId: string, satz: unknown): void {
    if (satz === undefined) {
      this.gewaehlt.delete(quelleId)
      this.vonHand.delete(quelleId)
    } else this.gewaehlt.set(quelleId, satz)
    for (let i = 0; i < umfeld.spalten.length; i++) {
      if (zellenzielVon(umfeld.spalten[i], umfeld.quelleId).quelleId === quelleId) {
        this.getippt.delete(i)
      }
    }
  }

  // Der Schluesselwert der werdenden Zeile: der eigene Satz traegt ihn, sonst
  // die gewaehlten Partnersaetze ueber ihre Paare. Ein ungewaehlter Partner
  // heisst UNBEKANNT und schraenkt nicht ein.
  private schluesselWert(
    umfeld: ErfassungsUmfeld,
    partnerId: string,
    feld: string,
    ausser: string,
  ): string | undefined {
    if (partnerId !== '' && partnerId !== umfeld.quelleId) {
      const satz = this.gewaehlt.get(partnerId)
      return satz === undefined ? undefined : getField(satz, feld)
    }
    const basis = this.gewaehlt.get(umfeld.quelleId)
    if (basis !== undefined) return getField(basis, feld)
    for (const quelleId of verknuepfteQuellenIn(umfeld)) {
      if (quelleId === ausser || !this.vonHand.has(quelleId)) continue
      // Nur was an der Hauptquelle haengt, kann deren Felder vertreten.
      const partner = umfeld.partnerVon(quelleId)
      if (partner !== '' && partner !== umfeld.quelleId) continue
      const satz = this.gewaehlt.get(quelleId)
      if (satz === undefined) continue
      for (const paar of umfeld.paareZu(quelleId)) {
        if (paar.fromField !== feld) continue
        const wert = getField(satz, paar.toField)
        if (wert !== '') return wert
      }
    }
    return undefined
  }

  private moegliche(umfeld: ErfassungsUmfeld, quelleId: string, rows: readonly unknown[]): unknown[] {
    const partnerId = umfeld.partnerVon(quelleId)
    return passendeSaetze(
      umfeld.paareZu(quelleId),
      (feld) => this.schluesselWert(umfeld, partnerId, feld, quelleId),
      rows,
    )
  }

  // Bis Ruhe ist: Gewaehltes, dessen Schluessel nicht mehr passen, faellt; wo
  // genau EIN Satz uebrig bleibt, waehlt er sich selbst. Ohne einen bekannten
  // Schluessel greift die Automatik nicht.
  private gleicheAb(umfeld: ErfassungsUmfeld): void {
    const quellen = verknuepfteQuellenIn(umfeld)
    for (let runde = 0; runde <= quellen.length; runde++) {
      let bewegt = false
      for (const quelleId of quellen) {
        const paare = umfeld.paareZu(quelleId)
        if (paare.length === 0) continue
        const partnerId = umfeld.partnerVon(quelleId)
        const satz = this.gewaehlt.get(quelleId)
        if (satz !== undefined) {
          const passt = paare.every((p) => {
            const soll = this.schluesselWert(umfeld, partnerId, p.fromField, quelleId)
            return soll === undefined || (soll !== '' && soll === getField(satz, p.toField))
          })
          if (!passt) {
            this.setze(umfeld, quelleId, undefined)
            bewegt = true
          }
          continue
        }
        if (!paare.some((p) => this.schluesselWert(umfeld, partnerId, p.fromField, quelleId) !== undefined)) continue
        const rows = quellenZeilen(quelleId)
        if (rows === null) continue
        const passend = this.moegliche(umfeld, quelleId, rows)
        if (passend.length === 1) {
          this.setze(umfeld, quelleId, passend[0])
          this.vonHand.delete(quelleId)
          bewegt = true
        }
      }
      if (!bewegt) break
    }
  }

  // Die Werte einer erfassten Zeile gelten als GETIPPT; die gewaehlten Saetze
  // kommen nicht mit, aus einer Zeichenkette ist der Satz nicht wiederzufinden.
  uebernimmWerte(umfeld: ErfassungsUmfeld, werte: readonly string[]): void {
    this.zuruecksetzen()
    werte.forEach((wert, index) => {
      if (wert !== '') this.getippt.set(index, wert)
    })
    this.gibDenGerechnetenIhreLuecke(umfeld)
    this.rechne(umfeld)
  }

  // Ein von der Formel gefuellter Wert darf nicht als getippt zurueckkommen,
  // sonst rechnet die Spalte nicht mehr. Erkannt wird er daran, dass er genau
  // dem entspricht, was sich ohne ihn aus den uebrigen rechnet.
  private gibDenGerechnetenIhreLuecke(umfeld: ErfassungsUmfeld): void {
    umfeld.spalten.forEach((spalte, index) => {
      if (spalte.formel === undefined) return
      const wert = this.getippt.get(index)
      if (wert === undefined || wert === '') return
      this.getippt.delete(index)
      this.rechne(umfeld)
      if (this._gerechnet.get(index) !== wert) this.getippt.set(index, wert)
    })
  }

  zuruecksetzen(): void {
    this.getippt.clear()
    this.gewaehlt.clear()
    this.vonHand.clear()
    this._gerechnet.clear()
    this._tippSpalte = -1
    this._listeAuf = -1
    this.liste.ruhe()
  }

  aktualisiereVorschlaege(umfeld: ErfassungsUmfeld): void {
    this.rechne(umfeld)
    this.liste.zeige(this.berechne(umfeld))
  }

  private berechne(umfeld: ErfassungsUmfeld): Eintrag[] {
    const index = this._tippSpalte
    if (this.liste.zugemacht || zielIn(umfeld, index).art === 'frei') return []
    const getippt = this.getippt.get(index) ?? ''
    if (getippt === '') {
      // Aufgemacht heisst alles zeigen, sonst bleibt die Liste dem Getippten vorbehalten.
      if (this._listeAuf !== index) return []
    }
    return vorschlaegeImFensterStand(this.eintraege(umfeld, index), getippt,
      fensterSpaltenIn(umfeld, index), umfeld.baustein, umfeld.spalten[index]?.kennung)
  }

  // Dieselben Eintraege fuer Liste und Fenster. Nachgeschlagen wird nur in einer
  // verknuepften Zelle: die eigene Quelle boete ihre eigenen Zeilen an, und eine
  // davon zu waehlen klonte eine alte Position.
  eintraege(umfeld: ErfassungsUmfeld, index: number): Eintrag[] {
    const ziel = zielIn(umfeld, index)
    if (ziel.art !== 'verknuepft' || ziel.quelleId === '' || ziel.code === '') return []
    const rows = quellenZeilen(ziel.quelleId)
    if (rows === null) return []
    const saetze = this.moegliche(umfeld, ziel.quelleId, rows)
    return nachschlagEintraege(saetze, anzeigeSpalteIn(umfeld, index)?.code ?? '', ziel.code)
  }
}
