# Auftrag: Rechnen in der Belegerfassung (Tierarzt-Maske)

Diese Datei ist eine Übergabe an einen anderen Chat. Sie ist selbsttragend —
alles Nötige steht hier. Stand: 2026-08-31.

## 1. Was der Bediener tun soll

Ein Tierarzt hat eine Menge Medikament da und will wissen, für wie viele Tiere
das reicht.

Er wählt in der Erfassungszeile den **Artikel**, wählt die **Tierart**, tippt
sein **Tiergewicht** und die **Abgabemenge** — und lässt **Anzahl Tiere leer**.
Die Maske füllt es.

Der umgekehrte Fall kommt auch vor, aber selten: er tippt die Anzahl und lässt
die Abgabemenge leer, dann wird die gerechnet.

## 2. Die Rechnung

```
Abgabemenge = Anzahl Tiere x Behandlungsmenge x (Gewicht / Koerpergewicht) x Behandlungstage
```

Nach Anzahl aufgelöst (der Hauptfall):

```
Anzahl Tiere = Abgabemenge / ( Behandlungsmenge x (Gewicht / Koerpergewicht) x Behandlungstage )
```

Nur `x` und `/`. Kein Plus, kein Minus, keine Klammern über das hier Gezeigte
hinaus. Deshalb ist die Umkehrung dieselbe Art Rechnung — es braucht **keinen
Formel-Löser**.

**Ist `Koerpergewicht` in der Dosierzeile leer, fällt die Klammer auf 1.** Dann
gilt die Behandlungsmenge pro TIER statt pro kg. Das steht in den Daten, es ist
**keine** Einstellung und **kein** Schalter.

Durchgerechnetes Beispiel (echte Zeile aus der Kundendatei):
Baytril 5 %, `Behandlungsmenge` 5, `Koerpergewicht` 50, `Behandlungsdauer` 5.
Rind mit 450 kg: 450/50 = 9 Portionen, x 5 ml = 45 ml pro Tag, x 5 Tage = 225 ml
pro Tier. Bei 5000 ml Vorrat: 5000/225 = 22,2 -> **23 Tiere** (aufgerundet).

## 3. Die Regel: gerechnet wird die LÜCKE

- **Genau ein Platz ohne Wert -> der wird gerechnet.** Egal welcher.
- **Zwei oder mehr leer -> nichts passiert.** Keine Meldung, keine geratene Zahl.
- **Alle voll -> nichts wird überschrieben.**
- **Getippt und aus einer Datenquelle gefüllt gilt gleich: gegeben.**
- Ändert sich ein gegebener Wert, rechnet **dieselbe** Lücke neu.
- Tippt der Bediener in die gerechnete Zelle, ist sie ab dann gegeben und die
  Rechnung schweigt — bis er sie wieder leert.
- **Gebuchte Zeilen rechnen nie.** Was im ERP steht, steht im ERP.

Es gibt also **keinen** Schalter „diese Spalte ist das Ergebnis" und keinen
Modus-Umschalter. Das leere Feld ist die Anweisung.

## 4. Runden

Je Platz einstellbar: **Nachkommastellen** und **Richtung** (auf / ab /
kaufmännisch).

- `Anzahl Tiere`: 0 Stellen, **aufrunden** (Nutzer-Entscheidung 2026-08-31).
- `Gewicht / Koerpergewicht` wird **nicht** gerundet — 460/50 = 9,2 bleibt 9,2.
  Aufrunden hieße mehr Medikament geben; das entscheidet keine Maske.
  (Annahme, vom Kollegen des Nutzers noch nicht bestätigt.)

**Gerundet wird NICHT zurückgerechnet.** Aus 22,2 wird 23 Tiere, und die
eingegebene Abgabemenge bleibt bei 5000 — sie wird nicht auf 5175 „korrigiert",
damit die Rechnung aufgeht. Der Rest bleibt Rest.

## 5. Einheiten

> **ÜBERHOLT (Nutzer-Ansage 2026-09-01):** Das hier beschriebene
> Einheiten-Wahlfeld samt Umrechner ist gebaut worden und wieder
> AUSGEBAUT. Getippt wird immer in der Einheit, die die Daten der Zeile
> vorgeben (Behandlungseinheit) — ein Wahlfeld ergibt keinen Sinn, weil
> die Einheiten vorgegeben und oft gar nicht umrechenbar sind (`Inj.`,
> `Stab`). **Nicht wieder einbauen.** Der Rest des Abschnitts bleibt nur
> als Beleg stehen, welche Einheiten in den Kundendaten vorkommen.

