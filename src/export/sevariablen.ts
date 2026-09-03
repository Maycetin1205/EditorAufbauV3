import {
  artFuer,
  felderFor,
  holtSelbst,
  istOffenerSatz,
  kopfsatzFor,
  loopReihenfolge,
  tableIdFor,
  varAusKopfsaetzen,
  type DataSource,
} from '../core/data/dataSources'
import { escapeNonAsciiJs } from './serializer'

// Kopfsatz-Indizes und offene Saetze koennen auf DIESELBE Tabelle zeigen
// (POS haengt an BEL_0_11, der Belegkopf IST BEL). Zwei VAR-Eintraege mit
// derselben ID waeren eine doppelte Bestellung — die Felder gehoeren in EINEN
// Eintrag, in der Reihenfolge ihres ersten Auftretens.
function varZusammen(
  ...gruppen: { ID: string; FELDER: string }[][]
): { ID: string; FELDER: string }[] {
  const proId = new Map<string, string[]>()
  for (const eintrag of gruppen.flat()) {
    if (eintrag.ID === '') continue
    const codes = proId.get(eintrag.ID) ?? []
    for (const roh of eintrag.FELDER.split(',')) {
      const code = roh.trim()
      if (code !== '' && !codes.includes(code)) codes.push(code)
    }
    proId.set(eintrag.ID, codes)
  }
  return [...proId]
    .filter(([, codes]) => codes.length > 0)
    .map(([ID, codes]) => ({ ID, FELDER: codes.join(',') }))
}

export function baueSevariablen(
  used: readonly DataSource[],

  benutzteFelder: ReadonlyMap<string, ReadonlySet<string>>,

  holSchluessel: ReadonlyMap<string, string[]>,
): string {
  const bestellbar = used.filter((s) => !holtSelbst(s))
  const perApi = bestellbar.filter((s) => artFuer(s.kind).bestellBlock === 'erpapicall')
  const perDataSet = bestellbar.filter((s) => artFuer(s.kind).bestellBlock === 'dataset')

  // Der offene Satz wird NICHT als Loop bestellt: SoftEngine liefert ihn im
  // VAR-Abschnitt unter der Tabellen-ID (belegt an Rahmen00001 V11 — der
  // Belegkopf dort liest Daten.Var.BEL). Ein Loop daneben waere eine zweite
  // Bestellung derselben Werte.
  const offeneSaetze = bestellbar.filter(istOffenerSatz)

  const geordnet = loopReihenfolge(
    bestellbar.filter(
      (s) => artFuer(s.kind).bestellBlock === 'sefileloop' && !istOffenerSatz(s),
    ),
  )

  const erpapicall = perApi.map((s) => ({
    ID: tableIdFor(s),
    ALIAS: s.name,
    FELDER: felderFor(s, benutzteFelder.get(s.id), holSchluessel.get(s.id) ?? []),
  }))
  // DataSets legen ihre Zeilen unter Daten.Tabellen.<ALIAS> ab — dieselbe
  // Form wie MEMTAB, die rowsFor() schon liest (softengine/data.ts).
  const dataset = perDataSet.map((s) => ({
    ID: tableIdFor(s),
    ALIAS: s.name,
    FELDER: felderFor(s, benutzteFelder.get(s.id), holSchluessel.get(s.id) ?? []),
  }))
  const sefileloop = geordnet.map((s) => {
    const kopfsatz = kopfsatzFor(s)
    return {
      INDEX_NR: 0,
      ALIAS: s.name,
      ID: tableIdFor(s),
      ...(kopfsatz !== '' ? { KOPFSATZ_INDEX: kopfsatz } : {}),
      FELDER: felderFor(s, benutzteFelder.get(s.id), holSchluessel.get(s.id) ?? []),
    }
  })

  const varAbschnitt = varZusammen(
    varAusKopfsaetzen(geordnet),
    offeneSaetze.map((s) => ({
      ID: tableIdFor(s),
      FELDER: felderFor(s, benutzteFelder.get(s.id), holSchluessel.get(s.id) ?? []),
    })),
  )
  return escapeNonAsciiJs(
    JSON.stringify({
      ...(varAbschnitt.length > 0 ? { VAR: varAbschnitt } : {}),
      SEFILELOOP: sefileloop,
      ERPAPICALL: erpapicall,
      ...(dataset.length > 0 ? { DATASET: dataset } : {}),
    }, null, 2),
  ) + '\n'
}
