// Umlaute und Akzente auf ihren Grundbuchstaben zurueckfuehren: wer „muller"
// tippt, sucht Mueller, und wer „AERMEL" tippt, sucht Ärmel. Ohne das fiel
// jeder Treffer mit Umlaut aus der Liste, sobald der Bediener die Taste nicht
// traf — im Lager tippt niemand Umlaute mit (Nutzer-Befund 2026-09-04).
//
// Zusaetzlich ss/ß, weil das kein Akzent ist und die Zerlegung es nicht
// erwischt. Getrennt ausgestellt, damit Suche und Sortierung DASSELBE
// Verstaendnis von „gleich" haben (vorschlagListe.ts).
export function schlichtText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function woerterVon(text: string): string[] {
  return text.trim().toLowerCase().split(/\s+/).filter((w) => w !== '')
}

export function zeilePasst(zeile: readonly string[], suchtext: string): boolean {
  const woerter = woerterVon(suchtext)
  if (woerter.length === 0) return true

  const zeileText = schlichtText(zeile.join(' '))
  return woerter.every((wort) => zeileText.includes(schlichtText(wort)))
}
