import { useCallback, useState, type ReactNode } from 'react'
import { Dialog } from '@/ui/werkbank/Dialog'
import { Knopf } from '@/ui/werkbank/Knopf'

export interface Frage {
  titel: string
  text: string

  // Beschriftung des zustimmenden Knopfes — sie sagt, was passiert
  // („Löschen", „Ersetzen"), nie „OK".
  jaText: string

  // Faerbt den zustimmenden Knopf als Gefahr: die Antwort ist nicht
  // ruecknehmbar.
  gefahr?: boolean
}

// `window.confirm` haelt den ganzen Browser an, traegt die Optik des
// Betriebssystems in die Werkbank und kennt nur „OK/Abbrechen". Ersatz ist
// ein `Dialog`; damit die Aufrufstelle trotzdem eine Zeile bleibt
// (`if (!await frage(…)) return`) und nicht je Frage eine Zustandsmaschine
// braucht, liefert `frage` ein Versprechen.
export function useFrage(): [ReactNode, (frage: Frage) => Promise<boolean>] {
  const [offen, setOffen] = useState<
    { frage: Frage; antworte: (ja: boolean) => void } | null
  >(null)

  const frage = useCallback(
    (f: Frage) => new Promise<boolean>((antworte) => setOffen({ frage: f, antworte })),
    [],
  )

  const beende = (ja: boolean): void => {
    offen?.antworte(ja)
    setOffen(null)
  }

  const knoten = offen === null ? null : (
    <Dialog
      schmal
      escapeAbfangen
      titel={offen.frage.titel}
      onClose={() => beende(false)}
      fuss={
        <>
          <Knopf onClick={() => beende(false)}>Abbrechen</Knopf>
          <Knopf art={offen.frage.gefahr === true ? 'gefahr' : 'primaer'} onClick={() => beende(true)}>
            {offen.frage.jaText}
          </Knopf>
        </>
      }
    >
      <p className="whitespace-pre-line text-ui leading-relaxed text-tinte">{offen.frage.text}</p>
    </Dialog>
  )

  return [knoten, frage]
}
