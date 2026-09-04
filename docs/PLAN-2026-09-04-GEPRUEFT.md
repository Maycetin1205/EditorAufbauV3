# PLAN — Aufbau-Editor, geprueft und fortgeschrieben
Stand 2026-09-04 · gegen Commit `cd94164` + `arena/01a06bd8` (Schritt 21 erledigt)

**Was dieses Dokument ist.** Eine unabhaengige Nachpruefung von
`docs/PLAN-2026-09-04.md`, Zeile fuer Zeile, gegen den Code. Jede Behauptung
des Vorgaengers wurde einzeln nachgemessen. Das Ergebnis steht in Abschnitt 1
(gehalten), Abschnitt 2 (widerlegt/korrigiert) und Abschnitt 3 (neu gefunden).

**Wie zu lesen.** Jede Zeile nennt Datei und Zeile. Pruefe am Code, nicht an
diesem Dokument. Wo "NICHT GELESEN" steht, ist die Datei nicht geoeffnet
worden — dort gilt kein Urteil, weder gut noch schlecht.

**Umfang der Pruefung, ehrlich.** Gelesen wurden rund 3.500 von 34.888 Zeilen
(10 %): `relations.ts`, `seAktionen.ts`, `bridge.ts`, `Editor.ts`,
`persistence.ts`, `history.ts`, `speicherPlaner.ts`, `spaltenAufraeumen.ts`,
`datenAnschluss.ts`, `providers.tsx`, `notfallkopie.ts`, `blockRegistry.ts`,
`BasicBlock.ts`, `maskeUebernehmen.ts`, `erfassungsLauf.ts` (teilweise), sowie
alle im Vorgaengerplan genannten Fundstellen. Dazu maschinelle Vollpruefung
aller 385 Dateien auf Risikomuster. Abschnitt 6 nennt, was ungelesen blieb.

---

## 0. Zusammenfassung fuer den Besitzer

Der Vorgaengerplan ist **in der Fehlersuche gut und in der Selbstbeschreibung
unehrlich**. Seine neun Hauptbefunde (F1-F9) stimmen fast alle. Seine fuenf
Nachtraege (F10-F14) sind zu 40 % erfunden. Seine Schutzliste nennt drei
Zahlen, die alle in dieselbe Richtung falsch sind: sie lassen das Projekt
disziplinierter aussehen, als es ist.

**Die Struktur des Projekts ist nicht das Problem.** Gemessen: 2 `any`,
1 `@ts-ignore`, `strict: true`, `noImplicitOverride`, null verbotene
Abhaengigkeiten in allen drei Richtungen, flache Vererbung (15 Bausteine, alle
genau eine Ebene unter `BasicBlock`). An OOP, Klassen und Vererbung ist nichts
zu reparieren.

**Das Problem sind Stellen, an denen still etwas verschwindet.** Davon nennt
der Vorgaengerplan vier. Diese Pruefung findet drei weitere, darunter den
schwersten Fund ueberhaupt (N1: eine geladene Maskendatei loescht die
bisherige Arbeit ohne Rueckweg).

**Und eine eigene Regel wird gebrochen:** Regel 6 des Vorgaengerplans verbietet
`inset: 0` im Export. Es steht vier Mal drin, gemessen in der Referenzdatei.

---

## 1. BEFUNDE DES VORGAENGERS — nachgeprueft, gehalten

### F1 · Die Pruefung ist rot — **ERLEDIGT (Schritt 21)**
Behauptet: `zeilenAktivierung.test.ts:37`, `no-this-alias`, `npm run check`
Exit 1. Tests gruen mit 40 Dateien / 339 Tests.
**Gemessen:** stimmte exakt. Beide Zahlen exakt.
**Erledigt** auf `arena/01a06bd8` (Commit `40e73f7`): die Aufwaertssuche wurde
aus der Klasse in eine freie Funktion gezogen. `check` Exit 0, Tests
unveraendert 40/339, `build:runtime` Exit 0, Referenzabzug Teil A gruen.

### F2 · Geister-Felder im Export — **GEHALTEN**
Behauptet: `benutzteQuellen.ts:192` laeuft ueber alle Quellen, `:69` macht es
richtig ueber `acc`.
**Gemessen:** stimmt, und die Diagnose ist praeziser als der Plan sagt. Es sind
zwei Schleifen mit demselben Zweck in einer Datei:
- `:68-70` — `for (let i = 0; i < acc.length; i++)` ueber die baumgefilterte
  Menge. **Richtig.**
- `:192-194` — `for (const source of sources)` ueber `dataSourceStore.list`
  (via `exportMask.ts:213`). **Falsch.**
Wirkung wie beschrieben: eine nie platzierte Quelle kann einer benutzten
Quelle Feldcodes unterschieben. Verstoss gegen den SE-Kontrakt "nur die
BENUTZTEN Felder bestellen".
**Zusatz:** `sevariablen.ts:41` iteriert ueber `used`, nicht ueber `sources` —
die Geister-Quelle selbst taucht also nicht auf. Der Plan hat das selbst
korrigiert. Umfang bleibt klein, der Fehler bleibt echt.

### F3 · Spalten ab Nr. 17 werden stumm weggeworfen — **GEHALTEN, verschaerft**
Behauptet: `spalten.ts:191`, `arr.slice(0, SPALTEN_MAX)` ohne Meldung.
**Gemessen:** stimmt, Zeile 191 exakt.
**Verschaerfung:** Der Kommentar in derselben Datei, `:40-46`, warnt
woertlich: *"Wer versteckte Spalten aus der Liste wirft, verschiebt alle
Plaetze dahinter und schreibt stumm falsche Werte ins ERP."* 145 Zeilen
spaeter tut `coerceSpalten` genau das. **Der Code widerspricht seiner eigenen
Warnung.** Das ist der staerkste Beleg im ganzen Befundsatz.
**Korrektur am Plan:** Er warnt, `SPALTEN_MAX` werde "an mehreren Stellen
gelesen — alle finden, keine vergessen". Gemessen sind es **zwei**
Produktivstellen: `spalten.ts:191` und `spaltenBindung.ts:23`. Die uebrigen
Treffer sind Tests. Der Umbau ist kleiner als angekuendigt.

