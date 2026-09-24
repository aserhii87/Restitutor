import { $t, L } from "../../utils/i18n";
import type { Province } from "../definitions/Province";
import { ProvinceNameOverrides } from "../definitions/ProvinceNameOverrides";
import { TimedActions } from "../definitions/TimedAction";
import type { SaveGame } from "../GameState";
import { getAttitudeTowards, getRelation } from "../logic/DiplomacyLogic";
import { getNeighborProvinces } from "../logic/ProvinceLogic";
import { startTimedAction, timedActionConditions } from "../logic/TimedActionLogic";
import { EmptyGameAction } from "./EmptyGameAction";
import { finalizeCondition, type IGameAction } from "./GameAction";

export function ProclaimConquestAction(ourProvince: Province, theirProvince: Province, save: SaveGame): IGameAction {
   const relation = getRelation(ourProvince, theirProvince, save);
   if (!relation) {
      return EmptyGameAction;
   }
   return {
      condition: finalizeCondition([
         {
            name: $t(L.WeHaveFormed$1, ProvinceNameOverrides.HunnicEmpire()),
            value: save.state.provinces[ourProvince]?.nameOverride === "HunnicEmpire",
         },
         ...timedActionConditions({ action: "ProclaimConquest" }, ourProvince, save),
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
         relation.casusBelli.set("ConquestMission", {
            monthsLeft: TimedActions.ProclaimConquest.duration,
         });
         startTimedAction("ProclaimConquest", ourProvince, save);
      },
   };
}
