import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'

const EINGECHECKT = 'src/export/generated'

// Gebaut wird in einen Wegwerf-Ordner, NIE nach src/export/generated: ein
// parallel offener Dev-Server uebernaehme den kurzen Zwischenzustand per HMR
// und exportierte eine Maske ohne Laufzeit.
const WEGWERF = 'node_modules/.tmp/runtime-waechter'

// Gebaut wird als eigener Prozess, nicht ueber die Vite-Programmschnittstelle:
// im vitest-Prozess steht NODE_ENV auf 'test', und damit greift Vite zu den
// Entwicklungs-Ausgaben der Pakete — die Dateien fielen groesser aus als das,
// was `npm run build:runtime` erzeugt. Der Waechter muss denselben Weg gehen
// wie der Entwickler, sonst prueft er andere Dateien.
function baueFrisch(): void {
  rmSync(WEGWERF, { recursive: true, force: true })
  const env = { ...process.env }
  delete env.NODE_ENV
  execFileSync(
    process.execPath,
    ['tools/laufzeitBauen.mjs', '--ziel', WEGWERF],
    { stdio: 'pipe', env },
  )
}

test('die eingecheckte Laufzeit ist der frische Bau', () => {
  baueFrisch()
  const frisch = readdirSync(WEGWERF).sort()
  const eingecheckt = readdirSync(EINGECHECKT).sort()
  expect(eingecheckt, 'andere Laufzeitdateien als der frische Bau').toEqual(frisch)

  for (const name of frisch) {
    const a = readFileSync(path.join(WEGWERF, name))
    const b = readFileSync(path.join(EINGECHECKT, name))
    expect(
      a.equals(b),
      `build:runtime vergessen: ${name} weicht vom frischen Bau ab `
      + `(eingecheckt ${b.length} Bytes, frisch ${a.length} Bytes). `
      + 'Die exportierte Maske traegt dann alten Baustein-Code.',
    ).toBe(true)
  }
  rmSync(WEGWERF, { recursive: true, force: true })
}, 300_000)
