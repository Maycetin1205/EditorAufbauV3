// Baut die Laufzeit der Maske in Teile: eine Basisdatei und je Baustein eine.
// Aufruf: node tools/laufzeitBauen.mjs [--ziel <ordner>]
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const QUELLE = pfad(path.join(WURZEL, 'src'))
const BAUSTEIN_ORDNER = QUELLE + '/blocks'
// Nur diese drei Schichten laufen in der Maske; der Editor bleibt draussen.
const LAUFZEIT_WURZELN = ['blocks', 'core', 'softengine'].map((name) => `${QUELLE}/${name}`)
// blocks/base und blocks/shared sind kein Baustein, sondern Grundlage.
const KEIN_BAUSTEIN = new Set(['base', 'shared'])
const BASIS = 'basis'
const ENTWURF = pfad(path.join(WURZEL, 'node_modules/.tmp/laufzeit-entwurf'))

function pfad(p) {
  return p.split(path.sep).join('/')
}

function alleQuelldateien(ordner) {
  const gefunden = []
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    const voll = pfad(path.join(ordner, eintrag.name))
    if (eintrag.isDirectory()) gefunden.push(...alleQuelldateien(voll))
    else if (eintrag.name.endsWith('.ts') && !eintrag.name.endsWith('.test.ts')) gefunden.push(voll)
  }
  return gefunden
}

// Zu welchem Teil gehoert eine Datei? Alles ausserhalb der Baustein-Ordner ist Basis.
function teilVon(datei) {
  if (!datei.startsWith(BAUSTEIN_ORDNER + '/')) return BASIS
  const ordner = datei.slice(BAUSTEIN_ORDNER.length + 1).split('/')[0]
  return ordner.endsWith('.ts') || KEIN_BAUSTEIN.has(ordner) ? BASIS : ordner
}

// Der Name, unter dem ein Modul im Fenster steht: FF.core$blocks$BlockData.
function globalerName(id) {
  const schluessel = (id.startsWith(QUELLE + '/') ? id.slice(QUELLE.length + 1) : id)
    .replace(/\.ts$/, '')
    .replace(/[^A-Za-z0-9]/g, '$')
  return 'FF.' + schluessel
}

const NUR_TYP = /^\s*type\s/

// Was diese Datei zur Laufzeit braucht. Reine Typ-Importe zaehlen nicht: sie
// verschwinden beim Uebersetzen und wuerden sonst Teile aneinanderbinden.
function importeVon(quelltext) {
  const gefunden = []
  const mitNamen = /(?:^|\n)\s*(?:import|export)\b([\s\S]*?)\bfrom\s*['"]([^'"]+)['"]/g
  for (const treffer of quelltext.matchAll(mitNamen)) {
    if (!NUR_TYP.test(treffer[1])) gefunden.push(treffer[2])
  }
  const nurWirkung = /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g
  for (const treffer of quelltext.matchAll(nurWirkung)) gefunden.push(treffer[1])
  return gefunden
}

function aufloesen(spec, vonOrdner) {
  if (!spec.startsWith('.')) return spec
  const roh = pfad(path.resolve(vonOrdner, spec))
  for (const kandidat of [roh, roh + '.ts', roh + '/index.ts', roh.replace(/\.js$/, '.ts')]) {
    if (kandidat.endsWith('.ts') && existsSync(kandidat)) return kandidat
  }
  throw new Error(`Import "${spec}" aus ${vonOrdner} zeigt auf keine Quelldatei.`)
}

const BAUSTEIN_TYP = /static\s+(?:readonly\s+)?blockType\s*=\s*['"]([^'"]+)['"]/g

// Liest den Bauplan aus den Quellen: welcher Teil traegt welche Bausteine,
// welche Module muss er den anderen hinstellen, welchen Teil braucht er selbst.
function bauplan() {
  const dateienJeTeil = new Map([[BASIS, []]])
  for (const wurzel of LAUFZEIT_WURZELN) {
    for (const datei of alleQuelldateien(wurzel)) {
      const teil = teilVon(datei)
      if (!dateienJeTeil.has(teil)) dateienJeTeil.set(teil, [])
      dateienJeTeil.get(teil).push(datei)
    }
  }

  // Hingestellt wird nur, was ein Baustein von aussen anfasst; alles Weitere
  // zieht ein Teil ueber diese Module nach und faellt sonst beim Bauen heraus.
  const stelltHin = new Map([...dateienJeTeil.keys()].map((teil) => [teil, new Set()]))
  const braucht = new Map([...dateienJeTeil.keys()].map((teil) => [teil, new Set()]))

  for (const [teil, dateien] of dateienJeTeil) {
    if (teil === BASIS) continue
    for (const datei of dateien) {
      for (const spec of importeVon(readFileSync(datei, 'utf8'))) {
        const ziel = aufloesen(spec, path.dirname(datei))
        const eigen = ziel.startsWith(QUELLE + '/')
        if (eigen && !LAUFZEIT_WURZELN.some((w) => ziel.startsWith(w + '/'))) {
          throw new Error(`${datei} holt "${spec}" aus einer Schicht, die nicht in die Maske gehoert.`)
        }
        const zielTeil = eigen ? teilVon(ziel) : BASIS
        if (zielTeil === teil) continue
        stelltHin.get(zielTeil).add(ziel)
        if (zielTeil !== BASIS) braucht.get(teil).add(zielTeil)
      }
    }
  }

  const teile = []
  for (const [teil, dateien] of dateienJeTeil) {
    if (teil === BASIS) continue
    const bausteine = dateien.flatMap((datei) =>
      [...readFileSync(datei, 'utf8').matchAll(BAUSTEIN_TYP)].map((treffer) => treffer[1]))
    if (bausteine.length === 0) {
      throw new Error(`Der Ordner blocks/${teil} meldet keinen Bausteintyp an.`)
    }
    teile.push({
      name: teil,
      datei: `ff-${teil}.js`,
      bausteine: bausteine.sort(),
      braucht: [...braucht.get(teil)].sort(),
    })
  }

  return { dateienJeTeil, stelltHin, basisDatei: `ff-${BASIS}.js`, teile: nachAbhaengigkeit(teile) }
}

