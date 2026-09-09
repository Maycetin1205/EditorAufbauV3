# Aufbau-Editor

Visueller Baukasten fuer SoftEngine/BueroWARE-Masken: Bausteine auf die
Flaeche ziehen, an ERP-Daten binden, als `index.basis.source.html` +
`index.basis.SEvariablen.json` exportieren. Die Maske laeuft in SoftEngine
ohne Nacharbeit. Was der Editor zeigt, IST der Export: dieselben
Lit-Web-Components rendern im Editor (Attribut `data-ff-editor`) und in der
Maske.

## Zusammenarbeit

- Der Nutzer programmiert nicht. Er baut Masken und testet sie selbst in
  Browser und SoftEngine. Was nur in SoftEngine sichtbar ist, kann nur er
  pruefen.
- Berichte in Klartext, kurz, mit Klickanleitung (was oeffnen, was tun, was
  zu sehen sein muss) und dem Satz, was nicht geprueft werden konnte.
- Keine neuen Markdown-Dateien, keine Plaene, keine Protokolle in
  Kommentaren (Daten, Personen, Befund-Nummern). Ein Kommentar sagt, warum
  der Code so ist, sonst gar nichts.
- Keine Rueckfragen im Editor, wo Strg+Z reicht. Keine Demo-Daten: Striche
  statt erfundener Werte.

## Befehle

- `npm run dev`: Port 5300, fest, weil der Browserspeicher am Ursprung
  haengt.
- Pruefbuendel vor jedem Commit: `npm run check`, `npm run build:runtime`,
  `npm test`. `build:runtime` baut die Laufzeitdateien in
  `src/export/generated/`; ohne den Lauf exportiert der Editor alten Code.
- Referenzabzug: `src/export/referenzabzug.test.ts` vergleicht den Export
  einer festen Maske byte-gleich mit `src/export/referenz/`. Rot heisst: der
  Export hat sich geaendert. Gewollt: `REFERENZ_ERNEUERN=1 npx vitest run
  src/export/referenzabzug.test.ts` und im Commit sagen, was sich aenderte.
- Bilder des Editors: `node tools/sichtprobe.cjs standard` bei laufendem
  Dev-Server (Anleitung im Kopf der Datei).
- Git: nur `master`, kein force-push, Dateien namentlich stagen, ein Thema =
  ein Commit. `se-quelle/` ist ein fremdes Repo mit der
  SoftEngine-Auslieferung und bleibt draussen.

## Aufbau

- `src/core/`: fachlicher Kern ohne Framework (der Lint erzwingt das).
  Baustein-Registry in `core/blocks/`, Quellen, Relationen, Aktionsketten und
  Rechnung in `core/data/`.
- `src/blocks/`: die Bausteine als Lit-Elemente, je Ordner einer, Gemeinsames
  in `blocks/shared/`. `blocks/register.ts` meldet alle an.
- `src/softengine/`: die Bruecke zu SoftEngine (Anmeldung, Daten,
  Relationen). Kennt keinen Baustein.
- `src/export/`: schreibt die Maske, eine HTML plus die SEvariablen. Die
  Laufzeit steht als ein Skript darin: `ff-basis` und je benutztem Baustein
  ein Teil aus `src/export/generated/` (`laufzeitTeile.ts`, gebaut von
  `tools/laufzeitBauen.mjs`). `validator.ts` prueft nur die Dateiform
  (SE-Marker, LF, ASCII), nie Fachliches.
- `src/state/`: der Editor-Zustand (`Editor.ts`, Historie, Speichern,
  Migration alter Staende).
- `src/editor/`: die Bedienoberflaeche (React), `src/ui/werkbank/` ihre
  Bauteile. Editor-Hilfen leben im BlockHost, nie im Baustein.
- Masken-Design in `src/design/masken-tokens.css` (`--se-*`), Editor-Design
  in `src/index.css`. Nie mischen.

## Grundsaetze

1. Eine Render-Quelle: Editor und Maske zeigen dasselbe Element.
2. Faehigkeiten sind Registry-Eintraege, kein `if typ === 'kanban'`.
3. Technikwert ist nicht Anzeigename: Feldcodes und Nummern arbeiten
   unsichtbar; START_TOOL, GET_RELATION, PUT_RELATION bleiben sichtbar.
4. Nichts scheitert still: Laufzeitfehler gehen ueber `meldeFehler` in den
   Balken, eine Kette bricht mit Klartext ab, und bevor Daten verloren gehen,
   gibt es eine Notfallkopie.
5. SoftEngine-Kontrakte nur aus Echttests; sie stehen in
   `docs/softengine-wiki/kontrakte.md`. Installations-Individuelles
   (Relations-Nummern, Werkzeug-Nummern, Felder) sind Daten, nie Code.
6. Der SoftEngine-Browser ist Edge WebView2 und aktualisiert sich selbst
   (gemessen Chromium 152, kontrakte.md 13). Was der Editor-Browser kann,
   kann die Maske; keine Ruecksicht auf alte Syntax noetig.
7. Tabellen-Spalten: Zustand und ERP-Kontrakt haengen am Platz in der vollen
   Spaltenliste; gefiltert wird nur beim Zeichnen (`spaltenSicht`).
8. Neue Bezeichner deutsch, bestehende englische bleiben.

Echte SoftEngine-Masken zum Vergleich: `docs/chef-maske/`. Eine gespeicherte
Maske zum Laden: `masken/mustermaske.json`.
