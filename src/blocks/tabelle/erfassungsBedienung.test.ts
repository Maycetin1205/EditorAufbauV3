import { expect, test } from 'vitest'
import { ErfassungsLauf } from './erfassungsLauf'
import { springe, type ErfassungsWirt } from './erfassungsBedienung'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import type { Spalte } from './spalten'

function spalte(titel: string, feld: string): Spalte {
  return { kennung: '', titel, feld }
}

interface Protokoll {
  fokussiert: number[]
  erfasst: number
}

// Ein Wirt aus Papier: springe() braucht nur Umfeld, Lauf und die zwei
// Rueckrufe. Damit laesst sich der Zeilenende-Fluss ohne Browser pruefen —
// dieselbe Naht, die ErfassungsLauf schon testbar macht.
function wirtMit(
  lauf: ErfassungsLauf,
  spalten: readonly Spalte[],
  erfassbar: boolean,
): { wirt: ErfassungsWirt; p: Protokoll } {
  const p: Protokoll = { fokussiert: [], erfasst: 0 }
  const umfeld: ErfassungsUmfeld = {
    spalten,
    quelleId: 'q-pos',
    paareZu: () => [],
    partnerVon: () => '',
  }
  const wirt: ErfassungsWirt = {
    baustein: undefined as unknown as HTMLElement,
    lauf,
    umfeld: () => umfeld,
    melde: () => {},
    fokussiere: (i) => p.fokussiert.push(i),
    erfasseZeile: () => {
      if (!erfassbar) return false
      p.erfasst += 1
      return true
    },
  }
  return { wirt, p }
}

const SPALTEN = [spalte('Artikel', '18_25'), spalte('Menge', '164_8')]

test('Tab geht Zelle fuer Zelle, auch in gefuellte', () => {
  const lauf = new ErfassungsLauf()
  lauf.tippe(1, '3')
  const { wirt, p } = wirtMit(lauf, SPALTEN, true)
  expect(springe(wirt, 0, 'Tab')).toBe(true)
  expect(p.fokussiert).toEqual([1])
  expect(p.erfasst).toBe(0)
})

// Vorher gab Tab hinter der letzten Spalte an den Browser ab: der Fokus
// verliess die Tabelle, und die getippte Zeile blieb UNERFASST stehen.
test('Tab hinter der letzten Spalte schliesst die Zeile ab', () => {
  const lauf = new ErfassungsLauf()
  lauf.tippe(0, 'ART1')
  lauf.tippe(1, '3')
  const { wirt, p } = wirtMit(lauf, SPALTEN, true)
  expect(springe(wirt, 1, 'Tab')).toBe(true)
  expect(p.erfasst).toBe(1)
})

// Sonst saesse der Fokus in einer leeren Zeile fest: es gibt nichts zu
// erfassen, also gehoert die Taste dem Browser.
test('bei nichts zu erfassen bleibt Tab dem Browser', () => {
  const { wirt, p } = wirtMit(new ErfassungsLauf(), SPALTEN, false)
  expect(springe(wirt, 1, 'Tab')).toBe(false)
  expect(p.erfasst).toBe(0)
})

// Enter folgt dem Fluss: die naechste LEERE Zelle, Selbstgefuelltes wird
// uebersprungen.
test('Enter springt auf die naechste leere Zelle', () => {
  const lauf = new ErfassungsLauf()
  lauf.tippe(0, 'ART1')
  const { wirt, p } = wirtMit(lauf, SPALTEN, true)
  expect(springe(wirt, 0, 'Enter')).toBe(true)
  expect(p.fokussiert).toEqual([1])
  expect(p.erfasst).toBe(0)
})

test('Enter ohne leere Zelle rechts schliesst die Zeile ab', () => {
  const lauf = new ErfassungsLauf()
  lauf.tippe(0, 'ART1')
  lauf.tippe(1, '3')
  const { wirt, p } = wirtMit(lauf, SPALTEN, true)
  expect(springe(wirt, 1, 'Enter')).toBe(true)
  expect(p.erfasst).toBe(1)
})
