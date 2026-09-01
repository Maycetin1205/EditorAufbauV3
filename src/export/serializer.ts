function escapeNonAsciiHtml(s: string): string {
  return Array.from(s)
    .map((c) => (/^[\n\t\x20-\x7E]$/.test(c) ? c : `&#x${c.codePointAt(0)!.toString(16).toUpperCase()};`))
    .join('')
}

export function escapeHtmlText(s: string): string {
  return escapeNonAsciiHtml(
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  )
}

export function escapeHtmlAttr(s: string): string {
  return escapeHtmlText(s).replace(/"/g, '&quot;')
}

export function escapeNonAsciiJs(s: string): string {
  return s.replace(/[^\n\t\x20-\x7E]/g, (c) => {
    const code = c.charCodeAt(0)
    return '\\u' + code.toString(16).toUpperCase().padStart(4, '0')
  })
}

export function guardScriptContent(js: string): string {
  return js.replace(/<\/script/gi, '<\\/script')
}

// Fuer die zwei JSON-Skripte (FF_DATA_SOURCES, FF_RELATIONS): dort steht jedes
// `<` in einer JSON-Zeichenkette, und \u003C ist dieselbe Zeichenkette.
// Damit kann kein getippter Text das Skript verlassen — auch nicht ueber die
// "double escaped script"-Masche, die am </script-Schutz vorbeikommt.
// NICHT fuers Runtime-Buendel: dort ist `<` echter Code (Vergleiche).
export function guardJsonScript(js: string): string {
  return js.replace(/</g, '\\u003C')
}

export function stripCssComments(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l, i, arr) => l !== '' || (arr[i - 1] ?? '') !== '')
    .join('\n')
    .trim()
}
