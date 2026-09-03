# PLAN — der eine Plan für den Aufbau-Editor

> Geschrieben 2026-09-02 aus einem Außen-Urteil über den ganzen Editor (Code
> gelesen, Editor im Browser bedient, exportierte Maske daneben gehalten).
> Dies ist der EINZIGE Plan. `UMBAUPLAN.md` ist gelöscht. Neue Pläne gibt es
> nicht; was hier nicht steht, wird nicht gebaut, außer der Nutzer sagt es im
> Chat. Nutzer-Entscheidungen 2026-09-02: keine Beispieldaten im Editor;
> die Rechnung (Abgabemenge) bleibt; umkrempeln statt verschönern.

## 0. Rahmen — für JEDEN Chat, der hier arbeitet (zuerst lesen)

1. Lies `CLAUDE.md` (kurz) und diesen Plan. Arbeite GENAU EINEN Schritt, den
   ersten mit `Status: offen`, den du ausfuehren DARFST: Fable darf jeden;
   jedes andere Modell (Opus, Sonnet) NUR Schritte mit dem Vermerk
   `Ausführung: Opus erlaubt` — alles andere laesst es liegen und nimmt den
   naechsten erlaubten, oder hoert auf und sagt das (Nutzer 2026-09-02:
   ein Opus-Schritt hat Aussehen veraendert, das darf nicht wieder
   passieren). Nicht mehr. Kein Vorgriff, keine Zusatzideen,
   keine „Verbesserungen" nebenbei. Was dir auffällt, schreibst du in den
   Chat-Bericht, nicht in den Code.
2. Vor Beginn: `git fetch origin` und `git status` sauber. Es gibt EINEN
   Branch: `master` (Nutzer 2026-09-02). Dort wird gearbeitet und gepusht.
3. Anfassen darfst du nur die Dateien, die der Schritt nennt (plus neue
   Dateien im genannten Ordner, plus die zugehörige `*.test.ts`). Alles
   andere ist verboten. Kein `git add -A`, Dateien namentlich stagen.
4. Prüfung nach dem Bauen, in dieser Reihenfolge, alles muss grün sein:
   - `npm run check` (Typen + Lint). Es zaehlt der EXIT-CODE 0, nicht der
     Blick auf die Ausgabe — ein Lint-Fehler steht sonst leicht unter dem
     `tail`. In einer Befehlskette immer `set -o pipefail`.
   - `npm test` (alle Tests grün; Zahl der Tests darf nur steigen)
   - Teil A (Editor-Schritte): `git status --short src/export src/blocks
     src/softengine src/core/data` muss LEER sein. Der Referenzabzug
     (`src/export/referenzabzug.test.ts`) ist grün OHNE `REFERENZ_ERNEUERN`.
     Ist er rot, hast du die Maske verändert: Fehler suchen, nicht erneuern.
   - Teil B (Masken-Schritte): `npm run build:runtime`, dann
     `REFERENZ_ERNEUERN=1 npx vitest run src/export/referenzabzug.test.ts`,
     dann `npm test`. Im Commit steht, was sich außerhalb des Bündels
     geändert hat (Prüfhilfe: alles zwischen der Zeile `window.FF_RELATIONS`
     und `</script>` in `src/export/referenz/referenz.html` ist Bündel, der
     Rest ist Maske). Ändert sich Maske, wo der Schritt es nicht sagt: stopp.
4b. SICHTPROBE, Pflicht fuer jeden Schritt, der `src/editor/` oder
   `src/blocks/` beruehrt: `npm run dev` (Hintergrund, Port 5300), dann
   `node tools/sichtprobe.cjs standard`, und die neun Bilder in
   `sichtprobe/` mit dem Read-Werkzeug ANSEHEN, jedes einzeln, gegen
   Abschnitt 1a: nichts liegt ueber Inhalt, nichts ist abgeschnitten,
   Groessen und Farben stimmen, kein Zeichen ohne Grund. Konsolen-Fehler
   oder -Warnungen im Ausdruck des Werkzeugs sind Fehler. Wer etwas findet,
   richtet es VOR dem Commit. Anleitung: `tools/SICHTPROBE.md`.
5. Stopp-Regeln (aufhören, Stand beschreiben, NICHT reparieren):
   - Ein Test bricht, den der Schritt nicht als „ändert sich" nennt.
   - Du müsstest eine Datei anfassen, die der Schritt nicht nennt.
   - Du verstehst eine Stelle nicht sicher. Raten ist verboten.
   - Der Schritt braucht eine Entscheidung, die hier nicht steht.
6. Commit: ein Schritt = ein Commit, Text in Klartext, erste Zeile
   `Schritt <Nr> — <Ziel>`. Dann `git push -u origin <branch>`. Nie force.
7. Vor dem Commit in DIESER Datei die Statuszeile des Schritts auf
   `Status: erledigt <Datum>` setzen und mitcommitten (der Commit selbst
   ist in `git log` zu finden).
8. Bericht an den Nutzer: was gebaut wurde, die Klickprobe aus dem Schritt
   (was öffnen, was tun, was zu sehen sein muss), was du nicht prüfen
   konntest. Keine Technik-Reviews. Dann aufhören.

## 1. Zielbild — daran misst sich jeder Schritt

