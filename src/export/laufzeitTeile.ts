// Die Laufzeit der Maske: die Basis und je benutztem Baustein ein Teil, als ein Skript.
import verzeichnisRoh from './generated/laufzeit.json?raw'

interface TeilEintrag {
  name: string
  datei: string
  bausteine: string[]
  braucht: string[]
}

interface Verzeichnis {
  inhalte: Record<string, string>
  basisDatei: string
  // In Ladereihenfolge: wer ein Modul eines anderen Teils benutzt, steht danach.
  teile: TeilEintrag[]
}

const verzeichnis = JSON.parse(verzeichnisRoh) as Verzeichnis

function inhaltVon(datei: string): string {
  const gefunden = verzeichnis.inhalte[datei]
  if (gefunden === undefined) {
    throw new Error(`Die Laufzeitdatei ${datei} fehlt. "npm run build:runtime" baut sie.`)
  }
  return gefunden.trim()
}

// Die Basis und jeder Teil, dessen Baustein in der Maske steht, samt den Teilen,
// die er selbst benutzt, in Ladereihenfolge hintereinander.
export function laufzeitSkriptFuer(typen: ReadonlySet<string>): string {
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
    inhaltVon(verzeichnis.basisDatei),
    ...verzeichnis.teile.filter((teil) => gebraucht.has(teil.name)).map((teil) => inhaltVon(teil.datei)),
  ].join('\n')
}
