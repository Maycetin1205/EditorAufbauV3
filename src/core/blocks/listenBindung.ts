import { zerlegeBindung } from './bindung'

export interface ListenBindung {
  prop: string

  titelKey: string

  feldKey: string

  // Gesetzt: jeder Eintrag trägt unter diesem Schlüssel eine dauerhafte
  // Kennung. Ketten-Parameter und Formulare zeigen dann auf SIE statt auf den
  // Platz — der Export übersetzt zurück in den Platz (withoutEditorId).
  // Platznummern verrutschen beim Löschen/Verschieben von Einträgen.
  kennungKey?: string

  standardTitel: string

  // Gesetzt: die Feld-Auswahl liest NUR die Bibliotheks-Quelle, deren id in
  // dieser Block-Eigenschaft steht (z. B. nachschlagQuelle) — nicht die
  // Quellen in Reichweite. Eintraege speichern den nackten Feldcode.
  quelleProp?: string

  eintragsSchalter?: readonly EintragsSchalter[]

  eintragsFeldWahl?: readonly EintragsFeldWahl[]

  // Element-Eigenschaft, in die der EDITOR je Eintrag den Klarnamen seiner
  // fremden Quelle schreibt (leer, wo alles aus der eigenen kommt). Sie steht
  // bewusst NICHT in defaultProps des Bausteins — daran haengt, dass der
  // Export sie nicht mitschreibt (exportMask liest `Object.keys(def.
  // defaultProps)`). Die Angabe gehoert in den Editor und nie in die Maske;
  // ein Test haelt das fest (export/herkunft.test.ts).
  herkunftProp?: string

  // Editier-Vorgaenge als REINE Funktionen ueber den Props des Bausteins: sie
  // geben die geaenderten Props zurueck (leer = nicht erlaubt). Der Editor
  // ruft sie (Werkzeugleiste am Baustein, Feld-Picker); der Baustein zeichnet
  // keine eigenen Knoepfe mehr in die Maske.
  eintragNeu?: (props: Readonly<Record<string, unknown>>) => Record<string, unknown>
  eintragWeg?: (props: Readonly<Record<string, unknown>>, index: number) => Record<string, unknown>
  eintragVerschieben?: (
    props: Readonly<Record<string, unknown>>,
    von: number,
    nach: number,
  ) => Record<string, unknown>

  // Eine weiterfuehrende Einstellung des Eintrags, die der BAUSTEIN selbst
  // zeichnet, weil sie ein eigenes Fenster braucht (Tabellenspalte: das
  // Suchfenster ihrer Erfassungszelle — dieselbe Flaeche, die das
  // Formularfeld ueber die Lupe oeffnet).
  //
  // Der Editor setzt dafuer nur `eigenschaft` am Custom-Element auf den Platz
  // des Eintrags; alles Weitere macht der Baustein. Er ruft KEINE Methode:
  // eine Eigenschaft ist der Weg, auf dem Lit ohnehin neu zeichnet, und sie
  // ueberlebt den naechsten Rendervorgang.
  eintragsUnterFenster?: {
    label: string
    hinweis?: string
    eigenschaft: string
  }

  // CSS-Auswahl (im Schatten-DOM des Bausteins) der Stellen, an denen der
  // Editor die Eintraege anfasst, in Listenreihenfolge. Der Editor legt seine
  // Bedienung darueber (Klick = Feld-Picker, Ziehen = Umordnen); der Baustein
  // zeichnet dafuer nichts und weiss nichts davon.
  eintragStellen?: string
}

// Ein ZWEITES Feld je Eintrag, unabhaengig von der gewaehlten Darstellung.
// Die Belegerfassung braucht beides gleichzeitig: die Spalte ZEIGT und
// SCHREIBT das Feld der Hauptquelle, das Fuellfeld holt den Wert beim
// Erfassen aus einer Hilfsquelle. Ein Feldcode kann nicht beides sein.
// `nurFremdeQuellen` haelt die Wahl bei den Hilfsquellen — ein Fuellfeld der
// Hauptquelle waere dasselbe Feld ein zweites Mal.
export interface EintragsFeldWahl {
  key: string

