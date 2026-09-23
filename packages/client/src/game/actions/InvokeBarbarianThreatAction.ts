import { $t, L } from "../../utils/i18n";
import type { Province } from "../definitions/Province";
import { hasProvinceUpgradeCondition } from "../definitions/ProvinceUpgrades";
import { TimedActions } from "../definitions/TimedAction";
import type { SaveGame } from "../GameState";
import { getAttitudeTowards, getRelation } from "../logic/DiplomacyLogic";
import { getNeighborProvinces } from "../logic/ProvinceLogic";
import { startTimedAction, timedActionConditions } from "../logic/TimedActionLogic";
import { EmptyGameAction } from "./EmptyGameAction";
import { finalizeCondition, type IGameAction } from "./GameAction";

export function InvokeBarbarianThreatAction(
   ourProvince: Province,
   theirProvince: Province,
   save: SaveGame,
): IGameAction {
   const relation = getRelation(ourProvince, theirProvince, save);
   if (!relation) {
      return EmptyGameAction;
   }
   return {
      condition: finalizeCondition([
         hasProvinceUpgradeCondition("MandateOfPacification", ourProvince, save),
         ...timedActionConditions({ action: "InvokeBarbarianThreat" }, ourProvince, save),
         {
            name: $t(L.WeShareALandBorderWithThem),
            value: getNeighborProvinces(ourProvince, save).has(theirProvince),
         },
         {
            name: $t(L.TheirAttitudeTowardsUsIsNegative),
            value: getAttitudeTowards(theirProvince, ourProvince, save).value < 0,
         },
      ]),
      execute: () => {
         relation.casusBelli.set("HumiliateRival", {
            monthsLeft: TimedActions.InvokeBarbarianThreat.duration,
         });
         startTimedAction("InvokeBarbarianThreat", ourProvince, save);
      },
   };
}
