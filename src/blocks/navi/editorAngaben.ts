import { ZeichenNavi } from '../../ui/bausteinZeichen'
import { ergaenzeEditorAngaben } from '../../core/blocks/editorAngaben'
import { NaviBlock } from './NaviBlock'
import { NaviEintragBlock } from './NaviEintragBlock'

ergaenzeEditorAngaben(NaviBlock.blockType, {
  symbol: ZeichenNavi,
})

ergaenzeEditorAngaben(NaviEintragBlock.blockType, {
  symbol: ZeichenNavi,
})
