// Berechnungen kompakt im Inspector verwalten und in einem eigenen Fenster bearbeiten.
import { useState } from 'react'
import { Dialog } from '@/ui/werkbank/Dialog'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Segment, type SegmentOption } from '@/ui/werkbank/Segment'
import { Wahl, type WahlOption } from '@/ui/werkbank/Wahl'
import { Zahl } from '@/ui/werkbank/Zahl'
import { X } from '@/ui/zeichen'
import { coerceErfassungsSpalten } from '../../blocks/erfassung/erfassungsSpalte'
import { coerceSpalten, type Spalte } from '../../blocks/tabelle/spalten'
import type { BlockNode } from '../../core/blocks/BlockData'
import { bindungMitQuelle } from '../../core/blocks/bindung'
import {
  formelAlsText,
  neueFormel,
  zahlStreng,
  zahlText,
  STELLEN_MAX,
  type Formel,
  type Glied,
  type Rechenzeichen,
  type RundungsRichtung,
} from '../../core/data/rechnung'
import type { QuelleInReichweite } from '../../core/data/sourceLinks'
import { useEditor } from '../../state/useEditor'
import { useAbschnitt } from './abschnittStand'

const RICHTUNGEN: WahlOption[] = [
  { wert: 'auf', name: 'aufrunden' },
  { wert: 'ab', name: 'abrunden' },
  { wert: 'kfm', name: 'kaufmännisch' },
]

const ZEICHEN: SegmentOption[] = [
  { wert: '+', name: 'plus', zeichen: '+' },
  { wert: '-', name: 'minus', zeichen: '−' },
  { wert: '*', name: 'mal', zeichen: '×' },
  { wert: '/', name: 'geteilt', zeichen: '÷' },
]

const FESTE_ZAHL = '#zahl'
const FELD_PREFIX = '#feld:'

interface BerechnungsEntwurf {
  // null = neue Berechnung; sonst die bisherige Ergebnis-Spalte.
  vorherigesZiel: number | null
  ziel: number
  formel: Formel
}

function spaltenName(spalte: Spalte): string {
  return (spalte.titel === '' ? spalte.kennung : spalte.titel)
    + (spalte.versteckt === true ? ' (ausgeblendet)' : '')
}

function mitFormel(spalte: Spalte, formel: Formel | undefined): Spalte {
  const ohne: Spalte = { ...spalte }
  delete ohne.formel
  return formel === undefined ? ohne : { ...ohne, formel }
}

function kopiereFormel(formel: Formel): Formel {
  return {
    ...formel,
    glieder: formel.glieder.map((glied) => ({ ...glied })),
    zeichen: [...formel.zeichen],
    runden: { ...formel.runden },
  }
}

function feldBindung(quelle: QuelleInReichweite, code: string, istHauptquelle: boolean): string {
  return istHauptquelle ? code : bindungMitQuelle(quelle.source.id, code)
}

function feldOptionen(quellen: readonly QuelleInReichweite[]): WahlOption[] {
  return quellen.flatMap((quelle, quellenIndex) => quelle.source.fields.map((feld) => ({
    wert: `${FELD_PREFIX}${feldBindung(quelle, feld.code, quellenIndex === 0)}`,
    name: `Datenfeld · ${quelle.source.name} · ${feld.label || feld.code}`,
  })))
}

function feldTitel(bindung: string, quellen: readonly QuelleInReichweite[]): string {
  for (let quellenIndex = 0; quellenIndex < quellen.length; quellenIndex++) {
    const quelle = quellen[quellenIndex]
    for (const feld of quelle.source.fields) {
      if (feldBindung(quelle, feld.code, quellenIndex === 0) === bindung) {
        return `${quelle.source.name} · ${feld.label || feld.code}`
      }
    }
  }
  return bindung
}

function formelText(
  formel: Formel,
  spalten: readonly Spalte[],
  quellen: readonly QuelleInReichweite[],
): string {
  return formelAlsText(
    formel,
    (kennung) => {
      const s = spalten.find((spalte) => spalte.kennung === kennung)
      return s === undefined ? kennung : spaltenName(s)
    },
    (bindung) => feldTitel(bindung, quellen),
  )
}

