import { css } from 'lit'

// Die Erfassungszeile sitzt unter den Daten und traegt dieselbe Grid-Form wie
// eine Datenzeile (.zeile); eigen ist nur, dass sie EINGABEN enthaelt und
// dass die Vorschlagsliste aus ihr herausragen darf.
export const erfassungStil = css`
      .zeile.erfassung {
        flex: none;
        background: var(--se-panel-2);
        border-top: var(--se-border) solid var(--se-line);
      }

      /* Die Liste haengt aus der Zelle heraus; ohne sichtbaren Ueberlauf
         schnitte die Zelle sie ab. Gilt fuer jede Zelle, weil jede gebundene
         Spalte eine Liste zeigen kann.

         5px + 4px Eingabe-Polster + 1px Rahmen = die 10px einer Datenzelle:
         der Text steht auf derselben Kante wie eine Zeile darueber. Die
         ERFASSTE Zeile traegt seit dem Zurueckholen keine Eingabefelder mehr
         und darum auch dieses Polster nicht — sie ist eine Zeile wie jede
         andere und nimmt das Zell-Polster der Datenzeile. */
      .zeile.erfassung > div {
        padding: 0 5px;
        display: flex;
        align-items: center;
        overflow: visible;
      }
      .tabelle.schlank .zeile.erfassung > div { padding: 0 1px; }

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

         Ein Klick holt sie zum Korrigieren zurueck in die Erfassungszeile,
         darum der Zeigefinger. Das Wegnehm-Kreuz ist dasselbe .zeile-weg wie
         an der gebuchten Zeile: absolut rechts, erst bei Hover. Vorher sass
         es mitten in der ERSTEN Zelle und schob deren Wert um rund 20px nach
         rechts — die erfasste Zeile stand darum sichtbar versetzt unter den
         gebuchten (Nutzer-Befund 2026-08-28). */
      .zeile.erfasst { flex: none; }
      :host(:not([data-ff-editor])) .zeile.erfasst { cursor: pointer; }
`