**Der Editor hat EINE Bedienlogik.**

- **Auswählen.** Klick auf einen Baustein wählt ihn. Der Inspector rechts
  zeigt ALLES, was zu diesem Baustein gehört, in fester Reihenfolge:
  Eigenschaften → Datenquellen → Spalten (Tabelle) bzw. Felder → Auswahl
  folgen → Aktionen → Rechnung (Tabelle mit Erfassungszeile). Nichts, was zu
  einem Baustein gehört, ist nur woanders erreichbar.
- **Am Ding** bleibt, was räumlich ist: verschieben, Größe ziehen, Spalten-
  breiten, Titel direkt umbenennen, Klick auf den Spaltenkopf öffnet den
  Spalten-Picker. Jeder Knopf am gewählten Baustein kommt aus EINER
  Werkzeugleiste des Editors (`canvas/AuswahlLeiste.tsx`: Kind anlegen,
  Eintrag anfügen, Entfernen); sie sucht sich ihren Platz (über, unter,
  rechts, innen) und liegt nie über Inhalt. Kein Baustein zeichnet
  Editor-Knöpfe oder Editor-Marken (Stift, Kreuz, Plus/Minus) in die Maske.
  Der Kopf einer Spalte ist im Editor und in der Maske derselbe Text.
- **Zwei Fenster-Arten, sonst keine.** Ein *Popover* für eine einzelne
  schnelle Wahl (Feld wählen, Farbe wählen): Klick = fertig, kein Speichern-
  Knopf. Ein *Fenster* (`Dialog`) für Listen mit Detail: Liste links, Detail
  rechts, unten rechts Abbrechen/Speichern. Datencenter und Kettenfenster
  sind beide dieses Fenster mit demselben Aufbau.
- **Datencenter** bleibt die Bibliothek der Maske (Datenquellen,
  Relationen), weil beides maskenweit ist. Es hat keinen Reiter für Dinge,
  die zu einem Baustein gehören.
- **Bausatz statt Handarbeit.** Jedes Steuerelement des Editors kommt aus
  `src/ui/werkbank/`. Rohe `<button>`, `<input>`, `<select>` gibt es im
  Editor nicht.
- **Die Maske ist tabu** für Teil A. Sie ändert sich nur in Teil B, bewusst.

## 1a. Gestaltungs-Zielbild — eine Hand, prüfbar

Die Bediener kennen SoftEngine. Der Editor erklärt nichts, er ist ein
Werkzeug. Alles unten gilt für JEDE Fläche; wer davon abweicht, hat einen
Grund und schreibt ihn in den Commit.

**Werkbank (Editor), Zahlen sind Vorgabe, nicht Vorschlag**
- Grundgröße 13,5 px (`html`), Schrift Inter. Zwei Textgrößen: `text-ui`
  (13 px, Normalfall) und `text-dicht` (12 px, Listen, Kennungen). Titel
  sind `text-ui font-semibold`, nie größer. Kennungen/Codes in Mono als
  `Marke`.
- Eine Steuerhöhe: `h-steuer` (28 px) für Knopf, Feld, Wahl, Zeile. Kleiner
  (24 px) nur in der Werkzeugleiste am Baustein und in Reitern.
- Farben nur `--wb-*`: `grund` (Fläche), `panel` (Paneele, Fenster),
  `control` (Felder), `linie`, `tinte`, `matt`, EIN Akzent (`akzent`:
  Auswahl, Fokus, primärer Knopf), `fehler`, `vormerkung`. Auswahlrahmen
  und Anfasser im Canvas: `--wb-auswahl`. Keine weitere Farbe, kein Hex im
  Code, kein Verlauf, kein Schatten außer `shadow-overlay` für Schwebendes.
- Ecken 2 px (`--radius`). Abstände aus der 4er-Skala (`gap-1`, `gap-2`,
  `p-2`, `p-4`); Paneel-Innenabstand `p-2`, Fenster-Detail `p-4`.
- Zustände überall gleich: Hover = `bg-control`/`border-matt`, aktiv =
  `bg-akzent/15 text-tinte font-medium`, Fokus = Akzentring, deaktiviert =
  `opacity-50`, gefährlich = `art="gefahr"` (rote Kontur, rot bei Hover).
- Zeichen (Icons) nur aus `src/ui/zeichen`, 12–15 px, nie als einziger
  Träger einer Bedeutung, nie „zur Zierde". Ein Zeichen im Kopf einer
  Spalte oder an einem Baustein gibt es nicht.
- Steuerelemente nur aus `src/ui/werkbank/`. Fehlt eines, wird es dort
  gebaut, nie an der Stelle.

**Flächen, was sie zeigen und was nicht**
- Toolbar: Maskenname, Seiten (Reiter), Datencenter, Export, Undo/Redo, das
  Menü (…). Sonst nichts.
- Palette links: Bausteine in drei Gruppen, Suche. Keine Erklärtexte.
- Canvas: die Maske, wie sie exportiert wird (WYSIWYG; Ausnahmen nur
  Striche statt Daten und der Auswahlrahmen). Bedienung am Ding: Auswahl-
  rahmen 2 px Akzent, Anfasser als Pillen an der Kante, EINE Werkzeugleiste
  am gewählten Baustein (24 px, über/unter/rechts/innen nach Platz), Klick
  auf Spaltenkopf = Picker, Ziehen = Umordnen, Griff = Breite. Der Baustein
  selbst zeichnet nichts davon.
