import { ROOT_ID } from '../core/blocks/BlockData'
import { getBlockDefinition } from '../core/blocks/blockRegistry'
import { RASTER, parseRasterPos, rasterSpecOf } from '../core/blocks/rasterLayout'

export function migrateKanbanVorlage(
  src: Record<string, { type?: unknown; childIds?: unknown }>,
): string[] {
  const entfernt: string[] = []
  for (const [id, node] of Object.entries(src)) {
    if (!node || typeof node !== 'object' || node.type !== 'kanban-vorlage') continue
    const parent = Object.values(src).find(
      (p) => p && typeof p === 'object' && Array.isArray(p.childIds) && p.childIds.includes(id),
    )
    if (!parent || !Array.isArray(parent.childIds)) continue
    const spalte = parent.childIds
      .map((cid) => (typeof cid === 'string' ? src[cid] : undefined))
      .find((n) => n && typeof n === 'object' && n.type === 'kanban-spalte')
    const cards = Array.isArray(node.childIds) ? node.childIds : []
    if (spalte) {
      spalte.childIds = [...cards, ...(Array.isArray(spalte.childIds) ? spalte.childIds : [])]
    } else {
      for (const cid of cards) if (typeof cid === 'string') entfernt.push(cid)
    }
    parent.childIds = parent.childIds.filter((cid) => cid !== id)
    entfernt.push(id)
  }
  return entfernt
}

export function migrateKnopfAusTabelle(
  src: Record<string, { type?: unknown; childIds?: unknown }>,
): string[] {
  const entfernt: string[] = []
  for (const node of Object.values(src)) {
    if (!node || typeof node !== 'object' || node.type !== 'tabelle') continue
    if (!Array.isArray(node.childIds)) continue
    node.childIds = node.childIds.filter((cid) => {
      const kind = typeof cid === 'string' ? src[cid] : undefined
      const istKnopf = Boolean(kind) && typeof kind === 'object' && kind.type === 'button'
      if (istKnopf && typeof cid === 'string') entfernt.push(cid)
      return !istKnopf
    })
  }
  return entfernt
}

interface RohKnoten {
  type?: unknown
  props?: unknown
  childIds?: unknown
}

function rohProps(node: RohKnoten): Record<string, unknown> {
  if (!node.props || typeof node.props !== 'object') node.props = {}
  return node.props as Record<string, unknown>
}

function istFlaecheRoh(id: string, node: RohKnoten): boolean {
  return id === ROOT_ID
    || (typeof node.type === 'string' && getBlockDefinition(node.type)?.pageBlock === true)
}

function verteileImBand(
  src: Record<string, RohKnoten>,
  band: { x: number; y: number; h: number },
  kinder: readonly string[],
): void {
  let x = band.x
  let y = band.y
  for (const cid of kinder) {
    const kind = src[cid]
    if (!kind || typeof kind.type !== 'string') continue
    const props = rohProps(kind)
    const w = Math.min(RASTER.spalten, rasterSpecOf(getBlockDefinition(kind.type), props).startW)
    if (x + w > RASTER.spalten) {
      x = 0
      y += band.h
    }
    props.rasterX = x
    props.rasterY = y
    props.rasterW = w
    props.rasterH = band.h
    x += w
  }
}

export function migrateZeileAufloesen(src: Record<string, RohKnoten>): string[] {
  const entfernt: string[] = []
  for (const [id, node] of Object.entries(src)) {
    if (!node || typeof node !== 'object' || node.type !== 'zeile') continue
    const eltern = Object.entries(src).find(
      ([, p]) => p && typeof p === 'object' && Array.isArray(p.childIds) && p.childIds.includes(id),
    )

    if (!eltern) continue
    const [elternId, elternKnoten] = eltern
    const elternKinder = elternKnoten.childIds as unknown[]
    const kinder = (Array.isArray(node.childIds) ? node.childIds : [])
      .filter((c): c is string => typeof c === 'string')
    const stelle = elternKinder.indexOf(id)
    elternKnoten.childIds = [
      ...elternKinder.slice(0, stelle),
      ...kinder,
      ...elternKinder.slice(stelle + 1),
    ]
    if (istFlaecheRoh(elternId, elternKnoten)) {
      verteileImBand(src, parseRasterPos(rohProps(node)), kinder)
    }
    entfernt.push(id)
  }
  return entfernt
}

