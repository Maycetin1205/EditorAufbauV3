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
  VormerkArt,
} from '../../core/blocks/BlockDefinition'
import { geberIdVon } from '../shared/auswahl'
import { LEER_TEXT_STANDARD, leerStil } from '../shared/leerZustand'
import { vorschlagStil } from '../shared/vorschlagListe'
import { chipStyles } from '../shared/statusVariant'
import { schliesseNachschlagenFuer } from '../formfeld/nachschlagen'
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
import { connectTable, disconnectTable, hatSatzNummer } from './seRuntime'
import { zeigtEchteDaten } from './suche'
import {
  feldPickerAbbestellen,
  kopfGriffe,
  spaltenSteuerung,
} from './spaltenBearbeiten'
import { zeilenHoeheFuer } from './spaltenArten'
import { ZeilenBearbeitung } from './zeilenBearbeitung'
import { LaufStand, type ZeilenZeichen } from './zeilenStatus'
import { meldeVormerkungen } from '../shared/vormerkStand'
import { AnsichtsStand } from './ansichtsStand'
import { aktiviereZeile, zeileDoppelt } from './zeilenEreignisse'
import { SPALTEN_BINDUNG } from './spaltenBindung'
import { tabelleAnsicht } from './tabelleAnsicht'
import { TABELLE_EIGENSCHAFTEN } from './tabelleEigenschaften'
import { tabelleFuss } from './tabelleFuss'
import { tabelleKoerper } from './tabelleKoerper'
import { tabelleStil } from './tabelleStil'
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

  @property() kopfzeile = 'ja'

  @property() leerText = LEER_TEXT_STANDARD

  @property({ attribute: false }) datenzeilen: string[][] = []

  @property({ attribute: false }) zusatzzeilen: Record<string, string>[][] = []

  @property({ attribute: false }) rohzeilen: unknown[] = []

  @property({ attribute: false }) auswahlIndex = -1

  @property({ attribute: false }) durchAuswahlGefiltert = false

  @property({ attribute: false }) datenGeliefert = false

  private _besitz: Datenbesitz = 'softengine'

  // Suchtext, Sortierung, Seite, Messung, Zeilenfokus — der Stand, in dem die
  // Tabelle dasteht. Er liegt in ansichtsStand, der Baustein delegiert nur.
  private readonly _ansicht = new AnsichtsStand({
    baustein: this,
    editable: () => this.editable,
    zeilenHoehe: () => this.zeilenHoehe,
    melde: () => this.requestUpdate(),
  })

  // Tipp-Zustand + erfasste Zeilen; sie ueberleben jeden Daten-Push und
  // fallen nur mit dem Zweckwechsel oder dem Ketten-Lauf des Knopfs.
  private _erfassung = new ErfassungsAnschluss()

  // Was der Ketten-Lauf ueber einzelne Zeilen gemeldet hat (schreibt, haengen
  // geblieben). Der Baustein haelt ihn, weil er beide Sorten Zeilen zeigt.
  private readonly _lauf = new LaufStand(() => this.requestUpdate())

  // Vormerkungen und Zellbedienung der GEBUCHTEN Zeilen — Stand und
  // Bedienung liegen in zeilenBearbeitung, der Baustein delegiert nur.
  private readonly _zeilen = new ZeilenBearbeitung({
    baustein: this,
    spalten: () => this.spaltenListe(),
    rohzeilen: () => this.rohzeilen,
    datenzeilen: () => this.datenzeilen,
    melde: () => this.requestUpdate(),
    lauf: this._lauf,
    erfassungAn: () => this.erfassungAn,
    fokussiereErfassungsZelle: (index) => this.fokussiereErfassungsZelle(index),
  })

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
    this._ansicht.nachPush()
    this.requestUpdate()
  }

  private setzeAbgeleitetesZurueck(): void {
    this.rohzeilen = []
    this.datenzeilen = []
    this.zusatzzeilen = []
    this.datenGeliefert = false
    this.auswahlIndex = -1
    this.durchAuswahlGefiltert = false
    this._ansicht.zuruecksetzen()
    this._erfassung.zuruecksetzen()
  }

  // Die Laufzeit-Vertraege ErfassungsTraegerElement, AenderungsTraegerElement,
  // LoeschTraegerElement und LaufBerichtElement (core/blocks/BlockDefinition.ts):
  // die Kette am Knopf liest sie ueber die Element-Referenz (data-ff-block-id)
  // — darum stehen sie am Baustein und delegieren nur.
  // Die Kette sieht auch die Zeile, die gerade zur Korrektur oben steht —
  // sonst schriebe der Knopf ausgerechnet die Zeile nicht, die der Bediener
  // vor Augen hat.
  get erfassteZeilen(): readonly (readonly string[])[] {
    return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map((v) => v.werte)
  }

  get erfassteSchluessel(): readonly string[] {
    return this._erfassung.vormerkungen(this.erfassungsUmfeld()).map((v) => v.kennung)
  }

  get geaenderteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    return this._zeilen.geaenderteZeilen
  }

  get geloeschteZeilen(): readonly { satz: string; werte: readonly string[] }[] {
    return this._zeilen.geloeschteZeilen
  }

  zeileSchreibt(art: VormerkArt, schluessel: string): void {
    this._lauf.schreibt(art, schluessel)
  }

  zeileGescheitert(art: VormerkArt, schluessel: string, meldung: string): void {
    this._lauf.gescheitert(art, schluessel, meldung)
  }

  laufFertig(art: VormerkArt, geschrieben: readonly string[]): void {
    this._lauf.fertig(art, geschrieben)
    if (art === 'erfasst') {
      const bewegt = this._erfassung.markiereGeschrieben(this.erfassungsUmfeld(), geschrieben)
      if (bewegt) this.requestUpdate()
      return
    }
    this._zeilen.austragen(art, geschrieben)
  }

  // Erst eine echte Lieferung aus SoftEngine raeumt die hinausgeschickten
  // Zeilen weg — der Laufzeit-Anschluss reicht durch, ob es eine war.
  vergissGeschriebene(): void {
    if (this._erfassung.vergissGeschriebene()) this.requestUpdate()
  }

  private erfasstStand(index: number): ZeilenZeichen {
    return this._lauf.zeigt(
      'erfasst',
      this._erfassung.schluessel[index] ?? '',
      this._erfassung.istGeschrieben(index) ? 'geschrieben' : 'erfasst',
    )
  }

  // Enter am Zeilenende (G4): die Zeile bleibt stehen, die Erfassung rueckt
  // tiefer, der Cursor auf die erste Zelle. Geschrieben wird hier NICHTS.
  private erfasseZeile(): boolean {
    if (!this._erfassung.erfasse(this.erfassungsUmfeld())) return false
    this.requestUpdate()
    this.fokussiereErfassungsZelle(0)
    this.zeigeLetzteErfasste()
    return true
  }

  // Nach dem Abschliessen muss die gerade erfasste Zeile zu sehen sein. Der
  // Fokus allein holt sie nicht her: die Erfassungszeile KLEBT unten, der
  // Browser haelt sie fuer sichtbar und rollt darum gar nicht — die neue Zeile
  // kann oben aus dem Bild sein oder hinter der klebenden Zeile liegen
  // (Nutzer-Ansage 2026-08-28). Ans Ende zu rollen setzt sie genau ueber die
  // Erfassungszeile.
  private zeigeLetzteErfasste(): void {
    void this.updateComplete.then(() => {
      const koerper = this.shadowRoot?.querySelector<HTMLElement>('.koerper')
      if (koerper) koerper.scrollTop = koerper.scrollHeight
    })
  }

  // Das Nachschlage-Fenster setzt den Fokus in die Suchzeile der Tabelle,
  // die es zeigt (nachschlagen.ts) — darum bleibt der Weg am Baustein.
  fokussiereSuche(): boolean {
    return this._ansicht.fokussiereSuche()
  }

  private get hatQuelle(): boolean {
    return this._besitz === 'provided'
      ? true
      : zeigtEchteDaten(this.hasAttribute('data-ff-editor'), this.source)
  }

  private spaltenListe(): Spalte[] {
    return coerceSpalten(this.spalten)
  }

  private get zeilenHoehe(): number {
    return zeilenHoeheFuer(this.spaltenListe())
  }

  private get erfassungAn(): boolean {
    return this.erfassung === 'ja'
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
      const feld = felder?.[index]
      if (!feld) return
      feld.focus()
      // Dasselbe wie in der gebuchten Zeile (zeilenBearbeitung): der Cursor
      // nuetzt nichts, wenn die Zelle ausserhalb des Blicks steht.
      feld.scrollIntoView({ block: 'nearest' })
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
    this._ansicht.beobachte()
  }

  protected override firstUpdated(): void {
    this._ansicht.beobachte()
  }

  // Wie beim Nachschlage-Feld (G1): einmal je Darstellung berechnet, damit
  // Tastatur und Anzeige DENSELBEN Stand sehen. Im Editor gibt es keine Daten
  // und keine Liste (Regel 7).
  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed)
    if (!this.erfassungAn || this.hasAttribute('data-ff-editor')) return
    this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())
  }

  // Der Schreiben-Knopf haengt nicht an diesem Baustein, sondern an seiner
  // eigenen Kette. Er erfaehrt hier, dass sich die Zahl geaendert hat — an
  // EINER Stelle, damit kein Weg (Tippen, Loeschkreuz, Push) sie vergisst.
  protected override updated(): void {
    this._ansicht.nachRendern()
    meldeVormerkungen(this)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    feldPickerAbbestellen(this)
    this._ansicht.loese()
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
      suchtext: this._ansicht.suchtext,
      sortSpalte: this._ansicht.sortSpalte,
      sortAuf: this._ansicht.sortAuf,
      wunschSeite: this._ansicht.seite,
      gemessen: this._ansicht.mass,
      erfassungAn: this.erfassungAn,
      erfassteAnzahl: this._erfassung.zeilen.length,
      wertVon: (zeile, spalte) => this._zeilen.zellWert(zeile, spalte),
      blaettert: this.blaettern === 'ja',
    })
    return html`<div class="tabelle" style=${styleMap({
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
        suchtext: this._ansicht.suchtext,
        sortSpalte: this._ansicht.sortSpalte,
        sortAuf: this._ansicht.sortAuf,
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
        zeilenStand: this._zeilen,
        leer: ansicht.leer,
        leerText: this.leerText,
        erfasste: this._erfassung.zeilen,
        erfasstStand: (index) => this.erfasstStand(index),
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
        setzeSuchtext: (text) => this._ansicht.setzeSuchtext(text),
        ...kopfGriffe({
          baustein: this,
          editable: () => this.editable,
          prop: TabelleBlock.listenBindung.prop,
          liste: () => this.spaltenListe(),
          aendere: (l) => this.aendere(l),
          sortiere: (i) => this._ansicht.klickSortiere(i),
        }),
        aktiviereZeile: (rohIndex, ansichtIndex) =>
          aktiviereZeile(this, this.rohzeilen, rohIndex, ansichtIndex),
        zeileDoppelt: (rohIndex) => zeileDoppelt(this, this.rohzeilen, rohIndex),
        nimmErfassteZeile: (index) => {
          if (this._erfassung.entferne(index)) this.requestUpdate()
        },
        holeErfassteZeile: (index) => {
          if (!this._erfassung.zurueckholen(this.erfassungsUmfeld(), index)) return
          this.requestUpdate()
          this.fokussiereErfassungsZelle(0)
        },
        schalteLoeschung: (rohIndex) => this._zeilen.schalteLoeschung(rohIndex),
      })}
      ${tabelleFuss({
        hatQuelle: ansicht.hatQuelle,
        sichtbar: ansicht.gesamt,
        gesamt: this.datenzeilen.length,
        suchtAktiv: this._ansicht.suchtAktiv,
        auswahlAktiv: this.durchAuswahlGefiltert,
        seite: ansicht.seite,
        seiten: ansicht.seiten,
        blaettert: this.blaettern === 'ja',
        summen: ansicht.summen,
        erfasst: this._erfassung.zeilen.length,
        geaendert: this._zeilen.vorgemerkteAenderungen(),
        geloescht: this._zeilen.vorgemerkteLoeschungen(),
        leer: ansicht.leer,
      }, {
        blaettere: (zu) => this._ansicht.blaettere(zu),
      })}
    </div>`
  }
}

BasicBlock.defineAndRegister(TabelleBlock)
