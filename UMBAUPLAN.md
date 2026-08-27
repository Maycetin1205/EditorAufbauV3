# UMBAUPLAN EditorAufbauV3 — Belegerfassung fertig + Editor-UI komplett neu

Stand: 2026-08-27. Entscheidung: **V3 weiterbauen, kein Neubau.** PageBuilder (C:\Users\mu.aycetin\Desktop\PageBuilder) ist eingefroren und dient nur noch als Wissensspender.

Dieser Plan ist der Arbeitsauftrag. Etappen strikt in Reihenfolge, jede endet mit einem Commit. Beim Abarbeiten Haken in diese Datei setzen — sonst wird sie nicht angefasst.

---

## Verbote (gelten für jede Etappe)

1. **Keine neuen Markdown-Dateien.** Am Ende existieren genau zwei: `CLAUDE.md` (wiederhergestellt) und dieser Plan. Kein README-Neuschrieb, keine Konzeptpapiere, keine "NOTES".
2. **Keine Kommentar-Erzählungen.** Ein Kommentar ist nur erlaubt, wenn er einen SoftENGINE-Kontrakt oder ein nicht-offensichtliches Warum festhält (Stil wie in `src/blocks/tabelle/erfassungsLauf.ts:349-357`). Niemals: was die nächste Zeile tut, was geändert wurde, "NEU:", "Fix:".
3. **Keine neuen npm-Abhängigkeiten.** Auch keine UI-Bibliothek für die neue Designsprache — die Atome werden selbst gebaut.
4. **Keine Änderung in `src/core/`, `src/softengine/`, `src/export/` ohne zugehörigen Test** (ab Etappe 1 vorhanden).
5. **Kein `if (type === 'tabelle')` in generischem Code.** Fähigkeiten laufen über `BlockDefinition`/Registry, wie bisher.
6. **500-Zeilen-Deckel pro Datei.** Aktuell verletzt nur `src/blocks/tabelle/TabelleBlock.ts` (797) — wird in Etappe 2 gesplittet.
7. **Deutsche Benennung**, wie im Bestand.

## Pflichten (jede Etappe)

- Vor jedem Commit: `npm run check` grün, ab Etappe 1 auch `npm test` grün.
- Nach jeder Änderung unter `src/blocks/` oder an von dort importierten Dateien: `npm run build:runtime` (das eingecheckte `src/export/generated/ff-runtime.js` veraltet sonst still — größtes praktisches Risiko des Projekts).
- Ein Commit je Etappe, Nachricht = Etappenname.

---

## Etappe 0 — Rettung (Minuten) ✅ Reihenfolge exakt so

1. ✅ `git show HEAD:CLAUDE.md > CLAUDE.md` — das gelöschte Projektgedächtnis zurückholen (enthält alle SE-Kontrakte, Relationsnummern 69/640/1020/82, Feld-Arten L/D/Z, die "nicht wieder vorschlagen"-Liste). `README.md` bleibt gelöscht.
2. ✅ `npm run check` — beantwortet, ob die ~2.000 uncommitteten Zeilen typprüfen. Fehler zuerst beheben.
3. ✅ Alles committen: die uncommitteten Änderungen sind ein zusammenhängendes Feature-Paket "Belegerfassung" (Zeilen ändern/löschen vormerken, offener Satz, Fokus-Nachlauf) — **ein** Commit.
4. ✅ Worktree-Leiche entfernen: `git worktree remove .claude/worktrees/quirky-faraday-9211a0 --force` (vorher prüfen, dass CLAUDE.md aus Schritt 1 identisch ist).
5. ✅ Aus PageBuilder das eine relevante Wissensstück in `CLAUDE.md` nachtragen (Abschnitt SE-Kontrakte, 3–4 Zeilen): **`pindex` = SATZNUMMER des Zielsatzes** (live belegt 27.08., Quelle: PageBuilder/SOFTENGINE-FORMAT.md Abschnitt 8). Keine weiteren Übernahmen.

## Etappe 1 — Wächter (das fehlende Sicherheitsnetz)

`vitest` liegt ungenutzt in den devDependencies. `"test": "vitest run"` in package.json ergänzen.

