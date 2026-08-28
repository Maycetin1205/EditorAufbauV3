import type { ListeEintrag } from '@/ui/werkbank/Liste'
import {
  ACTION_PARAM_SOURCES,
  type ActionParamBinding,
  type ActionParamSource,
} from '../../../core/data/aktionen'
import {
  BausteinBindung,
  DatenfeldBindung,
  GewaehlteZeileBindung,
  LeerBindung,
  PlatzhalterBindung,
  SchrittErgebnisBindung,
  TextBindung,
  VorigesErgebnisBindung,
  ZellenBindung,
} from './bindungen'
import type { BindungsStart, ParameterWahlen, QuellenEintrag } from './wahlen'

// Steht nur eine Tabelle (ein Baustein) zur Wahl, ist sie gemeint — sonst
// klickt der Bediener eine Liste mit genau einem Eintrag auf.
function einziger(liste: readonly { blockId: string }[]): BindungsStart {
  return liste.length === 1 ? { blockId: liste[0].blockId, value: '' } : { value: '' }
}

// Geschluesselt ueber ALLE gespeicherten Quellen, `aus` eingeschlossen: das
// Record erzwingt einen Eintrag je Quelle. Vorher endete die Zeichnung in
// einem Auffang-Textfeld — eine neue Quelle sah dort aus wie ein Freitext,
// ohne dass irgendwas anschlug.
export const PARAM_QUELLEN: Record<ActionParamSource, QuellenEintrag> = {
  fixed: {
    name: 'Fest',
    Control: TextBindung,
  },
  context: {
    name: 'Ereigniswert',
    Control: PlatzhalterBindung,
    start: () => ({ value: 'VALUE' }),
  },
  data_field: {
    name: 'Datenfeld',
    Control: DatenfeldBindung,
    leer: (w) => w.dataSources.length === 0,
  },
  block_value: {
    name: 'Baustein',
    Control: BausteinBindung,
    leer: (w) => w.blockValues.length === 0,
    start: (w) => (w.blockValues.length === 1
      ? { blockId: w.blockValues[0].blockId, value: w.blockValues[0].prop }
      : { value: '' }),
  },
  gewaehlte_zeile: {
    name: 'Gewählte Zeile',
    Control: GewaehlteZeileBindung,
    leer: (w) => w.geber.length === 0,
    start: (w) => einziger(w.geber),
  },
  erfassungszelle: {
    name: 'Erfassungszelle',
    Control: ZellenBindung,
    leer: (w) => w.erfassungen.length === 0,
    start: (w) => einziger(w.erfassungen),
  },
  aenderungszelle: {
    name: 'Geänderte Zelle',
    Control: ZellenBindung,
    leer: (w) => w.aenderungen.length === 0,
    start: (w) => einziger(w.aenderungen),
  },
  loeschzelle: {
    name: 'Gelöschte Zeile',
    Control: ZellenBindung,
    leer: (w) => w.loeschungen.length === 0,
    start: (w) => einziger(w.loeschungen),
  },
  previous_result: {
    name: 'Vorheriger Schritt',
    Control: VorigesErgebnisBindung,
  },
  step_result: {
    name: 'Ergebnis von Schritt',
    Control: SchrittErgebnisBindung,
    leer: (w) => w.schritte.length === 0,
    start: (w) => ({ value: w.schritte.length === 1 ? w.schritte[0].id : '' }),
  },
  se_variable: {
    name: 'SE VAR-Array',
    Control: TextBindung,
  },
  aus: {
    name: 'Weggelassen',
    Control: LeerBindung,
  },
}

export function neueBindung(
  source: ActionParamSource,
  wahlen: ParameterWahlen,
): ActionParamBinding {
  return { source, ...(PARAM_QUELLEN[source].start?.(wahlen) ?? { value: '' }) }
}

// `aus` steht nicht in der Wahl: weggelassen wird ueber das Kreuz an der
// Zeile. Ist der Parameter schon weggelassen, muss die Quelle trotzdem
// erscheinen, sonst zeigte der Waehler eine rohe Kennung.
export function herkunftsEintraege(
  binding: ActionParamBinding,
  wahlen: ParameterWahlen,
): ListeEintrag[] {
  const eintraege: ListeEintrag[] = ACTION_PARAM_SOURCES.map((source) => ({
    wert: source,
    name: PARAM_QUELLEN[source].name,
    deaktiviert: PARAM_QUELLEN[source].leer?.(wahlen) ?? false,
  }))
  if (binding.source === 'aus') {
    eintraege.push({ wert: 'aus', name: PARAM_QUELLEN.aus.name, deaktiviert: true })
  }
  return eintraege
}