Die Kundendaten führen `mg`, `g`, `ml` **und** Stück-Einheiten: `Inj.`, `Inj`
(zwei Schreibweisen desselben!), `Stab`, `Blt.`, `Amp`, `Clip`, `Beutel`,
`Injektoren`.

- **Je Platz** ist einstellbar, woher die Einheit kommt: **fest** · **aus einer
  Spalte** (der Normalfall hier, die IDB liefert sie je Zeile) · **keine**
  (Anzahl, Tage).
- **Eine Einheiten-Liste** (gleiche Bauart wie die vorhandene
  Status-Zuordnung): Kennung wie im ERP -> Art (Masse / Volumen / Stück) ->
  Faktor zur Basis. Die Faktoren sind allgemeingültig, die **Schreibweisen sind
  installationsspezifisch** — darum Daten, nicht Code.
- Gerechnet wird in der Basiseinheit, das Ergebnis geht zurück in die Einheit
  seines Platzes, **danach** wird gerundet. Andere Reihenfolge = Faktor 1000.
- **Unbekannte Einheit oder unpassende Art (Masse gegen Volumen): Zelle bleibt
  leer.** Wie ein fehlender Wert. Keine Warnung — das ist feste Zusage im
  Projekt.

**Nutzer-Entscheidung 2026-08-31: keine abgespeckte erste Fassung.** Die
Abgabemenge bekommt von Anfang an ein eigenes Einheiten-Wahlfeld: der Bediener
tippt `5` und wählt `l` / `kg` / `ml` / `g` aus der Einheiten-Liste. Gerechnet
und **geschrieben** wird immer in der Einheit der Dosis aus der IDB
(`Behandlungseinheit`) — die Eingabe-Einheit ist reiner Tippkomfort und reist
nie in den Beleg (aus 5 l wird bei ml-Dosis intern 5000, im Beleg steht
`5000 ml`). Umrechnung nur innerhalb derselben Art (Masse↔Masse,
Volumen↔Volumen); kg→ml gibt es NICHT (bräuchte die Dichte) — dann bleibt die
gerechnete Zelle leer.

