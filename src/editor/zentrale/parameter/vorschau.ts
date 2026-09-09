// Der Aufruf eines Relationsschritts in Worten: dieselbe Syntax, die hinausgeht,
// nur mit Klartext statt Feldcodes an den Stellen, die erst zur Laufzeit fallen.
import { formatRelationSyntax, type RelationTemplate } from '../../../core/data/relations'
import type { ActionParamBinding } from '../../../core/data/aktionen'
import { bindungsText } from './bindungsRegistry'
import type { ParameterWahlen } from './wahlen'

export function relationsVorschau(
  relation: Pick<RelationTemplate, 'verb' | 'nr'>,
  params: readonly ActionParamBinding[],
  extraParams: readonly ActionParamBinding[],
  wahlen: ParameterWahlen,
): string {
  return formatRelationSyntax({
    verb: relation.verb,
    nr: relation.nr,
    params: [...params, ...extraParams].map((binding) => bindungsText(binding, wahlen)),

    // Kein `...` am Ende: die Zeile zeigt den Aufruf DIESES Schritts, und was
    // die Vorlage noch erlauben wuerde, geht nicht mit hinaus.
    allowExtraParams: false,
  })
}
