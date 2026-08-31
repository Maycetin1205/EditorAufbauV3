export type Datenbesitz = 'softengine' | 'provided'

export interface BereitgestellteZeile {
  rohzeile: unknown

  zellen: readonly string[]
}

export interface AbgeleiteteZeilen {
  rohzeilen: unknown[]
  datenzeilen: string[][]
}

export function leiteZeilenAb(zeilen: readonly BereitgestellteZeile[]): AbgeleiteteZeilen {
  return {
    rohzeilen: zeilen.map((z) => z.rohzeile),
    datenzeilen: zeilen.map((z) => [...z.zellen]),
  }
}
