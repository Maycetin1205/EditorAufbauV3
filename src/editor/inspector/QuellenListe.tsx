import { Plus, X } from '@/ui/zeichen'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import type { BlockNode } from '../../core/blocks/BlockData'
import { quellenKennung } from '../../core/data/dataSources'
import {
  WEITERE_QUELLEN_PROP,
  weitereQuellenAus,
  type BausteinQuelle,
} from '../../core/data/sourceLinks'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { PickerControl } from './controls/PickerControl'
import { SchluesselPaarZeilen } from './SchluesselPaarZeilen'

interface QuellenListeProps {
  block: BlockNode
}

export function QuellenListe({ block }: QuellenListeProps) {
  const ed = useEditor()
  const bibliothek = useDataSources().list

  const erste = typeof block.props.source === 'string' ? block.props.source : ''
  const weitere = weitereQuellenAus(block.props[WEITERE_QUELLEN_PROP])

  const fehlt = (id: string) => id !== '' && !bibliothek.some((s) => s.id === id)
  const felderVon = (id: string) => bibliothek.find((s) => s.id === id)?.fields ?? []

  function setzeWeitere(next: BausteinQuelle[]) {
    ed.updateProperty(block.id, WEITERE_QUELLEN_PROP, next)
  }

  function aendere(index: number, teil: Partial<BausteinQuelle>) {
    setzeWeitere(weitere.map((q, i) => (i === index ? { ...q, ...teil } : q)))
  }

  function optionen(eigene: string) {
    const belegt = new Set([erste, ...weitere.map((q) => q.quelleId)])
    belegt.delete(eigene)
    return bibliothek.filter((s) => !belegt.has(s.id))
  }

  // Die Stellenbezeichnung einer Quelle DIESES Bausteins — dieselbe Zaehlung,
  // die auch ueber den Waehlern steht.
  function stelle(id: string): string {
    if (id === '') return 'verbundenen Datenquelle'
    if (id === erste) return 'Datenquelle 1'
    const at = weitere.findIndex((q) => q.quelleId === id)
    return at === -1 ? 'Datenquelle 1' : `Datenquelle ${at + 2}`
  }

  // Woran diese Quelle haengt. Drei Zustaende, und sie muessen auseinander
  // bleiben — sonst sprang „keine" beim naechsten Zeichnen auf Datenquelle 1
  // zurueck (Nutzer-Befund 2026-08-27):
  //   KEIN Feldpaar   -> gar keine Verbindung (reine Nachschlagequelle)
  //   partnerId leer  -> die Hauptquelle (so lesen sich auch alte Masken)
  //   partnerId gesetzt -> eine andere weitere Quelle (2 an 3, 3 an 4)
  // Gezaehlt werden ALLE Paarzeilen, auch halb gefuellte: sonst kippte der
  // Waehler beim Eintippen des ersten Feldes zurueck auf „keine".
  function partnerVon(index: number): string {
    const eigen = weitere[index]
    if (!eigen || eigen.keyPairs.length === 0) return ''
    return eigen.partnerId === '' || eigen.partnerId === eigen.quelleId ? erste : eigen.partnerId
  }

  // „keine" nimmt die Paare weg — ohne Paar gibt es nichts zu verbinden, die
  // Angabe waere tote Einstellung. Eine Quelle waehlen legt umgekehrt die
  // erste Paarzeile an, damit die beiden Feldwaehler ueberhaupt erscheinen.
  function setzePartner(index: number, wert: string): void {
    const eigen = weitere[index]
    if (wert === '') {
      aendere(index, { partnerId: '', keyPairs: [] })
      return
    }
    aendere(index, {
      partnerId: wert === erste ? '' : wert,
      keyPairs: (eigen?.keyPairs.length ?? 0) === 0
        ? [{ fromField: '', toField: '' }]
        : (eigen?.keyPairs ?? []),
    })
  }

  const partnerAuswahl = (index: number) => {
    const eigen = weitere[index]
    const eintraege = [
      { wert: erste, name: bibliothek.find((s) => s.id === erste)?.name ?? '', kennung: 'Datenquelle 1' },
      ...weitere
        .map((q, at) => ({ q, at }))
        .filter(({ q, at }) => at !== index && q.quelleId !== '' && q.quelleId !== eigen?.quelleId)
        .map(({ q, at }) => ({
          wert: q.quelleId,
          name: bibliothek.find((s) => s.id === q.quelleId)?.name ?? '',
          kennung: `Datenquelle ${at + 2}`,
        })),
    ]
    return (
      <PickerControl
        label="Verbunden mit"
        bezeichnung="Verbunden mit"
        gruppen={[{ key: 'partner', eintraege }]}
        wert={partnerVon(index)}
        leerText="— keine —"
        onWaehle={(v) => setzePartner(index, v)}
      />
    )
  }

  // Eine fehlende Quelle braucht keine Kunst-Option mehr: der Waehler zeigt
  // einen Wert, den er nicht kennt, von sich aus rot.
  const quellenAuswahl = (wert: string, titel: string, onWert: (v: string) => void) => (
    <PickerControl
      label={titel}
      bezeichnung={titel}
      gruppen={[{
        key: 'quellen',
        eintraege: optionen(wert).map((s) => ({
          wert: s.id,
          name: s.name,
          kennung: quellenKennung(s),
        })),
      }]}
      wert={wert}
      leerText="— keine —"
      onWaehle={onWert}
    />
  )

  return (
    <Gruppe titel="Datenquellen">
      {quellenAuswahl(erste, 'Datenquelle 1', (v) => ed.updateProperty(block.id, 'source', v))}
      {fehlt(erste) && (
        <p className="text-dicht text-fehler">
          Die gewählte Datenquelle fehlt in der Bibliothek. Neu wählen — oder
          unter Datencenter → Datenquellen wieder anlegen.
        </p>
      )}

      {weitere.map((q, i) => (
        <div key={i} className="flex flex-col gap-1.5 rounded border border-linie p-2">
          <div className="flex items-end gap-1">
            <div className="min-w-0 flex-1">
              {quellenAuswahl(q.quelleId, `Datenquelle ${i + 2}`, (v) => aendere(i, { quelleId: v }))}
            </div>
            <Knopf
              nurZeichen
              aria-label={`Datenquelle ${i + 2} entfernen`}
              onClick={() => setzeWeitere(weitere.filter((_, at) => at !== i))}
            >
              <X size={13} />
            </Knopf>
          </div>
          {partnerAuswahl(i)}
          <SchluesselPaarZeilen
            frage="Welche Felder verbinden die beiden Datenquellen? (freiwillig)"
            paare={q.keyPairs}
            linkeFelder={felderVon(partnerVon(i))}
            rechteFelder={felderVon(q.quelleId)}
            linkeBezeichnung={(at) => `Feld ${at + 1} der ${stelle(partnerVon(i))}`}
            rechteBezeichnung={(at) => `Feld ${at + 1} der Datenquelle ${i + 2}`}
            entfernenBezeichnung={(at) => `Zeile ${at + 1} entfernen`}
            onAendern={(keyPairs) => aendere(i, { keyPairs })}
          />
        </div>
      ))}

      {erste !== '' && (
        <Knopf
          className="self-start"
          onClick={() => setzeWeitere([...weitere, { quelleId: '', partnerId: '', keyPairs: [] }])}
        >
          <Plus size={13} /> Datenquelle
        </Knopf>
      )}
    </Gruppe>
  )
}
