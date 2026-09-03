import { describe, expect, it } from 'vitest'
import {
  bewegteMarke,
  flaecheGrenzen,
  gueltigeMarke,
  passendeVorschlaege,
  richteVorschlaegeAus,
  tastenFolge,
  VORSCHLAEGE_MAX,
  vorschlagStil,
} from './vorschlagListe'

describe('vorschlagListe', () => {
  it('haelt VORSCHLAEGE_MAX auf 8 (Tabu)', () => {
    expect(VORSCHLAEGE_MAX).toBe(8)
  })

  it('passendeVorschlaege findet nach anzeige und wert und deckelt bei max', () => {
    const eintraege = [
      { anzeige: 'Baytril 10%', wert: 'ART001' },
      { anzeige: 'Amoxicillin', wert: 'ART002' },
      { anzeige: 'Metacam', wert: 'ART003' },
      { anzeige: 'Baytril 2.5%', wert: 'ART004' },
    ]

    expect(passendeVorschlaege(eintraege, '')).toEqual([])
    expect(passendeVorschlaege(eintraege, 'bay').map((v) => v.wert)).toEqual(['ART001', 'ART004'])
    expect(passendeVorschlaege(eintraege, '002').map((v) => v.wert)).toEqual(['ART002'])

    // Deckelung:
    const viele = Array.from({ length: 20 }, (_, i) => ({ anzeige: `Artikel ${i}`, wert: `A${i}` }))
    expect(passendeVorschlaege(viele, 'Artikel').length).toBe(8)
    expect(passendeVorschlaege(viele, 'Artikel', 3).length).toBe(3)
  })

  it('bewegteMarke und gueltigeMarke steuern die Auswahl', () => {
    expect(bewegteMarke(0, 5, 1)).toBe(1)
    expect(bewegteMarke(4, 5, 1)).toBe(0) // Umschlag nach oben
    expect(bewegteMarke(0, 5, -1)).toBe(4) // Umschlag nach unten
    expect(bewegteMarke(0, 0, 1)).toBe(0)

    expect(gueltigeMarke(2, 5)).toBe(2)
    expect(gueltigeMarke(5, 5)).toBe(0)
    expect(gueltigeMarke(-1, 5)).toBe(0)
    expect(gueltigeMarke(2, 0)).toBe(0)
  })

  it('tastenFolge haelt die Tastenlogik unveraendert (Tabu: kein Pfeil-runter-Umbau)', () => {
    // Pfeil-runter / Pfeil-hoch
    expect(tastenFolge('ArrowDown', { listeOffen: true, feldLeer: false, treffer: 3, markeVonHand: false })).toBe('marke-runter')
    expect(tastenFolge('ArrowDown', { listeOffen: false, feldLeer: true, treffer: 0, markeVonHand: false })).toBe('nichts')
    expect(tastenFolge('ArrowUp', { listeOffen: true, feldLeer: false, treffer: 3, markeVonHand: false })).toBe('marke-hoch')
    expect(tastenFolge('ArrowUp', { listeOffen: false, feldLeer: false, treffer: 0, markeVonHand: false })).toBe('nichts')

    // Escape
    expect(tastenFolge('Escape', { listeOffen: true, feldLeer: false, treffer: 3, markeVonHand: false })).toBe('liste-zu')
    expect(tastenFolge('Escape', { listeOffen: false, feldLeer: false, treffer: 0, markeVonHand: false })).toBe('nichts')

    // Enter
    expect(tastenFolge('Enter', { listeOffen: true, feldLeer: false, treffer: 1, markeVonHand: false })).toBe('uebernehmen')
    expect(tastenFolge('Enter', { listeOffen: true, feldLeer: false, treffer: 3, markeVonHand: true })).toBe('uebernehmen')
    expect(tastenFolge('Enter', { listeOffen: true, feldLeer: false, treffer: 3, markeVonHand: false })).toBe('fenster')
    expect(tastenFolge('Enter', { listeOffen: false, feldLeer: true, treffer: 0, markeVonHand: false })).toBe('fenster')
    expect(tastenFolge('Enter', { listeOffen: false, feldLeer: false, treffer: 0, markeVonHand: false })).toBe('nichts')
  })

  it('vorschlagStil enthaelt width: max-content, min-width: 100% und .nach-links', () => {
    const cssText = vorschlagStil.cssText
    expect(cssText).toContain('width: max-content')
    expect(cssText).toContain('min-width: 100%')
    // right: 0 darf NICHT mehr bedingungslos in .vorschlaege stehen
    expect(cssText).not.toMatch(/\.vorschlaege\s*\{[^}]*right:\s*0/)
    // .vorschlaege.nach-links muss links freigeben und rechts verankern:
    expect(cssText).toContain('.vorschlaege.nach-links')
    expect(cssText).toMatch(/left:\s*auto/)
    expect(cssText).toMatch(/right:\s*0/)
  })

  it('flaecheGrenzen erkennt den sichtbaren Tabellenrahmen', () => {
    const tabelleEl = {
      className: 'tabelle',
      getBoundingClientRect: () => ({ left: 50, right: 850, width: 800, top: 0, bottom: 500, height: 500 }),
    }
    const ulEl = {
      closest: (sel: string) => (sel === '.tabelle' ? tabelleEl : null),
      getRootNode: () => null,
    } as unknown as HTMLElement

    const grenzen = flaecheGrenzen(ulEl)
    expect(grenzen.links).toBe(50)
    expect(grenzen.rechts).toBe(850)
  })

  it('richteVorschlaegeAus: bleibt links verankert, wenn Platz nach rechts reicht', () => {
    const classes = new Set<string>()
    const styleObj: Record<string, string> = {}

    const halter = {
      offsetWidth: 80,
      getBoundingClientRect: () => ({ left: 100, right: 180, width: 80, top: 200, bottom: 230, height: 30 }),
    }
    const tabelle = {
      className: 'tabelle',
      getBoundingClientRect: () => ({ left: 50, right: 850, width: 800, top: 0, bottom: 500, height: 500 }),
    }
    const ul = {
      parentElement: halter,
      offsetWidth: 250, // benoetigt 250px
      getBoundingClientRect: () => ({ left: 100, right: 350, width: 250, top: 230, bottom: 400, height: 170 }),
      classList: {
        add: (c: string) => classes.add(c),
        remove: (c: string) => classes.delete(c),
        toggle: (c: string, force?: boolean) => {
          if (force === undefined) {
            if (classes.has(c)) classes.delete(c); else classes.add(c)
          } else if (force) classes.add(c)
          else classes.delete(c)
        },
        contains: (c: string) => classes.has(c),
      },
      style: styleObj,
      closest: (sel: string) => (sel === '.tabelle' ? tabelle : null),
      getRootNode: () => null,
    } as unknown as HTMLElement

    richteVorschlaegeAus(ul)

    // 100 + 250 = 350 <= 850 -> passt nach rechts
    expect(classes.has('nach-links')).toBe(false)
    expect(parseInt(styleObj.maxWidth, 10)).toBe(850 - 100) // 750px
  })

  it('richteVorschlaegeAus: waechst nach links, wenn sie rechts ueber die Flaeche treten wuerde', () => {
    const classes = new Set<string>()
    const styleObj: Record<string, string> = {}

    // Spalte am rechten Rand der Tabelle (left: 700, breite: 90 -> right: 790, Tabelle-Rechts: 800)
    const halter = {
      offsetWidth: 90,
      getBoundingClientRect: () => ({ left: 700, right: 790, width: 90, top: 200, bottom: 230, height: 30 }),
    }
    const tabelle = {
      className: 'tabelle',
      getBoundingClientRect: () => ({ left: 50, right: 800, width: 750, top: 0, bottom: 500, height: 500 }),
    }
    const ul = {
      parentElement: halter,
      offsetWidth: 250, // benoetigt 250px; wuerde rechts bei 700 + 250 = 950 landen > 800
      getBoundingClientRect: () => ({ left: 700, right: 950, width: 250, top: 230, bottom: 400, height: 170 }),
      classList: {
        add: (c: string) => classes.add(c),
        remove: (c: string) => classes.delete(c),
        toggle: (c: string, force?: boolean) => {
          if (force === undefined) {
            if (classes.has(c)) classes.delete(c); else classes.add(c)
          } else if (force) classes.add(c)
          else classes.delete(c)
        },
        contains: (c: string) => classes.has(c),
      },
      style: styleObj,
      closest: (sel: string) => (sel === '.tabelle' ? tabelle : null),
      getRootNode: () => null,
    } as unknown as HTMLElement

    richteVorschlaegeAus(ul)

    // 700 + 250 = 950 > 800 -> muss nach links wachsen:
    expect(classes.has('nach-links')).toBe(true)
    // halterRechts ist 790, tabelleLinks ist 50 -> maxBreite ist 790 - 50 = 740px
    expect(parseInt(styleObj.maxWidth, 10)).toBe(790 - 50)
  })

  it('richteVorschlaegeAus: wird nie schmaler als der Halter', () => {
    const classes = new Set<string>()
    const styleObj: Record<string, string> = {}

    const halter = {
      offsetWidth: 120,
      getBoundingClientRect: () => ({ left: 750, right: 870, width: 120, top: 200, bottom: 230, height: 30 }),
    }
    const tabelle = {
      className: 'tabelle',
      getBoundingClientRect: () => ({ left: 700, right: 880, width: 180, top: 0, bottom: 500, height: 500 }),
    }
    const ul = {
      parentElement: halter,
      offsetWidth: 140,
      getBoundingClientRect: () => ({ left: 750, right: 890, width: 140, top: 230, bottom: 400, height: 170 }),
      classList: {
        add: (c: string) => classes.add(c),
        remove: (c: string) => classes.delete(c),
        toggle: (c: string, force?: boolean) => {
          if (force === undefined) {
            if (classes.has(c)) classes.delete(c); else classes.add(c)
          } else if (force) classes.add(c)
          else classes.delete(c)
        },
        contains: (c: string) => classes.has(c),
      },
      style: styleObj,
      closest: (sel: string) => (sel === '.tabelle' ? tabelle : null),
      getRootNode: () => null,
    } as unknown as HTMLElement

    richteVorschlaegeAus(ul)

    // halterRechts (870) - tabelleLinks (700) = 170px >= halterBreite (120px)
    expect(parseInt(styleObj.maxWidth, 10)).toBeGreaterThanOrEqual(120)
  })
})
