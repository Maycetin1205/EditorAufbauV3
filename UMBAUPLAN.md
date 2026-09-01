# UMBAUPLAN EditorAufbauV3 — Belegerfassung fertig + Editor-UI komplett neu

Stand: 2026-08-28. Entscheidung: **V3 weiterbauen, kein Neubau.** PageBuilder (C:\Users\mu.aycetin\Desktop\PageBuilder) ist eingefroren und dient nur noch als Wissensspender.

Dieser Plan ist der Arbeitsauftrag. Etappen strikt in Reihenfolge, jede endet mit einem Commit. Beim Abarbeiten Haken in diese Datei setzen — sonst wird sie nicht angefasst.

**Stand 2026-08-28 (abends nachgezogen):** Etappe 4 ist bei Punkt 5 (Datencenter) abgehakt, die Quellen-UI hat ihre Punkte **6, 4 und 5** (Spaltenkopf zweigeteilt, Füllfeld, Hilfsquellen-Spalte nie änderbar), und Punkt **4.7** (Schlank) ist vorgezogen erledigt. Aus **Etappe 5** sind **Punkt 1** (Satznummer einstellbar) und **Punkt 4** (Ergebnisse über die Abschnittsgrenze) gebaut. Offen in Etappe 5 bleiben **Punkt 2** (liefert `645_10` im Datenschub überhaupt einen Wert?), **Punkt 3** (PINDEX vergiftet Bindungen auf andere Quellen) und **Punkt 5** (der fehlende Export-Test). **Quellen-UI Punkt 3 ist erledigt** (Herkunft am Spaltenkopf, `95fbcc5`/`1fedefd`), aus Etappe 5 zusaetzlich **Punkt 2** (`645_10` wird geliefert). Offen in der Quellen-UI: **Punkt 1+2** (Hauptquelle/Hilfsquellen als beschriftete Abschnitte samt `quellenProblem`) und **Punkt 7** (gerechnete Spalte). Offen in Etappe 5: **Punkt 3** (PINDEX vergiftet Bindungen auf andere Quellen), **Punkt 5** (Export-Test) und die zweite Haelfte von **Punkt 1** (`hatSatzNummer` prueft nur die Konfiguration, nicht den gelieferten Wert).

**Dazwischen angekuendigt (Nutzer-Ansage 2026-08-28, wird in einem anderen Chat besprochen): die TABELLE wird umgebaut** — die Spalten-Darstellungen („Text", „Zahl" und so) fallen weg, Spaltenbreiten zum Ziehen kommen dazu. Naeheres steht noch nicht fest. **Wer das baut, muss wissen:** an der Darstellung (`eintragsWahl` in `blocks/tabelle/spaltenBindung.ts`, Arten in `spaltenArten.ts`) haengen heute drei Dinge, die sonst still mitfallen — `nurBeiWahl` an den zwei Schaltern (Summe nur bei summierbaren Arten, aenderbar nur bei aenderbaren), die Detail-Felder der Darstellung „Bild + Name" (`felderKey`), und die Status-Zuordnung (`eintragsZuordnung`, `nurBeiWahl: ART_STATUS`). Die Quellen-UI wird in dieser Reihenfolge gebaut, nicht in ihrer Nummerierung: **6+4 → 5 → 3 → 1+2 → 7**. Grund steht in Punkt 6 („Diese Teilung ist Teil von Punkt 4") und in Punkt 4 („gespiegelt in der Hilfsquellen-Liste aus Punkt 1b") — das Modell muss vor die Liste, die es spiegelt, sonst wird die Liste zweimal gebaut. Am selben Tag ist der ganze Plan gegen den Code geprüft worden; die Funde stehen als datierte Absätze an den Stellen, die sie betreffen — sie sind Teil des Auftrags, keine Anmerkungen. Zwei Änderungen an der Struktur: die Quellen-UI bekommt das **Füllfeld** (zwei Felder je Spalte, ohne das ist eine Belegerfassung nicht abbildbar), und vor Rahmen00001 steht neu ein **Durchstich** (Etappe 5) — Rahmen00001 ist Etappe 6.

**Nachmittag 2026-08-28 — dreizehn Commits AM PLAN VORBEI, auf mündliche Ansage
des Nutzers.** Er hat an der Belegerfassung getestet und der Reihe nach
melden lassen, was ihn aufhält; gebaut wurde jeweils sofort. Der Plan ist
davon unberührt, die Reihenfolge unten gilt weiter. Was gebaut wurde:

Zuerst drei aus dem anderen Chat, an der Erfassungszeile (nachgetragen, sie
fehlten in der ersten Fassung dieser Liste):

- `ea31f6e` Fluss repariert: Enter sprang in einer Spalte auf der EIGENEN
  Quelle nie weiter (bei der Belegerfassung die Menge) · Tab am Zeilenende
  ließ die getippte Zeile unerfasst und verließ die Tabelle · nach dem
  Nachschlage-Fenster kam der Fokus nicht zurück · die Erfassungszeile klebt
  jetzt IMMER unten, nicht nur bei „Blättern = Nein"
- `9115f31` erfasste Zeile wird zum Korrigieren ZURÜCKGEHOLT statt an Ort und
  Stelle getippt — dort hatte sie weder Vorschlagsliste noch Fenster noch
  Enter-Fluss. Damit fällt auch der Weg zur Leerzeile im ERP weg.
- `5c1b3ad` ein Zell-Polster für alle Zeilenarten · Zebra zählt Zeilen statt
  DOM-Kinder (kippte sonst beim Abschalten der Kopfzeile, und war stärker als
  die Statusfarben) · Hover wischt die Kennfarbe nicht mehr weg

Dann acht auf dieselbe Weise:

- `4c3e8b1` Schalter „Schlank" restlos entfernt (das war Punkt 4.7)
- `9e2972f` Lücke neben der letzten Spalte weg (`scrollbar-gutter` raus)
- `8e9f823` erfasste Zeile bleibt nach dem Schreiben stehen, bis SoftEngine
  wirklich neue Daten liefert — vorher stiller Verlust der Eingabe
- `8e848cf` Enter nimmt den einzigen Treffer, bei mehreren geht das
  Nachschlage-Fenster auf (Suchwort reist mit)
- `f5d0ee9` Ketten-Ergebnisse reisen über die Abschnittsgrenze
- `9c06c56` Nachschlage-Fenster zeigt alle Spalten seiner Quelle
- `915794d` Nachbesserung zu `8e848cf` (Marken-Wahl fiel am Feld nie weg)
- `8dd78c3` das Fenster wächst mit seinen Spalten

Und zwei danach, die in der ersten Fassung dieser Liste noch fehlten — beide
sind **Etappe 5 Punkt 1**:

- `b0b1b68` die Bestellung nimmt die Satznummer wieder mit. Seit „nur benutzte
  Felder" fiel `indexField` aus dem Zweig heraus; ohne sie löst `{PINDEX}` sich
  nicht auf, und Ändern wie Löschen schreibt ins Nichts, ohne dass die Maske es
  merkt (ein PUT ist ein Einweg-Ruf).
- `da05673` die Satznummer wird im Quellen-Formular GEWÄHLT statt fest `0_10`
  gesetzt; die Arten-Tabelle sagt, wer überhaupt eine hat.

Nachgetragen, weil es sonst verlorengegangen wäre: `731ff6d` (Leertaste beim
Umbenennen in einem Knopf) lag uncommitted im Arbeitsbaum und war nie
eingecheckt.

**Offen und NICHT gebaut** (jeweils Nutzer-Entscheidung nötig): einstellbare
Fenster-Spalten (der Nutzer hatte sie gewünscht, gebaut ist die abgeleitete
Fassung) · „Zeile bleibt stehen" verschwindet bei JEDER Lieferung, nicht erst
bei einer, die sie enthält · `frischeDatenAnfordern` ist nach Aktenlage
wirkungslos, bleibt bewusst stehen.

⚠ **Zwei Agenten in einem Arbeitsbaum (Regel 8 verletzt, 2026-08-28).** Wer
hier arbeitet: NIE `git add -A`, nur eigene Dateien namentlich stagen.

**Reihenfolge ab hier (Nutzer-Entscheidung 2026-08-28):**

```
4.5 Datencenter  →  Quellen-UI (Pflichtteil)  →  Etappe 5 Durchstich
      →  Ketten-Editor (Pflichtteil)  →  Etappe 6 Rahmen00001
```

**4.6, 4.7 und der Zwischenschritt sind nach hinten gestellt** — sie kommen nach Etappe 5, in beliebiger Reihenfolge. Begründung: sie sind Hygiene (alte Atome, ein überflüssiger Schalter, drei Wächter) und bringen den Nutzer seinem Ziel „einen Beleg erfassen" nicht näher. Nach 4.5 sind es damit **zwei** Schritte bis zum ersten echten Erfassen statt vier. 4.5 bleibt vorn, weil die Quellen-UI einen Fuß im Datencenter hat (das Quellen-Formular) — davor gebaut, würde dieses Stück zweimal gebaut.

---

## Sanierung (Nutzer-Auftrag 2026-09-01) — läuft VOR allen übrigen Etappen

Unabhängiges Voll-Audit 2026-09-01 (Stand `38f8fe5`, Prüfbündel grün: 226 Tests/24 Dateien, 2,4 s): **die Architektur trägt** — gesäubert wird Oberfläche, kein Verhalten. Eiserne Regel jeder S-Etappe: der Editor tut hinterher exakt dasselbe, die exportierte Maske bleibt byte-gleich. Ritual je Etappe: `npm run check` + `npm test` grün; wird `src/blocks/` oder von dort Importiertes berührt → `npm run build:runtime` und `git diff` am Bündel entscheidet. Ein Thema = ein Commit; nie `git add -A`. Nutzer-Entscheidungen 2026-09-01: **Tests BLEIBEN** · `RECHNUNG-BELEGERFASSUNG.md` bleibt · `entwurf/` und `docs/Test-note*`-Bilder bleiben bis auf Widerruf. Das Verbot 6 unten (500-Zeilen-Deckel) ist als Regel **aufgehoben** — beurteilt wird nach Zusammenhalt, nicht Zeilenzahl. **Reihenfolge: nach S2 kommen ZUERST die Reparatur-Etappen P1–P6 (unten), dann S3 → S4 → S5 → S7; S6 optional. Sperre (Nutzer 2026-09-01): bis alle Etappen abgehakt sind, wird NUR dieser Umbau gebaut — keine Features, keine Extras.**

- [x] **S1 — Toter Code raus.** ✅ 2026-09-01 · Klickprobe des Nutzers bestanden Löschen (0 Importeure; vor dem Löschen per grep NEU beweisen, es wird parallel gebaut): `src/ui/molecules/waehler.tsx`, `src/ui/molecules/field.tsx`, `src/ui/atoms/button.tsx`, `src/ui/atoms/icon-button.tsx`, `src/ui/atoms/text-input.tsx`, `components.json`. Pakete: `npm uninstall @radix-ui/react-select class-variance-authority`. `src/ui/molecules/auswahl-fenster.tsx` BLEIBT (FieldPicker nutzt es): Alt-Klassen `border-border bg-popover text-popover-foreground` → wertgleich `border-linie bg-panel text-tinte`. `src/index.css`: `--ring` zieht als `--wb-auswahl` (gleicher Wert `246 60% 56%`) in den Werkbank-Block; alle `var(--ring)` (BlockHost/Canvas/CanvasNode/PopupSeite) → `var(--wb-auswahl)`, `var(--border)` in BlockHost → `var(--wb-linie)` (wertgleich), `body`/`*`-Regel auf `--wb-*`, danach den shadcn-Variablenblock löschen (`--radius` und `--canvas-bg` bleiben). `tailwind.config.js`: shadcn-Farbnamen-Block raus. `eslint.config.js`: tote Ignores `src.vibe-backup-*`/`grundlast` raus. Zusatz-Beweis: `npm run build` läuft durch, grep findet keine Alt-Klassen/-Variablen mehr.
- [x] **S2 — Referenzabzug.** ✅ 2026-09-01 (Rot-Probe bestanden: ein verfälschtes Byte macht den Test rot) Eine feste Referenzmaske (jeder Registry-Baustein, gebundene Spalten, eine Kette) wird exportiert; HTML + SEvariablen eingecheckt unter `src/export/referenz/`, ein Test vergleicht Byte für Byte. Dazu ein generischer Attribut-Round-Trip über ALLE Bausteine der Registry. Keine neue Abhängigkeit (Beleg: `herkunft.test.ts` exportiert heute schon eine echte Tabelle im Testlauf). Test einmal absichtlich rot machen, dann grün einchecken. Absichtliche Exportänderungen erneuern die Referenz bewusst, im eigenen Commit sichtbar.
- [ ] **S3 — Kommentar-Schnitt.** Bleiben darf nur: SoftEngine-Kontrakt oder Einzeiler-Warum. Fliegen: Datumsangaben, „Nutzer-Ansage …", Befund-/Plan-Querverweise (G4, C2, B1, „Regel 2" …), Erzähl-Absätze, Banner. **Ausgenommen: Kommentare INNERHALB von `css\`…\``-Vorlagen** — das sind Zeichenketten-Bytes des Bündels, sie zu löschen änderte `ff-runtime.js`. Beweis: `npm run build:runtime` → Bündel byte-identisch + Referenzabzug grün + check/test grün.
- [ ] **S4 — Papier.** `CLAUDE.md` neu schreiben (kurz: Nordstern, SE-Kontrakte VOLLSTÄNDIG, Nutzer-Sperrliste, wichtige Stellen — Chronik und Korrekturtabelle raus). Diese Datei hier auf die offene Arbeit eindampfen (Chronik raus, git hat sie). Kein Code.
- [ ] **S5 — Typen-Nähte.** `assertNever` in die default-Zweige der 5 `switch` (`editor/inspector/PropControl.tsx` ×2, `blocks/formfeld/FormFeldBlock.ts`, `editor/zentrale/schrittZusammenfassung.ts`, `state/useKeyboardShortcuts.ts`; Zeilen frisch suchen) · `leerHinweis` als benanntes Interface statt `as unknown as` (`blocks/kanban/seRuntime.ts`, Muster `ErfassungsTraegerElement`) · `BlockComponentStatic` aus `BlockDefinition` ableiten (Handkopie in `BasicBlock.defineAndRegister` typfest) · Attribut-Naht: `defaultProps` per `satisfies` an die Klasse koppeln + ein `leseAttr`-Helfer statt roher `getAttribute`-Literale · `breiteZiehbar` in `TrennerBlock.defaultProps` hat keine `@property` — klären (Editor-only oder tot). Beweis: Referenzabzug byte-gleich; Bündel neu bauen und einchecken.
- [ ] **S6 (optional, eigene Ansage).** `noUncheckedIndexedAccess` in `tsconfig.app.json` (~100 Stellen mechanisch, keine Logikänderung, Referenzabzug byte-gleich).
- [ ] **S7 — Export-Korrekturen (Nutzer-Entscheidung 2026-09-01; bewusste Exportänderungen, Referenz danach im selben Commit erneuern):** (a) **EINE Baustein-Kennung statt zwei** — `data-ff-id` entfällt, `data-ff-block-id` ist die eine Kennung; umziehen: `blocks/shared/auswahl.ts` (`geberIdVon`), `exportMask.ts` (`auswahlIdAttr`), und prüfen, wie der Editor die Kennung an die Elemente spiegelt (`editor/canvas/useLitElement.ts`). (b) **Maskenname statt fest „Maske":** Namensfeld in der Toolbar, gespeichert als Eigenschaft der Maskenwurzel (`props.maskenName`, Vorgabe „Maske"); der Export nutzt ihn als `<title>` — das ist zugleich der SoftEngine-Anmeldename (`document.title`, `softengine/bridge.ts`), und die zwei echten Referenzmasken tragen individuelle Titel, der Editor bisher fest „Maske" (`Toolbar.tsx`). Alte Speicherstände ohne Namen laden unverändert (Vorgabe greift).

