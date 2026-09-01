import type { ListenBindung } from '../../core/blocks/BlockDefinition'
import { schalterAn, schalterFuer } from '../../core/blocks/listenBindung'
import type { Spalte } from './spalten'
import { STANDARD_TITEL } from './spalten'

export const SPALTEN_BINDUNG: ListenBindung = {
  prop: 'spalten',
  titelKey: 'titel',
  feldKey: 'feld',
  kennungKey: 'kennung',
  standardTitel: STANDARD_TITEL,

  eintragsSchalter: [
    {
      key: 'summe',
      label: 'Summe in der Fußzeile',
      kurz: 'Summe',
    },
    {
      key: 'aenderbar',
      label: 'In der Zeile änderbar',
      kurz: 'änderbar',

      // An, solange niemand ihn ausschaltet: der Bediener erwartet, in jeder
      // Zeile tippen zu koennen (Nutzer-Ansage). Ausschalten braucht, wer eine
      // vom ERP gerechnete Spalte zeigt — Gesamt, Rohertrag: dort schreibt
      // ohnehin keine Kette, und der naechste Datenschub raeumt das Getippte weg.
      standard: true,

      // Das SPALTENFELD entscheidet, nicht das Fuellfeld: geschrieben wird die
      // Hauptquelle. Eine Spalte, deren Feld selbst aus einer Hilfsquelle
      // kommt, hat kein Schreibziel und ist darum nie aenderbar.
      nurEigeneQuelle: true,
    },
  ],

  // Der gedimmte Quellname unter dem Spaltentitel — nur im Editor.
  herkunftProp: 'spaltenHerkunft',

  eintragsFeldWahl: [
    {
      key: 'fuellFeld',

      // „In der Zeile" und „Beim Erfassen" sagen beide, WANN das Feld gilt —
      // und genau das unterscheidet sie. Namen wie „Spaltenfeld/Füllfeld"
      // benennen zwei Taetigkeiten, die sich fuer den Bediener nicht
      // erkennbar ausschliessen (Nutzer-Entscheidung 2026-08-28).
      label: 'Nachschlagen',
      hinweis: 'Beim Erfassen füllt der gewählte Satz der Hilfsquelle diese Zelle.',
      nurFremdeQuellen: true,
    },
  ],
}

// Darf der Bediener in dieser Spalte einer GEBUCHTEN Zeile tippen? Dieselbe
// Frage beantwortet der Export ueber traegtAenderungen (treeQuery) — beide
// lesen den Standard aus dem Schalter oben, damit es nur EINE Vorgabe gibt.
export function spalteAenderbar(spalte: Spalte): boolean {
  const eintrag = spalte as unknown as Record<string, unknown>
  const schalter = SPALTEN_BINDUNG.eintragsSchalter?.find((s) => s.key === 'aenderbar')
  return schalter !== undefined
    && spalte.feld !== ''
    && schalterFuer(SPALTEN_BINDUNG, eintrag).includes(schalter)
    && schalterAn(schalter, eintrag)
}
