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
    'Zeigt als nächste freie Zeile eine leere Zeile, in der der Bediener neue Positionen tippt. Eingestellt wird an ihr nichts: Was eine Zelle tut, ergibt sich aus der Bindung ihrer Spalte (Spaltenkopf) und der Verknüpfung des Bausteins. Enter am Zeilenende lässt die Zeile stehen; geschrieben wird über einen Knopf, dessen Kette „Wert aus Erfassungszelle“ liest — einmal je Zeile.',
  ),

  jaNeinProperty(
    'loeschbar',
    'Zeilen löschbar',
    'Zeigt an jeder gebuchten Zeile ein Kreuz. Ein Klick merkt die Zeile zum Löschen vor — '
    + 'sie bleibt durchgestrichen stehen, bis eine Kette sie schreibt, und ein zweiter Klick '
    + 'nimmt die Vormerkung zurück. Geschrieben wird nichts von allein.',
    { requiresDataSource: true },
  ),

  jaNeinProperty(
    'blaettern',
    'Blättern',
    'Ja: lange Listen werden in Seiten geschnitten, unten stehen die Blätter-Knöpfe. '
    + 'Nein: alle Treffer stehen untereinander und der Rumpf rollt — die Titelzeile '
    + 'bleibt dabei oben stehen, die Erfassungszeile unten.',
  ),

  jaNeinProperty(
    'schlank',
    'Schlank',
    'Nimmt den Rahmen der Tafel weg und macht die Polster enger — die Tabelle liegt bündig auf der Maske. Die Fußzeile erscheint ohnehin nur noch, wenn geblättert wird oder ein Filter greift.',
  ),

  jaNeinProperty(
    'kopfzeile',
    'Kopfzeile',
    'Aus: Die Titelzeile fällt weg, die Spaltennamen stehen blass in den Zellen der Erfassungszeile. Gebunden wird dann per Klick auf eine Zelle; zum Umbenennen die Kopfzeile kurz einschalten. An der fertigen Maske entfällt ohne Kopf das Sortieren per Titelklick.',
  ),
  {
    attributeName: 'tagField',
    name: 'Tag filtern nach',
    description: 'Optional: Feld der Datenquelle, in dem das Datum steht. Gesetzt zeigt die Tabelle nur Sätze des Tages, den der Tageswähler zeigt. Leer = alle Sätze.',
    kind: 'field',
  },

  leerTextProperty(),
]
