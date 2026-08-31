import { useState } from 'react'
import { Feld } from '@/ui/werkbank/Feld'
import { Knopf } from '@/ui/werkbank/Knopf'
import { Zeile } from '@/ui/werkbank/Zeile'
import {
  artFuer,
  feldVorsatzFromInput,
  kennungAnzeige,
  kennungFromInput,
  kopfsatzFromInput,
  LADE_RELATION_STANDARD,
  QUELLEN_ARTEN,
  quellenKennung,
  relationNrFromInput,
  type DataSource,
  type DataSourceKind,
} from '../../core/data/dataSources'
import { useDataSources } from '../../state/useDataSources'
import { PickerControl } from '../inspector/controls/PickerControl'
import { SelectControl } from '../inspector/controls/SelectControl'
import { FeldListe } from './FeldListe'
import {
  LEERE_ZEILE,
  zeileFromField,
  zeileGefuellt,
  zeilenCode,
  type FeldZeile,
} from './feldZeile'
import { FormularKarte } from './FormularKarte'

const FELDCODE = /^\d+_\d+$/

interface DataSourceFormProps {
  source?: DataSource
  onClose: () => void
}

export function DataSourceForm({ source, onClose }: DataSourceFormProps) {
  const store = useDataSources()
  const [name, setName] = useState(source?.name ?? '')
  const [kind, setKind] = useState<DataSourceKind>(source?.kind ?? 'idb')
  const [kennungEingabe, setKennungEingabe] = useState(kennungAnzeige(source?.idbId))
  const [kopfsatzEingabe, setKopfsatzEingabe] = useState(source?.kopfsatzIndex ?? '')

  const [vorsatzEingabe, setVorsatzEingabe] = useState(source?.feldVorsatz ?? '')

  const [lieferung, setLieferung] = useState<'liste' | 'offenerSatz'>(
    source?.lieferung ?? 'liste',
  )

  const lade = source?.ladeRelation
  const [zeilenWeg, setZeilenWeg] = useState<'geschoben' | 'holen'>(lade ? 'holen' : 'geschoben')
  const [relationNr, setRelationNr] = useState(lade?.nr ?? LADE_RELATION_STANDARD.nr)
  const [geberQuelleId, setGeberQuelleId] = useState(lade?.geberQuelleId ?? '')
  const feldZuordnung = {
    belegartFeld: lade?.belegartFeld ?? LADE_RELATION_STANDARD.belegartFeld,
    belegnummerFeld: lade?.belegnummerFeld ?? LADE_RELATION_STANDARD.belegnummerFeld,
    jahrFeld: lade?.jahrFeld ?? LADE_RELATION_STANDARD.jahrFeld,
    archivFeld: lade?.archivFeld ?? LADE_RELATION_STANDARD.archivFeld,
    endeFelder: lade?.endeFelder ?? LADE_RELATION_STANDARD.endeFelder,
  }
  const [zeilen, setZeilen] = useState<FeldZeile[]>(
    source && source.fields.length > 0

      ? source.fields.map((f) => zeileFromField(
          f, source.feldVorsatz ?? '', artFuer(source.kind).spaltenNamen,
        ))
      : [{ ...LEERE_ZEILE }],
  )

  const [satzNummer, setSatzNummer] = useState(source?.indexField ?? '')

  const [zeigeFehler, setZeigeFehler] = useState(false)

  const art = artFuer(kind)
  const kennungEingeben = art.tabellenId === ''

  const kopfsatzEingeben = art.kopfsatzMoeglich

  const holenMoeglich = art.relationLadenMoeglich

  const vorsatz = feldVorsatzFromInput(vorsatzEingabe)

  // Der Vorsatz steckt in JEDEM Feldcode dieser Quelle. Wer die Art
  // wechselt, soll ihn deshalb sehen und selbst entfernen — versteckte
  // ihn das Formular (weil die neue Art keinen vorsieht), fielen die
  // Codes beim Speichern still auf die Form ohne Vorsatz zurueck.
  const vorsatzEingeben = art.feldVorsatzMoeglich || vorsatz !== ''
  const holtZeilen = holenMoeglich && zeilenWeg === 'holen'

  // Der offene Satz kommt aus dem VAR-Abschnitt und ist deshalb weder eine
  // Schleife noch etwas, das die Maske sich holt — die beiden Wege schliessen
  // sich aus. Wo die Art keinen offenen Satz kennt, gibt es die Frage nicht.
  const lieferungWaehlbar = art.varMoeglich && !holtZeilen
  const offenerSatz = lieferungWaehlbar && lieferung === 'offenerSatz'

  const geberOptionen = store.list.filter((s) => s.id !== source?.id)

  function waehleArt(neu: DataSourceKind): void {
    setKind(neu)
    const neueArt = artFuer(neu)
    if (neueArt.standardFelder.length > 0 && !zeilen.some(zeileGefuellt)) {
      setZeilen(neueArt.standardFelder.map((f) => zeileFromField(f)))
    }
    if (neueArt.kopfsatzStandard !== '' && kopfsatzEingabe.trim() === '') {
      setKopfsatzEingabe(neueArt.kopfsatzStandard)
    }
  }

  const nameFehler = name.trim() === '' ? 'Anzeigename fehlt.' : ''
  const kennungFehler =
    kennungEingeben && kennungFromInput(kennungEingabe, art.idbKurzform) === ''
      ? `${art.kennungLabel} fehlt (z. B. ${art.kennungBeispiel}).`
      : ''

  const kopfsatzFehler =
    kopfsatzEingeben && kopfsatzEingabe.trim() !== '' && kopfsatzFromInput(kopfsatzEingabe) === ''
      ? 'Ungültig — Beispiel: BEL_0_11.'
      : ''
  const zeilenFehler = zeilen.map((z) => {
    if (z.label.trim() === '') return 'Klarname fehlt.'
    if (!art.spaltenNamen && FELDCODE.test(z.label.trim())) {
      return 'Klarname darf kein Feldcode sein.'
    }
    if (zeilenCode(z, vorsatz, art.spaltenNamen) === '') {
      return art.spaltenNamen
        ? 'Spaltenname fehlt (ohne Komma).'
        : 'Position und Länge als Zahlen angeben.'
    }
    return ''
  })
  const codes = zeilen.map((z) => zeilenCode(z, vorsatz, art.spaltenNamen))
  const doppeltFehler = codes.some((c, i) => c !== '' && codes.indexOf(c) !== i)
    ? (art.spaltenNamen
        ? 'Zwei Felder zeigen auf dieselbe Spalte.'
        : 'Zwei Felder haben dieselbe Position + Länge.')
    : ''

  // Gewaehlt wird ein FELD der Quelle, nicht ein getippter Code (Regel 3):
  // der Klarname steht vorn, der Feldcode daneben.
  const satzNummerOptionen = [
    { value: '', label: '— keine —' },
    ...zeilen
      .map((z, i) => ({ code: codes[i] ?? '', label: z.label.trim() }))
      .filter((e) => e.code !== '' && e.label !== '')
      .map((e) => ({ value: e.code, label: e.label, detail: e.code })),
  ]
  // Ein Wert, der zu keinem Feld gehoert, bleibt sichtbar statt still zu
  // verschwinden — sonst aendert das blosse Oeffnen des Formulars die Quelle.
  if (satzNummer !== '' && !satzNummerOptionen.some((o) => o.value === satzNummer)) {
    satzNummerOptionen.push({
      value: satzNummer, label: satzNummer, detail: 'kein Feld dieser Quelle',
    })
  }

  const relationNrFehler = holtZeilen && relationNrFromInput(relationNr) === ''
    ? 'Relationsnummer fehlt — nur Ziffern.'
    : ''
  const geberFehler = holtZeilen && geberQuelleId === ''
    ? 'Wähle die Quelle, in der der Beleg angeklickt wird.'
    : ''
  const alleFehler = [
    nameFehler, kennungFehler, kopfsatzFehler, doppeltFehler,
    relationNrFehler, geberFehler,
    ...zeilenFehler,
  ]

  function speichern() {
    if (alleFehler.some((f) => f !== '')) {
      setZeigeFehler(true)
      return
    }
    const daten: Omit<DataSource, 'id'> = {
      name: name.trim(),
      kind,
      ...(kennungEingeben ? { idbId: kennungFromInput(kennungEingabe, art.idbKurzform) } : {}),

      ...(kopfsatzEingeben && kopfsatzFromInput(kopfsatzEingabe) !== ''
        ? { kopfsatzIndex: kopfsatzFromInput(kopfsatzEingabe) }
        : {}),

      ...(vorsatz !== '' ? { feldVorsatz: vorsatz } : {}),

      ...(offenerSatz ? { lieferung: 'offenerSatz' as const } : {}),

      ...(art.satzNummerMoeglich && satzNummer !== ''
        ? { indexField: satzNummer }
        : {}),

      ...(holtZeilen
        ? {
            ladeRelation: {
              nr: relationNrFromInput(relationNr),
              geberQuelleId,
              ...feldZuordnung,
            },
          }
        : {}),
      fields: zeilen.map((z) => ({
        code: zeilenCode(z, vorsatz, art.spaltenNamen),
        label: z.label.trim(),
      })),
    }
    if (source) store.update(source.id, daten)
    else store.add(daten)
    onClose()
  }

  return (
    <FormularKarte title={source ? 'Datenquelle bearbeiten' : 'Neue Datenquelle'} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <Zeile label="Anzeigename" fehler={zeigeFehler ? nameFehler : undefined}>
          {(f) => (
            <Feld
              {...f}
              value={name}
              placeholder="z. B. Terminplaner"
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </Zeile>

        <SelectControl
          label="Art"
          value={kind}
          options={QUELLEN_ARTEN.map((a) => ({ value: a.id, label: a.name }))}
          onChange={(v) => waehleArt(v as DataSourceKind)}
        />

        {kennungEingeben && (
          <Zeile label={art.kennungLabel} fehler={zeigeFehler ? kennungFehler : undefined}>
            {(f) => (
              <Feld
                {...f}
                value={kennungEingabe}
                placeholder={`z. B. ${art.kennungBeispiel}`}
                className="w-32"
                onChange={(e) => setKennungEingabe(e.target.value)}
              />
            )}
          </Zeile>
        )}

        {vorsatzEingeben && (
          <Zeile label="Feld-Vorsatz">
            {(f) => (
              <Feld
                {...f}
                value={vorsatzEingabe}
                placeholder="z. B. LFA_"
                className="w-32"
                onChange={(e) => setVorsatzEingabe(e.target.value)}
              />
            )}
          </Zeile>
        )}

        {lieferungWaehlbar && (
          <SelectControl
            label="Was liefert die Quelle?"
            value={lieferung}
            options={[
              { value: 'liste', label: 'Mehrere Sätze — eine Liste' },
              { value: 'offenerSatz', label: 'Nur den Satz, der gerade offen ist' },
            ]}
            onChange={(v) => setLieferung(v as 'liste' | 'offenerSatz')}
          />
        )}

        {holenMoeglich && !offenerSatz && (
          <SelectControl
            label="Woher kommen die Zeilen?"
            value={zeilenWeg}
            options={[
              { value: 'geschoben', label: 'SoftEngine schickt sie beim Laden' },
              { value: 'holen', label: 'Die Maske holt sie, sobald ein Beleg angeklickt ist' },
            ]}
            onChange={(v) => setZeilenWeg(v as 'geschoben' | 'holen')}
          />
        )}
        {holtZeilen && (
          <>
            <Zeile
              label="Relationsnummer"
              fehler={zeigeFehler ? relationNrFehler : undefined}
            >
              {(f) => (
                <Feld
                  {...f}
                  value={relationNr}
                  className="w-24"
                  onChange={(e) => setRelationNr(e.target.value)}
                />
              )}
            </Zeile>
            {/* Keine Leer-Option: eine leere Quelle ist hier ein Fehler
                (geberFehler), also darf sie nicht wählbar sein. */}
            <PickerControl
              label="Beleg kommt aus"
              bezeichnung="Beleg kommt aus"
              fehler={zeigeFehler && geberFehler !== '' ? geberFehler : undefined}
              gruppen={[{
                key: 'quellen',
                eintraege: geberOptionen.map((s) => ({
                  wert: s.id,
                  name: s.name,
                  kennung: quellenKennung(s),
                })),
              }]}
              wert={geberQuelleId}
              platzhalter="— Quelle wählen —"
              onWaehle={setGeberQuelleId}
            />
          </>
        )}

        {kopfsatzEingeben && !holtZeilen && (
          <Zeile
            label="Gehört zu"
            fehler={zeigeFehler ? kopfsatzFehler : undefined}
          >
            {(f) => (
              <Feld
                {...f}
                value={kopfsatzEingabe}
                placeholder="z. B. BEL_0_11"
                className="w-32"
                onChange={(e) => setKopfsatzEingabe(e.target.value)}
              />
            )}
          </Zeile>
        )}

        <FeldListe
          spaltenNamen={art.spaltenNamen}
          zeilen={zeilen}
          setZeilen={setZeilen}
          zeilenFehler={zeilenFehler}
          doppeltFehler={doppeltFehler}
          zeigeFehler={zeigeFehler}
        />

        {art.satzNummerMoeglich && (
          <SelectControl
            label="Satznummer"
            description="Macht eine Zeile eindeutig. Ohne sie kann die Maske neue Zeilen anlegen, aber keine bestehende ändern oder löschen."
            value={satzNummer}
            options={satzNummerOptionen}
            onChange={setSatzNummer}
          />
        )}

        <div className="flex justify-end gap-2 border-t border-linie pt-3">
          <Knopf onClick={onClose}>Abbrechen</Knopf>
          <Knopf art="primaer" onClick={speichern}>Speichern</Knopf>
        </div>
      </div>
    </FormularKarte>
  )
}
