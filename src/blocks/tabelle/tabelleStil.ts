import { css } from 'lit'

export const tabelleStil = css`
      :host { min-width: 0; height: 100%; }

      .tabelle {
        /* Die zwei Zahlen, aus denen sich jedes Zell-Polster ergibt. Nur
           hier stehen sie. */
        --se-zell-x: 10px;
        --se-eingabe-x: 4px;

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

        /* Die Kopfzeile klebt IM Rumpf, teilt sich also jede Breite mit den
           Zeilen: die Leiste kann keine Spalte gegen den Kopf verschieben.
           Darum kein Gutter — reservierter Platz waere eine Luecke, die bei
           kurzen Listen dauerhaft neben der letzten Spalte steht. */
        scrollbar-width: thin;
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

      /* Zebra: jede zweite Datenzeile leicht getoent. Die Zeile bringt die
         Klasse mit, gezaehlt wird nach ihrer NUMMER in der Ansicht. Vorher
         zaehlte nth-child alle Kinder des Rumpfes mit — die Toenung kippte
         also um eine Zeile, sobald die Kopfzeile abgeschaltet war oder die
         Erfassungszeile (ohne Quelle) vorne stand.

         Bewusst ohne den Rumpf-Vorsatz: so bleibt die Regel gleich stark wie
         die Status-Farben weiter unten, und die stehen spaeter — eine
         vorgemerkte Zeile behaelt damit ihre Kennfarbe. */
      .zeile.zebra {
        background: var(--se-zebra);
      }

      /* Nur eine Zeile OHNE Status faerbt sich unter der Maus. Sonst wischte
         der Hover die Kennfarbe genau in dem Moment weg, in dem der Bediener
         mit dem Zeiger hinfaehrt, um sie anzusehen — die Farbe IST die
         Auskunft. Dasselbe Muster wie bei .gewaehlt weiter unten. */
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
      .koerper > .zeile.gewaehlt:hover {
        background: var(--se-auswahl);
        box-shadow: inset 3px 0 0 var(--se-accent);
      }
      .zeile.gewaehlt > div { color: var(--se-ink); }
      /* Die Textkante JEDER Zelle — eine Zahl, eine Stelle. Eine Zelle mit
         Eingabefeld gibt ihr Polster an das Feld ab (siehe .tippbar weiter
         unten); dessen eigenes Polster plus sein Rahmen ergeben wieder
         dieselbe Kante. Vorher stand der Text einer tippbaren Zelle 15px vom
         Rand, der ihrer Nachbarin 10px — in derselben Zeile. */
      .kopf > div,
      .zeile > div {
        padding: 0 var(--se-zell-x);
        line-height: calc(var(--zeilen-hoehe) - 1px);
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-right: 1px solid var(--se-line-soft);
      }

      .kopf > div { line-height: calc(var(--takt) - 1px); }

      /* Die Herkunfts-Zeile unter dem Spaltentitel — NUR im Editor.
         Die Kopfzeile traegt oben eine FESTE Hoehe (var(--takt)); ohne das hier
         schneidet sie die zweite Zeile schlicht ab. Der Kopf darf darum im
         Editor wachsen; die Zeilenrechnung traegt das, weil sie die Kopfhoehe
         misst (rumpfMessung liest offsetHeight). In der exportierten Maske
         bleibt alles, wie es war — dort gibt es die Zeile gar nicht. */
      :host([data-ff-editor]) .kopf {
        height: auto;
        min-height: var(--takt);
      }
      .kopf > div.mit-herkunft {
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.3;
        padding-top: 4px;
        padding-bottom: 4px;
      }
      /* Beide Zeilen kuerzen sich selbst. Als Flex-Kinder greift das
         text-overflow der Zelle nicht mehr auf sie durch. */
      .kopf-titel,
      .kopf-herkunft {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kopf-herkunft {
        font-size: var(--se-fs-sm);
        font-weight: 400;
        color: var(--se-faint);
      }
      /* Die letzte ZELLE, nicht das letzte Kind: hinter den Zellen stehen noch
         die Greifstreifen (Kopf) bzw. das Loeschkreuz (Zeile). Mit
         :last-child traf die Regel dann gar nichts mehr, und die letzte Spalte
         behielt ihren Trennstrich vor der Tafelkante. */
      .kopf > div:last-of-type,
      .zeile > div:last-of-type { border-right: none; }
      .kopf > div {
        cursor: pointer;
        user-select: none;

        /* Traeger des Greifstreifens (unten). */
        position: relative;
      }

      /* Der Greifstreifen ist ein eigenes Kind der Kopfzeile und sitzt in
         derselben Gitter-Spur wie die Kopfzelle links von ihm (grid-column am
         Element). justify-self haelt ihn an deren Ende, der negative Rand
         schiebt ihn ueber die Linie: 11px breit, 6px links und 5px rechts.
         Eine 1px-Linie trifft man mit der Maus nicht — und wer sie anvisiert,
         zielt auf die Mitte, nicht 5px daneben.

         Er liegt bewusst NICHT in der Kopfzelle (die schneidet ihren
         Ueberhang ab, overflow: hidden — samt Trefferflaeche) und auch nicht
         in einer eigenen Lage darueber: eine Lage braucht inset oder vier
         Kanten und einen zweiten Satz Spalten-Spuren. So haengt er an genau
         derselben Gitter-Rechnung wie der Kopf und braucht nichts, was die
         Tabelle nicht ohnehin schon braucht. */
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

      /* Das Kreuz am Spaltenkopf — nur im Editor, und nur unter der Maus.
         Es sitzt LINKS vom Greifstreifen, sonst laegen Streichen und Ziehen
         auf demselben Fleck. Dieselbe Machart wie das Kreuz an der Zeile
         (.zeile-weg weiter unten): unsichtbar, bis jemand hinfaehrt. */
      .kopf-weg {
        position: absolute;

        /* Abstand zum Greifstreifen (der reicht bis 6px links der Linie):
           bei 10px lagen Ziehen und Loeschen 2px auseinander — zwei Pixel
           zwischen "Spalte breiter" und "Spalte weg" (gemessen 2026-08-31). */
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 3px;
        font-family: var(--se-font);
        font-size: var(--se-fs-sm);
        line-height: 1;
        color: var(--se-faint);
        background: var(--se-panel-2);
        border: 0;
        border-radius: var(--se-r-sm);
        cursor: pointer;
        opacity: 0;
      }
      .kopf > div:hover .kopf-weg,
      .kopf-weg:focus { opacity: 1; }
      .kopf-weg:hover { color: var(--se-red); background: var(--se-red-soft); }

      /* Spalte am Kopf ziehen (nur Editor): die Einfuege-Stelle zeigt sich
         als Strich an der Zellkante — links der Zelle, vor der eingefuegt
         wird; hinter der letzten an deren rechter Kante. Die gezogene Spalte
         wird blass. */
      .kopf > div.zug-quelle { opacity: 0.4; }
      .kopf > div.zug-slot { box-shadow: inset 3px 0 0 var(--se-accent); }
      .kopf > div.zug-slot-ende { box-shadow: inset -3px 0 0 var(--se-accent); }
      .sort-pfeil { font-size: 9px; color: var(--se-muted); }

      /* Nur im Editor: diese Spalte ist in der Maske tippbar. */
      .kopf-tippbar {
        margin-left: 4px;
        font-size: var(--se-fs-xs);
        font-weight: 400;
        color: var(--se-muted);
      }

      .zeile > div { color: var(--se-ink); }


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
      /* Hinausgeschickt: derselbe Balken wie eine Vormerkung, nur blass — die
         Zeile ist erledigt, aber noch unbestaetigt. Kein Wort in der Zeile. */
      .zeile[data-status="geschrieben"] {
        box-shadow: inset 3px 0 0 var(--se-faint);
        color: var(--se-muted);
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

      /* Im Editor steht das Kreuz still da: es zeigt, dass Loeschen an ist. */
      .zeile-weg.zeile-weg-anzeige { opacity: 1; cursor: default; }

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
      /* Die Zelle, die ein Eingabefeld traegt, gibt ihr Polster an das Feld
         ab — zusammen ergeben sie wieder --se-zell-x. Ohne diese Regel steht
         der Text einer tippbaren Zelle um Feld-Polster plus Rahmen weiter
         rechts als der ihrer Nachbarin. */
      .zeile > div.tippbar,
      .zeile.erfassung > div {
        padding: 0 calc(var(--se-zell-x) - var(--se-eingabe-x) - var(--se-border));
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
