import { ACTION_VALUE_ID_ATTR } from '../../core/data/aktionen'

// Was der BEDIENER sich in der fertigen Maske sortiert hat, ueberlebt das
// Schliessen (Nutzer-Entscheidung 2026-09-04: "ich klick Datum an ... und
// diese Sortierung bleibt auch nach Neuladen").
//
// Gemerkt wird die KENNUNG der Spalte, nicht ihr Platz: verschiebt der Bauer
// spaeter eine Spalte, zeigte die Platznummer auf die falsche (derselbe
// Grund, aus dem Ketten und Rechnung an der Kennung haengen, s. spalten.ts).
//
// Dasselbe Verfahren wie die Spaltenwahl (spaltenWahl.ts) — inklusive
// Rueckfall auf das Gedaechtnis, wenn der Browser-Speicher ausfaellt.

const VORSATZ = 'ff_sortierung_'

export interface GemerkteSortierung {
  kennung: string
  auf: boolean
}

// Faellt der Browser-Speicher aus (SoftEngines eingebauter Browser ist alt,
// und ob er ihn hergibt, ist unbelegt), haelt die Sortierung wenigstens die
// Sitzung. Eine Sortierung ist keine Meldung wert.
const imGedaechtnis = new Map<string, GemerkteSortierung | null>()

// Je Maske und Tabelle eine eigene Sortierung. Die Baustein-Kennung traegt
// nicht jede Tabelle (nur die adressierbaren), darum der Platz im Dokument
// als Rueckfall.
export function sortierSchluessel(el: HTMLElement): string {
  const titel = typeof document === 'undefined' ? '' : document.title
  const id = el.getAttribute(ACTION_VALUE_ID_ATTR)
  if (id !== null && id !== '') return `${VORSATZ}${titel}|${id}`
  const gleiche = Array.from(el.ownerDocument?.querySelectorAll(el.tagName) ?? [])
  return `${VORSATZ}${titel}|#${Math.max(0, gleiche.indexOf(el))}`
}

export function leseSortierung(schluessel: string): GemerkteSortierung | null {
  if (imGedaechtnis.has(schluessel)) return imGedaechtnis.get(schluessel) ?? null
  try {
    const roh = localStorage.getItem(schluessel)
    if (roh === null) return null
    return deuteSortierung(JSON.parse(roh))
  } catch {
    return null
  }
}

// Getrennt und ausgestellt, damit der Test sie ohne Browser-Speicher pruefen
// kann: Fremde oder alte Staende duerfen die Tabelle nicht umwerfen.
export function deuteSortierung(roh: unknown): GemerkteSortierung | null {
  if (typeof roh !== 'object' || roh === null) return null
  const o = roh as Record<string, unknown>
  const kennung = typeof o.kennung === 'string' ? o.kennung.trim() : ''
  if (kennung === '') return null
  return { kennung, auf: o.auf !== false }
}

export function sichereSortierung(
  schluessel: string,
  stand: GemerkteSortierung | null,
): void {
  imGedaechtnis.set(schluessel, stand)
  try {
    if (stand === null) localStorage.removeItem(schluessel)
    else localStorage.setItem(schluessel, JSON.stringify(stand))
  } catch { /* dann gilt sie fuer die Sitzung */ }
}