- Inspector rechts: nur, was man am Ding nicht sieht, in fester Reihenfolge
  (Eigenschaften, Datenquellen, Felder, Auswahl folgen, Aktionen, Rechnung).
  Ja/Nein als Kacheln, Wahlen als `Wahl`, jede Gruppe mit `Gruppe`-Titel.
  Keine Listen, die es am Ding schon gibt (Spalten), keine Hinweistexte.
- Fenster (`Dialog randlos` + `ListeDetail`): Bereiche links (optional),
  Liste mit Kopf (Anlegen, Suche, Filter), Detail rechts mit Titel und
  `Gruppe`n, Speichern/Abbrechen unten rechts IM Detail. Datencenter und
  Kettenfenster, sonst keins.
- Popover (`Popover`, Feld-Picker): eine schnelle Wahl, Klick = fertig,
  Suche ab 8 Einträgen, Gefährliches als klebende Fußzeile.
- Meldungen: Fehler im Fehlerbalken (Klartext, was und warum), sonst nichts
  Blinkendes.

**Maske (Export) — unangetastet**
- `--se-*` Tokens, Segoe UI, Türkis-Akzent, Navy-Leiste. Der Editor mischt
  sich nicht ein. Änderungen an der Maske sind bewusste Teil-B-Schritte mit
  Referenz-Erneuerung.

**Was daran noch nicht stimmt:** Schritte 10a bis 10c (unten). Die
Kanban-Karten-Vorlage (Strich-Reiter im Editor) ist bewusst offen gelassen:
sie braucht ein Urteil vor dem Bild, kein Rezept.

## 2. Teil A — eine Bedienlogik (Maske byte-gleich)

### Schritt 1 — Kettenfenster im Aufbau „Liste links, Detail rechts"
Status: erledigt 2026-09-02
- Ziel: Das Kettenfenster (`Schritt anlegen` am Inspector) sieht aus wie das
  Datencenter: links die Schrittliste mit `+ Schritt`, rechts das Schritt-
  Formular des gewählten Schritts, unten rechts Abbrechen/Speichern.
  Heute ist es eine kahle Liste, das Formular klappt darunter auf.
- Dateien: `src/ui/werkbank/ListeDetail.tsx` (neu: zwei Spalten, Liste feste
  Breite ~ w-72, Detail flex-1, optionale linke Bereichsleiste als Slot),
  `src/editor/zentrale/KettenFenster.tsx`, `src/editor/zentrale/SchrittListe.tsx`,
  `src/editor/zentrale/StepForm.tsx` (nur Aufruf/Anordnung, keine Logik).
- Verboten: Ketten-Modell (`src/core/data/aktionen.ts`), Speicherformat,
  Schritt-Typen. Nur Anordnung.
- Prüfung: Rahmen Punkt 4 (Teil A). Tests unverändert grün.
- Klickprobe: Tabelle wählen → Aktionen → „Schritt anlegen" bei „Zeile
  gewählt". Fenster: links Liste (leer: „Noch kein Schritt") mit `+ Schritt`,
  rechts nach `+ Schritt` das Formular. Speichern → Schritt steht links,
  bleibt gewählt, rechts sein Formular. Escape schließt ohne Verlust.

### Schritt 2 — Datencenter auf denselben Bausatz-Teil
Status: erledigt 2026-09-02
- Ziel: Das Datencenter benutzt `ListeDetail` aus Schritt 1 (Bereichsleiste
  links, Liste, Detail) statt eigener Spalten-Markups. Optisch gleich wie
  heute, nur aus demselben Teil gebaut. Der Reiter „Rechnungen" bleibt in
  diesem Schritt noch drin (fliegt in Schritt 3).
- Dateien: `src/editor/zentrale/Kommandozentrale.tsx`,
  `src/editor/zentrale/DatenquellenBereich.tsx`,
  `src/editor/zentrale/RelationenBereich.tsx`, `src/ui/werkbank/ListeDetail.tsx`.
- Verboten: Stores, Formulare (`DataSourceForm`, `RelationForm`), Import.
- Prüfung: Rahmen Punkt 4 (Teil A).
- Klickprobe: Datencenter öffnen. Datenquellen: links Bereiche, Mitte Liste,
  rechts Detail mit Bearbeiten/Duplizieren/Löschen. Relationen gleich.
  Nichts fehlt, nichts springt.

### Schritt 3 — Rechnung wandert in den Tabellen-Inspector
Status: erledigt 2026-09-02
- Ziel: Die Rechnung (Abgabemenge = Anzahl × Dosis × Tage) wird an der
  Tabelle bedient, zu der sie gehört: neuer Inspector-Abschnitt „Rechnung",
  sichtbar nur bei Tabellen mit Erfassungszeile, mit genau den vier Plätzen,
  Nachkommastellen, Rundung und dem Knopf „Rechnung entfernen" wie heute.
  Der Datencenter-Reiter „Rechnungen" verschwindet. Die Daten bleiben, wo sie
  sind: `props.rechnung` der Tabelle (Attribut-Text, `rechnungVonAttribut`).
  Alte Speicherstände laden unverändert.
