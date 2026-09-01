import { expect, test } from 'vitest'
import { migrateSpaltenKennungen } from './migrationenRoh'

// Die Lade-Migration zur Spalten-Kennung (2026-09-01): alte Masken sprachen
// Spalten ueber Platznummer (Ketten) bzw. Belegfeld (Rechnung) an — beides
// zeigte nach Loeschen/Verschieben bzw. bei doppelt vergebenem Belegfeld
// stumm auf die falsche Spalte. Hier haengt, dass KEINE alte Maske ihre
// Ketten oder ihre Rechnung beim Laden verliert.

function alteMaske() {
  return {
    t1: {
      type: 'tabelle',
      props: {
        spalten: [
          { titel: 'Artikel', feld: '18_25' },
          { titel: 'Menge', feld: '164_8' },
          { titel: 'Dosis', feld: '930_3' },
        ],
        rechnung: JSON.stringify({
          menge: { feld: '164_8', runden: { stellen: 3, richtung: 'kfm' } },
          dosis: { feld: '930_3', runden: { stellen: 3, richtung: 'kfm' } },
          gewicht: { feld: '1808_30', runden: { stellen: 3, richtung: 'kfm' } },
          bezug: { feld: '930_3', runden: { stellen: 3, richtung: 'kfm' } },
          einheitFeld: '1646_5',
          einheiten: [{ kennung: 'ml', art: 'volumen', faktor: 1 }],
        }),
      },
      childIds: [],
    },
    k1: {
      type: 'button',
      props: {},
      childIds: [],
      events: {
        onClick: [{
          id: 'st1',
          type: 'RELATION',
          resultKey: '',
          relationId: 'r1',
          params: [
            { source: 'fixed', value: '0' },
            { source: 'erfassungszelle', value: '2', blockId: 't1' },
          ],
          extraParams: [],
        }],
      },
    },
  }
}

test('Spalten bekommen Kennungen, Ketten und Rechnung ziehen um', () => {
  const src = alteMaske()
  migrateSpaltenKennungen(src)

  const spalten = src.t1.props.spalten as { kennung?: string }[]
  expect(spalten.map((s) => s.kennung)).toEqual(['s1', 's2', 's3'])

  // Der Ketten-Parameter zeigte auf Platz 2 — jetzt auf dessen Kennung.
  const params = src.k1.events.onClick[0].params as { source: string; value: string }[]
  expect(params[1].value).toBe('s3')
  // Ein fixed-Wert aus Ziffern bleibt, was er ist.
  expect(params[0].value).toBe('0')

  // Die Rechnung spricht die Kennung, das Belegfeld ist raus — und die Reste
  // des Einheiten-Umrechners wie der ausgebauten Plaetze Tiergewicht/je-kg
  // reisen nicht laenger mit.
  const rechnung = JSON.parse(src.t1.props.rechnung as string) as Record<string, unknown>
  expect(rechnung.menge).toMatchObject({ spalte: 's2' })
  expect(rechnung.dosis).toMatchObject({ spalte: 's3' })
  expect(rechnung.menge).not.toHaveProperty('feld')
  expect(rechnung).not.toHaveProperty('einheitFeld')
  expect(rechnung).not.toHaveProperty('einheiten')
  expect(rechnung).not.toHaveProperty('gewicht')
  expect(rechnung).not.toHaveProperty('bezug')
})

// Ein zweiter Lauf darf nichts mehr veraendern — die Migration laeuft bei
// JEDEM Laden.
test('die Migration ist beim zweiten Lauf still', () => {
  const src = alteMaske()
  migrateSpaltenKennungen(src)
  const einmal = JSON.stringify(src)
  migrateSpaltenKennungen(src)
  expect(JSON.stringify(src)).toBe(einmal)
})

// Der Vorfall vom 2026-09-01: ZWEI Spalten auf demselben Belegfeld 930_3.
// Die Migration nimmt die vorderste — dieselbe Antwort, die der alte
// Feld-Vergleich zur Laufzeit gab, nur jetzt sichtbar im Formular.
test('bei doppeltem Belegfeld gewinnt die vorderste Spalte', () => {
  const src = alteMaske()
  ;(src.t1.props.spalten as Record<string, unknown>[]).push({ titel: 'KG', feld: '930_3' })
  migrateSpaltenKennungen(src)
  const rechnung = JSON.parse(src.t1.props.rechnung as string) as Record<string, unknown>
  expect(rechnung.dosis).toMatchObject({ spalte: 's3' })
})

// P4: derselbe Vergabe-Weg wie in `mitKennungen` (blocks/tabelle/spalten.ts,
// Zwilling) — neue Kennungen zaehlen ueber der hoechsten weiter, statt sich
// in die Luecke einer geloeschten Spalte zu setzen. Eine Maske, in der schon
// s1 und s3 stehen, darf beim Laden kein zweites s2 bekommen: die Ketten der
// frueheren s2 zeigten sonst stumm auf die neue Spalte.
test('die Migration setzt neue Kennungen ueber die hoechste, nicht in die Luecke', () => {
  const src = alteMaske()
  // Aussen s1 und s3, in der Mitte eine Spalte ohne Kennung: die Luecke s2
  // gehoerte einer geloeschten Spalte.
  const roh = src.t1.props.spalten as Record<string, unknown>[]
  roh[0].kennung = 's1'
  roh[2].kennung = 's3'
  migrateSpaltenKennungen(src)
  const spalten = src.t1.props.spalten as { kennung?: string }[]
  expect(spalten.map((s) => s.kennung)).toEqual(['s1', 's4', 's3'])
})
