// Prueft die Dateiform der Maske: SE-Marker, LF, reines ASCII.
export const START_MARKER = '<!--SOFTENGINE-VAR!JWHtmlStart-->'
export const END_MARKER = '<!--SOFTENGINE-VAR!JWHtmlEnde-->'

export interface CheckResult {
  name: string
  ok: boolean
  detail: string

  warnung?: boolean
}

export function validateMaskHtml(html: string): CheckResult[] {
  const results: CheckResult[] = []
  const check = (name: string, ok: boolean, detail = '') => {
    results.push({ name, ok, detail })
  }

  const crlf = (html.match(/\r/g) ?? []).length
  check('LF-only', crlf === 0, crlf ? `${crlf} CR-Zeichen gefunden` : '')

  const lines = html.split('\n')
  check('Start-Marker Zeile 1', lines[0] === START_MARKER, lines[0] ?? '(leer)')
  const lastNonEmpty = [...lines].reverse().find((l) => l.trim() !== '') ?? ''
  check('Ende-Marker letzte Zeile', lastNonEmpty === END_MARKER, lastNonEmpty)

  const badChar = /[^\n\t\x20-\x7E]/.exec(html)
  check(
    'ASCII-only',
    badChar === null,
    badChar ? `Zeichen U+${badChar[0].codePointAt(0)!.toString(16).toUpperCase()} an Position ${badChar.index}` : '',
  )

  const styles = (html.match(/<style[\s>]/g) ?? []).length
  check('genau 1 <style>', styles === 1, `gefunden: ${styles}`)

  check(
    'Laufzeit eingebettet',
    html.includes('customElements.define'),
    'ohne die Laufzeit bleibt jeder Baustein stumm',
  )

  // Die Bruecke bringt JWHtmlStart selbst mit; die Maske laedt nichts nach.
  const fremde = [...html.matchAll(/<script[^>]*\ssrc="([^"]*)"/g)].map((treffer) => treffer[1])
  check('kein fremdes Skript', fremde.length === 0, fremde.join(', '))

  check('DOCTYPE vorhanden', html.includes('<!DOCTYPE html>'))
  check('Wurzel-Fluss vorhanden', html.includes('class="ff-root"'))
  check('Masken-Tokens eingebettet', html.includes('--se-accent:'))

  return results
}

export function failedChecks(results: CheckResult[]): CheckResult[] {
  return results.filter((r) => !r.ok && r.warnung !== true)
}

