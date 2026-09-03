// Sichtprobe: den laufenden Editor im Browser bedienen und Bilder machen.
//
//   npm run dev                      (anderes Terminal; Port 5300)
//   node tools/sichtprobe.cjs standard
//   node tools/sichtprobe.cjs click:ff-tabelle wait:400 shot:meins
//
// Bilder landen in ./sichtprobe/<name>.png. Anleitung: tools/SICHTPROBE.md.
// Ohne Browser: einmal `npx playwright install chromium`.
const { chromium } = require('playwright-core')
const fs = require('fs')
const path = require('path')

const WURZEL = path.resolve(__dirname, '..')
const AUSGABE = path.join(WURZEL, 'sichtprobe')
const URL = process.env.URL || 'http://127.0.0.1:5300/'
const SEED = process.env.SEED === '0' ? null : (process.env.SEED || path.join(__dirname, 'sichtprobe-seed.json'))

// Die Standard-Bilder, die JEDER Schritt vor dem Commit macht und ansieht.
const STANDARD = [
  'shot:1-editor',
  'click:ff-tabelle', 'wait:400', 'shot:2-tabelle-gewaehlt',
  'mclick-kopf:2', 'wait:600', 'shot:3-feld-picker', 'key:Escape', 'wait:200',
  'click:ff-formfeld', 'wait:300', 'shot:4-formularfeld',
  'click:ff-kanban-spalte', 'wait:300', 'shot:5-kanban-spalte',
  'click:[title^="Datencenter"]', 'wait:500', 'shot:6-datencenter', 'key:Escape', 'wait:200',
  // Die Inspector-Abschnitte starten zugeklappt (inspector/abschnittStand.ts),
  // darum erst „Aktionen" aufklappen — sonst gibt es kein „Schritt anlegen".
  'click:ff-tabelle', 'wait:300',
  'click:button[aria-expanded]:has-text("Aktionen")', 'wait:200',
  'click:text=Schritt anlegen', 'wait:500', 'shot:7-kettenfenster', 'key:Escape',
  'click:[aria-label="Weitere Aktionen"]', 'wait:300', 'shot:8-menue', 'key:Escape',
  'click:text=Hinweis', 'wait:400', 'shot:9-popup-seite',
]

function chromePfad() {
  const base = '/opt/pw-browsers'
  if (!fs.existsSync(base)) return undefined
  for (const d of fs.readdirSync(base)) {
    for (const c of ['chrome-linux/chrome', 'chrome-linux64/chrome']) {
      const p = path.join(base, d, c)
      if (fs.existsSync(p)) return p
    }
  }
  return undefined
}

async function starte() {
  const args = ['--no-sandbox']
  try {
    return await chromium.launch({ headless: true, args })
  } catch (e) {
    const pfad = chromePfad()
    if (!pfad) throw e
    return chromium.launch({ headless: true, args, executablePath: pfad })
  }
}

;(async () => {
  fs.mkdirSync(AUSGABE, { recursive: true })
  const browser = await starte()
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
  if (SEED && fs.existsSync(SEED)) {
    const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'))
    await page.addInitScript((s) => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v) }, seed)
  }
  page.on('console', async (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return
    const text = m.text()
    if (text.includes('Lit is in dev mode') || text.includes('ERR_FILE_NOT_FOUND')) return
    console.log('KONSOLE', m.type(), text.slice(0, 300))
  })
  page.on('pageerror', (e) => console.log('SEITENFEHLER', String(e).slice(0, 300)))
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1500)

  const aktionen = process.argv.slice(2).flatMap((a) => (a === 'standard' ? STANDARD : [a]))
  for (const a of aktionen) {
    const i = a.indexOf(':')
    const op = a.slice(0, i)
    const arg = a.slice(i + 1)
    try {
      if (op === 'click') await page.click(arg, { timeout: 4000 })
      if (op === 'hover') await page.hover(arg, { timeout: 4000 })
      if (op === 'mclick') { const [x, y] = arg.split(',').map(Number); await page.mouse.click(x, y) }
      // Klick auf den n-ten Spaltenkopf der ersten Tabelle — ueber die
      // Editor-Schicht, darum per Koordinate.
      if (op === 'mclick-kopf') {
        const pos = await page.evaluate((n) => {
          const el = document.querySelector('ff-tabelle')?.shadowRoot?.querySelectorAll('[role=columnheader]')[n]
          if (!el) return null
          const r = el.getBoundingClientRect()
          return [r.left + r.width / 2, r.top + r.height / 2]
        }, Number(arg))
        if (pos) await page.mouse.click(pos[0], pos[1])
      }
      if (op === 'drag') {
        const [x1, y1, x2, y2] = arg.split(',').map(Number)
        await page.mouse.move(x1, y1); await page.mouse.down()
        for (let k = 1; k <= 12; k++) { await page.mouse.move(x1 + (x2 - x1) * k / 12, y1 + (y2 - y1) * k / 12); await page.waitForTimeout(20) }
        await page.mouse.up()
      }
      if (op === 'key') await page.keyboard.press(arg)
      if (op === 'type') await page.keyboard.type(arg)
      if (op === 'select') { const j = arg.lastIndexOf('='); await page.selectOption(arg.slice(0, j), arg.slice(j + 1)) }
      if (op === 'wait') await page.waitForTimeout(Number(arg))
      if (op === 'shot') { const ziel = path.join(AUSGABE, arg + '.png'); await page.screenshot({ path: ziel }); console.log('BILD', path.relative(WURZEL, ziel)) }
      if (op === 'clip') { const [x, y, w, h, name] = arg.split(','); const ziel = path.join(AUSGABE, name + '.png'); await page.screenshot({ path: ziel, clip: { x: +x, y: +y, width: +w, height: +h } }); console.log('BILD', path.relative(WURZEL, ziel)) }
      if (op === 'text') console.log('TEXT', (await page.locator(arg).first().innerText()).slice(0, 1500))
      if (op === 'eval') console.log('EVAL', JSON.stringify(await page.evaluate(arg)).slice(0, 2000))
    } catch (e) {
      console.log('FEHLER', op, arg, String(e.message).split('\n')[0].slice(0, 160))
    }
  }
  await browser.close()
})().catch((e) => { console.error(e); process.exit(1) })
