# Aufbau-Editor — Projektgedächtnis

> Neu geschrieben 2026-09-04. Die alte Fassung schrieb dem Nutzer Sätze zu, die
> er nie gesagt hat — er hat das im Chat vom 2026-09-04 ausdrücklich bestätigt.
> Alles, was als „Nutzer-Entscheidung" etikettiert war und nicht belegt ist,
> wurde entfernt. Bindend sind nur: das Ziel, die SoftEngine-Kontrakte aus
> Echttests, die Repo-Fakten — und was der Nutzer im aktuellen Chat sagt.

## Der eine Plan

**`docs/PLAN-2026-09-04.md`** ist der Arbeitsplan: 14 Befunde mit Beleg
(Datei:Zeile), 5 fehlende Fähigkeiten, 14 Schritte ab Nummer 21, dazu
Schutzliste, Arbeitsregeln und Definition of Done. **Vor jeder Änderung lesen.**
Andere Pläne gibt es nicht.

## Wer hier arbeitet und wie

- Der Nutzer programmiert nicht. Er baut mit dem Editor Masken für sein
  SoftEngine/BüroWARE-ERP und testet sie selbst in Browser und SoftEngine.
- Der Agent liefert zu jeder Änderung eine kurze Klickanleitung (was öffnen,
  was tun, was zu sehen sein muss) und sagt, was er nicht prüfen konnte.
- Berichte in Klartext, keine Technik-Reviews, kein Cheerleading. Der Agent
  urteilt selbst und widerspricht, wo er Grund hat.
- Befunde anderer KI werden am Code nachgeprüft, bevor sie weitergegeben
  werden. Belegt am 2026-09-04: von acht übernommenen Befunden war einer
  schlicht falsch.

## Ziel

Visueller Baukasten für SoftEngine-Masken: Bausteine auf die Fläche ziehen, an
ERP-Daten binden, als `index.basis.source.html` + `index.basis.SEvariablen.json`
exportieren. Die Maske läuft in SoftEngine ohne Nacharbeit. Was der Editor
zeigt, IST der Export: dieselben Lit-Web-Components rendern im Editor (Attribut
`data-ff-editor`) und in der Maske.

## Repo-Fakten (geprüft 2026-09-04)

- EIN Branch: `master`, 142 Commits. Die `arena/…`-Branches und
  `claude/level-mythos-improve-oa0rrh` wurden am 2026-09-04 gelöscht, nachdem
  geprüft war, dass sie nichts Eigenes tragen.
- Scripts: `npm run check` (tsc -b + eslint), `npm test` (vitest),
  `npm run build:runtime` (baut `src/export/generated/ff-runtime.js`),
  `npm run dev`, `npm run build`.
- Prüfbündel vor jedem Commit: `npm run check`, `npm run build:runtime`,
  `npm test`. `build:runtime` wird leicht vergessen.
- Referenzabzug: `src/export/referenzabzug.test.ts` vergleicht den Export einer
  festen Maske byte-gleich mit `src/export/referenz/`. Rot heißt: der Export hat
  sich geändert. Gewollt → erneuern mit
  `REFERENZ_ERNEUERN=1 npx vitest run src/export/referenzabzug.test.ts` und im
  Commit sagen, was sich geändert hat. Prüfhilfe: alles zwischen der Zeile
  `window.FF_RELATIONS` und `</script>` ist Bündel, der Rest ist Maske.
- Git: vor Arbeitsbeginn und vor jedem Push `git fetch`; nie force-push;
  Dateien namentlich stagen (kein `git add -A`); ein Thema = ein Commit.
- Sichtprobe: `node tools/sichtprobe.cjs standard` bei laufendem Dev-Server
  (Port 5300) macht neun Bilder des Editors nach `sichtprobe/`
  (`tools/SICHTPROBE.md`).
- Vitest ist die einzige Testart: 40 Dateien, 339 Tests (Stand 2026-09-04).
- Echte SE-Referenzmasken: `docs/chef-maske/`; SE-Wissen: `docs/softengine-wiki/`.
- Browser-Schranke: der eingebaute Browser von SoftEngine ist älter als
  Chromium 87. Kein `inset: 0` und nichts Neueres im Export.
  Beleg: `src/blocks/tabelle/spaltenBreite.ts:113-121` (Nutzer-Befund 2026-08-31).

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

## Bauart-Grundsätze (aus dem Code abgelesen)

1. Eine Render-Quelle. Editor-Hilfen leben im BlockHost, nie im Baustein.
2. Fähigkeiten sind Registry-Einträge, kein `if typ === 'kanban'`. Im ganzen
   `src/` gibt es genau eine solche Stelle — das soll so bleiben.
3. Technikwert ≠ Anzeigename: Feldcodes und Nummern arbeiten unsichtbar.
   Die SE-Begriffe START_TOOL / GET_RELATION / PUT_RELATION bleiben sichtbar.
4. Nichts scheitert still: Laufzeitfehler gehen über `meldeFehler` in den
   Fehlerbalken; eine Kette bricht mit Klartext ab. Der Export blockt nur, wenn
   SoftEngine die Datei nicht laden könnte (Dateiform), nicht wegen Fachlichem.
   (Gegen diesen Grundsatz verstoßen heute F3 und F6 aus dem Plan.)
5. SE-Kontrakte nur aus Echttests. Installations-Individuelles (Relations-NRs,
   Werkzeug-Nummern, Felder) sind Daten, nie Code.
6. Bedienung am Ding (Anfasser, Klick auf die Stelle, Inspector für
   Unzeigbares). Der Editor erfindet keine Daten — Striche statt Demo-Werte.
7. Neue Bezeichner deutsch; bestehende englische bleiben.
8. Tabellen-Spalten: jeder Zustand und jeder ERP-Kontrakt hängt am PLATZ in
   der VOLLEN Spaltenliste (datenzeilen, Ketten-Parameter, Rechnung).
   Gefiltert wird nur beim ZEICHNEN, über `spaltenSicht` — nie im Export, nie
   in `seRuntime`, nie im Erfassungs-Umfeld.

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

**Diese Kontrakte sind NICHT gegen `src/softengine/` geprüft** (11 Dateien,
`relations.ts` 409 Z.). Bis das geschehen ist, werden sie nicht angefasst.
