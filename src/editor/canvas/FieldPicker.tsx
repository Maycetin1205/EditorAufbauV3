import { useEffect, useState } from 'react'
import { AuswahlFenster } from '@/ui/molecules/auswahl-fenster'
import { cn } from '@/lib/utils'
import { Feld } from '@/ui/werkbank/Feld'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Liste, type ListeGruppe } from '@/ui/werkbank/Liste'
import { Schalter } from '@/ui/werkbank/Schalter'
import { Segment } from '@/ui/werkbank/Segment'
import { Trenner } from '@/ui/werkbank/Trenner'
import { bindungMitQuelle } from '../../core/blocks/BlockDefinition'
import type { DataSourceField } from '../../core/data/dataSources'
import type { Eingabesitzung } from '../inspector/controls/eingabeSitzung'
import { ZuordnungZeilen, type PickerZuordnung } from './ZuordnungZeilen'

export type { PickerZuordnung }

export interface PickerGruppe {
  quelleId: string

  name: string

  kennung?: string

  hinweis?: string
  fields: readonly DataSourceField[]
}

export interface PickerTitel {
  wert: string

  // Worauf ein leer getippter Titel zurueckfaellt: eine namenlose Spalte
  // haette sonst einen leeren Kopf.
  standard: string
  onAendern: (titel: string) => void

  sitzung: Eingabesitzung
}

export interface PickerWahl {
  label: string
  optionen: readonly { wert: string; name: string }[]
  aktuell: string
  onWaehle: (wert: string) => void
}

export interface PickerSchalter {
  key: string
  label: string
  an: boolean
  onSchalte: (an: boolean) => void
}

export interface PickerFeld {
  key: string
  label: string
  hinweis?: string

  aktuell: string

  // Nur Hilfsquellen zur Wahl. Die Hauptquelle steht immer an erster Stelle
  // in `gruppen` und traegt die leere Kennung.
  nurFremdeQuellen?: boolean
  onWaehle: (wert: string) => void
}

interface FieldPickerProps {
  spotLabel: string
  gruppen: readonly PickerGruppe[]

  titel?: PickerTitel

  wahl?: PickerWahl

  // Felder, die zur gewaehlten Darstellung gehoeren (Bild + Name).
  felder?: readonly PickerFeld[]

  schalter?: readonly PickerSchalter[]

  // Felder, die unabhaengig von der Darstellung sind (Fuellfeld). Sie liegen
  // in der zugeklappten Ebene, nicht im Blick.
  weitereFelder?: readonly PickerFeld[]

  zuordnung?: PickerZuordnung

  current?: string

  top: number
  left: number

  onPick: (wert: string) => void
  onClose: () => void
}

const HAUPTFELD = ''

const NICHT_GEBUNDEN = '— nicht gebunden —'

interface Anzeige {
  name: string
  kennung?: string
  leer: boolean
  unbekannt: boolean
}

// Was in einer Feld-Zeile steht. Ein Wert, den keine Gruppe (mehr) kennt,
// faellt rot auf, statt lautlos als „nicht gebunden" zu erscheinen — sonst
// merkt niemand, dass die Quelle das Feld verloren hat.
function anzeigeVon(wert: string, gruppen: readonly PickerGruppe[]): Anzeige {
  if (wert === '') return { name: NICHT_GEBUNDEN, leer: true, unbekannt: false }
  for (const g of gruppen) {
    for (const f of g.fields) {
      if (bindungMitQuelle(g.quelleId, f.code) !== wert) continue
      return { name: f.label, kennung: f.code, leer: false, unbekannt: false }
    }
  }
  return { name: wert, leer: false, unbekannt: true }
}

function listeGruppen(gruppen: readonly PickerGruppe[]): ListeGruppe[] {
  return gruppen.map((g) => ({
    key: g.quelleId === '' ? '__erste__' : g.quelleId,
    name: g.name,
    kennung: g.kennung,
    hinweis: g.hinweis === undefined || g.hinweis === '' ? undefined : `über ${g.hinweis}`,
    eintraege: g.fields.map((f) => ({
      wert: bindungMitQuelle(g.quelleId, f.code),
      name: f.label,
      kennung: f.code,
    })),
  }))
}

interface FeldZeileProps {
  label: string
  hinweis?: string
  anzeige: Anzeige
  aktiv: boolean
  onAktiv: () => void
}

// Jede Feld-Wahl ist eine Zeile, die die EINE Liste unten auf sich zieht —
// kein zweites Fenster im Fenster. Ein Popover im Popover schliesst sonst
// beide, weil das aeussere jeden Zeigerdruck ausserhalb seiner selbst als
// „woanders hin geklickt" liest.
function FeldZeile({ label, hinweis, anzeige, aktiv, onAktiv }: FeldZeileProps) {
  return (
    <button
      type="button"
      aria-pressed={aktiv}
      title={hinweis}
      onClick={onAktiv}
      className={cn(
        'flex h-steuer w-full min-w-0 items-center gap-2 rounded px-1.5 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-akzent',
        aktiv ? 'bg-akzent/15' : 'hover:bg-control',
      )}
    >
      <span className="w-20 shrink-0 truncate text-ui text-matt">{label}</span>
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-ui',
          anzeige.leer && 'text-matt',
          anzeige.unbekannt ? 'text-fehler' : 'text-tinte',
        )}
      >
        {anzeige.name}
      </span>
      {anzeige.kennung !== undefined && anzeige.kennung !== '' && (
        <span className="min-w-0 max-w-[45%] truncate font-mono text-dicht text-matt">
          {anzeige.kennung}
        </span>
      )}
    </button>
  )
}

