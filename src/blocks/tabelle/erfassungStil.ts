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
         der Text steht auf derselben Kante wie eine Zeile darueber. */
      .zeile.erfassung > div,
      .zeile.erfasst > div {
        padding: 0 5px;
        display: flex;
        align-items: center;
        overflow: visible;
      }
      .tabelle.schlank .zeile.erfassung > div,
      .tabelle.schlank .zeile.erfasst > div { padding: 0 1px; }

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
         Die Markierung selbst macht der Statusbalken (tabelleStil). */
      .zeile.erfasst { flex: none; }
      .erfasst-weg {
        margin-right: 6px;
        padding: 0 3px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        line-height: 1;
        color: var(--se-muted);
        background: none;
        border: 0;
        border-radius: var(--se-r-sm);
        cursor: pointer;
      }
      .erfasst-weg:hover {
        color: var(--se-red);
        background: var(--se-red-soft);
      }
`
