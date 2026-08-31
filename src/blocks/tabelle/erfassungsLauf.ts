import {
  nachschlagEintraege,
  quellenZeilen,
  type Eintrag,
} from '../formfeld/nachschlagen'
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
  umgerechnet,
  zahlStreng,
  PLATZ_KEYS,
  type PlatzKey,
  type PlatzWert,
} from '../../core/data/rechnung'
import { alsZahl } from './sortierung'
import {
  anzeigeSpalteIn,
  passendeSaetze,
  platzSpalteIn,
  verknuepfteQuellenIn,
  zellenzielVon,
  zielIn,
  type ErfassungsUmfeld,
} from './erfassungsZellen'

// Der Tastenentscheid der Erfassungszeile: die geteilten Folgen der
// Vorschlagsliste plus die zwei, die nur die Zeile kennt — weiterspringen
// (G3b) und die zweite Escape-Stufe.
export type ErfassungsTaste = TastenFolge | 'weiter' | 'leeren' | 'liste-auf'

// Der Stand EINER Erfassungszeile zur Laufzeit: was in den Zellen steht,
// welcher Satz je Quelle gewählt wurde, welche Zelle gerade tippt. Als eigene
// Klasse, weil er sich so ohne Browser prüfen lässt — und weil der
// Tabellen-Baustein sonst über seinen Zeilen-Deckel liefe.
//
// Die Zeile schreibt NICHT ins ERP und veröffentlicht ihre Wahl NICHT als
// globale Auswahl: die Geber-Kennung der Tabelle gehört ihrer Zeilenauswahl,
// und ein Baustein kann heute Geber für genau EINE Quelle sein. Geschrieben
// wird erst in G4 über einen Knopf.
export class ErfassungsLauf {
  // Getippt je Spalte. Eine Map und kein Array: sie bleibt richtig, wenn
  // Spalten dazukommen oder wegfallen.
  private getippt = new Map<number, string>()

  // Der gewählte Satz JE QUELLE. Eine Zeile kann mehrere tragen: den Artikel
  // aus der Tabellen-Quelle UND die Tierart aus der verknüpften.
  private gewaehlt = new Map<string, unknown>()

  // Welche Wahl der Bediener SELBST getroffen hat (Übernahme per Liste oder
  // Fenster). Nur Hand-Wahlen liefern Schlüsselwerte für andere Quellen —
  // sonst schränkte eine selbstgefüllte Tierart die Artikelwahl ein, aus der
  // sie gerade erst abgeleitet wurde (Kreis).
  private vonHand = new Set<string>()

  private _tippSpalte = -1

  private _marke = 0

  private _listeZu = false

  // Die Spalte, deren Liste per Pfeil-runter aufgemacht wurde. Ohne das gibt
  // es die Liste nur zum Getippten — an eine Zelle, die man erst ansieht,
  // kaeme der Bediener nie ohne zu tippen.
  private _listeAuf = -1

  // Der Bediener hat selbst in der Liste ausgesucht (Pfeiltasten oder Liste
  // aufgemacht). Dann schlaegt seine Wahl die Trefferzahl — sonst risse ihm
  // Enter die Liste unter der Marke weg und machte das Fenster auf.
  private _markeVonHand = false

  // Der EINE gerechnete Platz der Rechnung (RECHNUNG-BELEGERFASSUNG.md).
  // Getrennt vom Getippten: er rechnet sich neu, sobald ein gegebener Wert
  // sich aendert — Getipptes tut das nie.
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

  // Was in der Zelle steht: das Getippte, solange es da ist — sonst der Wert
  // aus dem gewählten Satz ihrer Quelle. Eine freie Zelle hat nur Getipptes.
  // Der gerechnete Platz zeigt sein Ergebnis; leert der Bediener ihn, ist er
  // wieder Lücke und zeigt das nächste Ergebnis (Getipptes schlägt Gerechnetes).
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

