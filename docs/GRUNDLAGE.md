# GRUNDLAGE — EditorAufbauV3

**Für jeden, der hier neu anfängt. Lies das zuerst.**

Stand: 2026-09-04 · Repo `Maycetin1205/EditorAufbauV3` · Branch `master` @ `cd94164`
Belegbestand: `docs/LESEPROTOKOLL.txt` — 337 Dateien, 46.428 Zeilen, je Datei Zeilenzahl + SHA1, mit Status `VOLL` (29 Dateien, 4.264 Zeilen) / `TEIL` (7) / `INVENTUR` (301 = **nicht gelesen**).

> **Dies ist kein zweiter Plan.** `CLAUDE.md:20-22` sagt: *„`PLAN.md` ist der EINE Plan … Neue Pläne gibt es nicht."* Dieses Dokument ist ein **Befund-Nachtrag**: was im Code steht, was gilt, was kaputt ist, was fehlt. Die Schritte in Abschnitt 10 sind Vorschläge für `PLAN.md`, nicht ein Ersatz dafür.

> **Grundregel.** Der Code ist die Wahrheit. `PLAN.md`, `CLAUDE.md`, `RECHNUNG-BELEGERFASSUNG.md` und dieses Dokument sind **Zeugen, keine Beweise**. Dein Repo sagt das selbst: `CLAUDE.md:3-7` — *„Die alte Fassung bestand aus KI-generierten Regeln, Ritualen und als ‚Nutzer-Entscheidung' etikettierten KI-Deutungen. **Nichts davon ist bindend.**"*
> Beleg für Drift: `CLAUDE.md:150-151` behauptet, die Rechnung sei „heute ein Datencenter-Reiter". Der Code hat sie seit 02.09. im Inspector (`Inspector.tsx:208`). **Wer die Doku glaubt statt zu lesen, plant fertige Arbeit.**

---

## 1. SO IST DAS REPO GEBAUT

### 1.1 Zwei Schichten, eine Wahrheit

```
EDITOR (React 19)                        FERTIGE MASKE (Lit 3 Web Components)
src/editor/ · src/state/ · src/ui/       src/blocks/ · src/design/
        │                                          │
        └──────────── src/core/blocks/ ────────────┘
                BlockDefinition · blockRegistry · treeQuery
                = die EINE Wahrheit über Fähigkeiten
                             │
                   src/export/exportMask.ts
                   Baum → index.basis.source.html
                        + index.basis.SEvariablen.json
```

**Der Baustein ist eine Lit-Klasse, die sich selbst anmeldet:**
- `src/blocks/base/BasicBlock.ts:68` — `export abstract class BasicBlock extends LitElement implements BlockComponent`
- `BasicBlock.ts:13-20` `definiere()` → `customElements.define`
- `BasicBlock.ts:23-66` `beschreibe()` → `registerBlockType({...})`, trägt **23 Felder** ein
- Jeder Baustein endet mit `BasicBlock.defineAndRegister(XBlock)` — z. B. `TabelleBlock.ts:722`, `KanbanBlock.ts:106`, `CardBlock.ts:159`

**Der Baum ist die Serialisierung.** `core/blocks/BlockData.ts:3-13` — `{id, type, props, events, parentId, childIds}`. Kein Baustein kennt den Canvas.

**Die Registry beantwortet Fähigkeitsfragen, nie der Typname.** `core/blocks/treeQuery.ts`:
`istAuswahlGeber:87` · `darfAuswahlFolgen:93` · `auswahlGeberImBaum:99` · `erfassungsTraegerImBaum:113` · `loeschTraegerImBaum:126` · `traegtLoeschungen:137` · `traegtAenderungen:145` · `aenderungsTraegerImBaum:167` · `kannRechnen:196`
Kommentar `treeQuery.ts:143-144`: *„Gelesen wird über die Registry … **kein Bausteintyp kommt hier vor**."*
Messung: `grep -rn "=== *'kanban'\|=== *'tabelle'" src` → **1 Treffer** in ganz `src/` (in `src/state`).

### 1.2 Editor und Maske sind hart getrennt

**Die eine Sperre:** `src/blocks/shared/datenAnschluss.ts:30`
```ts
const connect = (el: T): void => {
  if (el.hasAttribute('data-ff-editor')) return
```
→ Im Editor: **kein** Datenanschluss, **kein** Hydrate, **kein** Drag-and-Drop, **kein** `data-ff-auswahl`.
Weitere 20 Editor-Wachen in `src/blocks/**`: `ButtonBlock.ts:85` · `DatumBlock.ts:143` · `FormFeldBlock.ts:190,250,359,373,432` · `PopupBlock.ts:83,90` · `TabelleBlock.ts:333,354,374,478,505,594,623` · `zeilenEreignisse.ts:16,43` · `seAktionen.ts:362,442` · `navi/seRuntime.ts:65,83` · `KanbanSpalteBlock.ts:165`

**Editor-Hilfen leben ausschließlich im Host** — `src/editor/canvas/BlockHost.tsx`:
| Hilfe | Zeile |
|---|---|
| Auswahl-Rahmen | `:112` `outline: selected ? '2px solid hsl(var(--wb-auswahl))' : '2px solid transparent'` |
| Werkzeugleiste (Plus / Entfernen) | `:149-157` → `AuswahlLeiste.tsx` |
| Anfasser Breite / Höhe | `:159-202`, Bauteil `:217-235` |
| Spalten-Bedienung (Klick = Picker, Zug = umordnen) | `:138-148` → `SpaltenBedienung.tsx` |
| Feld-Picker | `:72-82` → `FeldBindung.tsx`, `FieldPicker.tsx` |

`AuswahlLeiste.tsx:64-67` belegt, dass das eine **bewusste Konsolidierung** war: *„Die EINE Werkzeugleiste … **Vorher** lagen zwei runde Abzeichen am Rahmen, und die Tabelle zeichnete **eigene** Plus/Minus-Knöpfe und ein Kreuz in die Maske."*
`AuswahlLeiste.tsx:40-53` `lageFuer()` misst den Platz gegen den nächsten clipenden Vorfahren und weicht aus (`oben` → `unten` → `rechts` → `innen`). **Die Leiste liegt nie über Inhalt.**

**Gegenprobe:** `KanbanBlock.ts:91-93` `render()` = `html\`<div class="board"><slot></slot></div>\`` — null Editor-Elemente. `CardBlock.ts:109-156` — null Editor-Elemente, nur `data-ff-editable`-Spans für Inline-Umbenennen (Inhalt, kein Chrome; `BasicBlock.ts:93-115` feuert `ff-prop-change` an den Editor).

### 1.3 State

`src/state/` = 37 Dateien. `Editor.ts` (383 Z.) ist eine **Fassade** über bereits getrennte Module:
`treeOps` · `history` · `persistence` · `selectionOps` · `quellenOps` · `rasterOps` · `pageOps` · `ladeKette` · `migrations` · `migrationenRoh` · `spaltenAufraeumen` · `duplizieren` · `speicherPlaner` · `notfallkopie` · `topologie` · `templateRules` · `propsPatch` · `meldungen`
(`CLAUDE.md:62-64` listet neun dieser Fächer.)

Undo/Redo vorhanden: `Editor.ts:135` `pushHistory` · `:139` `beginTransaction` · `:143` `endTransaction` · `:151` `oeffneGeste(): GestenKlammer` · `:155` `undo` · `:163` `redo`, über `history.ts` (`Historie`, `EditorSnapshot`, `gestenKlammer`).

**Drei Ereignis-Mechanismen existieren parallel** — `src/core/events.ts` gibt es **nicht**:
1. `src/state/Subject.ts` (22 Z.) — Observable; `subscribe()` gibt eine Unsubscribe-Funktion zurück, `notify()` isoliert Fehler. Nutzer: `Editor` (`Editor.ts:42`), `VorlagenStore`, `Meldungsstelle`
2. DOM `CustomEvent('ff-prop-change', {bubbles, composed})` — `BasicBlock.ts:104-108`, `TabelleBlock.ts:461-469` (mit `geste: 'beginn'|'ende'` für **einen** Undo-Schritt über mehrere Props)
3. Deklarierte `blockEvents` (`BlockDefinition.ts:206`) + `runEvent()` in `seAktionen.ts` — Laufzeit-Ketten

> ⚠️ Einen **vierten** Bus einzuführen, ohne zu sagen, was mit diesen drei geschieht, vermehrt die Unordnung.

**Nicht ein Store:** `DataSourceStore` und `RelationStore` sind eigene Modul-Singletons (`CLAUDE.md:64-65`) — und genau daraus entsteht Befund **B2**.

### 1.4 Export

`exportMask.ts` — **die Wurzel ist der Baum**, nicht der Store:
`:217` `const root = tree[ROOT_ID]` · `:219` `seitenDerMaske(tree)` · `:223` Wurzel-Kinder · `:233` `collectDataSources(tree, sources)` · `:235` `benutzteFelderJeQuelle(tree, sources)` · `:238` `collectRelations(tree, relations, used)` · `:273` `randPlatzLinks(tree)`
Baum-Walks: `benutzteQuellen.ts:41-62` (`visit(tree[ROOT_ID])`), `benutzteRelationen.ts:23-28`
Die Store-Importe (`exportMask.ts:29-32`) liefern **Standardwerte** und **reine Funktionen** — mit einer Ausnahme, siehe **B2** und **B7**.

### 1.5 Werkbank

`src/ui/werkbank/` = **20** Komponenten: `Ankreuz Dialog Eintrag Farbfeld Feld Gruppe Kachel Knopf Liste ListeDetail Marke MenueZeile Popover Reiter Schalter Segment Trenner Wahl Zahl Zeile`
**103** Importe über das Repo. Rohe `<button>`/`<select>`/`<input>` in `src/editor/` + `src/app/` außerhalb der Werkbank: **4 Treffer, davon 1 Kommentar** — übrig sind `controls/BildControl.tsx:54`, `shell/Toolbar.tsx:222`, `zentrale/DatenquellenBereich.tsx:113`.

### 1.6 Prüfnetz

**40 Test-Dateien**, davon **19** in `src/blocks/tabelle/`. Vitest ist die einzige Testart (`CLAUDE.md:55-56`).
Größte: `shared/seAktionen.test.ts` (489 Z.), `tabelle/erfassungsLauf.test.ts` (426 Z.).
Dazu: `export/referenzabzug.test.ts` (byte-bewacht gegen `export/referenz/`), `export/runtimeBuendel.test.ts`, `tools/sichtprobe.cjs` (9 Bilder, Port 5300).
`npm run build:runtime` erzeugt `src/export/generated/ff-runtime.js` (1.883 Z.).

---

## 2. DIE VERTRÄGE, DIE GELTEN

Jeder mit Beweis. **Diese Punkte sind richtig gebaut — nicht „verbessern".**

### 2.1 Spalten: Versteckt ≠ weg

`src/blocks/tabelle/spalten.ts:40-46` — der WICHTIG-Kommentar im Original:
> *„Versteckt heisst NICHT weg. Jeder Zustand und jeder ERP-Kontrakt haengt am PLATZ der Spalte in dieser vollen Liste — `datenzeilen` (seRuntime), die Ketten-Parameter (exportMask friest Kennung → Platz ein) und die Rechnung (`spalteMitKennung`). Wer versteckte Spalten aus der Liste wirft, **verschiebt alle Plaetze dahinter und schreibt stumm falsche Werte ins ERP**. Gefiltert wird darum AUSSCHLIESSLICH beim Zeichnen, ueber `spaltenSicht` — mit einer Abbildung zurueck auf den vollen Platz."*

```ts
spalten.ts:53-56   export interface Spaltensicht { spalten; plaetze }   // plaetze[j] = voller Platz der j-ten gezeichneten Spalte
spalten.ts:58-82   export function spaltenSicht(spalten, alleZeigen, wegDurchBediener = new Set())
spalten.ts:66      const weg = (s) => s.versteckt === true || wegDurchBediener.has(s.kennung)
spalten.ts:67      if (alleZeigen || !spalten.some(weg)) return { spalten, plaetze: identitaet }
spalten.ts:77-80   Sicherheitsnetz: sind ALLE versteckt, wird die erste gezeigt
```
**Verbraucher, beide mit `imEditor` als `alleZeigen`:** `TabelleBlock.ts:594` (Zeichnen), `TabelleBlock.ts:354` (Breiten-Übersetzung — **unvollständig, siehe B1**).
**Export friert den Platz über die KENNUNG:** `exportMask.ts:84-93` `spaltenIndexFuer(tree)` → `findIndex` in der **vollen** Liste, `'-1'` bei unbekannt.
**Fokus über den vollen Platz:** `TabelleBlock.ts:423-428` — *„Über den VOLLEN Platz (`data-spalte`), nicht über die Zählung der gezeichneten Felder."*
**Kopfzelle markiert den vollen Platz:** `tabelleKoerper.ts:189` `data-ff-eintrag=${lage.imEditor ? lage.plaetze[i] : nothing}`, `:191` `klickKopf(lage.plaetze[i])`, `:195` `sortSpalte === lage.plaetze[i]`
**Tests:** `spalten.test.ts:169,176,187,194,201,206` — fünf Fälle, inkl. *„merkt sich ihren Platz"*.

### 2.2 Spalten-Kennung ist der dauerhafte Ausweis — nie der Platz, nie das Belegfeld