- Dateien: `src/editor/zentrale/RechnungenBereich.tsx` → verschieben nach
  `src/editor/inspector/RechnungSektion.tsx` (git mv, dann anpassen: der
  Baustein kommt als Prop, keine eigene Tabellen-Auswahl mehr),
  `src/editor/inspector/Inspector.tsx` (Abschnitt einhängen, Reihenfolge
  laut Zielbild), `src/editor/zentrale/Kommandozentrale.tsx` (Reiter raus).
- Verboten: `src/core/data/rechnung.ts`, alles in `src/blocks/`. Die
  Rechen-Logik und das Speicherformat ändern sich nicht.
- Prüfung: Rahmen Punkt 4 (Teil A). `grep -rn "Rechnungen" src/editor`
  liefert nichts mehr.
- Klickprobe: Tabelle mit Erfassungszeile wählen → Inspector unten
  „Rechnung" mit vier Plätzen. Platz belegen → Erfassungszeile rechnet wie
  vorher (leerer Platz wird gerechnet). Datencenter hat zwei Bereiche.

### Schritt 4 — Inspector-Abschnitt „Spalten" für die Tabelle
Status: ZURÜCKGENOMMEN 2026-09-02 (Nutzer: Spalten werden am Ding bedient, am Kopf. Ein zweiter Weg im Inspector ist kein Fortschritt, sondern Ballast.)
- Ziel: Wer eine Tabelle wählt, sieht im Inspector ihre Spalten als Liste:
  Titel, Feldcode klein rechts, Kennzeichen (✎ änderbar, Σ Summe). Klick auf
  eine Zeile öffnet DENSELBEN Spalten-Picker wie der Klick auf den Kopf.
  Kein zweiter Picker, keine zweite Logik.
- Weg: Der Kopf löst heute `ff-listen-bind` am Baustein-Element aus
  (`src/blocks/tabelle/spaltenBearbeiten.ts`, Zeile ~332), der BlockHost
  öffnet daraufhin den `FieldPicker` (`src/editor/canvas/FeldBindung.tsx`).
  Der Inspector-Abschnitt löst dasselbe Ereignis mit demselben `detail` am
  Element des gewählten Bausteins aus (finden über
  `[data-ff-block-id="<id>"]` im Canvas). Nichts in `src/blocks/` ändert sich.
- Dateien: `src/editor/inspector/SpaltenSektion.tsx` (neu),
  `src/editor/inspector/Inspector.tsx` (einhängen nach Datenquellen, nur für
  Bausteine mit `listenBindung`), ggf. `src/editor/canvas/FeldBindung.tsx`
  (nur, falls das Ereignis eine Verankerung braucht, die heute fehlt).
- Verboten: `src/blocks/`, `src/core/`.
- Prüfung: Rahmen Punkt 4 (Teil A).
- Klickprobe: Tabelle wählen → Inspector „Spalten" listet ArtNr, Bezeichnung,
  Menge mit Codes. Klick auf „Menge" → derselbe Picker wie am Kopf. Feld
  wechseln → Kopf und Liste zeigen das neue Feld.

### Schritt 5 — Rohe Steuerelemente werden Bausatz-Teile
Status: erledigt 2026-09-02
- Ziel: Kein rohes `<button>` und `<select>` mehr in `src/editor/`; rohe
  `<input>` nur noch als UNSICHTBARE Datei-Wahl (`type="file"`,
  `className="hidden"`). Gleiches Verhalten; Groesse und Farben kommen
  vom Bausatz (kleine optische Angleichung ist gewollt).
- Zuordnung je Stelle (Stand 2026-09-02, nach `grep`):
  - `src/editor/shell/Toolbar.tsx`: drei Menue-Zeilen (`role="menuitem"`,
    Klasse `MENUEZEILE`) → neues Teil `src/ui/werkbank/MenueZeile.tsx`
    (eine Zeile eines Popover-Menues: Text, optional Zeichen, `disabled`,
    `onClick`; Klassen aus `MENUEZEILE` uebernehmen, `MENUEZEILE` danach
    loeschen). Die unsichtbare Datei-Wahl bleibt.
  - `src/editor/canvas/SeitenLeiste.tsx`: zwei Seiten-Reiter → neues Teil
    `src/ui/werkbank/Reiter.tsx` (Registerzunge: `aktiv`, `onClick`,
    `onDoubleClick`, `title`, Kinder; Klassen aus `REITER` uebernehmen);
    der Loesch-Knopf → `Knopf nurZeichen`.
  - `src/editor/zentrale/Kommandozentrale.tsx`: Bereichs-Knopf → `Eintrag`
    (icon, name, `rechts` = Zaehler, `aktiv`, `onClick`).
  - `src/editor/zentrale/RelationAuswahl.tsx`: Listenzeile → `Eintrag`
    (icon `Share2`, name, `rechts` = `Marke` mit Verb und Nummer wie in der
    Relationen-Liste, `aktiv`, `onClick`).
  - `src/editor/zentrale/SchrittListe.tsx`: Zeilen-Knopf → `Knopf` (Art
    `still`, `className="min-w-0 flex-[3] justify-start text-left"`).
  - `src/editor/sidebar/BlockPalette.tsx`: Palette-Kachel → `Knopf` mit
    `draggable` und den Drag-Handlern (Knopf reicht alle Button-Attribute
    durch); Klassen uebernehmen.
  - `src/editor/inspector/controls/PickerControl.tsx`: Ausloeser → `Knopf`
    (`ref` und `aria-*` gehen durch).
  - `src/editor/zentrale/DtkImportForm.tsx`: Ankreuzfeld → neues Teil
    `src/ui/werkbank/Ankreuz.tsx` (Kaestchen mit Beschriftung, `checked`,
    `disabled`, `onChange`).
  - `src/editor/canvas/FieldPicker.tsx`: die Feld-Zeile → `MenueZeile` (mit
    `aktiv`; sie war dieselbe Zeile wie im Toolbar-Menue, Klasse fuer Klasse).
  - `src/editor/inspector/controls/ColorTileControl.tsx`: die Farbkachel →
    neues Teil `src/ui/werkbank/Farbfeld.tsx` (Farbfleck mit Haekchen:
    `farbe`, `name`, `gewaehlt`, `onWaehle`).
  - Die letzten beiden fehlten in der ersten Fassung dieser Zuordnung; die
    Grep-Pruefung unten verlangte sie aber. Nachgetragen 2026-09-02.
  - AUSNAHME, bleibt roh: `src/editor/canvas/BlockHost.tsx` (zwei
    Canvas-Abzeichen mit Inline-Position: Entfernen, Kind anlegen) und die
    drei unsichtbaren Datei-Wahlen (`Toolbar.tsx`,
    `inspector/controls/BildControl.tsx`, `zentrale/DatenquellenBereich.tsx`).
