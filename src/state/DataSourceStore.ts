// Die Datenquellen-Bibliothek der Maske.
import { pruefeDatenquellen, type DataSource } from '../core/data/dataSources'
import { VorlagenStore, type VorlagenBauplan } from './VorlagenStore'

const BAUPLAN: VorlagenBauplan<DataSource> = {
  schluessel: 'aufbau_editor_datenquellen_v1',
  huelle: 'sources',
  klarnameLesen: 'Datenquellen',
  klarnameSchreiben: 'Datenquellen',
  pruefe: pruefeDatenquellen,
  // Bewusst kein Startbestand.
}

export class DataSourceStore extends VorlagenStore<DataSource> {
  constructor(bestand?: readonly DataSource[], eigenerSpeicher = true) {
    super(BAUPLAN, bestand, eigenerSpeicher)
  }
}
