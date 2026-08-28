import { Plus, X } from '@/ui/zeichen'
import { Feld } from '@/ui/werkbank/Feld'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Wahl } from '@/ui/werkbank/Wahl'
import type { ZuordnungZeile } from '../../core/blocks/BlockDefinition'
import type { Eingabesitzung } from '../inspector/controls/eingabeSitzung'

export interface PickerZuordnung {
  label: string
  wertLabel: string
  nameLabel: string
  bedeutungLabel: string
  bedeutungen: readonly { wert: string; name: string }[]
  zeilen: readonly ZuordnungZeile[]

  onAendern: (zeilen: ZuordnungZeile[]) => void

  sitzung: Eingabesitzung
}

export function ZuordnungZeilen({ zuordnung }: { zuordnung: PickerZuordnung }) {
  const kopie = () => zuordnung.zeilen.map((z) => ({ ...z }))

  return (
    <div className="flex flex-col gap-1">
      {zuordnung.zeilen.length === 0 && (
        <p className="text-dicht text-matt">
          Ohne Zuordnung zeigt die Marke den Datenwert grau.
        </p>
      )}
      {zuordnung.zeilen.map((z, i) => {
        const ersetze = (teil: Partial<ZuordnungZeile>) => {
          const next = kopie()
          next[i] = { ...next[i], ...teil }
          zuordnung.onAendern(next)
        }
        return (
          <div key={i} className="flex items-center gap-1">
            <Feld
              aria-label={zuordnung.wertLabel}
              placeholder={zuordnung.wertLabel}
              value={z.wert}
              onChange={(e) => {
                zuordnung.sitzung.beginnen()
                ersetze({ wert: e.currentTarget.value })
              }}
              onBlur={zuordnung.sitzung.beenden}
              className="w-16 shrink-0"
            />
            <Feld
              aria-label={zuordnung.nameLabel}
              placeholder={zuordnung.nameLabel}
              value={z.name}
              onChange={(e) => {
                zuordnung.sitzung.beginnen()
                ersetze({ name: e.currentTarget.value })
              }}
              onBlur={zuordnung.sitzung.beenden}
              className="min-w-0 flex-1"
            />
            <span className="w-24 shrink-0">
              <Wahl
                aria-label={zuordnung.bedeutungLabel}
                optionen={zuordnung.bedeutungen.map((b) => ({ wert: b.wert, name: b.name }))}
                wert={z.bedeutung}
                onWaehle={(wert) => ersetze({ bedeutung: wert })}
              />
            </span>
            <Knopf
              nurZeichen
              aria-label={`${zuordnung.wertLabel} „${z.wert}“ entfernen`}
              onClick={() => zuordnung.onAendern(kopie().filter((_, k) => k !== i))}
            >
              <X size={13} />
            </Knopf>
          </div>
        )
      })}
      <Knopf
        className="self-start"
        onClick={() => zuordnung.onAendern([
          ...kopie(),
          { wert: '', name: '', bedeutung: zuordnung.bedeutungen[0]?.wert ?? '' },
        ])}
      >
        <Plus size={13} /> Zuordnung
      </Knopf>
    </div>
  )
}