- Verboten: Verhalten aendern, Tastatur-Bedienung aendern, `src/blocks/`.
- Prüfung: Rahmen Punkt 4 (Teil A) und:
  `grep -rn "<button\b" src/editor --include=*.tsx` nennt NUR
  `canvas/BlockHost.tsx`; `grep -rn "<select\b" src/editor` nichts;
  `grep -rn "<input\b" src/editor --include=*.tsx` nur Zeilen mit
  `type="file"` in den drei genannten Dateien.
- Klickprobe: Toolbar-Menue (…), Seitenreiter (Klick, Doppelklick
  umbenennen, Loeschen), Palette (Klick und Ziehen), Datencenter-Bereiche,
  Relation waehlen im Schritt-Formular, Import-Haekchen: alles tut, was es
  vorher tat, und sieht aus wie die uebrigen Knoepfe.

### Schritt 6 — Inspector-Reihenfolge fest und für alle gleich
Status: erledigt 2026-09-02
- Ziel: Jeder Baustein zeigt seine Abschnitte in der Zielbild-Reihenfolge,
  mit denselben Überschriften (`Gruppe`), keine Ausnahmen. Leere Abschnitte
  fehlen ganz. Kind-Knöpfe (+/×) an Kanban-Spalte und Navi-Eintrag sind
  geprüft: sie kommen aus dem BlockHost, kein Baustein zeichnet eigene im
  Editor-Modus. Wo doch: nach BlockHost heben, ohne Masken-Änderung (der
  Editor-Modus ist an `data-ff-editor` erkennbar; Masken-Bytes prüfen).
- Dateien: `src/editor/inspector/Inspector.tsx`, ggf. `src/editor/canvas/BlockHost.tsx`.
- Verboten: `src/blocks/` (Ausnahme nur, wenn ein Baustein im Editor-Modus
  eigene Kind-Knöpfe zeichnet — dann ist der Schritt ein Teil-B-Schritt:
  stopp, melden, Nutzer entscheidet).
- Prüfung: Rahmen Punkt 4 (Teil A).
- Klickprobe: Nacheinander Tabelle, Formularfeld, Kanban-Spalte, Navi,
  Schaltfläche wählen: gleiche Reihenfolge, gleiche Überschriften.

## 3. Teil B — Maske (Referenz ändert sich bewusst)

### Schritt 7 — Spalten in der fertigen Maske ausblenden
Status: erledigt 2026-09-03

**Wichtig für alle: die erste Fassung dieses Schritts war FALSCH.** Sie ließ
die Erfassungszeile und die Zellen über eine gefilterte Spaltenliste laufen.
Ein Opus-Chat hat das am Code nachgemessen, den Fehler belegt und nach
Stopp-Regel 5 aufgehört, statt zu bauen — genau richtig. Was daran falsch war
und wie es jetzt steht, ist der **Spalten-Kontrakt** unten. Er gilt für jede
weitere Arbeit an der Tabelle.

Gebaut ist:
- `Spalte.versteckt?: boolean` (`spalten.ts`), Schalter „In der Maske
  ausblenden" im Feld-Picker (`spaltenBindung.ts`); der Wert übersteht
  Export → Attribut → `coerceSpalten`.
- `spaltenSicht(spalten, alleZeigen)` liefert `{ spalten, plaetze }`: was
  gezeichnet wird, und wo das Gezeichnete in der vollen Liste steht. Im
  Editor immer die Identität.
- `tabelleKoerper` und `erfassungsZeile` bekommen `plaetze` und adressieren
  jeden WERT darüber; nur Rasterspuren zählen die gezeichneten Spalten.
