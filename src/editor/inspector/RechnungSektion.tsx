// Die Formeln der Erfassung einstellen: welche Spalte sich woraus rechnet.
import { useState } from 'react'
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

// Sie gehoert zur Erfassung, deren Zeile sie rechnet, und wird darum hier
// bedient und nicht im Datencenter: sie ist nichts Maskenweites.

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

function spaltenName(spalte: Spalte): string {
  return (spalte.titel === '' ? spalte.kennung : spalte.titel)
    + (spalte.versteckt === true ? ' (ausgeblendet)' : '')
}

function mitFormel(spalte: Spalte, formel: Formel | undefined): Spalte {
  const ohne: Spalte = { ...spalte }
  delete ohne.formel
  return formel === undefined ? ohne : { ...ohne, formel }
}

function feldBindung(quelle: QuelleInReichweite, code: string): string {
  return quelle.eigene ? code : bindungMitQuelle(quelle.source.id, code)
}

function feldOptionen(quellen: readonly QuelleInReichweite[]): WahlOption[] {
  return quellen.flatMap((quelle) => quelle.source.fields.map((feld) => ({
    wert: `${FELD_PREFIX}${feldBindung(quelle, feld.code)}`,
    name: `Daten · ${quelle.source.name} · ${feld.label || feld.code}`,
  })))
}

function feldTitel(
  bindung: string,
  quellen: readonly QuelleInReichweite[],
): string {
  for (const quelle of quellen) {
    for (const feld of quelle.source.fields) {
      if (feldBindung(quelle, feld.code) === bindung) {
        return `${quelle.source.name} · ${feld.label || feld.code}`
      }
    }
  }
  return ''
}