**Leere Ketten-Parameter im Export sind GEWOLLT** (Nutzer-Ansage 2026-09-01) — keine Kompaktierung des `data-ff-aktionen`-Attributs, nicht wieder vorschlagen.

**Bei der Sanierung verworfen (nicht wieder vorschlagen):** Editor-Klasse zerteilen · Visitor für `nodeToHtml` · Umbenennungs-Feldzüge · 500-Zeilen-Deckel als Regel · neue Testgattungen · CI.

### Tiefenprüfung 2026-09-01 — bestätigte Befunde → Reparatur-Etappen P1–P6

Fünf unabhängige Prüfläufe (Export · SoftEngine-Schicht · Zustand/Persistenz · Tabelle/Erfassung · Editor/Core-Verträge); jede Behauptung wurde am Code verifiziert: **28 Funde bestätigt, 1 widerlegt.** Die P-Etappen laufen VOR S3 (sie ändern Code, den S3 sonst zweimal anfasst).

**Arbeitsregeln für jede Sitzung:** Vor Beginn `git fetch` + `git pull` — es wird zeitweise **parallel gebaut** (aktuell 2026-09-01: Endlos-Schleifen-Fix in `blocks/shared/holendeQuellen.ts` aus einem anderen Chat — Feldtyp-Prüfung am Geber + Schleifen-Bremse). Nächste offene Etappe = oberste ohne Haken, **P vor S**. Je Etappe: bauen → `npm run check` + `npm test` grün → wenn `src/blocks/` oder von dort Importiertes berührt: `npm run build:runtime` und Bündel einchecken → EIN Commit (nie `git add -A`, Dateien namentlich stagen) → **`git push`** (das Repo ist auf GitHub veröffentlicht und muss aktuell bleiben, Nutzer-Ansage 2026-09-01) → Haken hier setzen → Bericht: Beweise grün/rot · Klickanleitung · was nicht prüfbar war. Der Referenzabzug (`src/export/referenzabzug.test.ts`) muss byte-gleich bleiben; nur bei BEWUSSTER Exportänderung im selben Commit erneuern: `REFERENZ_ERNEUERN=1 npx vitest run src/export/referenzabzug.test.ts`. Neue Testfälle nur als vitest (bestehende Gattung); **niemals einen Test abschwächen, damit er grün wird** — rot = Befund, melden.

