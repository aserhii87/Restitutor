import type { Tile } from "@project/shared/src/utils/Helper";
import { showPanel } from "../../ui/common/ShowPanel";
import { TilePage } from "../../ui/TilePage";
import type { Province } from "../definitions/Province";
import type { SaveGame } from "../GameState";
import { toConditions } from "../logic/Calculation";
import { settleTileChecks, startSettlement } from "../logic/SettlementLogic";
import { startTimedAction, timedActionConditions } from "../logic/TimedActionLogic";
import { finalizeCondition, type IGameAction } from "./GameAction";

export function SettleTileAction(tile: Tile, province: Province, save: SaveGame): IGameAction {
   return {
      cost: { mandate: 1 },
      condition: finalizeCondition([
         ...toConditions(settleTileChecks(tile, province, save)),
         ...timedActionConditions({ action: "SettleTile" }, province, save),
      ]),
      execute: ({ headless }) => {
         startTimedAction("SettleTile", province, save);
         startSettlement(tile, province, save);
         if (!headless) {
            showPanel(TilePage, { tile });
         }
      },
   };
}
