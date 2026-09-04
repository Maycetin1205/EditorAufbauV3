import { beforeAll, expect, test } from 'vitest'
import {
  bewegeZeilenFokus,
  fokussiereErsteZeile,
  fokussiereSuchzeile,
  fokussierterRohIndex,
  ROH_ATTR,
} from './zeilenAktivierung'

// Aufwaerts durch die Elternkette suchen. Steht ausserhalb der Klasse, damit
// `this` nicht in eine lokale Variable wandern muss (eslint no-this-alias).
function sucheAufwaerts(start: FakeElement, selector: string): FakeElement | null {
  let curr: FakeElement | null = start
  while (curr) {
    if (selector === '.zeile' && curr.className.includes('zeile')) return curr
    if (selector === '.tabelle' && curr.className.includes('tabelle')) return curr
    curr = curr.parentElement
  }
  return null
}

class FakeElement {
  className = ''
  parentElement: FakeElement | null = null
  children: FakeElement[] = []
  attributes: Record<string, string> = {}
  focused = false

  constructor(className = '', attrs: Record<string, string> = {}) {
    this.className = className
    this.attributes = attrs
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value
  }

  focus(): void {
    this.focused = true
  }

  scrollIntoView(): void {}

  closest<T>(selector: string): T | null {
    return sucheAufwaerts(this, selector) as unknown as T | null
  }

  querySelector<T>(selector: string): T | null {
    const all = this.querySelectorAll<T>(selector)
    return all[0] ?? null
  }

  querySelectorAll<T>(selector: string): T[] {
    const matches: T[] = []
    const walk = (el: FakeElement) => {
      for (const c of el.children) {
        if (selector === `.zeile[${ROH_ATTR}]` && c.className.includes('zeile') && c.attributes[ROH_ATTR] !== undefined) {
          matches.push(c as unknown as T)
        } else if (selector === '.suchzeile input' && c.className.includes('such-input')) {
          matches.push(c as unknown as T)
        }
        walk(c)
      }
    }
    walk(this)
    return matches
  }

  appendChild(child: FakeElement): void {
    child.parentElement = this
    this.children.push(child)
  }
}

beforeAll(() => {
  // @ts-expect-error Mock fuer Node-Testumgebung
  globalThis.HTMLElement = FakeElement
})

function erstelleTestTabelle(): {
  tabelle: FakeElement
  rumpf: FakeElement
  zeilen: FakeElement[]
  suchInput: FakeElement
} {
  const tabelle = new FakeElement('tabelle')

  const suchzeile = new FakeElement('suchzeile')
  const suchInput = new FakeElement('such-input')
  suchzeile.appendChild(suchInput)
  tabelle.appendChild(suchzeile)

  const rumpf = new FakeElement('koerper')
  tabelle.appendChild(rumpf)

  const zeilen: FakeElement[] = []
  for (let i = 0; i < 3; i++) {
    const z = new FakeElement('zeile', { [ROH_ATTR]: String(i) })
    rumpf.appendChild(z)
    zeilen.push(z)
  }

  // Eine Zeile ohne data-ff-roh (z. B. Platzhalter oder Erfassungszeile)
  const platzhalter = new FakeElement('zeile erfassung')
  rumpf.appendChild(platzhalter)

  return { tabelle, rumpf, zeilen, suchInput }
}

test('bewegeZeilenFokus navigiert vorwaerts und rueckwaerts zwischen Datenzeilen', () => {
  const { zeilen } = erstelleTestTabelle()

  // Nach unten (+1) von Zeile 0 nach Zeile 1
  const ok1 = bewegeZeilenFokus(zeilen[0] as unknown as HTMLElement, 1)
  expect(ok1).toBe(true)
  expect(zeilen[1].focused).toBe(true)

  // Weiter nach unten (+1) von Zeile 1 nach Zeile 2
  const ok2 = bewegeZeilenFokus(zeilen[1] as unknown as HTMLElement, 1)
  expect(ok2).toBe(true)
  expect(zeilen[2].focused).toBe(true)

  // Ende der Datenzeilen erreicht (Zeile 2 -> nächste Zeile ohne data-ff-roh wird ignoriert)
  const okEnde = bewegeZeilenFokus(zeilen[2] as unknown as HTMLElement, 1)
  expect(okEnde).toBe(false)

  // Rueckwaerts nach oben (-1) von Zeile 2 nach Zeile 1
  zeilen[1].focused = false
  const okZurueck = bewegeZeilenFokus(zeilen[2] as unknown as HTMLElement, -1)
  expect(okZurueck).toBe(true)
  expect(zeilen[1].focused).toBe(true)

  // Weiter nach oben bis Anfang
  const okAnfang = bewegeZeilenFokus(zeilen[0] as unknown as HTMLElement, -1)
  expect(okAnfang).toBe(false)
})

test('bewegeZeilenFokus gibt false bei ungueltigem Aufrufer zurueck', () => {
  expect(bewegeZeilenFokus(null, 1)).toBe(false)
  const div = new FakeElement('irgendwas')
  expect(bewegeZeilenFokus(div as unknown as HTMLElement, 1)).toBe(false)
})

test('fokussiereErsteZeile springt auf die erste Datenzeile der Tabelle', () => {
  const { suchInput, zeilen } = erstelleTestTabelle()
  const ok = fokussiereErsteZeile(suchInput as unknown as HTMLElement)
  expect(ok).toBe(true)
  expect(zeilen[0].focused).toBe(true)
})

test('fokussiereSuchzeile springt in das Suchfeld', () => {
  const { suchInput, zeilen } = erstelleTestTabelle()
  const ok = fokussiereSuchzeile(zeilen[0] as unknown as HTMLElement)
  expect(ok).toBe(true)
  expect(suchInput.focused).toBe(true)
})

test('fokussierterRohIndex liest den Roh-Index des aktiven Elements', () => {
  const { zeilen } = erstelleTestTabelle()
  const shadowRoot = {
    activeElement: zeilen[1],
  } as unknown as ShadowRoot

  expect(fokussierterRohIndex(shadowRoot)).toBe(1)
  expect(fokussierterRohIndex(null)).toBe(undefined)
})
