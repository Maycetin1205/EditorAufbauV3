// Die Editor-Angaben zu den Bausteinen: Symbole fuer Palette und Inspector.
import './register'

import { ergaenzeEditorAngaben } from '../core/blocks/editorAngaben'
import {
  ZeichenDatum,
  ZeichenFormularfeld,
  ZeichenKanban,
  ZeichenKanbanSpalte,
  ZeichenKarte,
  ZeichenNavi,
  ZeichenPopup,
  ZeichenSchaltflaeche,
  ZeichenTabelle,
  ZeichenText,
  ZeichenTrenner,
} from '../ui/bausteinZeichen'
import { ButtonBlock } from './button/ButtonBlock'
import { CardBlock } from './card/CardBlock'
import { DatumBlock } from './datum/DatumBlock'
import { FormFeldBlock } from './formfeld/FormFeldBlock'
import { KanbanBlock } from './kanban/KanbanBlock'
import { KanbanSpalteBlock } from './kanban/KanbanSpalteBlock'
import { NaviBlock } from './navi/NaviBlock'
import { NaviEintragBlock } from './navi/NaviEintragBlock'
import { PopupBlock } from './popup/PopupBlock'
import { TabelleBlock } from './tabelle/TabelleBlock'
import { TextBlock } from './text/TextBlock'
import { TrennerBlock } from './trenner/TrennerBlock'

// Sie stehen hier und nicht am Baustein, damit die Maske keinen Editor-Code traegt.
const SYMBOLE = [
  [ButtonBlock.blockType, ZeichenSchaltflaeche],
  [CardBlock.blockType, ZeichenKarte],
  [DatumBlock.blockType, ZeichenDatum],
  [FormFeldBlock.blockType, ZeichenFormularfeld],
  [KanbanBlock.blockType, ZeichenKanban],
  [KanbanSpalteBlock.blockType, ZeichenKanbanSpalte],
  [NaviBlock.blockType, ZeichenNavi],
  [NaviEintragBlock.blockType, ZeichenNavi],
  [PopupBlock.blockType, ZeichenPopup],
  [TabelleBlock.blockType, ZeichenTabelle],
  [TextBlock.blockType, ZeichenText],
  [TrennerBlock.blockType, ZeichenTrenner],
] as const

for (const [typ, symbol] of SYMBOLE) ergaenzeEditorAngaben(typ, { symbol })
