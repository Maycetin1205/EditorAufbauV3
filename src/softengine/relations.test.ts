import { beforeEach, expect, test, vi } from 'vitest'
import type { RuntimeRelation } from './relations'

// Was die Maske als Bruecke sieht. Nur diese eine Funktion entscheidet, ob ein
// Ruf ueberhaupt hinausgeht.
const brueckeGlobal: { basisHTML_SND_MSG?: (verb: string, obj: unknown) => void } = {}
const gemeldet: string[] = []
const antwortZuhoerer = new Set<(raw: unknown) => void>()

// Was SoftEngine zurueckschiebt. Der Rueckruf traegt NICHT, auf welche Frage
// die Antwort gehoert — genau daran haengt die Verfallsmarke.
function antworte(roh: unknown): void {
  antwortZuhoerer.forEach((cb) => { cb(roh) })
}

vi.mock('./bridge', async (echte) => {
  const modul = await echte<typeof import('./bridge')>()
  return {
    ...modul,
    bootSe: () => {},
    seGlobal: () => brueckeGlobal,
    onSeAntwort: (cb: (raw: unknown) => void) => {
      antwortZuhoerer.add(cb)
      return () => { antwortZuhoerer.delete(cb) }
    },
  }
})

vi.mock('./meldung', async (echte) => {
  const modul = await echte<typeof import('./meldung')>()
  return { ...modul, meldeFehler: (text: string) => { gemeldet.push(text) } }
})

const { executeRelation, setzeVerfallZurueck } = await import('./relations')

function vorlage(verb: RuntimeRelation['verb']): RuntimeRelation {
  return { id: 'x', verb, nr: '174', params: [] }
}

beforeEach(() => {
  delete brueckeGlobal.basisHTML_SND_MSG
  antwortZuhoerer.clear()
  setzeVerfallZurueck()
  gemeldet.length = 0
})

// Ohne diesen Rueckweg kann die Kette keinen Zeilen-Bericht liefern: bis
// Etappe 3 loeste ein gescheitertes PUT genauso auf wie ein gegluecktes.
test('PUT ohne Bruecke meldet den Fehler ZURUECK, nicht nur auf den Balken', async () => {
  const antwort = await executeRelation(vorlage('PUT_RELATION'), ['a'])
  expect(antwort.fehler).toBe(
    'Speichern nicht möglich: keine Verbindung zu SoftEngine. Die Eingabe wurde NICHT übernommen.',
  )
  expect(gemeldet).toEqual([antwort.fehler])
})

test('ein PUT, der wirft, meldet den Grund zurueck', async () => {
  brueckeGlobal.basisHTML_SND_MSG = () => { throw new Error('Leitung tot') }
  const antwort = await executeRelation(vorlage('PUT_RELATION'), ['a'])
  expect(antwort.fehler).toBe('Speichern fehlgeschlagen (Relation Nr. 174): Leitung tot')
})

// Ein PUT ist ein Einweg-Ruf: dass er hinausging, heisst NICHT, dass die ERP
// ihn uebernommen hat. Ohne Fehler heisst darum nur „abgeschickt".
test('ein abgeschickter PUT meldet keinen Fehler', async () => {
  const gesendet: unknown[] = []
  brueckeGlobal.basisHTML_SND_MSG = (verb, obj) => { gesendet.push([verb, obj]) }
  const antwort = await executeRelation(vorlage('PUT_RELATION'), ['a'])
  expect(antwort.fehler).toBeUndefined()
  expect(gesendet).toEqual([['PUT_RELATION', { NR: '174', PARAMS: ['a'] }]])
  expect(gemeldet).toEqual([])
})

test('GET ohne Bruecke meldet den Fehler zurueck', async () => {
  const antwort = await executeRelation(vorlage('GET_RELATION'), ['a'])
  expect(antwort.wert).toBe('')
  expect(antwort.fehler).toBe('Daten laden nicht möglich: keine Verbindung zu SoftEngine.')
})

// Der Balken bleibt beim Hintergrund-Nachladen stumm — der Bericht an die
// Kette nie, sonst braeche ein Lauf ab, ohne dass jemand sagen kann, woran.
test('still schweigt auf dem Balken, meldet aber trotzdem zurueck', async () => {
  const antwort = await executeRelation(vorlage('GET_RELATION'), ['a'], { still: true })
  expect(antwort.fehler).toBe('Daten laden nicht möglich: keine Verbindung zu SoftEngine.')
  expect(gemeldet).toEqual([])
})

// Es gibt keine Ruf-Antwort-Zuordnung: eine Antwort sagt nicht, auf welche
// Frage sie gehoert. Ohne Riegel loeste die verspaetete Antwort eines
// aufgegebenen Rufs den naechsten Frager auf — mit den Daten der falschen
// Position.
test('eine verspaetete Antwort loest den naechsten Frager NICHT auf', async () => {
  vi.useFakeTimers()
  try {
    brueckeGlobal.basisHTML_SND_MSG = () => {}

    const ersterRuf = executeRelation(vorlage('GET_RELATION'), ['1'])
    await vi.advanceTimersByTimeAsync(20_000)
    expect((await ersterRuf).fehler)
      .toBe('Daten laden: SoftEngine hat nicht geantwortet (Relation Nr. 174).')

    const zweiterRuf = executeRelation(vorlage('GET_RELATION'), ['2'])
    let erledigt = false
    void zweiterRuf.then(() => { erledigt = true })

    antworte({ RESULT: 'antwort-auf-ruf-1' })
    await vi.advanceTimersByTimeAsync(300)
    expect(erledigt).toBe(false)

    antworte({ RESULT: 'antwort-auf-ruf-2' })
    expect(await zweiterRuf).toMatchObject({ wert: 'antwort-auf-ruf-2' })
  } finally {
    vi.useRealTimers()
  }
})
