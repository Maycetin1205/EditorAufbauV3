// Ein Suchfenster aus der Sicht des Editors: woher es seine Angaben nimmt und
// wohin der gezogene Rand sie zurueckschreibt. Eingestellt wird IM Fenster;
// diese Datei ist nur der Weg dorthin.
import { coerceErfassungsSpalten } from '../../blocks/erfassung/erfassungsSpalte'
import { fensterSpaltenIn } from '../../blocks/erfassung/erfassungsZeile'
import {
  FENSTER_HOEHE,
  coerceNachschlagSpalten,
  fensterBreiteFuer,
  oeffneNachschlagen,
} from '../../blocks/tabelle/nachschlagen'
import type { Spalte } from '../../blocks/tabelle/spalten'
import type { BlockNode } from '../../core/blocks/BlockData'
import { zerlegeBindung, type SuchFenster } from '../../core/blocks/BlockDefinition'
import { getBlockDefinition } from '../../core/blocks/blockRegistry'
import type { Editor } from '../../state/Editor'

export interface FensterStand {
  quelleId: string

  // Das Feld, dessen Wert die Maske sich merkt; ohne gestellte Spalten ist es
  // die einzige Spalte des Fensters.
  speicherFeld: string
  speicherTitel: string

  titel: string

  spalten: readonly Spalte[]

  breite: number
  hoehe: number

  setzeMass: (achse: 'breite' | 'hoehe', wert: number | undefined) => void
}

function alsZahl(v: unknown): number | undefined {
  if (typeof v === 'number') return Number.isFinite(v) ? Math.round(v) : undefined
  if (typeof v !== 'string' || v.trim() === '') return undefined
  const zahl = Number(v.trim())
  return Number.isFinite(zahl) ? Math.round(zahl) : undefined
}

function rohEintraege(block: BlockNode, prop: string): Record<string, unknown>[] {
  const roh = block.props[prop]
  if (!Array.isArray(roh)) return []
  // Rohe Kopien: geschrieben wird die ganze Liste zurueck, und alles, was hier
  // nicht vorkommt, muss unangetastet mitfahren.
  return roh.map((x) => (x && typeof x === 'object' ? { ...(x as Record<string, unknown>) } : {}))
}

// Das eine Fenster des Bausteins: seine eigenen Eigenschaften tragen es.
function standAmBaustein(
  ed: Editor,
  block: BlockNode,
  fenster: SuchFenster,
): FensterStand | null {
  const quelleId = String(block.props[fenster.quelleProp ?? ''] ?? '')
  if (quelleId === '') return null
  const standard = getBlockDefinition(block.type)?.defaultProps ?? {}
  const spalten = coerceNachschlagSpalten(block.props[fenster.spaltenKey])
  return {
    quelleId,
    speicherFeld: String(block.props[fenster.speicherFeldProp ?? ''] ?? ''),
    speicherTitel: String(block.props[fenster.speicherTitelProp ?? ''] ?? ''),
    titel: 'Nachschlagen',
    spalten,
    breite: alsZahl(block.props[fenster.breiteKey])
      ?? alsZahl(standard[fenster.breiteKey])
      ?? fensterBreiteFuer(spalten.length),
    hoehe: alsZahl(block.props[fenster.hoeheKey])
      ?? alsZahl(standard[fenster.hoeheKey])
      ?? FENSTER_HOEHE,
    // Ohne Mass gilt am Baustein die Vorgabe seines Typs: eine Eigenschaft dort
    // ist nie leer.
    setzeMass: (achse, wert) => {
      const key = achse === 'breite' ? fenster.breiteKey : fenster.hoeheKey
      ed.updateProperty(block.id, key, wert ?? standard[key])
    },
  }
}

// Ein Fenster je Eintrag mit Hilfsquelle: die Spalten der Erfassung.
function standJeEintrag(
  ed: Editor,
  block: BlockNode,
  fenster: SuchFenster,
  platz: number,
): FensterStand | null {
  const prop = fenster.eintraegeProp
  if (prop === undefined) return null
  const eintrag = rohEintraege(block, prop)[platz]
  if (eintrag === undefined) return null
  const { quelleId, code } = zerlegeBindung(String(eintrag[fenster.quelleKey ?? ''] ?? ''))
  // Nur eine Zelle mit Hilfsquelle schlaegt nach; die anderen haben kein Fenster.
  if (quelleId === '') return null
  // Grundsatz 1: dieselbe Spaltenliste wie beim Bediener, auch die automatische.
  // Sie aus den Nachbarspalten zu bilden kann heute nur die Erfassung selbst;
  // ein Registry-Eintrag dafuer waere die saubere Form, wenn es der zweite
  // Baustein braucht.
  const spalten = fensterSpaltenIn({
    spalten: coerceErfassungsSpalten(block.props[prop]),
    quelleId: String(block.props.source ?? ''),
    paareZu: () => [],
    partnerVon: () => '',
  }, platz)
  const titel = String(eintrag[fenster.titelKey ?? ''] ?? '')
  return {
    quelleId,
    speicherFeld: code,
    speicherTitel: titel,
    titel: titel !== '' ? titel : `Spalte ${platz + 1}`,
    spalten,
    breite: alsZahl(eintrag[fenster.breiteKey]) ?? fensterBreiteFuer(spalten.length),
    hoehe: alsZahl(eintrag[fenster.hoeheKey]) ?? FENSTER_HOEHE,
    setzeMass: (achse, wert) => {
      const next = rohEintraege(block, prop)
      const ziel = next[platz]
      if (!ziel) return
      const key = achse === 'breite' ? fenster.breiteKey : fenster.hoeheKey
      // `undefined` LOESCHT den Schluessel: keine Angabe heisst Automatik, und
      // ein leerer Wert reiste sonst in jede Maskendatei mit.
      if (wert === undefined) delete ziel[key]
      else ziel[key] = wert
      ed.updateProperty(block.id, prop, next)
    },
  }
}

export function fensterStandVon(
  ed: Editor,
  block: BlockNode,
  fenster: SuchFenster,
  platz: number,
): FensterStand | null {
  return fenster.eintraegeProp === undefined
    ? standAmBaustein(ed, block, fenster)
    : standJeEintrag(ed, block, fenster, platz)
}

// Dieselbe Flaeche wie beim Bediener, nur ohne Saetze und mit den zwei
// Zieh-Anfassern: was der Bauer hier zieht, steht danach als Eigenschaft im
// Baum, also nimmt Strg+Z es zurueck.
export function oeffneFensterImEditor(el: HTMLElement, stand: FensterStand): void {
  oeffneNachschlagen({
    el,
    quelleId: stand.quelleId,
    speicherFeld: stand.speicherFeld,
    speicherTitel: stand.speicherTitel,
    spalten: stand.spalten,
    titel: stand.titel,
    breite: stand.breite,
    hoehe: stand.hoehe,
    imEditor: true,
    setzeMass: stand.setzeMass,
    onUebernehmen: () => {},
  })
}
