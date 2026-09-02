import { useCallback, useEffect, useState, type ReactNode, type RefObject } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { BlockNode } from '../../core/blocks/BlockData'
import {
  bindingProp,
  feldWahlenLesen,
  schalterAn,
  schalterFuer,
  listenStandardTitel,
  listeLesen,
  type BindableSpot,
  type ListenBindung,
} from '../../core/blocks/BlockDefinition'
import { zerlegeBindung } from '../../core/blocks/BlockDefinition'
import { quellenKennung } from '../../core/data/dataSources'
import { paarKlartext, type QuelleInReichweite } from '../../core/data/sourceLinks'
import type { Editor } from '../../state/Editor'
import { wendeProps } from '../../state/propsPatch'
import { quellenTraeger } from '../../state/quellenOps'
import { useDataSources } from '../../state/useDataSources'
import { useEingabeSitzung } from '../inspector/controls/eingabeSitzung'
import { FieldPicker, type PickerGruppe } from './FieldPicker'
import { bindingCode, useBindingPicker } from './useBindingPicker'

interface FeldBindungArgs {
  editor: Editor
  blockRef: RefObject<BlockNode>
  block: BlockNode
  selected: boolean | undefined
  bindableSpots: readonly BindableSpot[]
  listenBindung: ListenBindung | undefined

  quellen: readonly QuelleInReichweite[]

  containerRef: RefObject<HTMLDivElement | null>

  onSelect?: (aufStelle: boolean) => void
}

function pickerGruppen(quellen: readonly QuelleInReichweite[]): PickerGruppe[] {
  const erste = quellen[0]?.source
  return quellen.map((q, i) => (i === 0
    ? {
        quelleId: '',
        name: q.source.name,
        kennung: quellenKennung(q.source),
        fields: q.source.fields,
      }
    : {
        quelleId: q.source.id,
        name: q.source.name,
        kennung: quellenKennung(q.source),
        // Die linke Seite eines Paares gehoert der PARTNER-Quelle. Solange
        // alles sternfoermig an der ersten hing, war das dasselbe; haengt
        // Quelle 3 an Quelle 2, schlug der Klartext sonst im falschen
        // Feldbestand nach und blieb leer.
        hinweis: paarKlartext(
          q.paare ?? [],
          q.partnerId ? quellen.find((x) => x.source.id === q.partnerId)?.source : erste,
        ),
        fields: q.source.fields,
      }))
}

function klarnameVon(wert: string, quellen: readonly QuelleInReichweite[]): string {
  const { quelleId, code } = zerlegeBindung(wert)
  const quelle = quelleId === ''
    ? quellen[0]?.source
    : quellen.find((q) => q.source.id === quelleId)?.source
  return quelle?.fields.find((f) => f.code === code)?.label ?? ''
}