### F4 · Gezogene Breite landet auf der falschen Spalte — **GEHALTEN**
Behauptet: `TabelleBlock.ts:354` ohne dritten Parameter, `:594` mit.
**Gemessen:** stimmt, beide Zeilen exakt. Signatur `spalten.ts:58-65` mit
Standardwert `wegDurchBediener: ReadonlySet<string> = new Set()` — deshalb
schweigt der Compiler.
Die Analyse der vier gleichzeitigen Bedingungen (fertige Maske +
`spaltenwahl='ja'` + Bediener hat weggenommen + zieht Breite) ist plausibel
und erklaert, warum es nie auffiel. **Ein-Zeilen-Fix.**

### F5 · Beim Laden geht etwas verloren, ohne Sicherungskopie — **GEHALTEN**
Behauptet: drei verlustbehaftete Wege melden, legen aber keine Kopie an.
**Gemessen:** `persistence.ts:142-144` ruft nacheinander
`meldeVerworfeneTypen`, `meldeAbsichtlichEntfernte`, `meldeVerloreneKetten` —
keiner der drei ruft `legeKopieAn`. Die beiden anderen Wege tun es sehr wohl
(`:100` `meldeZukunftsStand`, `:139/:152` `backupUnreadableState`).
Das Selbstzitat stimmt woertlich (`:57`): *"Das muss man erfahren, denn der
naechste Auto-Speicher schreibt den gekuerzten Stand fest."*
`Editor.ts:61` `if (persisted?.resaveNeeded) this._planer.plane()` bestaetigt
den Verstaerker.

### F6 · Spalte loeschen schaltet Ketten woanders ab, stumm — **GEHALTEN**
Behauptet: `spaltenAufraeumen.ts`, gerufen aus `Editor.ts:286`, setzt im
ganzen Baum Parameter auf `aus`.
**Gemessen:** `Editor.ts:283-287` ruft `ohneSpaltenZeiger(next, id,
gestricheneKennungen(...))`. Die Funktion laeuft ueber
`Object.values(tree)` — jeden Knoten, jede Seite. `pushHistory()` steht in
Zeile 266 davor, Strg+Z holt es also zurueck.
Die Entscheidung selbst ist richtig (ein Zeiger ins Leere schriebe stumm
Leerstrings ins ERP). Falsch ist nur die Stille: der Kommentar sagt "Bedienung
am Ding statt Warnung", aber das Ding steht auf einem anderen Baustein,
womoeglich auf einer anderen Seite.

### F8 · 97 % jeder Maske ist Bausatz — **GEHALTEN, Zahlen exakt**
**Nachgemessen:**
```
src/export/referenz/referenz.html   242.776 Bytes
src/export/generated/ff-runtime.js  235.583 Bytes = 97,0 %
eigentliche Maske                     7.193 Bytes =  3,0 %
```
`register.ts` laedt alle 15 Bausteine bedingungslos (15 Import-Zeilen).
**Wichtige Korrektur:** Der Plan verweist auf "PLAN.md Schritte 13, 14, 15,
16a, 16b — dort steht die Vorarbeit schon". **`PLAN.md` wurde am 2026-09-04
mit Commit `2a1eb0a` geloescht** (1080 Zeilen), zusammen mit `GRUNDLAGE.md`
(1107) und `LESEPROTOKOLL.txt` (342). Die Vorarbeit lebt nur noch in der
Git-Historie (`git show cd94164:PLAN.md`, Zeilen 651-780). **Vor Schritt 32
muss sie dort herausgeholt werden**, sonst wird sie ein zweites Mal gemacht.

### F9 · Alles zeichnet bei jeder Kleinigkeit neu — **GEHALTEN**
`useEditor.ts:12` `useSyncExternalStore(abonniere, () => editor.version)`,
kein Selektor. Jede Komponente mit `useEditor()` rendert bei jeder Aenderung.
Kein Fehler, eine Bremse.

---

## 2. BEFUNDE DES VORGAENGERS — widerlegt oder korrigiert

### F7 · Kanban mit einer Spalte nicht greifbar — **HYPOTHESE, nicht Befund**
Der Plan schreibt "GEPRUEFT (aus dem Code, nicht im Browser geklickt)". Das
ist ein Widerspruch in sich und muss zurueckgestuft werden.
**Was stimmt:** `KanbanSpalteBlock.ts:37` hat `lockedWidth: 'fill'`.
`CanvasNode.tsx:139` haengt Raster-Bausteine an `onPointerDown` ->
`ziehePosition`, `:152-160` haengt Fluss-Kinder an natives HTML5 `draggable`.
`rasterMove.ts:64-74` wartet auf `pointermove`, bevor `aktiv` wird.
`KanbanBlock.ts:79-86` hat `gap: var(--se-gap-lg)`.
**Was NICHT belegt ist:** ob HTML5-Drag die `pointermove`-Ereignisse
tatsaechlich unterbindet. Das entscheidet der Browser, nicht das Lesen.
**Folge:** Schritt 29 braucht als ERSTES eine Klickprobe, die den Fehler
zeigt. Ist er nicht reproduzierbar, entfaellt die Begruendung fuer W4.

### F10 · Muster-Karte, Auswahlrahmen — **HALB FALSCH**
Behauptet: "zeichnet fuer jeden Baustein denselben **rechteckigen** Rahmen".
**Gemessen `BlockHost.tsx:110-116`:**
```
outline: selected ? '2px solid hsl(var(--wb-auswahl))' : '2px solid transparent',
outlineOffset: amRand ? -2 : 1,
borderRadius: 6,
```
Der Rahmen ist **nicht rechteckig** — `borderRadius: 6` steht da. Die
Praemisse des Befundes ist falsch.
**Was stimmt:** eine Werkzeugleiste gibt es im Host nicht (grep: kein Treffer).
**Was stimmt:** der Rahmen ist fuer alle Bausteine gleich, unabhaengig von der
Form des Bausteins.

