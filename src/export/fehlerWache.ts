// Ein Fehler, den niemand aufgefangen hat, geht in den Meldungsbalken der Maske.
import { meldeFehler } from '../softengine/meldung'

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (e) => {
    const grund: unknown = e.reason
    meldeFehler(
      'Unerwarteter Fehler in der Maske: '
      + (grund instanceof Error ? grund.message : String(grund)),
    )
  })
}
