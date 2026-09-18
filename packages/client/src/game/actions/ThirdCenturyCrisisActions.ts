import { $t, L } from "../../utils/i18n";
import type { Province } from "../definitions/Province";
import { TimedActions } from "../definitions/TimedAction";
import type { SaveGame } from "../GameState";
import { getNeighborProvinces, getProvinceName } from "../logic/ProvinceLogic";
import { ongoingThirdCenturyCrisisCondition } from "../logic/ThirdCenturyCrisisLogic";
import { startTimedAction, timedActionConditions } from "../logic/TimedActionLogic";
import { finalizeCondition, type IGameAction, type IGameEffectWithName } from "./GameAction";

export const ThirdCenturyCrisisMeasures = {
   ProclaimImperialGrandeur: {
      name: () => $t(L.ProclaimImperialGrandeur),
      modifiers: {
         Stability: { type: "add", value: -10, duration: 12 * 5 },
         Prestige: { type: "multiply", value: 0.1, duration: 12 * 5 },
      },
   },
   EmpowerTheLegions: {
      name: () => $t(L.EmpowerTheLegions),
      modifiers: {
         Stability: { type: "add", value: -10, duration: 12 * 5 },
         WarPower: { type: "multiply", value: 0.1, duration: 12 * 5 },
      },
   },
   ImposeEmergencyLevies: {
      name: () => $t(L.ImposeEmergencyLevies),
      modifiers: {
         Stability: { type: "add", value: -10, duration: 12 * 5 },
         LandTax: { type: "multiply", value: 0.1, duration: 12 * 5 },
         TileOutput: { type: "multiply", value: 0.1, duration: 12 * 5 },
      },
   },
   ElevateMilitaryCommand: {
      name: () => $t(L.ElevateMilitaryCommand),
      modifiers: {
         Stability: { type: "add", value: -10, duration: 12 * 5 },
         MilitaryPoint: { type: "add", value: 1, duration: 12 * 5 },
      },
   },
} as const satisfies Record<string, IGameEffectWithName>;

export type ThirdCenturyCrisisMeasure = keyof typeof ThirdCenturyCrisisMeasures;

export function AcquireContestedImperiumAction(target: Province, province: Province, save: SaveGame): IGameAction {
   return {
      condition: finalizeCondition([
         ongoingThirdCenturyCrisisCondition(province, save),
         ...timedActionConditions({ action: "ThirdCenturyCrisisCasusBelli" }, province, save),
         {
            name: $t(L.$1BordersOurProvince, getProvinceName(target, save)),
            value: getNeighborProvinces(province, save).has(target),
         },
      ]),
      execute: () => {
         startTimedAction("ThirdCenturyCrisisCasusBelli", province, save);
      },
      effect: {
         name: TimedActions.ThirdCenturyCrisisCasusBelli.name(),
         casusBelli: { [target]: { casusBelli: "ContestedImperium", duration: 12 * 5 } },
      },
   };
}

export function ConvertCrisisConsulPointAction(province: Province, save: SaveGame): IGameAction {
   return {
      cost: { consulPoint: 1 },
      condition: finalizeCondition([
         ongoingThirdCenturyCrisisCondition(province, save),
         ...timedActionConditions({ action: "ThirdCenturyCrisisConversion" }, province, save),
      ]),
      execute: () => {
         startTimedAction("ThirdCenturyCrisisConversion", province, save);
      },
      effect: {
         name: TimedActions.ThirdCenturyCrisisConversion.name(),
         resources: { generalSkillPoint: 1 },
      },
   };
}

export function EnactThirdCenturyCrisisMeasureAction(
   measure: ThirdCenturyCrisisMeasure,
   province: Province,
   save: SaveGame,
): IGameAction {
   return {
      condition: finalizeCondition([
         ongoingThirdCenturyCrisisCondition(province, save),
         ...timedActionConditions(
            { action: "ThirdCenturyCrisisMeasure", label: $t(L.EmergencyMeasuresAreNotOnCooldown) },
            province,
            save,
         ),
      ]),
      execute: () => {
         startTimedAction("ThirdCenturyCrisisMeasure", province, save);
      },
      effect: ThirdCenturyCrisisMeasures[measure],
   };
}
