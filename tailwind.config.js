// Tailwind-Konfiguration fuer das Editor-Chrome ("Werkbank").
// Farben, Groessen und Abstaende stehen in src/index.css als --wb-*.
// Scannt nur src/, nicht den HTML-Export-Output.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sans: [
          '"Inter Variable"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        // Die Werkbank-Palette. Mehr Farben gibt es im Editor nicht.
        grund: 'hsl(var(--wb-grund))',
        panel: 'hsl(var(--wb-panel))',
        control: 'hsl(var(--wb-control))',
        linie: 'hsl(var(--wb-linie))',
        tinte: 'hsl(var(--wb-tinte))',
        matt: 'hsl(var(--wb-matt))',
        akzent: 'hsl(var(--wb-akzent))',
        fehler: 'hsl(var(--wb-fehler))',
        vormerkung: 'hsl(var(--wb-vormerkung))',

        // Die shadcn-Namen der alten Atome. Sie zeigen auf dieselben Werte
        // (index.css) und gehen mit ihren letzten Aufrufern.
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      // ============================================================
      // Die Masseinheiten der Werkbank. Bis 2026-08-07 hat sich jede der
      // 30 Editor-Dateien ihre eigenen ausgedacht: fuenf Textgroessen, vier
      // Bedienhoehen, vier Rundungen. Das ist der Grund fuer „sieht
      // uneinheitlich aus" — kein Schlendrian, sondern eine fehlende
      // gemeinsame Liste.
      // ============================================================
      fontSize: {
        // ZWEI Stufen. Rangfolge macht der Editor ueber Fettung und Farbe,
        // nicht ueber ein Achtel Millimeter.
        ui: ['0.8125rem', { lineHeight: '1.25rem' }], // 13 px — der Normalfall
        dicht: ['0.75rem', { lineHeight: '1rem' }], // 12 px — dichte Listen
        // Alte Namen auf dieselben zwei Stufen: `text-xs` und `text-sm`
        // stehen 200-mal im Bestand, und sie sollen auf der Skala landen,
        // nicht daneben. `ui-titel` traegt der Panel-Kopf — gleich gross wie
        // `ui`, unterschieden nur durch Fettung.
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        'ui-titel': ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      spacing: {
        // EINE Hoehe fuer alles, was man bedient: Knopf, Eingabefeld,
        // Auswahlfeld, Symbolknopf, Inspector-Zeile.
        steuer: '1.75rem', // 28 px
      },
      borderRadius: {
        // EINE Rundung, 4px, fast kantig. Alle Namen loesen auf denselben
        // Wert auf — dann ist es egal, welchen jemand schreibt.
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        md: 'var(--radius)',
        sm: 'var(--radius)',
      },
      boxShadow: {
        // Keine Schatten ausser Overlays, und dort genau EINE Stufe.
        overlay: '0 0.5rem 1.5rem -0.5rem rgb(40 30 20 / 0.25)',
      },
    },
  },
  plugins: [],
}
