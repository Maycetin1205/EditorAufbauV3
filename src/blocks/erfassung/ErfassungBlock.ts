// Baustein Erfassung: eine Tabelle, die neue Zeilen annimmt, gebuchte aendert und loescht.
import { html, nothing, type CSSResultGroup, type PropertyValues, type TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import type { BlockCategory } from '../../core/blocks/BlockComponent'
import type {
  ErfassungsFaehigkeit,
  ListenBindung,
  VormerkArt,
} from '../../core/blocks/BlockDefinition'
import { SE_FOKUS_EVENT } from '../../softengine/bridge'
import { BasicBlock } from '../base/BasicBlock'
import { vorschlagStil } from '../shared/vorschlagListe'
import { meldeVormerkungen } from '../shared/vormerkStand'
import { geheInZelle, zellenEingabeStil, zellenFelder } from '../shared/zellenEingabe'
import {
  FENSTER_HOEHE,
  fensterBreiteFuer,
  schliesseNachschlagenFuer,
  spaltenStellenTpl,
} from '../tabelle/nachschlagen'
import { hatSatzNummer } from '../tabelle/seRuntime'
import { standardSpalten, type Spalte } from '../tabelle/spalten'
import { TabelleBlock } from '../tabelle/TabelleBlock'
import { OHNE_SCHMUCK, type Unterzeilen, type Zeilenschmuck } from '../tabelle/tabelleKoerper'
import { ErfassungsAnschluss } from './erfassungsAnschluss'
import { erfassungsZeileFuer, type ErfassungsWirt } from './erfassungsBedienung'
import {
  ERFASSUNG_EIGENSCHAFTEN,
  ERFASSUNG_SPALTEN_BINDUNG,
  spalteAenderbar,
} from './erfassungsEigenschaften'
import {
  erfassteZeilenTpl,
  kreuzAnzeigeTpl,
  loeschKreuzTpl,
  tippZelleTpl,
} from './erfassungsKoerper'
import { erfassungStil } from './erfassungStil'
import { fensterSpaltenIn, type ErfassungsUmfeld } from './erfassungsZeile'
import { ZeilenBearbeitung } from './zeilenBearbeitung'
import { LaufStand, type ZeilenZeichen } from './zeilenStatus'

export class ErfassungBlock extends TabelleBlock {
  static override readonly blockType = 'erfassung'
  static override readonly tagName = 'ff-erfassung'
  static override readonly displayName = 'Erfassung'
  static override readonly category: BlockCategory = 'eingabe'

  static readonly kannErfassen: ErfassungsFaehigkeit = {}

  static readonly aenderungsSchluessel = 'aenderbar'

  static readonly kannLoeschen: ErfassungsFaehigkeit = {
    wenn: { attributeName: 'loeschbar', equals: 'ja' },
  }

  static override readonly listenBindung: ListenBindung = ERFASSUNG_SPALTEN_BINDUNG

  static override readonly defaultProps = {
    ...TabelleBlock.defaultProps,
    spalten: standardSpalten(),
    loeschbar: 'nein',
  }

  static override readonly customProperties = ERFASSUNG_EIGENSCHAFTEN

  static override styles: CSSResultGroup = [
    TabelleBlock.styles,
    vorschlagStil,
    zellenEingabeStil,
    erfassungStil,
  ]

  @property() loeschbar = 'nein'

  @property({ attribute: false }) fensterDialogIndex = -1

  private readonly _erfassung = new ErfassungsAnschluss()

  private readonly _lauf = new LaufStand(() => this.requestUpdate())

  private readonly _zeilen = new ZeilenBearbeitung({
    baustein: this,
    spalten: () => this.spaltenListe(),
    rohzeilen: () => this.rohzeilen,
    datenzeilen: () => this.datenzeilen,
    melde: () => this.requestUpdate(),
    lauf: this._lauf,
    fokussiereErfassungsZelle: (index) => this.fokussiereErfassungsZelle(index),
  })

  // Der Laufzeit-Vertrag der Kette am Knopf: sie liest diese Listen ueber die
  // Element-Referenz.
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
      if (this._erfassung.markiereGeschrieben(this.erfassungsUmfeld(), geschrieben)) {
        this.requestUpdate()
      }
      return
    }
    this._zeilen.austragen(art, geschrieben)
  }

  vergissGeschriebene(): void {
    if (this._erfassung.vergissGeschriebene()) this.requestUpdate()
  }

  protected override setzeAbgeleitetesZurueck(): void {
    super.setzeAbgeleitetesZurueck()
    this._erfassung.zuruecksetzen()
  }

  protected override zellWert(rohIndex: number, platz: number): string {
    return this._zeilen.zellWert(rohIndex, platz)
  }

  private erfassungsUmfeld(): ErfassungsUmfeld {
    return this._erfassung.umfeld(this, this.spaltenListe(), this.source)
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

  private erfasstStand(index: number): ZeilenZeichen {
    return this._lauf.zeigt(
      'erfasst',
      this._erfassung.schluessel[index] ?? '',
      this._erfassung.istGeschrieben(index) ? 'geschrieben' : 'erfasst',
    )
  }

  // Getippt wird nur in der Maske und nur an Zeilen mit Satznummer: ohne sie
  // haette eine Aenderung kein Schreibziel.
  private get aendernMoeglich(): boolean {
    return !this.imEditor && this.hatQuelle && hatSatzNummer(this)
  }

  protected override zeilenSchmuck(): (rohIndex: number | null) => Zeilenschmuck {
    const loeschbar = this.loeschbar === 'ja'
    const tippbar = this.aendernMoeglich
    const kreuz = loeschbar && tippbar
    return (rohIndex) => {
      if (rohIndex === null) {
        return {
          ...OHNE_SCHMUCK,
          rechts: loeschbar && this.imEditor ? kreuzAnzeigeTpl() : nothing,
        }
      }
      const zeichen = this._zeilen.statusVon(rohIndex)
      const geloescht = this._zeilen.istGeloescht(rohIndex)
      return {
        status: zeichen.status === 'gebucht' ? '' : zeichen.status,
        titel: zeichen.titel,
        klasse: geloescht ? 'geloescht' : '',
        fehltext: zeichen.status === 'fehler' ? zeichen.titel : '',
        zelle: (platz, spalte) => (tippbar && spalteAenderbar(spalte)
          ? tippZelleTpl(this._zeilen, rohIndex, platz, spalte)
          : null),
        rechts: kreuz
          ? loeschKreuzTpl(geloescht, () => this._zeilen.schalteLoeschung(rohIndex))
          : nothing,
        taste: (e) => {
          if (e.key !== 'Delete' || !kreuz) return false
          this._zeilen.schalteLoeschung(rohIndex)
          return true
        },
      }
    }
  }

  protected override unterZeilen(): Unterzeilen {
    const erfasste = this._erfassung.zeilen
    return {
      anzahl: 1 + erfasste.length,
      zeichne: ({ sicht, cols, linealTakte }) => {
        const korrekturPlatz = this._erfassung.korrekturPlatz
        return erfassteZeilenTpl({
          spalten: sicht.spalten,
          plaetze: sicht.plaetze,
          cols,
          imEditor: this.imEditor,
          erfasste,
          erfasstStand: (index) => this.erfasstStand(index),
          korrekturPlatz,
          erfassung: erfassungsZeileFuer(
            this.erfassungsWirt(),
            cols,
            // Kein Lineal mehr uebrig: die Zeile sitzt ganz unten, unter ihr
            // ist kein Platz fuer die Vorschlagsliste.
            korrekturPlatz === null && (linealTakte ?? 1) <= 0,
            sicht,
          ),
        }, {
          nimmErfassteZeile: (index) => {
            if (this._erfassung.entferne(index)) this.requestUpdate()
          },
          holeErfassteZeile: (index) => {
            if (!this._erfassung.zurueckholen(this.erfassungsUmfeld(), index)) return
            this.requestUpdate()
            this.fokussiereErfassungsZelle(0)
          },
        })
      },
    }
  }

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

  override render(): TemplateResult {
    const dialog = this.imEditor && this.spaltenListe()[this.fensterDialogIndex] !== undefined
      ? this.fensterDialogTpl(this.fensterDialogIndex)
      : nothing
    return html`${super.render()}${dialog}`
  }

  // Fokus aus dem ERP geht in die Erfassungszeile; ohne Antwort sucht die
  // Bruecke weiter.
  private readonly nimmSeFokus = (ereignis: Event): void => {
    if (ereignis.defaultPrevented || this.imEditor) return
    ereignis.preventDefault()
    this.fokussiereErfassungsZelle(0)
  }

  // Insert springt in die Erfassungszeile der Erfassung, in der der Fokus
  // steht, sonst in die erste der Maske.
  private readonly maskenTaste = (e: KeyboardEvent): void => {
    if (this.imEditor || e.key !== 'Insert') return
    const alle = Array.from(
      this.ownerDocument.querySelectorAll<ErfassungBlock>(ErfassungBlock.tagName),
    )
    const pfad = e.composedPath()
    const zustaendig = alle.find((t) => pfad.includes(t)) ?? alle[0]
    if (zustaendig !== this) return
    e.preventDefault()
    this.fokussiereErfassungsZelle(0)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    document.addEventListener('keydown', this.maskenTaste)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener(SE_FOKUS_EVENT, this.nimmSeFokus)
    document.removeEventListener('keydown', this.maskenTaste)
    schliesseNachschlagenFuer(this)
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed)
    if (this.imEditor) return
    this._erfassung.lauf.aktualisiereVorschlaege(this.erfassungsUmfeld())
  }

  protected override updated(): void {
    super.updated()
    meldeVormerkungen(this)
  }
}

BasicBlock.defineAndRegister(ErfassungBlock)