1. **Export-Wächter scharf schalten:** `src/export/validator.ts` (`validateMaskHtml`) hat aktuell **keinen Aufrufer**. In `exportMask()` bzw. am Export-Knopf (`src/editor/shell/Toolbar.tsx:43-54`) einhängen: schlägt eine Prüfung fehl (CRLF, Non-ASCII, fehlende Marker), bricht der Export mit Klartext ab. Dazu ein Test, der eine kaputte Maske absichtlich durchschickt.
2. **Runtime-Bündel-Wächter:** Test, der `npm run build:runtime`-Output gegen das eingecheckte `src/export/generated/ff-runtime.js` byte-vergleicht. Abweichung = roter Test mit Meldung "build:runtime vergessen".
3. **Logik-Tests** (browserfrei, die Klassen sind dafür geschnitten): `erfassungsLauf` (Tastenentscheid, gleicheAb-Fixpunkt, schluesselWert über Verknüpfungskette), `erfassungsZellen` (passendeSaetze: undefined=unbekannt vs. ''=bekannt-leer), `aenderungen.ts` (Satznummer-Schlüsselung, Rücknahme bei Originalwert), `schrittPruefung` (jede Fehlermeldung einmal), `sevariablen` (Kopfsatz-Loops zwangsweise zuletzt, varZusammen).
4. **Abschnitts-Test für die Ketten-Laufzeit:** `abschnitteVon`/`laufeSchritte` in `src/blocks/shared/seAktionen.ts` — ein Schritt ohne Zeilenbezug hängt am laufenden Abschnitt; zwei Listen in einem Schritt = Fehler; Lauf ist sequenziell.

## Etappe 2 — Aufräumen (Stunden)

1. `src/design/masken-schriften.css` löschen (0 Importeure).
2. `TabelleBlock.ts` (797 Z.) splitten: `zellWert`/`tippeZelle`/`verlasseZelle`/`zelleNachbar`/`tasteZelle` + Änderungs-/Lösch-Getter in neue `src/blocks/tabelle/zeilenBearbeitung.ts`, analog zum Schnitt `erfassungsBedienung.ts`. Deckel wieder eingehalten, Verhalten identisch (Tests aus Etappe 1 bleiben grün).

## Etappe 3 — Zeilen-Lebenszyklus komplettieren (das Kern-Feature)

Was schon existiert und **nicht neu gebaut wird**: drei Vormerk-Listen (`erfassteZeilen`, `geaenderteZeilen` via `aenderungen.ts`, `geloescheZeilen` via `_geloescht`), Löschkreuz pro Zeile, Wegnehmen-Kreuz an erfassten Zeilen, Ketten-Abschnitte mit `erfassungszelle`/`aenderungszelle`/`loeschzelle`, sequenzieller Lauf einmal je Zeile mit PINDEX=Satznummer (`seAktionen.ts:239-314`), `frischeDatenAnfordern()` nach dem Schreiben, "In der Zeile änderbar"-Schalter je Spalte (`spaltenBindung.ts:34`).

Was fehlt:

1. **Zeilen-Status als Laufzeit-Zustand:** je Zeile einer aus `gebucht` (Normalfall, keine Marke), `erfasst`, `geaendert`, `loeschung`, `schreibt`, `fehler`. Anzeige **ausschließlich** als 3px-Statusbalken am linken Zeilenrand (Farben: Vormerkung = Warn-Gelb, schreibt = Akzent pulsierend, fehler = Rot) plus `title`-Tooltip mit Klartext. **Niemals Text-Badges** ("NEU", "geändert" o. ä.) in der Zeile — ausdrückliche Nutzer-Vorgabe.
2. **Lauf-Bericht statt Alles-oder-Nichts:** Heute leert `seAktionen.ts:301-307` nach dem Lauf alle Listen und fordert frische Daten an — ein Fehler in Zeile 3 von 10 verliert die Vormerkungen 4–10. Neu: `laufeSchritte` liefert je Zeile ok/fehler+Meldung zurück; bei Fehler **stoppt** der Lauf, nur die erfolgreichen Zeilen werden aus den Vormerk-Listen ausgetragen, die Fehlerzeile bekommt Status `fehler` mit Meldung, der Rest bleibt vorgemerkt. Der Schreiben-Knopf zeigt danach den Rest-Zähler. Wichtig: das "Aufräumen erst am Ende"-Prinzip (spätere Abschnitte dürfen dieselbe Liste nochmal lesen) bleibt erhalten — ausgetragen wird nach Abschluss ALLER Abschnitte, nicht mitten im Lauf.
3. **Schreiben-Knopf-Vertrag:** ein normaler `ff-button` mit Kette; Label zeigt die Summe der Vormerkungen ("Schreiben (5)"), disabled bei 0. Der Zähler-Text kommt aus `vormerkText()` (`aenderungen.ts:77`) — eine Stelle, Fußzeile und Knopf sagen dasselbe.
4. **Löschen gebuchter Zeilen:** Kette mit `loeschzelle`-Abschnitt + Lösch-Relation; sicherstellen, dass der Platzhalter `DROP_PINDEX` (`src/core/data/relations.ts`) mit der Satznummer der Löschzeile gefüllt wird. Ungebuchte Zeilen löschen bleibt rein lokal (existiert).
5. `npm run build:runtime` nicht vergessen; Statusbalken auch in der exportierten Maske prüfen (gleiche Bausteine).