`spalten.ts:4-12`:
> *„Der dauerhafte Ausweis der Spalte innerhalb ihrer Tabelle (`'s1'`, `'s2'`, …). Ketten-Parameter und die Rechnung zeigen auf IHN — nie auf den Platz und nie auf das Belegfeld: Platznummern verrutschen beim Löschen/Verschieben, und ein Belegfeld kann doppelt vergeben sein (**Nutzer-Vorfall 2026-09-01: zweimal 930_3, die Rechnung erwischte stumm die falsche Spalte**). Für die Ketten übersetzt der Export die Kennung in den Platz."*

`rechnung.ts:21-24` wiederholt dieselbe Regel für die Rechnungs-Plätze.
Vergabe an **einer** Stelle: `spalten.ts:118-121` `mitKennungen` → `core/blocks/listenBindung.ts` `kennungVergeben`; die Roh-Migration `state/migrationenRoh.ts` ruft dieselbe.
Auflösung: `spalten.ts:125-129` `spalteMitKennung` → `-1` bei leer/unbekannt (*„Zelle bleibt leer, dieselbe Antwort wie überall"*).
Verschieben braucht kein Nachziehen: `spaltenBearbeiten.ts:69-85` `mitVerschobenerSpalte` (rein).

### 2.3 Gezogene Breite ist ein ANTEIL, kein Pixelmaß

`spalten.ts:206-218` (Kommentar zu `spaltenRaster`):
> *„Die gezogene Zahl gilt als ANTEIL (`fr`), nicht als festes Pixelmass: ein `fr`-Raster fuellt die Tabelle immer genau aus. Feste Pixel taten das nur, solange ihre Summe zufaellig die Tabellenbreite traf — sonst stand rechts eine leere Flaeche (**Nutzer-Befund 2026-08-31**), spaetestens nachdem die Tabelle auf der Flaeche groesser gezogen war. Zwei Anlaeufe (`7f92603`, `040b73c`) haben an dieser Summe gerechnet; jetzt gibt es keine."*

```ts
spalten.ts:219-229  spaltenRaster(spalten, breiten) → eigene.map(w => `minmax(0, ${w ?? mittel}fr)`).join(' ')
spalten.ts:223      const eigene = spalten.map((s, i) => breiten(i) ?? s.breite)
spalten.ts:225-226  mittel = gesetzt.length === 0 ? 1 : max(1, round(sum/count))
```
→ Spalten ohne eigene Zahl bekommen das **Mittel der gesetzten**, nicht `1fr`. Ohne jede Zahl teilen alle gleich.
`spalten.ts:16-21`: *„Bewusst nicht vom Inhalt abhaengig — eine inhaltsabhaengige Breite spraenge beim Blaettern."*
`spalten.ts:141-146` `alsBreite` — rundet und klemmt auf `SPALTEN_MIN_BREITE`, aus **drei** Richtungen (Zug, Baum, Masken-Attribut).

**Ein Zug bewegt genau zwei Spalten und erhält die Summe:**
`spaltenBreite.ts:23-39` `verteileZug(linksStart, rechtsStart, wunschDx)` — *„Was die eine gewinnt, gibt die andere ab."*
`spaltenBreite.ts:73-83` `gemessen` — beim Anfassen bekommt **jede** Spalte ihren gemessenen Anteil, damit die übrigen nicht bei jedem Zug neu aufgeteilt werden.
`spaltenBreite.ts:45-111` `starteZug` — `stopPropagation` (`:57`, sonst zöge der Spaltenzug die ganze Tabelle), Abbruch auf `Escape` (`:100-104`), `pointercancel` und `blur` (`:108-110`), **alle fünf Window-Listener werden entfernt** (`:65-71` `aufraeumen`).
`spaltenBreite.ts:113-136` — die Griffe sind **eigene Kinder der Kopfzeile in derselben Gitterspur**, nicht `inset` über der Zelle. Begründung: **B4-Nebenbedingung, SoftEngine-Browser**. Die **letzte** Grenze hat keinen Griff (`:141` `Math.max(0, spaltenAnzahl - 1)`), weil rechts dahinter keine Spalte Platz hergeben kann (`:135-136`).

**Zwei Ablagen, ein Zug:** `TabelleBlock.ts:344-399` `breitenWirt()` — im Editor schreibt das Loslassen in den **Baum** (ein Undo-Schritt, `:382-387`), in der Maske bleibt es beim **flüchtigen** Stand bis zum Neuladen (`:374-377`). `:379-381` — *„Der fluechtige Stand muss WEG, sonst ueberdeckte er die gespeicherte Breite und ein spaeteres Undo aenderte sichtbar nichts."*
`TabelleBlock.ts:499-504` — ändert sich `spalten`, werden die flüchtigen Breiten geleert (*„zeigen sie auf die falsche"*). Ebenso `:583-585` `merkeWahl`.

### 2.4 Zwei Zahlen-Leser — Tipp streng, Quelle tolerant

**Beide existieren. Beide sind getestet. Nicht vereinheitlichen.**

```ts
core/data/rechnung.ts:68-78
// Getippte Zahl, deutsch und STRENG: Komma ist das Dezimalzeichen, Punkte
// nur als gueltige Tausender-Gruppen. '0.750' ist KEINE davon und bleibt
// ungelesen (null) — raten hiesse hier Faktor 1000 (Dosierfehler).
const STRENG = /^-?\d+(,\d+)?$|^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/
export function zahlStreng(text: string): number | null
```
```ts
blocks/tabelle/sortierung.ts:3-19
// Eine Tausendergruppe folgt nie auf eine alleinstehende Null: '0.750' ist
// 0,75 (englisches Dezimal), nicht 750 — der Unterschied ist Faktor 1000.
const ZAHL = /^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$|^-?\d+(,\d+)?$|^-?\d+(\.\d+)?$/
export function alsZahl(wert: string): number | null
```
**Der Ort, an dem beide zusammentreffen** — `erfassungsLauf.ts:113-131`:
```ts
// Der GEGEBENE Zahlwert eines Platzes — ohne das Gerechnete, sonst bliebe
// die Lücke nach dem ersten Ergebnis für immer gefüllt. Getipptes wird
// STRENG gelesen (raten wäre Faktor 1000), Quellen-Werte tolerant.
private gegebeneZahl(umfeld, index): PlatzWert {
  const getippt = this.getippt.get(index)
  if (getippt !== undefined) {
    if (getippt.trim() === '') return null
    const zahl = zahlStreng(getippt)          // ← TIPP    streng → '0.750' = null = 'fehler'
    return zahl === null ? 'fehler' : zahl
  }
  ...
  const zahl = alsZahl(wert)                  // ← QUELLE  tolerant → '0.750' = 0.75
  return zahl === null ? 'fehler' : zahl
}
```
| Leser | `'0.750'` | `'0,750'` | `'1.500'` | Einsatz |
|---|---|---|---|---|
| `zahlStreng` | **`null`** | `0.75` | `1500` | Getipptes (`erfassungsLauf.ts:120`) |
| `alsZahl` | `0.75` | `0.75` | `1500` | ERP-Quellenwert (`:129`), Sortierung (`sortierung.ts:59,92`), Anzeige (`zahlFormat.ts:13`) |

**Tests:** `rechnung.test.ts:84` *„zahlStreng liest deutsch und raet nie"*, `:92` `expect(zahlStreng('0.750')).toBeNull()`, `:91` *„'0.750' als 750 zu lesen war der Faktor-1000-Fehler"* · `sortierung.test.ts:5` *„aus '0.750' wurde 750"*, `:8` `expect(alsZahl('0.750')).toBe(0.75)`, `:10` `'0.7500'` → `0.75`
→ **Beide Fehler existierten und sind behoben.** Nicht wieder „fixen".

**Rückreise ohne Gruppierung:** `rechnung.ts:90-98` `platzText` mit `useGrouping: false` — *„so liest jeder Parser sie eindeutig zurueck"*.

### 2.5 Rechnung der Belegerfassung

`rechnung.ts:1-11` — der Vertrag im Original:
> *„Abgabemenge = Anzahl × Dosis × Tage. Gerechnet wird der EINE leere Platz; Getipptes und aus Quellen Gefuelltes gilt als gegeben. Tiergewicht und ‚je kg' sind am 2026-09-01 auf Nutzer-Ansage RAUS: die Dosis gilt pro Tier. … **Nicht ohne neue Entscheidung wieder einbauen.**"*

```ts
rechnung.ts:29-38   PlatzKey = 'menge'|'anzahl'|'dosis'|'tage'  ·  PLATZ_NAMEN
rechnung.ts:51      RUNDEN_STANDARD = { stellen: 3, richtung: 'kfm' }
rechnung.ts:56-58   anzahl = { stellen: 0, richtung: 'auf' }   // ganze Tiere, aufgerundet
rechnung.ts:80-88   rundeWert — Epsilon 1e-9 gegen Gleitkomma-Reste
rechnung.ts:103-140 loeseRechnung
rechnung.ts:108     if (!konfiguriert.has('menge')) return null
rechnung.ts:118     if (w === 'fehler') return null            // belegt, aber unlesbar → nichts
rechnung.ts:121     if (luecken.length !== 1) return null      // GENAU EINE Lücke → rechnen
rechnung.ts:124-129 unbelegt/leer zählt als Faktor 1
rechnung.ts:135     if (rechte === 0) return null              // keine Division durch 0
rechnung.ts:194-202 ohneSpalten — gestrichene Spalte → Platz wird leer
```
**Keine Warnung, nirgends** — `null` heißt „nichts gerechnet", die Zelle bleibt leer.
**Ort der Bedienung:** `Inspector.tsx:208` `{kannRechnen(block) && <RechnungSektion block={block} />}`, `RechnungSektion.tsx:53` `{ block }: { block: BlockNode }`. `kannRechnen` ist eine **Registry-Frage** (`treeQuery.ts:193-196`), kein Typname.
**Abräumen beim Spalten-Löschen:** `spaltenBearbeiten.ts:28-39` `rechnungNachSpalten`; Gegenstück für Ketten-Parameter im ganzen Baum: `state/spaltenAufraeumen.ts`. Beide Meldungen bilden **eine** Geste (`TabelleBlock.ts:446-459`, `geste:'beginn'`/`'ende'`) — ein Löschen braucht ein einziges Strg+Z.

### 2.6 Erfassung

```ts
TabelleBlock.ts:70-74   kannErfassen = { wenn: { attributeName: 'erfassung', equals: 'ja' } }
TabelleBlock.ts:80-84   kannLoeschen = { wenn: { attributeName: 'loeschbar', equals: 'ja' } }
TabelleBlock.ts:76-78   aenderungsSchluessel = 'aenderbar'
spaltenBindung.ts:42-69 eintragsSchalter: summe · aenderbar (standard:true, nurEigeneQuelle:true) · versteckt
spaltenBindung.ts:74-86 eintragsFeldWahl: fuellFeld → label 'Nachschlagen', nurFremdeQuellen
```
**Enter-Fluss:** `erfassungsBedienung.ts:109` `else if (taste === 'Enter') wirt.erfasseZeile()` · `:83` *„Enter folgt dem Fluss (G3b/G4): die nächste LEERE Zelle"* · `:92` *„Hinter der letzten Spalte schliesst Tab die Zeile ab, genau wie Enter"* · `TabelleBlock.ts:294-302` `erfasseZeile()` — *„die Zeile bleibt stehen, die Erfassung rueckt tiefer, der Cursor auf die erste Zelle. **Geschrieben wird hier NICHTS.**"*
**Sichtbarkeit danach:** `TabelleBlock.ts:304-315` `zeigeLetzteErfasste()` — *„die Erfassungszeile KLEBT unten, der Browser haelt sie fuer sichtbar und rollt darum gar nicht … (**Nutzer-Ansage 2026-08-28**)"*
**Korrektur an Ort und Stelle:** `tabelleKoerper.ts:109-112` `korrekturPlatz` · `:139-143` `holeErfassteZeile` — *„eine erfasste Zeile ist noch nichts als eine Vormerkung: der Bediener muss den Vertipper geradeziehen koennen, ohne sie wegzuwerfen"*
**Laufzeit-Verträge** (`BlockDefinition.ts:119-150`), am Baustein delegiert (`TabelleBlock.ts:246-278`):
`erfassteZeilen` · `erfassteSchluessel` (*„Platz für Platz … eine erfasste Zeile hat noch keine Satznummer, und ihr PLATZ taugt nicht als Kennung"*, `:114-118`) · `geaenderteZeilen` · `geloeschteZeilen` (*„die Werte reisen mit, weil eine Lösch-Relation mehr als die Satznummer verlangen kann"*, `:124-126`) · `zeileSchreibt` · `zeileGescheitert` · `laufFertig` (*„ein Fehler in Zeile 3 von 10 nähme auch den Vormerkungen 4-10 ihre Chance"*, `:138-145`)
**Zahl an einer Stelle:** `TabelleBlock.ts:509-515` `updated()` → `meldeVormerkungen(this)`; `:708-711` die Fußzeile nimmt `this.erfassteZeilen.length`, **nicht** `_erfassung.zeilen` (*„sie zaehlt die schon geschriebenen Zeilen mit und die getippte nicht"*).
**Tab:** `erfassungsLauf.ts:178` *„Tab ist die Weiter-Taste — **IMMER** (Nutzer 2026-09-01)"*; `:180-182` das große Fenster öffnen **nur** Enter und F4 (*„vorher riss Tab dem Bediener mitten im Durchtabben ein Fenster auf"*).

### 2.7 Ansicht, Raster, Zeilenmaß

```ts
seitengroesse.ts:1   ZEILEN_HOEHE = 28
seitengroesse.ts:3   OHNE_MESSUNG = 10          // Platzhalter-Zeilen ohne Messung
seitengroesse.ts:11-17 passendeZeilen = max(1, floor((rumpf - kopf) / zeilenHoehe))
seitengroesse.ts:25-34 zeilenmass → { passen, zeilenHoehe }
seitengroesse.ts:36-39 linealTakte = max(0, passen - gezeichnet)
seitengroesse.ts:64-73 rollAufteilung  — eine Seite, Rumpf rollt
seitengroesse.ts:75-89 seitenAufteilung — Seiten + Blätter-Knöpfe
```
`tabelleAnsicht.ts:122-173` rechnet **eine** `gridTemplateColumns` aus `gezeichnet` + `plaetze` (`:127-129`) — die gezogene Breite wird über `plaetze[j]` geholt, also über den vollen Platz. **Richtig.**
`tabelleAnsicht.ts:16-23` — die VOLLE Liste trägt Werte, Suche, Sortierung und Summen; das Raster (`cols`) trägt die gezeichneten.
`tabelleAnsicht.ts:107-112` `ansichtsZeilen` iteriert über die **Spalten**, nicht über die Länge der Datenzeile — *„eine frisch angelegte Spalte hat in den gelieferten Daten noch keinen Eintrag und fiele sonst aus Suche und Sortierung heraus"*.
`tabelleAnsicht.ts:50-54,80-83` — Summe, Suche und Sortierung laufen über **denselben** Zellwert inkl. vorgemerkter Änderung (Handmaske Rahmen00001 V11 rechnet so).
`tabelleAnsicht.ts:136-140` — mit Erfassungszeile gibt es **keinen** Leerzustand.
`seitengroesse.ts:60-63` — ohne Quelle bleiben die **Platzhalter-Striche**, *„damit der Editor keine Daten erfindet"*.

**Das Gitter ist einzeilig.** `tabelleKoerper.ts:178` `<div class="kopf" role="row" style=${styleMap(lage.cols)}>`; jede Kopfzelle nennt `grid-row: 1; grid-column: ${i+1}` (`:190`). Warnung `:180-183`:
> *„Kopfzelle und Greifstreifen nennen ihren Platz im Gitter BEIDE ausdruecklich. Sonst verteilt das Gitter die Zellen um die von den Streifen belegten Plaetze herum — **in eine zweite Reihe**."*
→ Für jeden Spalten-Umbruch (L2) ist das die **erste** Falle.

### 2.8 Obergrenzen und Mindestmaße

```
spalten.ts:89    SPALTEN_MIN        = 1     letzte Spalte bleibt stehen
spalten.ts:98    SPALTEN_MAX        = 16    global, NICHT pro Block
spalten.ts:102   SPALTEN_MIN_BREITE = 40    px, beim ZUG erzwungen
seitengroesse.ts:1  ZEILEN_HOEHE    = 28    px
```
`spalten.ts:91-97` — warum 16 und nicht 8:
> *„Die Obergrenze stand bis 2026-08-28 auf 8, ohne Grund: sie stammt aus dem uebernommenen Altstand (`c4bdad7`), und nichts haengt an der Zahl — das Spaltenraster entsteht dynamisch aus den Spalten. Eine Belegposition braucht allein sieben (ArtNr, Bezeichnung, Menge, Einheit, EPreis, Gesamt, Rohertrag), da war bei acht sofort Schluss. Die Grenze bleibt, damit der Plus-Knopf irgendwo aufhoert; **16 ist grosszuegig genug**, dass sie im Arbeitsalltag nicht mehr auffaellt."*

**16 ist eine begründete Entscheidung. Sie ohne Nutzer-Ansage zu senken ist ein Rückschritt.**
Die Grenze wird an **zwei** Stellen durchgesetzt, mit **unterschiedlicher** Disziplin:
- `spaltenBindung.ts:21-24` `eintragNeu` → gibt `{}` zurück, wenn `alt.length >= SPALTEN_MAX` → `AuswahlLeiste.tsx:81,106` macht den Plus-Knopf **sichtbar `disabled`**. ✅ richtig
- `spalten.ts:191` `coerceSpalten` → `arr.slice(0, SPALTEN_MAX)`, **stumm**. ❌ siehe **B3**

### 2.9 Kanban

**Drei Ebenen, nicht zwei:**
```
ff-kanban (Board)  →  ff-kanban-spalte  →  ff-kanban-zimmer  →  ff-card
```
`KanbanBlock.ts:15-47` — `blockType 'kanban'`, `allowedChildTypes:[spalte]`, `childDirection:'row'`, `lockedWidth:'fill'`, `resizableWidth:false`, `resizableHeight:true`, `acceptsDataSource:true`, `satzWahl:{}`, `addChildButton:{label:'Spalte'}`, `templateChild:{type:'card',label:'Muster'}`, `raster:{startW:24,startH:20,minW:6,minH:8}`, `blockEvents:[onCardClick, onCardDrop]`
`KanbanSpalteBlock.ts:19-65` — `allowedChildTypes:[card, zimmer]`, `allowedParentTypes:['kanban']`, `addChildButton:{label:'Zimmer'}`, `childDirection:'column'`, `showInPalette:false`, `lockedWidth:'fill'`, `resizableWidth:false`, Props `variant`/`heading`/`auffang`/`zimmerField`
`CardBlock.ts:19-29` — `blockType 'card'`, `allowedParentTypes:['kanban-spalte','kanban-zimmer']`, `showInPalette:false`, `lockedWidth:'fill'`, `resizableWidth:false`, 8 `bindableSpots` (`:52-61`)

**Die Karte ist im Editor ein Baustein, im Export ein `<template>`, zur Laufzeit ein Klon.** Das ist Absicht, kein Fehler:
- `exportMask.ts:114-118` — beim `templateChild`-Typ wird `<template data-ff-template>` geschrieben
- `exportMask.ts:188-190` — `firstDescendantOfType` liefert die Vorlagen-Id
- `kanban/seRuntime.ts:96-105` — Vorlage aus `template[data-ff-template]` geklont, in einer `WeakMap` gehalten
- `kanban/seRuntime.ts:120-143` — je Datenzeile ein `cloneNode(true)`, Felder über `bindableSpots` gesetzt, `card.draggable = true`

**Einsortierung:** `seRuntime.ts:13-22` `columnIndexFor` — **getrimmt, case-insensitiv**; `:24-26` `catchColumnIndex` — die Auffangspalte (`auffang === 'ja'`); `:122-128` ohne Treffer → Auffangspalte, sonst erste Spalte; `:73-84` `zielZimmer` — zweite Sortierung über `zimmerField`, ohne Treffer → erstes Zimmer.
**Leerzustand:** `seRuntime.ts:56-66` `setzeLeerHinweise` setzt `leerHinweis` je Zimmer **und** je Spalte; `KanbanBlock.ts:44,61` `leerText`.
**Drag & Drop, nativ, komplett:** `seRuntime.ts:206-258` — `dragstart` (`:220-232`, `effectAllowed='move'`, `ZIEHT_ATTR`), `dragover` (`:234-243`, `preventDefault`, `dropEffect='move'`, `markiereZiel`), `dragleave` (`:245-248`), `dragend` (`:233`), `drop` (`:249-257`). Ziel-Markierung `:161-171` (`data-ff-ziel`, `zielStil.ts`), Zug-Markierung `kartenStil.ts:36-38` (`opacity: 0.45`). Drop → `handleDrop:192-204` → `runEvent(board,'onCardDrop',{PINDEX, VALUE, ZIMMER})` → Kette → `PUT_RELATION`; Fehler → `meldeKettenFehler`.

> ⚠️ Die Karte als „kein Baustein" zu fordern, würde das Editor-Modell zerstören: `allowedParentTypes`, `bindableSpots`, `templateChild` und der ganze Export-Pfad hängen daran.

### 2.10 Zwei Selektionen — und warum das richtig ist

| | **Editor** | **Fertige Maske** |
|---|---|---|
| Mechanismus | React-State → `BlockHost.tsx:112` `outline` | DOM-Attribut `data-ff-auswahl` |
| Wer setzt | `Editor.ts:228` `selectBlock`, `:234` `waehleGetroffenen` | `kanban/seRuntime.ts:153` + `shared/auswahl.ts` |
| Stil | `--wb-auswahl` = **HSL 246 60% 56%** (`index.css:31`) → blau-violett | `--se-accent` → türkis (`kartenStil.ts:31-34`) |
| Bedeutung | „dieser **Baustein** ist zum Bearbeiten gewählt" | „diese **Datenzeile** ist gewählt" |

**Das sind zwei verschiedene Dinge, keine doppelte Implementierung.** `data-ff-auswahl` kann im Editor **nicht** gesetzt werden (`datenAnschluss.ts:30`). Sie zu vereinigen bricht die Maske.
`--wb-*` = Editor-UI (hell, Lila) · `--se-*` = Masken-Tokens (Türkis, Navy) — **nie mischen** (`CLAUDE.md:76-77`).

---

## 3. NUTZER-ENTSCHEIDUNGEN

**Der wichtigste Abschnitt.** Jede mit Datum und Beleg. `CLAUDE.md:6-7`: bindend sind *„die SoftEngine-Kontrakte aus Echttests … und was der Nutzer im aktuellen Chat sagt."* Diese Liste ist die Brücke dazwischen.

### 3.1 Aus dem Code (mit Datum im Kommentar)

| Datum | Entscheidung | Beleg |
|---|---|---|
| 2026-08-28 | Nach dem Erfassen ans Ende rollen — die klebende Erfassungszeile trickst den Browser aus | `TabelleBlock.ts:304-315` |
| 2026-08-28 | „Nachschlagen" statt „Füllfeld" — „In der Zeile" und „Beim Erfassen" sagen beide WANN, nicht WAS | `spaltenBindung.ts:78-82` |
| 2026-08-28 | Inspector nach **Form** trennen, nicht nach Thema; `requiresDataSource` wandert **nicht** nach unten | `Inspector.tsx:118-133` |
| 2026-08-31 | Breite als `fr`-Anteil, nicht als Pixel — zwei Versuche (`7f92603`, `040b73c`) behandelten nur das Symptom | `spalten.ts:206-218`, `spaltenBearbeiten.ts:13-17` |
| 2026-08-31 | **Der eingebaute SoftEngine-Browser ist älter als Chromium 87** — kein `inset: 0`, dort hatte eine Lage keine Größe | `spaltenBreite.ts:113-121` |
| 2026-08-31 | Gestrichene Spalte hinterlässt keine leere Fläche | `spaltenBearbeiten.ts:55-58` |
| 2026-08-31 | Anzahl Tiere: ganze Tiere, **aufgerundet**, „damit keines leer ausgeht" | `rechnung.ts:56-58` |
| — | „In der Zeile änderbar" ist **standardmäßig AN** | `spaltenBindung.ts:53-57` |
| 2026-09-01 | **Neue Tabelle startet mit EINER leeren Spalte** — drei Platzhalter waren drei Klicks zum Wegräumen | `spalten.ts:131-135` |
| 2026-09-01 | **Vorfall: zweimal `930_3`** — die Rechnung erwischte stumm die falsche Spalte. Darum `kennung` | `spalten.ts:4-12`, `rechnung.ts:21-24` |
| 2026-09-01 | **Tiergewicht und „je kg" RAUS — die Dosis gilt pro Tier.** (Baytril „5 ml / 50 kg", IDB `313_5`.) *„Nicht ohne neue Entscheidung wieder einbauen."* | `rechnung.ts:6-11` |
| 2026-09-01 | **Einheiten-Umrechner ausgebaut** — die Einheit kommt aus der Zeile (Behandlungseinheit) und ist oft nicht umrechenbar (`'Inj.'`, `'Stab'`) | `rechnung.ts:40-43` |
| 2026-09-01 | **Tab ist die Weiter-Taste — IMMER.** Das große Fenster öffnen nur Enter und F4 | `erfassungsLauf.ts:178-193` |
| 2026-09-01 | Auch ein **gebundenes Formularfeld** gibt seine angezeigte Zeile, nicht nur das Nachschlage-Feld | `treeQuery.ts:81-86` |
| 2026-09-02 | **Keine Beispieldaten im Editor — auch nicht als Schalter** | `CLAUDE.md:91-93`; `spalten.ts:87` `'—'`; `kartenStil.ts:140-143`; `seitengroesse.ts:60-63` |
| 2026-09-02 | **Rechnung bleibt, ist dem Nutzer wichtig** | `CLAUDE.md:148-150` |
| 2026-09-02 | **EIN Branch: `master`.** Halbfertiges nur als Patch unter `docs/wip/`, **nie als Branch** | `CLAUDE.md:34-36` |
| 2026-09-03 | **Rechtsklick auf eine Spaltenüberschrift** = Spaltenwahl-Fenster der Maske | `TabelleBlock.ts:558-561` |

### 3.2 Aus der git-Geschichte

`master` hat **einen** Commit (`cd94164`, Squash-Snapshot). Die 139 Commits davor (25.08.–03.09.) liegen auf `arena/01a06afe-editoraufbauv3`. Zusätzliche belegte Entscheidungen daraus:

| Datum | Entscheidung | Commit |
|---|---|---|
| 2026-08-28 | **Satznummer der Belegposition ist `645_10`** (Nutzer-Ansage) | `eda967c` |
| 2026-08-28 | Tabellen-Schalter „Schlank" **restlos entfernt** | `eaba698`, `4c3e8b1` |
| 2026-08-31 | Grundgröße des Editors **13,5 px** | `95e6293` |
| 2026-08-31 | Editor-Chrome: **Ecken 2 px, Inspector 400 px und breitenziehbar** | `e064f94` |
| 2026-08-31 | **Kein Bedienelement unter 240 px** | `18197f3` |
| 2026-08-31 | `je-kg` ohne Tiergewicht-Platz **schweigt** statt `1/Bezug` zu rechnen | `f425e2f` |
| 2026-08-31 | Enter nimmt den **einzigen** Treffer, sonst geht das Fenster auf | `8e848cf` |
| 2026-08-31 | Satznummer wird **gewählt statt geraten** | `da05673` |
| 2026-09-02 | **Vormerk-Texte restlos entfernt** | `292754e` |
| 2026-09-03 | **Vorschlagsliste breiter als die Spalte**, links verankert | `292754e`, `d0c6348` |
| 2026-09-03 | Zweiter Klick **hebt die Zeilen-Auswahl immer auf** (Ausklicken) | `fcf6302`, `bfa00a8` |

**Historische Nummern — nicht neu belegen:** `S1–S6` (Sanierung), `P1–P6` (Reparatur), `T1–T7` (Tabellen-Umbau), `Etappe 0–4`, `Schritte 1–19`.

### 3.3 Referenz-Handmaske

`Rahmen00001 V11` wird im Code **dreimal** als Maßstab genannt: `TabelleBlock.ts:90-91` (Doppelklick → `TABELLEPOS_DETAILS`), `:471-473` (`basisHTML_DoSetFocusToHTML` → Fokus in die erste Erfassungszelle), `tabelleAnsicht.ts:52-53,82` (Summe nimmt die geänderte Menge).
Echte SE-Referenzmasken liegen in `docs/chef-maske/` — `empfang/index.basis.source.html` (2.987 Z.), `behandlung/index.basis.source.html` (1.966 Z.), `BeispielBeleg.html` (653 Z.). SE-Wissen in `docs/softengine-wiki/` — `kontrakte.md` (299 Z.), `parser-direktiven.md` (333 Z.).

### 3.4 SoftEngine-Kontrakte

Stehen in `CLAUDE.md:101-144` und stammen aus **Echttests**. Die wichtigsten:
LF-only, reines ASCII · `PUT_RELATION` mit `PARAMS = [pos, len, art, pindex, relId, wert]`, `art` `'L'|'D'|'Z'`, `relId` ohne `IDB`-Präfix, **Einweg** · `pindex` = Satznummer des Zielsatzes · **immer nur EINE GET-Anfrage in Flug** · leere Antwort `{"RESULT":""}` ist eine **Antwort** · **Reihenfolge der SEFILELOOP-Einträge ist Kontrakt** — Kopfsatz-Loop an erster Stelle → keine Quelle liefert, Export schreibt Kopfsatz-Arten **zuletzt** · SEvariablen mit pos_len-Liste der **benutzten** Felder, nie `*` · Relation 69 liefert je Ruf **ein** Feld, **immer seriell** · `MEMTAB` kommt in keiner echten Maske vor · `ERPAICALL` erst bauen, wenn die Form an einer echten Maske belegt ist
**In dieser Grundlage NICHT gegen den Code geprüft** — siehe Abschnitt 7.

---

## 4. BEFUNDE — KAPUTT

Jeder Befund: was, wo, Wirkung, wie nachzuweisen. **Nichts davon ist geraten.**

### 🔴 B1 — `TabelleBlock.ts:354` fehlt der dritte Parameter · **gezogene Breiten landen in der Maske auf der falschen Spalte**

**Zwei Aufrufe derselben Funktion, einer unvollständig:**
```ts
TabelleBlock.ts:594  (render)        spaltenSicht(spalten, this.hasAttribute('data-ff-editor'), this.wahlWeg())   ✅
TabelleBlock.ts:354  (vollerPlatz)   spaltenSicht(this.spaltenListe(), this.hasAttribute('data-ff-editor'))        ❌ fehlt wahlWeg()
```
```ts
spalten.ts:58-65   spaltenSicht(spalten, alleZeigen, wegDurchBediener = new Set())
spalten.ts:66      const weg = (s) => s.versteckt === true || wegDurchBediener.has(s.kennung)
```
Ohne das dritte Argument ist `wegDurchBediener` leer → Spalten, die der **Bediener in der fertigen Maske** weggenommen hat (`spaltenwahl`, `spaltenWahl.ts`), werden **nicht** herausgerechnet → `sicht.plaetze` lebt in einem **anderen** Indexraum als das, was `render()` zeichnet.

**Wirkung.** `TabelleBlock.ts:350-358` übersetzt die gezogenen Breiten vom gezeichneten auf den vollen Platz — der Kommentar sagt exakt, wozu:
> *„Die Griffe zaehlen die GEZEICHNETEN Spalten; gespeichert wird unter dem vollen Platz. **Ohne die Uebersetzung landete die gezogene Breite hinter einer ausgeblendeten Spalte auf der falschen.**"*

Die Übersetzung ist da, aber **unvollständig**: sie behandelt `versteckt` (Bauer blendet aus), nicht `wahlWeg` (Bediener blendet aus). Beispiel: 5 Spalten, Bediener nimmt Spalte 2 weg → gezeichnet `[s1,s3,s4,s5]`, korrekte `plaetze` `[0,2,3,4]`, mit dem Bug `[0,1,2,3]`. Der Zug an der Linie zwischen `s1` und `s3` schreibt dann auf Platz 0 und **1** — und Platz 1 ist die **ausgeblendete** Spalte. Sichtbar: die Breite ändert sich nicht; unsichtbar: eine ausgeblendete Spalte trägt einen Breiteeintrag.

**Warum es niemand merkt.** Im Editor ist es **korrekt**: `alleZeigen = true` → `spaltenSicht` liefert die Identität (`spalten.ts:67`), und `wahlWeg()` liefert ohnehin `LEERE_WAHL` (`TabelleBlock.ts:547-551`, weil `spaltenwahlAn` `!data-ff-editor` verlangt, `:541-545`). Es braucht **drei** Bedingungen gleichzeitig: fertige Maske + `spaltenwahl='ja'` + Bediener hat ≥1 Spalte weggenommen + zieht dann eine Breite. Editor, Tests und Sichtprobe sehen es nicht.

**Nachweis.** `spaltenwahl` einschalten → exportieren → in der Maske per Rechtsklick eine Spalte wegnehmen → an einer Spaltenkante ziehen → die Breite landet woanders.
**Fix.** Eine Zeile: `wahlWeg()` nachreichen. **Vorher einen Test, der rot ist.**

---

### 🔴 B2 — `benutzteQuellen.ts:192` iteriert die ganze Bibliothek · **Geister-Felder im Export**

```ts
benutzteQuellen.ts:68-70   RICHTIG  — über die baumgefilterte Menge
  for (let i = 0; i < acc.length; i++) {
    for (const { quelleId } of quellenAusHolWert(acc[i])) add(quelleId)
  }

benutzteQuellen.ts:189-194 FALSCH   — über die ungefilterte Bibliothek
  // Woraus eine holende Quelle ihre Parameter zieht, steht an der QUELLE und
  // nicht im Baum. Ohne diese Runde bestellte der Export das Feld nicht, und
  // der Parameter ginge in SoftEngine leer hinaus.
  for (const source of sources) {
    for (const { quelleId, code } of quellenAusHolWert(source)) merke(quelleId, code)
  }
```
**Derselbe Gedanke, 120 Zeilen auseinander, zwei Disziplinen.** `collectDataSources` (`:28-72`) und `collectRelations` (`benutzteRelationen.ts:6-34`) walken korrekt den Baum ab `tree[ROOT_ID]`.

**Wirkung.** Eine Quelle der Art „Wert per Relation", die im Datencenter angelegt, aber **nie auf dem Canvas platziert** wurde, bestellt trotzdem ihre Felder in `benutzteFelderJeQuelle`. Ob sie bis in die SEvariablen durchkommt, hängt an `baueSevariablen` (`export/sevariablen.ts`, 97 Z.) — **nicht gelesen, OFFEN-4**.
`CLAUDE.md:132-134`: SEvariablen brauchen die pos_len-Liste der **benutzten** Felder, `*` erzeugte „tausende Bild-Nachschlaege, 9,2 s". Genau gegen diese Regel läuft der Befund.

**Fix.** `sources` → die baumgefilterte Menge. **Erst ein Geist-Test, der rot ist.**

---

### 🔴 B3 — `spalten.ts:191` wirft Spalten **stumm** weg

```ts
spalten.ts:181-196
export function coerceSpalten(v: unknown): Spalte[] {
  ...
  if (arr.length > SPALTEN_MAX) arr = arr.slice(0, SPALTEN_MAX)   ← STUMM
  if (arr.length < SPALTEN_MIN) arr = [neueSpalte(0)]
  return mitKennungen(arr)
}
```
**Wirkung.** Jede Lesung der Spaltenliste — Maske laden, Migration, Attribut-Parsen (`tryCoerceSpalten:198`) — verwirft Spalte 17 und darüber **ohne eine Meldung**.

**Warum das gefährlich ist.** Es bricht zwei belegte Regeln gleichzeitig:
1. `CLAUDE.md:85-86` Grundsatz 4 — *„**Nichts scheitert still**: Laufzeitfehler gehen über `meldeFehler` in den Fehlerbalken."*
2. `spalten.ts:40-46` — *„Wer versteckte Spalten aus der Liste wirft, **verschiebt alle Plaetze dahinter und schreibt stumm falsche Werte ins ERP**."* Genau das tut `slice`.

Die Ketten-Parameter werden über den **Platz** eingefroren (`exportMask.ts:84-93`), die Rechnung über die Kennung (`spalteMitKennung`) — abgeschnittene Spalten lassen also die Ketten-Parameter **verrutschen**.

**Gegenbild im selben Repo:** `spaltenBindung.ts:21-24` macht denselben Grenzwert **sichtbar** — der Plus-Knopf wird `disabled` (`AuswahlLeiste.tsx:81,106`). Zwei Disziplinen für eine Grenze; die Lade-Disziplin ist die falsche.

**Einordnung.** Im Alltag harmlos (16 ist großzügig). Beim Laden einer fremden oder alten Maske mit >16 Spalten: stille Datenkorruption. **Fix ~15 Zeilen: melden statt schneiden.** Ob geschnitten oder nur gewarnt wird → **OFFEN-5**.

---

### 🔴 B4 — Kanban mit einer Spalte: das Board ist nicht erreichbar

**Ursache ist Geometrie, nicht ein zu kleiner Griff.**
```
KanbanBlock.ts:23       lockedWidth = 'fill'
KanbanBlock.ts:24       resizableWidth = false
KanbanBlock.ts:79-86    .board { display:flex; flex-direction:row; gap:var(--se-gap-lg); height:100% }
KanbanBlock.ts:87       .board slot { display: contents }
KanbanSpalteBlock.ts:37 lockedWidth = 'fill'
KanbanSpalteBlock.ts:74-78  :host { display:flex; flex-direction:column; min-height:100% }
BlockHost.tsx:101-116   der gesamte Host-Div ist Klickfläche, cursor: pointer
```
Bei **einer** Spalte füllt die Spalte 100 % der Board-Breite. `gap` wirkt nur **zwischen** Flex-Kindern — bei einem Kind entsteht kein freier Raum. **Die Spalte deckt das Board vollständig ab**; jeder Klick trifft den `BlockHost` der Spalte, nie den des Boards. Bei 2+ Spalten gehört der `gap`-Streifen dem Board — deshalb funktioniert es ab zwei Spalten.

**Warum ein `min-height` am Spaltenkopf nichts bringt:** der Kopf ist längst höher (`KanbanSpalteBlock.ts:97-103` `padding: 10px 12px` + Inhalt), und er gehört zur **Spalte**. Ein Griff dort selektiert die Spalte — das Board bleibt unerreichbar.
**Warum es keinen Breiten-Griff gibt:** `resizableWidth = false` (`KanbanSpalteBlock.ts:38`, `KanbanBlock.ts:24`).

**Was fehlt, ist tiefer:** die Auswahl ist **flach**. `Editor.ts:228` `selectBlock(id: string | null)` kennt **eine** Id, keinen Pfad; `BlockHost.tsx:112` zeichnet genau einen Rahmen. Es gibt keinen Weg „eine Ebene nach oben".

**Lösungsrichtungen** → **OFFEN-1**. Nur eine davon ist export-neutral.

---

### 🔴 B5 — Muster-Karte bekommt einen Rahmen, aber kein Werkzeug

```ts
BlockHost.tsx:98    const templateMark = editor.templateMarkFor(block.id)
BlockHost.tsx:112   outline: selected ? '2px solid hsl(var(--wb-auswahl))' : '2px solid transparent'   ← kennt templateMark NICHT
BlockHost.tsx:149   {selected && !templateMark && ( <AuswahlLeiste .../> )}                            ← kennt templateMark
```
**Der Rahmen wird immer gezeichnet, die Leiste für Template-Kinder unterdrückt.** Ergebnis: eine blau-violette Kontur (`--wb-auswahl: 246 60% 56%`, `index.css:31` — Ton 246 ist **blau**) um die Kanban-Musterkarte, **ohne** einen einzigen Knopf daran.

`KanbanBlock.ts:28` `templateChild = { type: CardBlock.blockType, label: 'Muster' }` — die Karte ist die **Vorlage**, kein Daten-Baustein. Ein Auswahlrahmen ohne Bedienung an einer Vorlage ist bedeutungslos.

**Abgrenzung, wichtig:** das ist **nicht** `data-ff-auswahl`. Dessen Stil (`kartenStil.ts:31-34`, türkis `--se-accent`) gehört der **fertigen Maske** und kann im Editor nicht gesetzt werden (`datenAnschluss.ts:30`; einziger Setter `kanban/seRuntime.ts:153` in `hydrate()`). **`kartenStil.ts:31-34` nicht löschen** — das bricht die Zeilen-Auswahl der Maske.

→ **OFFEN-2**, braucht eine Entscheidung.

---

### 🟠 B6 — `datenAnschluss.disconnect` entfernt keine Listener

```ts
datenAnschluss.ts:29-47   connect:  opts.verdrahte?.(el)  +  globale Anmeldung  +  bootSe()
datenAnschluss.ts:49-51   disconnect: elemente.delete(el)     ← sonst NICHTS
```
**Was `verdrahte` setzt und niemand zurücknimmt** — `kanban/seRuntime.ts:206-258`, **sechs** Listener am Board: `click` (`:210`), `dragstart` (`:220`), `dragend` (`:233`), `dragover` (`:234`), `dragleave` (`:245`), `drop` (`:249`).
**Ebenfalls nie abgemeldet** (`datenAnschluss.ts:34-43`, einmal je Baustein-Modul, `angemeldet` ist closure-lokal): `onSeDaten`, `aufTagHoeren`, `aufAuswahlHoeren`, `verdrahteHolendeQuellen`. Und `bootSe()` (`:44`) läuft bei **jedem** `connect`.

**Einordnung.** In der fertigen Maske leben alle Elemente seitenlang → praktisch folgenlos. Als Regel ist es trotzdem falsch, und das Repo hat das **Gegenvorbild**: `spaltenBreite.ts:65-71` `aufraeumen()` entfernt alle fünf Window-Listener; `TabelleBlock.ts:517-524` `disconnectedCallback` räumt vollständig auf (`removeEventListener` ×2, `_ansicht.loese()`, `schliesseNachschlagenFuer`, `disconnectTable`). **Die Tabelle ist sauber, Kanban nicht.**

---

### 🟠 B7 — `exportMask` ist unrein · gefährdet den byte-bewachten Referenzabzug

```ts
exportMask.ts:209-216
export function exportMask(
  tree: BlockTree,
  title = 'Maske',
  sources: readonly DataSource[] = dataSourceStore.list,        ← Modul-Singleton
  relations: readonly RelationTemplate[] = relationStore.list,  ← Modul-Singleton
): MaskExport
```
**Wirkung.** Derselbe Baum kann je nach globalem Store-Zustand verschiedene `FF_DATA_SOURCES`, `FF_RELATIONS` und SEvariablen liefern. `export/referenzabzug.test.ts` vergleicht **byte-gleich** gegen `export/referenz/` (`CLAUDE.md:43-49`) — eine unreine Funktion ist dort ein latentes Flaky-Risiko, und sie macht B2 überhaupt erst wirksam.

**Fix.** Beide Parameter **Pflicht**, alle Aufrufer anpassen (`grep "exportMask("`). Danach hat `src/export/` **keinen** Store-Import mehr.

---

### 🟡 B8 — `master` hat einen Commit · die Arbeitsgeschichte hängt an einem zweiten Branch

```
GitHub-Branches:  master  ·  arena/01a06afe-editoraufbauv3
Commits:              1   ·  139
Wurzel:   cd941647e96a…  ·  c4bdad72348…    → git: "no merge base"
Letzter Stand: 04.09. 08:01 · 03.09. 16:37
```
- `master` ist ein **Squash-Snapshot** — neuer im Inhalt, leer in der Geschichte.
- Der zweite Branch trägt 139 Commits: `Etappe 0 Rettung` → `Etappe 1 Wächter` → `Etappe 2 Aufräumen` → `Etappe 3 Zeilen-Lebenszyklus` → `Etappe 4.1–4.4 Werkbank` → `Sanierung S1–S2` → `Reparatur P1–P6` → `Tabellen-Umbau T1–T7` → `Schritte 1–18`.
- **Verletzt `CLAUDE.md:34-36`:** *„EIN Branch: `master` … Halbfertiges liegt nur als Patch unter `docs/wip/`, **nie als Branch**."*
- **Folge:** kein `git bisect`, kein Rollback, keine Basis für „Referenz einfrieren". Scheitert ein Umbau, gibt es auf `master` **keinen alten Stand**.
- **Folge 2:** 25 datierte Nutzer-Entscheidungen (Abschnitt 3) sind nur dort vollständig belegbar.

→ **Schritt 00 in Abschnitt 10: erst retten, dann löschen.**

---

## 5. BEFUNDE — FEHLT

### L1 — `maxSpalten` pro Baustein · nicht einstellbar
```
grep -rn "maxSpalten|erlaubtUmbruch|umbrechen|umbruch" src  →  0 TREFFER
```
Es gibt nur die **globale** Konstante `spalten.ts:98` `SPALTEN_MAX = 16`. `BlockDefinition.ts:152-215` hat 33 Felder — `maxSpalten`, `erlaubtUmbruch`, `minGroesse` sind **nicht** darunter. `tabelleEigenschaften.ts:5-52` (das Inspector-Schema der Tabelle) hat 7 Ja/Nein-Schalter + `tagField` + `leerText` — **keine** Spalten-Obergrenze.
**Nötig:** 2–3 optionale Felder in `BlockDefinition` + `BlockComponent` + `beschreibe()` (`BasicBlock.ts:23-66`) + ein Control. **Default bleibt 16** (Abschnitt 2.8).

### L2 — Spalten-Umbruch auf eine zweite Zeile
`tabelleAnsicht.ts:127-129` rechnet **eine** `gridTemplateColumns`. `tabelleKoerper.ts:178` zeichnet **eine** Kopfzeile, jede Zelle mit `grid-row: 1` (`:190`). Das `lineal` (`:148-160`) und die Erfassungszeile hängen am selben `cols`.
**Ein Umbruch berührt:** `tabelleAnsicht` (`cols`), `tabelleKoerper` (Kopf, Zeilen, Lineal, Erfassung), `tabelleStil.ts` (479 Z. CSS), `spaltenBreite.breitenGriffe` (Index-Mathematik), und **das exportierte HTML** → Referenzabzug Teil B.
**Erste Falle:** `tabelleKoerper.ts:180-183` — Kopfzelle *und* Greifstreifen müssen `grid-row` **beide** ausdrücklich nennen, sonst verteilt das Gitter die Zellen „in eine zweite Reihe". Das passierte bereits versehentlich.
→ **OFFEN-3**, erst entscheiden, dann bauen.

### L3 — Pfad-Selektion
`Editor.ts:228` `selectBlock(id: string | null)` — **eine** Id. Kein `[board, spalte, karte]`, kein „eine Ebene nach oben". `BlockHost.tsx:112` zeichnet genau einen Rahmen.
**Nötig für:** B4 (Board erreichbar machen, ohne Export-Änderung) und B5 (Rahmen der Muster-Karte).

### L4 — Kanban: Obergrenze, Scrollen, Mindestbreite
`KanbanBlock.ts:41-47` — kein `maxSpalten`. `:79-86` `.board` hat **kein** `overflow-x`. `KanbanSpalteBlock.ts:74-78` — `min-height:100%`, aber **kein** `min-width`.
**Nötig:** `maxSpalten` (1–8), `overflow-x: auto` ab der Grenze, `min-width: 220px` je Spalte. **Achtung:** `.board`-CSS steht in `KanbanBlock.ts:74-89` und **landet im Export** → Referenzabzug Teil B + Browser-Schranke (3.1, 2026-08-31).

### L5 — Listener-Disziplin in `datenAnschluss`
Siehe **B6**. Kein Bus nötig — drei Mechanismen existieren bereits (1.3).

### L6 — Auslaufmodell `defineAndRegister` + doppelte Anmeldung
```ts
BasicBlock.ts:117-122
// Faellt mit Schritt 12b weg, sobald jeder Baustein selbst `definiere` und
// jede `editorAngaben.ts` selbst `beschreibe` ruft.
static defineAndRegister(BlockClass) { definiere(...); beschreibe(...) }
```
**„Schritt 12b" steht aus.** Gleichzeitig rufen Bausteine `defineAndRegister` (`KanbanBlock.ts:106`, `CardBlock.ts:159`, `TabelleBlock.ts:722`) **und** es existiert je ein `editorAngaben.ts` (`src/blocks/kanban/editorAngaben.ts`, `src/blocks/card/editorAngaben.ts`, `src/blocks/tabelle/editorAngaben.ts`, `src/core/blocks/editorAngaben.ts`).
Wahrscheinliche Folge: `blockRegistry.ts:6-8` `console.warn(\`Block-Typ "${def.type}" wird ueberschrieben.\`)` schlägt an. **Nachweis:** Editor starten, Konsole beobachten.

---

## 6. SLOP-KLEINTEILE (belegt, klein, sicher zu beheben)

| Was | Wo | Beleg |
|---|---|---|
| **Doppelter Kommentarsblock**, beide Male mit kaputtem Deutsch *„Alles Ihre reist im Eintrag mit"* | `spaltenBearbeiten.ts:64-67` **und** `:69-72` | `grep -n "Eine Spalte an einen anderen Platz setzen"` → 2 Treffer |
| **Tote Funktion** `entferneSpalte` | `spaltenBearbeiten.ts:45-53` | **0** Verwendungen außerhalb der eigenen Datei; genutzt wird das reine `ohneSpalte` (`spaltenBindung.ts:27`) |
| **Tote Funktion** `verschiebeSpalteAn` | `spaltenBearbeiten.ts:87-96` | **0** Verwendungen; genutzt wird das reine `mitVerschobenerSpalte` (`spaltenBindung.ts:34`) |
| **Zerbrochene Zeilenformatierung** | `TabelleBlock.ts:643-648` | `hatSatzNummer(this),        loeschbar: this.loeschbar === 'ja'` — zwei Props auf einer Zeile, Einrückung verloren |
| **Überschreib-Warnung** in der Registry | `blockRegistry.ts:6-8` | `console.warn` statt Fehler — wahrscheinlich ausgelöst durch L6 |
| **3 rohe `<input>`** neben 103 Werkbank-Importen | `controls/BildControl.tsx:54`, `shell/Toolbar.tsx:222`, `zentrale/DatenquellenBereich.tsx:113` | prüfen, ob `Feld`/`Zahl` passt |
| **`CLAUDE.md`-Drift** | `CLAUDE.md:150-151` | behauptet einen Datencenter-Reiter; Code: `Inspector.tsx:208` |

---

## 7. NICHT ANFASSEN — was bereits richtig ist

Diese Liste ist **Schutz**, nicht Lob. Jeder Punkt ist belegt. Wer hier „aufräumt", baut Fertiges ab.

| Bereich | Zustand | Beleg |
|---|---|---|
| **Registry + Fähigkeiten** | 33 Felder, `treeQuery` stellt 9 Fähigkeitsfragen, **1** `if typ` in ganz `src/` | `BlockDefinition.ts:152-215`, `treeQuery.ts:87-196` |
| **`spaltenSicht` + `plaetze`** | implementiert, dokumentiert, **5 Tests** | `spalten.ts:40-82`, `spalten.test.ts:169-206` |
| **Zwei Zahlen-Leser** | `zahlStreng` (Tipp) + `alsZahl` (ERP/Anzeige), **beide getestet** | `rechnung.ts:68-78`, `sortierung.ts:3-19`, `erfassungsLauf.ts:113-131` |
| **Lücken-Rechnung** | genau eine Lücke → rechnen; `'fehler'` → nichts; Faktor 1; aufgerundet; **keine Warnung** | `rechnung.ts:103-140` |
| **Rechnung im Inspector** | `RechnungSektion`, Props `block`, `kannRechnen` als Registry-Frage | `Inspector.tsx:208`, `RechnungSektion.tsx:53`, `treeQuery.ts:193-196` |
| **Inspector-Reihenfolge** | Kacheln → Werte → Datenquellen/Felder → Auswahl folgen → Aktionen → Rechnung | `Inspector.tsx:156-216` |
| **Inspector-Trennung nach Form** | `jaNein` → Kachelwand, Rest → Zeile; bewusst so entschieden | `Inspector.tsx:129-135` |
| **Editor-Chrome nur im Host** | Rahmen, Leiste, Anfasser, Spalten-Bedienung, Picker — alle in `BlockHost.tsx` | `:112,138-157,159-202,72-82` |
| **Editor/Maske-Trennung** | 21 `data-ff-editor`-Wachen, eine zentrale Sperre | `datenAnschluss.ts:30` |
| **Gezogene Breite als Anteil** | `fr`-Raster, Summe erhalten, zwei Nachbarn je Zug, saubere Listener | `spalten.ts:206-229`, `spaltenBreite.ts:23-111` |
| **Spalten-Kennung** | dauerhafter Ausweis, Vergabe an einer Stelle, Verschieben ohne Nachziehen | `spalten.ts:4-12,118-129`, `spaltenBearbeiten.ts:69-85` |
| **Enter-Fluss + Korrektur** | Enter = neue Zeile (schreibt nichts), Tab = immer weiter, Korrektur an Ort und Stelle | `erfassungsBedienung.ts:83-109`, `erfassungsLauf.ts:178-198`, `tabelleKoerper.ts:109-143` |
| **Laufzeit-Verträge** | 4 Träger-Interfaces + Laufbericht, am Baustein delegiert | `BlockDefinition.ts:119-150`, `TabelleBlock.ts:246-278` |
| **Kanban-DnD** | natives HTML5, Zug- und Ziel-Markierung, Drop → `PUT_RELATION`, Fehler → Klartext | `seRuntime.ts:206-258,192-204` |
| **Kanban-Leerzustand** | Strich-Hinweis je Spalte **und** je Zimmer | `seRuntime.ts:56-66` |
| **Karte = Baustein/Vorlage/Klon** | dreistufig, absichtlich | `CardBlock.ts:19-29`, `exportMask.ts:114-118`, `seRuntime.ts:96-105` |
| **Export-Wurzel = Baum** | 7 Baum-Zugriffe, 2 Baum-Walks | `exportMask.ts:217-273`, `benutzteQuellen.ts:62`, `benutzteRelationen.ts:28` |
| **Werkbank** | 20 Teile, 103 Importe, 3 rohe Elemente | `src/ui/werkbank/` |
| **Undo/Redo** | Snapshot + Gestenklammer + Transaktionen | `Editor.ts:135-163`, `history.ts` |
| **State-Fächer** | 18 Module, Fassade 383 Zeilen | `src/state/` |
| **Prüfnetz** | 40 Test-Dateien, byte-bewachter Referenzabzug, Sichtprobe-Werkzeug | `export/referenzabzug.test.ts`, `tools/sichtprobe.cjs` |
| **Keine Demo-Daten** | Strich überall, Leerzustand ohne Quelle | `spalten.ts:87`, `kartenStil.ts:140-143`, `seitengroesse.ts:60-63` |

**Nicht geprüft — bitte nicht als „richtig" übernehmen:** `src/softengine/` (11 Dateien, `relations.ts` 409 Z.), `docs/chef-maske/`, `PLAN.md` (67 KB), `RECHNUNG-BELEGERFASSUNG.md` (13 KB), `tabelleStil.ts` (479 Z.), `erfassungsLauf.ts` außer `:100-215`, `zeilenBearbeitung.ts` (255 Z.), `erfassungsAnschluss.ts` (254 Z.), `ansichtsStand.ts` (175 Z.), `FormFeldBlock.ts` (519 Z.), `ladeKette.ts` (321 Z.), `migrationenRoh.ts` (11,5 KB). Siehe `docs/LESEPROTOKOLL.txt`.

---

## 8. ARBEITSREGELN

1. **`master` ist der einzige Branch.** Kein `main`, keine Umbenennung, kein Arbeits-Branch (`CLAUDE.md:34-36`).
2. **Vor jedem Schreiben lesen.** Wer eine Datei anfasst, die er nicht geöffnet hat, wird gestoppt.
3. **Doku ist Zeuge, nicht Beweis.** `CLAUDE.md:3-7` sagt es selbst; `CLAUDE.md:150-151` ist der belegte Gegenbeweis.
4. **Kein Wert wird „verbessert", ohne die Begründung im Code zu lesen.** `SPALTEN_MAX = 16` (`spalten.ts:91-97`), `ZEILEN_HOEHE = 28`, `SPALTEN_MIN_BREITE = 40`, `13.5px`, `240px`, `400px`, `2px`.
5. **Nichts wird als „neu" gebaut, bevor `grep` + `ls` geprüft haben, ob es existiert.** Abschnitt 7 ist die Kurzform; sie ersetzt das Prüfen nicht.
6. **Browser-Schranke.** Kein CSS im Export, das Chromium < 87 nicht kann. Kein `inset: 0`. Beleg: `spaltenBreite.ts:113-121` (Nutzer-Befund 2026-08-31).
7. **Export-Neutralität zuerst.** Jede Änderung an `src/blocks/**/styles`, `src/design/`, `tabelleStil.ts`, `kartenStil.ts`, `KanbanBlock.ts` ändert das Export-HTML → Referenzabzug **Teil B** mit Diff-Erklärung. Editor-only-Änderungen (`src/editor/`, `src/state/`, `src/ui/`) müssen **Teil A grün** lassen.
8. **Ein Chat ≤ 5k Tokens.** Was größer ist, wird geteilt — auch wenn ein Plan „nicht teilen" sagt. Ein abgebrochener Kontext mitten im Umbau ist der teuerste Fehler, und `master` hat keinen Rollback (B8).
9. **Erst der rote Test, dann der Fix.** Bei B1, B2, B3: der Test muss **rot** sein, bevor eine Zeile geändert wird. Sonst ist nicht bewiesen, dass der Bug existierte.
10. **Raten verboten.** Unklares → `OFFEN` + Nutzerfrage. Kein Wert wird erfunden, keine Datei wird „zur Sicherheit" neu angelegt.
11. **Historische Nummern nicht neu belegen** (3.2): `S1–S6`, `P1–P6`, `T1–T7`, `Etappe 0–4`, `Schritte 1–19`. Neue Schritte zählen ab **20**.

---

## 9. DEFINITION OF DONE (jeder Schritt)

```
 1. git fetch                                              CLAUDE.md:50
 2. npm run check              → Exit 0                    package.json (tsc -b && eslint src)
 3. npm run build:runtime      → Exit 0                    CLAUDE.md:38-42  ★ leicht vergessen
 4. npm test                   → grün
    Die Zahl darf GLEICH bleiben. „Muss steigen" gilt nur, wenn der Schritt
    ausdrücklich einen neuen Test verlangt — 19 Tabellen-Tests bewachen genau
    die Dateien, die hier angefasst werden.
 5. Referenzabzug                                           CLAUDE.md:43-49
    Teil A  OHNE REFERENZ_ERNEUERN  → muss grün BLEIBEN (export-neutrale Schritte)
    Teil B  mit REFERENZ_ERNEUERN=1 → Diff erklären
    Grenze: alles zwischen `window.FF_RELATIONS` und `</script>` ist Bündel,
            der Rest ist Maske.
 6. Sichtprobe: node tools/sichtprobe.cjs standard (Dev-Server Port 5300)
    → 9 Bilder nach sichtprobe/, JEDES EINZELN ansehen      CLAUDE.md:52-54
 7. Klickprobe des Schritts bestanden, mit Klickanleitung im Bericht
 8. Browser-Schranke geprüft: kein neues CSS < Chromium 87  ★ Regel 6
 9. 1 Commit, Klartext „Schritt NR — Ziel", Dateien NAMENTLICH gestagt
    (kein `git add -A`), kein force-push, nur master         CLAUDE.md:50-51
10. PLAN.md NÄCHSTER SCHRITT aktualisiert                    CLAUDE.md:20-22
11. Bericht in Klartext: was geht · was NICHT geprüft wurde · was OFFEN ist
    Keine Technik-Reviews, kein Cheerleading.                CLAUDE.md:15-17
```

---

## 10. DIE NÄCHSTEN SCHRITTE

> Reihenfolge ist Absicht. **Schritt 00 kommt zuerst**, weil `master` einen Commit hat (B8) — ab Schritt 21 gibt es ohne die Rettung keinen Rückweg. Danach kommt der **höchste Nutzen pro Token** (B2/B7), dann die **sichtbaren** Klagen (B4/B5), dann der **Funktions-Zuwachs** (L1/L2), dann Hygiene.

| Schritt | Ziel | Befund | Aufwand | Export |
|---|---|---|---|---|
| **00** | Geschichte retten, toten Branch löschen | B8 | 2–3k | neutral |
| **21** | Geister-Quelle bleibt aus dem Export | B2 + B7 | 2k | **Teil A muss grün bleiben** |
| **22** | Pfad-Selektion — jeder Container erreichbar | B4 + L3 | 4k | neutral |
| **23** | Muster-Karte: Rahmen ohne Werkzeug | B5 | 1–2k | neutral |
| **24** | `maxSpalten` am Baustein + stummes Abschneiden melden | L1 + B3 | 3k | neutral |
| **25** | Spalten-Umbruch | L2 | 4–5k | **Teil B + Diff** |
| **26** | Kanban: Obergrenze, Scrollen, Mindestbreite | L4 | 3k | **Teil B + Diff** |
| **27** | Hygiene: Listener, toter Code, doppelte Anmeldung, Doku-Drift | B6 + L6 + Slop | 2–3k | neutral |

**Summe: ~21–26k Tokens in 8 Chats, keiner über 5k.**

---

### SCHRITT 00 — Geschichte retten, dann den toten Branch löschen

**Ziel.** `master` hat einen Commit. Auf `arena/01a06afe-editoraufbauv3` liegen 139 Commits mit 25 datierten Nutzer-Entscheidungen (Abschnitt 3). Erst sichern, dann löschen — `CLAUDE.md:34-36` verlangt einen Branch, aber kein ungesichertes Löschen.
**Dateien.** `docs/historie/` (neu) · sonst nichts. **Kein Code.**

```
KONTEXT: EditorAufbauV3, Branch master. master hat GENAU EINEN Commit (cd94164).
Auf GitHub liegt ein zweiter Branch arena/01a06afe-editoraufbauv3 mit 139
Commits (25.08.-03.09.2026) und KEINEM merge-base zu master.
CLAUDE.md:34-36 verlangt: EIN Branch master, Halbfertiges nie als Branch.
AUFGABE, in dieser Reihenfolge:
1) git fetch origin; git branch -a; jede Abweichung von "nur master" auflisten.
2) Alle 139 Commit-Messages sichern nach docs/historie/CHRONIK.md:
   git log --reverse --format='%h|%ci|%s' origin/arena/01a06afe-editoraufbauv3
3) docs/historie/NUTZER-ENTSCHEIDUNGEN.md anlegen aus docs/GRUNDLAGE.md
   Abschnitt 3. Jede Entscheidung gegen den CODE pruefen. Abweichung als
   DOKU-DRIFT markieren. Bekannt und zu bestaetigen: CLAUDE.md:150-151 sagt,
   die Rechnung sei ein Datencenter-Reiter - der Code hat sie laengst im
   Inspector (src/editor/inspector/RechnungSektion.tsx, Inspector.tsx:208).
4) docs/historie/NUMMERIERUNG.md: die historischen Nummern S1-S6 (Sanierung),
   P1-P6 (Reparatur), T1-T7 (Tabellen-Umbau), Etappe 0-4, Schritte 1-19 mit je
   einem Satz. Zweck: neue Arbeit darf diese Nummern NICHT neu belegen;
   neue Schritte zaehlen ab 20.
5) SICHERN: git tag archiv/vor-squash-139 origin/arena/01a06afe-editoraufbauv3
   und git push origin archiv/vor-squash-139. Tag-Existenz beweisen.
   (Ein Tag ist kein Branch und verletzt CLAUDE.md:34-36 nicht.)
6) ERST NACH BEWEIS von 5: git push origin --delete arena/01a06afe-editoraufbauv3
7) docs/GRUNDLAGE.md und docs/LESEPROTOKOLL.txt mitcommitten.
VERBOTEN: src/ anfassen. Irgendetwas fixen. master umschreiben. force-push.
Loeschen bevor Schritt 5 bewiesen ist.
PRUEFUNG: git status sauber; git branch -a zeigt nur master; Tag ist gepusht;
docs/historie/ hat 3 Dateien. Der Editor muss sich EXAKT gleich verhalten -
das ist der Beweis, dass nichts angefasst wurde.
Bericht in Klartext: was gesichert ist, was geloescht wurde, welche DOKU-DRIFT
gefunden wurde. Raten verboten - Unklares als OFFEN + Nutzerfrage.
```

---

### SCHRITT 21 — Geister-Quelle bleibt aus dem Export

**Ziel.** B2 + B7. **Dateien.** `src/export/benutzteQuellen.ts` · `benutzteQuellen.test.ts` · `exportMask.ts` · `sevariablen.ts` (nur lesen) · `CLAUDE.md:150-151`

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md, Abschnitte 1.4,
2.1 und die Befunde B2 und B7. Schritt 00 ist erledigt.
BEFUND, mit Zeilen - erst selbst nachlesen, dann handeln:
(a) src/export/benutzteQuellen.ts:192   for (const source of sources)
    -> iteriert die GANZE Bibliothek. Dasselbe Thema 120 Zeilen hoeher,
       benutzteQuellen.ts:68-70, iteriert korrekt `acc` (baumgefiltert).
(b) src/export/exportMask.ts:213,215    sources = dataSourceStore.list,
                                        relations = relationStore.list
    -> Standardparameter aus Modul-Singletons machen exportMask unrein.
Die Export-WURZEL ist bereits der Baum (exportMask.ts:217-238,
benutzteQuellen.ts:62, benutzteRelationen.ts:28). Sie muss NICHT neu gebaut
werden. Es gibt genau EINEN Leck-Pfad: Zeile 192.
AUFGABE:
1) ERST den Bug beweisen: Test in src/export/benutzteQuellen.test.ts -
   Geist-Quelle der Art "Wert per Relation" anlegen, NICHT in den Baum haengen,
   exportieren. Der Test MUSS zuerst ROT sein. Kein Fix vor dem roten Beweis.
2) benutzteQuellen.ts:192 auf die baumgefilterte Menge umstellen, analog :68-70.
   Den Kommentar dort anpassen - er erklaert heute, warum die ganze Bibliothek
   gelesen wird, und das bleibt nur fuer die Parameter-Aufloesung richtig.
