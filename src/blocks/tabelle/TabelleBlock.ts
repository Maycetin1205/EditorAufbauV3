// Baustein Tabelle: haelt Spalten, Ansicht, Erfassung und Vormerkungen zusammen.
import { html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { SE_FOKUS_EVENT } from '../../softengine/bridge'
import { rechnungVonAttribut } from '../../core/data/rechnung'
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
import { geheInZelle, zellenEingabeStil, zellenFelder } from '../shared/zellenEingabe'
import {
  FENSTER_HOEHE,
  fensterBreiteFuer,
  schliesseNachschlagenFuer,
  spaltenStellenTpl,
} from './nachschlagen'
import {
  erfassungsZeileFuer,
  type ErfassungsWirt,
} from './erfassungsBedienung'
import { ErfassungsAnschluss } from './erfassungsAnschluss'
import { fensterSpaltenIn, type ErfassungsUmfeld } from './erfassungsZeile'
import {
  connectTable,
  disconnectTable,
  hatSatzNummer,
  leiteZeilenAb,
  type BereitgestellteZeile,
  type Datenbesitz,
} from './seRuntime'
import {
  coerceSpalten,
  rechnungNachSpalten,
  spaltenSicht,
  standardSpalten,
  tryCoerceSpalten,
  type Spalte,
} from './spalten'
import { ZeilenBearbeitung } from './zeilenBearbeitung'
import { LaufStand, type ZeilenZeichen } from './zeilenStatus'
import { meldeVormerkungen } from '../shared/vormerkStand'
import { AnsichtsStand } from './ansichtsStand'
import { aktiviereZeile, ZeilenWahl, zeileDoppelt } from './zeilenAktivierung'
import { BreitenStand } from './spaltenBreite'
import { SpaltenWahlStand } from './spaltenWahl'
import { ZEILEN_HOEHE } from './seitengroesse'
import { tabelleAnsicht, zeigtEchteDaten } from './tabelleAnsicht'
import { SPALTEN_BINDUNG, TABELLE_EIGENSCHAFTEN } from './tabelleEigenschaften'
import { tabelleFuss, tabelleKoerper } from './tabelleKoerper'
import { erfassungStil, tabelleStil } from './tabelleStil'

export { coerceSpalten, type Spalte } from './spalten'

export class TabelleBlock extends BasicBlock {
  static readonly blockType = 'tabelle'
  static readonly tagName = 'ff-tabelle'
  static readonly displayName = 'Tabelle'
  static readonly category: BlockCategory = 'anzeige'

  static readonly acceptsDataSource = true

  static readonly satzWahl: SatzWahl = {}
  static readonly kannAuswahlFolgen = true

  static readonly kannErfassen: ErfassungsFaehigkeit = {
    wenn: { attributeName: 'erfassung', equals: 'ja' },
  }

  static readonly aenderungsSchluessel = 'aenderbar'

  static readonly kannLoeschen: ErfassungsFaehigkeit = {
    wenn: { attributeName: 'loeschbar', equals: 'ja' },
  }

  static readonly blockEvents = [
    { key: 'onRowClick', name: 'Zeile gewählt' },

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

    spaltenwahl: 'nein',

    tagField: '',

    rechnung: '',

    leerText: LEER_TEXT_STANDARD,
  }
  static override readonly customProperties = TABELLE_EIGENSCHAFTEN

  static readonly raster = { startW: 24, startH: 14, minW: 6, minH: 4 }

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

  @property() spaltenwahl = 'nein'

  @property() leerText = LEER_TEXT_STANDARD

  @property() rechnung = ''

  @property({ attribute: false }) datenzeilen: string[][] = []

  @property({ attribute: false }) rohzeilen: unknown[] = []

  @property({ attribute: false }) durchAuswahlGefiltert = false

  @property({ attribute: false }) datenGeliefert = false

  private _besitz: Datenbesitz = 'softengine'

  private readonly _breiten = new BreitenStand({
    imEditor: () => this.imEditor,
    vollerPlatz: (gezeichnet) =>
      spaltenSicht(this.spaltenListe(), this.imEditor, this._wahl.weg())
        .plaetze[gezeichnet] ?? gezeichnet,
    spaltenListe: () => this.spaltenListe(),
    schreibeSpalten: (spalten) => this.aendere(spalten),
    melde: () => this.requestUpdate(),
  })

  private readonly _ansicht = new AnsichtsStand({
    baustein: this,
    editable: () => this.editable,
    zeilenHoehe: () => this.zeilenHoehe,
    melde: () => this.requestUpdate(),
    spalten: () => this.spaltenListe(),
    merktSortierung: () => !this.imEditor,
  })

  private _erfassung = new ErfassungsAnschluss()

  private readonly _lauf = new LaufStand(() => this.requestUpdate())

  private readonly _wahl = new SpaltenWahlStand({
    baustein: this,
    an: () => this.spaltenwahlAn,
    melde: () => this.requestUpdate(),
    breitenVergessen: () => this._breiten.vergessen(),
  })

  private readonly _zeilenWahl = new ZeilenWahl(this)

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
    this.datenGeliefert = true
    this._zeilenWahl.vergiss()
    this.durchAuswahlGefiltert = false
    this._ansicht.nachPush()
    this.requestUpdate()
  }

  private setzeAbgeleitetesZurueck(): void {
    this.rohzeilen = []
    this.datenzeilen = []
    this.datenGeliefert = false
    this._zeilenWahl.vergiss()
    this.durchAuswahlGefiltert = false
    this._ansicht.zuruecksetzen()
    this._erfassung.zuruecksetzen()
  }

  // Diese vier Getter sind der Laufzeit-Vertrag der Kette am Knopf: sie liest
  // sie ueber die Element-Referenz.
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

  private erfasseZeile(): boolean {
    if (!this._erfassung.erfasse(this.erfassungsUmfeld())) return false
    this.requestUpdate()
    this.fokussiereErfassungsZelle(0)
    this.zeigeLetzteErfasste()
    return true
  }

  // Ans Ende rollen statt zur Zeile: die klebende Erfassungszeile gilt dem
  // Browser als sichtbar, er rollt darum von selbst nicht.
  private zeigeLetzteErfasste(): void {
    void this.updateComplete.then(() => {
      const koerper = this.shadowRoot?.querySelector<HTMLElement>('.koerper')
      if (koerper) koerper.scrollTop = koerper.scrollHeight
    })
  }

  fokussiereSuche(): boolean {
    return this._ansicht.fokussiereSuche()
  }

  setzeSuchtext(text: string): void {
    this._ansicht.setzeSuchtext(text)
    this.requestUpdate()
  }

  private get hatQuelle(): boolean {
    return this._besitz === 'provided'
      ? true
      : zeigtEchteDaten(this.imEditor, this.source)
  }

  private spaltenListe(): Spalte[] {
    return coerceSpalten(this.spalten)
  }

  @property({ attribute: false }) fensterDialogIndex = -1

  // Ueber `aendere`, damit die Rechnung mitzieht und ein Undo-Schritt entsteht.
  private aendereSpalte(index: number, teil: Partial<Spalte>): void {
    const alt = this.spaltenListe()
    if (alt[index] === undefined) return
    this.aendere(alt.map((s, i) => (i === index ? { ...s, ...teil } : s)))
  }

  private fensterDialogTpl(index: number): TemplateResult {
    const spalte = this.spaltenListe()[index]
    const spalten = fensterSpaltenIn(this.erfassungsUmfeld(), index)
    return spaltenStellenTpl({
      titel: spalte?.titel ?? '',
      spalten,
      breite: spalte?.fensterBreite ?? fensterBreiteFuer(spalten.length),
      hoehe: spalte?.fensterHoehe ?? FENSTER_HOEHE,
      onGroesse: (detail) => {
        const schluessel = detail.achse === 'breite' ? 'fensterBreite' : 'fensterHoehe'
        // „standard" heisst zurueck zur Automatik: der Wert wird geloescht,
        // nicht auf eine Zahl gesetzt.
        this.aendereSpalte(index, {
          [schluessel]: detail.geste === 'standard' ? undefined : detail.wert,
        })
      },
      onAendern: (neu) => this.aendereSpalte(index, { fensterSpalten: neu as Spalte[] }),
      // Die Feldwahl bleibt stumm: Fenster- und Tabellenspalten heissen beide
      // `spalten`, ein Klick traefe die Spalte der Tabelle.
      onFeldWahl: () => {},
      onSchliessen: () => { this.fensterDialogIndex = -1 },
    })
  }

  private get zeilenHoehe(): number {
    return ZEILEN_HOEHE
  }

  private get erfassungAn(): boolean {
    return this.erfassung === 'ja'
  }

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

  private fokussiereErfassungsZelle(index: number): void {
    void this.updateComplete.then(() => {
      geheInZelle(zellenFelder(this.shadowRoot, '.zeile.erfassung', index)[0])
    })
  }

  private erfassungsUmfeld(): ErfassungsUmfeld {
    return this._erfassung.umfeld(
      this,
      this.spaltenListe(),
      this.source,
      rechnungVonAttribut(this.rechnung),
    )
  }

  // Rechnung und Spalten in EINER Geste melden, sonst braucht ein Loeschen
  // zwei Mal Strg+Z.
  private aendere(spalten: Spalte[]): void {
    const rechnung = rechnungNachSpalten(this.rechnung, this.spaltenListe(), spalten)
    if (rechnung === null) {
      this.meldeProp('spalten', spalten)
      return
    }
    this.meldeProp('rechnung', rechnung, 'beginn')
    this.meldeProp('spalten', spalten, 'ende')
  }

  private meldeProp(attr: string, value: unknown, geste?: 'beginn' | 'ende'): void {
    this.dispatchEvent(
      new CustomEvent('ff-prop-change', {
        detail: { attr, value, ...(geste === undefined ? {} : { geste }) },
        bubbles: true,
        composed: true,
      }),
    )
  }

  // Fokus aus dem ERP geht in die Erfassungszeile; ohne sie meldet sich die
  // Tabelle nicht und die Bruecke sucht weiter.
  private readonly nimmSeFokus = (ereignis: Event): void => {
    if (ereignis.defaultPrevented || !this.erfassungAn) return
    if (this.imEditor) return
    ereignis.preventDefault()
    this.fokussiereErfassungsZelle(0)
  }

  private readonly maskenTaste = (e: KeyboardEvent): void => {
    if (this.imEditor || e.key !== 'Insert' || !this.erfassungAn) return
    const tabellen = Array.from(this.ownerDocument.querySelectorAll<TabelleBlock>('ff-tabelle'))
    const pfad = e.composedPath()
    const zustaendig = tabellen.find((t) => pfad.includes(t))
      ?? tabellen.find((t) => t.erfassungAn)
    if (zustaendig !== this) return
    e.preventDefault()
    this.fokussiereErfassungsZelle(0)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (this._besitz === 'softengine') connectTable(this)
    document.addEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    document.addEventListener('keydown', this.maskenTaste)
    this._ansicht.beobachte()
  }

  protected override firstUpdated(): void {
    this._ansicht.beobachte()
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed)
    // Die fluechtigen Breiten haengen am Platz der Spalte; aendert sich die
    // Liste, gilt wieder die gleichmaessige Aufteilung.
    if (changed.has('spalten')) this._breiten.vergessen()
    if (!this.erfassungAn || this.imEditor) return
    this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())
  }

  protected override updated(): void {
    this._ansicht.nachRendern()
    meldeVormerkungen(this)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._wahl.loese()
    document.removeEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    document.removeEventListener('keydown', this.maskenTaste)
    this._ansicht.loese()
    schliesseNachschlagenFuer(this)
    disconnectTable(this)
  }

  static override styles = [
    BasicBlock.styles,
    leerStil,
    tabelleStil,
    vorschlagStil,
    zellenEingabeStil,
    erfassungStil,
  ]

  private get spaltenwahlAn(): boolean {
    return this.spaltenwahl === 'ja'
      && this.kopfzeile === 'ja'
      && !this.imEditor
  }

  private oeffneSpaltenwahl(e: MouseEvent): void {
    const rahmen = this.shadowRoot?.querySelector('.tabelle')?.getBoundingClientRect()
    if (!rahmen) return
    this._wahl.oeffne(e, rahmen)
  }

  override render(): TemplateResult {
    const spalten = this.spaltenListe()

    const sicht = spaltenSicht(spalten, this.imEditor, this._wahl.weg())

    const ansicht = tabelleAnsicht({
      spalten,
      gezeichnet: sicht.spalten,
      plaetze: sicht.plaetze,
      breiteVon: (i) => this._breiten.breiteVon(i),
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
      ${tabelleKoerper({
        spalten: sicht.spalten,
        plaetze: sicht.plaetze,
        cols: ansicht.cols,
        editable: this.editable,
        imEditor: this.imEditor,
        zeigeKopf: this.kopfzeile === 'ja',
        spaltenwahlAn: this.spaltenwahlAn,
        spaltenwahl: this._wahl.offen === null ? null : {
          waehlbar: spalten.filter((sp) => sp.versteckt !== true),
          weg: this._wahl.weg(),
          links: this._wahl.offen.links,
          oben: this._wahl.offen.oben,
        },
        auswahlSemantik: geberIdVon(this) !== '',
        zeigeSuche: this.suche === 'ja',
        suchtext: this._ansicht.suchtext,
        sortSpalte: this._ansicht.sortSpalte,
        sortAuf: this._ansicht.sortAuf,
        zeilen: ansicht.zeilen,
        linealTakte: ansicht.linealTakte,
        datenzeilen: this.datenzeilen,
        hatQuelle: ansicht.hatQuelle,
        auswahlIndex: this._zeilenWahl.platzIn(this.rohzeilen),
        aendernMoeglich: !this.imEditor && ansicht.hatQuelle && hatSatzNummer(this),
        loeschbar: this.loeschbar === 'ja'
          && !this.imEditor
          && ansicht.hatQuelle
          && hatSatzNummer(this),
        zeilenStand: this._zeilen,
        leer: ansicht.leer,
        leerText: this.leerText,
        erfasste: this._erfassung.zeilen,
        erfasstStand: (index) => this.erfasstStand(index),
        korrekturPlatz: this.erfassungAn ? this._erfassung.korrekturPlatz : null,
        erfassung: this.erfassungAn
          ? erfassungsZeileFuer(
              this.erfassungsWirt(),
              ansicht.cols,
              // Kein Lineal mehr uebrig: die Zeile sitzt ganz unten, unter
              // ihr ist kein Platz fuer die Vorschlagsliste.
              this._erfassung.korrekturPlatz === null && (ansicht.linealTakte ?? 1) <= 0,
              sicht,
            )
          : nothing,
      }, {
        setzeSuchtext: (text) => this._ansicht.setzeSuchtext(text),
        oeffneSpaltenwahl: (e) => this.oeffneSpaltenwahl(e),
        spaltenwahl: {
          schalte: (kennung) => this._wahl.schalte(kennung),
          alleZeigen: () => this._wahl.alleZeigen(),
          schliesse: () => this._wahl.schliesse(),
        },
        breiten: this._breiten.wirtFuerZug(),
        klickKopf: (i) => {
          if (!this.editable) this._ansicht.klickSortiere(i)
        },
        aktiviereZeile: (rohIndex, ansichtIndex) => {
          aktiviereZeile(this, this._zeilenWahl, this.rohzeilen, rohIndex, ansichtIndex)
          this.requestUpdate()
        },
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
        leer: ansicht.leer,
      }, {
        blaettere: (zu) => this._ansicht.blaettere(zu),
      })}
      ${this.imEditor && this.spaltenListe()[this.fensterDialogIndex] !== undefined
        ? this.fensterDialogTpl(this.fensterDialogIndex)
        : nothing}
    </div>`
  }
}

BasicBlock.defineAndRegister(TabelleBlock)
