import { useEffect, useState, type RefObject } from 'react'
import { AuswahlFenster } from '@/ui/molecules/auswahl-fenster'
import { cn } from '@/lib/utils'
import { Marke } from '@/ui/werkbank/Marke'
import { Feld } from '@/ui/werkbank/Feld'
import { Liste, type ListeGruppe } from '@/ui/werkbank/Liste'
import { MenueZeile } from '@/ui/werkbank/MenueZeile'
import { Schalter } from '@/ui/werkbank/Schalter'
import { Trenner } from '@/ui/werkbank/Trenner'
import { bindungMitQuelle } from '../../core/blocks/BlockDefinition'
import type { DataSourceField } from '../../core/data/dataSources'
import type { Eingabesitzung } from '../inspector/controls/eingabeSitzung'


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

export interface PickerSchalter {
  key: string
  label: string

  // Kurzwort und Standard fuer die zugeklappte Kopfzeile.
  kurz?: string
  standard?: boolean
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

  schalter?: readonly PickerSchalter[]

  // Felder, die unabhaengig von der Darstellung sind (Fuellfeld). Sie liegen
  // in der zugeklappten Ebene, nicht im Blick.
  weitereFelder?: readonly PickerFeld[]

  // Erste Stufe: der Baustein hat noch keine Hauptquelle. Dann zeigt das
  // Fenster QUELLEN statt Feldern — sonst steht der Bediener vor allen Feldern
  // aller Quellen der Bibliothek, und ein Klick darin bestimmt nebenbei still
  // die Hauptquelle des Bausteins. Erst waehlen, dann binden.
  quellenWahl?: {
    hinweis: string
    eintraege: readonly { wert: string; name: string; kennung?: string }[]
    onWaehle: (quelleId: string) => void
  }

  current?: string

  // Der Griff, aus dem das Fenster aufgegangen ist. Ein Zeigerdruck DARAUF
  // schliesst nicht — sonst raeumt dieser Druck das Fenster ab und der Klick
  // unmittelbar danach oeffnet es wieder: es liesse sich mit seinem eigenen
  // Griff nicht zumachen.
  anker?: RefObject<HTMLElement | null>

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
    <MenueZeile
      aktiv={aktiv}
      aria-pressed={aktiv}
      title={hinweis}
      onClick={onAktiv}
      className="px-1.5"
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
        <Marke className="max-w-[45%]">{anzeige.kennung}</Marke>
      )}
    </MenueZeile>
  )
}