export function FieldPicker({
  spotLabel,
  gruppen,
  titel,
  wahl,
  felder,
  schalter,
  weitereFelder,
  zuordnung,
  current,
  top,
  left,
  onPick,
  onClose,
}: FieldPickerProps) {
  // Schließt das Fenster ohne blur (Escape, Außenklick), bliebe die offene
  // Tipp-Klammer sonst stehen — und Undo wäre für den Rest der Sitzung stumm.
  const titelSitzung = titel?.sitzung
  const zuordnungSitzung = zuordnung?.sitzung
  useEffect(() => () => {
    titelSitzung?.beenden()
    zuordnungSitzung?.beenden()
  }, [titelSitzung, zuordnungSitzung])

  const [zielKey, setZielKey] = useState(HAUPTFELD)
  const [tutOffen, setTutOffen] = useState(false)

  const ebene2 = weitereFelder ?? []
  const ziele: readonly PickerFeld[] = [
    { key: HAUPTFELD, label: 'Feld', aktuell: current ?? '', onWaehle: onPick },
    ...(felder ?? []),
    ...ebene2,
  ]
  const aktiv = ziele.find((z) => z.key === zielKey) ?? ziele[0]

  const sichtbareGruppen = aktiv.nurFremdeQuellen === true
    ? gruppen.filter((g) => g.quelleId !== '')
    : gruppen

  const hatTut = (schalter?.length ?? 0) > 0 || ebene2.length > 0

  const feldZeile = (ziel: PickerFeld) => (
    <FeldZeile
      key={ziel.key}
      label={ziel.label}
      hinweis={ziel.hinweis}
      anzeige={anzeigeVon(ziel.aktuell, gruppen)}
      aktiv={ziel.key === aktiv.key}
      onAktiv={() => setZielKey(ziel.key)}
    />
  )

  return (
    <AuswahlFenster
      bezeichnung={`Feld für ${spotLabel}`}
      oben={top}
      links={left}
      onClose={onClose}
      imBildHalten
      escapeAbfangen
      className="max-h-[30rem] w-80 border-linie bg-panel p-1.5 text-tinte shadow-overlay"
    >
      <div className="flex flex-col gap-1.5">
        <p className="truncate px-1.5 pt-0.5 text-dicht font-semibold uppercase tracking-wide text-matt">
          {spotLabel}
        </p>

        {titel && (
          <label className="flex h-steuer items-center gap-2 px-1.5">
            <span className="w-20 shrink-0 truncate text-ui text-matt">Titel</span>
            <Feld
              value={titel.wert}
              placeholder={titel.standard}
              onChange={(e) => {
                titel.sitzung.beginnen()
                titel.onAendern(e.currentTarget.value)
              }}
              onBlur={() => {
                titel.sitzung.beenden()
                if (titel.wert.trim() === '') titel.onAendern(titel.standard)
              }}
              className="min-w-0 flex-1"
            />
          </label>
        )}

        {feldZeile(ziele[0])}

        {wahl && (
          <div className="flex items-center gap-2 px-1.5">
            <span className="w-20 shrink-0 truncate text-ui text-matt">{wahl.label}</span>
            <div className="min-w-0 flex-1 overflow-x-auto">
              <Segment
                bezeichnung={wahl.label}
                optionen={wahl.optionen.map((o) => ({ wert: o.wert, name: o.name }))}
                wert={wahl.aktuell}
                onWaehle={wahl.onWaehle}
              />
            </div>
          </div>
        )}

        {(felder ?? []).map(feldZeile)}

        {zuordnung && (
          <div className="flex flex-col gap-1 px-1.5">
            <span className="text-dicht font-semibold uppercase tracking-wide text-matt">
              {zuordnung.label}
            </span>
            <ZuordnungZeilen zuordnung={zuordnung} />
          </div>
        )}

        {hatTut && (
          <>
            <Trenner />
            <Gruppe
              titel="Was die Spalte tut"
              offen={tutOffen}
              onSchalte={(auf) => {
                setTutOffen(auf)
                // Zugeklappt darf die Liste nicht weiter an einem Feld
                // haengen, das niemand mehr sieht.
                if (!auf && ebene2.some((z) => z.key === zielKey)) setZielKey(HAUPTFELD)
              }}
              className="px-1.5"
            >
              {(schalter ?? []).map((s) => (
                <Schalter
                  key={s.key}
                  an={s.an}
                  beschriftung={s.label}
                  onSchalte={s.onSchalte}
                />
              ))}
              {ebene2.map(feldZeile)}
            </Gruppe>
          </>
        )}

        <Trenner />

        <p className="flex items-baseline gap-2 px-1.5 text-dicht font-semibold uppercase tracking-wide text-matt">
          <span className="min-w-0 truncate">{aktiv.label} wählen</span>
          {sichtbareGruppen.length === 1 && (
            <span className="min-w-0 truncate normal-case tracking-normal">
              aus {sichtbareGruppen[0].name}
            </span>
          )}
        </p>

        <Liste
          key={aktiv.key}
          suchbar
          gruppen={listeGruppen(
            sichtbareGruppen.length === 1
              ? [{ ...sichtbareGruppen[0], name: '' }]
              : sichtbareGruppen,
          )}
          wert={aktiv.aktuell}
          leerText={NICHT_GEBUNDEN}
          leerHinweis={
            aktiv.nurFremdeQuellen === true
              ? 'Keine Hilfsquelle am Baustein. Erst im Inspector eine hinzufügen.'
              : undefined
          }
          onWaehle={aktiv.onWaehle}
        />
      </div>
    </AuswahlFenster>
  )
}
