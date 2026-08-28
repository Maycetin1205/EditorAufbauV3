import { verknuepfungenVon } from '../shared/fremdeQuellen'
import { ErfassungsLauf } from './erfassungsLauf'
import type { ErfassungsUmfeld } from './erfassungsZellen'
import type { Spalte } from './spalten'

// Der Erfassungs-Anteil des Tabellen-Bausteins als EIN Stand: der laufende
// Tipp-Zustand (ErfassungsLauf) und die erfassten, noch nicht geschriebenen
// Zeilen. Als eigene Naht, damit der Baustein unter seinem Zeilen-Deckel
// bleibt — er delegiert nur und entscheidet, wann neu gerendert wird.
export class ErfassungsAnschluss {
  readonly lauf = new ErfassungsLauf()

  private _zeilen: { kennung: string; werte: string[] }[] = []

  private naechsteKennung = 1

  // Die Zeile, die gerade zur Korrektur OBEN in der Erfassungszeile steht, mit
  // ihrer Kennung und ihrem Platz in der Liste. Sie ist solange nicht in
  // `_zeilen` — sie wird ja gerade getippt.
  private _zurueck: { kennung: string; platz: number } | null = null

  // Was die LISTE zeigt: die abgelegten Zeilen. Die zur Korrektur
  // zurueckgeholte fehlt hier absichtlich, sie steht oben.
  get zeilen(): readonly (readonly string[])[] {
    return this._zeilen.map((z) => z.werte)
  }

  // Was die KETTE und der Zaehler sehen: dieselben Zeilen PLUS die gerade oben
  // stehende, an ihrem Platz. Ohne sie fehlte beim Schreiben ausgerechnet die
  // Zeile, die der Bediener vor Augen hat, und der Knopf zaehlte sie nicht
  // mit — ein stiller Verlust genau dort, wo er am meisten weh tut.
  vormerkungen(umfeld: ErfassungsUmfeld): { kennung: string; werte: readonly string[] }[] {
    const alle = this._zeilen.map((z) => ({ kennung: z.kennung, werte: z.werte as readonly string[] }))
    const zurueck = this._zurueck
    if (!zurueck) return alle
    const oben = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
    if (oben.every((w) => w === '')) return alle
    return [
      ...alle.slice(0, zurueck.platz),
      { kennung: zurueck.kennung, werte: oben },
      ...alle.slice(zurueck.platz),
    ]
  }

  // Dieselbe Reihenfolge, aber die Kennungen: der Ketten-Bericht sagt damit,
  // WELCHE Zeile geschrieben ist — der Platz taugt dafuer nicht, er
  // verschiebt sich, sobald der Bediener eine Zeile wegnimmt.
  get schluessel(): readonly string[] {
    return this._zeilen.map((z) => z.kennung)
  }

  // Die Erfassungszeile leitet alles aus zwei vorhandenen Angaben ab: der
  // Bindung jeder Spalte und der Verknuepfung des Bausteins (Attribut am
  // Element) — sie braucht keine eigene Einstellung.
  umfeld(el: HTMLElement, spalten: readonly Spalte[], quelleId: string): ErfassungsUmfeld {
    const verknuepfungen = verknuepfungenVon(el)
    return {
      spalten,
      quelleId,
      paareZu: (id) => verknuepfungen.find((v) => v.quelleId === id)?.keyPairs ?? [],
      partnerVon: (id) => verknuepfungen.find((v) => v.quelleId === id)?.partnerId ?? '',
    }
  }

