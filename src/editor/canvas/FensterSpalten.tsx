// Die Spaltenkoepfe IM Suchfenster: derselbe Feldwaehler wie am Kopf der
// Erfassungszeile, nur ueber dem Fenster statt ueber der Leinwand. Der Baustein
// zeichnet dafuer nichts — gemessen wird sein Kopf, darueber liegt diese Schicht.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { EBENE_UEBER_MASKENFENSTER } from '@/ui/molecules/auswahl-fenster'
import { Plus } from '@/ui/zeichen'
import type { DialogRahmen } from '../../blocks/shared/DialogRahmen'
import type { TabelleBlock } from '../../blocks/tabelle/TabelleBlock'
import { neueSpalte, STANDARD_TITEL, type Spalte } from '../../blocks/tabelle/spalten'
import { quellenKennung } from '../../core/data/dataSources'
import { useDataSources } from '../../state/useDataSources'
import { useEditor } from '../../state/useEditor'
import { useEingabeSitzung } from '../inspector/controls/eingabeSitzung'
import {
  beiFensterWechsel,
  fensterImEditorVergessen,
  fensterRahmenImEditor,
  fensterSpaltenMitLeerem,
  fensterStandVon,
  offenesFensterImEditor,
  type FensterStand,
  type OffenesFenster,
} from './fensterStand'
import { FieldPicker, type PickerGruppe } from './FieldPicker'

// An jeder Kopfkante gehoeren ein paar Pixel dem Breiten-Griff der Maske; die
// Schicht laesst sie frei.
const GRIFF_RAND = 6

interface Kopf {
  // Der Platz in der Spaltenliste des Fensters, aus dem Attribut und nicht aus
  // der DOM-Reihenfolge.
  platz: number

  left: number
  top: number
  width: number
  height: number
}

function tabelleIn(rahmen: DialogRahmen): TabelleBlock | null {
  return rahmen.querySelector<TabelleBlock>('ff-tabelle')
}

function messe(rahmen: DialogRahmen): Kopf[] {
  const wurzel = tabelleIn(rahmen)?.shadowRoot
  if (!wurzel) return []
  return Array.from(wurzel.querySelectorAll<HTMLElement>('.kopf > [data-ff-eintrag]')).map(
    (el, i) => {
      const r = el.getBoundingClientRect()
      const roh = Number(el.getAttribute('data-ff-eintrag'))
      return {
        platz: Number.isInteger(roh) ? roh : i,
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      }
    },
  )
}

interface Mass {
  breite: number
  hoehe: number
}

// Das Fenster ist EINMAL gezeichnet; was der Bauer aendert, muss ihm
// nachgetragen werden, sonst zeigt es den Stand von vorhin.
function trageNach(rahmen: DialogRahmen, stand: FensterStand, vorher: Mass | null): void {
  const tabelle = tabelleIn(rahmen)
  if (tabelle !== null) {
    const spalten = fensterSpaltenMitLeerem(stand)
    if (JSON.stringify(tabelle.spalten) !== JSON.stringify(spalten)) tabelle.spalten = spalten
  }
  // Das Mass nur, wenn der BAUM sich geaendert hat: waehrend eines Zugs steht am
  // Rahmen schon die neue Kante und im Baum noch die alte, und ein Nachtrag
  // zoege sie zurueck.
  if (vorher === null || vorher.breite !== stand.breite) rahmen.breite = stand.breite
  if (vorher === null || vorher.hoehe !== stand.hoehe) rahmen.hoehe = stand.hoehe
}

export function FensterSpalten() {
  const offen = useSyncExternalStore(beiFensterWechsel, offenesFensterImEditor)
  if (offen === null) return null
  // Ein anderes Fenster ist eine andere Sache: frische Auswahl, frischer Picker.
  return <Koepfe key={`${offen.blockId}:${offen.platz}`} offen={offen} />
}