function FesteZahl({ wert, onWert }: { wert: number; onWert: (zahl: number) => void }) {
  const text = zahlText(wert, STELLEN_MAX)
  return (
    <Zahl
      key={text}
      className="w-20"
      title="Feste Zahl, deutsch geschrieben"
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

function FormelZeilen({ spalten, quellen, index, onFormel }: {
  spalten: readonly Spalte[]
  quellen: readonly QuelleInReichweite[]
  index: number
  onFormel: (formel: Formel | undefined) => void
}) {
  const spalte = spalten[index]
  const formel = spalte.formel
  if (formel === undefined) return null

  const andere: WahlOption[] = spalten
    .filter((s, i) => i !== index && s.kennung !== '')
    .map((s) => ({ wert: s.kennung, name: `Spalte · ${spaltenName(s)}` }))
  const optionen: WahlOption[] = [
    ...andere,
    ...feldOptionen(quellen),
    { wert: FESTE_ZAHL, name: 'Zahl…' },
  ]

  const titelVon = (kennung: string): string => {
    const s = spalten.find((sp) => sp.kennung === kennung)
    return s === undefined ? '' : (s.titel === '' ? s.kennung : s.titel)
  }
  const feldTitelVon = (bindung: string): string => feldTitel(bindung, quellen)
  const formelText = formelAlsText(formel, titelVon, feldTitelVon)

  const setzeGlied = (i: number, glied: Glied): void => {
    onFormel({ ...formel, glieder: formel.glieder.map((g, k) => (k === i ? glied : g)) })
  }
  const setzeZeichen = (i: number, zeichen: Rechenzeichen): void => {
    onFormel({ ...formel, zeichen: formel.zeichen.map((z, k) => (k === i ? zeichen : z)) })
  }
  const gliedWeg = (i: number): void => {
    if (formel.glieder.length <= 1) return
    onFormel({
      ...formel,
      glieder: formel.glieder.filter((_, k) => k !== i),
      zeichen: formel.zeichen.filter((_, k) => k !== Math.max(0, i - 1)),
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
    <div className="flex flex-col gap-1.5 rounded border border-linie p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-ui" title={formelText}>
          <span className="font-medium">{spaltenName(spalte)}</span>
          {' = '}
          {formelText}
        </span>
        <Knopf nurZeichen aria-label="Rechnung entfernen" onClick={() => onFormel(undefined)}>
          <X className="size-3.5" />
        </Knopf>
      </div>

      {formel.glieder.map((glied, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i === 0
            ? <span className="w-steuer shrink-0 text-center text-ui text-matt">=</span>
            : (
              <Segment
                bezeichnung="Rechenzeichen"
                optionen={ZEICHEN}
                wert={formel.zeichen[i - 1] ?? '*'}
                onWaehle={(z) => setzeZeichen(i - 1, z as Rechenzeichen)}
              />
            )}
          <Wahl
            optionen={optionen}
            wert={gliedWert(glied)}
            leerText="Wert wählen"
            onWaehle={(wert) => setzeGlied(i, gliedAusWert(wert))}
          />
          {'zahl' in glied && (
            <FesteZahl wert={glied.zahl} onWert={(zahl) => setzeGlied(i, { zahl })} />
          )}
          <Knopf
            nurZeichen
            aria-label="Glied entfernen"
            disabled={formel.glieder.length <= 1}
            onClick={() => gliedWeg(i)}
          >
            <X className="size-3.5" />
          </Knopf>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-1.5">
        <Knopf onClick={gliedDazu}>+ Glied</Knopf>
        <span className="ml-auto text-dicht text-matt">runden</span>
        <Zahl
          einheit="NK"
          title="Nachkommastellen des gerechneten Werts"
          className="w-16"
          min={0}
          max={STELLEN_MAX}
          value={formel.runden.stellen}
          onChange={(e) => {
            const stellen = Number.parseInt(e.target.value, 10)
            if (Number.isInteger(stellen) && stellen >= 0 && stellen <= STELLEN_MAX) {
              onFormel({ ...formel, runden: { ...formel.runden, stellen } })
            }
          }}
        />
        <Wahl
          className="w-auto"
          optionen={RICHTUNGEN}
          wert={formel.runden.richtung}
          onWaehle={(richtung) => onFormel({
            ...formel,
            runden: { ...formel.runden, richtung: richtung as RundungsRichtung },
          })}
        />
      </div>
    </div>
  )
}

export function RechnungSektion({ block }: { block: BlockNode }) {
  const [offen, schalte] = useAbschnitt('rechnung')
  const [neuOffen, setNeuOffen] = useState(false)
  const ed = useEditor()
  const quellen = ed.quellenFor(block.id)
  const spalten = block.type === 'erfassung'
    ? coerceErfassungsSpalten(block.props.spalten)
    : coerceSpalten(block.props.spalten)

  const setzeFormel = (index: number, formel: Formel | undefined): void => {
    ed.updateProperty(
      block.id,
      'spalten',
      spalten.map((s, i) => (i === index ? mitFormel(s, formel) : s)),
    )
  }

  const mitFormeln = spalten.map((_, i) => i).filter((i) => spalten[i].formel !== undefined)
  const ohneFormel: WahlOption[] = spalten
    .map((s, i) => ({ spalte: s, index: i }))
    .filter(({ spalte }) => spalte.formel === undefined && spalte.kennung !== '')
    .map(({ spalte, index }) => ({ wert: String(index), name: spaltenName(spalte) }))

  return (
    <Gruppe titel="Rechnung" offen={offen} onSchalte={schalte}>
      <div className="flex flex-col gap-3">
        <p className="text-dicht text-matt">
          Ergebnis-Spalte wählen und aus Spalten, Datenfeldern oder festen Zahlen rechnen.
          Getipptes geht vor.
        </p>

        {mitFormeln.map((index) => (
          <FormelZeilen
            key={spalten[index].kennung}
            spalten={spalten}
            quellen={quellen}
            index={index}
            onFormel={(formel) => setzeFormel(index, formel)}
          />
        ))}

        {neuOffen && ohneFormel.length > 0 ? (
          <div className="flex items-center gap-1.5 rounded border border-linie p-2">
            <span className="shrink-0 text-dicht text-matt">Ergebnis in</span>
            <Wahl
              optionen={ohneFormel}
              wert=""
              leerText="Spalte wählen…"
              onWaehle={(wert) => {
                setzeFormel(Number(wert), neueFormel())
                setNeuOffen(false)
              }}
            />
            <Knopf nurZeichen aria-label="Abbrechen" onClick={() => setNeuOffen(false)}>
              <X className="size-3.5" />
            </Knopf>
          </div>
        ) : ohneFormel.length > 0 ? (
          <Knopf onClick={() => setNeuOffen(true)}>+ Rechnung</Knopf>
        ) : null}
      </div>
    </Gruppe>
  )
}
