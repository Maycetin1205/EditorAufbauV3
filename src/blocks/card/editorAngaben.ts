import { ZeichenKarte } from '../../ui/bausteinZeichen'
import { ergaenzeEditorAngaben } from '../../core/blocks/editorAngaben'
import { CardBlock } from './CardBlock'

ergaenzeEditorAngaben(CardBlock.blockType, {
  symbol: ZeichenKarte,
})
