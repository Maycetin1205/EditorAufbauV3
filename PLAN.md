# PLAN — der eine Plan für den Aufbau-Editor

> Geschrieben 2026-09-02 aus einem Außen-Urteil über den ganzen Editor (Code
> gelesen, Editor im Browser bedient, exportierte Maske daneben gehalten).
> Dies ist der EINZIGE Plan. `UMBAUPLAN.md` ist gelöscht. Neue Pläne gibt es
> nicht; was hier nicht steht, wird nicht gebaut, außer der Nutzer sagt es im
> Chat. Nutzer-Entscheidungen 2026-09-02: keine Beispieldaten im Editor;
> die Rechnung (Abgabemenge) bleibt; umkrempeln statt verschönern.

## 0. Rahmen — für JEDEN Chat, der hier arbeitet (zuerst lesen)

1. Lies `CLAUDE.md` (kurz) und diesen Plan. Arbeite GENAU EINEN Schritt, den
   ersten mit `Status: offen`. Nicht mehr. Kein Vorgriff, keine Zusatzideen,
   keine „Verbesserungen" nebenbei. Was dir auffällt, schreibst du in den
   Chat-Bericht, nicht in den Code.
2. Vor Beginn: `git fetch origin` und `git status` sauber. Branch:
   `claude/level-mythos-improve-oa0rrh` (bis der Nutzer anderes sagt).
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
  Spalten-Picker. Plus- und Kreuz-Knöpfe am Baustein gibt es nur für Kinder
  (Kanban-Spalte, Navi-Eintrag), und sie kommen alle aus dem BlockHost.
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
Status: erledigt 2026-09-02
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
Status: offen
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
Status: offen
- Ziel: Eine Spalte kann „nur im Editor" sein (z. B. eine Hilfsspalte für
  die Rechnung): im Editor sichtbar, aber gedämpft und gekennzeichnet; in der
  exportierten Maske nicht vorhanden. Schalter im Spalten-Picker
  („In der Maske ausblenden"), Kennzeichen in Kopf und Inspector-Liste.
- Dateien: `src/blocks/tabelle/spalten.ts` (Feld `versteckt?: true`),
  `src/blocks/tabelle/spaltenBearbeiten.ts`, `src/blocks/tabelle/
  tabelleKoerper.ts`, `src/blocks/tabelle/tabelleStil.ts`, `src/blocks/
  tabelle/TabelleBlock.ts` (Spalten filtern, wenn kein `data-ff-editor`),
  `src/editor/inspector/SpaltenSektion.tsx`, Tests dazu.
- Prüfung: Rahmen Punkt 4 (Teil B). Referenz: außerhalb des Bündels darf
  sich NICHTS ändern (die Referenzmaske hat keine versteckte Spalte).
- Klickprobe: Spalte ausblenden → Editor zeigt sie gedämpft; Export öffnen
  → Spalte fehlt; Erfassungszeile hat eine Zelle weniger.

### Schritt 8 — Editor-Bedienung raus aus den Masken-Bytes
Status: offen
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

## 4. Teil C — Pflege

### Schritt 9 — Abhängigkeiten auf Stand (nur Nebenversionen)
Status: offen
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