- [ ] **P1 — Speichern/Laden ehrlich (`src/state/`).** (a) `notfallkopie.ts`: die Kopie bei JEDER Beschädigung sichern (Schlüssel mit Zeitzusatz statt Einmal-Wächter) und die Meldung darf nie „gesichert" behaupten, wenn nichts geschrieben wurde. (b) `VorlagenStore.ts:52`: die von `pruefe` gemeldeten `probleme` nicht wegwerfen — dem Nutzer melden (Muster `meldeVerworfeneTypen`) und VOR dem ersten gekürzten Rückschreiben den Roh-Stand als Notfallkopie sichern. (c) `persistence.ts:71`: ein Browser-Stand mit `schemaVersion > CURRENT_SCHEMA_VERSION` wird NICHT geladen und NICHT überschrieben — sichern + melden, Editor startet leer (Muster: Datei-Weg `ladeKette.ts:263`). (d) `ladeKette.ts:46`: `absichtlichEntfernt` (z. B. Kanban-Karten ohne Zielspalte, `migrationenRoh.ts:19-23`) wird gemeldet statt verschwiegen. Beweis: je Fall ein vitest-Testfall.
- [ ] **P2 — GET-Antworten nicht verwechseln (`src/softengine/`).** (a) `relationLader.ts:50`: `antwort.fehler` durchreichen — bei Fehler bricht der Lauf ab, `meldeFehler` auch bei `still: true`, und eine unvollständige Liste wird NICHT als vollständig veröffentlicht (heute liest sich ein Timeout als „Liste zu Ende" und schneidet Positionen stumm ab). (b) `relations.ts:190-249`: Timeout 6 s → 20 s; nach einem Timeout gilt die nächste eintreffende Antwort als VERFALLEN (Verfallsmarke), damit sie nicht den nächsten Frager auflöst — es gibt keine Ruf-Antwort-Korrelation, das ist der einzige Riegel. Beweis: Fälle in `relations.test.ts` (verspätete Antwort, Fehlerdurchreichung).
- [ ] **P3 — „Lieferung" nur bei echter Lieferung (`softengine/` + `bridge`).** ERST nach dem parallelen holendeQuellen-Fix beginnen (`git pull`). (a) `relationLader.ts:22` und `:120`: `meldeNeueDaten()` behauptet eine SoftEngine-Lieferung — ersetzen durch einen Anstoß OHNE Lieferungs-Beweis (Gegenstück zu `klingeln(false)`, neue kleine Funktion in `bridge.ts`); ein Auswahlwechsel/Hol-Lauf darf `vergissGeschriebene` nie auslösen (genau das verbietet `datenAnschluss.ts:13-16`; heute verschwinden hinausgeschickte Erfassungszeilen beim bloßen Zeilenklick). (b) `bridge.ts:100` `klingeln`: jeden Zuhörer mit try/catch rufen (Muster `antwortKlingeln:131`); `seConsume:167-169`: `letzteSignatur` erst NACH fehlerfreier Verteilung setzen — sonst legt ein einziger werfender Baustein die Hydrierung dauerhaft still. Beweis: vitest-Fälle.
- [ ] **P4 — Erfassung zählt und rechnet richtig (`src/blocks/tabelle/`).** (a) `spalten.ts:67` (`mitKennungen`) UND der Zwilling `migrationenRoh.ts:167` (`vergebeKennungen`) — beide synchron ändern: neue Kennung = höchste vorhandene s-Zahl + 1, NIE die niedrigste freie — gelöschte Kennungen dürfen nie wiedervergeben werden (heute zeigen Rechnung und Ketten-Parameter danach stumm auf die neue Spalte). (b) `erfassungsLauf.ts:418` (`uebernimmWerte`): beim Zurückholen bleibt der Rechnungs-Zielplatz eine Lücke — Regel: ein konfigurierter Rechnungs-Platz, dessen Wert exakt dem aus den übrigen Werten gerechneten Ergebnis entspricht, wird nicht als getippt übernommen (heute friert die Abgabemenge ein: 10→20 Tiere ändern, Menge von 10 geht ins ERP). (c) `erfassungsAnschluss.ts:45` (`vormerkungen`): auch ohne `_zurueck` zählt die unten getippte, nicht-leere Zeile mit — gleiche Mechanik wie die Korrekturzeile, Kennung dafür reservieren (heute überspringt Buchen die sichtbar ausgefüllte Zeile still). (d) `TabelleBlock.ts:623`: die Fußzeile zählt über `vormerkungen()` statt `zeilen.length` — eine Zahl für Fußzeile und Knopf, wie `vormerkStand.ts:10-13` zusagt. (e) `tabelleAnsicht.ts:96` (`sichtbareIndizes`): Suche und Sortierung lesen über `wertVon` (vorgemerkter Zellwert), wie es die Summe schon tut. Beweis: Fälle in den erfassungs*/spalten/aenderungen-Tests; `npm run build:runtime`; Referenzabzug bleibt byte-gleich.
- [ ] **P5 — Export-Bestellung sauber (`src/export/` + `core/data/`).** Bewusste Exportänderungen — Referenz im selben Commit erneuern. (a) `benutzteQuellen.ts:127-136`: der `kind: 'field'`-Zweig ohne `quelleProp` löst über `zerlegeBindung` auf (wie `merkeBindung` in `:88`) — heute landet ein `quelle::code`-Token roh in der FELDER-Bestellung der eigenen Quelle (bricht laut Kontrakt die ganze Loop-Liste bzw. kippt IDB still auf `'*'`). (b) Quellen-Klarnamen eindeutig: `DataSourceForm` verweigert Doppelnamen; zusätzlich macht der Export gleiche Namen maschinell eindeutig und schreibt DENSELBEN Namen in SEFILELOOP-`ALIAS` und `FF_DATA_SOURCES.name` (die Laufzeit sucht über den Namen, `data.ts:192` — erster Treffer gewinnt; heute zeigen zwei gleichnamige Quellen stumm dieselben Daten). (c) eine IDB-Quelle ohne `idbId` ist ein Ladeproblem in `pruefeDatenquellen` statt einer stillen `ID:""`-Bestellung (`sevariablen.ts:71` gegen `:23`). (d) `serializer.ts` `guardScriptContent`: in den zwei JSON-Skripten zusätzlich jedes `<` als Unicode-Escape schreiben (Backslash + u003C, in JSON-Zeichenketten gültig) — schließt den „double escaped script"-Einstieg. (e) Bedienung am Ding statt Warnung: beim LÖSCHEN einer Spalte werden Ketten-Parameter, die auf ihre Kennung zeigen, auf `aus` gestellt (heute exportiert `exportMask.ts:86` dafür `-1` und die Laufzeit schreibt kommentarlos einen Leerstring ins ERP). Beweis: neue Fälle in benutzteQuellen-/sevariablen-Tests + Referenzabzug bewusst erneuert.
- [ ] **P6 — Editor-Feinheiten.** (a) `FormFeldBlock.ts:176` (`textTpl`): der Platzhalter-Span bekommt im Platzhalter-Zweig `?data-ff-bound=${wertBindbar && this.valueField !== ''}` — der Umbenennen-Riegel sitzt heute am falschen Element, Tippen bei gesetzter Bindung geht ins Leere. (b) Undo je Tastendruck im Spaltennamen-Feld: `FieldPicker.tsx:195` hängt den Aufräum-Effekt an `titelSitzung.beenden` statt an das je Render neue Sitzungs-Objekt (oder `useEingabeSitzung` gibt ein stabiles Objekt zurück). (c) `PropControl.tsx:117`: der Quellwechsel leert auch `listenBindung`-Listen mit passendem `quelleProp` (Fall `nachschlagSpalten` — behält heute Feldcodes der alten Quelle und exportiert sie). (d) `Editor.ts:261`: verwirft `schreibWert` (`null`), trotzdem `notify()` — sonst bleibt der verworfene Text sichtbar im Baustein stehen. (e) `NumberControl`: `type="number"` schluckt das Komma je nach Browser — auf Textfeld mit `inputMode="decimal"` umstellen (die vorhandene Komma-Ersetzung wird sonst nie erreicht). (f) `feldRuntime.ts:80`: die onChange-Kette startet nicht mit leerem PINDEX, wenn sie `{PINDEX}` benutzt (Sperre analog `hatSatzNummer`). (g) `bridge.ts:178`: nach einer GEWORFENEN Anmeldung weiter versuchen statt aufgeben. (h) `ladeKette.ts:216`: Altbaustein-Reste schalten die knotenweise Verlustprüfung nicht mehr global ab — betroffene IDs beim Vergleich überspringen; `migrationenRoh.ts:182` (`kennungAnPlatz`): bei unbekanntem Platz das Original stehenlassen statt `''` zu schreiben und `feld` zu löschen. Beweis: check/test grün; wo Bausteine berührt: build:runtime; Referenzabzug byte-gleich.

**Codex-Abgleich 2026-09-01:** Urteil deckungsgleich (kein Neubau, Doku ist der Haufen, Tests behalten). Übernommen und bereits erledigt: Zeilenenden-Härtung der Byte-Wächter (`.gitattributes`), `settings.local.json` aus dem Repo. NICHT übernommen: Browser-Smoke-Tests (kollidiert mit der Test-Sperre 2026-07-28 — braucht eine eigene Nutzer-Entscheidung) · „React/Lit-Brücke und die zwei Store-Bauarten vereinfachen" = frühestens NACH allen Etappen, eigene Entscheidung.

---

## Verbote (gelten für jede Etappe)

1. **Keine neuen Markdown-Dateien.** Am Ende existieren genau zwei: `CLAUDE.md` (wiederhergestellt) und dieser Plan. Kein README-Neuschrieb, keine Konzeptpapiere, keine "NOTES".
2. **Keine Kommentar-Erzählungen.** Ein Kommentar ist nur erlaubt, wenn er einen SoftENGINE-Kontrakt oder ein nicht-offensichtliches Warum festhält (Stil wie in `src/blocks/tabelle/erfassungsLauf.ts:349-357`). Niemals: was die nächste Zeile tut, was geändert wurde, "NEU:", "Fix:".
3. **Keine neuen npm-Abhängigkeiten.** Auch keine UI-Bibliothek für die neue Designsprache — die Atome werden selbst gebaut.
4. **Keine Änderung in `src/core/`, `src/softengine/`, `src/export/` ohne zugehörigen Test.**

   **Korrigiert 2026-08-28:** hier stand „(ab Etappe 1 vorhanden)". Für `src/export/` stimmt das nicht — `nodeToHtml` (`exportMask.ts:76-192`), der gesamte Baustein-Export, wird von keinem Test mit einem echten Baustein ausgeführt. Das Verbot gilt trotzdem: wer dort etwas ändert, schreibt den fehlenden Test zuerst (Etappe 5 Punkt 5).
5. **Kein `if (type === 'tabelle')` in generischem Code.** Fähigkeiten laufen über `BlockDefinition`/Registry, wie bisher.
6. **500-Zeilen-Deckel pro Datei.** Seit Etappe 2 hält ihn jede Datei ein (größte: `FormFeldBlock.ts` 498, `TabelleBlock.ts` 491).
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

1. ✅ **Export-Wächter testen:** `validateMaskHtml` ist bereits verdrahtet — `src/editor/shell/Toolbar.tsx:44` bricht den Export mit Klartext ab. Es bleibt bei diesem **einen** Prüfpunkt, kein zweiter in `exportMask()`. Es fehlt nur der Test: eine absichtlich kaputte Maske (CR-Zeichen, Umlaut, fehlender Start-Marker, fehlendes Interface-Script) meldet genau die passenden Fehler; eine echt exportierte Maske meldet null.
2. ✅ **Runtime-Bündel-Wächter:** Test, der `npm run build:runtime`-Output gegen das eingecheckte `src/export/generated/ff-runtime.js` byte-vergleicht. Abweichung = roter Test mit Meldung "build:runtime vergessen". Der Wächter baut in einen **Temp-Ordner** (`--outDir`), nie in place — ein paralleler Dev-Server übernähme den Zwischenzustand per HMR (Warnung in `vite.runtime.config.ts:20-22`).
3. ✅ **Logik-Tests** (browserfrei, die Klassen sind dafür geschnitten): `erfassungsLauf` (Tastenentscheid, gleicheAb-Fixpunkt, schluesselWert über Verknüpfungskette), `erfassungsZellen` (passendeSaetze: undefined=unbekannt vs. ''=bekannt-leer), `aenderungen.ts` (Satznummer-Schlüsselung, Rücknahme bei Originalwert), `schrittPruefung` (jede Fehlermeldung einmal), `sevariablen` (Kopfsatz-Loops zwangsweise zuletzt, varZusammen).
4. ✅ **Abschnitts-Test für die Ketten-Laufzeit:** `abschnitteVon`/`laufeSchritte` in `src/blocks/shared/seAktionen.ts` — ein Schritt ohne Zeilenbezug hängt am laufenden Abschnitt; zwei Listen in einem Schritt = Fehler; Lauf ist sequenziell. Beide Funktionen dafür exportieren — reine Sichtbarkeitsänderung, kein Verhaltensunterschied.
5. ✅ Jeden neuen Test einmal absichtlich rot machen (Erwartung verdrehen), damit er beweisbar prüft und nicht leer durchläuft.

## Etappe 2 — Aufräumen (Stunden) ✅

1. ✅ `src/design/masken-schriften.css` gelöscht (die vier Importeure waren schon in Etappe 0 gefallen — die Datei war seit `a20f390` toter Code).
2. ✅ `TabelleBlock.ts` (797 Z.) gesplittet. Der eine im Plan genannte Schnitt reichte nicht: er landete bei 612 Z. Es sind **drei** Schnitte geworden, Verhalten identisch (normalisierter Zeilenvergleich alt↔neu, Prüfbündel grün):
   - `zeilenBearbeitung.ts` (250 Z.) — Vormerkungen an gebuchten Zeilen + Zellbedienung (`zellWert`/`tippeZelle`/`verlasseZelle`/`zelleNachbar`/`tasteZelle`, Änderungs-/Lösch-Getter). Die vier Laufzeit-Vertrag-Namen (`geaenderteZeilen`/`aenderungenLeeren`/`geloeschteZeilen`/`loeschungenLeeren`) bleiben als Delegationen **am Element** — die Kette liest sie über die Element-Referenz (`seAktionen.ts:275-306`).
   - `ansichtsStand.ts` (185 Z.) — Suchtext, Sortierung, Seite, Rumpf-Messung, Zeilenfokus.
   - `zeilenEreignisse.ts` (41 Z.) — Klick/Doppelklick auf eine Datenzeile.

## Etappe 3 — Zeilen-Lebenszyklus komplettieren (das Kern-Feature) ✅

Was schon existiert und **nicht neu gebaut wird**: drei Vormerk-Listen (`erfassteZeilen`, `geaenderteZeilen` via `aenderungen.ts`, `geloescheZeilen` via `_geloescht`), Löschkreuz pro Zeile, Wegnehmen-Kreuz an erfassten Zeilen, Ketten-Abschnitte mit `erfassungszelle`/`aenderungszelle`/`loeschzelle`, sequenzieller Lauf einmal je Zeile mit PINDEX=Satznummer (`seAktionen.ts:239-314`), `frischeDatenAnfordern()` nach dem Schreiben, "In der Zeile änderbar"-Schalter je Spalte (`spaltenBindung.ts:34`).

Was fehlt:

1. ✅ **Zeilen-Status als Laufzeit-Zustand:** je Zeile einer aus `gebucht` (Normalfall, keine Marke), `erfasst`, `geaendert`, `loeschung`, `schreibt`, `fehler`. Anzeige **ausschließlich** als 3px-Statusbalken am linken Zeilenrand (Farben: Vormerkung = Warn-Gelb, schreibt = Akzent pulsierend, fehler = Rot) plus `title`-Tooltip mit Klartext. **Niemals Text-Badges** ("NEU", "geändert" o. ä.) in der Zeile — ausdrückliche Nutzer-Vorgabe.
2. ✅ **Lauf-Bericht statt Alles-oder-Nichts:** Heute leert `seAktionen.ts:301-307` nach dem Lauf alle Listen und fordert frische Daten an — ein Fehler in Zeile 3 von 10 verliert die Vormerkungen 4–10. Neu: `laufeSchritte` liefert je Zeile ok/fehler+Meldung zurück; bei Fehler **stoppt** der Lauf, nur die erfolgreichen Zeilen werden aus den Vormerk-Listen ausgetragen, die Fehlerzeile bekommt Status `fehler` mit Meldung, der Rest bleibt vorgemerkt. Der Schreiben-Knopf zeigt danach den Rest-Zähler. Wichtig: das "Aufräumen erst am Ende"-Prinzip (spätere Abschnitte dürfen dieselbe Liste nochmal lesen) bleibt erhalten — ausgetragen wird nach Abschluss ALLER Abschnitte, nicht mitten im Lauf.
3. ✅ **Schreiben-Knopf-Vertrag:** ein normaler `ff-button` mit Kette; Label zeigt die Summe der Vormerkungen ("Schreiben (5)"), disabled bei 0. Der Zähler-Text kommt aus `vormerkText()` (`aenderungen.ts:77`) — eine Stelle, Fußzeile und Knopf sagen dasselbe.
4. ✅ **Löschen gebuchter Zeilen:** Kette mit `loeschzelle`-Abschnitt + Lösch-Relation; sicherstellen, dass der Platzhalter `DROP_PINDEX` (`src/core/data/relations.ts`) mit der Satznummer der Löschzeile gefüllt wird. Ungebuchte Zeilen löschen bleibt rein lokal (existiert).
5. ✅ `npm run build:runtime` nicht vergessen; Statusbalken auch in der exportierten Maske prüfen (gleiche Bausteine).

Beim Bauen zusätzlich nötig geworden, weil ohne das kein Zeilen-Bericht möglich
ist: `executeRelation` (`src/softengine/relations.ts`) lieferte einen gescheiterten
Ruf bis dahin genauso aus wie einen geglückten — `RelationAntwort` trägt jetzt ein
optionales `fehler` (mit Test, Verbot 4). Der Zähler-Text `vormerkText()` ist von
`aenderungen.ts` nach `shared/vormerkStand.ts` gezogen und zählt ZEILEN statt Zellen,
damit Fußzeile und Knopf dieselbe Zahl sagen; der Knopf darf keinen Baustein-Ordner
importieren. `fussNoetig` ist von `ansichtsStand.ts` in `tabelleFuss.ts` gewandert und
die Kopf-Griffe von `TabelleBlock.ts` nach `spaltenBearbeiten.ts` (500-Zeilen-Deckel).
Offen und nur im Echttest zu klären: ein PUT ist ein Einweg-Ruf — `fehler` fängt
Brücken- und Timeout-Fehler, **nicht** ein „die ERP hat abgelehnt".

Nach der ersten Bedienprobe nachgezogen (Nutzer-Ansage): (a) Eingaben in
Erfassungszeile und erfassten Zeilen sehen aus wie Zellen, nicht wie
Formularfelder — Rahmen erst bei Hover/Fokus, sonst wäre die Maske anders als
der Editor (Regel 1). (b) Eine erfasste Zeile ist bis zum Schreiben
korrigierbar; vorher musste man sie wegwerfen und neu tippen. (c) **„In der
Zeile änderbar" hat jetzt die Vorgabe JA** — jede gebundene Spalte einer
änderbaren Darstellung ist schreibbar; der Schalter bleibt zum AUSschalten
gerechneter Spalten (Gesamt, Rohertrag). Der Standard steht am Schalter
(`EintragsSchalter.standard`), gespeichert wird nur die Abweichung.

## Etappe 4 — Editor-UI komplett neu: Designsprache "Werkbank"

Gilt **nur für den Editor** (`src/editor/`, `src/ui/`). Die exportierte Maske (masken-tokens.css, V11-Palette) bleibt unangetastet.

Das darunterliegende Modell bleibt **beim Zeichnen** unangetastet — `PropertyDescription`, `ListenBindung`, `BlockDefinition`, `schrittPruefung` werden für die Punkte 1–6 nur gelesen. **Nachgezogen 2026-08-28:** die zwei Pflichtteile unten (Quellen-UI, Ketten-Editor) sind davon ausgenommen, weil sie ohne Modell-Änderung nicht baubar sind. Ausdrücklich erlaubt sind dort genau vier Erweiterungen, jede mit Test:
- `Spalte.fuellFeld` (Quellen-UI, Punkt 5)
- der Relations-Katalog in `core/data/relations.ts` samt Torwächter `pruefeRelationsVorlagen` (Ketten-Editor, Punkt 1)
- die Rückgabe von `stepProblem` um eine Parameter-Kennung (Ketten-Editor, Punkt 3 — ein Fehler „am betroffenen Parameter" ist ohne sie nicht anzeigbar)
- `ErfassungsOption` um den Feldcode (Ketten-Editor, Punkt 3a)

Alles darüber hinaus bleibt gesperrt.

### Designsprache (verbindlich, nicht verhandelbar)

- **Flächen: HELL. Die dunkle Fassung ist gestrichen** (Nutzer-Ansage 2026-08-27, unmittelbar nach der ersten Bedienprobe: „ich sehe nichts mehr"). Gebaut und am selben Tag zurückgenommen war Grund `#111417` / Panel `#191d21` / Control `#22272c` / Linie `#2e343a` / Text `#e6e9ec` / gedimmt `#8b949c`. **Nicht wieder vorschlagen, auch nicht als Umschalter.** Gültig sind die hellen Werte in `src/index.css` (`--wb-*`).
- **Ein Akzent:** das Indigo `hsl(246 52% 44%)` — nur für Auswahl, Fokusring, primären Knopf. Fehler und Vormerkung stehen als `--wb-fehler` / `--wb-vormerkung`. Sonst keine Farben. (Petrol `#2f9e8f` fiel mit der dunklen Fassung.)
- **Schrift:** Inter (liegt als Abhängigkeit vor), 13px Standard, 12px in dichten Listen, tabellarische Ziffern in Zahlfeldern.
- **Form:** Radius 4px überall, keine Schatten außer Overlays (eine Stufe), keine Verläufe, 4er-Abstandsskala. Inspector-Zeile: 28px hoch, Label links 40 %, Control rechts 60 %.
- **Atom-Bibliothek** in `src/ui/werkbank/` (genau diese, nicht mehr): `Zeile`, `Feld`, `Zahl`, `Wahl`, `Schalter`, `Segment`, `Knopf` (primär/still/gefahr), `Gruppe` (einklappbar), `Trenner`, `Popover` (verankert, kein getBoundingClientRect-Gefrickel), `Dialog` (Vollflächen-Overlay), `Liste` (wählbare Zeilen). **Tailwind-Utilities sind nur innerhalb dieser Atome erlaubt** — Panels komponieren ausschließlich Atome. Radix-Select und die alten `src/ui`-Atome fliegen raus, sobald kein Aufrufer mehr existiert.
- **Shell-Layout neu:** oben schmale Leiste (Maskenname, Undo/Redo, Export), links einklappbare Palette, Mitte Canvas, rechts Inspector 320px fest. Datencenter und Ketten-Editor sind **Vollflächen-Overlays** in derselben Sprache — keine verschachtelten Fensterchen, kein `window.confirm` (durch `Dialog` ersetzen, `src/editor/zentrale/helfer.ts:26-36`).

### Umbau-Reihenfolge (damit nie alles gleichzeitig kaputt ist)

1. ✅ Atome bauen (`src/ui/werkbank/`), Shell + Inspector-Rahmen darauf umstellen. Der Inspector ist datengetrieben (`Inspector.tsx` + `PropControl.tsx`) — es sind ~9 Control-Arten auf Atome zu mappen.
2. ✅ `PropControl.tsx`: die 4 fast identischen `WaehlerKnopf`-Aufrufe zu einer `PickerControl` zusammenziehen.

   Mit Punkt 2 ist der **ganze Inspector** Werkbank: die sieben Controls, Quellen, Auswahl-Folge, Schlüsselpaare, Aktionen. `PickerControl` (`inspector/controls/`) komponiert `Popover` + `Liste` und ersetzt `WaehlerKnopf` — vier Aufrufer sofort. Drei Abweichungen, weil ohne sie etwas schlechter geworden wäre: `Liste` bekam die **Suche** (eine Quelle hat hunderte Felder; kein 13. Atom) · `Zeile` bekam `breit` für Bedienelemente, die keine 28-px-Zeile sind (mehrzeiliger Text, Bild, Farbkacheln) · `Popover` verbirgt sich vor der Messung mit `opacity-0` statt `invisible`, sonst nimmt das Suchfeld beim Aufklappen keinen Fokus. Aufruferlos geworden und gelöscht: `atoms/select` (Radix), `atoms/textarea`, `molecules/side-panel` — das npm-Paket `@radix-ui/react-select` bleibt bis Punkt 6. Noch NICHT umgebaut, jeweils eigener Punkt: die Quellen-UI fachlich (Hauptquelle/Hilfsquellen) und die Heimat der Aktionen (Punkt 5).
3. ✅ **`StepForm.tsx` (442 Z., schlimmste Datei) neu schreiben:** ein `useReducer`/abgeleiteter Zustand statt 13 `useState`; `candidate` einmal per `useMemo`; `stepProblem` einmal pro Änderung statt zweimal pro Render; die sechs Optionslisten memoisiert.

   Der Formular-Zustand steckt jetzt in EINEM Objekt in `schrittEntwurf.ts` (rein, ohne React: `entwurfAus` / `schrittReducer` / `kandidatAus` / `bindungFuer`); `StepForm.tsx` zeichnet nur noch (384 Z.). Die sechs Listen hängen in einem Memo am Baustein-Baum statt an jedem Tastendruck, `kandidat` und `problem` in je einem — `speichern()` liest dasselbe `problem`, das schon angezeigt wird. Dabei gefallen: `candidate()` zog pro Aufruf eine neue `crypto.randomUUID()`, bei einem neuen Schritt prüfte die Anzeige also einen anderen Schritt, als gespeichert wurde; die ID entsteht jetzt einmal beim Öffnen. Werkbank-Optik nur für das, was StepForm selbst zeichnet (`Zeile`/`Feld`/`Knopf`, Popup-Wahl über `PickerControl`) — `RelationAuswahl` und `ParameterZeile` bleiben Punkt 4/5. `FeldUebernahmePicker` komponiert `Popover` + `Liste` (142 → 85 Z.): nur so verschwinden `pickerPosition` und das `getBoundingClientRect` aus dem Formular. Die Feldwahl ist dadurch einstufig — eine nach Quellen gruppierte Liste mit Suche statt erst Quelle, dann Feld.
4. ✅ **`ParameterZeile.tsx` (408 Z.) neu:** statt der `if (binding.source === …)`-Zweige eine Registry `Quelle → Control-Komponente` (dasselbe Muster wie PropControl). Die Parameterquellen bleiben fachlich unverändert.

   **Zahlen am Code nachgemessen 2026-08-28** (der Plansatz nannte 11 Zweige und 12 Quellen): es sind **8** Zweige und **11** Quellen in `ACTION_PARAM_SOURCES`. Die Registry braucht **9** Einträge, nicht 11 — `erfassungszelle`/`aenderungszelle`/`loeschzelle` teilen sich EIN Control, `fixed`/`se_variable` teilen den TextInput. **Wichtig:** geschlüsselt wird über `GESPEICHERTE_PARAM_QUELLEN` (11 + `aus`), nicht über `ACTION_PARAM_SOURCES` — sonst fällt die Quelle `aus` hinten runter.

   Gebaut in `zentrale/parameter/`: `bindungsRegistry.ts` (die 12 Schlüssel, je Quelle Anzeigename + Control + Startwert + Sperrgrund), `bindungen.tsx` (die 9 Controls), `wahlen.ts` (die Typen). `ParameterZeile.tsx` zeichnet nur noch die Zeile (408 → 75 Z.). Wer eine Quelle ergänzt, fasst EINE Stelle an: das `Record<ActionParamSource, …>` erzwingt den Eintrag, vorher fiel eine neue Quelle stumm in ein Auffang-Textfeld und dieselbe Quelle stand zusätzlich in `setSource` (Startwert) und in einem siebenfachen `||` (Sperrgrund). Die sieben Listen-Props reisen als ein `ParameterWahlen`-Bündel. Werkbank-Optik dabei: `PickerControl`/`Feld`/`Knopf` statt `WaehlerKnopf`/`TextInput`/`IconButton` — das Ketten-Formular ist damit vollständig umgestellt, die alten Atome bleiben für Punkt 5 stehen.
5. ✅ Datencenter (`zentrale/`) auf Overlay + Atome umstellen: Kommandozentrale und `KettenFenster` von der alten Optik auf Werkbank-Atome und Vollflächen-Overlay (heute noch zentrierte Karte).

   Beide Fenster komponieren jetzt `Dialog` — eigenes Portal, zentrierte Karte und eigener Esc-Lauscher sind weg (Kommandozentrale 82 → 50 Z., KettenFenster 136 → 99 Z.). Das KettenFenster hat dabei eine Kiste verloren: der „+ Schritt"-Knopf sitzt im Fensterkopf (`aktionen`), die Unterzeile „Schritte" ist ersatzlos weg. Mit dem ganzen Ordner (9 Dateien, 81 Stellen alter Palette) fallen `atoms/button`, `atoms/icon-button`, `atoms/text-input` und `molecules/field` aufruferlos aus — gelöscht werden sie erst in Punkt 6. `zentrale/Gruppe.tsx` ist gelöscht, das einklappbare Werkbank-`Gruppe` ersetzt sie. `border-amber-500` in der Schrittliste war die letzte Farbe außerhalb der Palette und ist `--wb-vormerkung`.

   Drei Abweichungen: `Dialog` bekam **`randlos`** (kein Innenabstand, kein eigener Scroller — beide Fenster bringen ihre Scroll-Flächen selbst mit) und **`escapeAbfangen`** (`window` in der Fangphase, dieselbe Mechanik wie `Popover`; sonst schließt EIN Esc die Löschfrage UND das Datencenter dahinter) · sein Vorlesename hängt jetzt per `aria-labelledby` an der Kopfzeile statt an einer Kopie des Titels, damit der Nebentitel mitzählt. Der `window.confirm`-Ersatz ist `useFrage()` in `src/editor/shell/Frage.tsx`: es liefert ein Versprechen, damit die Aufrufstelle `if (!await frage(…)) return` bleibt statt je Frage eine Zustandsmaschine zu brauchen. Die drei Fragen sagen jetzt im Knopf, was passiert („Löschen", „Alle löschen", „Ersetzen"), nicht mehr „OK". Nebenbei: die doppelte Trennlinie zwischen zwei Schritten (`divide-y` am `<ol>` UND `border-b` am `<li>`) ist weg — bei 70 % Deckkraft fiel sie nicht auf, in Palettenfarbe schon.

   **Verhaltensänderung:** die Vollfläche hat keinen Hintergrund zum Wegklicken mehr. Beide Fenster schließen über Esc und das Kreuz.

   **Gestrichen 2026-08-28:** der zweite Halbsatz („Aktionen bekommen eine Heimat … keine Doppelbearbeitung an zwei Orten mehr") ist erledigt und wird NICHT gebaut. Der Ketten-Editor hängt schon allein am Inspector (`Inspector.tsx:178` → `AktionenSektion.tsx` → `KettenFenster.tsx:52-58`); eine Umverdrahtung wäre Risiko ohne Nutzen.

   **Nachgetragen:** `window.confirm` lebt nicht nur in `zentrale/helfer.ts:27-38`, sondern auch **zweimal in `src/editor/shell/Toolbar.tsx:37` und `:89`** — darunter der gefährlichste Dialog überhaupt („Maske unwiderruflich ersetzt"). Punkt 1 ist mit ✅ abgeschlossen, also fielen die zwei sonst durchs Raster. Sie gehören hierher.
6. **[NACH ETAPPE 5]** Alte Atome/`tailwind-merge`/`clsx`-Reste entfernen, wenn aufruferlos. (Abhängigkeiten selbst erst entfernen, wenn wirklich nichts mehr importiert.)
7. ✅ **Der Tabellen-Schalter „Schlank" fliegt raus** (Nutzer-Ansage 2026-08-28: „hat absolut KEINEN Sinn"). Vorgezogen erledigt in `4c3e8b1`, nicht erst nach Etappe 5.

   Er nimmt heute Rahmen, Radius und Hintergrund weg und kürzt das Zellpolster von 10 px auf 6 px — **nimmt aber den `box-shadow` nicht zurück** (`blocks/tabelle/tabelleStil.ts:217-224`). Ergebnis: ein Schatten um eine unsichtbare Kiste. Der Schalter kostet den Bediener eine Entscheidung und liefert dafür einen Darstellungsfehler.

   Zu entfernen: `TabelleBlock.ts:107` (defaultProps), `:138` (`@property`), `:413` (Klassen-Push), `tabelleEigenschaften.ts:37` (Inspector-Eintrag), `tabelleStil.ts:217-224` und `erfassungStil.ts:26-27` (CSS).

   **Zwei Besonderheiten:** (a) Das ist der einzige Punkt in Etappe 4, der `src/blocks/` anfasst — danach **zwingend `npm run build:runtime`**, sonst veraltet das eingecheckte Bündel still. (b) Eine gespeicherte Maske mit `schlank='ja'` bekommt ihren Rahmen zurück; keine Migration nötig, das Attribut fällt beim Laden einfach weg.

### Quellen-UI: Hauptquelle vs. Hilfsquellen (Nutzer-Vorgabe, Pflichtteil)

Eine Tabelle hat genau eine **Hauptquelle** (deren Zeilen sie zeigt und in den Beleg schreibt, z. B. Belegposition) und beliebig viele **Hilfsquellen** (liefern nur Datensätze zum Nachschlagen und Befüllen, z. B. Artikelsuche — sie werden **nie** geschrieben). Genau diese zwei Wörter verwendet das UI — nicht "weitere Quellen".

1. **QuellenListe neu, zwei beschriftete Abschnitte.** Je Hilfsquelle auf einen Blick: (a) woran sie hängt (Schlüsselpaare zur Hauptquelle oder zu einer anderen Hilfsquelle), (b) welche Spalten/Erfassungszellen sie befüllt, (c) ob die Verknüpfung vollständig ist.

   **Präzisiert 2026-08-28 — (c) darf NICHT „kein Schlüsselpaar" heißen.** Das Fehlen eines Paares ist am 2026-08-27 ausdrücklich zum Normalfall erklärt worden (`core/data/sourceLinks.ts:31-39`: „Das Schlüsselpaar ist AUSDRÜCKLICH freiwillig … eine Quelle ohne Paar ist eine reine Nachschlagequelle"), und die Belegerfassung aus Punkt 5 ist genau dieser Fall. Ein `quellenProblem()` mit der alten Formulierung meldete ausgerechnet die Abnahme-Konfiguration dauerhaft als kaputt. Gemeldet wird nur, was nachweisbar kaputt ist: Quelle fehlt in der Bibliothek · ein Paar zeigt auf ein gelöschtes Feld · keine Zelle nutzt die Quelle.
2. Dafür eine reine Prüf-Funktion `quellenProblem()` nach dem Vorbild `stepProblem()` (`src/core/data/schrittPruefung.ts`) — läuft live im Panel, wird wie die Etappe-1-Tests abgesichert.
3. ✅ **FieldPicker zeigt die Herkunft:** bei jeder Feldwahl steht dran, aus welcher Quelle das Feld kommt. Eine Spalte, deren Feld aus einer Hilfsquelle kommt, trägt im Editor (nur im Editor, nie im Export) einen gedimmten Quellnamen unter dem Spaltentitel.

   **Achtung, das ist kein Zeichnen:** für den gedimmten Quellnamen gibt es heute keinen Editor-Kanal an den Baustein. Listeneinträge gehen roh hinüber (`blocks/tabelle/spalten.ts:3-19`, `editor/canvas/useLitElement.ts:104-124`). Nötig ist entweder ein zusätzliches Editor-Attribut analog `data-ff-editor` oder ein Klarname-Schlüssel je Listeneintrag plus Ausschlussregel in `listeFuerExport` — beides berührt `ListenBindung`. Eigener Bauschritt, nicht nebenbei.

   **Auflage 2026-08-28 (Nutzer-Ansage):** „nur im Editor, nie im Export" wird als **eigener Test** festgenagelt — das exportierte HTML enthält keine Herkunfts-Angabe. Der in `CLAUDE.md` genannte Referenzabzug (`src/export/referenz/`, `referenzabzug.test.ts`) existiert in diesem Repo **nicht**; er beschreibt das frühere Repo und taugt nicht als Absicherung. Wer sich beim Bau von Punkt 3 darauf beruft, hat nichts geprüft.

   Gebaut in `95fbcc5` und `1fedefd`. Der gedimmte Quellname steht unter dem Spaltentitel, aber NUR wo eine fremde Quelle im Spiel ist (`fremdeQuelleVon`: das Nachschlage-Feld führt, dann das Spaltenfeld). Der Riegel gegen den Export ist NICHT `attribute: false`, wie beim Bau zunächst angenommen, sondern dass die Eigenschaft nicht in `defaultProps` steht — `exportMask` schreibt Attribute nur für Schlüssel von dort; der Test in `export/herkunft.test.ts` hält beides fest.

   Am Spaltenkopf-Fenster hängen seither vier Nutzer-Entscheidungen vom 2026-08-28, alle aus der Bedienprobe: das zweite Feld heißt **„Nachschlagen"** (nicht „Füllfeld", nicht „Beim Erfassen" — beides verstand der Nutzer nicht) · es steht **offen**, nicht zugeklappt · **der Titel folgt IMMER dem gewählten Feld**, was die Regel vom 2026-08-27 („ein selbst getippter Name bleibt unangetastet") ausdrücklich umkehrt · ein zweiter Klick auf denselben Spaltenkopf **schließt** das Fenster. Nicht zurückdrehen ohne neue Ansage.

4. ✅ **Zwei Felder je Spalte — Spaltenfeld und Füllfeld (Nutzer-Vorgabe 2026-08-28).**

   Die Belegerfassung braucht beides gleichzeitig, und das Modell kann heute nur eines von beiden:

   | | Quelle | Rolle |
   |---|---|---|
   | **Spaltenfeld** | Hauptquelle (Belegposition) | Was die **gebuchte** Zeile zeigt und wohin die Kette schreibt |
   | **Füllfeld** | Hilfsquelle (Artikelsuche) | Nur beim **Erfassen**: wird der Satz gewählt, fällt der Wert in die Zelle |

   Heute leitet `blocks/tabelle/erfassungsZellen.ts:57` (`zellenzielVon`) aus dem EINEN Feldcode ab, was die Zelle ist — kein Quellen-Vorsatz = eigene Quelle, mit Vorsatz = verknüpfte Quelle. Entweder-oder. Praktisch heißt das: Spalte auf `POS_45_60` zeigt die gebuchte Zeile richtig und schreibt richtig, schlägt beim Erfassen aber aus den vorhandenen Positionen statt aus dem Artikelstamm vor. Spalte auf `ARTIKEL::Bezeichnung` füllt beim Erfassen, zeigt in der gebuchten Zeile aber **nichts** (`blocks/shared/fremdeQuellen.ts:38-41`) — und mit Schlüsselpaaren den heutigen Stammtext statt dem gebuchten, bei falschem Schreibziel.

   **Zusatz:** `Spalte` bekommt ein optionales zweites Feld `fuellFeld` (mit Quellen-Vorsatz). Eingestellt wird es am Spaltenkopf (Regel „Bedienung am Ding") und gespiegelt in der Hilfsquellen-Liste aus Punkt 1b. Die Übernahme-Mechanik existiert bereits vollständig (`erfassungsLauf.ts` `uebernimm`/`setze`/`gleicheAb`) — sie muss nur ein Füllfeld statt des Spaltenfeldes bedienen können.

   **Folge, die den Rest vereinfacht:** die Artikelsuche braucht damit **keine Schlüsselpaare**. Der Bediener sucht den Artikel von Hand, die gebuchte Zeile liest die Hauptquelle — es gibt nichts zu verknüpfen. Und „Hilfsquelle wird nie geschrieben" ist von selbst wahr: ein Füllfeld ist nie ein Schreibziel.

   Gebaut als Registry-Eintrag, nicht als Tabellen-Sonderfall (Verbot 5): `ListenBindung.eintragsFeldWahl` deklariert zusätzliche Felder je Eintrag, `SPALTEN_BINDUNG` trägt genau einen davon (`fuellFeld`, `nurFremdeQuellen`). `feldWahlenLesen` ist die EINE Leseart — Kopf-Fenster und Export lesen dieselbe Funktion, sonst stünde das Füllfeld im Editor und fehlte in der Bestellung. Beim Erfassen führt es in `zellenzielVon` (`erfassungsZellen.ts`); alle Aufrufer dieser Funktion sind Erfassungszeile, die gebuchte Zeile liest weiter über `macheFeldLeser`. Der Export bestellt es in `benutzteQuellen.ts` bei der Hilfsquelle. **Ein leer gewähltes Feld löscht seinen Schlüssel** (`schreibeInEintrag` nimmt `undefined`), sonst reiste `fuellFeld: ''` in jede Maskendatei mit.

5. ✅ **„Nie geschrieben" muss im Modell stehen, nicht nur auf dem Etikett.** Heute ist jede gebundene Spalte per Vorgabe änderbar (`blocks/tabelle/spaltenBindung.ts:37-45`, `standard: true`), unabhängig von der Herkunft ihres Feldes. Eine Spalte auf einer Hilfsquelle ist damit tippbar und erzeugt eine Vormerkung, die als Änderung der **Hauptquellen**-Zeile geführt wird (`aenderungen.ts` schlüsselt über deren Satznummer). Zu bauen: eine Spalte, deren Feld aus einer Hilfsquelle kommt, ist nie änderbar.

   **Und ein echter Fehler daneben:** der AUSgeschaltete Schalter „In der Zeile änderbar" wird beim Einlesen verworfen (`blocks/tabelle/spalten.ts:80`). Eine gerechnete Spalte (Gesamt, Rohertrag) bleibt in der exportierten Maske tippbar; der Bediener merkt eine Änderung vor, die keine Kette schreibt.

   Beides gebaut als EIN Merkmal am Schalter: `EintragsSchalter.nurEigeneQuelle`, ausgewertet in `schalterFuer` (`core/blocks/listenBindung.ts`). Damit erben es alle vier Leser derselben Frage — Kopf-Fenster, `spalteAenderbar`, `traegtAenderungen` und `listeFuerExport`; drei Kopien wären drei Gelegenheiten auseinanderzulaufen. Der Schalter wird dabei **verborgen**, nicht gesperrt: genau so verhält sich `nurBeiWahl` schon (Summe verschwindet an einer Textspalte), und „keine Warn-Anzeigen" ist feste Zusage. Der Lesefehler ist in `alsSpalte` behoben — `summe` und `aenderbar` werden jetzt beide als **Boolean** übernommen statt nur ein `true`; er hatte auch die Editor-Fläche getroffen, nicht nur den Export (`TabelleBlock.spaltenListe` läuft durch dasselbe `coerceSpalten`). Der Fehler biss doppelt und war doppelt unsichtbar.

   **Umzug nebenbei, kein Verhalten:** `QUELLEN_TRENNER`/`FeldZiel`/`bindungMitQuelle`/`zerlegeBindung` sind aus `BlockDefinition.ts` in ein eigenes `core/blocks/bindung.ts` gewandert. `schalterFuer` braucht `zerlegeBindung`, und `BlockDefinition` importiert bereits `listenBindung` — ein direkter Import wäre ein Ringschluss. `BlockDefinition` re-exportiert alles unverändert, kein anderer Import im Repo ändert sich.

6. ✅ **Der Spaltenkopf wird geteilt, bevor etwas dazukommt (Nutzer-Entscheidung 2026-08-28).**

   Im Spaltenkopf stecken heute schon sechs Sachen: Feld, Darstellung, Summe in der Fußzeile, In der Zeile änderbar, Status-Zuordnung, Umbenennen (dazu +/− in der Tabelle). Mit dem Füllfeld aus Punkt 4 wären es acht. Der Nutzer hat die Fläche ausdrücklich als „extrem überfüllt" beanstandet.

   Deshalb **zwei Ebenen**, dasselbe Muster wie „Erweitert — leer = Standard" im Ketten-Editor:
   - **Was die Spalte IST** — immer sichtbar, drei Zeilen: Titel · Feld · Darstellung.
   - **Was die Spalte TUT** — eine zugeklappte Zeile darunter: Summe · änderbar · Füllfeld · Rechnung (Punkt 7).

   **Diese Teilung ist Teil von Punkt 4, kein eigener Schritt.** Wer das Füllfeld ohne sie einbaut, macht eine schon zu volle Fläche voller.

   Gebaut mit zwei Abweichungen, beide begründet: (a) **Status-Zuordnung und die Detail-Felder („Bild + Name") bleiben in Ebene 1**, direkt unter der Darstellung — sie gehören zu ihr und erscheinen ohnehin nur bei einer einzigen Darstellung; „Was die Spalte tut" enthält Summe, änderbar und Füllfeld. (b) **Jede Feld-Wahl ist eine Zeile, die die EINE Liste unten auf sich zieht** — kein Fenster im Fenster. Ein `Popover` im `AuswahlFenster` schließt beide, weil das äußere jeden Zeigerdruck außerhalb seiner selbst als „woanders hin geklickt" liest; dieselbe Falle wie bei Esc im Datencenter (Punkt 4.5). Der Fenster-Rahmen bleibt deshalb `ui/molecules/auswahl-fenster` (er wird über Koordinaten aus dem Shadow-DOM gesetzt, das Werkbank-`Popover` braucht einen React-Anker), sein Inhalt läuft auf Werkbank-Atomen. `ui/molecules/waehler.tsx` ist damit aufruferlos — löschen in Punkt 6.

7. **Gerechnete Spalte — Dreisatz (Nutzer-Vorgabe 2026-08-28).**

   Anlass: Menge aus Dosierung. `Menge = Gewicht × Dosis ÷ Konzentration`. Der Editor kann heute nicht rechnen; die einzige Rechenfunktion ist die Spaltensumme in der Fußzeile.

   **Die Form ist fest, keine Formelsprache:**

   ```
   Menge  =  [ Spalte/Zahl ]  ×  [ Spalte/Zahl ]  ÷  [ Spalte/Zahl ]
   ```

   Drei Plätze, jeder wahlweise **eine Spalte derselben Tabelle** oder **eine feste Zahl**. Der dritte darf leer bleiben (dann nur `A × B`). Keine Klammern, keine Funktionen, kein Freitext — der Bediener tippt nirgends einen Ausdruck (Regel 3).

   **Verhalten:**
   - Rechnet **live in der Erfassungszeile**, sobald alle belegten Plätze einen Wert haben. Fehlt einer, bleibt die Zelle leer — keine Meldung.
   - **Überschreibbar.** Tippt der Bediener einen eigenen Wert (2,4 ml aufgerundet auf 2,5), gilt seiner, und die Zeile rechnet nicht dagegen an. Bei einer Tierarztmaske ist das Pflicht, keine Option.
   - **Nachkommastellen** kommen aus der Spalten-Darstellung, die es schon gibt.
   - **Gebuchte Zeilen rechnen nie.** Was im ERP steht, steht im ERP.
   - **Nur eine Stufe:** eine gerechnete Spalte darf nicht aus einer anderen gerechneten Spalte rechnen — sonst laufen Ketten im Kreis und niemand sieht mehr, woher eine Zahl kommt. Dieselbe Regel gilt schon bei der Verknüpfung.

   **Deutsche Zahlen einlesen gehört dazu**, sonst rechnet nichts: getipptes `0,5` muss ein halbes Stück heißen. Heute gibt es nur die Ausgabe-Seite (`blocks/tabelle/zahlFormat.ts`), keine Eingabe-Seite — ein getipptes `0,5` reist als Zeichenkette weiter. **Im Durchstich mitprüfen, in welcher Form SoftEngine die Menge erwartet** (Komma oder Punkt) — davon hängt ab, was beim Schreiben hinausgeht.

   **Das ist ein Baustein-Feature, kein Editor-Feature** — es muss auch in der exportierten Maske rechnen (`src/blocks/tabelle/`, die Erfassungszeile zieht mit `gleicheAb` schon heute Abhängiges nach). Danach `npm run build:runtime`.

   **Was ausdrücklich NICHT gerechnet wird:** Netto, Steuer, Brutto, Gesamt, Rohertrag. Die bestimmt das ERP (Staffelpreise, Kundenrabatt, Rundung). Rechnete die Maske mit, zeigte sie eine Zahl, die nicht die Wahrheit ist. Gerechnet wird nur, was **Eingabe** ist.

8. **Abnahme:** Die Konfiguration "Positionstabelle auf Belegposition, Artikelsuche als Hilfsquelle, Autofill von Bezeichnung/Einheit/Preis in der Erfassungszeile" ist im neuen UI ohne Handbuch anlegbar. Das ist zugleich Voraussetzung für den Durchstich.

### Ketten-Editor: Parameter wählbar statt rätselbar (Nutzer-Vorgabe, Pflichtteil)

Kernproblem: Eine echte Relation hat dutzende positionsbasierte Parameter — `PUT_RELATION[82!GJ!BELART!BELNR!STSPALTE!ARTNR!TEXT!MENGE!EPREIS!…]` (vollständige Doku im Anhang). Begriffe wie `PINDEX`, `VALUE`, `FELD_POS` versteht kein Mensch. Ziel: **an jedem Parameter ist in deutschen Worten ersichtlich, was er bedeutet und wo sein Wert herkommt** — und die richtige Wahl ist der bequemste Weg. Der Ketten-Editor wird dafür **neu gezeichnet, nicht umgestylt**.

**1. Relations-Katalog als Datenmodell** (`src/core/data/relations.ts` erweitern, mit Tests, Verbot 4 beachten).

**Nachgemessen 2026-08-28 — die Formänderung fasst DREI Dateien an, nicht eine, sonst scheitert sie still:**
- `core/data/relations.ts:200-207` — `pruefeRelationsVorlagen` baut jeden Eintrag aus einer **festen Sechs-Feld-Liste** neu. Ohne Erweiterung sind `name`/`beschreibung`/`feld`/`werte`/`leerVerhalten`/`zweck`/`rueckgabe`/`wiederholGruppe` nach jedem Neuladen kommentarlos weg — genau der Handpflege-Komfort aus Punkt 2/3. Derselbe Torwächter sitzt vor beiden Speicherwegen (`state/RelationStore.ts:14` mit `VorlagenStore.ts:52` für localStorage und für die Maskendatei). Das beantwortet zugleich die Migrationsfrage: erweitern statt migrieren, alte Vorlagen bleiben ohne die neuen Felder gültig.
- `export/exportMask.ts:245` kopiert die Parameter in `FF_RELATIONS`, `softengine/relations.ts:33-43` liest sie zurück. Passt die Form nicht, **verwirft die Laufzeit die Relation still**.
- Deshalb VOR dem Umbau ein Round-Trip-Test: Katalog → `FF_RELATIONS` → `findRuntimeRelation`.

Ein Parameter einer `RelationTemplate` trägt künftig optional:
- `name` — der Positionsname aus der Klammer (`MENGE`, `EINFUEGE_SNR`)
- `beschreibung` — der Doku-Text ("Satznummer nach der eingefügt wird")
- `feld` — das dokumentierte Zielfeld, wenn die Doku eins nennt (`TEXT` → POS `45_60`), als `{datei, pos, len}`
- `werte` — dokumentierte Aufzählung als Wert+Klartext-Paare (`J` = "Langtext automatisch auflösen", `1` = "Prüfen ob Einfügesnr Z-Zeilen folgen")
- `leerVerhalten` — was bei leerem Parameter passiert ("ohne Preis wird die Standardermittlung durchgeführt", "automatische Belegnummernvergabe")

Je Relation zusätzlich: `zweck` ("Position zu einem Beleg hinzufügen"), `rueckgabe` (GET 1020 → `BEL_0_11`), `wiederholGruppe` (die Folge `P!L!A!W`, bis 16× wiederholbar). Alles optional — die bestehende Vorlage 174 bleibt ohne Änderung gültig.

**2. Import aus Doku-Text — bewusst dumm gehalten.** Der SE-Doku-Text ist **freie Erklärung für Menschen, kein Format** — jede Relation ist anders beschrieben. Deshalb parst der Import ausschließlich, was wirklich maschinenlesbar ist: die **Syntaxzeile** (`PUT_RELATION[82!GJ!BELART!…]` → Verb, Nummer, Parameternamen in Reihenfolge, `...` = Zusatz-/Wiederholteil). Der gesamte restliche Text wird **unverändert** als Hilfetext angehängt (Absatz, der mit einem Parameternamen beginnt → Hilfetext dieses Parameters; Rest → Hilfetext der Relation) und im Formular angezeigt. **Aus Prosa wird nichts Semantisches geraten** — keine automatischen Wertelisten, keine automatischen Feld-Zuordnungen, keine Flag-Erkennung. Die strukturierten Extras aus Punkt 1 (feld, werte/Schalter, leerVerhalten) pflegt der Nutzer danach per Hand am Parameter, wo er den Komfort will — komplett optional, ohne sie funktioniert alles trotzdem (dann eben zweistufiger Wähler + Hilfetext). Testfälle: die drei Anhang-Dokus — erwartet werden nur Namen in richtiger Reihenfolge plus angehängte Hilfetexte.

**Zwei Präzisierungen 2026-08-28, ohne die der Import still Falsches liefert** (geprüft an den Anhang-Dokus selbst):
- Die Zuordnung „Absatz beginnt mit einem Parameternamen" muss **exakter Vergleich des ersten Wortes bis zum Leerzeichen** sein. Mit „beginnt mit" reißen die einbuchstabigen Parameter `P`/`L`/`A` die Absätze `PEH`, `PRUEFZ`, `PRUEFZ`, `LANGTEXT`, `LAGER`, `ARTNR` an sich.
- Die Textzeile `KATALOGART/EAN` passt auf **keinen** Syntax-Parameter (die Syntaxzeile kennt nur `EAN`). Absätze ohne exakten Treffer wandern in den Hilfetext der Relation — sie dürfen nicht raten. Erwartet im Test: drei Parameter der 82er ohne eigenen Hilfetext.

**3. Das Parameter-Formular.** Oberste Regel: **Leer ist der Normalfall — niemand muss Werte wählen, die er nicht kennt.** Sichtbar sind zuerst nur die Parameter, die ein Auto-Vorschlag trifft oder die für den Zweck nötig sind (bei PUT 82: BELNR, ARTNR, TEXT, MENGE, EPREIS, EINFUEGE_SNR). Alle übrigen (STSPALTE, LANGTEXT, PRUEFZ, …) liegen zugeklappt unter "Erweitert — leer = Standardverhalten", jeweils mit ihrem dokumentierten Leer-Verhalten daneben. Eine Zeile je Parameter, Links Name + Beschreibung, rechts die Wert-Bindung:
- a) **Automatischer Vorschlag:** Nur wenn dem Parameter im Katalog **von Hand** ein Feld zugewiesen wurde (`TEXT` → POS 45_60; der Import setzt so etwas nie) und in der Maske eine Spalte/Erfassungszelle an genau diesem Feld hängt, schlägt der Editor die Bindung sichtbar vor: "aus Erfassungszelle ‚Bezeichnung' (POS_45_60)" — ein Klick übernimmt. Ohne Handzuweisung kein Vorschlag — geraten wird nie.
- b) **Schalter statt Rätsel:** Flag-Parameter (LANGTEXT mit nur "J=…") sind ein einfacher Aus/An-Schalter mit Klartext-Beschriftung ("Langtext automatisch auflösen"), aus = Parameter bleibt leer. Echte Aufzählungen (PRUEFZ 1/2) sind eine Auswahl mit Klartext plus vorausgewählter Option "leer (Standard)". Nie Freitext, nie nackte Kürzel wie "J".
- c) **Zweistufiger Wähler** für den Rest: erst Quelle (nur die hier möglichen aus `ACTION_PARAM_SOURCES`, verständlich beschriftet), dann passender Wähler: Datenfeld → FieldPicker mit Herkunft; Baustein-Wert → Bausteinliste mit Klarnamen; Schritt-Ergebnis → nur GET-Schritte davor (`ergebnisSchritteVor()`) plus Rückgabefeld; Zellen-Quellen → Spaltenwahl der Tabelle; SE-Variable → Liste wo möglich.
- **Herkunftssatz an jeder gesetzten Bindung**, immer sichtbar: "kommt aus: Ergebnis von Schritt 1 ‚Belegkopf anlegen', Rückgabe BEL_0_11" / "fest: J (Langtext automatisch auflösen)" / "leer — dann: automatische Belegnummernvergabe".
- **Kein Jargon, nirgends:** interne Platzhalter erscheinen nie roh. Übersetzung an genau einer Stelle: `PINDEX` → "Satznummer der jeweiligen Zeile (automatisch aus der Vormerk-Liste)", `DROP_PINDEX` → "Satznummer der Löschzeile (automatisch)", `VALUE` → "Wert", `NOW_DATE` → "heutiges Datum", `RELID`/`ZIMMER` sinngemäß.

  ⚠ **EINGESCHRÄNKT 2026-08-28 (Nutzer-Ansage, sehr deutlich): die PARAMETER-NAMEN bleiben, wie sie sind.** `GJ`, `BELART`, `BELNR`, `ARTNR`, `MENGE`, `EINFUEGE_SNR`, `PINDEX` — das ist SoftEngine-Vokabular, nicht Jargon des Editors, genau wie `GET_RELATION` und `START_TOOL` (s. CLAUDE.md Regel 3, Ausnahmen). Sie werden **nicht** umbenannt und **nicht** übersetzt. Der Satz oben und die Tabelle daneben gelten nur für die **Beschreibungen und Beschriftungen drumherum**, die der Editor selbst erfindet — die dürfen nicht schwafeln. Wer die Namen anfasst, macht das Gegenteil dessen, was der Nutzer will. **Der Ketten-Editor bleibt vorerst ganz unangetastet** (dieselbe Ansage).
- **Wiederholgruppen:** `P!L!A!W` erscheint als "+ weiteres Feld schreiben" (bis 16), jede Wiederholung als Vierergruppe mit denselben Wählern (P/L aus dem FieldPicker ableiten — Feldposition und -länge stecken in der Feldwahl, der Nutzer wählt nur das Feld und die Eingabeart L/R/D).
- **Symbolische Vorschau** unter dem Formular: die zusammengesetzte Klammer mit Herkunfts-Etiketten statt Werten, z. B. `PUT_RELATION[82!fest:5!Belegkopf-Feld 2_1!…!Erfassungszelle Menge!…]` — Reihenfolge und Lücken auf einen Blick.
- Fehler am betroffenen Parameter (`stepProblem()` bleibt die eine Prüfquelle); je Schritt eine Klartext-Zusammenfassungszeile (`schrittZusammenfassung.ts` weiterverwenden). **Dafür muss die Rückgabe von `stepProblem` eine Parameter-Kennung tragen** (`core/data/schrittPruefung.ts:30-42` gibt heute nur eine Meldung) — eine der vier erlaubten Modell-Erweiterungen, s. Etappenkopf.

**Nachgetragen 2026-08-28 — Punkt 3a hat heute keine Datenbasis:** der Auto-Vorschlag braucht je Spalte den **Feldcode**, `editor/zentrale/helfer.ts:86-110` (`ErfassungsOption`/`erfassungsOptionen`) liefert aber nur Index und Titel. Der Feldcode existiert in der Listen-Bindung (`core/blocks/listenBindung.ts:6`, `feldKey`) und muss durchgereicht werden. Dazu gehört die Vergleichsregel: die Doku nennt `POS_45_60` (Datei + pos_len), die Spalte speichert den reinen Feldcode — verglichen wird nach Zerlegung, nie als Zeichenkette.

**4. Durchgedachtes Zielszenario** (Referenz für alles obige, wird in Etappe 6 real gebaut). Kette am Schreiben-Knopf der Positionstabelle:
1. Schritt "Belegkopf anlegen" — GET_RELATION[1020], Rückgabe `BEL_0_11`. (Bei Rahmen00001 existiert der Beleg schon — dann entfällt dieser Schritt und BELNR kommt aus dem offenen Satz BEL.)
2. Abschnitt je **erfasster** Zeile: erst GET_RELATION[678] "Einfüge-Satznummer ermitteln" (läuft dank Abschnittslogik automatisch einmal je Zeile), dann PUT_RELATION[82] "Position hinzufügen" — BELNR aus offenem Satz bzw. Schritt-1-Ergebnis, ARTNR/TEXT/MENGE/EPREIS aus den Erfassungszellen (Auto-Vorschlag), EINFUEGE_SNR aus dem GET davor, LANGTEXT fest "J", Rest leer mit dokumentiertem Standardverhalten.
3. Abschnitt je **geänderter** Zeile: Feld-Schreib-Relation (Muster 174), Satznummer automatisch.
4. Abschnitt je **Löschvormerkung**: Lösch-Relation, Satznummer der Löschzeile automatisch.
**Der Satz „Die Abschnitts-Laufzeit kann das heute schon" ist am 2026-08-28 am Code widerlegt worden. Sie kann es NICHT:**
- **Schritt-Ergebnisse überqueren keine Abschnittsgrenze.** `runEvent` ruft je Abschnitt neu (`blocks/shared/seAktionen.ts:319-320`, `:342`); `laufeSchritte` (`:219-247`) sammelt Ergebnisse nur innerhalb eines Laufs. „BELNR aus Schritt-1-Ergebnis" ist im Zeilen-Abschnitt (Punkt 2) damit nicht baubar.
- **„GET 678 läuft dank Abschnittslogik automatisch einmal je Zeile" ist unbelegt.** Ein Schritt landet nur dann im Zeilen-Abschnitt, wenn er SELBST einen zeilengebundenen Parameter trägt (`abschnitteVon`, `:138-146`) — die Signatur von 678 ist laut Lieferstand unten aber noch unbekannt.
- **PINDEX vergiftet jede Bindung auf eine andere Quelle.** `softengine/relations.ts:347-352` sucht die Zeile in der **gebundenen** Quelle statt in der Quelle der Zeile. Steht PINDEX auf der POS-Satznummer, wird im offenen Satz BEL nach einer Zeile mit dieser Nummer gesucht — es gibt keine, der Parameter geht **leer** hinaus. Genau der Fall „BELNR aus offenem Satz" aus Punkt 2/3. Trifft auch jeden Zeilenklick (`blocks/tabelle/zeilenEreignisse.ts:21`, `:33`), nicht nur Ketten. Kein Test pinnt das Verhalten.

**Folge für die Reihenfolge:** Punkt 4 ist keine Referenz für ein UI, sondern eine offene Bauaufgabe an der Laufzeit. Sie wird im Durchstich (neue Etappe 5) erledigt und BEWIESEN, bevor das Formular dafür gezeichnet wird. Ein Formular für eine Kette zu bauen, die nicht läuft, wäre die teuerste Reihenfolge von allen.

**5. Abnahme:** Die Kette aus Punkt 4 ist baubar, ohne dass irgendwo ein roher Platzhalter-Begriff auftaucht und ohne Freitext (außer bewussten Fixwerten); jeder Parameter zeigt Beschreibung und Herkunftssatz; die drei Anhang-Relationen sind über den Doku-Import angelegt.

Spalten-Einstellungen bleiben **am Ding** (Klick auf Kopf = Feld, Doppelklick = Umbenennen, +/− in der Tabelle) — das ist gut und bleibt; der "In der Zeile änderbar"-Schalter erscheint im Spalten-Popover in Werkbank-Optik.

## Zwischenschritt — drei Wächter-Nachträge (klein, ein Nachmittag) — **NACH ETAPPE 5**

Aus einer Code-Durchsicht 2026-08-28, von zwei Seiten unabhängig am Code nachgeprüft. Verhalten ändert sich nirgends; es geht darum, stille Fehler in Compiler-Fehler zu verwandeln. Der vierte und wichtigste Punkt derselben Durchsicht — der fehlende Export-Test — steht in Etappe 5 Punkt 5.

1. **`assertNever` in die fünf `switch`.** Es gibt sie im ganzen Repo kein einziges Mal. Der teuerste Fall: `editor/inspector/PropControl.tsx:243` endet auf `default: return null` — wer `PropertyKind` erweitert, bekommt keinen Fehler, die **Inspector-Zeile verschwindet einfach**. Die übrigen vier: `PropControl.tsx:92`, `blocks/formfeld/FormFeldBlock.ts:190`, `editor/zentrale/schrittZusammenfassung.ts:77`, `state/useKeyboardShortcuts.ts:32`.
2. **`leerHinweis` als benanntes Interface + Guard** statt `(el as unknown as { leerHinweis: string })` in `blocks/kanban/seRuntime.ts:59`. Das Muster steht schon in `core/blocks/BlockDefinition.ts` (`ErfassungsTraegerElement`, `LaufBerichtElement`). Betrifft zwei Klassen (`KanbanSpalteBlock`, `KanbanZimmerBlock`). **`src/blocks/` → danach `npm run build:runtime`.**
3. **`BlockComponentStatic` aus `BlockDefinition` ableiten.** Ein neues Baustein-Merkmal muss heute an DREI Stellen gepflegt werden: `BlockDefinition.ts`, `BlockComponent.ts` und die 36 handabgeschriebenen Zeilen in `blocks/base/BasicBlock.ts:66`. Vergisst man die dritte, ist das Merkmal in der Registry stumm nicht vorhanden.

**Ausdrücklich NICHT gemacht — geprüft und verworfen, nicht wieder vorschlagen:**
- *`Editor` in drei Klassen aufteilen.* `Historie` und `persistence` sind bereits eigene Module, der Editor IST die Fassade. Der Umbau benennt 19 Aufrufstellen um, ohne ein Verhalten zu ändern.
- *`nodeToHtml` als Visitor.* Ein Visitor bringt Dispatch nach Bausteintyp zurück — genau das, was Verbot 5 untersagt. Was die Funktion braucht, ist ein Schnitt am Attribut-Block, kein Muster. Und vorher den Test aus Etappe 5.
- *`BlockNode<P>` generisch / typisierte Props.* Der Store bleibt heterogen, und Canvas/Inspector/Export iterieren generisch — dort hilft es nicht. Die Baustein-Seite HAT bereits typisierte Properties (Lit `@property`). Falls die 41 verstreuten `.props[…]`-Zugriffe je stören: ein zentraler Leser über `PropertyDescription.kind`, das ist schon ein Laufzeit-Schema.
- *Alles einheitlich benennen (deutsch oder englisch).* 266 Dateien, null Funktionsgewinn, und jede Zusammenführung wird zur Hölle. Verbot 7 bleibt wie es ist.

**Beobachtet, nicht gemessen:** `state/useEditor.ts:12` abonniert EINEN `version`-Zähler für den ganzen Baum — jeder Tastendruck rendert jeden Abonnenten neu. Das ist das echte Problem hinter dem Vorwurf „God Class". Erst anfassen, wenn sich der Editor beim Tippen träge anfühlt; vorher ist es Optimieren ohne Messung.

## Etappe 5 — Durchstich: eine Position erfassen und schreiben (NEU, 2026-08-28)

Der schmalste Weg durch die ganze Kette, bevor Oberfläche für ihn gezeichnet wird: **eine** Positionstabelle, **eine** erfasste Zeile, **ein** PUT, Echttest beim Nutzer. Nicht die fertige Maske — der Beweis, dass die Mechanik trägt.

Anlass: die Prüfung vom 2026-08-28 hat vier Stellen belegt, an denen Etappe 6 heute scheitern MUSS. Keine davon ist eine Oberflächenfrage, alle vier liegen unter dem, was Etappe 4 gerade neu zeichnet. Sie hier zu finden kostet Stunden; in Etappe 6 kostet es die halbe Oberfläche noch einmal.

1. ✅ **Die Satznummer muss einstellbar werden.** `editor/zentrale/DataSourceForm.tsx:167-169` setzt bei jeder im Editor angelegten Quelle fest `indexField: '0_10'`; in den 333 Zeilen des Formulars gibt es dafür kein Bedienelement. Ohne Änderung ist Etappe 6 nur erreichbar, indem jemand die Maskendatei von Hand editiert.

   Gebaut in `da05673`: die Arten-Tabelle sagt, wer überhaupt eine Satznummer hat, und im Formular wird ein Feld der Quelle gewählt — Klarname, Feldcode daneben. Ein Wert, der zu keinem Feld passt, bleibt sichtbar stehen statt still zu verschwinden. Davor `b0b1b68`: die Bestellung nahm die Satznummer seit „nur benutzte Felder" gar nicht mehr mit, sobald irgendein Feld als benutzt galt — gebunden ist sie an keine Spalte. Ohne sie löst `{PINDEX}` sich nicht auf.

   **Der zweite Teil dieses Punktes ist NICHT gebaut:** `blocks/tabelle/seRuntime.ts` (`hatSatzNummer`) prüft weiterhin nur, ob die Satznummer KONFIGURIERT ist, nicht ob sie einen WERT liefert. Der stille Fall aus dem Absatz unten steht also noch.

   **Und es scheitert still:** `blocks/tabelle/seRuntime.ts:53-58` (`hatSatzNummer`) prüft nur, ob die Satznummer KONFIGURIERT ist — nicht, ob sie einen Wert LIEFERT. Die Tabelle bietet Ändern und Löschen also an (`TabelleBlock.ts:437-443`), der Bediener tippt, und `aenderungen.ts:30-31` wirft jede Vormerkung mit `return false` weg. Kein Fehler, keine Meldung. Beides gehört repariert: das Bedienelement UND die Prüfung auf den gelieferten Wert.

2. ✅ **Die Satznummer der Belegposition ist `645_10`** (Nutzer-Ansage 2026-08-28 — „interne Satznummer ist 645_10"). Damit erledigt: der Plan nannte vorher `888_10`, das war falsch; `core/data/quellenArten.ts:164` nennt bereits `645_10` „Satznummer" und bleibt unverändert. `645_10` ist der Wert, der als PINDEX in PUT 82/174 und in die Löschkette geht.

   **Trotzdem beim Durchstich als Erstes nachsehen:** `CLAUDE.md` protokolliert aus dem Relation-69-Echttest, dass `645_10` dort **leer** zurückkam. Das war ein anderer Leseweg (Feld für Feld über GET 69, nicht der SEFILELOOP-Schub) — es kann also gut sein, dass die Maske den Wert sehr wohl geliefert bekommt. Beweisen muss es der Durchstich: kommt `645_10` im Datenschub leer an, scheitern Ändern und Löschen **still** (s. Punkt 1), und zwar bevor irgendjemand eine Kette gebaut hat. Ein Blick in die gelieferten Zeilen beantwortet das in einer Minute.

   **Beantwortet 2026-08-28 (Nutzer am laufenden Stand): `645_10` WIRD geliefert.** Der Wert kommt im Datenschub an, Ändern und Löschen gebuchter Zeilen haben damit ihre Grundlage. Die Sorge aus dem Relation-69-Echttest ist erledigt — nicht weiter danach suchen. Offen bleibt allein die zweite Hälfte von Punkt 1: `hatSatzNummer` prüft weiter nur, ob die Satznummer KONFIGURIERT ist, nicht ob sie einen Wert liefert.

3. **PINDEX darf Bindungen auf andere Quellen nicht vergiften.** `softengine/relations.ts:347-352` (Beleg s. Ketten-Editor Punkt 4). Zu bauen: eine Quelle ohne Zeilenbezug — der offene Satz voran — liefert in einem Zeilen-Abschnitt weiter `rows[0]`. Der Kommentar in `softengine/data.ts:153-155` schreibt genau diese Annahme schon hin; `relations.ts` überspringt sie. Mit Test.

4. ✅ **Schritt-Ergebnisse über die Abschnittsgrenze.** Ohne das ist „BELNR aus Schritt-1-Ergebnis" nicht baubar (Beleg s. Ketten-Editor Punkt 4). Kleinste Fassung: das Ergebnis der Schritte VOR dem ersten Zeilen-Abschnitt steht allen Abschnitten zur Verfügung. Gebaut in `f5d0ee9`, mit Tests in `seAktionen.test.ts`.

5. **Der Export-Test, den Verbot 4 längst verlangt.** `exportMask.ts:76-192` (`nodeToHtml`) — der gesamte Baustein-Export — wird heute von KEINEM Test mit einem echten Baustein ausgeführt: die einzige Prüfmaske in `validator.test.ts:5-8` ist ein leerer Wurzelknoten. Vor jedem weiteren Export-Umbau: ein Test mit Formfeld + Tabelle mit gebundenen Spalten + Knopf mit Kette, der das erzeugte Markup prüft. Dazu je ein Fall für `kind: 'erpabfrage'` in `sevariablen.test.ts` und für `benutzteFelderJeQuelle` (`export/benutzteQuellen.ts:67-110`, heute ohne Test — und die neue Quellen-UI soll dieselbe Frage beantworten wie der Export; geben beide verschiedene Antworten, meldet das Panel eine Hilfsquelle als vollständig, während der Export ihre Felder nie bestellt).

6. **Abnahme:** In einer Wegwerf-Maske eine Position erfassen und schreiben, Echttest beim Nutzer. Erst wenn das läuft, wird das Parameter-Formular aus Etappe 4 dafür gezeichnet.

## Etappe 6 — Nachweis: Rahmen00001 aus dem Editor erzeugen

Ziel: die Handmaske `E:\DATA\VSES-Muhammed\Vorlagen\Belegerfassung\LAYOUTRAHMEN\00001\Rahmen00001.basis.source.html` (887 Z. Handschrift, "Buchen" ist dort nur ein console.log-Stub) durch eine **im Editor gebaute** Maske ersetzen:

1. Im Editor anlegen: Belegkopf als Formfelder auf offenem Satz `BEL` (VAR: 2_1 Art, 3_8 Nr, 19_10 Datum, 11_8 + 3440_60 Kunde, 453_12 Summe); Positionstabelle auf SEFILELOOP `POS` (KOPFSATZ_INDEX `BEL_0_11`; Spalten: 18_25 ArtNr, 45_60 Bezeichnung, 164_8 Menge **änderbar**, 689_5 Einheit, 246_9 EPreis, 280_12 Gesamt, 1401_12 Rohertrag; **Satznummer `645_10`**, Nutzer-Ansage 2026-08-28 — der Plan nannte bis dahin fälschlich `888_10`); Artikelsuche als ERPAPICALL `ARTIKEL.GET`, angelegt als **Hilfsquelle** über das neue Quellen-UI (Abnahme aus Etappe 4), für die Erfassungszeile; ein Schreiben-Knopf mit Ketten-Abschnitten für erfasst/geändert/gelöscht.

   **Was „Artikelsuche" heute heißt — vor dem Bau zu entscheiden (2026-08-28).** Eine Datenquelle kann keinen Parameter tragen (`core/data/dataSources.ts:35-55`), und einen Laufzeit-Ruf gibt es nirgends im Code: gelesen wird ausschließlich, was SoftEngine beim Öffnen mitgeschickt hat (`softengine/data.ts:211-219`, `blocks/formfeld/nachschlagen.ts:171-174`). `ARTIKEL.GET` als Hilfsquelle bedeutet damit zwangsläufig: **der ungefilterte Gesamtbestand kommt beim Öffnen der Maske.** Zusammen mit dem protokollierten Bild-Nachschlag (`CLAUDE.md`: 5.953 Aufrufe in 9,2 s bei kleiner Feldliste) ist das ein Risiko für die Öffnungszeit, kein Detail. Entweder bewusst annehmen und im Echttest messen — oder vorher entscheiden, wie eingegrenzt wird. Ein Suchruf zur Laufzeit ist KEIN Ausweg: er ist nicht gebaut, und `CLAUDE.md` protokolliert, dass ERPAPICALL per `basisHTML_SND_MSG` die WinUI-Maske einfriert. Nur benutzte Felder deklarieren — der tote Ballast der Handmaske (BELERF_*, 9 ungenutzte POS-Felder) wird NICHT übernommen.
2. Export, Dateien als `Rahmen00001.basis.source.html` + `.SEvariablen.json` in den Ordner legen (Original vorher als `_hand`-Kopie sichern).
3. **Echttest in der WEBWARE macht der Nutzer.** Fehlerbilder zurück in die Tests aus Etappe 1.

### Lieferstand der Schreib-Relationen

**Bereits geliefert** (Doku im Anhang, per Doku-Import anlegen): PUT_RELATION[82] "Position zu einem Beleg hinzufügen", GET_RELATION[1020] "Neuanlage Belegkopf" (Rückgabe BEL_0_11), GET_RELATION[640] "Neuen IDB-Satz automatisch anlegen".

**Fehlt noch — muss der Nutzer im selben Doku-Format liefern:** (a) Relation "Position ändern" (oder Bestätigung, dass Muster 174 mit PINDEX=Satznummer der Weg ist), (b) Relation "Position löschen", (c) die vollständige Signatur von GET_RELATION[678] "Einfüge-Satznummer ermitteln" (in der 82er-Doku nur erwähnt). Quelle: SE-Doku / Variablenauswahl Dialog 1756. Bis dahin werden diese zwei Ketten-Abschnitte mit der Standard-Vorlage 174 gebaut und im Datencenter klar als "Relation folgt" benannt. `pindex` = Satznummer des Zielsatzes ist belegt.

---

## Was ausdrücklich NICHT gemacht wird

- Kein Neubau auf PageBuilder-Basis, keine Portierung von PageBuilder-Code.
- Keine Änderungen an der Masken-Designsprache (V11-Palette) — nur der Editor wird neu.
- Kein Umbau der Ketten-/Abschnittslogik in `seAktionen.ts` über Etappe 3 hinaus — sie ist die klügste Stelle des Projekts. **Eine Ausnahme seit 2026-08-28:** Etappe 5 Punkt 4 (Schritt-Ergebnisse über die Abschnittsgrenze) ist zugelassen, weil das Zielszenario ohne sie nicht läuft. Kleinste Fassung, mit Test, sonst bleibt die Datei unangetastet.
- Keine neuen Bausteintypen, keine Mehrseiten-Features, nichts, was nicht auf dem Weg zu Rahmen00001 liegt.

---

## Anhang — Relations-Doku (vom Nutzer geliefert 2026-08-27; Seed und Parser-Testfälle für den Doku-Import)

```
PUT_RELATION[82!GJ!BELART!BELNR!STSPALTE!ARTNR!TEXT!MENGE!EPREIS!PEH!EK!RABP!RABADR!VTRNR!EINFUEGE_SNR!EAPINFO!EAN!LANGTEXT!BUCHUNGSART!BUDAT!LAGER!TIDENT!SERNR!CHANR!PRUEFZ!KOID!KOGID!SACHKONTO!MARK!P!L!A!W!...]

Position zu einem Beleg hinzufügen

Parameter/Rückgabe:
GJ            Geschäftsjahr 0-9
BELART        Belegart NALRGblrgI
BELNR         Belegnummer -> der Beleg muß bereits existieren !
STSPALTE      Steuerspalte POS_17_1
ARTNR         Artikelnummer
TEXT          POS_45_60
MENGE         Menge
EPREIS        Einzelpreis -> ohne Preis wird die Standardermittlung durchgeführt
PEH           Preiseinheit POS_798_6
EK            Einkaufspreis POS_308_12
RABP          Rabatt % POS_265_5
RABADR        Kundenrabatt POS_780_5
VTRNR         Vertreternummer POS_695_8
EINFUEGE_SNR  Satznummer nach der eingefügt wird (zu ermitteln via GET_RELATION[678!...]
EAPINFO       POS_317_1
KATALOGART/EAN POS_617_25
LANGTEXT      J=Langtext automatisch auflösen
BUCHUNGSART   POS_116_1
BUDAT         Buchungsdatum POS_330_10
LAGER         Lagerangabe POS_350_8
TIDENT        Textilident POS_460_10
SERNR         J/N setzt POS_112_1
CHANR         J/N setzt POS_113_1; J -> Mit Charge
PRUEFZ        Prüfung Z/K-Zeilen: 1 -> Prüfen ob Einfügesnr Z-Zeilen folgen; 2 -> Auf K-Zeilen
KONTRAKT_ID   POS_494_7
KONTINGENT_ID POS_504_1
SACHKONTO     POS_442_8
MARK          POS_490_1
P             frei wählbare Feldposition
L             frei wählbare Feldlänge
A             Eingabeart: L=Linksbündig, R=Rechtsbündig, D=Datum
W             Wert (max. Länge 128 Bytes)
HINWEIS       Parameter (P!L!A!W) können bis zu 16 mal wiederholt werden
```

```
GET_RELATION[640!IDBID!DATUMBEDIENER!PROTOKOLL]

Neuen IDB-Satz automatisch anlegen

Parameter/Rückgabe:
DATUMBEDIENER Soll im neuen Satz auch Anlagedatum und Bediener gesetzt werden: 0 = nicht setzen, 1 = setzen
PROTOKOLL     Soll die Vergabe bereits im Ereignisprotokoll protokolliert werden: 0 = Nein, 1 = Ja
```

```
GET_RELATION[1020!BELEGART!BGRUPPE!ADRNR!BELDATUM!PRJNR!BELNR!JAHR]

Neuanlage Belegkopf, Rückgabe BEL_0_11

Parameter/Rückgabe:
BELNR         bei keiner Angabe erfolgt automatische Belegnummernvergabe
JAHR          Belegjahr (0-9), ohne Angabe wird der aktuelle Belegzeitraum verwendet
```
