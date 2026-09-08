// Die Rechnung der Erfassungszeile einstellen: welche Spalte welchen Platz traegt.
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
import { useAbschnitt } from './abschnittStand'

// Sie gehoert zur Erfassung, deren Zeile sie rechnet, und wird darum hier
// bedient und nicht im Datencenter: sie ist nichts Maskenweites.

const RICHTUNGEN: WahlOption[] = [
  { wert: 'auf', name: 'aufrunden' },
  { wert: 'ab', name: 'abrunden' },
  { wert: 'kfm', name: 'kaufmännisch' },
]

// Titel als Anzeige, die dauerhafte KENNUNG als Griff der Plaetze — nie das
// Belegfeld, das kann doppelt vergeben sein.
function spaltenVon(node: BlockNode): { titel: string; kennung: string; versteckt: boolean }[] {
  const roh = node.props.spalten
  if (!Array.isArray(roh)) return []
  const raus: { titel: string; kennung: string; versteckt: boolean }[] = []
  for (const eintrag of roh) {
    if (!eintrag || typeof eintrag !== 'object') continue
    const o = eintrag as Record<string, unknown>
    const kennung = typeof o.kennung === 'string' ? o.kennung.trim() : ''
    if (kennung === '') continue
    raus.push({
      titel: typeof o.titel === 'string' ? o.titel : '',
      kennung,
      versteckt: o.versteckt === true,
    })
  }
  return raus
}

export function RechnungSektion({ block }: { block: BlockNode }) {
  const [offen, schalte] = useAbschnitt('rechnung')
  const ed = useEditor()
  const stand = rechnungVonAttribut(block.props.rechnung) ?? leereRechnung()
  // Eine ausgeblendete Spalte steht dabei, aber gekennzeichnet: die Rechnung
  // rechnet in sie hinein, tippen kann der Bediener sie nicht.
  const spaltenOptionen: WahlOption[] = spaltenVon(block).map((s) => ({
    wert: s.kennung,
    name: (s.titel === '' ? s.kennung : s.titel) + (s.versteckt ? ' (ausgeblendet)' : ''),
  }))
  const gesetzt = typeof block.props.rechnung === 'string' && block.props.rechnung.trim() !== ''

  // Eine ausgeblendete Spalte kann der Bediener nie tippen, sie kann also nur der
  // GERECHNETE Platz sein. Sitzen zwei Plaetze auf ausgeblendeten Spalten, hat die
  // Gleichung zwei Luecken und die Rechnung rechnet nie — das fiele sonst erst in
  // SoftEngine auf, an einer Zelle, die leer bleibt.
  const versteckteKennungen = new Set(
    spaltenVon(block).filter((sp) => sp.versteckt).map((sp) => sp.kennung),
  )
  const blockiert = PLATZ_KEYS
    .filter((key) => versteckteKennungen.has(stand[key].spalte))
    .map((key) => PLATZ_NAMEN[key])

  const speichere = (neu: Rechnung): void => {
    ed.updateProperty(block.id, 'rechnung', rechnungAlsAttribut(neu))
  }
  const setzePlatz = (key: PlatzKey, teil: Partial<Rechnung[PlatzKey]>): void => {
    speichere({ ...stand, [key]: { ...stand[key], ...teil } })
  }

  return (
    <Gruppe titel="Rechnung" offen={offen} onSchalte={schalte}>
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
              leerText="Keine"
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

        {blockiert.length > 1 && (
          <p className="text-dicht text-fehler">
            {blockiert.join(' und ')} liegen beide auf ausgeblendeten Spalten.
            In die kann niemand tippen, und gerechnet wird nur eine — die
            Rechnung bleibt leer. Eine der beiden muss sichtbar sein.
          </p>
        )}

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
