import { html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { SE_FOKUS_EVENT } from '../../softengine/bridge'
import { BasicBlock } from '../base/BasicBlock'
import type { BlockCategory } from '../../core/blocks/BlockComponent'
import type {
  ErfassungsFaehigkeit,
  ListenBindung,
  SatzWahl,
} from '../../core/blocks/BlockDefinition'
import { geberIdVon, waehleAuswahl } from '../shared/auswahl'
import { LEER_TEXT_STANDARD, leerStil } from '../shared/leerZustand'
import { vorschlagStil } from '../shared/vorschlagListe'
import { chipStyles } from '../shared/statusVariant'
import { schliesseNachschlagenFuer } from '../formfeld/nachschlagen'
import { beobachteRumpf, gemessenesMass, OHNE_RUMPF, rumpfHoehe } from './rumpfMessung'
import {
  erfassungsZeileFuer,
  type ErfassungsWirt,
} from './erfassungsBedienung'
import { ErfassungsAnschluss } from './erfassungsAnschluss'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import { erfassungStil } from './erfassungStil'
import {
  leiteZeilenAb,
  type BereitgestellteZeile,
  type Datenbesitz,
} from './datenBesitz'
import type { Zeilenmass } from './seitengroesse'
import { connectTable, disconnectTable, hatSatzNummer, zeilenIndexVon } from './seRuntime'
import { meldeKettenFehler, runEvent } from '../shared/seAktionen'
import { zeigtEchteDaten } from './suche'
import {
  benenneSpalteUm,
  feldPickerAbbestellen,
  oeffneFeldPicker,
  spaltenSteuerung,
} from './spaltenBearbeiten'
import { spaltenArt, zeilenHoeheFuer, zellText } from './spaltenArten'
import { AenderungsSpeicher } from './aenderungen'
import { SPALTEN_BINDUNG } from './spaltenBindung'
import { tabelleAnsicht } from './tabelleAnsicht'
import { TABELLE_EIGENSCHAFTEN } from './tabelleEigenschaften'
import { tabelleFuss } from './tabelleFuss'
import { tabelleKoerper } from './tabelleKoerper'
import { tabelleStil } from './tabelleStil'
import {
  fokussierterRohIndex,
  sendeZeileAktiviert,
  stelleZeilenFokusHer,
} from './zeilenAktivierung'
import {
  coerceSpalten,
  standardSpalten,
  tryCoerceSpalten,
  type Spalte,
} from './spalten'

export { coerceSpalten, type Spalte } from './spalten'

export class TabelleBlock extends BasicBlock {
  static readonly blockType = 'tabelle'
  static readonly tagName = 'ff-tabelle'
  static readonly displayName = 'Tabelle'
  static readonly category: BlockCategory = 'anzeige'

  static readonly acceptsDataSource = true

  static readonly satzWahl: SatzWahl = {}
  static readonly kannAuswahlFolgen = true

  // Erfassungszeile an -> die Kette eines Knopfs darf „Wert aus
  // Erfassungszelle" lesen; der Export schreibt dafuer data-ff-block-id.
  static readonly kannErfassen: ErfassungsFaehigkeit = {
    wenn: { attributeName: 'erfassung', equals: 'ja' },
  }

  // Der Eintrags-Schalter, mit dem eine Spalte aenderbar wird — dieselbe
  // Vokabel, die der Inspector zeigt (spaltenBindung.eintragsSchalter).
  static readonly aenderungsSchluessel = 'aenderbar'

  // Zeilen zum Loeschen vormerken — wie kannErfassen an einem Schalter des
  // Bausteins, damit die Kommandozentrale weiss, wen sie anbieten darf.
  static readonly kannLoeschen: ErfassungsFaehigkeit = {
    wenn: { attributeName: 'loeschbar', equals: 'ja' },
  }

  static readonly blockEvents = [
    { key: 'onRowClick', name: 'Zeile gewählt' },

    // Der zweite Klick auf dieselbe Zeile — in ERP-Masken der Weg „zeig mir
    // die Einzelheiten dazu" (Handmaske Rahmen00001 V11: BW-Befehl
    // TABELLEPOS_DETAILS mit der Satznummer).
    { key: 'onRowDblClick', name: 'Zeile doppelt geklickt' },
  ]

  static readonly listenBindung: ListenBindung = SPALTEN_BINDUNG
  static readonly defaultProps = {
    width: 'fill',
    source: '',
    spalten: standardSpalten(),
    suche: 'ja',

    erfassung: 'nein',

    blaettern: 'ja',

    loeschbar: 'nein',

    schlank: 'nein',

    kopfzeile: 'ja',

    tagField: '',

    leerText: LEER_TEXT_STANDARD,
  }
  static override readonly customProperties = TABELLE_EIGENSCHAFTEN

  static readonly raster = { startW: 14, startH: 8, minW: 6, minH: 4 }

  @property({
    converter: {
      fromAttribute: (v: string | null): Spalte[] =>
        v ? tryCoerceSpalten(v) : standardSpalten(),
      toAttribute: (v: Spalte[]): string => JSON.stringify(v),
    },
  })
  spalten: Spalte[] = standardSpalten()

  @property() source = ''

  @property() suche = 'ja'

  @property() erfassung = 'nein'

  @property() blaettern = 'ja'

  @property() loeschbar = 'nein'

  @property() schlank = 'nein'

  @property() kopfzeile = 'ja'

  @property() leerText = LEER_TEXT_STANDARD

  private _suchtext = ''

  @property({ attribute: false }) datenzeilen: string[][] = []

  @property({ attribute: false }) zusatzzeilen: Record<string, string>[][] = []

  @property({ attribute: false }) rohzeilen: unknown[] = []

  @property({ attribute: false }) auswahlIndex = -1

  @property({ attribute: false }) durchAuswahlGefiltert = false

  @property({ attribute: false }) datenGeliefert = false

  private _sortSpalte = -1
  private _sortAuf = true

  private _seite = 0

  private _mass: Zeilenmass | null = null
  private _beobachter: ResizeObserver | null = null

  private _taktGemessen = 0

  private _rumpfGemessen = OHNE_RUMPF

  private _fokusZeile: number | null = null
  private _fokusHolen = false

  private _besitz: Datenbesitz = 'softengine'

  // Tipp-Zustand + erfasste Zeilen; sie ueberleben jeden Daten-Push und
  // fallen nur mit dem Zweckwechsel oder dem Ketten-Lauf des Knopfs.
  private _erfassung = new ErfassungsAnschluss()

  // Vorgemerkte Aenderungen an GEBUCHTEN Zeilen. Ueberleben jeden Push
  // (sie haengen an der Satznummer, nicht am Platz in der Liste).
  private readonly _aenderungen = new AenderungsSpeicher()

  // Satznummern der Zeilen, die weg sollen. Auch sie ueberleben einen Push.
  private readonly _geloescht = new Set<string>()

  get besitz(): Datenbesitz {
    return this._besitz
  }

  set besitz(neu: Datenbesitz) {
    if (neu === this._besitz) return
    this._besitz = neu
    this.setzeAbgeleitetesZurueck()
    if (this.isConnected) {
      if (neu === 'provided') disconnectTable(this)
      else connectTable(this)
    }
    this.requestUpdate()
  }

  set bereitgestellteZeilen(zeilen: readonly BereitgestellteZeile[]) {
    const abgeleitet = leiteZeilenAb(zeilen)
    this.rohzeilen = abgeleitet.rohzeilen
    this.datenzeilen = abgeleitet.datenzeilen
    this.zusatzzeilen = abgeleitet.zusatzzeilen
    this.datenGeliefert = true
    this.auswahlIndex = -1
    this.durchAuswahlGefiltert = false
    this._seite = 0
    this._mass = null
    this._taktGemessen = 0
    this._rumpfGemessen = OHNE_RUMPF
    this.requestUpdate()
  }

  private setzeAbgeleitetesZurueck(): void {
    this.rohzeilen = []
    this.datenzeilen = []
    this.zusatzzeilen = []
    this.datenGeliefert = false
    this.auswahlIndex = -1
    this.durchAuswahlGefiltert = false
    this._suchtext = ''
    this._sortSpalte = -1
    this._sortAuf = true
    this._seite = 0
    this._mass = null
    this._taktGemessen = 0
    this._rumpfGemessen = OHNE_RUMPF
    this._fokusZeile = null
    this._fokusHolen = false
    this._erfassung.zuruecksetzen()
  }

  // Der Laufzeit-Vertrag der Faehigkeit kannErfassen (ErfassungsTraegerElement
  // in core/blocks/BlockDefinition.ts): die Kette am Knopf liest die Zeilen
  // ueber data-ff-block-id und leert sie nach dem Lauf.
  get erfassteZeilen(): readonly (readonly string[])[] {
    return this._erfassung.zeilen
  }

  erfassungLeeren(): void {
    if (this._erfassung.leeren()) this.requestUpdate()
  }

  // Der Vertrag der Faehigkeit aenderungsSchluessel (AenderungsTraegerElement
  // in core/blocks/BlockDefinition.ts): je vorgemerkter Zeile ihre Satznummer
  // und ALLE Spaltenwerte — die geaenderten inbegriffen. So kann die Kette
  // auch unveraenderte Felder derselben Zeile mitschreiben.
  // Satznummer -> Platz in der Liste. Einmal gebaut statt je Vormerkung
  // gesucht: bei tausenden Zeilen waere das Suchen je Aenderung spuerbar.
  private satzPlaetze(): Map<string, number> {
    const plaetze = new Map<string, number>()
    this.rohzeilen.forEach((zeile, index) => {
      const satz = zeilenIndexVon(this, zeile)
      if (satz !== '' && !plaetze.has(satz)) plaetze.set(satz, index)
    })
    return plaetze
  }

  // Vorgemerkt heisst: noch schreibbar. Eine Zeile, die ein Push aus der
  // Liste genommen hat, zaehlt nicht mehr mit — sonst stuende unter der
  // Tabelle eine Zahl, die der Knopf nicht einloest.
  private vorgemerkteAnzahl(): number {
    if (this._aenderungen.anzahl === 0) return 0
    const plaetze = this.satzPlaetze()
    let anzahl = 0
    for (const eintrag of this._aenderungen.proSatz()) {
      if (plaetze.has(eintrag.satz)) anzahl += eintrag.aenderungen.length
    }
    return anzahl
  }

  get geaenderteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    const spaltenAnzahl = this.spaltenListe().length
    const plaetze = this.satzPlaetze()
    const raus: { satz: string; werte: readonly string[] }[] = []
    for (const { satz } of this._aenderungen.proSatz()) {
      const rohIndex = plaetze.get(satz)
      // Die Zeile ist seit der Aenderung aus der Liste verschwunden (ein Push
      // hat sie weggenommen). Sie wird NICHT geschrieben: mit leeren Werten
      // zu schreiben hiesse, den Satz in der ERP leerzuraeumen.
      if (rohIndex === undefined) continue
      raus.push({
        satz,
        werte: Array.from({ length: spaltenAnzahl }, (_, spalte) => this.zellWert(rohIndex, spalte)),
      })
    }
    return raus
  }

  aenderungenLeeren(): void {
    if (this._aenderungen.leeren()) this.requestUpdate()
  }

  // Der Vertrag der Faehigkeit kannLoeschen (LoeschTraegerElement): je
  // vorgemerkter Zeile ihre Satznummer und alle Spaltenwerte. Zeilen, die
  // ein Push inzwischen weggenommen hat, fallen raus — sie sind schon weg.
  get geloeschteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    const spaltenAnzahl = this.spaltenListe().length
    const plaetze = this.satzPlaetze()
    const raus: { satz: string; werte: readonly string[] }[] = []
    for (const satz of this._geloescht) {
      const rohIndex = plaetze.get(satz)
      if (rohIndex === undefined) continue
      raus.push({
        satz,
        werte: Array.from({ length: spaltenAnzahl }, (_, spalte) => this.zellWert(rohIndex, spalte)),
      })
    }
    return raus
  }

  loeschungenLeeren(): void {
    if (this._geloescht.size === 0) return
    this._geloescht.clear()
    this.requestUpdate()
  }

  private vorgemerkteLoeschungen(): number {
    return this.geloeschteZeilen.length
  }

  // Enter am Zeilenende (G4): die Zeile bleibt stehen, die Erfassung rueckt
  // tiefer, der Cursor auf die erste Zelle. Geschrieben wird hier NICHTS.
  private erfasseZeile(): void {
    if (!this._erfassung.erfasse(this.erfassungsUmfeld())) return
    this.requestUpdate()
    this.fokussiereErfassungsZelle(0)
  }

  fokussiereSuche(): boolean {
    const feld = this.shadowRoot?.querySelector<HTMLInputElement>('.suchzeile input')
    if (!feld) return false
    feld.focus()
    return true
  }

  private get hatQuelle(): boolean {
    return this._besitz === 'provided'
      ? true
      : zeigtEchteDaten(this.hasAttribute('data-ff-editor'), this.source)
  }

  private merkeZeilenFokus(): void {
    const roh = fokussierterRohIndex(this.shadowRoot)
    this._fokusHolen = roh !== undefined
    this._fokusZeile = roh ?? null
  }

  private messeRumpf(): void {
    const takt = this.zeilenHoehe
    this._taktGemessen = takt
    const { mass, hoehe } = gemessenesMass(this, takt)
    this._rumpfGemessen = hoehe
    if (mass?.passen === this._mass?.passen && mass?.zeilenHoehe === this._mass?.zeilenHoehe) return
    this._mass = mass
    this.requestUpdate()
  }

  private spaltenListe(): Spalte[] {
    return coerceSpalten(this.spalten)
  }

  private get zeilenHoehe(): number {
    return zeilenHoeheFuer(this.spaltenListe())
  }

  // ---- Aendern in der Zeile ----------------------------------------
  // Der Schluessel einer Vormerkung ist die Satznummer der Zeile. Ohne sie
  // wird gar nicht erst ein Eingabefeld gezeigt (aendernMoeglich).
  private satzVon(rohIndex: number): string {
    const rohzeile = this.rohzeilen[rohIndex]
    return rohzeile === undefined ? '' : zeilenIndexVon(this, rohzeile)
  }

  private zellAnzeige(spaltenIndex: number, roh: string): string {
    const spalte = this.spaltenListe()[spaltenIndex]
    return spalte === undefined ? roh : zellText(spaltenArt(spalte.art), roh)
  }

  // Eine Zeile, die weg soll, braucht keine Zell-Aenderung mehr: was an ihr
  // vorgemerkt war, faellt mit. Sonst schriebe derselbe Klick erst einen
  // neuen Wert und loeschte die Zeile gleich danach.
  private schalteLoeschung(rohIndex: number): void {
    const satz = this.satzVon(rohIndex)
    if (satz === '') return
    if (this._geloescht.has(satz)) this._geloescht.delete(satz)
    else {
      this._geloescht.add(satz)
      this.spaltenListe().forEach((_, spalte) => {
        this._aenderungen.nimmZurueck(satz, spalte)
      })
    }
    this.requestUpdate()
  }

  private istGeloescht(rohIndex: number): boolean {
    const satz = this.satzVon(rohIndex)
    return satz !== '' && this._geloescht.has(satz)
  }

  private zellWert(rohIndex: number, spaltenIndex: number): string {
    const vorgemerkt = this._aenderungen.wert(this.satzVon(rohIndex), spaltenIndex)
    if (vorgemerkt !== undefined) return vorgemerkt
    return this.zellAnzeige(spaltenIndex, this.datenzeilen[rohIndex]?.[spaltenIndex] ?? '')
  }

  private istGeaendert(rohIndex: number, spaltenIndex: number): boolean {
    return this._aenderungen.wert(this.satzVon(rohIndex), spaltenIndex) !== undefined
  }

  // Waehrend des Tippens bleibt stehen, was getippt ist — nicht formatiert,
  // sonst spraenge die Schreibmarke. Geformt wird beim Verlassen.
  private tippeZelle(rohIndex: number, spaltenIndex: number, text: string): void {
    if (this._aenderungen.setze(this.satzVon(rohIndex), spaltenIndex, text)) {
      this.requestUpdate()
    }
  }

  // Beim Verlassen wird der getippte Wert in die Form der Spalte gebracht.
  // Steht danach wieder der urspruengliche Wert da, ist es keine Aenderung
  // mehr — die Vormerkung faellt weg, samt Marke.
  private verlasseZelle(rohIndex: number, spaltenIndex: number, text: string): void {
    const satz = this.satzVon(rohIndex)
    const geformt = this.zellAnzeige(spaltenIndex, text)
    const urspruenglich = this.zellAnzeige(
      spaltenIndex,
      this.datenzeilen[rohIndex]?.[spaltenIndex] ?? '',
    )
    const geaendert = geformt === urspruenglich
      ? this._aenderungen.nimmZurueck(satz, spaltenIndex)
      : this._aenderungen.setze(satz, spaltenIndex, geformt)
    if (geaendert) this.requestUpdate()
  }

  // Senkrecht durch DIESELBE Spalte, wie in der Handmaske (dort der „Anker"
  // ueber die Mengen-Spalte). Der Fokuswechsel loest das Verlassen der alten
  // Zelle aus — geformt und verglichen wird dort. Waagerecht bleibt Tab:
  // eine Zeile kann mehrere aenderbare Spalten haben, und dann ist die
  // Nachbarzelle rechts das Naheliegende.
  private zelleNachbar(
    spaltenIndex: number,
    von: HTMLInputElement,
    schritt: number,
    enterModus: boolean,
  ): void {
    const felder = Array.from(this.shadowRoot?.querySelectorAll<HTMLInputElement>(
      `.koerper > .zeile:not(.erfassung) .zell-eingabe[data-spalte="${spaltenIndex}"]`,
    ) ?? [])
    const jetzt = felder.indexOf(von)
    if (jetzt < 0) return
    let ziel = jetzt + schritt
    if (ziel > felder.length - 1) {
      // Enter unter der letzten Zeile: weiter in die Erfassungszeile — dort
      // tippt der Bediener die naechste Position (Handmaske: enterModus).
      if (enterModus && this.erfassungAn) {
        this.fokussiereErfassungsZelle(0)
        return
      }
      ziel = felder.length - 1
    }
    if (ziel < 0) ziel = 0
    const feld = felder[ziel]
    if (!feld || feld === von) return
    feld.focus()
    // Der Inhalt steht markiert da: wer weitertippt, ueberschreibt — genau
    // der Editier-Start der Handmaske (dort selectNodeContents).
    feld.select()
    feld.scrollIntoView({ block: 'nearest' })
  }

  // Escape nimmt die Vormerkung zurueck (der Wert der Zeile gilt wieder).
  // Keine dieser Tasten darf bis zur Zeile durchfallen: dort loeste Enter die
  // Kette „Zeile gewaehlt" aus, und Pfeile blaetterten den Rumpf.
  private tasteZelle(rohIndex: number, spaltenIndex: number, e: KeyboardEvent): void {
    const feld = e.target as HTMLInputElement
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (this._aenderungen.nimmZurueck(this.satzVon(rohIndex), spaltenIndex)) {
        this.requestUpdate()
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

  private zeileDoppelt(rohIndex: number | null): void {
    if (rohIndex === null || this.hasAttribute('data-ff-editor')) return
    const rohzeile = this.rohzeilen[rohIndex]
    if (rohzeile === undefined) return
    runEvent(this, 'onRowDblClick', { PINDEX: zeilenIndexVon(this, rohzeile) })
      .catch(meldeKettenFehler)
  }

  private aktiviereZeile(rohIndex: number | null, ansichtIndex: number): void {
    if (rohIndex === null || this.hasAttribute('data-ff-editor')) return
    const rohzeile = this.rohzeilen[rohIndex]
    if (rohzeile === undefined) return
    sendeZeileAktiviert(this, { rohzeile, rohIndex, ansichtIndex })
    this.toggleAuswahl(rohzeile)
    runEvent(this, 'onRowClick', { PINDEX: zeilenIndexVon(this, rohzeile) })
      .catch(meldeKettenFehler)
  }

  private toggleAuswahl(rohzeile: unknown): void {
    const geberId = geberIdVon(this)
    if (geberId === '') return
    waehleAuswahl(geberId, rohzeile)
  }

  private setzeSuchtext(text: string): void {
    this.merkeZeilenFokus()
    this._suchtext = text
    this._seite = 0
    this.requestUpdate()
  }

  private klickSortiere(index: number): void {
    if (this.editable) return
    this.merkeZeilenFokus()
    if (this._sortSpalte === index) {
      this._sortAuf = !this._sortAuf
    } else {
      this._sortSpalte = index
      this._sortAuf = true
    }
    this._seite = 0
    this.requestUpdate()
  }

  private get erfassungAn(): boolean {
    return this.erfassung === 'ja'
  }

  // Die Fusszeile nur, wenn sie etwas zu sagen hat: geblaettert werden muss
  // oder ein Filter greift (G5). Sonst gehoert der Platz den Zeilen.
  private fussNoetig(
    seiten: number,
    summen: number,
    vorgemerkt: number,
    loeschungen: number,
  ): boolean {
    return seiten > 1
      || summen > 0
      || vorgemerkt > 0
      || loeschungen > 0
      || this._suchtext.trim() !== ''
      || this.durchAuswahlGefiltert
  }

  // Der Baustein haelt nur den Stand; was die Zellen tun, steht in
  // erfassungsBedienung — sonst laeuft diese Datei ueber ihren Deckel.
  private erfassungsWirt(): ErfassungsWirt {
    return {
      baustein: this,
      lauf: this._erfassung.lauf,
      umfeld: () => this.erfassungsUmfeld(),
      melde: () => this.requestUpdate(),
      fokussiere: (index) => this.fokussiereErfassungsZelle(index),
      erfasseZeile: () => this.erfasseZeile(),
    }
  }

  // Erst NACH dem Rendern fokussieren: die Zellen zeigen dann den neuen
  // Stand, und das Ziel existiert sicher.
  private fokussiereErfassungsZelle(index: number): void {
    void this.updateComplete.then(() => {
      const felder = this.shadowRoot?.querySelectorAll<HTMLInputElement>('.zeile.erfassung .erf-eingabe')
      felder?.[index]?.focus()
    })
  }

  private erfassungsUmfeld(): ErfassungsUmfeld {
    return this._erfassung.umfeld(this, this.spaltenListe(), this.source)
  }

  private aendere(spalten: Spalte[]): void {
    this.dispatchEvent(
      new CustomEvent('ff-prop-change', {
        detail: { attr: 'spalten', value: spalten },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private beobachte(): void {
    if (this._beobachter) return
    this._beobachter = beobachteRumpf(this, () => this.messeRumpf())
    if (this._beobachter) this.messeRumpf()
  }

  // Gibt die ERP der Maske den Fokus, springt er in die Erfassungszeile —
  // dort tippt der Bediener weiter (Handmaske Rahmen00001 V11:
  // basisHTML_DoSetFocusToHTML setzt den Fokus in die erste Erfassungszelle).
  // Ohne Erfassungszeile meldet sich die Tabelle nicht; dann sucht die
  // Bruecke weiter.
  private readonly nimmSeFokus = (ereignis: Event): void => {
    if (ereignis.defaultPrevented || !this.erfassungAn) return
    if (this.hasAttribute('data-ff-editor')) return
    ereignis.preventDefault()
    this.fokussiereErfassungsZelle(0)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (this._besitz === 'softengine') connectTable(this)
    document.addEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    this.beobachte()
  }

  protected override firstUpdated(): void {
    this.beobachte()
  }

  // Wie beim Nachschlage-Feld (G1): einmal je Darstellung berechnet, damit
  // Tastatur und Anzeige DENSELBEN Stand sehen. Im Editor gibt es keine Daten
  // und keine Liste (Regel 7).
  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed)
    if (!this.erfassungAn || this.hasAttribute('data-ff-editor')) return
    this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())
  }

  protected override updated(): void {
    // Neu messen, sobald der Rumpf nicht mehr so hoch ist wie beim Rechnen: die
    // Fusszeile haengt an der Seitenzahl, erscheint also erst NACH der Messung
    // und nimmt dem Rumpf ihren Platz weg. Sonst haengt die Korrektur allein am
    // ResizeObserver, einen Frame zu spaet — bis dahin ist die letzte Zeile
    // angeschnitten. Kippen kann das nicht: die Fusszeile macht nur kleiner.
    if (this._taktGemessen !== this.zeilenHoehe || this._rumpfGemessen !== rumpfHoehe(this)) {
      this.messeRumpf()
    }
    if (!this._fokusHolen) return
    this._fokusHolen = false
    stelleZeilenFokusHer(this.shadowRoot, this._fokusZeile)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    feldPickerAbbestellen(this)
    this._beobachter?.disconnect()
    this._beobachter = null
    schliesseNachschlagenFuer(this)
    disconnectTable(this)
  }

  static override styles = [
    BasicBlock.styles,
    chipStyles,
    leerStil,
    tabelleStil,
    vorschlagStil,
    erfassungStil,
  ]

  override render(): TemplateResult {
    const spalten = this.spaltenListe()
    const stop = (e: Event): void => e.stopPropagation()

    const ansicht = tabelleAnsicht({
      spalten,
      hatQuelle: this.hatQuelle,
      datenGeliefert: this.datenGeliefert,
      datenzeilen: this.datenzeilen,
      suchtext: this._suchtext,
      sortSpalte: this._sortSpalte,
      sortAuf: this._sortAuf,
      wunschSeite: this._seite,
      gemessen: this._mass,
      erfassungAn: this.erfassungAn,
      erfassteAnzahl: this._erfassung.zeilen.length,
      wertVon: (zeile, spalte) => this.zellWert(zeile, spalte),
      blaettert: this.blaettern === 'ja',
    })
    const vorgemerkt = this.vorgemerkteAnzahl()
    const loeschungen = this.vorgemerkteLoeschungen()
    const tafelKlassen = ['tabelle']
    if (this.schlank === 'ja') tafelKlassen.push('schlank')
    if (this.blaettern !== 'ja') tafelKlassen.push('rollt')
    return html`<div class=${tafelKlassen.join(' ')} style=${styleMap({
      '--takt': `${ansicht.takt}px`,
      '--zeilen-hoehe': `${ansicht.zeilenHoehe}px`,
    })}>
      ${spaltenSteuerung(() => this.spaltenListe(), (l) => this.aendere(l), stop)}
      ${tabelleKoerper({
        spalten,
        cols: ansicht.cols,
        editable: this.editable,
        imEditor: this.hasAttribute('data-ff-editor'),
        zeigeKopf: this.kopfzeile === 'ja',
        auswahlSemantik: geberIdVon(this) !== '',
        zeigeSuche: this.suche === 'ja',
        suchtext: this._suchtext,
        sortSpalte: this._sortSpalte,
        sortAuf: this._sortAuf,
        zeilen: ansicht.zeilen,
        linealTakte: ansicht.linealTakte,
        datenzeilen: this.datenzeilen,
        zusatzzeilen: this.zusatzzeilen,
        hatQuelle: ansicht.hatQuelle,
        auswahlIndex: this.auswahlIndex,
        aendernMoeglich: !this.hasAttribute('data-ff-editor')
          && ansicht.hatQuelle
          && hatSatzNummer(this),
        loeschbar: this.loeschbar === 'ja'
          && !this.hasAttribute('data-ff-editor')
          && ansicht.hatQuelle
          && hatSatzNummer(this),
        istGeloescht: (zeile) => this.istGeloescht(zeile),
        zellWert: (zeile, spalte) => this.zellWert(zeile, spalte),
        istGeaendert: (zeile, spalte) => this.istGeaendert(zeile, spalte),
        leer: ansicht.leer,
        leerText: this.leerText,
        erfasste: this._erfassung.zeilen,
        erfassung: this.erfassungAn
          ? erfassungsZeileFuer(
              this.erfassungsWirt(),
              ansicht.cols,
              // Kein Lineal mehr uebrig heisst: die Zeile ist die letzte im
              // Rumpf, unter ihr ist kein Platz fuer die Liste.
              (ansicht.linealTakte ?? 1) <= 0,
            )
          : nothing,
      }, {
        setzeSuchtext: (text) => this.setzeSuchtext(text),
        dblklickKopf: (e, i) => {
          if (!this.editable) return

          feldPickerAbbestellen(this)
          benenneSpalteUm(e, i, () => this.spaltenListe(), (l) => this.aendere(l))
        },
        klickKopf: (e, i) => {
          if (this.editable) {
            oeffneFeldPicker(this, e, {
              prop: TabelleBlock.listenBindung.prop,
              index: i,
              liste: () => this.spaltenListe(),
            })
          }
          this.klickSortiere(i)
        },
        aktiviereZeile: (rohIndex, ansichtIndex) => this.aktiviereZeile(rohIndex, ansichtIndex),
        zeileDoppelt: (rohIndex) => this.zeileDoppelt(rohIndex),
        nimmErfassteZeile: (index) => {
          if (this._erfassung.entferne(index)) this.requestUpdate()
        },
        schalteLoeschung: (rohIndex) => this.schalteLoeschung(rohIndex),
        tippeZelle: (zeile, spalte, text) => this.tippeZelle(zeile, spalte, text),
        verlasseZelle: (zeile, spalte, text) => this.verlasseZelle(zeile, spalte, text),
        tasteZelle: (zeile, spalte, e) => this.tasteZelle(zeile, spalte, e),
      })}
      ${ ''}
      ${ansicht.leer || !this.fussNoetig(ansicht.seiten, ansicht.summen.length, vorgemerkt, loeschungen)
        ? nothing
        : tabelleFuss({
        hatQuelle: ansicht.hatQuelle,
        sichtbar: ansicht.gesamt,
        gesamt: this.datenzeilen.length,
        suchtAktiv: this._suchtext.trim() !== '',
        auswahlAktiv: this.durchAuswahlGefiltert,
        seite: ansicht.seite,
        seiten: ansicht.seiten,
        blaettert: this.blaettern === 'ja',
        summen: ansicht.summen,
        vorgemerkt,
        loeschungen,
      }, {
        blaettere: (zu) => {
          this.merkeZeilenFokus()
          this._seite = zu
          this.requestUpdate()
        },
      })}
    </div>`
  }
}

BasicBlock.defineAndRegister(TabelleBlock)
