import type { MouseEvent } from 'react'
import { Gruppe } from '@/ui/werkbank/Gruppe'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Marke } from '@/ui/werkbank/Marke'
import type { BlockNode } from '../../core/blocks/BlockData'
import type { ListenBindung } from '../../core/blocks/BlockDefinition'
import { schalterAn, schalterFuer } from '../../core/blocks/listenBindung'

// Die Spalten (allgemein: die Eintraege einer Listen-Bindung) des gewaehlten
// Bausteins als Liste im Inspector: Titel, eingeschaltete Schalter, Feldcode.
// Klick oeffnet DENSELBEN Picker wie der Klick auf den Spaltenkopf: der
// Abschnitt loest `ff-listen-bind` am BlockHost des Bausteins aus, genau wie
// der Kopf (blocks/tabelle/spaltenBearbeiten.ts) — ein Picker, eine Logik.
// Vorher musste man wissen, dass der Kopf klickbar ist (PLAN.md Schritt 4).
export function SpaltenSektion({ block, bindung }: { block: BlockNode; bindung: ListenBindung }) {
  const roh = block.props[bindung.prop]
  const eintraege = Array.isArray(roh)
    ? roh.filter((e): e is Record<string, unknown> => e !== null && typeof e === 'object')
    : []

  // Ausgeloest wird am Baustein-Element selbst (es traegt `data-ff-editor`),
  // aufsteigend — genau wie der Kopf: der BlockHost lauscht auf seinem
  // inneren Rahmen, nicht auf der aeusseren Huelle mit `data-block-id`.
  const oeffne = (index: number, e: MouseEvent<HTMLButtonElement>): void => {
    const baustein = document
      .querySelector(`[data-block-id="${block.id}"]`)
      ?.querySelector('[data-ff-editor]')
    if (!baustein) return
    const rect = e.currentTarget.getBoundingClientRect()
    baustein.dispatchEvent(new CustomEvent('ff-listen-bind', {
      detail: { prop: bindung.prop, index, top: rect.bottom + 4, left: rect.left },
      bubbles: true,
      composed: true,
    }))
  }

  const text = (eintrag: Record<string, unknown>, key: string): string => {
    const wert = eintrag[key]
    return typeof wert === 'string' ? wert : ''
  }

  return (
    <Gruppe titel="Spalten">
      {eintraege.length === 0
        ? <p className="text-dicht text-matt">Keine Spalten.</p>
        : (
            <ol className="flex flex-col gap-1">
              {eintraege.map((eintrag, i) => {
                const titel = text(eintrag, bindung.titelKey) || bindung.standardTitel
                const feld = text(eintrag, bindung.feldKey)
                const an = schalterFuer(bindung, eintrag).filter((s) => schalterAn(s, eintrag))
                const kennung = bindung.kennungKey ? text(eintrag, bindung.kennungKey) : ''
                return (
                  <li key={kennung !== '' ? kennung : String(i)}>
                    <Knopf
                      className="w-full"
                      title="Feld, Nachschlagen und Schalter dieser Spalte"
                      onClick={(e) => oeffne(i, e)}
                    >
                      <span className="min-w-0 flex-1 truncate text-left">{titel}</span>
                      {an.map((s) => <Marke key={s.key} technisch={false}>{s.label}</Marke>)}
                      <Marke>{feld === '' ? '—' : feld}</Marke>
                    </Knopf>
                  </li>
                )
              })}
            </ol>
          )}
    </Gruppe>
  )
}
