import { ZeichenDatum } from '../../ui/bausteinZeichen'
import { ergaenzeEditorAngaben } from '../../core/blocks/editorAngaben'
import { DatumBlock } from './DatumBlock'

ergaenzeEditorAngaben(DatumBlock.blockType, {
  symbol: ZeichenDatum,
})