  // Enter am Zeilenende: die Zeile bleibt stehen, die Erfassung beginnt leer
  // von vorn (G4). Eine ganz leere Zeile wird nicht erfasst.
  //
  // Stand die Zeile zur Korrektur oben, geht sie an IHREN Platz zurueck und
  // behaelt ihre Kennung — sonst spraenge eine korrigierte Zeile ans Ende der
  // Liste, und der Ketten-Bericht koennte sie nicht mehr wiedererkennen.
  erfasse(umfeld: ErfassungsUmfeld): boolean {
    const werte = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
    const zurueck = this._zurueck
    if (werte.every((w) => w === '')) {
      // Eine leer geraeumte Rueckholung ist eine Wegnahme: der Bediener hat
      // jede Zelle geleert. Sie kommt nicht zurueck — dasselbe Ergebnis wie
      // ein Klick auf das Kreuz, und sichtbar, weil die Zeile fehlt. Vorher
      // war genau das der Weg zu einer LEERZEILE im ERP: leer getippt, aber
      // weiter vorgemerkt.
      if (!zurueck) return false
      this._zurueck = null
      this.lauf.zuruecksetzen()
      return true
    }
    if (zurueck) {
      this._zeilen = [
        ...this._zeilen.slice(0, zurueck.platz),
        { kennung: zurueck.kennung, werte },
        ...this._zeilen.slice(zurueck.platz),
      ]
      this._zurueck = null
    } else {
      this._zeilen = [...this._zeilen, { kennung: `e${this.naechsteKennung}`, werte }]
      this.naechsteKennung += 1
    }
    this.lauf.zuruecksetzen()
    return true
  }

  // Eine erfasste Zeile ist bis zum Schreiben nichts als eine Vormerkung —
  // also bleibt sie korrigierbar. Sie kommt dafuer ZURUECK in die
  // Erfassungszeile, statt an Ort und Stelle ein Textfeld zu sein: dort hat
  // sie wieder die ganze Bedienung (Vorschlagsliste, F4-Fenster, Enter-Fluss).
  // An Ort und Stelle hatte sie davon nichts — wer eine Artikelnummer
  // ausloeschte, bekam keine Saetze mehr angeboten, und die Nachbarzellen
  // blieben mit den Werten des alten Artikels stehen.
  zurueckholen(umfeld: ErfassungsUmfeld, index: number): boolean {
    const zeile = this._zeilen[index]
    if (!zeile) return false
    // Was gerade oben steht, gehoert erst an seinen Platz — sonst ginge es
    // beim Klick auf die naechste Zeile verloren.
    this.erfasse(umfeld)
    const jetzt = this._zeilen.indexOf(zeile)
    if (jetzt === -1) return false
    this._zeilen = this._zeilen.filter((_, i) => i !== jetzt)
    this._zurueck = { kennung: zeile.kennung, platz: jetzt }
    this.lauf.uebernimmWerte(zeile.werte)
    return true
  }

  // Eine erfasste Zeile wieder wegnehmen — vor dem Schreiben ist sie nichts
  // als eine Vormerkung. Ohne diesen Weg bliebe ein Vertipper stehen, bis
  // die Kette ihn in die ERP traegt.
  entferne(index: number): boolean {
    if (index < 0 || index >= this._zeilen.length) return false
    this._zeilen = this._zeilen.filter((_, i) => i !== index)
    return true
  }

  // Was die Kette geschrieben hat, ist keine Vormerkung mehr. Alles andere
  // bleibt stehen — auch die Zeile, an der der Lauf haengengeblieben ist.
  austragen(kennungen: readonly string[]): boolean {
    if (kennungen.length === 0) return false
    const bleibt = this._zeilen.filter((z) => !kennungen.includes(z.kennung))
    // Auch die zur Korrektur oben stehende Zeile kann geschrieben worden sein
    // — die Kette sieht sie (vormerkungen). Bleibt sie danach oben, tippte
    // der Bediener an einer Zeile weiter, die es im ERP schon gibt.
    const obenGeschrieben = this._zurueck !== null && kennungen.includes(this._zurueck.kennung)
    if (obenGeschrieben) {
      this._zurueck = null
      this.lauf.zuruecksetzen()
    }
    if (bleibt.length === this._zeilen.length) return obenGeschrieben
    this._zeilen = bleibt
    return true
  }

  zuruecksetzen(): void {
    this._zeilen = []
    this._zurueck = null
    this.lauf.zuruecksetzen()
  }
}
