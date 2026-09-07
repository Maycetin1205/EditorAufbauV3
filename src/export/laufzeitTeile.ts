// Die Laufzeit liegt als Dateien neben der Maske: welche eine Maske braucht,
// was in ihnen steht, und was die Maske sagt, wenn eine davon fehlt.
import { getBlockDefinition } from '../core/blocks/blockRegistry'
import verzeichnisRoh from './generated/teile.json?raw'

interface TeilEintrag {
  name: string
  datei: string
  bausteine: string[]
  braucht: string[]
}

interface Verzeichnis {
  basisDatei: string
  // In Ladereihenfolge: wer ein Modul eines anderen Teils benutzt, steht danach.
  teile: TeilEintrag[]
}

const verzeichnis = JSON.parse(verzeichnisRoh) as Verzeichnis

const inhalte = import.meta.glob('./generated/ff-*.js', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface LaufzeitDatei {
  name: string
  inhalt: string

  // Das Element, an dem sich zeigt, ob die Datei geladen wurde. Die Basisdatei
  // meldet keines an, sie zeigt sich an window.FF.
  meldetElement?: string
}

function inhaltVon(datei: string): string {
  const gefunden = inhalte['./generated/' + datei]
  if (gefunden === undefined) {
    throw new Error(`Die Laufzeitdatei ${datei} fehlt. "npm run build:runtime" baut sie.`)
  }
  return gefunden
}

function elementVon(teil: TeilEintrag): string {
  const def = getBlockDefinition(teil.bausteine[0])
  if (!def) {
    throw new Error(`Der Laufzeitteil ${teil.datei} nennt den unbekannten Baustein `
      + `"${teil.bausteine[0]}". Verzeichnis und Registry passen nicht zusammen.`)
  }
  return def.tagName
}

// Die Basisdatei und jeder Teil, dessen Baustein in der Maske steht — samt den
// Teilen, die er selbst benutzt, in Ladereihenfolge.
export function laufzeitDateienFuer(typen: ReadonlySet<string>): LaufzeitDatei[] {
  const nachName = new Map(verzeichnis.teile.map((teil) => [teil.name, teil]))
  const gebraucht = new Set<string>()
  const dazu = (name: string): void => {
    if (gebraucht.has(name)) return
    gebraucht.add(name)
    for (const weiterer of nachName.get(name)?.braucht ?? []) dazu(weiterer)
  }
  for (const teil of verzeichnis.teile) {
    if (teil.bausteine.some((typ) => typen.has(typ))) dazu(teil.name)
  }

  return [
    { name: verzeichnis.basisDatei, inhalt: inhaltVon(verzeichnis.basisDatei) },
    ...verzeichnis.teile.filter((teil) => gebraucht.has(teil.name)).map((teil) => ({
      name: teil.datei,
      inhalt: inhaltVon(teil.datei),
      meldetElement: elementVon(teil),
    })),
  ]
}

// Wurde eine Laufzeitdatei nicht mit neben die Maske gelegt, bliebe die Maske
// wortlos leer. Dieses Skript sagt stattdessen, welche Datei fehlt.
export function dateiWacheSkript(dateien: readonly LaufzeitDatei[]): string {
  const zuPruefen = dateien.map((datei) => [datei.name, datei.meldetElement ?? ''])
  return `(function () {
var fehlend = [];
var teile = ${JSON.stringify(zuPruefen)};
for (var i = 0; i < teile.length; i++) {
var da = teile[i][1] === ''
? !!window.FF
: !!(window.customElements && customElements.get(teile[i][1]));
if (!da) fehlend.push(teile[i][0]);
}
if (fehlend.length === 0) return;
var hinweis = document.createElement('div');
hinweis.setAttribute('style', 'padding:12px;color:#a11;font:14px sans-serif');
hinweis.textContent = 'Diese Maske findet ihre Laufzeit nicht. Neben '
+ 'index.basis.source.html fehlt: ' + fehlend.join(', ');
document.body.insertBefore(hinweis, document.body.firstChild);
})();`
}
