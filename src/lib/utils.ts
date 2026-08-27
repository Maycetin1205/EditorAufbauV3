import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge muss die EIGENEN Schriftgroessen kennen. Sonst haelt es
// `text-ui` fuer eine Textfarbe (unbekanntes `text-*` faellt in seine
// Farbgruppe) und wirft es weg, sobald in derselben Klassenliste eine echte
// Farbe steht: aus `text-ui text-matt` wurde `text-matt`, die Groesse fiel
// still auf die geerbte zurueck. Nachgemessen am 2026-08-27 — das war schon
// vor der Werkbank so und ist ein Teil von „sieht uneinheitlich aus".
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['ui', 'ui-titel', 'dicht'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