function Koepfe({ offen }: { offen: OffenesFenster }) {
  const ed = useEditor()
  const bibliothek = useDataSources().list
  const [koepfe, setKoepfe] = useState<Kopf[]>([])
  const [gewaehlt, setGewaehlt] = useState<number | null>(null)
  const schichtRef = useRef<HTMLDivElement | null>(null)
  const tippSitzung = useEingabeSitzung(
    () => ed.beginTransaction(),
    () => ed.endTransaction(),
  )

  // Das Fenster haengt am document.body und schliesst sich ohne Ereignis (Taste,
  // Kreuz, ein zweites Fenster). Ist es weg, ist auch die Schicht darueber weg.
  useEffect(() => {
    const pruefe = (): void => {
      if (fensterRahmenImEditor() === null) fensterImEditorVergessen()
    }
    const mo = new MutationObserver(pruefe)
    mo.observe(document.body, { childList: true })
    pruefe()
    return () => mo.disconnect()
  }, [offen])

  // Die Koepfe werden gemessen und ueber Resize- und MutationObserver
  // nachgefuehrt, nie im Rendern: das Fenster ist ziehbar, die Liste aendert sich.
  useEffect(() => {
    const rahmen = fensterRahmenImEditor()
    const tabelle = rahmen === null ? null : tabelleIn(rahmen)
    if (rahmen === null || tabelle?.shadowRoot == null) return
    const nachmessen = (): void => setKoepfe(messe(rahmen))
    const ro = new ResizeObserver(nachmessen)
    ro.observe(tabelle)
    const mo = new MutationObserver(nachmessen)
    mo.observe(tabelle.shadowRoot, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-ff-eintrag'],
    })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [offen])

  const stand = fensterStandVon(ed, offen.blockId, offen.fenster, offen.platz)

  const nachgetragen = useRef<Mass | null>(null)
  useEffect(() => {
    const rahmen = fensterRahmenImEditor()
    if (rahmen === null || stand === null) return
    trageNach(rahmen, stand, nachgetragen.current)
    nachgetragen.current = { breite: stand.breite, hoehe: stand.hoehe }
  })

  if (stand === null) return null

  const quelle = bibliothek.find((s) => s.id === stand.quelleId)
  const gruppen: PickerGruppe[] = quelle === undefined ? [] : [{
    quelleId: '',
    name: quelle.name,
    kennung: quellenKennung(quelle),
    fields: quelle.fields,
  }]

  const aendere = (platz: number, teil: Partial<Spalte>): void => {
    stand.setzeSpalten(stand.spalten.map((s, i) => (i === platz ? { ...s, ...teil } : s)))
  }

  // Der leere Kopf rechts fuegt an und macht den Waehler der neuen Spalte auf:
  // eine Spalte ohne Feld hat noch nichts zu zeigen.
  const anfuegen = (): void => {
    const platz = stand.spalten.length
    stand.setzeSpalten([...stand.spalten, neueSpalte(platz)])
    setGewaehlt(platz)
  }

  const kopfDesPickers = gewaehlt === null
    ? undefined
    : koepfe.find((k) => k.platz === gewaehlt)
  const spalteDesPickers = gewaehlt === null ? undefined : stand.spalten[gewaehlt]
  const standardTitel = STANDARD_TITEL.replace('{n}', String((gewaehlt ?? 0) + 1))

  return createPortal(
    <>
      <div
        ref={schichtRef}
        data-ff-editor-helper
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: EBENE_UEBER_MASKENFENSTER }}
      >
        {koepfe.map((kopf) => {
          const leer = kopf.platz >= stand.spalten.length
          return (
            <div
              key={kopf.platz}
              className={cn(
                'pointer-events-auto absolute flex cursor-pointer items-center justify-center',
                'gap-0.5 overflow-hidden text-dicht',
                'hover:bg-[hsl(var(--wb-auswahl)/0.16)]',
                gewaehlt === kopf.platz && 'bg-[hsl(var(--wb-auswahl)/0.16)]',
                leer && 'text-[hsl(var(--wb-auswahl))]',
              )}
              style={{
                left: kopf.left + GRIFF_RAND,
                top: kopf.top,
                width: Math.max(0, kopf.width - 2 * GRIFF_RAND),
                height: kopf.height,
              }}
              title={leer
                ? 'Spalte anfügen'
                : 'Feld und Titel dieser Spalte im Suchfenster'}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                if (leer) anfuegen()
                else setGewaehlt((v) => (v === kopf.platz ? null : kopf.platz))
              }}
            >
              {leer && (
                <>
                  <Plus size={11} />
                  <span className="truncate">Spalte</span>
                </>
              )}
            </div>
          )
        })}
      </div>

      {kopfDesPickers !== undefined && spalteDesPickers !== undefined && gewaehlt !== null && (
        <FieldPicker
          key={gewaehlt}
          ebene={EBENE_UEBER_MASKENFENSTER}
          spotLabel={spalteDesPickers.titel === '' ? standardTitel : spalteDesPickers.titel}
          gruppen={gruppen}
          titel={{
            wert: spalteDesPickers.titel,
            standard: standardTitel,
            onAendern: (neu) => {
              tippSitzung.beginnen()
              aendere(gewaehlt, { titel: neu })
            },
            sitzung: tippSitzung,
          }}
          current={spalteDesPickers.feld}
          anker={schichtRef}
          top={kopfDesPickers.top + kopfDesPickers.height + 4}
          left={kopfDesPickers.left}
          // Die Feldwahl setzt den Titel IMMER auf den Klarnamen des Feldes, wie
          // am Kopf der Erfassungszeile. Umbenennen geht danach jederzeit.
          onPick={(wert) => {
            const klarname = quelle?.fields.find((f) => f.code === wert)?.label ?? ''
            aendere(gewaehlt, {
              feld: wert,
              titel: wert === '' ? standardTitel : (klarname !== '' ? klarname : wert),
            })
          }}
          entfernenLabel="Spalte entfernen"
          onEntfernen={!stand.gestellt && stand.spalten.length <= 1 ? undefined : () => {
            stand.setzeSpalten(stand.spalten.filter((_, i) => i !== gewaehlt))
            setGewaehlt(null)
          }}
          onClose={() => setGewaehlt(null)}
        />
      )}
    </>,
    document.body,
  )
}