## Etappe 4 — Editor-UI komplett neu: Designsprache "Werkbank"

Gilt **nur für den Editor** (`src/editor/`, `src/ui/`). Die exportierte Maske (masken-tokens.css, V11-Palette) bleibt unangetastet. Das darunterliegende Modell (`PropertyDescription`, `ListenBindung`, `BlockDefinition`, `schrittPruefung`) bleibt **exakt wie es ist** — es wird nur neu gezeichnet.

### Designsprache (verbindlich, nicht verhandelbar)

- **Flächen:** Grund `#111417`, Panel `#191d21`, Control `#22272c`, Linie `#2e343a` (1px), Text `#e6e9ec`, gedimmt `#8b949c`. Dunkel ist der einzige Modus.
- **Ein Akzent:** Petrol `#2f9e8f` — nur für Auswahl, Fokusring, primären Knopf. Fehler `#d5544f`, Vormerkung `#d9a13b`. Sonst keine Farben.
- **Schrift:** Inter (liegt als Abhängigkeit vor), 13px Standard, 12px in dichten Listen, tabellarische Ziffern in Zahlfeldern.
- **Form:** Radius 4px überall, keine Schatten außer Overlays (eine Stufe), keine Verläufe, 4er-Abstandsskala. Inspector-Zeile: 28px hoch, Label links 40 %, Control rechts 60 %.
- **Atom-Bibliothek** in `src/ui/werkbank/` (genau diese, nicht mehr): `Zeile`, `Feld`, `Zahl`, `Wahl`, `Schalter`, `Segment`, `Knopf` (primär/still/gefahr), `Gruppe` (einklappbar), `Trenner`, `Popover` (verankert, kein getBoundingClientRect-Gefrickel), `Dialog` (Vollflächen-Overlay), `Liste` (wählbare Zeilen). **Tailwind-Utilities sind nur innerhalb dieser Atome erlaubt** — Panels komponieren ausschließlich Atome. Radix-Select und die alten `src/ui`-Atome fliegen raus, sobald kein Aufrufer mehr existiert.
- **Shell-Layout neu:** oben schmale Leiste (Maskenname, Undo/Redo, Export), links einklappbare Palette, Mitte Canvas, rechts Inspector 320px fest. Datencenter und Ketten-Editor sind **Vollflächen-Overlays** in derselben Sprache — keine verschachtelten Fensterchen, kein `window.confirm` (durch `Dialog` ersetzen, `src/editor/zentrale/helfer.ts:26-36`).

### Umbau-Reihenfolge (damit nie alles gleichzeitig kaputt ist)