// V0 (2026-08-18): Das Nachschlage-Feld hat kein „Angezeigt wird" mehr —
// was im Feld steht, ist die ERSTE Spalte seines Fensters. Ein alter Stand
// mit eigenem Anzeigefeld und ohne eigene Spalten bekommt daraus genau die
// zwei Spalten, die er bisher sah; sonst ginge die Einstellung still
// verloren. Die Art der Spalte bleibt offen — `alsSpalte` setzt Text.
// Laeuft auf den ROHDATEN, weil `normalizeProps` unbekannte Props
// wegwirft, und raeumt die alten Props gleich mit weg, damit die
// Verlustpruefung des Datei-Wegs nichts vermisst.
export function migrateAnzeigeFeldAufSpalten(src: Record<string, RohKnoten>): void {
  for (const node of Object.values(src)) {
    if (!node || typeof node !== 'object' || node.type !== 'formfeld') continue
    if (!node.props || typeof node.props !== 'object') continue
    const props = rohProps(node)
    if (!('anzeigeFeld' in props) && !('anzeigeTitel' in props)) continue

    const text = (wert: unknown): string => (typeof wert === 'string' ? wert : '')
    const anzeigeFeld = text(props.anzeigeFeld).trim()
    const speicherFeld = text(props.speicherFeld).trim()
    const eigene = props.nachschlagSpalten
    const hatEigene = Array.isArray(eigene) && eigene.length > 0

    if (!hatEigene && anzeigeFeld !== '' && anzeigeFeld !== speicherFeld) {
      const anzeigeTitel = text(props.anzeigeTitel)
      const speicherTitel = text(props.speicherTitel)
      props.nachschlagSpalten = [
        { titel: anzeigeTitel !== '' ? anzeigeTitel : 'Angezeigt', feld: anzeigeFeld },
        { titel: speicherTitel !== '' ? speicherTitel : 'Wert', feld: speicherFeld },
      ]
    }
    delete props.anzeigeFeld
    delete props.anzeigeTitel
  }
}

// V-Kennung (2026-09-01): Jede Tabellen-Spalte traegt eine dauerhafte Kennung
// (Spalte.kennung), und alles zeigt auf SIE: Ketten-Parameter (Wert aus
// Erfassungs-/Aenderungs-/Loeschzelle, vorher Platznummer — verrutschte beim
// Loeschen/Verschieben) und die Rechnung (vorher Belegfeld — doppelt vergeben
// traf sie stumm die falsche Spalte, Nutzer-Vorfall 2026-09-01). Laeuft auf
// den Rohdaten VOR normalizeProps und ist absichtlich idempotent: vergebene
// Kennungen bleiben, Ketten-Werte werden nur umgeschrieben, wenn sie noch
// eine Ziffernfolge sind, die Rechnung nur, wo noch `feld` statt `spalte`
// steht.
const ZELLEN_QUELLEN_ROH = new Set(['erfassungszelle', 'aenderungszelle', 'loeschzelle'])

const RECHNUNG_PLAETZE_ROH = ['menge', 'anzahl', 'dosis', 'gewicht', 'bezug', 'tage'] as const

function rohSpalten(node: RohKnoten): Record<string, unknown>[] {
  const roh = rohProps(node).spalten
  if (!Array.isArray(roh)) return []
  return roh.filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
}

function vergebeKennungen(spalten: readonly Record<string, unknown>[]): void {
  const vergeben = new Set<string>()
  let naechste = 1
  for (const eintrag of spalten) {
    const roh = typeof eintrag.kennung === 'string' ? eintrag.kennung.trim() : ''
    if (roh !== '' && !vergeben.has(roh)) {
      vergeben.add(roh)
      continue
    }
    while (vergeben.has(`s${naechste}`)) naechste += 1
    eintrag.kennung = `s${naechste}`
    vergeben.add(eintrag.kennung as string)
  }
}

