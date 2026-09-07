// Das Aussehen der Tabelle und ihrer Erfassungszeile.
import { css } from 'lit'

export const tabelleStil = css`
      :host { min-width: 0; height: 100%; }

      .tabelle {
        --se-zell-x: 10px;
        --se-eingabe-x: 4px;

        --kopf-hoehe: 36px;

        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--se-panel);
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-lg);
        box-shadow: var(--se-schatten);
        overflow: hidden;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        color: var(--se-ink);
      }

      .suchzeile {
        padding: 5px 8px;
        border-bottom: var(--se-border) solid var(--se-line);
        background: var(--se-panel-2);
      }
      .suchzeile input {
        box-sizing: border-box;

        width: 100%;
        max-width: 15rem;
        height: 24px;
        padding: 0 8px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        color: var(--se-ink);
        background: var(--se-panel);
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
      }
      .suchzeile input:focus {
        outline: none;
        border-color: var(--se-accent);
      }

      .kopf {
        display: grid;
        height: var(--kopf-hoehe);
        box-sizing: border-box;
      }
      .zeile {
        display: grid;
        height: var(--zeilen-hoehe);
        box-sizing: border-box;
      }

      .kopf {
        position: sticky;
        top: 0;
        z-index: 1;
        flex: none;
        background: var(--se-panel-2);
        border-bottom: var(--se-border) solid var(--se-line);
        font-size: var(--se-fs-kopf);
        font-weight: 600;
        color: var(--se-muted);
      }

      .koerper {
        flex: 1 1 auto;
        overflow: auto;

        /* Kein Gutter: reservierter Platz stuende bei kurzen Listen als Luecke
           neben der letzten Spalte. */
        scrollbar-width: thin;
        display: flex;
        flex-direction: column;
      }

      .koerper > .zeile { flex: none; }

      /* Die Erfassungszeile klebt bedingungslos unten, nicht nur bei
         „Blaettern = Nein": sonst tippte der Bediener ins Unsichtbare. */
      .koerper > .zeile.erfassung {
        position: sticky;
        bottom: 0;
        z-index: 1;
      }

      .lineal {
        flex: 1 1 auto;
        min-height: 0;

        background-image:
          repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(var(--zeilen-hoehe) - 1px),
            var(--se-line-soft) calc(var(--zeilen-hoehe) - 1px),
            var(--se-line-soft) var(--zeilen-hoehe)
          );
        background-position: 0 0;

        display: grid;
      }

      .koerper > .leer--tafel {
        flex: 1 1 auto;
        align-content: center;
      }
      .zeile {
        border-bottom: 1px solid var(--se-line-soft);
        background: var(--se-panel);
        transition: background-color var(--se-move);
      }

      /* Getoent wird nach der Nummer in der Ansicht, nicht per nth-child: ohne
         Kopfzeile oder mit vorangestellter Erfassungszeile kippte die Toenung. */
      .zeile.zebra {
        background: var(--se-zebra);
      }

      /* Nur eine Zeile OHNE Status faerbt sich unter der Maus: die Kennfarbe
         IST die Auskunft. */
      .koerper > .zeile:not([data-status]):hover {
        background: var(--se-hover);
      }

      .koerper > .zeile.waehlbar { cursor: pointer; }

      .koerper:focus { outline: none; }
      .koerper > .zeile:focus {
        outline: var(--se-border) solid var(--se-accent);
        outline-offset: calc(-1 * var(--se-border));
      }
      .koerper > .zeile:focus:not(:focus-visible) { outline: none; }

      .zeile.gewaehlt,
      .zeile:focus-visible,
      .koerper > .zeile.gewaehlt:not([data-status]):hover,
      .koerper > .zeile:not([data-status]):focus-visible:hover {
        background: var(--se-auswahl);
        box-shadow: inset 3px 0 0 var(--se-accent);
      }
      .zeile.gewaehlt > div,
      .zeile:focus-visible > div { color: var(--se-ink); }
      /* Die Textkante jeder Zelle; eine Zelle mit Eingabefeld gibt ihr Polster
         an das Feld ab (.tippbar). */
      .kopf > div,
      .zeile > div {
        padding: 0 var(--se-zell-x);
        line-height: calc(var(--zeilen-hoehe) - 1px);
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .zeile > div.zahl {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .kopf > div.z { justify-content: flex-end; text-align: right; }

      /* Platz vor der ersten Zelle fuer den Statuspunkt. */
      .kopf > div:first-of-type,
      .zeile > div:first-of-type { padding-left: calc(var(--se-zell-x) + 14px); }
      .zeile[data-status]::before {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--se-faint);
        pointer-events: none;
      }
      .fehltext {
        margin-left: 8px;
        font-size: var(--se-fs-sm);
        color: var(--se-red);
      }

      .kopf > div {
        display: flex;
        align-items: center;
        line-height: 1.25;
        white-space: normal;
        cursor: pointer;
        user-select: none;

        position: relative;
      }
      .kopf-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        overflow-wrap: break-word;
        -webkit-hyphens: auto;
        hyphens: auto;
      }

      /* Der Greifstreifen ist ein eigenes Gitter-Kind in der Spur der Kopfzelle
         und haengt ueber die Linie: eine 1px-Linie trifft die Maus nicht. In der
         Kopfzelle schnitte deren overflow ihn ab. */
      .breite-griff {
        position: relative;
        z-index: 2;
        justify-self: end;
        width: 11px;
        margin-right: -5px;
        cursor: col-resize;

        /* Sonst rollt der Finger die Tabelle, statt zu ziehen. */
        touch-action: none;
      }
      .breite-griff:hover {
        background: linear-gradient(
          to right,
          transparent 4px,
          var(--se-accent) 4px,
          var(--se-accent) 7px,
          transparent 7px
        );
      }

      .sort-pfeil { font-size: 9px; color: var(--se-muted); }

      /* Nur im Editor: gedaempft, aber voll bedienbar — es ist eine echte Spalte. */
      :host([data-ff-editor]) .versteckt { opacity: 0.45; }

      /* Das Wahlfenster liegt IN der Tabelle: die schneidet ihren Ueberhang ab. */
      .sw-schirm {
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: 4;
      }
      .spaltenwahl {
        position: absolute;
        z-index: 5;
        display: flex;
        flex-direction: column;
        min-width: 160px;
        max-width: 260px;
        max-height: 70%;
        overflow-y: auto;
        padding: 3px;
        background: var(--se-panel);
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-md);
        box-shadow: var(--se-schatten);
      }
      .sw-titel {
        margin: 0;
        padding: 3px 8px 5px;
        font-size: var(--se-fs-sm);
        font-weight: 600;
        color: var(--se-muted);
      }
      .sw-zeile,
      .sw-alle {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 4px 8px;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        text-align: left;
        color: var(--se-ink);
        background: none;
        border: 0;
        border-radius: var(--se-r-sm);
        cursor: pointer;
      }
      .sw-zeile:hover:not(:disabled),
      .sw-alle:hover { background: var(--se-hover); }
      .sw-zeile:disabled { cursor: default; opacity: 0.55; }
      .sw-zeile:not(.an) { color: var(--se-muted); }
      .sw-haken {
        flex: none;
        width: 12px;
        color: var(--se-accent);
      }
      .sw-alle {
        margin-top: 3px;
        padding-top: 6px;
        border-top: var(--se-border) solid var(--se-line);
        color: var(--se-accent);
      }

      .zeile > div { color: var(--se-ink); }

      .fusszeile {
        display: flex;
        align-items: center;
        gap: 14px;
        min-height: 30px;
        padding: 3px 10px;
        border-top: var(--se-border) solid var(--se-line);
        font-size: var(--se-fs-sm);
        color: var(--se-muted);
        white-space: nowrap;
        overflow: hidden;
      }
      .seiten-info { flex: none; }
      .fuss-rechts {
        flex: none;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: auto;
      }
      .seiten-nav {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .buchen {
        height: 24px;
        padding: 0 12px;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        font-weight: 600;
        line-height: 1;
        color: var(--se-panel);
        background: var(--se-accent);
        border: var(--se-border) solid var(--se-accent);
        border-radius: var(--se-r-md);
        cursor: pointer;
      }
      .buchen:hover { background: var(--se-accent-dark); border-color: var(--se-accent-dark); }
      .buchen:disabled { opacity: 0.5; cursor: default; }
      .buchen:disabled:hover { background: var(--se-accent); border-color: var(--se-accent); }

      .zeile.geloescht > div { text-decoration: line-through; color: var(--se-muted); }

      /* Der Zeilen-Status ist der Punkt vor der ersten Zelle; der Klartext
         haengt im title. */
      .zeile[data-status="erfasst"] { background: var(--se-accent-soft); }
      .zeile[data-status="erfasst"]::before,
      .zeile[data-status="schreibt"]::before { background: var(--se-accent); }
      .zeile[data-status="geaendert"]::before,
      .zeile[data-status="loeschung"]::before { background: var(--se-amber); }
      .zeile[data-status="loeschung"] { background: var(--se-red-shell); }
      .zeile[data-status="schreibt"] { animation: se-schreibt 1.1s ease-in-out infinite; }
      .zeile[data-status="geschrieben"] { color: var(--se-muted); }
      .zeile[data-status="fehler"] { background: var(--se-red-shell); }
      .zeile[data-status="fehler"]::before { background: var(--se-red); }
      @keyframes se-schreibt { 50% { opacity: 0.55; } }
      @media (prefers-reduced-motion: reduce) {
        .zeile[data-status="schreibt"] { animation: none; }
      }

      /* Traeger fuer das Kreuz am rechten Rand der Zeile. */
      .zeile { position: relative; }
      .zeile-weg {
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 4px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        line-height: 1;
        color: var(--se-faint);
        background: var(--se-panel);
        border: 0;
        border-radius: var(--se-r-sm);
        cursor: pointer;
        opacity: 0;
      }
      .zeile:hover .zeile-weg,
      .zeile.geloescht .zeile-weg,
      .zeile-weg:focus { opacity: 1; }
      .zeile-weg:hover { color: var(--se-red); background: var(--se-red-soft); }

      .zeile-weg.zeile-weg-anzeige { opacity: 1; cursor: default; }

      mark {
        padding: 0 1px;
        color: inherit;
        background: var(--se-amber-soft);
        border-radius: 2px;
      }

      /* Eine tippbare Zelle bleibt eine ZELLE, kein Formularfeld: sechs davon in
         einer Zeile flackerten sonst beim Ueberfahren. Der transparente Rahmen
         bleibt, er haelt die Hoehe. */
      /* Die Zelle gibt ihr Polster an das Feld ab, zusammen ergeben sie wieder
         --se-zell-x. */
      .zeile > div.tippbar,
      .zeile.erfassung > div {
        padding: 0 calc(var(--se-zell-x) - var(--se-eingabe-x) - var(--se-border));
      }
      .zeile > div.tippbar:first-of-type,
      .zeile.erfassung > div:first-of-type {
        padding-left: calc(var(--se-zell-x) + 14px - var(--se-eingabe-x) - var(--se-border));
      }

      .erf-eingabe.auto {
        color: var(--se-accent);
        font-style: italic;
        background: var(--se-accent-soft);
      }

      .zell-eingabe,
      .erf-eingabe {
        box-sizing: border-box;
        width: 100%;
        height: calc(var(--zeilen-hoehe) - 8px);
        min-width: 0;
        padding: 0 var(--se-eingabe-x);
        font-family: var(--se-font);
        font-size: var(--se-fs);
        color: var(--se-ink);
        background: transparent;
        border: var(--se-border) solid transparent;
        border-radius: var(--se-r-sm);
      }
      .zell-eingabe:focus,
      .erf-eingabe:focus { outline: none; }
      /* Die Platzhalter erscheinen erst, wenn der Bediener in der Zelle steht. */
      .erf-eingabe::placeholder { color: transparent; }
      .zeile.erfassung:focus-within .erf-eingabe::placeholder { color: var(--se-faint); }

      .zell-eingabe.geaendert {
        background: var(--se-amber-shell);
        border-color: var(--se-amber-line);
        color: var(--se-ink);
        font-weight: 600;
      }

      .vorgemerkt {
        color: var(--se-amber);
        font-weight: 600;
      }

      .summen {
        display: flex;
        align-items: baseline;
        gap: 12px;
      }
      .summe-titel { color: var(--se-muted); }
      .summen b {
        color: var(--se-ink);
        font-variant-numeric: tabular-nums;
      }

      .seiten-nav button {
        box-sizing: border-box;
        height: 22px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        padding: 2px 6px;
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
        color: var(--se-ink);
        cursor: pointer;
      }
      .seiten-nav button:disabled {
        opacity: 0.3;
        cursor: default;
      }
`

export const erfassungStil = css`
      .zeile.erfassung {
        flex: none;
        background: var(--se-panel-2);
        border-top: var(--se-border) solid var(--se-line);
      }

      /* Die Vorschlagsliste haengt aus der Zelle heraus, darum sichtbarer
         Ueberlauf an jeder Zelle. */
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

      :host([data-ff-editor]) .zeile.erfassung > div { color: var(--se-muted); }

      /* Das Wegnehm-Kreuz ist dasselbe .zeile-weg wie an der gebuchten Zeile:
         absolut rechts, sonst schoebe es den Wert der ersten Zelle beiseite. */
      .zeile.erfasst { flex: none; }
      :host(:not([data-ff-editor])) .zeile.erfasst { cursor: pointer; }
`