1. Atome bauen (`src/ui/werkbank/`), Shell + Inspector-Rahmen darauf umstellen. Der Inspector ist datengetrieben (`Inspector.tsx` + `PropControl.tsx`) — es sind ~9 Control-Arten auf Atome zu mappen.
2. `PropControl.tsx`: die 4 fast identischen `WaehlerKnopf`-Aufrufe zu einer `PickerControl` zusammenziehen.
3. **`StepForm.tsx` (442 Z., schlimmste Datei) neu schreiben:** ein `useReducer`/abgeleiteter Zustand statt 13 `useState`; `candidate` einmal per `useMemo`; `stepProblem` einmal pro Änderung statt zweimal pro Render; die sechs Optionslisten memoisiert.
4. **`ParameterZeile.tsx` (408 Z.) neu:** statt 11 `if (binding.source === …)`-Zweigen eine Registry `Quelle → Control-Komponente` (dasselbe Muster wie PropControl). Die 12 Parameterquellen aus `ACTION_PARAM_SOURCES` bleiben fachlich unverändert.
5. Datencenter (`zentrale/`) auf Overlay + Atome umstellen; Aktionen bekommen eine Heimat: Inspector listet Ereignisse und öffnet den Ketten-Editor als Overlay — keine Doppelbearbeitung an zwei Orten mehr.
6. Alte Atome/`tailwind-merge`/`clsx`-Reste entfernen, wenn aufruferlos. (Abhängigkeiten selbst erst entfernen, wenn wirklich nichts mehr importiert.)

Spalten-Einstellungen bleiben **am Ding** (Klick auf Kopf = Feld, Doppelklick = Umbenennen, +/− in der Tabelle) — das ist gut und bleibt; der "In der Zeile änderbar"-Schalter erscheint im Spalten-Popover in Werkbank-Optik.

## Etappe 5 — Nachweis: Rahmen00001 aus dem Editor erzeugen

Ziel: die Handmaske `E:\DATA\VSES-Muhammed\Vorlagen\Belegerfassung\LAYOUTRAHMEN\00001\Rahmen00001.basis.source.html` (887 Z. Handschrift, "Buchen" ist dort nur ein console.log-Stub) durch eine **im Editor gebaute** Maske ersetzen:

1. Im Editor anlegen: Belegkopf als Formfelder auf offenem Satz `BEL` (VAR: 2_1 Art, 3_8 Nr, 19_10 Datum, 11_8 + 3440_60 Kunde, 453_12 Summe); Positionstabelle auf SEFILELOOP `POS` (KOPFSATZ_INDEX `BEL_0_11`; Spalten: 18_25 ArtNr, 45_60 Bezeichnung, 164_8 Menge **änderbar**, 689_5 Einheit, 246_9 EPreis, 280_12 Gesamt, 1401_12 Rohertrag; Satznummer 888_10); Artikelsuche als ERPAPICALL `ARTIKEL.GET` für die Erfassungszeile; ein Schreiben-Knopf mit Ketten-Abschnitten für erfasst/geändert/gelöscht. Nur benutzte Felder deklarieren — der tote Ballast der Handmaske (BELERF_*, 9 ungenutzte POS-Felder) wird NICHT übernommen.
2. Export, Dateien als `Rahmen00001.basis.source.html` + `.SEvariablen.json` in den Ordner legen (Original vorher als `_hand`-Kopie sichern).
3. **Echttest in der WEBWARE macht der Nutzer.** Fehlerbilder zurück in die Tests aus Etappe 1.

### BLOCKER — muss der Nutzer liefern, bevor Etappe 5 fertig werden kann

Die **Relationsnummern zum Schreiben**: Position anlegen (PUTADD?), Position ändern, Position löschen (+ Parameterreihenfolge). Quelle: SE-Variablenauswahl Dialog 1756 bzw. ein Ausführungslog einer echten Positionsänderung. Bis dahin werden die Ketten mit der vorhandenen Standard-Vorlage (PUT_RELATION 174) gebaut und die Stelle im Editor-Datencenter klar benannt. `pindex` = Satznummer des Zielsatzes ist bereits belegt.

---

## Was ausdrücklich NICHT gemacht wird

- Kein Neubau auf PageBuilder-Basis, keine Portierung von PageBuilder-Code.
- Keine Änderungen an der Masken-Designsprache (V11-Palette) — nur der Editor wird neu.
- Kein Umbau der Ketten-/Abschnittslogik in `seAktionen.ts` über Etappe 3 hinaus — sie ist die klügste Stelle des Projekts.
- Keine neuen Bausteintypen, keine Mehrseiten-Features, nichts, was nicht auf dem Weg zu Rahmen00001 liegt.
