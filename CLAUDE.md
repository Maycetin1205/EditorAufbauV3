# Aufbau-Editor — Projektgedächtnis

> Neu geschrieben 2026-09-02 nach Nutzer-Ansage. Die alte Fassung (git-Historie
> bis `4fe9e88`) bestand aus KI-generierten Regeln, Ritualen und als
> „Nutzer-Entscheidung" etikettierten KI-Deutungen. **Nichts davon ist bindend.**
> Bindend sind nur drei Dinge: das Ziel, die SoftEngine-Kontrakte aus Echttests
> (unten), und was der Nutzer im aktuellen Chat sagt.

## Wer hier arbeitet und wie

- Der Nutzer programmiert nicht. Er baut mit dem Editor Masken für sein
  SoftEngine/BüroWARE-ERP und testet sie selbst in Browser und SoftEngine.
  Der Agent liefert zu jeder Änderung eine kurze Klickanleitung (was öffnen, was
  tun, was zu sehen sein muss) und sagt, was er nicht prüfen konnte.
- Der Agent urteilt selbst, kritisch und sachlich, ohne Cheerleading. Berichte
  im Chat, in Klartext, keine Technik-Reviews. Verbesserungsvorschläge nur, wenn
  sie den Auftrag betreffen oder der Nutzer fragt.
- Der Agent darf den Dev-Server starten und Screenshots machen, wenn das dem
  Urteil dient (Nutzer 2026-09-02). Token-sparsam arbeiten (Nutzer 2026-09-01).
- `PLAN.md` ist der EINE Plan: Zielbild, Rahmen für jeden Chat, Schritte mit
  Prüfung und Klickprobe. Ein Chat arbeitet genau einen Schritt ab. Neue
  Pläne gibt es nicht (Nutzer 2026-09-02). Chroniken leben in git.

## Ziel

Visueller Baukasten für SoftEngine-Masken: Bausteine auf die Fläche ziehen, an
ERP-Daten binden, als `index.basis.source.html` + `index.basis.SEvariablen.json`
exportieren. Die Maske läuft in SoftEngine ohne Nacharbeit. Was der Editor
zeigt, IST der Export: dieselben Lit-Web-Components rendern im Editor (Attribut
`data-ff-editor`) und in der Maske.

## Repo-Fakten (geprüft 2026-09-02)

- EIN Branch: `master` (Nutzer 2026-09-02). Der Arbeits-Branch
  `claude/level-mythos-improve-oa0rrh` ist in `master` aufgegangen.
  Halbfertiges liegt nur als Patch unter `docs/wip/`, nie als Branch.
- Scripts: `npm run check` (tsc -b + eslint), `npm test` (vitest),
  `npm run build:runtime` (baut `src/export/generated/ff-runtime.js`),
  `npm run dev`, `npm run build`. Andere Wächter-Scripts gibt es nicht.
- Prüfbündel vor jedem Commit: `npm run check`, `npm run build:runtime`,
  `npm test`. Berührt eine Änderung `src/blocks/`, `src/softengine/` oder
  `src/core/data/`, ändert sich das Bündel — das ist normal.
- Referenzabzug: `src/export/referenzabzug.test.ts` vergleicht den Export einer
  festen Maske byte-gleich mit `src/export/referenz/`. Rot heißt: der Export hat
  sich geändert. Gewollt → erneuern mit
  `REFERENZ_ERNEUERN=1 npx vitest run src/export/referenzabzug.test.ts` und im
  Commit sagen, was sich außerhalb des Bündels geändert hat. Ungewollt → Fehler
  suchen. Prüfhilfe: alles zwischen der Zeile `window.FF_RELATIONS` und
  `</script>` ist Bündel, der Rest ist Maske.
- Git: vor Arbeitsbeginn und vor jedem Push `git fetch`; nie force-push;
  Dateien namentlich stagen (kein `git add -A`); ein Thema = ein Commit.
- Sichtprobe: `node tools/sichtprobe.cjs standard` bei laufendem Dev-Server
  (Port 5300) macht neun Bilder des Editors nach `sichtprobe/`; Pflicht vor
  jedem Commit, der Editor oder Bausteine berührt (`tools/SICHTPROBE.md`).
