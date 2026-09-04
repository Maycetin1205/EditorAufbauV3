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
import { schliesseNachschlagenFuer } from '../shared/nachschlagen'
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
import { rechnungNachSpalten } from './spaltenBearbeiten'
import { ZeilenBearbeitung } from './zeilenBearbeitung'
import { LaufStand, type ZeilenZeichen } from './zeilenStatus'
import { meldeVormerkungen } from '../shared/vormerkStand'
import { AnsichtsStand } from './ansichtsStand'
import { aktiviereZeile, zeileDoppelt } from './zeilenEreignisse'
import type { BreitenAenderung, BreitenWirt } from './spaltenBreite'
import { SPALTEN_BINDUNG } from './spaltenBindung'
import { spaltenSicht } from './spalten'
import { ladeWahl, sichereWahl, wahlSchluessel } from './spaltenWahl'
import { ZEILEN_HOEHE } from './seitengroesse'
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

const LEERE_WAHL: ReadonlySet<string> = new Set()

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

  @property() spaltenwahl = 'nein'

  @property() leerText = LEER_TEXT_STANDARD

  @property() rechnung = ''

  @property({ attribute: false }) datenzeilen: string[][] = []

  @property({ attribute: false }) rohzeilen: unknown[] = []

  @property({ attribute: false }) auswahlIndex = -1

  @property({ attribute: false }) durchAuswahlGefiltert = false

  @property({ attribute: false }) datenGeliefert = false

  private _besitz: Datenbesitz = 'softengine'

  private readonly _breiten = new Map<number, number>()

  private _breiteVorZug: Map<number, number | undefined> | null = null

  private readonly _ansicht = new AnsichtsStand({
    baustein: this,
    editable: () => this.editable,
    zeilenHoehe: () => this.zeilenHoehe,
    melde: () => this.requestUpdate(),
  })

  private _erfassung = new ErfassungsAnschluss()

  private readonly _lauf = new LaufStand(() => this.requestUpdate())

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
    this.auswahlIndex = -1
    this.durchAuswahlGefiltert = false
    this._ansicht.nachPush()
    this.requestUpdate()
  }

  private setzeAbgeleitetesZurueck(): void {
    this.rohzeilen = []
    this.datenzeilen = []
    this.datenGeliefert = false
    this.auswahlIndex = -1
    this.durchAuswahlGefiltert = false
    this._ansicht.zuruecksetzen()
    this._erfassung.zuruecksetzen()
  }

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

  // Fokus allein rollt nicht: die klebende Erfassungszeile gilt dem Browser als
  // sichtbar, die neu erfasste Zeile bleibt aus dem Bild oder verdeckt
  // (Nutzer-Ansage 2026-08-28). Ans Ende rollen setzt sie genau darueber.
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
      : zeigtEchteDaten(this.hasAttribute('data-ff-editor'), this.source)
  }

  private spaltenListe(): Spalte[] {
    return coerceSpalten(this.spalten)
  }

  private get zeilenHoehe(): number {
    return ZEILEN_HOEHE
  }

  private breitenWirt(): BreitenWirt {
    const vollerPlatz = (gezeichnet: number): number => {
      const sicht = spaltenSicht(this.spaltenListe(), this.hasAttribute('data-ff-editor'))
      return sicht.plaetze[gezeichnet] ?? gezeichnet
    }
    const voll = (aenderung: readonly BreitenAenderung[]): BreitenAenderung[] =>
      aenderung.map((a) => ({ index: vollerPlatz(a.index), breite: a.breite }))
    const merkeVorZug = (aenderung: readonly BreitenAenderung[]): void => {
      if (this._breiteVorZug !== null) return
      this._breiteVorZug = new Map(aenderung.map((a) => [a.index, this._breiten.get(a.index)]))
    }
    return {
      zeige: (roh) => {
        const aenderung = voll(roh)
        merkeVorZug(aenderung)
        for (const a of aenderung) this._breiten.set(a.index, a.breite)
        this.requestUpdate()
      },
      uebernimm: (roh) => {
        const aenderung = voll(roh)
        this._breiteVorZug = null
        const liste = this.spaltenListe()
        if (!this.hasAttribute('data-ff-editor')) {
          for (const a of aenderung) this._breiten.set(a.index, a.breite)
          this.requestUpdate()
          return
        }
        for (const a of aenderung) {
          if (a.index >= liste.length) continue
          this._breiten.delete(a.index)
          liste[a.index] = { ...liste[a.index], breite: a.breite }
        }
        this.aendere(liste)
      },
      verwirf: () => {
        const vorher = this._breiteVorZug
        this._breiteVorZug = null
        if (!vorher) return
        for (const [index, wert] of vorher) {
          if (wert === undefined) this._breiten.delete(index)
          else this._breiten.set(index, wert)
        }
        this.requestUpdate()
      },
    }
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
      const feld = this.shadowRoot?.querySelector<HTMLInputElement>(
        `.zeile.erfassung .erf-eingabe[data-spalte="${index}"]`,
      )
      if (!feld) return
      feld.focus()
      feld.scrollIntoView({ block: 'nearest' })
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
    // Die fluechtigen Breiten haengen am PLATZ der Spalte. Kommt eine Spalte
    // dazu oder faellt eine weg, zeigen sie auf die falsche — dann lieber
    // zurueck auf die gleichmaessige Aufteilung als auf ein verschobenes
    // Raster. Waehrend eines Zugs passiert das nicht: dort aendert sich
    // `spalten` erst beim Loslassen, und da sind die Eintraege schon weg.
    if (changed.has('spalten')) this._breiten.clear()
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
    window.removeEventListener('keydown', this.nimmWahlTaste)
    document.removeEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    this._ansicht.loese()
    schliesseNachschlagenFuer(this)
    disconnectTable(this)
  }

  static override styles = [
    BasicBlock.styles,
    leerStil,
    tabelleStil,
    vorschlagStil,
    erfassungStil,
  ]

  // Was der BEDIENER weggenommen hat (nur Maske). Erst beim ersten Zeichnen
  // gelesen: `wahlSchluessel` braucht den Maskennamen und das fertige
  // Dokument.
  private _wahlWeg: Set<string> | null = null

  private _wahlOffen: { links: number; oben: number } | null = null

  private get spaltenwahlAn(): boolean {
    return this.spaltenwahl === 'ja'
      && this.kopfzeile === 'ja'
      && !this.hasAttribute('data-ff-editor')
  }

  private wahlWeg(): ReadonlySet<string> {
    if (!this.spaltenwahlAn) return LEERE_WAHL
    if (this._wahlWeg === null) this._wahlWeg = ladeWahl(wahlSchluessel(this))
    return this._wahlWeg
  }

  private readonly nimmWahlTaste = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return
    this.schliesseSpaltenwahl()
  }

  private oeffneSpaltenwahl(e: MouseEvent): void {
    // Das eigene Fenster statt des Browser-Menues — genau dafuer ist der
    // Rechtsklick hier vergeben (Nutzer-Entscheidung 2026-09-03).
    e.preventDefault()
    e.stopPropagation()
    const rahmen = this.shadowRoot?.querySelector('.tabelle')?.getBoundingClientRect()
    if (!rahmen) return
    this._wahlOffen = {
      links: Math.max(4, Math.min(e.clientX - rahmen.left, Math.max(4, rahmen.width - 170))),
      oben: Math.max(4, Math.min(e.clientY - rahmen.top, Math.max(4, rahmen.height - 60))),
    }
    window.addEventListener('keydown', this.nimmWahlTaste)
    this.requestUpdate()
  }

  private schliesseSpaltenwahl(): void {
    if (this._wahlOffen === null) return
    this._wahlOffen = null
    window.removeEventListener('keydown', this.nimmWahlTaste)
    this.requestUpdate()
  }

  private merkeWahl(weg: Set<string>): void {
    this._wahlWeg = weg
    sichereWahl(wahlSchluessel(this), weg)
    // Die fluechtigen Breiten haengen am Platz der gezeichneten Spalten; mit
    // einer Spalte mehr oder weniger stimmen sie nicht mehr.
    this._breiten.clear()
    this.requestUpdate()
  }

  override render(): TemplateResult {
    const spalten = this.spaltenListe()

    // Gezeichnet wird in der Maske ohne die ausgeblendeten Spalten; Werte,
    // Ketten und Rechnung laufen weiter ueber den vollen Platz (spalten.ts).
    const sicht = spaltenSicht(spalten, this.hasAttribute('data-ff-editor'), this.wahlWeg())

    const ansicht = tabelleAnsicht({
      spalten,
      gezeichnet: sicht.spalten,
      plaetze: sicht.plaetze,
      breiteVon: (i) => this._breiten.get(i),
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
        imEditor: this.hasAttribute('data-ff-editor'),
        zeigeKopf: this.kopfzeile === 'ja',
        spaltenwahlAn: this.spaltenwahlAn,
        spaltenwahl: this._wahlOffen === null ? null : {
          // Zur Wahl steht nur, was der BAUER zeigt.
          waehlbar: spalten.filter((sp) => sp.versteckt !== true),
          weg: this.wahlWeg(),
          links: this._wahlOffen.links,
          oben: this._wahlOffen.oben,
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
        auswahlIndex: this.auswahlIndex,
        aendernMoeglich: !this.hasAttribute('data-ff-editor')
          && ansicht.hatQuelle
          && hatSatzNummer(this),        loeschbar: this.loeschbar === 'ja'
          && !this.hasAttribute('data-ff-editor')
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
              // Kein Lineal mehr uebrig heisst: die Zeile sitzt ganz unten im
              // Rumpf, unter ihr ist kein Platz fuer die Liste. Eine Korrektur
              // mitten in der Liste hat dagegen Platz unter sich.
              this._erfassung.korrekturPlatz === null && (ansicht.linealTakte ?? 1) <= 0,
              sicht,
            )
          : nothing,
      }, {
        setzeSuchtext: (text) => this._ansicht.setzeSuchtext(text),
        oeffneSpaltenwahl: (e) => this.oeffneSpaltenwahl(e),
        spaltenwahl: {
          schalte: (kennung) => {
            const weg = new Set(this.wahlWeg())
            if (weg.has(kennung)) weg.delete(kennung)
            else weg.add(kennung)
            this.merkeWahl(weg)
          },
          alleZeigen: () => this.merkeWahl(new Set()),
          schliesse: () => this.schliesseSpaltenwahl(),
        },
        breiten: this.breitenWirt(),
        // Sortieren gehoert der Maske; im Editor liegt die Spalten-Bedienung
        // des Editors ueber dem Kopf.
        klickKopf: (i) => {
          if (!this.editable) this._ansicht.klickSortiere(i)
        },
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
        // Dieselbe Zahl wie der Knopf: der liest `erfassteZeilen` ueber
        // vormerkStand. `_erfassung.zeilen` waere eine zweite — sie zaehlt
        // die schon geschriebenen Zeilen mit und die getippte nicht.
        erfasst: this.erfassteZeilen.length,
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
