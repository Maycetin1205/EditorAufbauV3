import { html, type TemplateResult } from 'lit'
import { woerterVon } from './textSuche'

const SONDERZEICHEN = /[.*+?^${}()|[\]\\]/g

// Die Treffer im Zellwert hervorheben — mit derselben Zerlegung, mit der die
// Suche filtert (jedes Wort einzeln, Gross/Klein egal). Gebaut wird ein BAUM
// aus Text und <mark>, nie ein HTML-String: ein Wert aus der ERP darf nicht
// als Markup gelesen werden. Ohne Suche (oder ohne Treffer) kommt der Text
// unveraendert zurueck — dann entsteht auch kein zusaetzlicher Knoten.
export function markiereTreffer(text: string, suchtext: string): TemplateResult | string {
  const woerter = woerterVon(suchtext)
  if (woerter.length === 0 || text === '') return text

  let muster: RegExp
  try {
    muster = new RegExp(`(${woerter.map((w) => w.replace(SONDERZEICHEN, '\\$&')).join('|')})`, 'ig')
  } catch {
    return text
  }

  // split mit Fanggruppe: an den ungeraden Stellen stehen die Treffer.
  const teile = text.split(muster)
  if (teile.length <= 1) return text
  return html`${teile.map((teil, i) => (i % 2 === 1 ? html`<mark>${teil}</mark>` : teil))}`
}