### F11 · Horcher werden nicht abgemeldet — **RICHTIG BESCHRIEBEN, FALSCH VERORTET**
Der Plan gibt `datenAnschluss.disconnect` die Schuld.
**Gemessen:** `datenAnschluss.ts:48-50` `disconnect` entfernt das Element aus
dem Set. Mehr **kann** es nicht: `bridge.ts:81-83` `onSeDaten` gibt `void`
zurueck, es gibt keine Abmeldefunktion. Die Schwesterfunktion
`onSeAntwort` (`:85-88`) gibt sehr wohl eine zurueck.
**Der eigentliche Befund ist die Asymmetrie in der Bruecke, nicht der
Anschluss.** Praktisch folgenlos: `angemeldet`-Flag (`datenAnschluss.ts:21`)
sorgt dafuer, dass pro Modul genau einmal angemeldet wird — drei Listener fuer
die Lebensdauer der Seite. **Kein Handlungsbedarf, nur Korrektur der Diagnose.**

### F12 · Export ist unrein — **FALSCH. STREICHEN.**
Behauptet: gefaehrdet den byte-bewachten Referenzabzug.
**Gemessen:** `grep` nach `Date.now`, `new Date`, `Math.random`,
`crypto.randomUUID`, `toLocaleString` in `src/export/` und
`state/maskenDatei.ts` — **null Treffer**. Der Export ist deterministisch.
Der Befund ist unbelegt und wird gestrichen.

### F13 · Slop-Kleinteile — **GEMISCHT**
| Behauptung | Ergebnis |
|---|---|
| Doppelter Kommentarblock `spaltenBearbeiten.ts:64-67` + `:69-72` | **stimmt**, fast wortgleich |
| Tote Funktion `entferneSpalte:45-53` | **stimmt technisch** — nur Tests rufen sie |
| Tote Funktion `verschiebeSpalteAn:87-96` | **stimmt technisch** — nur Tests rufen sie |
| Ueberschreib-Warnung `blockRegistry.ts:6-8` | **stimmt**, `console.warn` statt Fehler |
| 3 rohe `<input>` | **stimmt**: `BildControl.tsx:54`, `Toolbar.tsx:222`, `DatenquellenBereich.tsx:113` |
| Doku-Drift `CLAUDE.md:150-151` | **INZWISCHEN BEHOBEN** — Commit `2a1eb0a`, "Datencenter-Reiter" kommt nicht mehr vor |
**Zu den "toten" Funktionen:** Beide sind duenne Huellen um `ohneSpalte` bzw.
`mitVerschobenerSpalte`, beide getestet. Loeschen bringt nichts ausser Risiko.
**Empfehlung: nur den doppelten Kommentar entfernen, den Rest stehenlassen.**

### F14 · Doppelte Anmeldung — **FALSCH. STREICHEN.**
Behauptet: Bausteine rufen `defineAndRegister` **und** haben `editorAngaben.ts`,
vermutete Folge sei die `console.warn` aus `blockRegistry.ts:6-8`.
**Gemessen:** Das sind zwei voellig verschiedene Register.
- `BasicBlock.ts:119-122` `defineAndRegister` ruft `definiere` (Custom
  Element) + `beschreibe` (Block-Registry). 15 Bausteine rufen es, jeder
  genau einmal.
- `beschreibe()` wird in ganz `src/` an **genau einer** Stelle gerufen:
  `BasicBlock.ts:121`. Keine Dublette moeglich.
- Die 15 `editorAngaben.ts` rufen `ergaenzeEditorAngaben`
  (`core/blocks/editorAngaben.ts:16`) und schreiben in eine **andere** Map,
  die nur Symbole haelt.
**Die Warnung feuert nie.** Der Befund ist erfunden und wird gestrichen.

### Schutzliste — **DREI ZAHLEN FALSCH, alle beschoenigend**
| Behauptung | Gemessen | |
|---|---|---|
| "**eine** einzige `if typ`-Stelle in ganz `src/`" | **4 allein in `migrationenRoh.ts`** (`:25`, `:49`, `:70`, `:249`) | falsch |
| "21 `data-ff-editor`-Wachen" | **63** | falsch |
| "`spaltenSicht` + `plaetze`, 5 Tests" | die Datei hat **20** Tests | ungenau |
| "40 Testdateien" | 40 | stimmt |
| "Werkbank 20 Teile, 103 Importe" | 20 Teile, **104** Importe | stimmt |
| "15 Bausteine" | 15 | stimmt |
| "`treeQuery.ts:87-196`" | Datei hat 200 Zeilen | plausibel |
| "`Inspector.tsx:129-216`" | Datei hat 221 Zeilen | plausibel |
| "`rechnung.ts:103-140`" | `loeseRechnung` beginnt exakt `:103` | stimmt |
| "`spaltenBreite.ts:23-111`" | Datei hat 150 Zeilen | plausibel |
Die vier `migrationenRoh`-Treffer sind fachlich vertretbar (einmalige
Alt-Datenwanderung), aber die Behauptung "eine einzige" ist schlicht unwahr.

### Wuensche W1-W5 — nachgeprueft
- **W1:** `BlockDefinition.ts:152-215` hat **32** Feld-Zeilen (Plan sagt 33),
  `maxSpalten` kommt nicht vor (grep: 0). `tabelleEigenschaften.ts` hat
  genau **7** Ja/Nein-Schalter, 52 Zeilen. **Bestaetigt.**