- Tastatur der Erfassungszeile (Enter, Tab, Shift+Tab) überspringt
  ausgeblendete Spalten (`nachbarPlatz`, `naechsteLeere`); der Fokus findet
  die Zelle über `data-spalte` statt über die Zählung.
- Editor: ausgeblendete Spalte gedämpft (`.versteckt`, nur `data-ff-editor`).
- Die Rechnung nennt ausgeblendete Spalten im Wähler mit „(ausgeblendet)".
  Welche Spalte ausgeblendet wird, entscheidet allein der Bauende — der
  Editor redet ihm nicht hinein. Er sagt nur, wenn sich zwei Einstellungen
  gegenseitig blockieren: liegen ZWEI Rechnungs-Plätze auf ausgeblendeten
  Spalten, kann in beide niemand tippen, gerechnet wird aber nur einer — die
  Rechnung bliebe für immer leer. Dann steht eine rote Zeile im Abschnitt
  „Rechnung" (Regel 4: nichts scheitert still). Ein einzelner ausgeblendeter
  Platz ist der Normalfall und wird nicht kommentiert: genau er wird gerechnet.

Belegt im Browser an einer echten exportierten Maske (drei Spalten, mittlere
ausgeblendet, Daten hineingeschoben): Kopf zeigt zwei Spalten, die Werte
stehen unter der richtigen Überschrift, Sortieren nach Menge sortiert die
Menge, die Summe stimmt, der Wert der versteckten Spalte taucht nirgends auf.
Maske außerhalb des Bündels byte-gleich.

Bewusst so: die **Suche** findet auch über ausgeblendete Spalten. Ihr Wert
gehört zur Zeile; wer ihn kennt, darf danach suchen.

#### Schritt 7b — Spaltenwahl des Bedieners (in SoftEngine)
Status: erledigt 2026-09-03. Nutzer-Ansage: Ausblenden soll auch NACH dem
Export eine Option sein — der Bediener räumt sich seine Ansicht selbst auf.

- Neuer Schalter der Tabelle: **Spaltenwahl** (`spaltenwahl`, Vorgabe „nein",
  wie Suchzeile und Blättern). Der Bauende entscheidet, ob eine Tabelle das
  anbietet; er braucht dafür die Kopfzeile.
- Aufruf: **Rechtsklick auf eine Spaltenüberschrift** (Nutzer-Entscheidung
  2026-09-03 gegen einen sichtbaren Knopf — kein Platzverbrauch, klassisch
  für ERP-Masken). Ein kleines Fenster IN der Tabelle listet die Spalten mit
  Haken, dazu „Alle zeigen". Escape oder Klick daneben schließt.
- Zur Wahl steht nur, was der BAUER zeigt: eine über `Spalte.versteckt`
  ausgeblendete Hilfsspalte taucht dort nicht auf.
- Die letzte sichtbare Spalte lässt sich nicht auch noch wegnehmen.
- Die Wahl gilt je Maske und Tabelle und übersteht ein Neuladen, wenn der
  Browser den Speicher hergibt; sonst hält sie die Sitzung (`spaltenWahl.ts`,
  try/catch — ob SoftEngines eingebauter Browser localStorage kann, ist
  unbelegt und wird darum nicht vorausgesetzt).
- Gefiltert wird über denselben `spaltenSicht`-Weg: der Spalten-Kontrakt
  unten gilt unverändert.

Belegt an einer exportierten Maske: Rechtsklick öffnet die Liste (ohne die
vom Bauer versteckte Spalte), Wegnehmen lässt die übrigen Werte unter der
richtigen Überschrift stehen, Neuladen hält die Wahl, „Alle zeigen" holt
alles zurück.

#### Spalten-Kontrakt (gilt dauerhaft, nicht nur für Schritt 7)

Jeder ZUSTAND und jeder ERP-Kontrakt hängt am **Platz der Spalte in der
vollen Liste** — der Liste im `spalten`-Attribut, versteckte eingeschlossen:
- `seRuntime` baut `datenzeilen` über ALLE Spalten des Attributs.
- Der Export friert Ketten-Parameter als Platznummer dieser Liste ein
  (`exportMask.spaltenIndexFuer`), die Laufzeit liest `werte[spaltenIndex]`.
- Die Rechnung löst ihre Kennungen in dieser Liste auf (`spalteMitKennung`).
- Vormerkungen werden auf Satznummer + diesen Platz geschlüsselt.

Daraus folgen drei Verbote:
1. **Nie** die Spaltenliste beim Export, in `seRuntime` oder im
   `erfassungsUmfeld` filtern. Wer das tut, verschiebt jeden Platz dahinter:
   PUT_RELATION schreibt dann stumm in das falsche Feld — und PUT meldet
   nichts zurück.
2. Gefiltert wird **ausschließlich beim Zeichnen**, über `spaltenSicht`, und
   jede gezeichnete Stelle führt ihren vollen Platz mit (`plaetze[j]`).
3. `data-spalte` und der Index, mit dem eine Zelle meldet, dürfen nie
   auseinanderlaufen — sonst findet die Tastatur die Nachbarzelle nicht.