function kennungAnPlatz(spalten: readonly Record<string, unknown>[], index: number): string {
  const kennung = spalten[index]?.kennung
  return typeof kennung === 'string' ? kennung : ''
}

function schreibeKettenUm(src: Record<string, RohKnoten>, node: RohKnoten): void {
  const events = (node as { events?: unknown }).events
  if (!events || typeof events !== 'object') return
  for (const kette of Object.values(events as Record<string, unknown>)) {
    if (!Array.isArray(kette)) continue
    for (const schritt of kette) {
      if (!schritt || typeof schritt !== 'object') continue
      const s = schritt as { params?: unknown; extraParams?: unknown }
      for (const liste of [s.params, s.extraParams]) {
        if (!Array.isArray(liste)) continue
        for (const bindung of liste) {
          if (!bindung || typeof bindung !== 'object') continue
          const b = bindung as Record<string, unknown>
          if (typeof b.source !== 'string' || !ZELLEN_QUELLEN_ROH.has(b.source)) continue
          if (typeof b.value !== 'string' || !/^\d+$/.test(b.value)) continue
          const ziel = typeof b.blockId === 'string' ? src[b.blockId] : undefined
          if (!ziel) continue
          b.value = kennungAnPlatz(rohSpalten(ziel), Number(b.value))
        }
      }
    }
  }
}

function schreibeRechnungUm(node: RohKnoten, spalten: readonly Record<string, unknown>[]): void {
  const props = rohProps(node)
  if (typeof props.rechnung !== 'string' || props.rechnung.trim() === '') return
  let roh: unknown
  try {
    roh = JSON.parse(props.rechnung)
  } catch {
    return
  }
  if (!roh || typeof roh !== 'object' || Array.isArray(roh)) return
  const r = roh as Record<string, unknown>
  for (const key of RECHNUNG_PLAETZE_ROH) {
    const platz = r[key]
    if (!platz || typeof platz !== 'object') continue
    const p = platz as Record<string, unknown>
    if (typeof p.spalte === 'string' || typeof p.feld !== 'string') continue
    const feld = p.feld.trim()
    p.spalte = feld === ''
      ? ''
      : kennungAnPlatz(spalten, spalten.findIndex((s) => s.feld === feld))
    delete p.feld
  }
  // Der Einheiten-Umrechner ist ausgebaut (2026-09-01) — seine Reste sollen
  // nicht in jedem Export weiterreisen.
  delete r.einheitFeld
  delete r.einheiten
  props.rechnung = JSON.stringify(r)
}

export function migrateSpaltenKennungen(src: Record<string, RohKnoten>): void {
  const tabellen = Object.values(src)
    .filter((n) => n && typeof n === 'object' && n.type === 'tabelle')
  for (const node of tabellen) vergebeKennungen(rohSpalten(node))
  for (const node of Object.values(src)) {
    if (!node || typeof node !== 'object') continue
    schreibeKettenUm(src, node)
  }
  for (const node of tabellen) schreibeRechnungUm(node, rohSpalten(node))
}

// G3 (2026-08-18): Die Erfassungszeile stellt nichts mehr je Zelle ein — was
// eine Zelle tut, leitet sie aus der Bindung der Spalte und der Verknuepfung
// des Bausteins ab. Die vier alten Zellen-Angaben fallen weg; sie muessen AUS
// DEN ROHDATEN raus, sonst vermisst die Verlustpruefung sie beim Laden: sie
// stecken IM Spalten-Eintrag und nicht in einer eigenen Prop, `normalizeProps`
// wirft sie darum nicht weg — `alsSpalte` schon.
export function migrateErfassungsRollenWeg(src: Record<string, RohKnoten>): void {
  for (const node of Object.values(src)) {
    if (!node || typeof node !== 'object' || node.type !== 'tabelle') continue
    if (!node.props || typeof node.props !== 'object') continue
    const spalten = rohProps(node).spalten
    if (!Array.isArray(spalten)) continue
    for (const eintrag of spalten) {
      if (!eintrag || typeof eintrag !== 'object') continue
      const e = eintrag as Record<string, unknown>
      delete e.rolle
      delete e.rollenQuelle
      delete e.erfassung
      delete e.vorbelegung
    }
  }
}
