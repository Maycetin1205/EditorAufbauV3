import { css } from 'lit'

export const erfassungStil = css`
      .zeile.erfassung {
        flex: none;
        background: var(--se-panel-2);
        border-top: var(--se-border) solid var(--se-line);
      }

      /* Die Liste haengt aus der Zelle heraus; ohne sichtbaren Ueberlauf
         schnitte die Zelle sie ab. Gilt fuer jede Zelle, weil jede gebundene
         Spalte eine Liste zeigen kann.

         Das Polster steht in tabelleStil (.tippbar) — es ist dieselbe
         Rechnung wie fuer jede andere Zelle mit Eingabefeld. */
      .zeile.erfassung > div {
        display: flex;
        align-items: center;
        overflow: visible;
      }

      .erf-halter {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
      }

      .erf-halter.nach-oben .vorschlaege {
        top: auto;
        bottom: 100%;
        margin: 0 0 2px;
      }

      /* .erf-eingabe wird zusammen mit .zell-eingabe in tabelleStil gesetzt:
         es ist dieselbe Sache — eine Zelle, in die getippt wird. */

      /* Im Editor zeigt die Zelle keine Eingabe, sondern Striche. */
      :host([data-ff-editor]) .zeile.erfassung > div { color: var(--se-muted); }

      /* Erfasste, noch nicht geschriebene Zeilen (G4): wie Datenzeilen, nur
         links markiert — erst der Knopf macht aus ihnen echte Positionen.
         Die Markierung selbst macht der Statusbalken (tabelleStil).

         Ein Klick macht sie AN ORT UND STELLE wieder zur Tipp-Zeile,
         darum der Zeigefinger. Das Wegnehm-Kreuz ist dasselbe .zeile-weg wie
         an der gebuchten Zeile: absolut rechts, erst bei Hover. Vorher sass
         es mitten in der ERSTEN Zelle und schob deren Wert um rund 20px nach
         rechts — die erfasste Zeile stand darum sichtbar versetzt unter den
         gebuchten (Nutzer-Befund 2026-08-28). */
      .zeile.erfasst { flex: none; }
      :host(:not([data-ff-editor])) .zeile.erfasst { cursor: pointer; }
`
