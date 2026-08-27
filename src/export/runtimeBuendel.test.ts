import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'

const EINGECHECKT = 'src/export/generated/ff-runtime.js'

// Gebaut wird in einen Wegwerf-Ordner, NIE nach src/export/generated: ein
// parallel offener Dev-Server uebernaehme den kurzen Zwischenzustand per HMR
// und exportierte eine Maske ohne Runtime (Warnung in vite.runtime.config.ts).
const WEGWERF = 'node_modules/.tmp/runtime-waechter'

// Gebaut wird als eigener Prozess, nicht ueber die Vite-Programmschnittstelle:
// im vitest-Prozess steht NODE_ENV auf 'test', und damit greift Vite zu den
// Entwicklungs-Ausgaben der Pakete — das Buendel fiel 14 KB groesser aus als
// das, was `npm run build:runtime` erzeugt. Der Waechter muss denselben Weg
// gehen wie der Entwickler, sonst prueft er eine andere Datei.
function baueFrisch(): Buffer {
  rmSync(WEGWERF, { recursive: true, force: true })
  const env = { ...process.env }
  delete env.NODE_ENV
  execFileSync(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js', 'build',
      '--config', 'vite.runtime.config.ts',
      '--outDir', WEGWERF,
    ],
    { stdio: 'pipe', env },
  )
  const frisch = readFileSync(path.join(WEGWERF, 'ff-runtime.js'))
  rmSync(WEGWERF, { recursive: true, force: true })
  return frisch
}

test('das eingecheckte Runtime-Buendel ist der frische Bau', () => {
  const frisch = baueFrisch()
  const eingecheckt = readFileSync(EINGECHECKT)
  expect(
    frisch.equals(eingecheckt),
    `build:runtime vergessen: ${EINGECHECKT} weicht vom frischen Bau ab `
    + `(eingecheckt ${eingecheckt.length} Bytes, frisch ${frisch.length} Bytes). `
    + 'Die exportierte Maske traegt dann alten Baustein-Code.',
  ).toBe(true)
}, 180_000)