- Vitest ist die einzige Testart. Bestehende Tests wachsen mit echten
  Änderungen; neue Test-Gattungen (Browser, Komponenten) nur nach Absprache.
- Es gibt keinen Ordner `designsprache/`, keine `docs/ARCHI.md`. Echte
  SE-Referenzmasken: `docs/chef-maske/`; SE-Wissen: `docs/softengine-wiki/`.

## Wichtige Stellen

- Store: `src/state/Editor.ts` (Zustand + Methoden; Fächer: treeOps, history,
  persistence, migrations, migrationenRoh, ladeKette, rasterOps, selectionOps,
  quellenOps). Eine Instanz über `src/app/providers.tsx`; Bibliotheken
  `DataSourceStore`/`RelationStore` sind Modul-Singletons.
- Registry: `src/core/blocks/` (BlockDefinition: acceptsDataSource, satzWahl,
  kannErfassen, kannLoeschen, listenBindung, bindableSpots, actionValueSpots,
  blockEvents, raster). Bausteine: `src/blocks/`. Aktions-/Quellen-Modell:
  `src/core/data/`.
- Export: `src/export/exportMask.ts` + `validator.ts` (SE-Marker, LF, ASCII).
  Escaping macht `serializer.ts`; im Quellcode sind Umlaute überall erlaubt.
- SE-Schicht (kennt keinen Baustein): `src/softengine/` (bridge, relations,
  data, relationLader). Ketten-Laufzeit: `src/blocks/shared/seAktionen.ts`.
  Auswahl über Bausteine: `src/blocks/shared/auswahl.ts` + `holendeQuellen.ts`.
  Die eine Baustein-Kennung in der Maske: `data-ff-block-id`.
- Design: Masken-Tokens `src/design/masken-tokens.css` (`--se-*`, Türkis-Akzent,
  Navy-Leiste), Editor-UI `src/index.css` (hell, Lila-Akzent). Nie mischen.

## Bauart-Grundsätze (aus dem Code abgelesen, haben sich bewährt)

1. Eine Render-Quelle. Editor-Hilfen leben im BlockHost, nie im Baustein.
2. Fähigkeiten sind Registry-Einträge, kein `if typ === 'kanban'`.
3. Technikwert ≠ Anzeigename: Feldcodes und Nummern arbeiten unsichtbar.
   Die SE-Begriffe START_TOOL / GET_RELATION / PUT_RELATION bleiben sichtbar.
4. Nichts scheitert still: Laufzeitfehler gehen über `meldeFehler` in den
   Fehlerbalken; eine Kette bricht mit Klartext ab. Der Export blockt nur, wenn
   SoftEngine die Datei nicht laden könnte (Dateiform), nicht wegen Fachlichem.
5. SE-Kontrakte nur aus Echttests. Installations-Individuelles (Relations-NRs,
   Werkzeug-Nummern, Felder) sind Daten, nie Code.
6. Bedienung am Ding (Anfasser, Klick auf die Stelle, Inspector für
   Unzeigbares). Der Editor erfindet keine Daten (Striche statt Demo-Werte;
   echte Nutzer-Entscheidung 2026-09-02: keine Beispieldaten, auch nicht als
   Schalter).
7. Neue Bezeichner deutsch; bestehende englische bleiben.

## SoftEngine-Kontrakte (aus Echttests des Nutzers — nie verlieren)

- Export-Dateien `index.basis.source.html` + `index.basis.SEvariablen.json`,
  LF-only, reines ASCII (Escaping maschinell). Jeder Export lädt
  `<!--SOFTENGINE-VAR!EditorPfad-->/JS/JS/basis.html.interface.js`; die Datei
  existiert und arbeitet (Echttest 2026-07-28, WinUI), ob der Tag NÖTIG ist,
  ist unbelegt. Ein Skript im Maskenordner (`<script src="fftest.js">`) wird
  ebenfalls geladen (2026-08-28); daraus ist nichts gebaut.
- SoftEngine SCHIEBT Daten: `basisHTML_REGISTER(cb, document.title, '1.0')`
  mit Retry (25 ms × 400); jeder Push hydriert neu. Fallbacks:
  `message { MSG: { DATA } }`, SEDATA-Poll. `document.title` = Maskenname.