  label: string

  hinweis?: string

  nurFremdeQuellen?: boolean
}

// Ein Ja/Nein je Eintrag — z. B. „diese Spalte summieren".
export interface EintragsSchalter {
  key: string

  label: string

  // Wie der Schalter steht, solange niemand ihn angefasst hat. Ohne Angabe
  // aus. Gespeichert wird nur die ABWEICHUNG davon (listeFuerExport) — sonst
  // stuende in jedem Eintrag derselbe Wert.
  standard?: boolean

  // Gilt nur, solange das Feld des Eintrags zur EIGENEN Quelle gehoert. Fuer
  // „In der Zeile aenderbar" ist das Pflicht: eine Vormerkung wird ueber die
  // Satznummer der Hauptquellen-Zeile gefuehrt (blocks/tabelle/aenderungen.ts),
  // ein Feld einer Hilfsquelle waere also ein falsches Schreibziel.
  nurEigeneQuelle?: boolean

  // Ein Wort fuer die zugeklappte Kopfzeile („Mehr · Summe, nicht
  // aenderbar"). Das volle Label waere dort zu lang, und ohne den Hinweis
  // merkt niemand, dass hinter dem Pfeil etwas vom Standard abweicht.
  kurz?: string
}

export function schalterAn(
  schalter: EintragsSchalter,
  eintrag: Record<string, unknown>,
): boolean {
  const wert = eintrag[schalter.key]
  return typeof wert === 'boolean' ? wert : schalter.standard === true
}

// Welche Schalter dieser Eintrag ueberhaupt zeigt.
//
// Die EINE Stelle dafuer: das Kopf-Fenster zeichnet danach, die Tabelle
// entscheidet danach ueber das Tippen (spalteAenderbar), der Export danach
// ueber die Adressierbarkeit (treeQuery/traegtAenderungen) und darueber, was
// vom Schalterwert erhalten bleibt (listeFuerExport). Vier Leser, eine Regel.
export function schalterFuer(
  b: ListenBindung,
  eintrag: Record<string, unknown>,
): readonly EintragsSchalter[] {
  const feld = eintrag[b.feldKey]
  const ausFremderQuelle = typeof feld === 'string'
    && zerlegeBindung(feld).quelleId !== ''
  return (b.eintragsSchalter ?? [])
    .filter((s) => !(s.nurEigeneQuelle === true && ausFremderQuelle))
}

// Die zusaetzlichen Feldwahlen eines Eintrags mit ihrem aktuellen Wert. EINE
// Stelle fuer beide Leser: das Kopf-Fenster zeichnet danach, und der Export
// bestellt danach die Felder der Hilfsquelle. Liefen die auseinander, faende
// der Bediener sein Fuellfeld im Editor, waehrend die Maske es nie bekaeme.
export function feldWahlenLesen(
  b: ListenBindung,
  eintrag: Record<string, unknown>,
): { wahl: EintragsFeldWahl; wert: string }[] {
  return (b.eintragsFeldWahl ?? []).map((wahl) => {
    const roh = eintrag[wahl.key]
    return { wahl, wert: typeof roh === 'string' ? roh : '' }
  })
}

// Aus welcher FREMDEN Quelle ein Eintrag seinen Wert nimmt — leer, wenn alles
// aus der eigenen kommt. Genau eine Frage, genau eine Antwort: die
// zusaetzliche Feldwahl (das Fuellfeld) fuehrt, weil sie beim Erfassen zieht
// und man sie dem Eintrag sonst nicht ansieht; erst danach zaehlt das
// Hauptfeld. Steht nichts Fremdes drin, gibt es auch nichts anzuzeigen — eine
// Spalte auf der Hauptquelle ist der Normalfall und braucht keine Fussnote.
export function fremdeQuelleVon(
  b: ListenBindung,
  eintrag: Record<string, unknown>,
): string {
  const haupt = eintrag[b.feldKey]
  const kandidaten = [
    ...feldWahlenLesen(b, eintrag).map((f) => f.wert),
    typeof haupt === 'string' ? haupt : '',
  ]
  for (const wert of kandidaten) {
    const { quelleId } = zerlegeBindung(wert)
    if (quelleId !== '') return quelleId
  }
  return ''
}

