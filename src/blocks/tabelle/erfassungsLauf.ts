import {
  nachschlagEintraege,
  quellenZeilen,
  type Eintrag,
} from '../shared/nachschlagen'
import { getField } from '../../softengine/data'
import {
  bewegteMarke,
  gueltigeMarke,
  passendeVorschlaege,
  tastenFolge,
  VORSCHLAEGE_MAX,
  type TastenFolge,
} from '../shared/vorschlagListe'
import {
  loeseRechnung,
  platzText,
  zahlStreng,
  PLATZ_KEYS,
  type PlatzKey,
  type PlatzWert,
} from '../../core/data/rechnung'
import { alsZahl } from './sortierung'
import { spalteMitKennung } from './spalten'
import {
  anzeigeSpalteIn,
  passendeSaetze,
  verknuepfteQuellenIn,
  zellenzielVon,
  zielIn,
  type ErfassungsUmfeld,
} from './erfassungsZellen'

export type ErfassungsTaste = TastenFolge | 'weiter' | 'leeren' | 'liste-auf'

export class ErfassungsLauf {
  private getippt = new Map<number, string>()

  private gewaehlt = new Map<string, unknown>()

  private vonHand = new Set<string>()

  private _tippSpalte = -1

  private _marke = 0

  private _listeZu = false

  private _listeAuf = -1

  private _markeVonHand = false

  private _gerechnet: { index: number; wert: string } | null = null

  private _vorschlaege: Eintrag[] = []

  get tippSpalte(): number {
    return this._tippSpalte
  }

  get marke(): number {
    return this._marke
  }

  get vorschlaege(): readonly Eintrag[] {
    return this._vorschlaege
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
    this._marke = 0
    this._markeVonHand = false
    this._listeZu = false
  }

  verlasse(index: number): void {
    if (this._tippSpalte !== index) return
    this._tippSpalte = -1
    this._listeZu = false
    this._listeAuf = -1
    this._marke = 0
    this._markeVonHand = false
  }