### Schritt 8 — Editor-Bedienung raus aus den Masken-Bytes
Status: erledigt 2026-09-02
- Teil 1 erledigt 2026-09-02: Plus/Minus-Knoepfe, Spalten-Kreuz und
  Stift-Marke sind aus dem Baustein raus. Der Editor hat dafuer EINE
  Werkzeugleiste am gewaehlten Baustein (`canvas/AuswahlLeiste.tsx`: Kind
  anlegen, Spalte anfuegen, Entfernen) und „Spalte entfernen" im Feld-Picker;
  beides laeuft ueber reine Registry-Vorgaenge (`listenBindung.eintragNeu/
  eintragWeg`). Offen (Teil 2): Kopf-Klick und Spalten-Zug aus dem Buendel
  in den Editor. Die Breiten-Griffe BLEIBEN im Baustein: sie gelten auch in
  der Maske (Bediener zieht Spaltenbreiten, fluechtig). Umbenennen laeuft
  ueber das Titelfeld im Feld-Picker, ein Weg statt zwei.
- Teil 2 erledigt 2026-09-02: Kopf-Klick (Feld-Picker) und Spalten-Zug
  (Umordnen) sind eine Schicht des Editors (`canvas/SpaltenBedienung.tsx`)
  ueber den Stellen, die der Baustein markiert (`data-ff-eintrag`, Registry:
  `listenBindung.eintragStellen`); Umordnen laeuft ueber den reinen Vorgang
  `eintragVerschieben`. Der Baustein sortiert im Kopf nur noch die Maske.
  Umbenennen: Titelfeld im Picker. Buendel 229,9 -> 223,3 kB seit Beginn
  von Schritt 8; Maske ausserhalb des Buendels byte-gleich. Lehre fuer alle:
  CSS nie per Suchmuster ueber Kommentargrenzen loeschen — ein zu weites
  Muster riss 232 Zeilen Tabellen-CSS mit, die Tabelle mass ihre Hoehe
  jedes Mal anders und zeichnete endlos (Hauptfaden blockiert).
- Was das ist, in Klartext: Heute steckt der Code, mit dem man im EDITOR die
  Tabellenspalten bedient (Kopf anklicken, umbenennen, Spalten ziehen,
  Breite ziehen, Plus/Minus), IM Tabellen-Baustein selbst — und wandert
  darum mit in die exportierte Maske, obwohl die Maske ihn nie benutzt.
  Schritt 8 trennt das: der Baustein markiert nur noch die Stellen, der
  Editor legt seine Bedienung darueber. Ergebnis: kleinere Maskendatei,
  saubere Trennung, gleiche Bedienung. Schwer, weil es den Baustein anfasst
  (Masken-Bytes), eine Ueberlagerung im Canvas braucht, die den Spalten
  folgt, und jede heutige Bedienung unveraendert weiterlaufen muss.
- Ziel: Was nur der Editor braucht (Spalten-Steuerung, Spalten-Zug,
  Umbenennen, Feld-Picker-Aufruf, Kopf-Griffe: `src/blocks/tabelle/
  spaltenBearbeiten.ts`, Teile von `spaltenBreite.ts`), wird nicht mehr in
  das Laufzeit-Bündel gebaut. Der Baustein zeichnet im Editor-Modus nur
  Anfasser-Stellen (`data-ff-editable`), der BlockHost legt die Bedienung
  darüber. Verhalten im Editor identisch; die Maske wird kleiner.
- Dateien: `src/blocks/tabelle/*` (Trennung), `src/editor/canvas/BlockHost.tsx`,
  `src/editor/canvas/` (neue Overlay-Datei für Tabellen-Bedienung),
  `vite.runtime.config.ts` (nur falls ein Eintrag nötig ist).
- Prüfung: Rahmen Punkt 4 (Teil B). Außerhalb des Bündels byte-gleich; das
  Bündel wird KLEINER (Größe im Commit nennen).
- Klickprobe: Alles am Tabellenkopf tut wie vorher (Klick, Umbenennen, Zug,
  Breite, +/−). Exportierte Maske: Tabelle sieht gleich aus, keine
  Editor-Knöpfe, Datei kleiner.
- Hinweis: Dies ist der größte Schritt. Ein Chat, der ihn nicht in einem
  Zug sicher schafft, stoppt VOR dem ersten Commit und berichtet.

### Schritt 10 — Editor-Durchgang: Gestaltung aus einer Hand
Erledigt 2026-09-02 (Fable): Stift-Marke, Spalten-Kreuz, Plus/Minus und
Herkunfts-Zeile aus dem Tabellenkopf; EINE Werkzeugleiste am gewaehlten
Baustein; „Spalte entfernen" im Feld-Picker; Spalten-Bedienung als Editor-
Schicht; Serifenschrift weg; ein Anfasser statt vier. Der Rest sind drei
kleine, mechanische Teilschritte:

### Schritt 10a — Leerwerte ohne Gedankenstriche
Status: erledigt 2026-09-03
Ausführung: Opus erlaubt.
- Ziel: Kein Auswahlfeld im Editor zeigt „— keins —", „— keinem —",
  „— keine —" oder „— nicht gebunden —". Der Leerwert ist ein Wort:
  `Keine` (Quelle, Spalte), `Keiner` (Geber/Baustein), `Nicht gebunden`
  (Feld). Nur Text, kein Verhalten.
- Finden: `grep -rn "— " src/editor src/ui --include=*.tsx --include=*.ts`
  und `grep -rn "leerText=" src/editor`.
