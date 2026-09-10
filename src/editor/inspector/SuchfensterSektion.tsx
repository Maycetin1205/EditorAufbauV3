// Das Suchfenster einstellen: welche Spalten es zeigt und wie gross es aufgeht.
import { Feld } from '@/ui/werkbank/Feld'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Wahl, type WahlOption } from '@/ui/werkbank/Wahl'
import { Zahl } from '@/ui/werkbank/Zahl'
import { X } from '@/ui/zeichen'
import {
  coerceNachschlagSpalten,
  FENSTER_HOEHE,
  fensterBreiteFuer,
} from '../../blocks/tabelle/nachschlagen'
import { neueSpalte, type Spalte } from '../../blocks/tabelle/spalten'
import type { BlockNode } from '../../core/blocks/BlockData'
import { zerlegeBindung, type SuchFenster } from '../../core/blocks/BlockDefinition'
import { getBlockDefinition } from '../../core/blocks/blockRegistry'
import { quellenKennung, type DataSource } from '../../core/data/dataSources'
import type { Editor } from '../../state/Editor'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { useAbschnitt } from './abschnittStand'
import { useEingabeSitzung } from './controls/eingabeSitzung'

// Ein Fenster dieses Bausteins: das eine am Baustein oder eines je Eintrag.
interface FensterStand {
  id: string

  titel: string

  quelle: DataSource | undefined

  // Gestellte Spalten; leer heisst Automatik.
  spalten: readonly Spalte[]

  breite: number | undefined
  hoehe: number | undefined

  // Was ohne eigenes Mass gilt; es steht als Platzhalter im Feld.
  automatikMass: { breite: number; hoehe: number }

  setzeSpalten: (spalten: readonly Spalte[]) => void

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
  // Rohe Kopien: geschrieben wird die ganze Liste zurueck, und alles, was diese
  // Sektion nicht kennt, muss unangetastet mitfahren.
  return roh.map((x) => (x && typeof x === 'object' ? { ...(x as Record<string, unknown>) } : {}))
}

// Das eine Fenster des Bausteins: seine eigenen Eigenschaften tragen es.
function standAmBaustein(
  ed: Editor,
  block: BlockNode,
  fenster: SuchFenster,
  bibliothek: readonly DataSource[],
): FensterStand {
  const quelleId = String(block.props[fenster.quelleProp ?? ''] ?? '')
  const standard = getBlockDefinition(block.type)?.defaultProps ?? {}
  const spalten = coerceNachschlagSpalten(block.props[fenster.spaltenKey])
  const schreibe = (key: string, wert: unknown): void => {
    ed.updateProperty(block.id, key, wert)
  }
  return {
    id: block.id,
    titel: 'Nachschlagen',
    quelle: bibliothek.find((s) => s.id === quelleId),
    spalten,
    breite: alsZahl(block.props[fenster.breiteKey]),
    hoehe: alsZahl(block.props[fenster.hoeheKey]),
    automatikMass: {
      breite: alsZahl(standard[fenster.breiteKey]) ?? fensterBreiteFuer(spalten.length),
      hoehe: alsZahl(standard[fenster.hoeheKey]) ?? FENSTER_HOEHE,
    },
    setzeSpalten: (neu) => schreibe(fenster.spaltenKey, [...neu]),
    // Ohne Mass gilt am Baustein die Vorgabe seines Typs: eine Eigenschaft dort
    // ist nie leer.
    setzeMass: (achse, wert) => {
      const key = achse === 'breite' ? fenster.breiteKey : fenster.hoeheKey
      schreibe(key, wert ?? standard[key])
    },
  }
}

// Ein Fenster je Eintrag mit Hilfsquelle: die Spalten der Erfassung.
function staendeJeEintrag(
  ed: Editor,
  block: BlockNode,
  fenster: SuchFenster,
  bibliothek: readonly DataSource[],
): FensterStand[] {
  const prop = fenster.eintraegeProp
  if (prop === undefined) return []
  const schreibeEintrag = (index: number, teil: Record<string, unknown>): void => {
    const next = rohEintraege(block, prop)
    const ziel = next[index]
    if (!ziel) return
    for (const [key, wert] of Object.entries(teil)) {
      // `undefined` LOESCHT den Schluessel: keine Angabe heisst Automatik, und
      // ein leerer Wert reiste sonst in jede Maskendatei mit.
      if (wert === undefined) delete ziel[key]
      else ziel[key] = wert
    }
    ed.updateProperty(block.id, prop, next)
  }

  const staende: FensterStand[] = []
  rohEintraege(block, prop).forEach((eintrag, index) => {
    const quelleId = zerlegeBindung(String(eintrag[fenster.quelleKey ?? ''] ?? '')).quelleId
    // Nur eine Zelle mit Hilfsquelle schlaegt nach; die anderen haben kein Fenster.
    if (quelleId === '') return
    const spalten = coerceNachschlagSpalten(eintrag[fenster.spaltenKey])
    const titel = String(eintrag[fenster.titelKey ?? ''] ?? '')
    staende.push({
      id: `${index}`,
      titel: titel !== '' ? titel : `Spalte ${index + 1}`,
      quelle: bibliothek.find((s) => s.id === quelleId),
      spalten,
      breite: alsZahl(eintrag[fenster.breiteKey]),
      hoehe: alsZahl(eintrag[fenster.hoeheKey]),
      automatikMass: {
        breite: fensterBreiteFuer(spalten.length),
        hoehe: FENSTER_HOEHE,
      },
      setzeSpalten: (neu) => schreibeEintrag(index, {
        [fenster.spaltenKey]: neu.length === 0 ? undefined : [...neu],
      }),
      setzeMass: (achse, wert) => schreibeEintrag(index, {
        [achse === 'breite' ? fenster.breiteKey : fenster.hoeheKey]: wert,
      }),
    })
  })
  return staende
}