- Zeilen-Properties tragen Tabellen-Präfix (`IDBID0001_253_30`); Schlüssel-
  Scan gleich / Präfix `code_` / Endung `_code`, für Lesen und Schreiben.
- Schreiben: `basisHTML_SND_MSG('PUT_RELATION', { NR, PARAMS })`, PARAMS =
  `[pos, len, art, pindex, relId, wert]`; art `'L'` Text, `'D'` Datum,
  `'Z'` Uhrzeit; relId OHNE `IDB`-Präfix (`ID0001`). PUT ist Einweg, meldet
  nichts zurück. NR 174 ist nur die mitgelieferte Vorlage.
- `pindex` = SATZNUMMER des Zielsatzes (2026-08-27). Kette
  `GET_RELATION[640!<IDBID>]` → neue Satznummer → `PUT_RELATION[174!…!<Satznr>!…]`.
- Anlegen (Log 2026-08-12, WinUI): neuer IDB-Satz `GET_RELATION[640!<IDBID>]`
  → Satznummer; neuer Beleg `GET_RELATION[1020!<BELART>!!<ADRNR>!!!!]` → Beleg-
  Index (`0NL26105743`: Byte 3 Belegart, ab Byte 4 Nummer); Bedienername
  `GET_RELATION[43!_BNR_!3!30]`; neue Belegposition
  `PUT_RELATION[82!0!L!<Belegnr>!!<ArtNr>!!<Menge>]` (Bedeutung der `0` und
  Leerstellen ungedeutet — am Log prüfen, nicht raten).
- GET-Antworten kommen über den REGISTER-Callback (vereinheitlicht BWMSG und
  WWMSG); `SEDATA.Message<N>` ist Rückfallweg. Immer nur EINE GET-Anfrage in
  Flug. Nie direkt auf BWMSG lauschen. Eine leere Antwort `{"RESULT":""}` ist
  eine Antwort (kein Treffer), kein Schweigen.
- START_TOOL: `sendBWLinkIntern('0,START_TOOL,<nr>[,params URL-kodiert]')`,
  Fallback `basisHTML_SND_MSG`. Werkzeug-Nummern je Installation.
- SEvariablen: IDB → SEFILELOOP mit pos_len-Liste der BENUTZTEN Felder
  (bestätigt 2026-08-12; `*` erzeugte tausende Bild-Nachschläge, 9,2 s);
  Stamm (ADR/ART/BEL) → explizite pos_len-Liste. MEMTAB kommt in keiner echten
  Maske vor; ERPAPICALL erst bauen, wenn die Form an einer echten Maske belegt
  ist — per `basisHTML_SND_MSG` friert es die WinUI-Maske ein.
- Die REIHENFOLGE der SEFILELOOP-Einträge ist Kontrakt (A/B-Test 2026-08-11):
  ein Kopfsatz-Loop (POS) an erster Stelle → KEINE Quelle liefert. Der Export
  schreibt Kopfsatz-Arten zuletzt (`loopReihenfolge`, `core/data/dataSources.ts`).
- Positionen zur Laufzeit: Relation 69 liefert je Ruf EIN Feld einer Position
  (`[BELART, POS, LEN, BELNR, JAHR, ARCHIV, '', POSNR, '', '', '', '']`),
  2–19 ms; JAHR/ARCHIV = BEL-Felder 0_1/1_1; POS=0/LEN=255 holt die vordere
  Zeile in einem Ruf; Ende: 11_6 UND 18_25 leer. Immer seriell.
- Nebenbeobachtung: `CONECT` wird zweimal gesendet, Empfang trotzdem ein Paket.

## Entscheidungen des Nutzers

- „Rechnung" (Abgabemenge = Anzahl × Dosis × Tage, `core/data/rechnung.ts` +
  `editor/zentrale/RechnungenBereich.tsx`): **bleibt, ist dem Nutzer wichtig**
  (Nutzer 2026-09-02). Offen ist nur der Ort ihrer Bedienung (heute ein
  Datencenter-Reiter, obwohl sie die Erfassungszeile EINER Tabelle betrifft).
