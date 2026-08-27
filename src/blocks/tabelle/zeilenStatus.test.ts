import { expect, test } from 'vitest'
import { LaufStand } from './zeilenStatus'

function stand(): { lauf: LaufStand; meldungen: () => number } {
  let gemeldet = 0
  return { lauf: new LaufStand(() => { gemeldet += 1 }), meldungen: () => gemeldet }
}

// Ohne Lauf zeigt die Zeile, was der Bediener vorgemerkt hat.
test('ohne Meldung gilt der Grund', () => {
  const { lauf } = stand()
  expect(lauf.zeigt('geaendert', '48', 'geaendert'))
    .toEqual({ status: 'geaendert', titel: 'Geändert — noch nicht geschrieben' })
  expect(lauf.zeigt('geaendert', '48', 'gebucht')).toEqual({ status: 'gebucht', titel: '' })
})

test('der Lauf schlaegt die Vormerkung, der Fehler schlaegt den Lauf', () => {
  const { lauf } = stand()
  lauf.schreibt('erfasst', 'e1')
  expect(lauf.zeigt('erfasst', 'e1', 'erfasst').status).toBe('schreibt')
  lauf.gescheitert('erfasst', 'e1', 'Nicht durchgekommen')
  expect(lauf.zeigt('erfasst', 'e1', 'erfasst'))
    .toEqual({ status: 'fehler', titel: 'Nicht geschrieben: Nicht durchgekommen' })
})

// Der zweite Anlauf faengt sauber an: sonst stuende der alte Fehler noch da,
// waehrend dieselbe Zeile gerade geschrieben wird.
test('ein neuer Anlauf loescht den alten Fehler derselben Zeile', () => {
  const { lauf } = stand()
  lauf.gescheitert('geloescht', '48', 'Nicht durchgekommen')
  lauf.schreibt('geloescht', '48')
  expect(lauf.zeigt('geloescht', '48', 'loeschung').status).toBe('schreibt')
})

// Nach dem Lauf darf keine „schreibt"-Marke uebrigbleiben — auch nicht an der
// Zeile, die nie an die Reihe kam. Die Fehlermarke der haengengebliebenen
// Zeile ist das Einzige, was stehen bleibt.
test('fertig nimmt die schreibt-Marken zurueck und laesst den Fehler stehen', () => {
  const { lauf } = stand()
  lauf.schreibt('erfasst', 'e1')
  lauf.schreibt('erfasst', 'e2')
  lauf.gescheitert('erfasst', 'e2', 'Nicht durchgekommen')
  lauf.fertig('erfasst', ['e1'])
  expect(lauf.zeigt('erfasst', 'e1', 'erfasst').status).toBe('erfasst')
  expect(lauf.zeigt('erfasst', 'e2', 'erfasst').status).toBe('fehler')
})

test('eine geschriebene Zeile verliert auch ihre alte Fehlermarke', () => {
  const { lauf } = stand()
  lauf.gescheitert('geaendert', '48', 'Nicht durchgekommen')
  lauf.fertig('geaendert', ['48'])
  expect(lauf.zeigt('geaendert', '48', 'gebucht').status).toBe('gebucht')
})

// Satznummer 48 kann in derselben Tabelle geaendert UND zum Loeschen
// vorgemerkt sein; die Marken duerfen sich nicht vermischen.
test('die Listen halten ihre Marken auseinander', () => {
  const { lauf } = stand()
  lauf.gescheitert('geaendert', '48', 'Nicht durchgekommen')
  expect(lauf.zeigt('geloescht', '48', 'loeschung').status).toBe('loeschung')
  lauf.fertig('geloescht', ['48'])
  expect(lauf.zeigt('geaendert', '48', 'geaendert').status).toBe('fehler')
})

// Ohne Meldung zeichnet der Baustein nicht neu, und der Balken bliebe stehen.
test('jede Meldung fordert ein Neuzeichnen an', () => {
  const { lauf, meldungen } = stand()
  lauf.schreibt('erfasst', 'e1')
  lauf.gescheitert('erfasst', 'e1', 'Nicht durchgekommen')
  lauf.fertig('erfasst', [])
  expect(meldungen()).toBe(3)
})
