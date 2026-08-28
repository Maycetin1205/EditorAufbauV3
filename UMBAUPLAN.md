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

Gilt **nur für den Editor** (`src/editor/`, `src/ui/`). Die exportierte Maske (masken-tokens.css, V11-Palette) bleibt unangetastet. Das darunterliegende Modell (`PropertyDescription`, `ListenBindung`, `BlockDefinition`, `schrittPruefung`) bleibt **exakt wie es ist** — es wird nur neu gezeichnet.

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
4. **`ParameterZeile.tsx` (408 Z.) neu:** statt 11 `if (binding.source === …)`-Zweigen eine Registry `Quelle → Control-Komponente` (dasselbe Muster wie PropControl). Die 12 Parameterquellen aus `ACTION_PARAM_SOURCES` bleiben fachlich unverändert.
5. Datencenter (`zentrale/`) auf Overlay + Atome umstellen; Aktionen bekommen eine Heimat: Inspector listet Ereignisse und öffnet den Ketten-Editor als Overlay — keine Doppelbearbeitung an zwei Orten mehr.
6. Alte Atome/`tailwind-merge`/`clsx`-Reste entfernen, wenn aufruferlos. (Abhängigkeiten selbst erst entfernen, wenn wirklich nichts mehr importiert.)

### Quellen-UI: Hauptquelle vs. Hilfsquellen (Nutzer-Vorgabe, Pflichtteil)

Eine Tabelle hat genau eine **Hauptquelle** (deren Zeilen sie zeigt und in den Beleg schreibt, z. B. Belegposition) und beliebig viele **Hilfsquellen** (liefern nur Datensätze zum Nachschlagen und Befüllen, z. B. Artikelsuche — sie werden **nie** geschrieben). Genau diese zwei Wörter verwendet das UI — nicht "weitere Quellen".

1. **QuellenListe neu, zwei beschriftete Abschnitte.** Je Hilfsquelle auf einen Blick: (a) woran sie hängt (Schlüsselpaare zur Hauptquelle oder zu einer anderen Hilfsquelle), (b) welche Spalten/Erfassungszellen sie befüllt, (c) ob die Verknüpfung vollständig ist. Unvollständig (kein Schlüsselpaar, Paar zeigt auf gelöschtes Feld, keine Zelle nutzt die Quelle) = Klartext-Hinweis direkt am Eintrag statt stillem Nichtfunktionieren.
2. Dafür eine reine Prüf-Funktion `quellenProblem()` nach dem Vorbild `stepProblem()` (`src/core/data/schrittPruefung.ts`) — läuft live im Panel, wird wie die Etappe-1-Tests abgesichert.
3. **FieldPicker zeigt die Herkunft:** bei jeder Feldwahl steht dran, aus welcher Quelle das Feld kommt. Eine Spalte, deren Feld aus einer Hilfsquelle kommt, trägt im Editor (nur im Editor, nie im Export) einen gedimmten Quellnamen unter dem Spaltentitel — man sieht der Tabelle sofort an, welche Spalten eigene (Belegposition) und welche nachgeschlagene sind.
4. **Abnahme:** Die Konfiguration "Positionstabelle auf Belegposition, Artikelsuche als Hilfsquelle, Autofill von Bezeichnung/Einheit/Preis in der Erfassungszeile" ist im neuen UI ohne Handbuch anlegbar. Das ist zugleich Voraussetzung für Etappe 5.

### Ketten-Editor: Parameter wählbar statt rätselbar (Nutzer-Vorgabe, Pflichtteil)

Kernproblem: Eine echte Relation hat dutzende positionsbasierte Parameter — `PUT_RELATION[82!GJ!BELART!BELNR!STSPALTE!ARTNR!TEXT!MENGE!EPREIS!…]` (vollständige Doku im Anhang). Begriffe wie `PINDEX`, `VALUE`, `FELD_POS` versteht kein Mensch. Ziel: **an jedem Parameter ist in deutschen Worten ersichtlich, was er bedeutet und wo sein Wert herkommt** — und die richtige Wahl ist der bequemste Weg. Der Ketten-Editor wird dafür **neu gezeichnet, nicht umgestylt**.

