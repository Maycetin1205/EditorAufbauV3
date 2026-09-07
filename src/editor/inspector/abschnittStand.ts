// Welche Abschnitte des Inspectors aufgeklappt sind — eine Voreinstellung des Arbeitsplatzes.
import { useCallback, useState } from 'react'

// Der Stand geht nicht in den Baum, nicht in die Historie und nicht in den
// Export, darum ein eigener Schluessel.
const SCHLUESSEL = 'aufbau_editor_inspector_abschnitte'

// Der Name ist der Schluessel im Speicher und gilt fuer ALLE Bausteine.
export type AbschnittName =
  | 'datenquellen'
  | 'felder'
  | 'auswahlFolgen'
  | 'aktionen'
  | 'rechnung'

// Zugeklappt ist die Vorgabe: offen ist der Inspector einer Tabelle laenger als
// das Fenster.
const VORGABE = false

function lese(): Record<string, boolean> {
  try {
    if (typeof localStorage === 'undefined') return {}
    const roh = localStorage.getItem(SCHLUESSEL)
    if (roh === null) return {}
    const wert: unknown = JSON.parse(roh)
    if (typeof wert !== 'object' || wert === null || Array.isArray(wert)) return {}

  // Fremde oder alte Eintraege fliegen still raus: ein kaputter Speicher darf den
  // Inspector nicht mitreissen.
    const stand: Record<string, boolean> = {}
    for (const [k, v] of Object.entries(wert)) {
      if (typeof v === 'boolean') stand[k] = v
    }
    return stand
  } catch {
    // Speicher gesperrt oder kaputtes JSON — dann eben jedes Mal die Vorgabe.
    return {}
  }
}

function merke(name: AbschnittName, offen: boolean): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(SCHLUESSEL, JSON.stringify({ ...lese(), [name]: offen }))
  } catch {
  // Nicht merken zu koennen ist kein Grund, das Zuklappen scheitern zu lassen.
  }
}

// Liefert den Stand eines Abschnitts und den Schalter dazu. Gelesen wird beim
// Anmelden, also auch beim Wechsel des Bausteins.
export function useAbschnitt(name: AbschnittName): [boolean, (offen: boolean) => void] {
  const [offen, setOffen] = useState<boolean>(() => lese()[name] ?? VORGABE)

  const schalte = useCallback((neu: boolean) => {
    setOffen(neu)
    merke(name, neu)
  }, [name])

  return [offen, schalte]
}
