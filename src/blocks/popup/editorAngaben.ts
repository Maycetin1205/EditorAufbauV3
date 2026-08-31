import { ZeichenPopup } from '../../ui/bausteinZeichen'
import { ergaenzeEditorAngaben } from '../../core/blocks/editorAngaben'
import { PopupBlock } from './PopupBlock'

ergaenzeEditorAngaben(PopupBlock.blockType, {
  symbol: ZeichenPopup,
})