- Verboten: Werte (`wert: ''`) aendern, Bausteine (`src/blocks/`).
- Prüfung: Rahmen 4 (Teil A) und 4b; der grep findet nichts mehr.

### Schritt 10b — Ein Ja/Nein-Idiom je Ort
Status: erledigt 2026-09-03 — nichts zu ersetzen, die Regel galt schon.
Beide Greps waren leer (laut `git log -S` waren sie es immer). Im ganzen
`src/` gibt es genau EINE Kachel-Stelle (`inspector/controls/KachelControl`,
aus `kind: 'jaNein'`) und EINE Schalter-Stelle (`canvas/FieldPicker`, die
auch `FeldBindung` bedient) — beide am richtigen Ort; Bild 2 und 3 der
Sichtprobe zeigen es. Nicht angefasst: das `Ankreuz` im DTK-Import (es hakt
Tabellen einer Liste an, ist kein Ja/Nein einer Einstellung — Schritt 10c
misst es nach) und die zweiwertigen Auswahlfelder der Formulare („Mehrere
Sätze" gegen „Nur der offene Satz": zwei benannte Wege, kein Ja/Nein).
Ausführung: Opus erlaubt.
- Regel: Im Inspector ist Ja/Nein eine `Kachel`; in Popover und Fenster
  (Feld-Picker, Formulare) ein `Schalter`. Nichts anderes.
- Finden: `grep -rn "<Schalter" src/editor/inspector` (muss leer werden,
  Ausnahme: `controls/` fuer Bausteine, deren Registry das ausdruecklich
  als Kachel-Gruppe fuehrt — dann Kachel) und
  `grep -rn "<Kachel" src/editor/canvas src/editor/zentrale` (muss leer
  werden). Ersetzen, ohne Verhalten zu aendern.
- Prüfung: Rahmen 4 (Teil A) und 4b.

### Schritt 10c — Seitenleiste und Menue nachmessen
Status: erledigt 2026-09-03 — vier Klassen angeglichen, sonst nichts.
Reiter: `text-ui` -> `text-dicht`, aktiv `bg-akzent/20` -> `bg-akzent/15`;
in `SeitenLeiste.tsx` derselbe Wechsel am angehaengten Loesch-Knopf, sonst
haette der aktive Reiter eine Naht gehabt. Menue-Zeilen hielten `h-steuer
text-ui` und Rot schon; nur die drei Zeichen in `Toolbar.tsx` standen auf
13 und stehen jetzt auf 14. Ankreuz: Kaestchen fest auf 14 px (`h-[14px]
w-[14px]`; die rem-Klassen haengen an der Grundgroesse 13,5 px und haetten
11,8 px ergeben), Beschriftung traegt `text-ui` jetzt selbst statt es vom
Formular zu erben. `MenueZeile.tsx` selbst blieb unveraendert.
Ausführung: Opus erlaubt.
- Ziel: `src/ui/werkbank/Reiter.tsx`, `MenueZeile.tsx`, `Ankreuz.tsx` und
  ihre Verwender (`canvas/SeitenLeiste.tsx`, `shell/Toolbar.tsx`,
  `zentrale/DtkImportForm.tsx`) halten Abschnitt 1a: Reiter 24 px hoch,
  `text-dicht`, aktiv `bg-akzent/15 font-medium text-tinte`; Menue-Zeilen
  `h-steuer text-ui`, Zeichen 14 px links, gefaehrlich rot; Ankreuz 14 px
  Kaestchen mit `accent-akzent`, Beschriftung `text-ui`. Abweichungen
  angleichen, sonst nichts.
- Prüfung: Rahmen 4 (Teil A) und 4b — Bilder 1 (Reiter), 8 (Menue) und ein
  eigenes Bild des Import-Formulars (`click:[title^="Datencenter"]` →
  `click:text=Aus SoftEngine-Datei` geht nicht ohne Datei; stattdessen die
  Klassen im Code gegen die Zahlen pruefen).

## 4. Teil C — Pflege

### Schritt 9 — Abhängigkeiten auf Stand (nur Nebenversionen)
Status: offen
Ausführung: Opus erlaubt (aendert weder Aussehen noch Verhalten; die Wächter entscheiden).
- Ziel: `npm outdated` zeigt keine Nebenversions-Rückstände. Hauptversionen
  (Tailwind 4, TypeScript 7) bleiben, bis der Nutzer sie will.
- Dateien: `package.json`, `package-lock.json`.
- Prüfung: `npm run check`, `npm test`, `npm run build:runtime`,
  Referenzabzug grün ohne Erneuern (ändert sich das Bündel durch ein Update:
  stopp und melden).

## 5. Bewusst NICHT im Plan

- Beispieldaten im Editor (Nutzer: nein, 2026-09-02).
- Rechnung verallgemeinern zu freien Formeln (kein belegter Bedarf).
- Umbenennung „Zimmer" im Kanban (Nutzer-Sprache; nur auf Ansage).
- Neubau von Laufzeit (`src/softengine/`), Export, Store, Tabellen-
  Erfassung: funktioniert, getestet, durch Echttests belegt.
- Neue Test-Gattungen (Browser, Komponenten): nur auf Ansage.