export function FieldPicker({
  spotLabel,
  gruppen,
  titel,
  schalter,
  weitereFelder,
  quellenWahl,
  current,
  anker,
  top,
  left,
  onPick,
  onClose,
}: FieldPickerProps) {
  // Schließt das Fenster ohne blur (Escape, Außenklick), bliebe die offene
  // Tipp-Klammer sonst stehen — und Undo wäre für den Rest der Sitzung stumm.
  const titelSitzung = titel?.sitzung
  useEffect(() => () => {
    titelSitzung?.beenden()
  }, [titelSitzung])

  const [zielKey, setZielKey] = useState(HAUPTFELD)

  const ebene2 = weitereFelder ?? []

  const ziele: readonly PickerFeld[] = [
    {
      key: HAUPTFELD,
      label: 'Feld',
      aktuell: current ?? '',
      onWaehle: onPick,
    },
    ...ebene2,
  ]
  const aktiv = ziele.find((z) => z.key === zielKey) ?? ziele[0]

  // ALLE Hilfsquellen auf einmal, nach Quelle gruppiert — die Liste kann das
  // und hat eine Suche. Eine Stufe „erst Quelle, dann Feld" war hier kurz
  // eingebaut und ist wieder raus: nach der Wahl einer Quelle sah der Bediener
  // die anderen nicht mehr und hielt sie fuer nicht angeboten
  // (Nutzer-Befund 2026-08-28). Die Stufe bleibt nur dort, wo sie etwas
  // verhindert: solange der Baustein gar keine Hauptquelle hat (quellenWahl).
  const sichtbareGruppen = aktiv.nurFremdeQuellen === true
    ? gruppen.filter((g) => g.quelleId !== '')
    : gruppen

  const hatTut = (schalter?.length ?? 0) > 0


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
      anker={anker}
      onClose={onClose}
      imBildHalten
      escapeAbfangen
      className="max-h-[30rem] w-[380px] border-linie bg-panel p-1.5 text-tinte shadow-overlay"
    >
      <div className="flex flex-col gap-1.5">
        <p className="truncate px-1.5 pt-0.5 text-dicht font-semibold uppercase tracking-wide text-matt">
          {spotLabel}
        </p>

        {quellenWahl ? (
          <>
            <p className="px-1.5 text-ui text-matt">{quellenWahl.hinweis}</p>
            <Trenner />
            <Liste
              suchbar={quellenWahl.eintraege.length > 8}
              gruppen={[{ key: 'quellen', eintraege: quellenWahl.eintraege }]}
              wert=""
              leerHinweis="Keine Datenquelle in der Bibliothek."
              onWaehle={quellenWahl.onWaehle}
            />
          </>
        ) : (
          <>
        {/* Der Titel ist der NAME des Dings, keine Einstellung unter anderen —
            darum steht er oben und nicht als Zeile mittendrin. */}
        {titel && (
          <Feld
            value={titel.wert}
            placeholder={titel.standard}
            aria-label="Spaltenname"
            onChange={(e) => {
              titel.sitzung.beginnen()
              titel.onAendern(e.currentTarget.value)
            }}
            onBlur={() => {
              titel.sitzung.beenden()
              if (titel.wert.trim() === '') titel.onAendern(titel.standard)
            }}
            className="font-medium"
          />
        )}

        {feldZeile(ziele[0])}

        {/* Das Fuellfeld steht OFFEN und gleichrangig neben dem Hauptfeld: es
            ist der halbe Sinn der Spalte, nicht eine seltene Zusatzeinstellung
            (Nutzer-Befund 2026-08-28). Zugeklappt bleibt nur, was man selten
            anfasst. Ohne Hilfsquelle waere es sinnlos — dann erscheint es
            nicht. */}
        {ebene2.map(feldZeile)}

        {/* Zugeklappt heisst nicht versteckt: die Kopfzeile sagt, WAS darin
            vom Standard abweicht. Sonst merkt niemand, dass „In der Zeile
            aenderbar" ueberhaupt existiert — der Schalter steht auf JA, ohne
            dass ihn je jemand angefasst hat, und bei einer gerechneten Spalte
            gehoert er aus. */}
        {/* Die Schalter stehen OFFEN, nebeneinander in einer Zeile
            (Nutzer-Ansage 2026-08-28: „‚Mehr' nicht zuklappen"). Zugeklappt
            merkte niemand, dass es sie gibt — und „In der Zeile aenderbar"
            steht auf JA, ohne dass es je jemand eingestellt hat. Eine Zeile
            kostet weniger als eine Klappe und verbirgt nichts. */}
        {hatTut && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1.5">
            {(schalter ?? []).map((s) => (
              <Schalter
                key={s.key}
                an={s.an}
                beschriftung={s.kurz ?? s.label}
                hinweis={s.label}
                onSchalte={s.onSchalte}
              />
            ))}
          </div>
        )}

        <Trenner />

        <p className="flex items-baseline gap-2 px-1.5 text-dicht font-semibold uppercase tracking-wide text-matt">
          <span className="min-w-0 truncate">
            {aktiv.label} wählen
          </span>
          {sichtbareGruppen.length === 1 && (
            <span className="min-w-0 truncate normal-case tracking-normal">
              aus {sichtbareGruppen[0].name}
            </span>
          )}
        </p>

        {/* Eigener Schluessel-Raum: das Hauptfeld hat den Schluessel '' — als
            Geschwister der FeldZeile mit demselben Schluessel meldete React
            doppelte Schluessel, und die Liste konnte beim Umschalten
            verschwinden. */}
        <Liste
          key={`liste:${aktiv.key}`}
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
              ? 'Keine Hilfsquelle am Baustein.'
              : undefined
          }
          onWaehle={aktiv.onWaehle}
        />
          </>
        )}
      </div>
    </AuswahlFenster>
  )
}