function MassFeld({ wert, automatik, name, onWert }: {
  wert: number | undefined
  automatik: number
  name: string
  onWert: (wert: number | undefined) => void
}) {
  const aussen = wert === undefined ? '' : String(wert)
  return (
    <Zahl
      key={aussen}
      einheit="px"
      className="w-20"
      aria-label={name}
      title={`${name} des Fensters, leer = ${automatik} px`}
      placeholder={String(automatik)}
      defaultValue={aussen}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
      onBlur={(e) => {
        const roh = e.currentTarget.value.trim()
        const zahl = alsZahl(roh)
        if (roh === '') onWert(undefined)
        else if (zahl !== undefined && zahl !== wert) onWert(zahl)
        else e.currentTarget.value = aussen
      }}
    />
  )
}

function SpaltenZeile({ spalte, felder, onFeld, onTitel, onWeg, sitzung }: {
  spalte: Spalte
  felder: readonly WahlOption[]
  onFeld: (feld: string, klarname: string) => void
  onTitel: (titel: string) => void
  onWeg: () => void
  sitzung: { beginnen: () => void; beenden: () => void }
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Wahl
        optionen={felder}
        wert={spalte.feld}
        leerText="Feld wählen"
        onWaehle={(feld) => onFeld(
          feld,
          felder.find((f) => f.wert === feld)?.name ?? feld,
        )}
      />
      <Feld
        className="w-24 shrink-0"
        aria-label="Spaltentitel"
        title="Titel dieser Spalte im Fenster"
        value={spalte.titel}
        onChange={(e) => {
          sitzung.beginnen()
          onTitel(e.currentTarget.value)
        }}
        onBlur={sitzung.beenden}
      />
      <Knopf nurZeichen aria-label="Spalte entfernen" onClick={onWeg}>
        <X className="size-3.5" />
      </Knopf>
    </div>
  )
}

function FensterKarte({ stand, automatik }: { stand: FensterStand; automatik: string }) {
  const ed = useEditor()
  const sitzung = useEingabeSitzung(
    () => ed.beginTransaction(),
    () => ed.endTransaction(),
  )
  const felder: WahlOption[] = (stand.quelle?.fields ?? []).map((f) => ({
    wert: f.code,
    name: f.label,
    kennung: f.code,
  }))
  const aendere = (index: number, teil: Partial<Spalte>): void => {
    stand.setzeSpalten(stand.spalten.map((s, i) => (i === index ? { ...s, ...teil } : s)))
  }

  return (
    <div className="flex flex-col gap-1.5 rounded border border-linie p-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate text-ui font-medium text-tinte">{stand.titel}</span>
        <span className="shrink-0 text-dicht text-matt">
          {stand.quelle === undefined
            ? 'Quelle fehlt'
            : `${stand.quelle.name} — ${quellenKennung(stand.quelle)}`}
        </span>
      </div>

      {stand.spalten.length === 0
        ? <p className="text-dicht text-matt">{automatik}</p>
        : stand.spalten.map((spalte, i) => (
          <SpaltenZeile
            key={i}
            spalte={spalte}
            felder={felder}
            sitzung={sitzung}
            onFeld={(feld, klarname) => aendere(i, { feld, titel: klarname })}
            onTitel={(titel) => aendere(i, { titel })}
            onWeg={() => stand.setzeSpalten(stand.spalten.filter((_, k) => k !== i))}
          />
        ))}

      <div className="flex flex-wrap items-center gap-1.5">
        <Knopf
          disabled={stand.quelle === undefined}
          title={stand.quelle === undefined ? 'Erst eine Quelle wählen.' : undefined}
          onClick={() => stand.setzeSpalten([...stand.spalten, neueSpalte(stand.spalten.length)])}
        >
          + Spalte
        </Knopf>
        <span className="ml-auto text-dicht text-matt">Fenster</span>
        <MassFeld
          wert={stand.breite}
          automatik={stand.automatikMass.breite}
          name="Breite"
          onWert={(wert) => stand.setzeMass('breite', wert)}
        />
        <MassFeld
          wert={stand.hoehe}
          automatik={stand.automatikMass.hoehe}
          name="Höhe"
          onWert={(wert) => stand.setzeMass('hoehe', wert)}
        />
      </div>
    </div>
  )
}

export function SuchfensterSektion({ block, fenster }: {
  block: BlockNode
  fenster: SuchFenster
}) {
  const [offen, schalte] = useAbschnitt('suchfenster')
  const ed = useEditor()
  const bibliothek = useDataSources().list

  const staende = fenster.eintraegeProp === undefined
    ? [standAmBaustein(ed, block, fenster, bibliothek)]
    : staendeJeEintrag(ed, block, fenster, bibliothek)

  // Keine Stelle, die nachschlaegt: dann gibt es auch nichts einzustellen.
  if (staende.length === 0) return null

  return (
    <Gruppe titel="Suchfenster" offen={offen} onSchalte={schalte}>
      <div className="flex flex-col gap-3">
        {staende.map((stand) => (
          <FensterKarte key={stand.id} stand={stand} automatik={fenster.automatik} />
        ))}
      </div>
    </Gruppe>
  )
}