**1. Relations-Katalog als Datenmodell** (`src/core/data/relations.ts` erweitern, mit Tests, Verbot 4 beachten). Ein Parameter einer `RelationTemplate` trägt künftig optional:
- `name` — der Positionsname aus der Klammer (`MENGE`, `EINFUEGE_SNR`)
- `beschreibung` — der Doku-Text ("Satznummer nach der eingefügt wird")
- `feld` — das dokumentierte Zielfeld, wenn die Doku eins nennt (`TEXT` → POS `45_60`), als `{datei, pos, len}`
- `werte` — dokumentierte Aufzählung als Wert+Klartext-Paare (`J` = "Langtext automatisch auflösen", `1` = "Prüfen ob Einfügesnr Z-Zeilen folgen")
- `leerVerhalten` — was bei leerem Parameter passiert ("ohne Preis wird die Standardermittlung durchgeführt", "automatische Belegnummernvergabe")

Je Relation zusätzlich: `zweck` ("Position zu einem Beleg hinzufügen"), `rueckgabe` (GET 1020 → `BEL_0_11`), `wiederholGruppe` (die Folge `P!L!A!W`, bis 16× wiederholbar). Alles optional — die bestehende Vorlage 174 bleibt ohne Änderung gültig.

**2. Import aus Doku-Text — bewusst dumm gehalten.** Der SE-Doku-Text ist **freie Erklärung für Menschen, kein Format** — jede Relation ist anders beschrieben. Deshalb parst der Import ausschließlich, was wirklich maschinenlesbar ist: die **Syntaxzeile** (`PUT_RELATION[82!GJ!BELART!…]` → Verb, Nummer, Parameternamen in Reihenfolge, `...` = Zusatz-/Wiederholteil). Der gesamte restliche Text wird **unverändert** als Hilfetext angehängt (Absatz, der mit einem Parameternamen beginnt → Hilfetext dieses Parameters; Rest → Hilfetext der Relation) und im Formular angezeigt. **Aus Prosa wird nichts Semantisches geraten** — keine automatischen Wertelisten, keine automatischen Feld-Zuordnungen, keine Flag-Erkennung. Die strukturierten Extras aus Punkt 1 (feld, werte/Schalter, leerVerhalten) pflegt der Nutzer danach per Hand am Parameter, wo er den Komfort will — komplett optional, ohne sie funktioniert alles trotzdem (dann eben zweistufiger Wähler + Hilfetext). Testfälle: die drei Anhang-Dokus — erwartet werden nur Namen in richtiger Reihenfolge plus angehängte Hilfetexte.

