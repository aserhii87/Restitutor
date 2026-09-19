import { $t, L } from "../../utils/i18n";
import type { ICondition } from "../actions/GameAction";
import type { Province } from "../definitions/Province";
import { TimedActions } from "../definitions/TimedAction";
import type { SaveGame } from "../GameState";
import { getTimedActionTimeLeft } from "./TimedActionLogic";

export function ongoingThirdCenturyCrisisCondition(province: Province, save: SaveGame): ICondition {
   return {
      name: $t(L.$1IsOngoing, TimedActions.ThirdCenturyCrisis.name()),
      value: getTimedActionTimeLeft("ThirdCenturyCrisis", province, save) > 0,
   };
}
