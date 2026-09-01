import { useState } from 'react'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Wahl, type WahlOption } from '@/ui/werkbank/Wahl'
import { Zahl } from '@/ui/werkbank/Zahl'
import { getBlockDefinition } from '../../core/blocks/blockRegistry'
import { bausteinName } from '../../core/blocks/bausteinName'
import {
  leereRechnung,
  rechnungAlsAttribut,
  rechnungVonAttribut,
  PLATZ_KEYS,
  PLATZ_NAMEN,
  type PlatzKey,
  type Rechnung,
  type RundungsRichtung,
} from '../../core/data/rechnung'
import type { BlockNode } from '../../core/blocks/BlockData'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'

// Die Rechnung gehoert zur Tabelle (Attribut `rechnung`), eingestellt wird
// sie aber HIER: am Spaltenkopf und in der Steuerung ist kein Platz dafuer
// (Nutzer-Ansage 2026-08-31). Der Baustein traegt nur das Ergebnis-JSON.

const RICHTUNGEN: WahlOption[] = [
  { wert: 'auf', name: 'aufrunden' },
  { wert: 'ab', name: 'abrunden' },
  { wert: 'kfm', name: 'kaufmännisch' },
]

// Rechnen kann, was eine Erfassungszeile hat: Listen-Baustein mit
// kannErfassen (Registry-Frage, kein Typ-Name — Regel 2).
function kannRechnen(node: BlockNode): boolean {
  const def = getBlockDefinition(node.type)
  return Boolean(def?.listenBindung && def.kannErfassen)
}

// Die Spalten des Bausteins, so weit dieses Formular sie braucht: Titel als
// Anzeige, die dauerhafte KENNUNG als Griff der Plaetze — nie das Belegfeld,
// das kann doppelt vergeben sein und traf dann stumm die falsche Spalte
// (Nutzer-Vorfall 2026-09-01, zweimal 930_3).
function spaltenVon(node: BlockNode): { titel: string; kennung: string }[] {
  const roh = node.props.spalten
  if (!Array.isArray(roh)) return []
  const raus: { titel: string; kennung: string }[] = []
  for (const eintrag of roh) {
    if (!eintrag || typeof eintrag !== 'object') continue
    const o = eintrag as Record<string, unknown>
    const kennung = typeof o.kennung === 'string' ? o.kennung.trim() : ''
    if (kennung === '') continue
    raus.push({ titel: typeof o.titel === 'string' ? o.titel : '', kennung })
  }
  return raus
}

export function RechnungenBereich() {
  const ed = useEditor()
  const quellen = useDataSources()
  const tabellen = Object.values(ed.tree).filter(kannRechnen)
  const [wahlId, setWahlId] = useState<string | null>(tabellen[0]?.id ?? null)
  const aktiv = tabellen.find((t) => t.id === wahlId) ?? tabellen[0]

  if (!aktiv) {
    return (
      <div className="flex-1 p-4 text-ui text-matt">
        Kein Baustein mit Erfassungszeile in der Maske.
      </div>
    )
  }

  const stand = rechnungVonAttribut(aktiv.props.rechnung) ?? leereRechnung()
  const spalten = spaltenVon(aktiv)
  const spaltenOptionen: WahlOption[] = spalten.map((s) => ({
    wert: s.kennung,
    name: s.titel === '' ? s.kennung : s.titel,
  }))
  const gesetzt = typeof aktiv.props.rechnung === 'string' && aktiv.props.rechnung.trim() !== ''

  const speichere = (neu: Rechnung): void => {
    ed.updateProperty(aktiv.id, 'rechnung', rechnungAlsAttribut(neu))
  }

  const setzePlatz = (key: PlatzKey, teil: Partial<Rechnung[PlatzKey]>): void => {
    speichere({ ...stand, [key]: { ...stand[key], ...teil } })
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
      {tabellen.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="w-28 shrink-0 text-dicht text-matt">Baustein</span>
          <Wahl
            optionen={tabellen.map((t) => ({ wert: t.id, name: bausteinName(t, quellen.list) }))}
            wert={aktiv.id}
            onWaehle={setWahlId}
          />
        </div>
      )}

      <div className="text-dicht text-matt">
        Abgabemenge = Anzahl × Dosis × Tage — gerechnet wird der eine leere
        Platz der Erfassungszeile.
      </div>

      <div className="flex flex-col gap-1.5">
        {PLATZ_KEYS.map((key) => (
          <div key={key} className="grid grid-cols-[110px_minmax(0,1fr)_72px_128px] items-center gap-2">
            <span className="truncate text-dicht text-matt" title={PLATZ_NAMEN[key]}>
              {PLATZ_NAMEN[key]}
            </span>
            <Wahl
              optionen={spaltenOptionen}
              wert={stand[key].spalte}
              leerText="— nicht belegt —"
              onWaehle={(spalte) => setzePlatz(key, { spalte })}
            />
            <Zahl
              einheit="NK"
              title="Nachkommastellen des gerechneten Werts"
              min={0}
              max={6}
              value={stand[key].runden.stellen}
              onChange={(e) => {
                const stellen = Number.parseInt(e.target.value, 10)
                if (Number.isInteger(stellen) && stellen >= 0 && stellen <= 6) {
                  setzePlatz(key, { runden: { ...stand[key].runden, stellen } })
                }
              }}
            />
            <Wahl
              optionen={RICHTUNGEN}
              wert={stand[key].runden.richtung}
              onWaehle={(richtung) => setzePlatz(key, {
                runden: { ...stand[key].runden, richtung: richtung as RundungsRichtung },
              })}
            />
          </div>
        ))}
      </div>

      {gesetzt && (
        <div className="flex justify-end border-t border-linie pt-3">
          <Knopf onClick={() => ed.updateProperty(aktiv.id, 'rechnung', '')}>
            Rechnung entfernen
          </Knopf>
        </div>
      )}
    </div>
  )
}
