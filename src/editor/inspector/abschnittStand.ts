import { useCallback, useState } from 'react'

// Welche Abschnitte des Inspectors aufgeklappt sind, ist eine VOREINSTELLUNG
// des Arbeitsplatzes, kein Teil der Maske: der Stand geht nicht in den Baum,
// nicht in die Historie und nicht in den Export. Darum liegt er unter einem
// eigenen Schluessel, wie die Inspector-Breite (shell/inspectorBreite.ts).
const SCHLUESSEL = 'aufbau_editor_inspector_abschnitte'

// Die Abschnitte in der Zielbild-Reihenfolge. Der Name ist der Schluessel im
// Speicher und gilt fuer ALLE Bausteine: wer „Datenquellen" einmal aufklappt,
// findet den Abschnitt bei der naechsten Tabelle wieder offen.
export type AbschnittName =
  | 'datenquellen'
  | 'felder'
  | 'auswahlFolgen'
  | 'aktionen'
  | 'rechnung'

// Zugeklappt ist die Vorgabe (Nutzer 2026-09-03): der Inspector einer Tabelle
// war laenger als das Fenster, man scrollte an allem vorbei, was man suchte.
const VORGABE = false

function lese(): Record<string, boolean> {
  try {
    if (typeof localStorage === 'undefined') return {}
    const roh = localStorage.getItem(SCHLUESSEL)
    if (roh === null) return {}
    const wert: unknown = JSON.parse(roh)
    if (typeof wert !== 'object' || wert === null || Array.isArray(wert)) return {}

    // Fremde oder alte Eintraege fliegen still raus: ein kaputter Speicher
    // darf den Inspector nicht mitreissen.
    const stand: Record<string, boolean> = {}
    for (const [k, v] of Object.entries(wert)) {
      if (typeof v === 'boolean') stand[k] = v
    }
    return stand
  } catch {
    // Speicher gesperrt (Privatmodus) oder kaputtes JSON — dann eben jedes
    // Mal die Vorgabe.
    return {}
  }
}

function merke(name: AbschnittName, offen: boolean): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(SCHLUESSEL, JSON.stringify({ ...lese(), [name]: offen }))
  } catch {
    // Nicht merken zu koennen ist kein Grund, das Zuklappen scheitern zu
    // lassen — es gilt fuer diese Sitzung trotzdem.
  }
}

// Liefert den Stand eines Abschnitts und den Schalter dazu, fertig fuer
// `<Gruppe offen={...} onSchalte={...}>`. Gelesen wird beim Anmelden, also
// auch dann, wenn der Abschnitt beim Wechsel des Bausteins neu entsteht.
export function useAbschnitt(name: AbschnittName): [boolean, (offen: boolean) => void] {
  const [offen, setOffen] = useState<boolean>(() => lese()[name] ?? VORGABE)

  const schalte = useCallback((neu: boolean) => {
    setOffen(neu)
    merke(name, neu)
  }, [name])

  return [offen, schalte]
}
