import { BUILTIN_RELATION_TEMPLATES, type RelationTemplate } from '../core/data/relations'
import { VorlagenStore } from './VorlagenStore'

export class RelationStore extends VorlagenStore<RelationTemplate> {
  constructor(bestand: readonly RelationTemplate[] = BUILTIN_RELATION_TEMPLATES) {
    super(bestand)
  }
}