  // Der GEGEBENE Zahlwert eines Platzes — ohne das Gerechnete, sonst bliebe
  // die Lücke nach dem ersten Ergebnis für immer gefüllt. Getipptes wird
  // STRENG gelesen (raten wäre Faktor 1000), Quellen-Werte tolerant.
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

  // Rechnet den einen leeren Platz — oder nichts. Läuft vor jedem Zeichnen
  // (aktualisiereVorschlaege) und vor jedem Einfrieren der Zeile.
  rechne(umfeld: ErfassungsUmfeld): void {
    this._gerechnet = null
    const r = umfeld.rechnung
    if (!r) return
    const werte = {} as Record<PlatzKey, PlatzWert>
    const indizes = {} as Record<PlatzKey, number>
    const konfiguriert = new Set<PlatzKey>()
    for (const key of PLATZ_KEYS) {
      const index = platzSpalteIn(umfeld.spalten, r[key].feld)
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

  // Die Ziel-Einheit der Abgabemenge: der Wert der eingestellten
  // Einheiten-Spalte in der werdenden Zeile (z. B. 'ml' aus der Dosier-IDB).
  zielEinheit(umfeld: ErfassungsUmfeld): string {
    const r = umfeld.rechnung
    if (!r || r.einheitFeld.trim() === '') return ''
    const index = platzSpalteIn(umfeld.spalten, r.einheitFeld)
    if (index === -1) return ''
    return this.wertVon(umfeld, index).trim()
  }

  // Der Einheiten-Umrechner an der Abgabemenge: der aktuelle Zellwert wird
  // als Wert IN der gewählten Einheit gelesen und einmalig in die
  // Ziel-Einheit umgerechnet — sichtbar in der Zelle, nichts bleibt versteckt
  // ('5' + Liter -> '5000' bei Ziel ml). Unpassende Arten: nichts passiert.
  rechneUm(umfeld: ErfassungsUmfeld, vonKennung: string): void {
    const r = umfeld.rechnung
    if (!r) return
    const index = platzSpalteIn(umfeld.spalten, r.menge.feld)
    if (index === -1) return
    const roh = this.wertVon(umfeld, index).trim()
    if (roh === '') return
    const wert = zahlStreng(roh) ?? alsZahl(roh)
    if (wert === null) return
    const ziel = this.zielEinheit(umfeld)
    const neu = umgerechnet(wert, vonKennung, ziel, r.einheiten)
    if (neu === null) return
    this.getippt.set(index, platzText(neu, r.menge.runden.stellen))
    this.rechne(umfeld)
  }

  tippe(index: number, text: string): void {
    this.getippt.set(index, text)
    this._tippSpalte = index
    this._marke = 0
    this._markeVonHand = false
    this._listeZu = false
  }

  // Der Sprung in eine andere Zelle räumt die offene Liste ab; das Getippte
  // bleibt stehen, damit ein halb getippter Wert nicht beim Fokuswechsel
  // verschwindet.
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
    // Tab ist die Weiter-Taste: mit offener Liste übernimmt sie wie Enter,
    // sonst springt sie — auch dort, wo Enter absichtlich anhält (Tippfehler).
    if (taste === 'Tab') {
      if (!listeOffen) return 'weiter'
      taste = 'Enter'
    }
    // F4 (und Alt+Pfeil-runter, vom Aufrufer darauf abgebildet) macht das
    // grosse Fenster IMMER auf. Ohne das kam man nur an ein LEERES Feld
    // heran: stand schon etwas drin, half nur noch die Maus auf der Lupe.
    if (taste === 'F4') {
      if (zielIn(umfeld, index).art === 'frei') return 'nichts'
      return this.eintraege(umfeld, index).length === 0 ? 'nichts' : 'fenster'
    }
    const wert = this.wertVon(umfeld, index)
    // Escape-Stufe 2: keine Liste (mehr) offen → die Zelle leert sich.
    if (taste === 'Escape' && !listeOffen) return wert === '' ? 'nichts' : 'leeren'
    // Eine freie Zelle hat keine Liste und kein Fenster; Enter geht weiter.
    if (zielIn(umfeld, index).art === 'frei') return taste === 'Enter' ? 'weiter' : 'nichts'
    // Pfeil-runter in eine geschlossene Liste macht sie auf — die Gewohnheit
    // jedes Auswahlfeldes. Vorher passierte hier nichts. Nur dort, wo es
    // auch etwas aufzumachen gibt: die eigene Quelle bietet nichts an.
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
    // Kein einziger möglicher Satz (kein Partner): Enter bleibt nicht hängen.
    else if (folge === 'fenster' && this.eintraege(umfeld, index).length === 0) return 'weiter'
    // Auf einem gewählten Wert geht Enter weiter. Getipptes hält dagegen an
    // (G1: sonst rauscht der Fluss über den Tippfehler) — aber NUR dort, wo es
    // überhaupt etwas zu treffen gibt, also in einer verknüpften Zelle. Eine
    // Zelle der eigenen Quelle hat keine Liste und keinen Treffer: dort IST
    // das Getippte der Wert. Vorher tat Enter nach dem Tippen genau dort gar
    // nichts — in einer Belegerfassung ist das die Mengen-Spalte, und der
    // Fluss brach an ihr jedes Mal ab.
    else if (folge === 'nichts' && taste === 'Enter' && wert !== '') {
      const getippt = this.getippt.get(index) !== undefined
      if (!getippt || zielIn(umfeld, index).art !== 'verknuepft') return 'weiter'
    }
    return folge
  }

  // Pfeil-runter: die Zelle wird zur tippenden, und ihre Liste zeigt alles,
  // was sie hergibt — auch ohne ein einziges getipptes Zeichen.
  oeffneListe(index: number): void {
    this._tippSpalte = index
    this._listeZu = false
    this._listeAuf = index
    this._marke = 0
    this._markeVonHand = true
  }

  // Die nächste Zelle, in der noch nichts steht. Selbstgefülltes wird damit
  // automatisch übersprungen (es ist nicht leer). -1 = rechts ist nichts
  // Leeres mehr; was dann passiert, entscheidet der Aufrufer (ab G4: Zeile
  // erfasst).
  naechsteLeere(umfeld: ErfassungsUmfeld, ab: number): number {
    for (let i = ab + 1; i < umfeld.spalten.length; i++) {
      if (this.wertVon(umfeld, i) === '') return i
    }
    return -1
  }

  // Escape-Stufe 2: die Zelle wird wirklich leer. Bei einer gebundenen Zelle
  // muss dafür der gewählte Satz ihrer Quelle gehen — sonst stünde der Wert
  // beim nächsten Rendern wieder da. Mit ihm leeren sich die Schwesterzellen
  // derselben Quelle; das ist gewollt: ein Satz gilt immer ganz.
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

  // Die Maus faehrt ueber einen Eintrag. Das ist noch keine Wahl — wer nur
  // hinsieht, soll mit Enter trotzdem das Fenster bekommen.
  setzeMarke(marke: number): void {
    this._marke = marke
  }

  // Die Übernahme: der Satz gilt für alle Zellen DIESER Quelle, sie zeigen ihn
  // sofort. Ein Satz der Tabellen-Quelle ist der Anker — die verknüpften
  // Sätze hingen an ihm und werden gelöst. Danach gleicht sich die Zeile ab
  // (G3c): jede Wahl kann Abhängiges neu bestimmen, auch die Wahl in einer
  // verknüpften Spalte.
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

  // Ein Satz gilt immer für die ganze Quelle. Das Getippte ihrer Zellen fällt
  // dabei weg: sonst stünde dort das Suchwort und nicht der übernommene Wert.
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
  uebernimmWerte(werte: readonly string[]): void {
    this.zuruecksetzen()
    werte.forEach((wert, index) => {
      if (wert !== '') this.getippt.set(index, wert)
    })
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