3) LESEN: src/export/sevariablen.ts (97 Zeilen). Feststellen, ob baueSevariablen
   ueber `used` oder ueber die Feld-Map iteriert. Ergebnis in den Bericht.
   Ist es die Map, ist Punkt 2 der eigentliche Fix; ist es `used`, ist er
   Hygiene - und der Test bleibt trotzdem richtig.
4) exportMask.ts:213,215 - Standardparameter entfernen, sources und relations
   werden PFLICHT. Alle Aufrufer anpassen (grep "exportMask("). Danach darf
   src/export/ keinen Store-Import mehr haben: grep -rn "from '.*state" src/export
5) CLAUDE.md:150-151 korrigieren (DOKU-DRIFT aus Schritt 00).
VERBOTEN: SE-Kontrakte aus CLAUDE.md:101-144 anfassen (LF-only, ASCII, Kopfsatz
zuletzt via loopReihenfolge, pindex, Tabellen-Praefixe, Relation 69 seriell,
1 GET in Flug, leere Antwort = Antwort). Baum-Wurzel neu erfinden. Export
"deterministisch sortieren" - exportMask.ts:191 nutzt childIds-Reihenfolge,
Sortieren bricht den byte-bewachten Referenzabzug. Validator fachlich erweitern
(CLAUDE.md:86-87: er blockt NUR bei Dateiform).
PRUEFUNG: Definition of Done aus docs/GRUNDLAGE.md Abschnitt 9, Punkte 1-11.
Referenzabzug TEIL A muss gruen BLEIBEN. Wird er rot, war die Geist-Quelle real
in der Referenzmaske - dann den Diff Zeile fuer Zeile erklaeren.
KLICKPROBE: Datencenter -> Datenquelle der Art "Wert per Relation" anlegen ->
NICHT auf den Canvas ziehen -> exportieren -> in index.basis.SEvariablen.json
darf KEIN SEFILELOOP-Eintrag dieser Quelle stehen. Gegenprobe: dieselbe Quelle
auf den Canvas ziehen -> der Eintrag MUSS erscheinen.
1 Commit "Schritt 21 - Geister-Quelle bleibt aus dem Export", namentlich
gestagt, kein force, nur master.
Bericht Klartext: war der Test rot, ist er gruen, was steht in sevariablen.ts,
was konnte NICHT geprueft werden. Raten verboten.
```

---

### SCHRITT 22 — Pfad-Selektion: jeder Container ist erreichbar

**Ziel.** B4 + L3. **Dateien.** `src/state/Editor.ts` · `src/state/selectionOps.ts` · `src/editor/canvas/BlockHost.tsx` · `CanvasNode.tsx` · `AuswahlLeiste.tsx` · Tests
**Vorbedingung.** OFFEN-1 beantwortet.

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md Abschnitte 1.2,
2.10 und Befund B4.
BEFUND, mit Zeilen - die Ursache ist GEOMETRIE, nicht ein zu kleiner Griff:
  src/blocks/kanban/KanbanBlock.ts:23        lockedWidth = 'fill'
  src/blocks/kanban/KanbanBlock.ts:79-87     .board { display:flex; gap } / slot{display:contents}
  src/blocks/kanban/KanbanSpalteBlock.ts:37  lockedWidth = 'fill'
  src/editor/canvas/BlockHost.tsx:101-116    der ganze Host-Div ist Klickflaeche
Bei EINER Spalte fuellt die Spalte 100% der Board-Breite; `gap` wirkt nur
ZWISCHEN Flex-Kindern. Jeder Klick trifft den Spalten-Host, nie den Board-Host.
Der Spaltenkopf ist laengst hoeher als 28px (KanbanSpalteBlock.ts:97-103,
padding 10px 12px) - eine min-height aendert NICHTS. Er gehoert ausserdem zur
SPALTE, nicht zum Board. Es gibt auch keinen Breiten-Griff zum Verfehlen:
resizableWidth ist false (KanbanSpalteBlock.ts:38, KanbanBlock.ts:24).
Ausserdem fehlt jede Pfad-Selektion: src/state/Editor.ts:228 selectBlock(id|null)
kennt EINE Id, keinen Pfad.
AUFGABE:
1) Auswahl als PFAD speichern: readonly string[] von der Wurzel zum Ziel.
   Editor.ts:228 selectBlock und :234 waehleGetroffenen entsprechend,
   src/state/selectionOps.ts mitziehen. selectedNode bleibt kompatibel.
2) Eine Ebene nach oben per Escape UND per Klick auf den sichtbaren
   Rahmen-Rest. Das Board muss erreichbar sein OHNE leeren Raum.
3) GENAU EIN Rahmen auf der tiefsten gewaehlten Ebene. Eltern bekommen eine
   duenne Pfad-Markierung (outline-width 1px, anderer outlineOffset), keine
   zweite volle Kontur.
4) AuswahlLeiste.tsx zeigt den Pfad (z.B. "Kanban > Offen > Muster") und bietet
   "nach oben". Die Leiste sucht weiter ihren Platz (lageFuer, :40-53) und liegt
   NIE ueber Inhalt.
5) Undo/Redo und Speichern/Laden muessen mit dem Pfad weiter funktionieren
   (state/history.ts, state/persistence.ts). selectedId bleibt der Anker.
DATEIEN, die angefasst werden duerfen: src/state/Editor.ts,
src/state/selectionOps.ts, src/editor/canvas/BlockHost.tsx,
src/editor/canvas/CanvasNode.tsx, src/editor/canvas/AuswahlLeiste.tsx, Tests.
VERBOTEN: src/blocks/** anfassen. Der Export darf sich NICHT aendern -
Referenzabzug Teil A MUSS gruen bleiben. Kein data-ff-auswahl im Editor: das
Attribut gehoert der MASKE (datenAnschluss.ts:30 blockt den Editor, einziger
Setter kanban/seRuntime.ts:153) - Abschnitt 2.10. Kein min-height:28px. Kein
.board-Padding, keine Board-Titelzeile - beides aendert das Export-HTML.
Kein CSS, das Chromium < 87 nicht kann (Regel 6).
PRUEFUNG: Definition of Done Punkte 1-11. Referenzabzug Teil A gruen.
KLICKPROBE, alle sechs:
1 Kanban mit EINER Spalte -> Board waehlbar per Escape / Rahmen-Rest / Pfadleiste.
2 Klick auf Karte -> EIN Rahmen um die Karte, Pfad zeigt Kanban>Spalte>Karte.
3 Klick auf Spaltentitel -> Rahmen um die Spalte, Pfad zeigt Kanban>Spalte.
4 Nie zwei volle Rahmen gleichzeitig.
5 Bei 3 Spalten verhaelt sich alles exakt wie vorher.
6 Undo/Redo ueber Auswahlwechsel, Speichern und Neuladen behaelt die Auswahl.
1 Commit "Schritt 22 - Pfad-Selektion: jeder Container ist erreichbar".
Bericht Klartext mit Klickanleitung. Raten verboten.
```