export function listenStandardTitel(b: ListenBindung, index: number): string {
  return b.standardTitel.replace('{n}', String(index + 1))
}

export function listeLesen(roh: unknown, b: ListenBindung): Record<string, unknown>[] {
  if (!Array.isArray(roh)) return []
  return roh.map((x, i) => {
    if (x && typeof x === 'object') return { ...(x as Record<string, unknown>) }
    return {
      [b.titelKey]: typeof x === 'string' ? x : listenStandardTitel(b, i),
      [b.feldKey]: '',
    }
  })
}

// Ein Schluessel eines Eintrags, der nur unter einer Bedingung in den Export
// gehoert. Als Regeln und nicht als Aufzaehlung von Sonderfaellen.
interface BedingterSchluessel {
  key: string
  erlaubt: (eintrag: Record<string, unknown>) => boolean
}

function bedingteSchluessel(b: ListenBindung): BedingterSchluessel[] {
  const regeln: BedingterSchluessel[] = []
  for (const schalter of b.eintragsSchalter ?? []) {
    // Behalten wird ein Schalterwert nur, wenn er sichtbar ist UND vom
    // Standard abweicht. Ein ausdrueckliches „nein" bei Standard „ja" ist
    // damit genauso wichtig wie frueher das ausdrueckliche „ja".
    regeln.push({
      key: schalter.key,
      erlaubt: (e) => schalterFuer(b, e).includes(schalter)
        && schalterAn(schalter, e) !== (schalter.standard === true),
    })
  }
  return regeln
}

// Die EINE Stelle, die Eintrags-Kennungen ('s1', 's2', …) vergibt — der
// Baustein (blocks/tabelle/spalten.ts) und die Roh-Migration
// (state/migrationenRoh.ts) rufen sie beide. Fehlende und doppelte Kennungen
// bekommen eine neue, die vorderste behaelt ihre; bestehende bleiben
// unangetastet, an ihnen haengen Ketten-Parameter und Rechnung. Neue Kennung
// = HOECHSTE vergebene + 1, nie die niedrigste Luecke: eine geloeschte Nummer
// neu zu vergeben liesse alte Zeiger stumm auf die frische Spalte zeigen.
// Eine Kennung, die nicht 'sN' ist, zaehlt nicht mit; mit ihr kollidieren die
// neuen ohnehin nicht.
export function kennungenVergeben(vorhanden: readonly string[]): string[] {
  const vergeben = new Set<string>()
  for (const roh of vorhanden) {
    const k = roh.trim()
    if (k !== '') vergeben.add(k)
  }
  let naechste = 1
  for (const k of vergeben) {
    const treffer = /^s(\d+)$/.exec(k)
    if (treffer) naechste = Math.max(naechste, Number(treffer[1]) + 1)
  }
  const behalten = new Set<string>()
  return vorhanden.map((roh) => {
    const k = roh.trim()
    if (k !== '' && !behalten.has(k)) {
      behalten.add(k)
      return k
    }
    while (vergeben.has(`s${naechste}`)) naechste += 1
    const neu = `s${naechste}`
    vergeben.add(neu)
    behalten.add(neu)
    return neu
  })
}

export function listeFuerExport(roh: unknown, b: ListenBindung): unknown {
  if (!Array.isArray(roh)) return roh
  const regeln = bedingteSchluessel(b)
  if (regeln.length === 0) return roh
  return roh.map((x) => {
    if (!x || typeof x !== 'object') return x
    const eintrag = x as Record<string, unknown>
    const weg = regeln
      .filter((r) => r.key in eintrag && !r.erlaubt(eintrag))
      .map((r) => r.key)
    if (weg.length === 0) return x
    const kopie = { ...eintrag }
    for (const k of weg) delete kopie[k]
    return kopie
  })
}

