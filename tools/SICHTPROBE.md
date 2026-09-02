# Sichtprobe — den Editor sehen, bevor man committet

Wer am Editor baut, muss ihn sehen. Die Sichtprobe bedient den laufenden
Editor in einem unsichtbaren Chromium und legt Bilder in `sichtprobe/` ab
(nicht im Repo). Jeder Schritt in `PLAN.md` macht vor dem Commit die
Standard-Bilder und SIEHT SIE AN (Read-Werkzeug), Bild fuer Bild, gegen das
Gestaltungs-Zielbild in `PLAN.md` Abschnitt 1a. Stimmt etwas nicht: erst
richten, dann committen.

## Einmal einrichten

- `npm install` (bringt `playwright-core` mit).
- Ohne vorinstallierten Browser (nicht in der Cloud-Umgebung noetig):
  `npx playwright install chromium`.

## Laufen lassen

1. Dev-Server in einem zweiten Terminal (oder im Hintergrund): `npm run dev`
   — Port 5300, fest.
2. `node tools/sichtprobe.cjs standard` — neun Bilder: Editor, Tabelle
   gewaehlt (Werkzeugleiste), Feld-Picker, Formularfeld, Kanban-Spalte,
   Datencenter, Kettenfenster, Menue, Popup-Seite.
3. Eigene Folgen: `node tools/sichtprobe.cjs click:ff-tabelle wait:400 shot:meins`

Aktionen: `click:<selektor>`, `hover:<selektor>`, `mclick:x,y`,
`mclick-kopf:<n>` (n-ter Spaltenkopf der ersten Tabelle), `drag:x1,y1,x2,y2`,
`key:<Taste>`, `type:<Text>`, `select:<selektor>=<wert>`, `wait:<ms>`,
`shot:<name>`, `clip:x,y,b,h,<name>`, `text:<selektor>`, `eval:<js>`.

Die Maske im Bild kommt aus `tools/sichtprobe-seed.json` (die Referenzmaske
aufs Raster gelegt). `SEED=0` laesst den Speicher leer, `SEED=<datei>` nimmt
einen eigenen Speicherabzug, `URL=...` einen anderen Server.

Konsolen-Fehler und -Warnungen der Seite werden mit ausgegeben. Erwartet und
harmlos ist GENAU EINE Warnung „ff-tabelle scheduled an update after an
update completed" je Tabelle: sie misst nach dem ersten Zeichnen ihre Hoehe
und zeichnet einmal nach. Alles andere — weitere Warnungen, Fehler, eine
Seite, die nicht antwortet oder deren Bilder leer bleiben — ist ein Fehler
im eigenen Umbau: nicht committen.
