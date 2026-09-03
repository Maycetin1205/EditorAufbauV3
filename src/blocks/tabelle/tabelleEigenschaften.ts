import type { PropertyDescription } from '../../core/blocks/PropertyDescription'
import { jaNeinProperty } from '../shared/jaNeinProperty'
import { leerTextProperty } from '../shared/leerZustand'

export const TABELLE_EIGENSCHAFTEN: PropertyDescription[] = [
  jaNeinProperty(
    'suche',
    'Suchzeile',
    'Zeigt über der Tabelle ein Feld, mit dem der Bediener den Inhalt durchsucht.',
    { requiresDataSource: true },
  ),

  jaNeinProperty(
    'erfassung',
    'Erfassungszeile',
    'Eine leere Zeile zum Tippen neuer Positionen.',
  ),

  jaNeinProperty(
    'loeschbar',
    'Zeilen löschbar',
    'Kreuz an jeder Zeile: merkt sie zum Löschen vor.',
    { requiresDataSource: true },
  ),

  jaNeinProperty(
    'blaettern',
    'Blättern',
    'Ja: Seiten mit Blätter-Knöpfen. Nein: alles untereinander, der Rumpf rollt.',
  ),

  jaNeinProperty(
    'kopfzeile',
    'Kopfzeile',
    'Aus: keine Titelzeile, kein Sortieren per Titelklick.',
  ),

  jaNeinProperty(
    'spaltenwahl',
    'Spaltenwahl',
    'In der Maske: Rechtsklick auf eine Spaltenüberschrift nimmt Spalten weg '
      + 'und holt sie zurück. Braucht die Kopfzeile.',
  ),
  {
    attributeName: 'tagField',
    name: 'Tag filtern nach',
    description: 'Datumsfeld. Gesetzt: nur Sätze des gewählten Tages.',
    kind: 'field',
  },

  leerTextProperty(),
]