function formelVollstaendig(formel: Formel, zielKennung: string): boolean {
  if (formel.glieder.length === 0) return false
  return formel.glieder.every((glied) => {
    if ('zahl' in glied) return Number.isFinite(glied.zahl)
    if ('feld' in glied) return glied.feld.trim() !== ''
    return glied.spalte.trim() !== '' && glied.spalte !== zielKennung
  })
}

function FesteZahl({ wert, onWert }: { wert: number; onWert: (zahl: number) => void }) {
  const text = zahlText(wert, STELLEN_MAX)
  return (
    <Zahl
      key={text}
      className="w-24"
      title="Feste Zahl"
      defaultValue={text}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
      onBlur={(e) => {
        const zahl = zahlStreng(e.currentTarget.value)
        if (zahl === null) e.currentTarget.value = text
        else if (zahl !== wert) onWert(zahl)
      }}
    />
  )
}

function FormelEditor({
  formel,
  ziel,
  spalten,
  quellen,
  onFormel,
}: {
  formel: Formel
  ziel: number
  spalten: readonly Spalte[]
  quellen: readonly QuelleInReichweite[]
  onFormel: (formel: Formel) => void
}) {
  const andereSpalten: WahlOption[] = spalten
    .filter((s, i) => i !== ziel && s.kennung !== '')
    .map((s) => ({ wert: s.kennung, name: `Spalte · ${spaltenName(s)}` }))
  const optionen: WahlOption[] = [
    ...andereSpalten,
    ...feldOptionen(quellen),
    { wert: FESTE_ZAHL, name: 'Feste Zahl…' },
  ]

  const setzeGlied = (index: number, glied: Glied): void => {
    onFormel({ ...formel, glieder: formel.glieder.map((g, i) => (i === index ? glied : g)) })
  }
  const setzeZeichen = (index: number, zeichen: Rechenzeichen): void => {
    onFormel({ ...formel, zeichen: formel.zeichen.map((z, i) => (i === index ? zeichen : z)) })
  }
  const gliedWeg = (index: number): void => {
    if (formel.glieder.length <= 1) return
    onFormel({
      ...formel,
      glieder: formel.glieder.filter((_, i) => i !== index),
      zeichen: formel.zeichen.filter((_, i) => i !== Math.max(0, index - 1)),
    })
  }
  const gliedDazu = (): void => {
    onFormel({
      ...formel,
      glieder: [...formel.glieder, { spalte: '' }],
      zeichen: [...formel.zeichen, '*'],
    })
  }
  const gliedWert = (glied: Glied): string => {
    if ('zahl' in glied) return FESTE_ZAHL
    if ('feld' in glied) return `${FELD_PREFIX}${glied.feld}`
    return glied.spalte
  }
  const gliedAusWert = (wert: string): Glied => {
    if (wert === FESTE_ZAHL) return { zahl: 1 }
    if (wert.startsWith(FELD_PREFIX)) return { feld: wert.slice(FELD_PREFIX.length) }
    return { spalte: wert }
  }

  return (
    <div className="flex flex-col gap-2">
      {formel.glieder.map((glied, index) => (
        <div key={index} className="flex min-w-0 items-center gap-2">
          <div className="w-[118px] shrink-0">
            {index === 0 ? (
              <div className="flex h-steuer items-center justify-center rounded border border-linie bg-control text-ui font-medium text-matt">
                Startwert
              </div>
            ) : (
              <Segment
                bezeichnung={`Rechenzeichen vor Wert ${index + 1}`}
                optionen={ZEICHEN}
                wert={formel.zeichen[index - 1] ?? '*'}
                onWaehle={(wert) => setzeZeichen(index - 1, wert as Rechenzeichen)}
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Wahl
              optionen={optionen}
              wert={gliedWert(glied)}
              leerText="Wert auswählen…"
              aria-label={`Wert ${index + 1}`}
              onWaehle={(wert) => setzeGlied(index, gliedAusWert(wert))}
            />
          </div>
          {'zahl' in glied && (
            <FesteZahl wert={glied.zahl} onWert={(zahl) => setzeGlied(index, { zahl })} />
          )}
          <Knopf
            nurZeichen
            aria-label={`Wert ${index + 1} entfernen`}
            title="Wert entfernen"
            disabled={formel.glieder.length <= 1}
            onClick={() => gliedWeg(index)}
          >
            <X className="size-3.5" />
          </Knopf>
        </div>
      ))}

      <div>
        <Knopf onClick={gliedDazu}>+ Wert</Knopf>
      </div>
    </div>
  )
}

function BerechnungsDialog({
  entwurf,
  spalten,
  quellen,
  onEntwurf,
  onSpeichern,
  onClose,
}: {
  entwurf: BerechnungsEntwurf
  spalten: readonly Spalte[]
  quellen: readonly QuelleInReichweite[]
  onEntwurf: (entwurf: BerechnungsEntwurf) => void
  onSpeichern: () => void
  onClose: () => void
}) {
  const zielOptionen: WahlOption[] = spalten
    .map((spalte, index) => ({ spalte, index }))
    .filter(({ spalte, index }) => (
      spalte.kennung !== ''
      && (spalte.formel === undefined || index === entwurf.vorherigesZiel)
    ))
    .map(({ spalte, index }) => ({ wert: String(index), name: spaltenName(spalte) }))
  const zielSpalte = spalten[entwurf.ziel]
  const gueltig = zielSpalte !== undefined
    && formelVollstaendig(entwurf.formel, zielSpalte.kennung)

  return (
    <Dialog
      titel={entwurf.vorherigesZiel === null ? 'Berechnung anlegen' : 'Berechnung bearbeiten'}
      schmal
      escapeAbfangen
      onClose={onClose}
      fuss={(
        <>
          <Knopf onClick={onClose}>Abbrechen</Knopf>
          <Knopf art="primaer" disabled={!gueltig} onClick={onSpeichern}>Speichern</Knopf>
        </>
      )}
    >
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-2">
          <div>
            <div className="text-ui font-semibold text-tinte">1. Ergebnis</div>
            <p className="mt-0.5 text-dicht text-matt">
              Diese Spalte erhält den berechneten Wert.
            </p>
          </div>
          <Wahl
            optionen={zielOptionen}
            wert={entwurf.ziel < 0 ? '' : String(entwurf.ziel)}
            leerText="Ergebnis-Spalte auswählen…"
            aria-label="Ergebnis-Spalte"
            onWaehle={(wert) => onEntwurf({ ...entwurf, ziel: Number(wert) })}
          />
        </section>

        <section className="flex flex-col gap-2 border-t border-linie pt-4">
          <div>
            <div className="text-ui font-semibold text-tinte">2. Formel</div>
            <p className="mt-0.5 text-dicht text-matt">
              Jeder Wert kann aus einer Spalte, einem Datenfeld oder einer festen Zahl kommen.
            </p>
          </div>
          <FormelEditor
            formel={entwurf.formel}
            ziel={entwurf.ziel}
            spalten={spalten}
            quellen={quellen}
            onFormel={(formel) => onEntwurf({ ...entwurf, formel })}
          />
          <p className="text-dicht text-matt">
            Datenfelder lesen den Wert aus dem in dieser Zeile gewählten oder verknüpften Datensatz.
          </p>
        </section>

        <section className="flex flex-col gap-2 border-t border-linie pt-4">
          <div>
            <div className="text-ui font-semibold text-tinte">3. Rundung</div>
          </div>
          <div className="flex items-center gap-2">
            <Zahl
              einheit="NK"
              title="Nachkommastellen des berechneten Werts"
              className="w-20"
              min={0}
              max={STELLEN_MAX}
              value={entwurf.formel.runden.stellen}
              onChange={(e) => {
                const stellen = Number.parseInt(e.target.value, 10)
                if (Number.isInteger(stellen) && stellen >= 0 && stellen <= STELLEN_MAX) {
                  onEntwurf({
                    ...entwurf,
                    formel: {
                      ...entwurf.formel,
                      runden: { ...entwurf.formel.runden, stellen },
                    },
                  })
                }
              }}
            />
            <Wahl
              optionen={RICHTUNGEN}
              wert={entwurf.formel.runden.richtung}
              aria-label="Rundungsart"
              onWaehle={(richtung) => onEntwurf({
                ...entwurf,
                formel: {
                  ...entwurf.formel,
                  runden: {
                    ...entwurf.formel.runden,
                    richtung: richtung as RundungsRichtung,
                  },
                },
              })}
            />
          </div>
        </section>
      </div>
    </Dialog>
  )
}

export function RechnungSektion({ block }: { block: BlockNode }) {
  const [offen, schalte] = useAbschnitt('rechnung')
  const [entwurf, setEntwurf] = useState<BerechnungsEntwurf | null>(null)
  const ed = useEditor()
  const quellen = ed.quellenFor(block.id)
  const spalten = block.type === 'erfassung'
    ? coerceErfassungsSpalten(block.props.spalten)
    : coerceSpalten(block.props.spalten)

  const mitFormeln = spalten
    .map((spalte, index) => ({ spalte, index }))
    .filter(({ spalte }) => spalte.formel !== undefined)
  const hatFreiesZiel = spalten.some((spalte) => spalte.kennung !== '' && spalte.formel === undefined)

  const starteNeu = (): void => {
    setEntwurf({ vorherigesZiel: null, ziel: -1, formel: neueFormel() })
  }
  const bearbeite = (index: number): void => {
    const formel = spalten[index]?.formel
    if (formel === undefined) return
    setEntwurf({ vorherigesZiel: index, ziel: index, formel: kopiereFormel(formel) })
  }
  const entferne = (index: number): void => {
    ed.updateProperty(
      block.id,
      'spalten',
      spalten.map((spalte, i) => (i === index ? mitFormel(spalte, undefined) : spalte)),
    )
  }
  const speichere = (): void => {
    if (entwurf === null || !spalten[entwurf.ziel]) return
    const vorheriges = entwurf.vorherigesZiel
    ed.updateProperty(
      block.id,
      'spalten',
      spalten.map((spalte, index) => {
        if (index === entwurf.ziel) return mitFormel(spalte, entwurf.formel)
        if (vorheriges !== null && index === vorheriges) return mitFormel(spalte, undefined)
        return spalte
      }),
    )
    setEntwurf(null)
  }

  return (
    <>
      <Gruppe titel="Berechnungen" offen={offen} onSchalte={schalte}>
        <div className="flex flex-col gap-2">
          {mitFormeln.length === 0 ? (
            <p className="text-dicht text-matt">
              Noch keine Berechnung. Eine Berechnung schreibt ihr Ergebnis in eine Spalte.
            </p>
          ) : (
            mitFormeln.map(({ spalte, index }) => {
              const formel = spalte.formel as Formel
              const text = formelText(formel, spalten, quellen)
              return (
                <div key={spalte.kennung} className="flex items-center gap-2 rounded border border-linie p-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-ui font-medium text-tinte">
                      → {spaltenName(spalte)}
                    </div>
                    <div className="mt-0.5 truncate text-dicht text-matt" title={text}>
                      {text}
                    </div>
                  </div>
                  <Knopf onClick={() => bearbeite(index)}>Bearbeiten</Knopf>
                  <Knopf
                    nurZeichen
                    art="gefahr"
                    aria-label={`Berechnung für ${spaltenName(spalte)} entfernen`}
                    title="Berechnung entfernen"
                    onClick={() => entferne(index)}
                  >
                    <X className="size-3.5" />
                  </Knopf>
                </div>
              )
            })
          )}

          {hatFreiesZiel && (
            <Knopf art="primaer" className="self-start" onClick={starteNeu}>
              + Berechnung
            </Knopf>
          )}
        </div>
      </Gruppe>

      {entwurf !== null && (
        <BerechnungsDialog
          entwurf={entwurf}
          spalten={spalten}
          quellen={quellen}
          onEntwurf={setEntwurf}
          onSpeichern={speichere}
          onClose={() => setEntwurf(null)}
        />
      )}
    </>
  )
}
