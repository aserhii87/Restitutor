import type { Tile } from "@project/shared/src/utils/Helper";
import { $t, L } from "../../utils/i18n";
import type { IBaseModifier, Modifier } from "../definitions/Modifier";
import type { Province } from "../definitions/Province";
import { TimedActions } from "../definitions/TimedAction";
import { RefreshTiles } from "../Events";
import type { SaveGame } from "../GameState";
import { clearAllCaches } from "../logic/CacheLogic";
import { getRegionalCapitalCount, isEligibleRegionalCapital, relocateCapitalConditions } from "../logic/CapitalLogic";
import { addModifier } from "../logic/ModifierLogic";
import { ensureProvinceCapitals } from "../logic/ProvinceLogic";
import { startTimedAction, timedActionConditions } from "../logic/TimedActionLogic";
import { EmptyGameAction } from "./EmptyGameAction";
import { finalizeCondition, type IGameAction } from "./GameAction";

export function EstablishRegionalCapitalAction(tile: Tile, province: Province, save: SaveGame): IGameAction {
   const state = save.state.provinces[province];
   if (!state) {
      return EmptyGameAction;
   }
   const limit = getRegionalCapitalCount(province, save);
   return {
      cost: { mandate: 1 },
      condition: finalizeCondition([
         ...isEligibleRegionalCapital(tile, province, save),
         {
            name: $t(L.MaxRegionalCapitals),
            progress: [state.regionalCapitals.size, limit],
            value: state.regionalCapitals.size < limit,
         },
         ...timedActionConditions({ action: "EstablishRegionalCapital" }, province, save),
      ]),
      execute: () => {
         state.regionalCapitals.add(tile);
         startTimedAction("EstablishRegionalCapital", province, save);
         clearAllCaches();
         RefreshTiles.emit({
            tiles: [tile],
            options: { indicator: true, visual: true },
         });
      },
   };
}

export function AbolishRegionalCapitalAction(tile: Tile, province: Province, save: SaveGame): IGameAction {
   const state = save.state.provinces[province];
   if (!state) {
      return EmptyGameAction;
   }
   return {
      condition: finalizeCondition([
         {
            name: $t(L.RegionalCapital),
            value: save.state.tiles.get(tile)?.province === province && state.regionalCapitals.has(tile),
         },
      ]),
      execute: () => {
         state.regionalCapitals.delete(tile);
         clearAllCaches();
         RefreshTiles.emit({
            tiles: [tile],
            options: { indicator: true, visual: true },
         });
      },
   };
}

export function RelocateCapitalAction(tile: Tile, province: Province, save: SaveGame): IGameAction {
   const state = save.state.provinces[province];
   if (!state) {
      return EmptyGameAction;
   }
   return {
      cost: { mandate: 1 },
      condition: finalizeCondition(relocateCapitalConditions(tile, province, save)),
      execute: () => {
         startTimedAction("RelocateCapital", province, save);
         addModifier({
            ...RelocateCapitalModifier,
            name: TimedActions.RelocateCapital.name(),
            province,
            save,
         });
         const oldCapital = state.capital;
         state.capital = tile;
         clearAllCaches();
         RefreshTiles.emit({
            tiles: [tile, oldCapital, ...ensureProvinceCapitals(save)],
            options: { indicator: true, visual: true },
         });
      },
   };
}
export const RelocateCapitalModifier: { modifier: Modifier } & IBaseModifier = {
   modifier: "Stability",
   type: "add",
   value: -10,
   duration: 24,
};