// Ladereihenfolge: wer ein Modul eines anderen Teils benutzt, kommt danach.
function nachAbhaengigkeit(teile) {
  const offen = [...teile].sort((a, b) => a.name.localeCompare(b.name))
  const fertig = []
  while (offen.length > 0) {
    const naechster = offen.findIndex((t) => t.braucht.every((n) => fertig.some((f) => f.name === n)))
    if (naechster === -1) {
      throw new Error(`Bausteine brauchen einander im Kreis: ${offen.map((t) => t.name).join(', ')}`)
    }
    fertig.push(...offen.splice(naechster, 1))
  }
  return fertig
}

// Der Einstieg eines Teils: meldet seine Bausteine an und stellt den anderen
// Teilen die Module hin, die sie von ihm holen.
function schreibeEinstieg(name, dateien, stelltHin) {
  const kopf = name === BASIS
    ? [`import '${QUELLE}/export/fehlerWache'`]
    : dateien.filter((datei) => /Block\.ts$/.test(datei)).map((datei) => `import '${datei}'`)
  const rumpf = stelltHin.size === 0 ? [] : ['window.FF = window.FF || {};']
  let nr = 0
  for (const modul of [...stelltHin].sort()) {
    const marke = `t${nr++}`
    kopf.push(`import * as ${marke} from '${modul}'`)
    rumpf.push(`${globalerName(modul)} = ${marke};`)
  }
  const einstieg = `${ENTWURF}/${name}.ts`
  mkdirSync(ENTWURF, { recursive: true })
  writeFileSync(einstieg, [...kopf, ...rumpf].join('\n') + '\n')
  return einstieg
}

async function baueTeil(vite, name, plan, ziel) {
  const einstieg = schreibeEinstieg(name, plan.dateienJeTeil.get(name), plan.stelltHin.get(name))
  const globals = {}
  for (const [teil, module] of plan.stelltHin) {
    if (teil === name) continue
    for (const modul of module) globals[modul] = globalerName(modul)
  }

  await vite.build({
    configFile: false,
    logLevel: 'warn',
    publicDir: false,
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{
      name: 'ff-teile',
      // Vor Vites eigener Aufloesung, sonst kommt dieser Haken nie an die Reihe.
      enforce: 'pre',
      resolveId(spec, importeur, optionen) {
        if (optionen.isEntry || importeur === undefined) return null
        const von = pfad(importeur)
        // Aufgeteilt werden nur eigene Quellen; was ein Fremdpaket in sich selbst
        // importiert, geht diesen Bauplan nichts an.
        if (!von.startsWith(QUELLE + '/') && !von.startsWith(ENTWURF + '/')) return null
        const ziel = spec.startsWith('.') ? aufloesen(spec, path.dirname(von)) : spec
        const zielTeil = ziel.startsWith(QUELLE + '/') ? teilVon(ziel) : BASIS
        if (zielTeil === name) return null
        if (globals[ziel] === undefined) {
          throw new Error(`${name} holt "${spec}" aus ${zielTeil}, aber der Teil stellt es nicht hin.`)
        }
        return { id: ziel, external: true }
      },
    }],
    build: {
      lib: { entry: einstieg, formats: ['iife'], name: 'FFTeil', fileName: () => `ff-${name}.js` },
      outDir: ziel,
      emptyOutDir: false,
      minify: true,
      rollupOptions: { output: { globals } },
    },
  })
}

async function baueLaufzeit(ziel) {
  const vite = await import('vite')
  const plan = bauplan()
  rmSync(ENTWURF, { recursive: true, force: true })
  mkdirSync(ziel, { recursive: true })
  await baueTeil(vite, BASIS, plan, ziel)
  for (const teil of plan.teile) await baueTeil(vite, teil.name, plan, ziel)
  rmSync(ENTWURF, { recursive: true, force: true })

  const verzeichnis = {
    basisDatei: plan.basisDatei,
    teile: plan.teile.map(({ name, datei, bausteine, braucht }) => ({ name, datei, bausteine, braucht })),
  }
  writeFileSync(path.join(ziel, 'teile.json'), JSON.stringify(verzeichnis, null, 2) + '\n')

  // Erst am Ende raeumen, nie vorher: ein parallel offener Editor uebernaehme
  // sonst per HMR einen Zwischenstand ohne Laufzeit.
  const gehoertDazu = new Set([plan.basisDatei, ...plan.teile.map((t) => t.datei), 'teile.json'])
  for (const name of readdirSync(ziel)) {
    if (!gehoertDazu.has(name)) rmSync(path.join(ziel, name))
  }

  for (const datei of [plan.basisDatei, ...plan.teile.map((t) => t.datei)]) {
    const kb = (readFileSync(path.join(ziel, datei)).length / 1024).toFixed(1)
    process.stdout.write(`${datei.padEnd(16)}${kb.padStart(7)} kB\n`)
  }
}

const stelle = process.argv.indexOf('--ziel')
await baueLaufzeit(stelle === -1
  ? path.join(WURZEL, 'src/export/generated')
  : path.resolve(process.argv[stelle + 1]))
