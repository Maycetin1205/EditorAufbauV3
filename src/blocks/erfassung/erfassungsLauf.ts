// Der Tipp-Lauf einer Erfassungszeile: getippte Werte, gewaehlte Saetze, Vorschlaege, Tasten.
import {
  nachschlagEintraege,
  quellenZeilen,
  type Eintrag,
} from '../tabelle/nachschlagen'
import { getField } from '../../softengine/data'
import { passendeVorschlaege, VORSCHLAEGE_MAX } from '../shared/vorschlagListe'
import { VorschlagStand, type TastenFolge } from '../shared/vorschlagStand'
import {
  loeseRechnung,
  platzText,
  zahlStreng,
  PLATZ_KEYS,
  type PlatzKey,
  type PlatzWert,
} from '../../core/data/rechnung'
import { alsZahl } from '../tabelle/sortierung'
import { spalteMitKennung } from '../tabelle/spalten'
import {
  anzeigeSpalteIn,
  passendeSaetze,
  verknuepfteQuellenIn,
  zellenzielVon,
  zielIn,
  type ErfassungsUmfeld,
} from './erfassungsZeile'

export type ErfassungsTaste = TastenFolge | 'weiter' | 'leeren' | 'liste-auf'

export class ErfassungsLauf {
  private getippt = new Map<number, string>()

  private gewaehlt = new Map<string, unknown>()

  private vonHand = new Set<string>()

  private _tippSpalte = -1

  private _listeAuf = -1

  private readonly liste = new VorschlagStand<Eintrag>()

  private _gerechnet: { index: number; wert: string } | null = null

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
    if (this._gerechnet?.index === index) return this._gerechnet.wert
    if (getippt !== undefined) return getippt
    const ziel = zielIn(umfeld, index)
    if (ziel.quelleId === '' || ziel.code === '') return ''
    const satz = this.gewaehlt.get(ziel.quelleId)
    return satz === undefined ? '' : getField(satz, ziel.code)
  }

  private gegebeneZahl(umfeld: ErfassungsUmfeld, index: number): PlatzWert {
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

  rechne(umfeld: ErfassungsUmfeld): void {
    this._gerechnet = null
    const r = umfeld.rechnung
    if (!r) return
    const werte = {} as Record<PlatzKey, PlatzWert>
    const indizes = {} as Record<PlatzKey, number>
    const konfiguriert = new Set<PlatzKey>()
    for (const key of PLATZ_KEYS) {
      const index = spalteMitKennung(umfeld.spalten, r[key].spalte)
      indizes[key] = index
      werte[key] = index === -1 ? null : this.gegebeneZahl(umfeld, index)
      if (index !== -1) konfiguriert.add(key)
    }
    const geloest = loeseRechnung(r, werte, konfiguriert)
    if (!geloest) return
    this._gerechnet = {
      index: indizes[geloest.platz],
      wert: platzText(geloest.wert, r[geloest.platz].runden.stellen),
    }
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

  istAutomatisch(umfeld: ErfassungsUmfeld, index: number): boolean {
    return !this.getippt.has(index) && this.wertVon(umfeld, index) !== ''
  }

  entscheideTaste(umfeld: ErfassungsUmfeld, index: number, taste: string): ErfassungsTaste {
    const listeOffen = this._tippSpalte === index && this.liste.offen
    // Tab ist immer die Weiter-Taste; das grosse Fenster oeffnen nur Enter und F4.
    if (taste === 'Tab') {
      if (listeOffen && this.liste.eindeutig) taste = 'Enter'
      else return 'weiter'
    }
    if (taste === 'F4') {
      if (zielIn(umfeld, index).art === 'frei') return 'nichts'
      return this.eintraege(umfeld, index).length === 0 ? 'nichts' : 'fenster'
    }
    const wert = this.wertVon(umfeld, index)
    if (taste === 'Escape' && !listeOffen) return wert === '' ? 'nichts' : 'leeren'
    if (zielIn(umfeld, index).art === 'frei') return taste === 'Enter' ? 'weiter' : 'nichts'
    if (taste === 'ArrowDown' && !listeOffen) {
      return zielIn(umfeld, index).art === 'verknuepft' ? 'liste-auf' : 'nichts'
    }
    const folge = this.liste.folgeFuer(taste, { listeOffen, feldLeer: wert === '' })
    if (folge === 'liste-zu') this._listeAuf = -1
    // Enter im LEEREN Feld springt weiter.
    else if (folge === 'fenster' && wert === '') return 'weiter'
    else if (folge === 'fenster' && this.eintraege(umfeld, index).length === 0) return 'weiter'
    else if (folge === 'nichts' && taste === 'Enter' && wert !== '') {
      const getippt = this.getippt.get(index) !== undefined
      if (!getippt || zielIn(umfeld, index).art !== 'verknuepft') return 'weiter'
    }
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
    this.gibDemGerechnetenPlatzSeineLuecke(umfeld)
    this.rechne(umfeld)
  }

  // Der von der Rechnung gefuellte Platz darf nicht als gegebener Wert
  // zurueckkommen, sonst schweigt die Rechnung. Erkannt wird er daran, dass sein
  // Wert genau dem entspricht, was sich ohne ihn aus den uebrigen rechnet.
  private gibDemGerechnetenPlatzSeineLuecke(umfeld: ErfassungsUmfeld): void {
    const r = umfeld.rechnung
    if (!r) return
    for (const key of PLATZ_KEYS) {
      const index = spalteMitKennung(umfeld.spalten, r[key].spalte)
      if (index === -1) continue
      const wert = this.getippt.get(index)
      if (wert === undefined || wert === '') continue
      this.getippt.delete(index)
      this.rechne(umfeld)
      if (this._gerechnet?.index === index && this._gerechnet.wert === wert) return
      this.getippt.set(index, wert)
    }
  }

  zuruecksetzen(): void {
    this.getippt.clear()
    this.gewaehlt.clear()
    this.vonHand.clear()
    this._gerechnet = null
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
      return this.eintraege(umfeld, index).slice(0, VORSCHLAEGE_MAX)
    }
    return passendeVorschlaege(this.eintraege(umfeld, index), getippt)
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
