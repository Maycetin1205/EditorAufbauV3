import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// __dirname-Äquivalent für ESM-Config.
const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Fester Port: die im Browser gespeicherten Masken/Datenquellen hängen am
  // Ursprung http://localhost:5300 — unter dieser Adresse hat der Nutzer
  // immer gearbeitet (Nutzer-Ansage 2026-08-24). Ein anderer Port fände
  // seine gespeicherten Daten nicht.
  server: { port: 5300, strictPort: true },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(here, 'src'),
    },
  },
  test: {
    // Ohne das liefert der `?raw`-Import von masken-tokens.css im Testlauf
    // einen LEEREN String (vitest stubbt CSS): der Export-Test pruefte dann
    // eine Maske ohne Masken-Tokens — nicht die, die der Editor abgibt.
    css: true,
  },
})