**3. Das Parameter-Formular.** Oberste Regel: **Leer ist der Normalfall — niemand muss Werte wählen, die er nicht kennt.** Sichtbar sind zuerst nur die Parameter, die ein Auto-Vorschlag trifft oder die für den Zweck nötig sind (bei PUT 82: BELNR, ARTNR, TEXT, MENGE, EPREIS, EINFUEGE_SNR). Alle übrigen (STSPALTE, LANGTEXT, PRUEFZ, …) liegen zugeklappt unter "Erweitert — leer = Standardverhalten", jeweils mit ihrem dokumentierten Leer-Verhalten daneben. Eine Zeile je Parameter, Links Name + Beschreibung, rechts die Wert-Bindung:
- a) **Automatischer Vorschlag:** Nur wenn dem Parameter im Katalog **von Hand** ein Feld zugewiesen wurde (`TEXT` → POS 45_60; der Import setzt so etwas nie) und in der Maske eine Spalte/Erfassungszelle an genau diesem Feld hängt, schlägt der Editor die Bindung sichtbar vor: "aus Erfassungszelle ‚Bezeichnung' (POS_45_60)" — ein Klick übernimmt. Ohne Handzuweisung kein Vorschlag — geraten wird nie.
- b) **Schalter statt Rätsel:** Flag-Parameter (LANGTEXT mit nur "J=…") sind ein einfacher Aus/An-Schalter mit Klartext-Beschriftung ("Langtext automatisch auflösen"), aus = Parameter bleibt leer. Echte Aufzählungen (PRUEFZ 1/2) sind eine Auswahl mit Klartext plus vorausgewählter Option "leer (Standard)". Nie Freitext, nie nackte Kürzel wie "J".
- c) **Zweistufiger Wähler** für den Rest: erst Quelle (nur die hier möglichen aus `ACTION_PARAM_SOURCES`, verständlich beschriftet), dann passender Wähler: Datenfeld → FieldPicker mit Herkunft; Baustein-Wert → Bausteinliste mit Klarnamen; Schritt-Ergebnis → nur GET-Schritte davor (`ergebnisSchritteVor()`) plus Rückgabefeld; Zellen-Quellen → Spaltenwahl der Tabelle; SE-Variable → Liste wo möglich.
- **Herkunftssatz an jeder gesetzten Bindung**, immer sichtbar: "kommt aus: Ergebnis von Schritt 1 ‚Belegkopf anlegen', Rückgabe BEL_0_11" / "fest: J (Langtext automatisch auflösen)" / "leer — dann: automatische Belegnummernvergabe".
- **Kein Jargon, nirgends:** interne Platzhalter erscheinen nie roh. Übersetzung an genau einer Stelle: `PINDEX` → "Satznummer der jeweiligen Zeile (automatisch aus der Vormerk-Liste)", `DROP_PINDEX` → "Satznummer der Löschzeile (automatisch)", `VALUE` → "Wert", `NOW_DATE` → "heutiges Datum", `RELID`/`ZIMMER` sinngemäß.
- **Wiederholgruppen:** `P!L!A!W` erscheint als "+ weiteres Feld schreiben" (bis 16), jede Wiederholung als Vierergruppe mit denselben Wählern (P/L aus dem FieldPicker ableiten — Feldposition und -länge stecken in der Feldwahl, der Nutzer wählt nur das Feld und die Eingabeart L/R/D).
- **Symbolische Vorschau** unter dem Formular: die zusammengesetzte Klammer mit Herkunfts-Etiketten statt Werten, z. B. `PUT_RELATION[82!fest:5!Belegkopf-Feld 2_1!…!Erfassungszelle Menge!…]` — Reihenfolge und Lücken auf einen Blick.
- Fehler am betroffenen Parameter (`stepProblem()` bleibt die eine Prüfquelle); je Schritt eine Klartext-Zusammenfassungszeile (`schrittZusammenfassung.ts` weiterverwenden).

**4. Durchgedachtes Zielszenario** (Referenz für alles obige, wird in Etappe 5 real gebaut). Kette am Schreiben-Knopf der Positionstabelle:
1. Schritt "Belegkopf anlegen" — GET_RELATION[1020], Rückgabe `BEL_0_11`. (Bei Rahmen00001 existiert der Beleg schon — dann entfällt dieser Schritt und BELNR kommt aus dem offenen Satz BEL.)
2. Abschnitt je **erfasster** Zeile: erst GET_RELATION[678] "Einfüge-Satznummer ermitteln" (läuft dank Abschnittslogik automatisch einmal je Zeile), dann PUT_RELATION[82] "Position hinzufügen" — BELNR aus offenem Satz bzw. Schritt-1-Ergebnis, ARTNR/TEXT/MENGE/EPREIS aus den Erfassungszellen (Auto-Vorschlag), EINFUEGE_SNR aus dem GET davor, LANGTEXT fest "J", Rest leer mit dokumentiertem Standardverhalten.
3. Abschnitt je **geänderter** Zeile: Feld-Schreib-Relation (Muster 174), Satznummer automatisch.
4. Abschnitt je **Löschvormerkung**: Lösch-Relation, Satznummer der Löschzeile automatisch.
Die Abschnitts-Laufzeit (`seAktionen.ts`) kann das heute schon — neu ist ausschließlich, dass das UI es ohne Jargon zusammenklickbar macht.