  entscheideTaste(umfeld: ErfassungsUmfeld, index: number, taste: string): ErfassungsTaste {
    const listeOffen = this._tippSpalte === index && this._vorschlaege.length > 0
    // Tab ist die Weiter-Taste — IMMER (Nutzer 2026-09-01); das grosse Fenster
    // oeffnen nur Enter und F4, nie Tab.
    if (taste === 'Tab') {
      if (listeOffen && (this._markeVonHand || this._vorschlaege.length === 1)) taste = 'Enter'
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
    const folge = tastenFolge(taste, {
      listeOffen,
      feldLeer: wert === '',
      treffer: this._vorschlaege.length,
      markeVonHand: this._markeVonHand,
    })
    if (folge === 'marke-hoch' || folge === 'marke-runter') {
      const schritt = folge === 'marke-hoch' ? -1 : 1
      this._marke = bewegteMarke(this._marke, this._vorschlaege.length, schritt)
      this._markeVonHand = true
    }
    else if (folge === 'liste-zu') { this._listeZu = true; this._listeAuf = -1 }
    // Enter im LEEREN Feld springt weiter (Nutzer 2026-09-01).
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
    this._listeZu = false
    this._listeAuf = index
    this._marke = 0
    this._markeVonHand = true
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
    this._listeZu = false
    this._marke = 0
    this._markeVonHand = false
  }

  setzeMarke(marke: number): void {
    this._marke = marke
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
    this._marke = 0
    this._markeVonHand = false
    this._listeZu = false
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

  // Der Schlüsselwert der WERDENDEN Zeile — hier hängt das Messlatten-
  // Szenario (G3c): Gibt es den Satz der Tabellen-Quelle, trägt ER die Felder
  // (so liest ihn auch die Datenzeile). Beim Erfassen einer NEUEN Zeile gibt
  // es ihn nicht — dann liefern die von Hand gewählten verknüpften Sätze den
  // Wert über ihre Paare: der gewählte Artikel liefert die Artikelnummer der
  // Position, bevor es die Position gibt. Selbstgefülltes liefert nichts
  // (s. vonHand), und `ausser` nimmt die fragende Quelle aus der Suche —
  // ein Satz rechtfertigt sich nicht mit den eigenen Schlüsseln.
  //
  // `partnerId` sagt, WESSEN Feld gefragt ist. Leer (oder die Tabellen-Quelle)
  // heisst Hauptquelle — das ist der Fall oben. Zeigt die Verknüpfung dagegen
  // auf eine andere weitere Quelle (2 haengt an 3), zaehlt allein deren
  // gewaehlter Satz: ist er noch nicht gewaehlt, ist der Schluessel UNBEKANNT,
  // und unbekannt schraenkt nicht ein.
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
      // Nur Quellen, die AN DER HAUPTQUELLE haengen, koennen deren Felder
      // vertreten. Eine, die an einer anderen weiteren Quelle haengt, sagt
      // ueber die Hauptquelle nichts aus.
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

  // Die möglichen Sätze einer verknüpften Quelle, eingeschränkt über die
  // bekannten Schlüsselwerte der werdenden Zeile.
  private moegliche(umfeld: ErfassungsUmfeld, quelleId: string, rows: readonly unknown[]): unknown[] {
    const partnerId = umfeld.partnerVon(quelleId)
    return passendeSaetze(
      umfeld.paareZu(quelleId),
      (feld) => this.schluesselWert(umfeld, partnerId, feld, quelleId),
      rows,
    )
  }

  // Nach jeder Übernahme gleicht sich die Zeile ab, bis Ruhe ist: Gewähltes,
  // dessen Schlüssel nicht mehr passen, fällt (ein neuer Artikel löst die
  // alte Gabe) — und wo die bekannten Schlüssel genau EINEN Satz übrig
  // lassen, wählt er sich selbst (Ein-Treffer-Automatik). Die Automatik
  // greift nur, wenn mindestens ein Schlüsselwert bekannt ist: sonst wählte
  // sich in einem Ein-Satz-Stamm der Satz ungefragt von selbst.
  private gleicheAb(umfeld: ErfassungsUmfeld): void {
    const quellen = verknuepfteQuellenIn(umfeld)
    for (let runde = 0; runde <= quellen.length; runde++) {
      let bewegt = false
      for (const quelleId of quellen) {
        const paare = umfeld.paareZu(quelleId)
        // Ohne Paar gibt es nichts abzugleichen: eine reine Nachschlagequelle
        // bleibt stehen, wie der Bediener sie gewaehlt hat.
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

  // Eine schon erfasste Zeile zur Korrektur zurueck in die Erfassungszeile
  // holen: ihre Werte gelten als GETIPPT. Die gewaehlten Saetze kommen NICHT
  // mit — sie leben nur waehrend des Erfassens, und aus einer Zeichenkette
  // laesst sich der Satz nicht eindeutig zurueckfinden (zwei Artikel duerfen
  // gleich heissen). Der Bediener sucht die Zelle, die er korrigieren will,
  // ohnehin neu aus; genau dafuer steht die Zeile wieder oben.
  uebernimmWerte(umfeld: ErfassungsUmfeld, werte: readonly string[]): void {
    this.zuruecksetzen()
    werte.forEach((wert, index) => {
      if (wert !== '') this.getippt.set(index, wert)
    })
    this.gibDemGerechnetenPlatzSeineLuecke(umfeld)
    this.rechne(umfeld)
  }

  // In der abgelegten Zeile stehen ALLE Zellen gefuellt — auch der Platz, den
  // die Rechnung selbst ausgerechnet hat. Als getippt uebernommen waere er ab
  // jetzt ein GEGEBENER Wert: die Rechnung haette keine Luecke mehr und
  // schwiege. Der Bediener aendert die Tiere von 10 auf 20, und die alte
  // Abgabemenge geht ins ERP (Nutzer-Befund 2026-09-01).
  //
  // Erkannt wird der Platz daran, dass sein Wert exakt dem entspricht, was
  // sich ohne ihn aus den uebrigen rechnet. Geprueft wird in PLATZ_KEYS-
  // Reihenfolge, also die Abgabemenge zuerst: bei durchweg stimmigen Werten
  // passen mehrere Plaetze, und sie ist die linke Seite der Gleichung.
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
    this._marke = 0
    this._markeVonHand = false
    this._listeZu = false
    this._listeAuf = -1
    this._vorschlaege = []
  }

  // Wie in G1 einmal je Darstellung berechnet: Tastatur und Anzeige müssen
  // DENSELBEN Stand sehen, zwei Berechnungen liefen auseinander.
  aktualisiereVorschlaege(umfeld: ErfassungsUmfeld): void {
    this.rechne(umfeld)
    this._vorschlaege = this.berechne(umfeld)
    this._marke = gueltigeMarke(this._marke, this._vorschlaege.length)
  }

  private berechne(umfeld: ErfassungsUmfeld): Eintrag[] {
    const index = this._tippSpalte
    if (this._listeZu || zielIn(umfeld, index).art === 'frei') return []
    const getippt = this.getippt.get(index) ?? ''
    if (getippt === '') {
      // Aufgemacht heisst: alles zeigen. Sonst bleibt die Liste dem Getippten
      // vorbehalten, und ohne Zeichen gibt es nichts zu sehen.
      if (this._listeAuf !== index) return []
      return this.eintraege(umfeld, index).slice(0, VORSCHLAEGE_MAX)
    }
    return passendeVorschlaege(this.eintraege(umfeld, index), getippt)
  }

  // Dieselben Einträge für die Liste UND das große Fenster: eine zweite
  // Quelle wäre eine zweite Wahrheit. Sie bekommt nur die Sätze, deren
  // Schlüssel zu den bekannten Werten der werdenden Zeile passen.
  //
  // Nachgeschlagen wird NUR in einer verknüpften Zelle — dort wählt der
  // Bediener aus einem Stamm. Eine Zelle der EIGENEN Quelle böte die Zeilen
  // an, die die Tabelle gerade selbst zeigt, und eine davon zu wählen war
  // zerstörerisch: uebernimm setzt den Satz für die ganze Quelle, füllte
  // die werdende Zeile also mit einer alten Position (Klon) und warf dabei
  // jede andere schon getroffene Wahl weg. In die eigene Quelle wird
  // getippt, nicht ausgesucht.
  eintraege(umfeld: ErfassungsUmfeld, index: number): Eintrag[] {
    const ziel = zielIn(umfeld, index)
    if (ziel.art !== 'verknuepft' || ziel.quelleId === '' || ziel.code === '') return []
    const rows = quellenZeilen(ziel.quelleId)
    if (rows === null) return []
    const saetze = this.moegliche(umfeld, ziel.quelleId, rows)
    return nachschlagEintraege(saetze, anzeigeSpalteIn(umfeld, index)?.code ?? '', ziel.code)
  }
}
