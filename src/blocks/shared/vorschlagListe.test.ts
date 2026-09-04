import { expect, test } from 'vitest'
import { passendeVorschlaege } from './vorschlagListe'

const eintrag = (anzeige: string, wert = anzeige) => ({ anzeige, wert })

const namen = (liste: readonly { anzeige: string }[]) => liste.map((e) => e.anzeige)

// Nutzer-Entscheidung 2026-09-04: „Schr" soll zuerst Schraube zeigen, nicht
// Holzschraube — auch wenn Holzschraube in den Daten weiter vorn steht.
test('Treffer am Wortanfang stehen oben, dann der Rest', () => {
  const liste = passendeVorschlaege(
    [eintrag('Holzschraube'), eintrag('Schraubendreher'), eintrag('Schraube')],
    'Schr',
  )
  expect(namen(liste)).toEqual(['Schraube', 'Schraubendreher', 'Holzschraube'])
})

test('innerhalb einer Gruppe wird alphabetisch geordnet', () => {
  const liste = passendeVorschlaege(
    [eintrag('Ampel'), eintrag('Abdeckung'), eintrag('Achse')],
    'A',
  )
  expect(namen(liste)).toEqual(['Abdeckung', 'Achse', 'Ampel'])
})

test('Umlaute stehen bei ihrem Grundbuchstaben', () => {
  const liste = passendeVorschlaege(
    [eintrag('Azubi'), eintrag('Ärmel'), eintrag('Abstand')],
    'A',
  )
  expect(namen(liste)).toEqual(['Abstand', 'Ärmel', 'Azubi'])
})

// Zahlen im Text nach Groesse, nicht nach Ziffernfolge: sonst stuende
// „Pos. 10" vor „Pos. 2".
test('Zahlen im Namen zaehlen als Zahl', () => {
  const liste = passendeVorschlaege(
    [eintrag('Pos. 10'), eintrag('Pos. 2'), eintrag('Pos. 1')],
    'Pos',
  )
  expect(namen(liste)).toEqual(['Pos. 1', 'Pos. 2', 'Pos. 10'])
})

// Der eigentliche Grund, warum erst gesammelt und DANN gekuerzt wird: der
// beste Treffer darf nicht wegfallen, nur weil er in den Daten hinten steht.
test('der beste Treffer ueberlebt die Obergrenze', () => {
  const viele = Array.from({ length: 20 }, (_, i) => eintrag(`Holzschraube ${i + 1}`))
  const liste = passendeVorschlaege([...viele, eintrag('Schraube')], 'Schraube', 8)
  expect(liste).toHaveLength(8)
  expect(liste[0].anzeige).toBe('Schraube')
})

test('gesucht wird auch in der Nummer, nicht nur im Namen', () => {
  const liste = passendeVorschlaege(
    [eintrag('Dichtung', '4711'), eintrag('Ventil', '4712')],
    '4712',
  )
  expect(namen(liste)).toEqual(['Ventil'])
})

test('leer getippt heisst keine Liste', () => {
  expect(passendeVorschlaege([eintrag('Schraube')], '')).toEqual([])
  expect(passendeVorschlaege([eintrag('Schraube')], '   ')).toEqual([])
})

// Im Lager tippt niemand Umlaute mit. Vorher fiel jeder Treffer mit Umlaut
// aus der Liste — der Bediener sah "keine Treffer" und hielt den Artikel fuer
// nicht vorhanden.
test('ohne Umlaut getippt findet trotzdem', () => {
  expect(namen(passendeVorschlaege([eintrag('Müller')], 'muller'))).toEqual(['Müller'])
  expect(namen(passendeVorschlaege([eintrag('Ärmel')], 'armel'))).toEqual(['Ärmel'])
  expect(namen(passendeVorschlaege([eintrag('Öse')], 'ose'))).toEqual(['Öse'])
  expect(namen(passendeVorschlaege([eintrag('Straße')], 'strasse'))).toEqual(['Straße'])
})

test('mit Umlaut getippt findet weiterhin', () => {
  expect(namen(passendeVorschlaege([eintrag('Müller')], 'Müller'))).toEqual(['Müller'])
})