**5. Abnahme:** Die Kette aus Punkt 4 ist baubar, ohne dass irgendwo ein roher Platzhalter-Begriff auftaucht und ohne Freitext (außer bewussten Fixwerten); jeder Parameter zeigt Beschreibung und Herkunftssatz; die drei Anhang-Relationen sind über den Doku-Import angelegt.

Spalten-Einstellungen bleiben **am Ding** (Klick auf Kopf = Feld, Doppelklick = Umbenennen, +/− in der Tabelle) — das ist gut und bleibt; der "In der Zeile änderbar"-Schalter erscheint im Spalten-Popover in Werkbank-Optik.

## Etappe 5 — Nachweis: Rahmen00001 aus dem Editor erzeugen

Ziel: die Handmaske `E:\DATA\VSES-Muhammed\Vorlagen\Belegerfassung\LAYOUTRAHMEN\00001\Rahmen00001.basis.source.html` (887 Z. Handschrift, "Buchen" ist dort nur ein console.log-Stub) durch eine **im Editor gebaute** Maske ersetzen:

1. Im Editor anlegen: Belegkopf als Formfelder auf offenem Satz `BEL` (VAR: 2_1 Art, 3_8 Nr, 19_10 Datum, 11_8 + 3440_60 Kunde, 453_12 Summe); Positionstabelle auf SEFILELOOP `POS` (KOPFSATZ_INDEX `BEL_0_11`; Spalten: 18_25 ArtNr, 45_60 Bezeichnung, 164_8 Menge **änderbar**, 689_5 Einheit, 246_9 EPreis, 280_12 Gesamt, 1401_12 Rohertrag; Satznummer 888_10); Artikelsuche als ERPAPICALL `ARTIKEL.GET`, angelegt als **Hilfsquelle** über das neue Quellen-UI (Abnahme aus Etappe 4), für die Erfassungszeile; ein Schreiben-Knopf mit Ketten-Abschnitten für erfasst/geändert/gelöscht. Nur benutzte Felder deklarieren — der tote Ballast der Handmaske (BELERF_*, 9 ungenutzte POS-Felder) wird NICHT übernommen.
2. Export, Dateien als `Rahmen00001.basis.source.html` + `.SEvariablen.json` in den Ordner legen (Original vorher als `_hand`-Kopie sichern).
3. **Echttest in der WEBWARE macht der Nutzer.** Fehlerbilder zurück in die Tests aus Etappe 1.

### Lieferstand der Schreib-Relationen

**Bereits geliefert** (Doku im Anhang, per Doku-Import anlegen): PUT_RELATION[82] "Position zu einem Beleg hinzufügen", GET_RELATION[1020] "Neuanlage Belegkopf" (Rückgabe BEL_0_11), GET_RELATION[640] "Neuen IDB-Satz automatisch anlegen".

**Fehlt noch — muss der Nutzer im selben Doku-Format liefern:** (a) Relation "Position ändern" (oder Bestätigung, dass Muster 174 mit PINDEX=Satznummer der Weg ist), (b) Relation "Position löschen", (c) die vollständige Signatur von GET_RELATION[678] "Einfüge-Satznummer ermitteln" (in der 82er-Doku nur erwähnt). Quelle: SE-Doku / Variablenauswahl Dialog 1756. Bis dahin werden diese zwei Ketten-Abschnitte mit der Standard-Vorlage 174 gebaut und im Datencenter klar als "Relation folgt" benannt. `pindex` = Satznummer des Zielsatzes ist belegt.

---

## Was ausdrücklich NICHT gemacht wird

- Kein Neubau auf PageBuilder-Basis, keine Portierung von PageBuilder-Code.
- Keine Änderungen an der Masken-Designsprache (V11-Palette) — nur der Editor wird neu.
- Kein Umbau der Ketten-/Abschnittslogik in `seAktionen.ts` über Etappe 3 hinaus — sie ist die klügste Stelle des Projekts.
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