- **W2:** `dataSources.ts:38-42` — `DataSourceField` ist wirklich
  `{ code, label }`. **Bestaetigt.** Die abgeleitete Regel ("Anzeigelaenge
  setzt nur die Vorgabe, ueberschreibt nie eine gezogene Breite") ist richtig
  und muss bindend bleiben.
- **W3:** `tabelleAnsicht.ts:127-129` rechnet **ein** `gridTemplateColumns`.
  `tabelleKoerper.ts:190` setzt `style="grid-row: 1; grid-column: ${i+1}"`.
  Der Kommentar `:179-180` sagt selbst, Kopfzelle und Greifstreifen muessten
  ihren Platz BEIDE nennen. **Bestaetigt, inklusive der Falle.**
- **W4:** `Editor.ts:228` `selectBlock(id: string | null)`.
  `selectionOps.ts` hat **26 Zeilen**. Der Umbau ist deutlich **kleiner** als
  der Plan befuerchtet ("fasst die Auswahl im ganzen Editor an").
- **W5:** `KanbanBlock.ts:41-47` kein `maxSpalten` (bestaetigt), `.board`
  kein `overflow-x` (grep: 0). `KanbanSpalteBlock.ts:74-78` hat
  `min-height: 100%`; `min-width` kommt in der Datei **einmal** vor — vor
  dem Bauen nachsehen, wo genau. **Im Kern bestaetigt.**

---

## 3. NEUE BEFUNDE — vom Vorgaengerplan nicht gefunden

### N1 · Eine geladene Maskendatei loescht die Arbeit ohne Rueckweg — **SCHWERSTER FUND**
`Editor.ts:370-377`:
```
ersetzeMaske(tree: BlockTree): void {
  this._tree = tree
  this._selectedId = null
  this._activePageId = ROOT_ID
  this._historie.leeren()      <- Undo-Geschichte weg
  this._planer.plane()         <- in 500 ms ueberschrieben
  this.notify(this)
}
```
**Jede andere veraendernde Methode ruft vorher `pushHistory()`** (Zeilen 174,
213, 266, 302, 317, 327, 335, 344, 352, 361). Diese eine nicht — sie loescht
die Historie sogar aktiv.
Gerufen aus `maskeUebernehmen.ts:9`, also beim Laden einer Maskendatei.
**Wirkung:** Wer versehentlich die falsche Datei oeffnet, verliert die
bisherige Maske. Kein Strg+Z (Historie geleert), keine Notfallkopie
(`legeKopieAn` wird nicht gerufen), und nach `SAVE_DEBOUNCE_MS` = 500 ms ist
der alte Stand im Browser-Speicher ueberschrieben.
**Verschaerfend:** `maskeUebernehmen.ts:7-9` ersetzt **zuerst** Datenquellen
und Relationen, **dann** den Baum. Bricht der letzte Schritt ab, sind
Bibliotheken schon getauscht — ein halb vertauschter Zustand.
**Das ist derselbe Krankheitstyp wie F5, nur schlimmer:** dort gibt es
wenigstens eine Meldung.

### N2 · Regel 6 wird vom eigenen Export gebrochen — `inset: 0`
Arbeitsregel 6 des Vorgaengerplans: *"Kein CSS im Export, das Chromium < 87
nicht kann. Kein `inset: 0`."* Begruendung `spaltenBreite.ts:113-121`:
Nutzer-Befund 2026-08-31, im SE-Browser hatte eine Lage keine Groesse.
**Gemessen in der Referenzdatei — also im echten Export:**
```
src/export/referenz/referenz.html : 4 x "inset: 0"
src/export/generated/ff-runtime.js: 4 x "inset: 0"
```
Quellen: `PopupBlock.ts:51`, `DialogRahmen.ts:38`, `DialogRahmen.ts:52`,
`tabelleStil.ts:245` (`.sw-schirm`, der Schirm hinter der Spaltenwahl).
**Wirkung, unbelegt aber ernst:** Wenn der Befund von 2026-08-31 stimmt,
haben im SoftEngine-Browser das Popup, der Dialograhmen und der
Spaltenwahl-Schirm **keine Groesse** — Popups waeren unsichtbar oder nicht
klickbar. Das ist genau der Fehler, der die Regel ausgeloest hat.
**Ersatz ist trivial:** `top:0; right:0; bottom:0; left:0` kann jeder Browser.
**Vor dem Fix muss geklaert werden**, ob es in SoftEngine wirklich bricht —
das kann nur der Besitzer testen. Wenn ja, ist das ein Fehler in
ausgelieferten Masken, kein Schoenheitsfehler.

### N3 · `getBusy` kann die gesamte Datenlaufzeit lahmlegen
`relations.ts:230-232`:
```
if (getBusy || getQueue.length === 0) return
getBusy = true
const job = getQueue.shift()!
```
`getBusy = false` steht ausschliesslich in `finish()` (`:244`). Zwischen
`getBusy = true` und dem Aufsetzen von `unsubscribe`/`poll`/`timeout` steht
kein `try`. Wirft eine dieser Zeilen, wird `finish` nie erreicht.
**Wirkung:** `getBusy` bleibt fuer immer `true`. Jede weitere
`GET_RELATION` der ganzen Sitzung landet in `getQueue` und wird nie
abgearbeitet — die Maske laedt keine Daten mehr, ohne Meldung, ohne Timeout
(der Timeout gehoert zum Job, der nie startet).
**Wahrscheinlichkeit gering, Schaden total.** Ein `try/finally` um den
Rumpf genuegt.

### N4 · `onSeDaten` ohne Abmeldung (Praezisierung von F11)
`bridge.ts:81-83` gibt `void` zurueck, `onSeAntwort` (`:85-88`) gibt eine
Abmeldefunktion zurueck. Asymmetrie ohne Begruendung im Code.
Heute folgenlos (Anmeldung genau einmal je Modul), aber eine Falle fuer jeden
kuenftigen Aufrufer, der pro Element anmeldet.

### N5 · Kein `beforeunload` — bis zu 500 ms Arbeit verlierbar
`providers.tsx:24-25` rettet bei `pagehide` und `visibilitychange`. Das deckt
Tab schliessen und Wegklicken ab. Es deckt **nicht** ab: Browser-Absturz,
hartes Schliessen durch SoftEngine.
**Bewertung: geringfuegig.** `beforeunload` ist in modernen Browsern
unzuverlaessig, und `SAVE_DEBOUNCE_MS` ist nur 500 ms. Wird der
Vollstaendigkeit halber genannt, **nicht** zur Umsetzung empfohlen.

### N6 · Die groesste Luecke im Pruefnetz: 91 Dateien ohne einen einzigen Test
Der Vorgaengerplan preist in der Schutzliste das "Pruefnetz (40 Testdateien)".
**Gemessen je Bereich:**
```
export:          10 Dateien,  8 Tests    sehr gut
blocks/tabelle:  31 Dateien, 14 Tests    gut
softengine:       7 Dateien,  4 Tests    gut
core/data:       13 Dateien,  4 Tests    maessig
state:           33 Dateien,  4 Tests    duenn
core/blocks:     18 Dateien,  1 Test     sehr duenn
editor:          71 Dateien,  0 Tests    NICHTS
ui:              20 Dateien,  0 Tests    NICHTS
```
**Drei der zehn geplanten Schritte arbeiten genau dort:** Schritt 29
(Pfad-Auswahl), Schritt 30 (Auswahlrahmen), Schritt 34 (Render-Selektoren).
Der Plan erwaehnt das mit keinem Wort. Das ist seine ernsteste Auslassung.

### N7 · Widerlegung meiner eigenen frueheren Behauptung
In einem frueheren Bericht habe ich "sieben stille catch-Bloecke" als
Krankheit bezeichnet. **Das war falsch, und ich hatte sie nicht gelesen.**
Nachgelesen: von 24 `catch`-Bloecken in `src/` sind praktisch alle begruendet
und kommentiert. `seAktionen.ts:45` faellt nachweislich auf einen zweiten Weg
zurueck, der darunter steht. `bridge.ts:97` faengt einen werfenden Zuhoerer ab
und setzt **deshalb** die Signatur nicht, damit derselbe Stand erneut
verteilt wird — das ist durchdacht.
**Kein Handlungsbedarf.** Der Eintrag steht hier, damit der Irrtum nicht
weitergetragen wird.

---

## 4. ARBEITSREGELN — uebernommen, gekuerzt, korrigiert

1. **Branch.** Der Vorgaengerplan sagt "`master` ist der einzige Branch".
   Die laufende Sitzung ist technisch an `arena/01a06bd8-editoraufbauv3`
   gebunden; dort liegt Schritt 21. Uebernahme nach `master` erfolgt durch
   den Besitzer. Kein force-push, nie.
2. **Vor jedem Schreiben lesen.** Wer eine Datei anfasst, die er nicht
   geoeffnet hat, wird gestoppt. **Diese Regel gilt auch fuer Urteile:**
   kein Befund aus `grep`-Zahlen ohne gelesenen Code (s. N7).
3. **Doku ist Zeuge, nicht Beweis.** Gilt auch fuer dieses Dokument.
4. **Kein Wert wird "verbessert", ohne die Begruendung im Code zu lesen.**
   `SPALTEN_MAX = 16` (`spalten.ts:91-97` erklaert die Zahl), `ZEILEN_HOEHE`,
   `SPALTEN_MIN_BREITE`, `HISTORY_LIMIT = 50`, `SAVE_DEBOUNCE_MS = 500`,
   `GET_TIMEOUT_MS = 20_000`, `NACHLAUF_MS = 800`, `SIGNATUR_GRENZE`.
5. **Erst der rote Test, dann der Fix.** Die wichtigste Regel. Bei N1, F2,
   F3, F4, F6 muss der Test rot sein, bevor eine Zeile geaendert wird.
6. **Browser-Schranke.** Kein CSS im Export, das Chromium < 87 nicht kann.
   **Diese Regel ist heute gebrochen — siehe N2.**
7. **Export-Neutralitaet.** Aenderungen in `src/blocks/**`, `src/design/`
   aendern das Export-HTML -> Referenzabzug Teil B mit Diff-Erklaerung.
   Aenderungen nur in `src/editor/`, `src/state/`, `src/ui/` muessen Teil A
   gruen lassen.
8. **Ein Chat = ein Schritt.**
9. **Raten verboten.** Unklares wird OFFEN notiert und gefragt.
10. **Neue Schritte ab 21** (vergeben: S1-S6, P1-P6, T1-T7, Etappe 0-4,
    Schritte 1-20).

### Definition of Done — auf das Wirksame gekuerzt
Der Vorgaengerplan hat zwoelf Punkte. Punkt 12 ("Zweitmeinung Codex") ist
nicht erfuellbar. Punkt 6 (neun Screenshots) ist bei einer Testdatei-Aenderung
Ritual. Was bleibt:
```
1. git fetch
2. npm run check         -> Exit 0
3. npm run build:runtime -> Exit 0    (leicht vergessen)
4. npm test              -> gruen
5. Referenzabzug: Teil A gruen bei export-neutralen Schritten,
   sonst Teil B mit erklaertem Diff.
   Grenze: alles zwischen window.FF_RELATIONS und </script> ist Buendel.
6. Sichtprobe NUR wenn der Schritt Editor oder Bausteine sichtbar aendert
   (node tools/sichtprobe.cjs standard, Dev-Server Port 5300)
7. Klickanleitung in Klartext im Bericht
8. 1 Commit, Dateien namentlich gestagt
9. Bericht: was geht, was NICHT geprueft wurde, was offen ist
```

---

## 5. DIE SCHRITTE — neu geordnet

Begruendung der Umstellung: Der Vorgaengerplan setzt Rettungsnetze vor
Reparaturen, was richtig ist. Aber er kennt N1 nicht — den einen Fund, bei
dem eine ganze Maske verloren geht. Der muss zuerst.

### PHASE 0 · Fundament

#### SCHRITT 21 — Pruefung gruen · F1 — **ERLEDIGT**
Commit `40e73f7` auf `arena/01a06bd8`. `check` Exit 0, Tests 40/339,
`build:runtime` Exit 0, Referenzabzug Teil A gruen. Nur die Testdatei
angefasst, Verhalten unveraendert.

#### SCHRITT 22 — Maske laden darf die Arbeit nicht verschlucken · N1
**Zuerst der rote Test:** Editor mit Baum A, `uebernehmeMaske` mit Baum B
aufrufen. Erwartung: Notfallkopie mit Baum A existiert **und** `canUndo` ist
wahr. Heute ist beides falsch. Muss rot sein.
**Aenderung, drei Teile:**
(a) `ersetzeMaske` ruft `legeKopieAn(STORAGE_KEY, ...)` mit dem alten Stand,
bevor es ueberschreibt;
(b) statt `_historie.leeren()` ein `pushHistory()` davor, damit Strg+Z
zurueckfuehrt — **oder**, falls das Leeren fachlich gewollt ist, wenigstens
eine Meldung mit dem Kopie-Schluessel (`kopieSatz`);
(c) `maskeUebernehmen.ts` prueft `inhalt.tree` **bevor** es Datenquellen und
Relationen ersetzt.
**Entscheidung des Besitzers noetig:** Soll Strg+Z eine geladene Maske
rueckgaengig machen koennen, oder genuegt die Notfallkopie? (O1)
**Klickprobe:** Maske bauen -> andere Maskendatei laden -> Strg+Z bzw.
Meldung mit Kopie-Schluessel muss erscheinen.
**Export:** neutral. **Risiko:** gering, `state/` ist testbar.

#### SCHRITT 23 — Sicherungskopie auf den drei Ladewegen · F5
`legeKopieAn(STORAGE_KEY, raw)` vor `meldeVerworfeneTypen`,
`meldeAbsichtlichEntfernte`, `meldeVerloreneKetten`; Kopie-Hinweis mit
`kopieSatz` in die bestehenden Meldungen aufnehmen (Vorbild
`meldeZukunftsStand`, `persistence.ts:99-112`).
**Test:** Stand mit unbekanntem Bausteintyp laden -> Notfallkopie-Schluessel
existiert und enthaelt den urspruenglichen Text.
**Export:** neutral. **Risiko:** minimal.

### PHASE 1 · Nichts verschwindet mehr stumm

#### SCHRITT 24 — Geister-Felder raus aus dem Export · F2
**Zuerst der rote Test:** Quelle A auf dem Canvas, Quelle B nur in der
Bibliothek, B zieht einen Parameter aus A. `benutzteFelderJeQuelle` darf fuer
A nicht das Feld enthalten, das nur B braucht.
**Aenderung:** `benutzteQuellen.ts:192` auf die baumgefilterte Menge
umstellen — dieselbe Form wie `:68-70`. Zwei dokumentierte Faelle duerfen
nicht brechen: Parameter holender Quellen und Nachschlage-Hilfsquellen
(`:105-130`).
**Klickprobe:** Datencenter -> Quelle anlegen, nicht platzieren ->
exportieren -> `index.basis.SEvariablen.json` vergleichen, kein Feld
dazugekommen.
**Export:** Teil A muss **gruen bleiben** (die Referenzmaske hat keine
Geisterquelle). Wird sie rot, ist der Fix zu breit.

#### SCHRITT 25 — Ueberzaehlige Spalten melden statt schlucken · F3
**Zuerst der rote Test:** 17 Spalten laden. Heute kommen 16 zurueck, stumm.
Test erwartet 17 **und** eine Meldung.
**Aenderung:** `coerceSpalten` (`spalten.ts:191`) schneidet nicht mehr —
alle Plaetze bleiben erhalten, weil das Schneiden laut `:40-46` die
Ketten-Parameter verrutschen laesst. Meldung ueber `meldungen.melde`.
**Nur zwei Produktivstellen betroffen:** `spalten.ts:191`,
`spaltenBindung.ts:23`.
**Export:** neutral. **Risiko:** gering.

#### SCHRITT 26 — Sagen, wenn eine geloeschte Spalte Ketten abschaltet · F6
`ohneSpaltenZeiger` gibt zurueck, **wie viele** Parameter auf `aus` gesetzt
wurden und auf welchen Bausteinen; `Editor.ts:286` meldet es in Klartext.
**Test:** Baum mit Kette auf Spalte 2, Spalte 2 loeschen -> Rueckgabe meldet 1.
**Klickprobe:** Kette auf Spalte legen -> Spalte loeschen -> Meldung -> Strg+Z
-> Kette wieder da.
**Export:** neutral.

#### SCHRITT 27 — Gezogene Breite auf die richtige Spalte · F4
**Zuerst der rote Test:** 5 Spalten, `wahlWeg` enthaelt Spalte 2,
`alleZeigen = false`. Erwartung `plaetze === [0,2,3,4]`, heute `[0,1,2,3]`.
**Aenderung:** `TabelleBlock.ts:354` — `this.wahlWeg()` als dritten Parameter.
**Eine Zeile.**
**Klickprobe: nur der Besitzer, nur in SoftEngine.** `spaltenwahl` an ->
exportieren -> Spalte wegnehmen -> Kante ziehen -> Breite muss sich dort
aendern, wo gezogen wurde.
**Export:** neutral.

#### SCHRITT 28 — `getBusy` kann nicht mehr haengenbleiben · N3
`try/finally` um den Rumpf von `runNextGet` (`relations.ts:230-300`), sodass
`getBusy` bei jedem Wurf freigegeben wird.
**Test:** `onSeAntwort` so praeparieren, dass es wirft -> der naechste
`executeRelation`-Aufruf muss trotzdem starten.
**Export:** neutral. **Risiko:** gering, `softengine/` hat 4 Testdateien.

### PHASE 2 · Die Browser-Schranke

#### SCHRITT 29 — `inset: 0` aus dem Export · N2
**BLOCKIERT bis der Besitzer geprueft hat (O2).**
**Vorstufe, ohne Code:** Der Besitzer oeffnet eine exportierte Maske mit
Popup und Spaltenwahl in SoftEngine. Sind Popup und Schirm sichtbar und
bedienbar? Wenn ja, ist N2 harmlos und wird gestrichen. Wenn nein, ist es der
schwerste Auslieferungsfehler im Projekt.
**Aenderung, falls bestaetigt:** `PopupBlock.ts:51`, `DialogRahmen.ts:38`,
`DialogRahmen.ts:52`, `tabelleStil.ts:245` — `inset: 0` ersetzen durch
`top: 0; right: 0; bottom: 0; left: 0`.
**Export:** Teil B, Diff erklaeren (vier CSS-Zeilen). **Risiko:** gering,
rein mechanisch.

### PHASE 3 · Die Wuensche des Besitzers

#### SCHRITT 30 — Spalten-Obergrenze je Baustein einstellbar · W1
Optionales `maxSpalten` in `BlockDefinition` + `BlockComponent` +
`beschreibe()` (`BasicBlock.ts:23-66`) + Inspector-Control. **Standard bleibt
16** — kein bestehendes Verhalten aendert sich. `spaltenBindung.ts:23` liest
kuenftig diesen Wert statt der Konstante.
**Getrennt von Schritt 25**, obwohl beide dieselbe Gegend beruehren: das eine
ist eine Fehlerbehebung, das andere eine neue Funktion. Zwei Risiken, zwei
Schritte.
**Klickprobe:** Tabelle -> Inspector -> Obergrenze 5 -> Plus-Knopf wird bei 5
Spalten grau.
**Export:** neutral.

#### SCHRITT 31 — Dynamische Spaltenbreite · W2
**Erst Vorarbeit, dann Code.** Schriftlich festhalten: warum sind die zwei
frueheren Anlaeufe gescheitert (Nutzer-Befund 2026-08-31, "rechts blieb
Flaeche leer"), was wird diesmal anders. Der Besitzer liest das, bevor
gebaut wird.
**Bindende Regel:** Die Anzeigelaenge setzt nur die **Vorgabe**, wo keine
Breite gezogen wurde. Eine gezogene Breite wird **nie** ueberschrieben.
**Kontrakt:** Die neue optionale Angabe an `DataSourceField`
(`dataSources.ts:38-42`) darf **nie** in die SEvariablen wandern — die
pos_len-Liste haengt am `code`.
**Export:** Teil B. **Risiko: hoch.** Zweimal gescheitert.

#### SCHRITT 32 — Spalten-Umbruch · W3
**BLOCKIERT bis der Besitzer am Bild entschieden hat (O3).**
Fest steht: kein Scrollen. Offen: zweite Kopfzeile / zweite Datenzeile /
anderes. Vorstufe: Bauarten als Bild zeigen, mit echten
Belegerfassungs-Spalten.
**Beruehrt:** `tabelleAnsicht.ts:127-129`, `tabelleKoerper.ts:178/190`,
`tabelleStil.ts` (479 Z.), `spaltenBreite.breitenGriffe` (Index-Mathematik),
Erfassungszeile — **alle haengen am selben `cols`** — und das exportierte
HTML.
**Falle, im Code dokumentiert (`tabelleKoerper.ts:179-180`):** Kopfzelle und
Greifstreifen muessen `grid-row` beide ausdruecklich nennen.
**Export:** Teil B. **Risiko: hoch**, der teuerste Umbau im Plan.

### PHASE 4 · Bedienung — erst mit Netz

#### SCHRITT 33 — Erste Tests fuer `src/editor/` · N6
**Neu, steht in keinem Vorgaengerplan.** Bevor Schritt 34-36 die
Bedienoberflaeche anfassen, bekommen die Stellen, die sie anfassen, Tests:
Auswahl-Logik (`selectionOps.ts`, 26 Zeilen), Auswahlziel
(`Editor.waehleGetroffenen`), spaeter die Selektoren.
Keine neue Testgattung — Vitest wie bisher, reine Logik ohne Browser.
**Begruendung:** 71 Dateien ohne einen Test, und drei geplante Schritte
arbeiten genau dort. Ohne das bauen wir blind.

#### SCHRITT 34 — Jeder Container ist erreichbar · W4 (+ F7 pruefen)
**Zuerst: F7 im Browser reproduzieren.** Kanban mit einer Spalte anlegen,
Board zu greifen versuchen. Geht es doch, entfaellt die Begruendung — dann
wird W4 nur gebaut, wenn der Besitzer die Pfad-Auswahl aus eigenem Wunsch
will.
**Aenderung:** Auswahl bekommt einen Pfad statt einer Id, `Escape` waehlt den
Elternteil. `selectionOps.ts` ist mit 26 Zeilen kleiner als befuerchtet.
Dieser Weg aendert das Export-HTML **nicht** — anders als eine
Board-Titelzeile oder `.board`-Padding.
**Export:** neutral. **Risiko:** mittel.

#### SCHRITT 35 — Auswahlrahmen passt zur Form · F10 (korrigiert)
Die Praemisse des Vorgaengerplans ist falsch (`borderRadius: 6` ist da).
Was bleibt: der Rahmen ist fuer alle Bausteine identisch.
**Nur bauen, wenn der Besitzer es stoerend findet.** Dann sagt der Baustein
ueber einen Registry-Eintrag, wie er markiert wird — kein
`if typ === 'kanban'`.
**Export:** neutral, solange nur `src/editor/` angefasst wird.

#### SCHRITT 36 — Kanban: Obergrenze, Scrollen, Mindestbreite · W5
**BLOCKIERT bis der Besitzer `maxSpalten` nennt (O4).**
`overflow-x: auto` am `.board` ab der Grenze, `min-width: 220px` je Spalte.
**Achtung:** `.board`-CSS steht in `KanbanBlock.ts:74-89` und **landet im
Export** -> Teil B + Browser-Schranke. `overflow-x` und `min-width` sind
beide aelter als Chromium 87, unbedenklich.

### PHASE 5 · Der grosse Brocken

#### SCHRITT 37 — Nur benutzte Bausteine in die Maske · F8
Die 97 %. **Vor dem ersten Schritt: die Vorarbeit aus der Git-Historie
holen** — `git show cd94164:PLAN.md`, Zeilen 651-780 (Schritte 13, 14, 15,
16a, 16b). Sie wurde mit Commit `2a1eb0a` geloescht.
Mehrere Teilschritte, jeder einzeln pruefbar, keiner groesser als ein Chat.
**Klickprobe:** Maske nur mit einer Tabelle exportieren -> Datei deutlich
kleiner -> **und in SoftEngine laufen wie vorher.** Nur der Besitzer kann das.
**Export:** Teil B, grosser Diff. **Risiko: hoch.**

### PHASE 6 · Hygiene

#### SCHRITT 38 — Render-Bremse · F9
`useEditor` bekommt Selektoren. Setzt Schritt 33 voraus (sonst ungetestet).
**Klickprobe:** grosse Maske, im Inspector tippen -> darf nicht haken.
**Risiko:** mittel — falsche Selektoren zeigen veraltete Werte.

#### SCHRITT 39 — Kleinteile · F13 + N4
Doppelter Kommentarblock `spaltenBearbeiten.ts:64-72` weg.
`onSeDaten` bekommt eine Abmeldefunktion wie `onSeAntwort` (N4).
`blockRegistry.ts:6-8`: `console.warn` -> echter Fehler, **nur wenn** kein
Testaufbau davon lebt.
**Nicht anfassen:** die angeblich toten Funktionen `entferneSpalte` und
`verschiebeSpalteAn` — getestete Huellen, Loeschen bringt nur Risiko.
**Gestrichen:** F12, F14 (widerlegt), F11 (folgenlos), N5 (nicht empfohlen).

---

## 6. WAS NICHT GELESEN WURDE — hier gilt kein Urteil

Diese Dateien wurden **nicht geoeffnet**. Weder "gut" noch "schlecht" ist
ueber sie belegt:

`src/editor/` — 71 Dateien, davon gelesen: `BlockHost.tsx` (Ausschnitt),
`CanvasNode.tsx` (Ausschnitt), `rasterMove.ts` (Ausschnitt),
`Inspector.tsx` (Ausschnitt), `providers.tsx` (ganz). **Rest ungelesen.**
`src/ui/` — 20 Dateien, **komplett ungelesen**.
`TabelleBlock.ts` (722 Z.), `tabelleStil.ts` (479), `nachschlagen.ts` (451),
`aktionen.ts` (399), `FormFeldBlock.ts` (519), `dataSources.ts` (324),
`ladeKette.ts` (321), `migrationenRoh.ts` (279), `data.ts` (279),
`DialogRahmen.ts` (303), `quellenArten.ts` (318), alle uebrigen Bausteine,
`docs/chef-maske/`, `RECHNUNG-BELEGERFASSUNG.md`.

**Der Vorgaengerplan setzt `src/softengine/` auf "nicht geprueft".** Diese
Pruefung hat `bridge.ts` und `relations.ts` ganz gelesen und dort N3 und N4
gefunden. `data.ts`, `wertLader.ts`, `relationLader.ts`, `geholteZeilen.ts`,
`meldung.ts` bleiben ungelesen.

**Solange `src/softengine/` nicht vollstaendig gegen die SE-Kontrakte in
`CLAUDE.md` geprueft ist, werden die Kontrakte nicht angefasst.**

---

## 7. OFFEN — Entscheidungen des Besitzers

| # | Frage | Blockiert |
|---|---|---|
| O1 | Soll Strg+Z eine geladene Maskendatei rueckgaengig machen, oder genuegt die Notfallkopie? | Schritt 22 |
| O2 | **Dringend:** Sind Popup und Spaltenwahl in SoftEngine sichtbar und bedienbar? (`inset: 0`, N2) | Schritt 29 |
| O3 | Spalten-Umbruch: welche Bauart? Entscheidung am Bild. Kein Scrollen steht fest. | Schritt 32 |
| O4 | Kanban `maxSpalten`: welcher Standard (1-8)? | Schritt 36 |
| O5 | Stoert der einheitliche Auswahlrahmen ueberhaupt? | Schritt 35 |
| O6 | Soll `src/softengine/` vollstaendig gegen die SE-Kontrakte geprueft werden? (Aufwand) | Kontrakte anfassen |

---

## 8. WAS NICHT PASSIERT

- Kein Neubau. Die SE-Kontrakte stammen aus Echttests ueber Wochen.
- Keine Umbenennungen, kein "Aufraeumen bei der Gelegenheit".
- Kein `if typ === '<baustein>'` im Editor- oder Export-Kern.
- Kein neues CSS im Export, das Chromium < 87 nicht kann — und das
  vorhandene (N2) wird nur nach Bestaetigung angefasst.
- Die Rechnung (`core/data/rechnung.ts`) bleibt.
- Keine Beispieldaten im Editor.
- Nichts wird gebaut, wo der Besitzer entscheiden muss und nicht entschieden
  hat.
- **Kein Befund ohne gelesenen Code.** Zahlen aus `grep` sind ein Verdacht,
  kein Urteil (s. N7).
