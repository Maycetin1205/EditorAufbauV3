import { SUMME_NACHKOMMA, summeText } from './zahlFormat'
import {
  linealTakte,
  OHNE_MESSUNG,
  platzhalterZeilen,
  rollAufteilung,
  seitenAufteilung,
  ZEILEN_HOEHE,
  type Zeilenmass,
} from './seitengroesse'
import { sortiereIndizes } from './sortierung'
import { spaltenRaster, type Spalte } from './spalten'
import { passendeIndizes, zeigtLeerzustand } from './suche'

export interface AnsichtFrage {
  spalten: readonly Spalte[]

  gezeichnet?: readonly Spalte[]
  plaetze?: readonly number[]

  breiteVon?: (index: number) => number | undefined

  hatQuelle: boolean
  datenGeliefert: boolean
  datenzeilen: readonly string[][]
  suchtext: string

  sortSpalte: number
  sortAuf: boolean

  wunschSeite: number

  gemessen: Zeilenmass | null

  erfassungAn: boolean

  erfassteAnzahl: number

  // Zellwert samt vorgemerkter Aenderung: die Handmaske Rahmen00001 V11 nimmt
  // die geaenderte Menge in die Summe.
  wertVon: (rohIndex: number, spalte: number) => string

  blaettert: boolean
}

export interface TabelleAnsicht {
  cols: Record<string, string>

  takt: number

  zeilenHoehe: number
  hatQuelle: boolean
  leer: boolean

  gesamt: number
  seiten: number
  seite: number

  zeilen: readonly (number | null)[]

  linealTakte: number | null

  // Ueber ALLE Treffer gezaehlt, nicht nur ueber die sichtbare Seite (so
  // rechnet die Handmaske Rahmen00001 V11).
  summen: readonly { titel: string; text: string }[]
}

function summenVon(
  frage: AnsichtFrage,
  sichtbar: readonly number[],
): { titel: string; text: string }[] {
  const raus: { titel: string; text: string }[] = []
  frage.spalten.forEach((spalte, i) => {
    if (spalte.summe !== true) return
    const text = summeText(
      sichtbar.map((zeile) => frage.wertVon(zeile, i)),
      SUMME_NACHKOMMA.min,
      SUMME_NACHKOMMA.max,
    )
    if (text !== '') raus.push({ titel: spalte.titel, text })
  })
  return raus
}

// Gesucht und sortiert wird ueber DENSELBEN Zellwert, den die Summe nimmt —
// vorgemerkte Aenderung eingerechnet. Sonst sucht der Bediener nach dem, was
// er gerade in die Zelle getippt hat, und seine eigene Zeile faellt aus der
// Liste; sortiert stuende sie nach dem alten Wert an alter Stelle.
function ansichtsZeilen(frage: AnsichtFrage): string[][] {
  // Ueber die SPALTEN, nicht ueber die Laenge der Datenzeile: eine frisch
  // angelegte Spalte hat in den gelieferten Daten noch keinen Eintrag und
  // fiele sonst aus Suche und Sortierung heraus.
  return frage.datenzeilen.map((_, zeile) => frage.spalten.map((__, s) => frage.wertVon(zeile, s)))
}

function sichtbareIndizes(frage: AnsichtFrage): number[] {
  const zeilen = ansichtsZeilen(frage)
  const gefiltert = passendeIndizes(zeilen, frage.suchtext)
  if (frage.sortSpalte < 0) return gefiltert
  const rows = gefiltert.map((i) => zeilen[i])
  return sortiereIndizes(rows, frage.sortSpalte, frage.sortAuf).map((k) => gefiltert[k])
}

export function tabelleAnsicht(frage: AnsichtFrage): TabelleAnsicht {
  // Die Spuren zaehlen die GEZEICHNETEN Spalten; die gezogene Breite steht
  // aber unter dem vollen Platz.
  const gezeichnet = frage.gezeichnet ?? frage.spalten
  const plaetze = frage.plaetze ?? gezeichnet.map((_, i) => i)
  const cols = {
    gridTemplateColumns: spaltenRaster(gezeichnet, (j) => frage.breiteVon?.(plaetze[j] ?? j)),
  }

  const takt = ZEILEN_HOEHE
  const zeilenHoehe = frage.gemessen?.zeilenHoehe ?? takt

  const hatQuelle = frage.hatQuelle

  // Mit Erfassungszeile gibt es keinen Leerzustand: die Zeile IST der Inhalt,
  // und die zentrierte Tafel schoebe sie an den Rumpf-Rand.
  const leer = frage.erfassungAn
    ? false
    : zeigtLeerzustand(hatQuelle, frage.datenGeliefert, frage.datenzeilen.length)

  const alleSichtbar = sichtbareIndizes(frage)

  const belegt = frage.erfassungAn ? 1 + frage.erfassteAnzahl : 0
  const gemessenPassen = frage.gemessen === null
    ? null
    : Math.max(1, frage.gemessen.passen - belegt)
  const proSeite = gemessenPassen ?? Math.max(1, OHNE_MESSUNG - belegt)
  const aufteilungsFrage = {
    sichtbar: alleSichtbar,
    hatQuelle,
    proSeite,
    wunschSeite: frage.wunschSeite,
    platzhalterZeilen: platzhalterZeilen(gemessenPassen),
  }
  const { seiten, seite, zeilen } = frage.blaettert
    ? seitenAufteilung(aufteilungsFrage)
    : rollAufteilung(aufteilungsFrage)
  return {
    cols,
    takt,
    zeilenHoehe,
    hatQuelle,
    leer,
    gesamt: alleSichtbar.length,
    seiten,
    seite,
    zeilen,

    linealTakte: linealTakte(gemessenPassen, zeilen.length),

    summen: summenVon(frage, alleSichtbar),
  }
}
