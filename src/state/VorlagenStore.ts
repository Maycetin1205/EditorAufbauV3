import { type EintragProblem } from '../core/data/ladeProblem'
import { deepClone } from '../lib/deepClone'
import { meldungen } from './meldungen'
import {
  kopieSatz,
  legeKopieAn,
  meldeSpeicherPanne,
  merkeSpeicherErfolg,
  sichereUnlesbaren,
} from './notfallkopie'
import { SpeicherPlaner } from './speicherPlaner'
import { Subject } from './Subject'

const SPEICHER_VERZOEGERUNG_MS = 500

export interface VorlagenEintrag {
  id: string
}

export interface VorlagenBauplan<T extends VorlagenEintrag> {
  schluessel: string

  huelle: string

  klarnameLesen: string

  klarnameSchreiben: string

  pruefe: (roh: unknown) => { liste: T[]; probleme: EintragProblem[] }

  startbestand?: readonly T[]
}

// Was `pruefe` aussortiert, ist beim naechsten Speichern endgueltig weg —
// die gekuerzte Liste ueberschreibt den Rohstand. Darum VOR dem ersten
// Rueckschreiben eine Kopie anlegen und sagen, was fehlt.
function meldeGekuerzten(
  schluessel: string,
  klarname: string,
  roh: string,
  probleme: readonly EintragProblem[],
): void {
  const backupKey = legeKopieAn(schluessel, roh)
  const liste = probleme.slice(0, 10)
    .map((p) => `• ${p.stelle === '' ? '' : `${p.stelle}: `}${p.grund}`)
  const rest = probleme.length - liste.length
  meldungen.melde([
    `Beim Laden von „${klarname}" wurde(n) ${probleme.length} Eintrag/Einträge übergangen:`,
    ...liste,
    ...(rest > 0 ? [`… und ${rest} weitere.`] : []),
    kopieSatz(schluessel, backupKey),
    'Beim nächsten Speichern schreibt der Editor die gekürzte Liste zurück.',
  ].join('\n'))
}

function ladeAusSpeicher<T extends VorlagenEintrag>(bauplan: VorlagenBauplan<T>): T[] | null {
  let roh: string | null = null
  try {
    if (typeof localStorage !== 'undefined') roh = localStorage.getItem(bauplan.schluessel)
  } catch (err) {
    console.warn(
      `Browser-Speicher nicht lesbar — „${bauplan.klarnameLesen}" startet leer.`,
      err,
    )
    return null
  }
  if (!roh) return null
  try {
    const gelesen = JSON.parse(roh) as Record<string, unknown> | null
    const rohListe = gelesen?.[bauplan.huelle]

    if (!Array.isArray(rohListe)) {
      sichereUnlesbaren(bauplan.schluessel, roh, bauplan.klarnameLesen)
      return null
    }

    const { liste, probleme } = bauplan.pruefe(rohListe)
    if (probleme.length > 0) {
      meldeGekuerzten(bauplan.schluessel, bauplan.klarnameLesen, roh, probleme)
    }
    return liste
  } catch {
    sichereUnlesbaren(bauplan.schluessel, roh, bauplan.klarnameLesen)
    return null
  }
}

export class VorlagenStore<T extends VorlagenEintrag> extends Subject<VorlagenStore<T>> {
  private readonly bauplan: VorlagenBauplan<T>
  private _eintraege: T[]
  private _version = 0
  private _planer = new SpeicherPlaner(() => { this.schreibeJetzt() }, SPEICHER_VERZOEGERUNG_MS)

  private _hydrated = false

  constructor(bauplan: VorlagenBauplan<T>) {
    super()
    this.bauplan = bauplan
    this._eintraege = ladeAusSpeicher(bauplan)
      ?? (bauplan.startbestand ? deepClone(bauplan.startbestand) as T[] : [])
    this._hydrated = true
  }

  get list(): readonly T[] { return this._eintraege }
  get version(): number { return this._version }

  get(id: string): T | undefined {
    return this._eintraege.find((e) => e.id === id)
  }

  override notify(data: VorlagenStore<T>): void {
    this._version++
    super.notify(data)
    if (this._hydrated) this.planeSpeichern()
  }

  add(data: Omit<T, 'id'>): T {
    const eintrag = { ...deepClone(data), id: crypto.randomUUID() } as T
    this._eintraege = [...this._eintraege, eintrag]
    this.notify(this)
    return eintrag
  }

  update(id: string, data: Omit<T, 'id'>): void {
    const at = this._eintraege.findIndex((e) => e.id === id)
    if (at < 0) return
    const naechste = [...this._eintraege]
    naechste[at] = { ...deepClone(data), id } as T
    this._eintraege = naechste
    this.notify(this)
  }

  ersetzeAlle(eintraege: readonly T[]): void {
    this._eintraege = deepClone(eintraege) as T[]
    this.notify(this)
  }

  remove(id: string): void {
    const naechste = this._eintraege.filter((e) => e.id !== id)
    if (naechste.length === this._eintraege.length) return
    this._eintraege = naechste
    this.notify(this)
  }

  private planeSpeichern(): void {
    this._planer.plane()
  }

  speichereJetzt(): void {
    this._planer.sofort()
  }

  private schreibeJetzt(): void {
    try {
      localStorage.setItem(
        this.bauplan.schluessel,
        JSON.stringify({ [this.bauplan.huelle]: this._eintraege }),
      )
      merkeSpeicherErfolg(this.bauplan.schluessel)
    } catch (err) {
      meldeSpeicherPanne(this.bauplan.schluessel, this.bauplan.klarnameSchreiben, err)
    }
  }
}
