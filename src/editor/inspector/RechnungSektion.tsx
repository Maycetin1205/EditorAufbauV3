import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Wahl, type WahlOption } from '@/ui/werkbank/Wahl'
import { Zahl } from '@/ui/werkbank/Zahl'
import type { BlockNode } from '../../core/blocks/BlockData'
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
import { useEditor } from '../../state/useEditor'

// Die Rechnung (Abgabemenge = Anzahl x Dosis x Tage) gehoert zur Tabelle,
// deren Erfassungszeile sie rechnet — und wird darum HIER bedient, im
// Inspector dieser Tabelle. Vorher war sie ein eigener Reiter im
// Datencenter, obwohl sie nichts Maskenweites ist (PLAN.md Schritt 3).
// Der Baustein traegt nur das Ergebnis im Attribut `rechnung`.

const RICHTUNGEN: WahlOption[] = [
  { wert: 'auf', name: 'aufrunden' },
  { wert: 'ab', name: 'abrunden' },
  { wert: 'kfm', name: 'kaufmännisch' },
]

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

export function RechnungSektion({ block }: { block: BlockNode }) {
  const ed = useEditor()
  const stand = rechnungVonAttribut(block.props.rechnung) ?? leereRechnung()
  const spaltenOptionen: WahlOption[] = spaltenVon(block).map((s) => ({
    wert: s.kennung,
    name: s.titel === '' ? s.kennung : s.titel,
  }))
  const gesetzt = typeof block.props.rechnung === 'string' && block.props.rechnung.trim() !== ''

  const speichere = (neu: Rechnung): void => {
    ed.updateProperty(block.id, 'rechnung', rechnungAlsAttribut(neu))
  }
  const setzePlatz = (key: PlatzKey, teil: Partial<Rechnung[PlatzKey]>): void => {
    speichere({ ...stand, [key]: { ...stand[key], ...teil } })
  }

  return (
    <Gruppe titel="Rechnung">
      <div className="flex flex-col gap-3">
        <p className="text-dicht text-matt">
          Abgabemenge = Anzahl × Dosis × Tage. Gerechnet wird der eine leere
          Platz der Erfassungszeile.
        </p>

        {PLATZ_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-dicht text-matt">{PLATZ_NAMEN[key]}</span>
            <Wahl
              optionen={spaltenOptionen}
              wert={stand[key].spalte}
              leerText="— nicht belegt —"
              onWaehle={(spalte) => setzePlatz(key, { spalte })}
            />
            <div className="flex items-center gap-1.5">
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
          </div>
        ))}

        {gesetzt && (
          <div className="flex justify-end border-t border-linie pt-2">
            <Knopf onClick={() => ed.updateProperty(block.id, 'rechnung', '')}>
              Rechnung entfernen
            </Knopf>
          </div>
        )}
      </div>
    </Gruppe>
  )
}