export function useFeldBindung({
  editor,
  blockRef,
  block,
  selected,
  bindableSpots,
  listenBindung,
  quellen,
  containerRef,
  onSelect,
}: FeldBindungArgs): {
  onClick: (e: ReactMouseEvent<HTMLDivElement>) => void
  onDoubleClick: (e: ReactMouseEvent<HTMLDivElement>) => void
  pickers: ReactNode
} {
  const bibliothek = useDataSources().list

  const tippSitzung = useEingabeSitzung(
    () => editor.beginTransaction(),
    () => editor.endTransaction(),
  )
  const hatQuelle = quellen.length > 0

  const bibliotheksAngebot =
    !hatQuelle && bibliothek.length > 0 && quellenTraeger(editor.tree, block.id) !== undefined
  const hatAngebot = hatQuelle || bibliotheksAngebot

  const { picker, closePicker, onClick, onDoubleClick } = useBindingPicker({
    editor,
    blockRef,
    selected,
    bindableSpots,
    hatAngebot,
    onSelect,
  })

  const [listenPicker, setListenPicker] = useState<{
    index: number
    top: number
    left: number

    liste?: unknown
  } | null>(null)
  const closeListenPicker = useCallback(() => setListenPicker(null), [])
  if (!selected && listenPicker !== null) setListenPicker(null)

  // listenBindung.quelleProp: die Felder kommen NUR aus der Bibliotheks-
  // Quelle, deren id in dieser Block-Eigenschaft steht (z. B. das
  // Nachschlage-Feld) — nie aus den Quellen in Reichweite.
  const quelleAusProp = listenBindung?.quelleProp === undefined
    ? undefined
    : bibliothek.find((s) => s.id === String(block.props[listenBindung.quelleProp ?? ''] ?? ''))
  const listenPickerHatFelder = listenBindung?.quelleProp !== undefined
    ? quelleAusProp !== undefined
    : hatAngebot

  useEffect(() => {
    const el = containerRef.current
    if (!el || !listenBindung) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        prop?: string
        index?: number
        top?: number
        left?: number
        liste?: unknown
      }

      if (detail?.prop !== listenBindung.prop || typeof detail.index !== 'number') return
      const index = detail.index
      // Ein zweiter Klick auf DENSELBEN Kopf macht wieder zu. Der Kopf gilt
      // dem Fenster als Anker, sonst haette der Zeigerdruck es schon
      // geschlossen und der Klick danach sofort wieder geoeffnet — netto
      // passierte nichts (Nutzer-Befund 2026-08-28). Ein anderer Kopf schaltet
      // um statt zu schliessen.
      setListenPicker((vorher) => (vorher !== null && vorher.index === index ? null : {
        index,
        top: Math.max(8, detail.top ?? 0),
        left: Math.max(8, Math.min(detail.left ?? 0, window.innerWidth - 248)),
        ...(Array.isArray(detail.liste) ? { liste: detail.liste } : {}),
      }))
    }
    el.addEventListener('ff-listen-bind', handler)
    return () => el.removeEventListener('ff-listen-bind', handler)
  }, [containerRef, listenBindung])

  const gruppen = pickerGruppen(quellen)

  // Erste Stufe, solange der Baustein keine Hauptquelle hat: die Quellen der
  // Bibliothek. Vorher standen hier ALLE Felder ALLER Quellen, und die Wahl
  // eines Feldes bestimmte nebenbei still die Hauptquelle — der Bediener sah
  // eine Wand aus Feldern und traf eine Entscheidung, die ihm keiner ansagte.
  const quellenWahl = !bibliotheksAngebot ? undefined : {
    hinweis: 'Erst die Hauptquelle wählen.',
    eintraege: bibliothek.map((s) => ({ wert: s.id, name: s.name, kennung: quellenKennung(s) })),
    onWaehle: (quelleId: string) => {
      const traeger = quellenTraeger(editor.tree, blockRef.current.id)
      if (quelleId === '' || !traeger) return
      editor.updateProperty(traeger.id, 'source', quelleId)
    },
  }

  // Solange die Eigenschaft leer ist (Automatik), gilt die vom Baustein
  // mitgeschickte Anzeige-Liste — erst das Wählen schreibt sie als richtige
  // Eigenschaft fest.
  type PickerStand = { index: number; liste?: unknown }

  const eintraegeVon = (picker: PickerStand): Record<string, unknown>[] => {
    if (!listenBindung) return []
    const ausProps = listeLesen(block.props[listenBindung.prop], listenBindung)
    return ausProps.length > 0 ? ausProps : listeLesen(picker.liste, listenBindung)
  }

  // Nimmt ein GANZES Paket von Schluesseln: `block.props` ist der Stand des
  // letzten Rendervorgangs und aendert sich innerhalb desselben nicht — zwei
  // Aufrufe hintereinander laesen beide denselben alten Stand, und der zweite
  // ueberschriebe den ersten. Ein Aufruf ist zugleich EIN Undo-Schritt.
  // `undefined` LOESCHT den Schluessel: ein leer gewaehltes Feld soll nicht
  // als '' im Eintrag stehenbleiben — es reiste sonst in jede Maskendatei und
  // in den Export mit.
  const schreibeInEintrag = (picker: PickerStand, teil: Record<string, unknown>): void => {
    if (!listenBindung) return
    const next = eintraegeVon(picker)
    const ziel = next[picker.index]
    if (!ziel) return
    for (const [key, wert] of Object.entries(teil)) {
      if (wert === undefined) delete ziel[key]
      else ziel[key] = wert
    }
    editor.updateProperty(block.id, listenBindung.prop, next)
  }

  const pickers = (
    <>
      {selected && picker && hatAngebot && (
        <FieldPicker
          spotLabel={picker.spot.label}
          gruppen={gruppen}
          current={bindingCode(block.props, picker.spot)}
          top={picker.top}
          left={picker.left}
          quellenWahl={quellenWahl}
          onPick={(wert) => {
            editor.updateProperty(blockRef.current.id, bindingProp(picker.spot.prop), wert)
            closePicker()
          }}
          onClose={closePicker}
        />
      )}
      {selected && listenPicker && listenBindung && listenPickerHatFelder && (() => {
        const listeJetzt = (): Record<string, unknown>[] => eintraegeVon(listenPicker)
        const liste = listeJetzt()
        const eintrag = liste[listenPicker.index]
        if (!eintrag) return null

        // quelleProp-Modus: eine Gruppe, nackte Feldcodes (quelleId '').
        const proQuelle = quelleAusProp !== undefined
        const listenGruppen: PickerGruppe[] = proQuelle
          ? [{
              quelleId: '',
              name: quelleAusProp.name,
              kennung: quellenKennung(quelleAusProp),
              fields: quelleAusProp.fields,
            }]
          : gruppen
        const titelJetzt = String(eintrag[listenBindung.titelKey] ?? '')
        const standardTitel = listenStandardTitel(listenBindung, listenPicker.index)
        return (
          <FieldPicker
            // Ein anderer Spaltenkopf = frisches Fenster. Ohne `key` bleibt das
            // Fenster am Leben und behaelt sein Schreibziel: wer einmal
            // „Nachschlagen" angeklickt hatte, band bei der naechsten Spalte
            // wieder das Fuellfeld — Titel und Zelle blieben leer
            // (Nutzer-Befund 2026-08-31).
            key={listenPicker.index}
            spotLabel={titelJetzt === '' ? standardTitel : titelJetzt}
            gruppen={listenGruppen}
            titel={{
              wert: titelJetzt,
              standard: standardTitel,
              onAendern: (neu) => {
                tippSitzung.beginnen()
                schreibeInEintrag(listenPicker, { [listenBindung.titelKey]: neu })
              },
              sitzung: tippSitzung,
            }}
            weitereFelder={feldWahlenLesen(listenBindung, eintrag).map(({ wahl: fw, wert }) => ({
              key: fw.key,
              label: fw.label,
              hinweis: fw.hinweis,
              aktuell: wert,
              nurFremdeQuellen: fw.nurFremdeQuellen,
              onWaehle: (neu) => schreibeInEintrag(
                listenPicker,
                { [fw.key]: neu === '' ? undefined : neu },
              ),
            }))}
            schalter={schalterFuer(listenBindung, eintrag).map((s) => ({
              key: s.key,
              label: s.label,
              kurz: s.kurz,
              standard: s.standard,
              an: schalterAn(s, eintrag),
              onSchalte: (an) => schreibeInEintrag(listenPicker, { [s.key]: an }),
            }))}
            current={String(eintrag[listenBindung.feldKey] ?? '')}
            entfernenLabel={`${listenBindung.standardTitel.replace(/\s*\{n\}/, '')} entfernen`}
            onEntfernen={listenBindung.eintragWeg === undefined ? undefined : () => {
              const weg = listenBindung.eintragWeg
              if (!weg) return
              if (!wendeProps(editor, block.id, weg(block.props, listenPicker.index))) return
              setListenPicker(null)
            }}
            quellenWahl={proQuelle ? undefined : quellenWahl}
            anker={containerRef}
            top={listenPicker.top}
            left={listenPicker.left}
            onPick={(roh) => {
              editor.transaktion(() => {
                const wert = roh
                const next = listeJetzt()
                const ziel = next[listenPicker.index]
                if (!ziel) return

                // Die Feldwahl setzt den Titel IMMER auf den Klarnamen des
                // Feldes. Umbenennen geht danach jederzeit — bis zur naechsten
                // Feldwahl, dann fuehrt wieder das Feld.
                //
                // Das kehrt eine Regel vom 2026-08-27 um. Damals galt: ein
                // selbst getippter Name bleibt unangetastet, die Wahl setzt den
                // Titel nur, solange er noch „Spalte 3" heisst. Der Nutzer hat
                // das am 2026-08-28 zweimal ausdruecklich anders verlangt
                // („ich nehme ein feld aus, aber die Spaltenueberschrift bleibt
                // gleich"). Die Kehrseite ist bekannt und in Kauf genommen: wer
                // eine Spalte benannt hat und danach umbindet, muss den Namen
                // neu tippen.
                const klarname = (feldWert: string): string => (proQuelle
                  ? (quelleAusProp.fields.find((f) => f.code === feldWert)?.label ?? '')
                  : klarnameVon(feldWert, quellen)) || feldWert

                ziel[listenBindung.titelKey] = wert === '' ? standardTitel : klarname(wert)
                ziel[listenBindung.feldKey] = wert
                editor.updateProperty(block.id, listenBindung.prop, next)
              })
              // Das Fenster bleibt OFFEN. Es ist die Einstellflaeche der
              // Spalte, kein einmaliger Feldwaehler: nach dem Feld will man
              // meist noch die Darstellung, das Nachschlage-Feld oder einen
              // Schalter setzen (Nutzer-Ansage 2026-08-28). Zu geht es ueber
              // Esc, einen Klick daneben oder einen anderen Spaltenkopf.
            }}
            onClose={closeListenPicker}
          />
        )
      })()}
    </>
  )

  return { onClick, onDoubleClick, pickers }
}