**Anzeige-Regel für die Einheiten-Auswahl:** im Wahlfeld stehen ausgeschriebene
Klarnamen („Liter", „Milliliter", „Kilogramm"), nie ein nacktes „l" — das
kleine l ist von der Ziffer 1 nicht zu unterscheiden (ist im Gespräch mit dem
Nutzer genau so passiert). Gespeichert/geschrieben wird die ERP-Kennung.

## 6. Die Datenquellen

**Hauptquelle:** Belegposition (`POS`). Dorthin wird geschrieben. Der Nutzer
sagt, sie hat Felder für alle unten genannten Spalten.

**Hilfsquelle:** eine IDB mit den Dosierungen je Artikel UND Tierart. Ihre
Spalten (Klarnamen, wie der Nutzer sie sieht — die Feldcodes muss er im
Datencenter selbst auswählen, sie sind hier nicht bekannt):

| Spalte | Beispielwerte | Bedeutung |
|---|---|---|
| `TierArtID` | `ART00003Rind` | Schlüssel = Artikelnummer + Tierart |
| `Artikel` | `ART00003` | Artikelnummer |
| `Tierart` | Rind, Schwein, Schaf, Aufzuchtferkel | |
| `Bezeichn` | Baytril 5 % | Artikelbezeichnung |
| `Behandlungsmenge` | 5 · 2,5 · 1,665 · 8,333333 | Dosis je Bezug |
| `Behandlungseinheit` | ml · g · mg · Inj. · Stab | Einheit der Dosis |
| `Koerpergewicht` | 10 · 50 · 100 · (leer) | worauf sich die Dosis bezieht |
| `Behandlungsdauer` | 1 · 3 · 5 · 7 | Behandlungstage |
| `Behandlungsintervall` | 24 · 48 | Stunden zwischen zwei Gaben |
| `Wartezeit` | 4 · 110 · 130 | Wartezeit in Tagen (nicht Teil der Rechnung) |
| `Dosierung` | „5 ml /50 KGW" | **FLIESSTEXT — NIE parsen, s. Verbote** |

Wichtig: **derselbe Artikel hat je Tierart andere Werte** (`ART00003Rind`
gegen `ART00003Schwein`, Wartezeit 110 gegen 130).

## 7. Die Spalten der Tabelle

Zehn Spalten, jede mit **Belegpositionsfeld** (dorthin wird geschrieben) und wo
sinnvoll einem **Füllfeld** (daher kommt der Wert beim Erfassen). Reihenfolge =
Tippweg, nicht umsortieren:

| # | Spaltentitel | Belegpositionsfeld | Füllfeld aus der IDB | Rolle |
|---|---|---|---|---|
| 1 | Artikelnummer | ja | `Artikel` | tippen/wählen |
| 2 | Bezeichnung | ja | `Bezeichn` | kommt |
| 3 | Tierart | ja | `Tierart` | wählen |
| 4 | Tiergewicht | ja | — | **tippen** |
| 5 | Abgabemenge | ja | — | **tippen** + Einheit wählen (s. Abschnitt 5) |
| 6 | Einheit | ja | `Behandlungseinheit` | kommt |
| 7 | Anzahl Tiere | ja | — | **rechnet sich** |
| 8 | Behandlungstage | ja | `Behandlungsdauer` | kommt, überschreibbar |
| 9 | Dosis | ja | `Behandlungsmenge` | kommt |
| 10 | je kg | ja | `Koerpergewicht` | kommt |

**Spaltentitel-Regel, hart gelernt:** die Spalte 9/10 NICHT „Körpergewicht"
nennen — der Nutzer verwechselt sie sonst mit dem Tiergewicht (Spalte 4), und
zwar zu Recht: der ERP-Name ist unglücklich. Titel „Dosis" und „je kg", oder
später in der grauen Unterzeile als EINE Angabe `5 ml/50 kg`. Erfinde auch
keine eigenen Wörter wie „Dosis je Bezug" oder „Bezugsgewicht" — nimm die
Namen, die der Nutzer in seinen Daten sieht.

## 8. Was schon gebaut ist — NICHT neu bauen

Am Code geprüft (2026-08-31), `src/blocks/tabelle/erfassungsLauf.ts`:

- **Hilfsquelle mit Schlüsselpaar wird automatisch eingeschränkt** (`moegliche`,
  `passendeSaetze`): Artikelnummer bekannt -> die Dosier-IDB zeigt nur noch die
  Zeilen dieses Artikels, also nur noch Rind/Schwein statt tausende.
- **Ein-Treffer-Automatik** (`gleicheAb`): bleibt genau ein Satz übrig, wird er
  ohne Klick übernommen.
- **Artikelwechsel wirft die alte Auswahl weg** („ein neuer Artikel löst die
  alte Gabe") — keine stehengebliebenen Dosierwerte vom Vorgänger.
- **Füllfelder** sind gebaut (`Spalte.fuellFeld`, `zellenzielVon`,
  `erfassungsLauf` `uebernimm`/`setze`/`gleicheAb`).
- Eine Hilfsquelle darf an einer **anderen** Hilfsquelle hängen (`partnerVon`).

Der Nutzer bestätigt, dass das in seiner Maske funktioniert. Die zweistufige
Auswahl ist also **Einstellarbeit, kein Bau**.

## 9. Wo die Rechnung eingebaut wird

**Ein** Einbauort: `erfassungsLauf.ts`, der Rückfall in `wertVon(umfeld, index)`
(um Zeile 85). Begründung: Getipptes schlägt dort schon alles (= die geforderte
Überschreibbarkeit), gebuchte Zeilen sollen nie rechnen, und eine erfasste Zeile
friert das Ergebnis von allein ein (`erfassungsAnschluss.ts:90`).

`gleicheAb` (um Zeile 307) ist bereits eine Fixpunkt-Schleife für abhängige
Werte — dort gehört das Nachziehen hin.

**Achtung:** `wertVon` kennt heute nur das Getippte und den gewählten Satz je
Quelle. Die Rechnung braucht mehrere Werte DERSELBEN Zeile. Der Lauf hält den
ganzen Zeilenstand (`getippt`, `gewaehlt`), das ist also erreichbar — aber die
Zell-Signatur der Spaltenarten gibt einer Zelle nur ihren eigenen Wert.

## 10. Vorher zu fixen — sonst rechnet die Rechnung falsch

`alsZahl` in `src/blocks/tabelle/sortierung.ts:8-17` hält **jeden Punkt mit
genau drei Ziffern dahinter** für einen Tausenderpunkt. Ausgeführt geprüft:

| Eingabe | Ergebnis | richtig wäre |
|---|---|---|
| `0.750` | **750** | 0,75 |
| `1.500` | **1500** | uneindeutig |
| `0.75` | 0,75 | ok |
| `0.7500` | 0,75 | ok |

Trifft heute die Summe unter der Tabelle und das Sortieren. Und es wäre der
Einleser der Rechnung — Dosierungen haben typischerweise drei Nachkommastellen.

Sicherer Teilfix: **eine Tausendergruppe folgt nie auf eine alleinstehende
Null.** Der Rest (`1.500`) ist aus dem Text nicht entscheidbar und braucht die
Antwort, in welcher Schreibweise SoftEngine Mengen liefert und erwartet — offen.

Struktureller Kern: ein Leser macht vier Jobs (anzeigen, summieren, sortieren,
Getipptes normalisieren). Daraus müssen zwei werden: **„was hat das ERP
geliefert"** (darf tolerant sein) und **„was hat der Bediener getippt"** (muss
streng sein, bei Uneindeutigkeit nicht raten).

## 11. Verbote

1. **Die Spalte `Dosierung` (Fließtext) NIE parsen.** Sie enthält „46 mg /10
   KGW", aber auch „3 Stäbe alle 72", „1 Inj. /Viertel/M", „4 Injektoren (1".
   Gerechnet wird ausschließlich aus `Behandlungsmenge` + `Behandlungseinheit`
   + `Koerpergewicht`.
2. **Keine Formelsprache, kein Freitextfeld für Ausdrücke.** Der Bediener tippt
   nirgends eine Formel. Ein früherer Versuch mit getippten Ausdrücken wurde
   deshalb komplett zurückgenommen.
3. **Keine Warn-Anzeigen.** Rechnet etwas nicht, bleibt die Zelle leer. Keine
   Meldung, kein Ausrufezeichen, kein roter Rand.
4. **Nicht in die Fläche oder den Spaltenkopf einbauen.** Am Spaltenkopf stecken
   schon sechs Sachen, der Nutzer hat die Fläche ausdrücklich als überfüllt
   beanstandet. Die Rechnung wird im **Datencenter** angelegt (eigener Bereich
   „Rechnungen", volle Breite, mit Namen), und an der Tabelle steht genau EINE
   Zeile: `Rechnung: [Name ▾]`.
5. **Keine neuen Testarten.** Bestehende Testdateien dürfen mitwachsen.

## 12. Offen — nicht raten, den Nutzer fragen lassen

1. `Behandlungsintervall` 24 = einmal täglich? Bei 48 jeden zweiten Tag? Falls
   ja, fehlt in der Formel ein Faktor (Gaben pro Tag). Hinweis aus den Daten:
   ein Fließtext lautet „3 Stäbe alle 72", die Einheit ist also wohl Stunden —
   aber dieselbe Zeile hat `Behandlungsintervall` 48. Widersprüchlich.
2. Es gibt einen dritten Bezug neben „pro Tier" und „pro kg": „1 Inj. /
   **Viertel**" (Euterviertel) und „2 Beutel / **Kuh**". Ungeklärt.
3. Nicht jede IDB-Zeile hat Zahlen — manche haben nur den Fließtext. Dort kann
   nichts gerechnet werden (Zelle bleibt leer). Ist das akzeptabel?
4. In welcher Schreibweise erwartet SoftEngine eine Menge beim Schreiben,
   Komma oder Punkt? Entscheidet Abschnitt 10.

## 13. Arbeitsstand-Warnung

Am 2026-08-31 wurde parallel in einem anderen Chat an derselben Tabelle
gearbeitet: 19 Dateien geändert, `spaltenArten.ts` gelöscht, `spaltenBreite.ts`
neu — unversioniert. **Vor Arbeitsbeginn `git status` prüfen und nichts
überschreiben, was noch nicht committet ist.**

Von diesem Umbau NICHT betroffen und damit verlässlich: `erfassungsLauf.ts`,
`erfassungsAnschluss.ts`, `sortierung.ts`, `seitengroesse.ts`, `aenderungen.ts`.