---

### SCHRITT 23 — Muster-Karte: Rahmen ohne Werkzeug

**Ziel.** B5. **Vorbedingung.** OFFEN-2 beantwortet; Schritt 22 erledigt (Pfad vorhanden).

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md Befund B5 und
Abschnitt 2.10.
BEFUND: src/editor/canvas/BlockHost.tsx:98 liest templateMarkFor(block.id),
:149 unterdrueckt fuer Template-Kinder die LEISTE (!templateMark), aber :112
zeichnet den RAHMEN immer - templateMark kommt dort nicht vor.
Ergebnis: eine blau-violette Kontur (--wb-auswahl: 246 60% 56%, src/index.css:31)
um die Kanban-Musterkarte (KanbanBlock.ts:28 templateChild) ohne einen Knopf.
Die Karte ist eine VORLAGE, kein Daten-Baustein.
AUFGABE: die in OFFEN-2 gewaehlte Variante umsetzen.
VERBOTEN: src/blocks/card/kartenStil.ts:31-34 loeschen oder aendern - das ist
die Laufzeit-Auswahl der FERTIGEN MASKE (tuerkis, --se-accent) und kann im
Editor gar nicht gesetzt werden (datenAnschluss.ts:30). Kein data-ff-auswahl
in den Editor holen. src/blocks/** nicht anfassen.
PRUEFUNG: Definition of Done Punkte 1-11. Referenzabzug Teil A gruen.
KLICKPROBE: 1 Kanban-Musterkarte anklicken -> keine blaue Kontur mehr ohne
Werkzeug. 2 Fertige Maske: ausgewaehlte Karte bleibt tuerkis markiert.
3 Editor 2x bauen -> byte-gleich.
1 Commit "Schritt 23 - Muster-Karte: Auswahl sagt, was sie meint".
```

---

### SCHRITT 24 — `maxSpalten` am Baustein + stummes Abschneiden melden

**Ziel.** L1 + B3. **Dateien.** `src/core/blocks/BlockDefinition.ts` · `BlockComponent.ts` · `src/blocks/base/BasicBlock.ts` (nur `beschreibe`) · `src/blocks/tabelle/spalten.ts` · `spaltenBindung.ts` · `tabelleEigenschaften.ts` · `src/editor/inspector/controls/` · Tests

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md Abschnitte 1.1,
2.1, 2.8 und die Befunde L1 und B3.
BEFUND L1: grep -rn "maxSpalten|erlaubtUmbruch" src -> 0 Treffer. Es gibt nur
die GLOBALE Konstante src/blocks/tabelle/spalten.ts:98 SPALTEN_MAX = 16.
BlockDefinition.ts:152-215 hat 33 Felder, maxSpalten ist nicht darunter.
tabelleEigenschaften.ts:5-52 hat 7 Ja/Nein-Schalter + tagField + leerText.
BEFUND B3: spalten.ts:191 in coerceSpalten wirft Spalten ueber 16 STUMM weg
(arr.slice). Das bricht CLAUDE.md:85-86 ("Nichts scheitert still") und
spalten.ts:40-46 (Plaetze verrutschen -> stumm falsche Werte ins ERP).
Gegenbild im selben Repo: spaltenBindung.ts:21-24 macht dieselbe Grenze
SICHTBAR - der Plus-Knopf wird disabled (AuswahlLeiste.tsx:81,106).
AUFGABE:
1) BlockDefinition um ZWEI optionale Felder erweitern: maxSpalten?: number und
   erlaubtUmbruch?: boolean. In core/blocks/BlockComponent.ts spiegeln, in
   blocks/base/BasicBlock.ts beschreibe() (:23-66) durchreichen.
   NICHTS Bestehendes umbenennen oder umsortieren - 23 Felder werden dort
   uebernommen, die Reihenfolge ist Teil des Vertrags.
2) Tabelle: maxSpalten Default 16 (NICHT weniger - spalten.ts:91-97 ist eine
   begruendete Entscheidung: eine Belegposition braucht allein sieben Spalten).
   Im Inspector einstellbar, Grenze SPALTEN_MIN = 1 (spalten.ts:89).
3) spalten.ts:191 nach der Entscheidung in OFFEN-5 entschärfen: melden statt
   stumm schneiden, und die vollen PLAETZE erhalten. Meldung ueber
   state/meldungen.ts in den Fehlerbalken, Klartext, keine Technik.
4) spaltenBindung.ts:21-24 eintragNeu zieht den PRO-BLOCK-Wert statt der
   globalen Konstante. Der Plus-Knopf bleibt sichtbar disabled.
5) Kanban bekommt maxSpalten in Schritt 26, hier NICHT anfassen.
VERBOTEN: spaltenSicht (spalten.ts:58-82) neu schreiben - 5 Tests bewachen sie
(spalten.test.ts:169-206). SPALTEN_MAX senken. alsZahl oder zahlStreng anfassen
(Abschnitt 2.4 - beide sind korrekt und getestet). rechnung.ts:103-140 anfassen
(Abschnitt 2.5). Den Enter-Fluss anfassen (erfassungsBedienung.ts:83-109).
 Gezogene Breite neu rechnen (spaltenBreite.ts:23-39,73-83).
PRUEFUNG: Definition of Done Punkte 1-11. Referenzabzug Teil A gruen (kein
Export-CSS betroffen). Neue Tests: maxSpalten pro Block greift; coerceSpalten
mit 17 Spalten meldet und verwirft keine Plaetze; eintragNeu respektiert den
Block-Wert.
KLICKPROBE: 1 Tabelle anlegen, Spalten bis 16 anfuegen -> Plus wird disabled.
2 maxSpalten im Inspector auf 10 stellen -> Plus wird bei 10 disabled.
3 Eine Maske mit 17 Spalten laden -> Klartext-Meldung im Fehlerbalken, keine
still verschwundenen Spalten. 4 Gezogene Breiten bleiben exakt.
1 Commit "Schritt 24 - Spalten-Obergrenze am Baustein, keine stille Kuerzung".
```

---

### SCHRITT 25 — Spalten-Umbruch

**Ziel.** L2. **Vorbedingung.** OFFEN-3 beantwortet; Schritt 24 erledigt (`erlaubtUmbruch` existiert). **Export-Änderung → Referenzabzug Teil B.**

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md Abschnitte 2.1,
2.3, 2.7 und Befund L2.
BEFUND: tabelleAnsicht.ts:127-129 rechnet EINE gridTemplateColumns.
tabelleKoerper.ts:178 zeichnet EINE Kopfzeile, jede Zelle mit grid-row: 1
(:190). Lineal (:148-160) und Erfassungszeile haengen am selben cols.
ERSTE FALLE, tabelleKoerper.ts:180-183 im Original:
"Kopfzelle und Greifstreifen nennen ihren Platz im Gitter BEIDE ausdruecklich
(grid-row/grid-column). Sonst verteilt das Gitter die Zellen um die von den
Streifen belegten Plaetze herum - in eine zweite Reihe."
Das ist bereits einmal versehentlich passiert.
AUFGABE: die in OFFEN-3 gewaehlte Variante umsetzen.
HARTER RAHMEN, nicht verhandelbar:
- spaltenSicht.plaetze bleibt die Rueckabbildung auf den VOLLEN Platz.
  Ketten-Parameter (exportMask.ts:84-93), Rechnung (spalteMitKennung) und
  datenzeilen duerfen sich NICHT verschieben (spalten.ts:40-46, CLAUDE.md:95-99).
- Gezogene Breiten bleiben ANTEILE (fr) und ueberleben den Umbruch
  (spalten.ts:206-229, spaltenBreite.ts:23-39,73-83). Neu verteilt wird NUR,
  wo nie gezogen wurde.
- SPALTEN_MIN_BREITE = 40 bleibt (spalten.ts:100-102).
- erlaubtUmbruch ist default AUS, sonst aendert sich das Export-HTML jeder
  bestehenden Maske.
- Kein CSS, das Chromium < 87 nicht kann (Regel 6). Das gilt besonders fuer
  grid und fuer die Greifstreifen (spaltenBreite.ts:113-136).
DATEIEN: tabelleAnsicht.ts, tabelleKoerper.ts, tabelleStil.ts,
spaltenBreite.ts (Index-Mathematik), spalten.ts, TabelleBlock.ts, Tests.
PRUEFUNG: Definition of Done Punkte 1-11. Referenzabzug TEIL B mit
REFERENZ_ERNEUERN=1 und Zeile-fuer-Zeile-Diff-Erklaerung. Zusaetzlich: Export
gegen docs/chef-maske/BeispielBeleg.html vergleichen.
Neue Tests: Umbruch verschiebt KEINEN Platz (plaetze-Assert); gezogene Breite
ueberlebt den Umbruch; Erfassung ueber den Umbruch hinweg (Enter, Luecke,
Ketten-Parameter) unveraendert.
KLICKPROBE: 1 erlaubtUmbruch AUS -> exakt wie vorher, Referenzabzug Teil A gruen.
2 erlaubtUmbruch AN, maxSpalten 6, 7 Spalten -> die 7. bricht um, kein Quetschen.
3 Eine Spaltenbreite ziehen -> nur die zwei Nachbarn aendern sich
  (spaltenBreite.ts:23-27). 4 Erfassung ueber den Umbruch: Enter legt eine neue
  Zeile an, die Luecken-Rechnung rechnet weiter, Ketten-Parameter stimmen.
5 10-spaltige Belegtabelle: alle gezogenen Breiten bleiben exakt.
1 Commit "Schritt 25 - Spalten-Umbruch".
```

---

### SCHRITT 26 — Kanban: Obergrenze, Scrollen, Mindestbreite

**Ziel.** L4. **Export-Änderung → Referenzabzug Teil B.**

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md Abschnitte 2.9
und 2.10, Befund L4 und Regel 6.
BEFUND: KanbanBlock.ts:41-47 hat kein maxSpalten. :79-86 .board hat kein
overflow-x. KanbanSpalteBlock.ts:74-78 hat min-height:100%, aber kein min-width.
AUFGABE:
1) maxSpalten fuer Kanban: 1-8, default aus OFFEN-6. addChildButton ("Spalte",
   KanbanBlock.ts:26) wird an der Grenze sichtbar disabled - derselbe Weg wie
   bei der Tabelle (spaltenBindung.ts:21-24, AuswahlLeiste.tsx:81,106).
2) Ab der Grenze: overflow-x auto auf .board (KanbanBlock.ts:79-86).
3) min-width 220px je Spalte (KanbanSpalteBlock.ts:74-78).
4) Die DREI Ebenen bleiben: Board -> Spalte -> ZIMMER -> Karte. KanbanZimmerBlock,
   zimmerField und zielZimmer (kanban/seRuntime.ts:46-54,73-84) sind TEIL des
   Vertrags und duerfen nicht als toter Code geloest werden.
VERBOTEN: die Karte zum "Nicht-Baustein" machen. Sie IST ein Baustein im Editor,
ein <template data-ff-template> im Export (exportMask.ts:114-118) und ein Klon
zur Laufzeit (seRuntime.ts:96-105,121) - Abschnitt 2.9. Drag & Drop neu bauen:
es ist fertig (seRuntime.ts:206-258, Drop -> PUT_RELATION ueber
handleDrop:192-204). Leerzustand neu bauen: er ist fertig (seRuntime.ts:56-66).
data-ff-auswahl in den Editor holen (Abschnitt 2.10). Tabellen-Code anfassen.
Ein Drag-Framework einfuehren - natives HTML5 reicht und ist da.
PRUEFUNG: Definition of Done Punkte 1-11. Referenzabzug TEIL B mit
Diff-Erklaerung - .board-CSS steht in KanbanBlock.ts:74-89 und LANDET IM EXPORT.
Browser-Schranke ausdruecklich pruefen: overflow-x und min-width muessen im
SoftEngine-Browser funktionieren (Regel 6).
KLICKPROBE: 1 Spalten bis zum Default anfuegen -> Plus wird disabled.
2 Eine Spalte darueber -> Board scrollt, Spalten bleiben >= 220px.
3 Karte in eine andere Spalte ziehen -> Status wird geschrieben (PUT_RELATION).
4 Zimmer bleiben bedienbar. 5 Maske im SoftEngine-Browser oeffnen -> scrollen
   funktioniert, nichts ist abgeschnitten.
1 Commit "Schritt 26 - Kanban: Obergrenze, Rollen, Mindestbreite".
```

---

### SCHRITT 27 — Hygiene

**Ziel.** B6 + L6 + Abschnitt 6.

```
KONTEXT: EditorAufbauV3, Branch master. Lies docs/GRUNDLAGE.md Befunde B6 und
L6 sowie Abschnitt 6 (Slop-Kleinteile).
AUFGABE:
1) datenAnschluss.ts:49-51 - disconnect muss die von verdrahte() gesetzten
   Listener entfernen. Kanban setzt SECHS (seRuntime.ts:210-257).
   Vorbild im selben Repo: spaltenBreite.ts:65-71 aufraeumen() und
   TabelleBlock.ts:517-524 disconnectedCallback.
2) datenAnschluss.ts:34-44 - die globalen Horcher (onSeDaten, aufTagHoeren,
   aufAuswahlHoeren, verdrahteHolendeQuellen) werden nie abgemeldet, bootSe()
   laeuft bei jedem connect. Erst feststellen ob Absicht, Ergebnis in den
   Bericht (OFFEN-7). Nicht eigenmaechtig umbauen.
3) Toter Code: spaltenBearbeiten.ts:45-53 entferneSpalte und :87-96
   verschiebeSpalteAn haben je 0 Verwendungen - genutzt werden die reinen
   ohneSpalte und mitVerschobenerSpalte. Vor dem Loeschen mit grep beweisen.
4) Doppelter Kommentarsblock spaltenBearbeiten.ts:64-72, beide Male mit
   kaputtem Deutsch "Alles Ihre reist im Eintrag mit" - zu einem Block
   zusammenfassen und sprachlich richten.
5) TabelleBlock.ts:643-648 - zerbrochene Zeilenformatierung
   ("hatSatzNummer(this),        loeschbar:").
6) BasicBlock.ts:117-122 "Schritt 12b": doppelte Anmeldung aufloesen. Jeder
   Baustein ruft definiere selbst, jede editorAngaben.ts beschreibe selbst.
   Nachweis: blockRegistry.ts:6-8 console.warn("wird ueberschrieben") darf
   beim Editorstart NICHT mehr anschlagen.
7) Die 3 rohen <input> pruefen: controls/BildControl.tsx:54,
   shell/Toolbar.tsx:222, zentrale/DatenquellenBereich.tsx:113. Werkbank hat 20
   Teile und 103 Importe - nur nachziehen, kein Umbau.
8) CLAUDE.md gegen den Code pruefen und jede DOKU-DRIFT berichtigen.
VERBOTEN: einen VIERTEN Ereignis-Mechanismus einfuehren. Es gibt drei:
state/Subject.ts, DOM-CustomEvent (BasicBlock.ts:104-108, TabelleBlock.ts:461-469)
und blockEvents/runEvent (Registry + seAktionen.ts). src/core/events.ts zu bauen
ohne zu sagen, was mit den dreien geschieht, vermehrt die Unordnung.
"State-Faecher trennen" - sie sind getrennt (src/state/, 37 Dateien,
CLAUDE.md:62-64 listet neun). Undo/Redo neu bauen - es ist da
(Editor.ts:135-163, history.ts). Features. Umbenennen zum Spass.
PRUEFUNG: Definition of Done Punkte 1-11. Referenzabzug Teil A gruen.
Sichtprobe 9/9. Undo/Redo ueber alles. Fehlerbalken in Klartext.
Editor 2x bauen -> byte-gleich.
1 Commit "Schritt 27 - Hygiene: Listener, toter Code, eine Anmeldung".
```

---

## 11. OFFEN — Entscheidungen des Nutzers

**Nichts davon wird geraten.** Jeder Punkt blockiert einen bestimmten Schritt.

**OFFEN-1 · Board erreichbar machen — welcher Weg?** → blockiert **Schritt 22**
(a) **Pfad-Navigation** mit `Escape` und Klick auf den Rahmen-Rest. **Export-neutral.** Empfehlung.
(b) Eigene Board-Titelzeile. Ändert das Export-HTML → Referenzabzug Teil B, **sichtbar in der fertigen Maske**.
(c) `.board`-Padding als Griffzone. Ebenfalls Export-Änderung.

**OFFEN-2 · Muster-Karte — was soll passieren?** → blockiert **Schritt 23**
(a) Rahmen für Template-Kinder auf eine dünne Pfad-Markierung reduzieren.
(b) Muster-Karten gar nicht direkt wählbar — Auswahl nur über den Pfad.
(c) Rahmen behalten, aber die Leiste zulassen (dann ist die Karte wie jeder Baustein bedienbar).

**OFFEN-3 · Spalten-Umbruch — wie genau?** → blockiert **Schritt 25**
(a) Zweite **Kopfzeile** — die Spalten laufen in zwei Reihen weiter.
(b) Zweite **Datensatz-Zeile** — ein Datensatz belegt zwei Zeilen.
(c) Horizontal **scrollen** statt umbrechen (wie Kanban in Schritt 26).
Zusätzlich: soll `erlaubtUmbruch` für bestehende Masken **aus** bleiben (export-neutral) oder eingeschaltet werden?

**OFFEN-4 · `sevariablen.ts` — wer iteriert?** → gehört zu **Schritt 21**, wird dort gelesen
Iteriert `baueSevariablen` über `used` (baumgefiltert) oder über die Feld-Map? Bestimmt, ob B2 ein akuter Bug oder nur Hygiene ist. **In dieser Grundlage nicht gelesen.**

**OFFEN-5 · `spalten.ts:191` — abschneiden oder melden?** → blockiert **Schritt 24**
(a) Nicht schneiden, sondern `meldeFehler` in Klartext und **alle** Plätze erhalten. Empfehlung.
(b) Schneiden **und** melden.
(c) `SPALTEN_MAX` ganz aufheben — dann braucht der Plus-Knopf eine andere Grenze (`spalten.ts:96-97`: *„Die Grenze bleibt, damit der Plus-Knopf irgendwo aufhoert"*).

**OFFEN-6 · Kanban `maxSpalten` — welcher Default?** → blockiert **Schritt 26**
`raster.startW: 24` (`KanbanBlock.ts:47`) legt eine breite Fläche nahe. 8 ist der natürliche Wert, aber **nicht belegt**. Kein Raten — bitte ansagen.

**OFFEN-7 · `datenAnschluss` — Absicht oder Leck?** → gehört zu **Schritt 27**
In der fertigen Maske leben alle Elemente seitenlang, praktisch folgenlos. Als Regel trotzdem falsch (B6). **Bug oder bewusste Vereinfachung?**

**OFFEN-8 · `PLAN.md` (67 KB) — prüfen?**
`CLAUDE.md:20-22` nennt sie „den EINEN Plan" mit Zielbild, Rahmen und Schritt-Zeiger. **In dieser Grundlage nicht gelesen.** Vermutung: weitere DOKU-Drift wie `CLAUDE.md:150-151`. Aufwand ~4–6k.

**OFFEN-9 · `src/softengine/` + `docs/chef-maske/` — prüfen?**
Die SE-Kontrakte aus `CLAUDE.md:101-144` sind als **Dokument** übernommen, nicht gegen `relations.ts` (409 Z.), `bridge`, `data`, `relationLader` geprüft und nicht gegen die echten Masken in `docs/chef-maske/`. **Solange das nicht geschehen ist, gilt: die Kontrakte nicht anfassen.** Aufwand ~5–7k.

---

## 12. KURZFASSUNG FÜR EILIGE

**Der Code ist disziplinierter als sein Ruf.** Registry mit 33 Fähigkeitsfeldern und 9 Registry-Fragen statt Typnamen (1 `if typ` in 36.988 Zeilen). Werkbank mit 20 Teilen und 103 Importen. `spaltenSicht` mit Platz-Rückabbildung und 5 Tests. **Zwei** Zahlen-Leser — Tipp streng, ERP tolerant — beide getestet. Lücken-Rechnung exakt nach Vertrag. Editor-Chrome ausschließlich im Host. 21 Editor-Wachen. 40 Test-Dateien. Byte-bewachter Referenzabzug.

**Kaputt sind 7 Dinge** (B1–B7), und **kein einziges** davon ist im Editor sichtbar:
B1 wirkt nur in der fertigen Maske, B2 nur im Export, B3 nur beim Laden fremder Masken, B4 nur bei genau einer Kanban-Spalte, B5 nur an der Muster-Karte, B6 praktisch gar nicht, B7 nur als Flaky-Risiko.
Dazu **B8**: `master` hat einen Commit, die Geschichte hängt an einem zweiten Branch.

**Es fehlen 6 Dinge** (L1–L6), alle klein und klar umrissen.

**Was am meisten schadet, ist nicht der Code, sondern dass fünf Arbeiten nacheinander Pläne geschrieben haben, die nicht gegen den Code geprüft wurden.** Abschnitt 7 existiert, damit das nicht wieder passiert.
