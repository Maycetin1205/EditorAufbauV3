import { css } from 'lit'

export const tabelleStil = css`
      :host { min-width: 0; height: 100%; }

      .tabelle {
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
        height: var(--takt);
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
        font-size: var(--se-fs-sm);
        font-weight: 600;
      }

      .koerper {
        flex: 1 1 auto;
        overflow: auto;

        /* Platz fuer die Bildlaufleiste immer freihalten. Sonst schrumpft der
           Rumpf in dem Moment, in dem sie erscheint, und die Spalten rutschen
           gegen die Kopfzeile — die rollt nicht mit. */
        scrollbar-gutter: stable;
        display: flex;
        flex-direction: column;
      }

      .koerper > .zeile { flex: none; }

      /* Die Erfassungszeile klebt unten, IMMER. Vorher hing die Regel an einer
         Klasse, die es nur bei „Blaettern = Nein" gab — bei der Voreinstellung
         rollte die Zeile also weg, sobald mehr Zeilen da waren als in den
         Rumpf passen, und der Bediener tippte ins Unsichtbare.
         Die Kopfzeile klebt ohnehin schon bedingungslos (.kopf). */
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
      .lineal > div { border-right: 1px solid var(--se-line-soft); }
      .lineal > div:last-child { border-right: none; }

      .zeile {
        border-bottom: 1px solid var(--se-line-soft);
        background: var(--se-panel);
        transition: background-color var(--se-move);
      }

      /* Zebra: jede zweite Datenzeile leicht getoent. Gezaehlt wird unter
         ALLEN Kindern des Rumpfes — die Kopfzeile ist das erste, also faengt
         die Toenung bei der ersten Datenzeile an. Erfassungs- und erfasste
         Zeilen tragen es nicht: die haben ihre eigene Farbe. */
      .koerper > .zeile:not(.erfassung):not(.erfasst):nth-child(even) {
        background: var(--se-zebra);
      }

      .koerper > .zeile:hover {
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
      .koerper > .zeile.gewaehlt:hover {
        background: var(--se-auswahl);
        box-shadow: inset 3px 0 0 var(--se-accent);
      }
      .zeile.gewaehlt > div { color: var(--se-ink); }
      .kopf > div,
      .zeile > div {
        padding: 0 10px;
        line-height: calc(var(--zeilen-hoehe) - 1px);
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-right: 1px solid var(--se-line-soft);
      }

      .kopf > div { line-height: calc(var(--takt) - 1px); }
      .kopf > div:last-child,
      .zeile > div:last-child { border-right: none; }
      .kopf > div { cursor: pointer; user-select: none; }
      .sort-pfeil { font-size: 9px; color: var(--se-muted); }

      .zeile > div { color: var(--se-ink); }

      .kopf > div.zahl,
      .zeile > div.zahl {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .zeile > div.status {
        display: flex;
        align-items: center;
      }

      .zeile > div.bild {
        display: flex;
        align-items: center;
      }
      .bild-name {
        display: flex;
        align-items: center;

        gap: var(--se-gap);
        min-width: 0;
      }

      .bild-zeichen {
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        flex: none;
      }
      .bild-zeichen img {
        width: 100%;
        height: 100%;
        display: block;

        object-fit: contain;
      }
      .bild-text { min-width: 0; }

      .bild-titel,
      .bild-unter {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bild-titel {
        font-size: var(--se-fs-lg);
        font-weight: 600;
        line-height: 1.25;
      }
      .bild-unter {
        color: var(--se-muted);
        font-size: var(--se-fs-sm);
        line-height: 1.35;
      }

      /* Schlank (G5, Nutzer-Entscheidung): kein Tafel-Rahmen, engere
         Polster — die Tabelle liegt buendig auf der Maske. */
      .tabelle.schlank {
        border: 0;
        border-radius: 0;
        background: transparent;
      }
      .tabelle.schlank .kopf > div,
      .tabelle.schlank .zeile > div { padding: 0 6px; }
      .tabelle.schlank .suchzeile { padding: 4px 6px; }

      .fusszeile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 10px;
        border-top: var(--se-border) solid var(--se-line);
        font-size: var(--se-fs-sm);
        color: var(--se-muted);
      }
      .seiten-nav {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      /* Die Summen stehen rechts neben der Zaehlzeile — Titel blass, Wert
         kraeftig, Ziffern in fester Breite, damit die Kante steht. */
      /* Aenderbare Zelle: ruhig, bis die Zeile darunter liegt — wie in der
         Handmaske (dort .zi.still). Vorgemerkt = bernstein, damit man auf
         einen Blick sieht, was noch nicht geschrieben ist. */
      /* Zum Loeschen vorgemerkt: durchgestrichen und blass — die Zeile ist
         noch da, aber sie geht. Zurueckgenommen wird sie am selben Kreuz. */
      .zeile.geloescht > div { text-decoration: line-through; color: var(--se-muted); }

      /* Der Zeilen-Status ist EIN Balken links, sonst nichts: keine Worte in
         der Zeile (Nutzer-Vorgabe). Er steht NACH .gewaehlt, weil er den
         Auswahl-Balken schlagen muss — was noch nicht geschrieben ist, ist
         die dringendere Auskunft. Der Klartext haengt im title. */
      .zeile[data-status="erfasst"] {
        box-shadow: inset 3px 0 0 var(--se-accent);
        background: var(--se-accent-soft);
      }
      .zeile[data-status="geaendert"],
      .zeile[data-status="loeschung"] { box-shadow: inset 3px 0 0 var(--se-amber); }
      .zeile[data-status="loeschung"] { background: var(--se-red-shell); }
      .zeile[data-status="schreibt"] {
        box-shadow: inset 3px 0 0 var(--se-accent);
        animation: se-schreibt 1.1s ease-in-out infinite;
      }
      .zeile[data-status="fehler"] {
        box-shadow: inset 3px 0 0 var(--se-red);
        background: var(--se-red-shell);
      }
      @keyframes se-schreibt { 50% { opacity: 0.55; } }
      @media (prefers-reduced-motion: reduce) {
        .zeile[data-status="schreibt"] { animation: none; }
      }

      /* Das Kreuz sitzt am rechten Rand der Zeile, ueber dem letzten Feld. */
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

      /* Treffer der Suchzeile: gelb hinterlegt, Schriftfarbe bleibt — wie in
         der Handmaske (dort <mark> mit #ffedb0). */
      mark {
        padding: 0 1px;
        color: inherit;
        background: var(--se-amber-soft);
        border-radius: 2px;
      }

      /* Eine tippbare Zelle ist eine ZELLE, kein Formularfeld — weder im
         Ruhezustand noch unter der Maus noch mit der Schreibmarke darin.
         Dass man "drin" ist, sagt allein die blinkende Marke, wie in einer
         Tabellenkalkulation (Nutzer-Ansage 2026-08-28: "weg damit"). Vorher
         zog Hover einen Rahmen und Fokus einen zweiten in Akzentfarbe; in
         einer Zeile mit sechs tippbaren Spalten flackerte beim Ueberfahren
         die halbe Zeile.

         Der transparente Rahmen BLEIBT: er haelt die Hoehe. Ohne ihn springt
         der Text um einen Pixel, sobald die Zelle den Zustand wechselt.

         Gilt fuer die gebuchte Zeile (.zell-eingabe) und die Erfassungszeile
         (.erf-eingabe) gemeinsam — es ist dieselbe Sache, und zwei Kopien
         liefen beim ersten Aendern auseinander. */
      .zell-eingabe,
      .erf-eingabe {
        box-sizing: border-box;
        width: 100%;
        height: calc(var(--zeilen-hoehe) - 8px);
        min-width: 0;
        padding: 0 4px;
        font-family: var(--se-font);
        font-size: var(--se-fs);
        color: var(--se-ink);
        background: transparent;
        border: var(--se-border) solid transparent;
        border-radius: var(--se-r-sm);
      }
      .zell-eingabe:focus,
      .erf-eingabe:focus { outline: none; }
      .zeile > div.zahl .zell-eingabe,
      .zeile > div.zahl .erf-eingabe { text-align: right; }
      .erf-eingabe::placeholder { color: var(--se-faint); }

      /* Die Vormerkung ist etwas anderes als ein Eingabefeld: sie sagt, dass
         hier etwas UNGESCHRIEBENES steht, und muss sichtbar bleiben. */
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
        margin-left: auto;
        padding-left: 12px;
      }
      .summen + .seiten-nav { padding-left: 12px; }
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

      .steuerung { display: none; }
      :host([data-ff-editor]) .steuerung {
        position: absolute;
        top: 3px;
        right: 3px;
        z-index: 2;
        display: inline-flex;
        gap: 4px;
      }
      .steuerung button {
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        line-height: 1;
        padding: 3px 7px;
        border: var(--se-border) solid var(--se-line);
        border-radius: var(--se-r-sm);
        background: var(--se-panel);
        color: var(--se-muted);
        cursor: pointer;
      }
      .steuerung button:hover {
        border-color: var(--se-accent);
        color: var(--se-accent);
      }
`
