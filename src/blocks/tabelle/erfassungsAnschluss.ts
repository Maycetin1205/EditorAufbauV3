import type { Rechnung } from '../../core/data/rechnung'
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

  // `geschrieben` heisst: die Kette hat diese Zeile hinausgeschickt. Sie ist
  // dann keine Vormerkung mehr (zaehlt nicht, wird nicht noch einmal
  // geschickt), bleibt aber SICHTBAR — bis SoftEngine neue Daten liefert, in
  // denen sie steht.
  private _zeilen: { kennung: string; werte: string[]; geschrieben?: true }[] = []

  private naechsteKennung = 1

  // Die Zeile, die gerade AN ORT UND STELLE korrigiert wird, mit ihrer
  // Kennung und ihrem Platz in der Liste. Sie ist solange nicht in `_zeilen`
  // — sie wird ja gerade getippt; die Tipp-Zeile zeichnet an ihrem Platz
  // (korrekturPlatz), und Enter setzt sie genau dorthin zurueck.
  private _zurueck: { kennung: string; platz: number } | null = null

  // Wo die Tipp-Zeile gerade sitzt: null = unten (neue Zeile anlegen), sonst
  // der Platz der Zeile, die an Ort und Stelle korrigiert wird. Nichts
  // springt, nichts sortiert sich um (Nutzer 2026-09-01).
  get korrekturPlatz(): number | null {
    return this._zurueck === null ? null : this._zurueck.platz
  }

  // Was die LISTE zeigt: die abgelegten Zeilen. Die zur Korrektur geoeffnete
  // fehlt hier absichtlich — an ihrem Platz zeichnet die Tipp-Zeile.
  get zeilen(): readonly (readonly string[])[] {
    return this._zeilen.map((z) => z.werte)
  }

  // Was die KETTE und der Zaehler sehen: dieselben Zeilen PLUS die gerade oben
  // stehende, an ihrem Platz. Ohne sie fehlte beim Schreiben ausgerechnet die
  // Zeile, die der Bediener vor Augen hat, und der Knopf zaehlte sie nicht
  // mit — ein stiller Verlust genau dort, wo er am meisten weh tut.
  vormerkungen(umfeld: ErfassungsUmfeld): { kennung: string; werte: readonly string[] }[] {
    const alle = this._zeilen
      .filter((z) => z.geschrieben !== true)
      .map((z) => ({ kennung: z.kennung, werte: z.werte as readonly string[] }))
    const zurueck = this._zurueck
    if (!zurueck) return alle
    const oben = umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i))
    if (oben.every((w) => w === '')) return alle
    // Ihr Platz zaehlt in der GEFILTERTEN Liste: geschriebene Zeilen stehen
    // noch dazwischen, gehoeren aber nicht mehr dazu. Ohne das Umrechnen
    // rutschte die Zeile mit jeder geschriebenen Zeile vor ihr nach hinten.
    const platz = this._zeilen
      .slice(0, zurueck.platz)
      .filter((z) => z.geschrieben !== true).length
    return [
      ...alle.slice(0, platz),
      { kennung: zurueck.kennung, werte: oben },
      ...alle.slice(platz),
    ]
  }

  // Ist diese Zeile schon hinausgeschickt? Der Aufrufer zeigt sie dann anders
  // an und laesst sie nicht mehr zur Korrektur zurueckholen.
  istGeschrieben(index: number): boolean {
    return this._zeilen[index]?.geschrieben === true
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
  umfeld(
    el: HTMLElement,
    spalten: readonly Spalte[],
    quelleId: string,
    rechnung: Rechnung | null = null,
  ): ErfassungsUmfeld {
    const verknuepfungen = verknuepfungenVon(el)
    return {
      spalten,
      quelleId,
      paareZu: (id) => verknuepfungen.find((v) => v.quelleId === id)?.keyPairs ?? [],
      partnerVon: (id) => verknuepfungen.find((v) => v.quelleId === id)?.partnerId ?? '',
      rechnung,
    }
  }

  // Enter am Zeilenende: die Zeile bleibt stehen, die Erfassung beginnt leer
  // von vorn (G4). Eine ganz leere Zeile wird nicht erfasst.
  //
  // Stand die Zeile zur Korrektur oben, geht sie an IHREN Platz zurueck und
  // behaelt ihre Kennung — sonst spraenge eine korrigierte Zeile ans Ende der
  // Liste, und der Ketten-Bericht koennte sie nicht mehr wiedererkennen.
  erfasse(umfeld: ErfassungsUmfeld): boolean {
    // Der gerechnete Platz muss den letzten Stand tragen, BEVOR die Zeile
    // eingefroren wird — nicht erst beim nächsten Zeichnen.
    this.lauf.rechne(umfeld)
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
  // also bleibt sie korrigierbar, AN ORT UND STELLE: die Zeile selbst wird
  // wieder zur Tipp-Zeile (die Tipp-Zeile zeichnet an korrekturPlatz), mit
  // der ganzen Bedienung — Vorschlagsliste, F4-Fenster, Enter-Fluss. Zwei
  // fruehere Anlaeufe waren schlechter: nackte Textfelder in der Zeile
  // (keine Vorschlaege, Nachbarzellen blieben stehen) und danach das
  // Teleportieren in die untere Erfassungszeile (die Liste "sortierte sich
  // um", Nutzer-Befund 2026-09-01).
  zurueckholen(umfeld: ErfassungsUmfeld, index: number): boolean {
    const zeile = this._zeilen[index]
    // Eine hinausgeschickte Zeile kommt nicht zurueck: sie steht nur noch als
    // Beleg da, dass geschrieben wurde. Ein zweites Enter wuerde sie ein
    // zweites Mal schicken.
    if (!zeile || zeile.geschrieben === true) return false
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

  // Was die Kette hinausgeschickt hat, ist keine Vormerkung mehr — aber es
  // verschwindet NICHT. Frueher flog die Zeile hier aus der Liste, und die
  // Maske wartete darauf, dass SoftEngine sie als gebuchte Zeile nachliefert.
  // Blieb die Lieferung aus (oder hatte die ERP den PUT abgelehnt, was ein
  // Einweg-Ruf nicht meldet), war die Eingabe des Bedieners spurlos weg.
  markiereGeschrieben(umfeld: ErfassungsUmfeld, kennungen: readonly string[]): boolean {
    if (kennungen.length === 0) return false
    let geaendert = false
    this._zeilen = this._zeilen.map((z) => {
      if (z.geschrieben === true || !kennungen.includes(z.kennung)) return z
      geaendert = true
      return { ...z, geschrieben: true }
    })
    // Auch die zur Korrektur oben stehende Zeile kann geschrieben worden sein
    // — die Kette sieht sie (vormerkungen). Sie geht an ihren Platz zurueck,
    // markiert; oben stehen bliebe sie sonst als tippbare Zeile, die es im
    // ERP schon gibt.
    const zurueck = this._zurueck
    if (zurueck !== null && kennungen.includes(zurueck.kennung)) {
      this._zeilen = [
        ...this._zeilen.slice(0, zurueck.platz),
        {
          kennung: zurueck.kennung,
          werte: umfeld.spalten.map((_, i) => this.lauf.wertVon(umfeld, i)),
          geschrieben: true,
        },
        ...this._zeilen.slice(zurueck.platz),
      ]
      this._zurueck = null
      this.lauf.zuruecksetzen()
      geaendert = true
    }
    return geaendert
  }

  // Erst eine echte Lieferung beweist, dass der neue Stand da ist. Dann sind
  // die geschriebenen Zeilen doppelt zu sehen — als gebuchte Zeile der Quelle
  // und als Erfassung — und die Erfassung geht.
  vergissGeschriebene(): boolean {
    const bleibt = this._zeilen.filter((z) => z.geschrieben !== true)
    if (bleibt.length === this._zeilen.length) return false
    this._zeilen = bleibt
    return true
  }

  zuruecksetzen(): void {
    this._zeilen = []
    this._zurueck = null
    this.lauf.zuruecksetzen()
  }
}
