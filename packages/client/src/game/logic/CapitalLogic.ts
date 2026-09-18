import type { Tile } from "@project/shared/src/utils/Helper";
import { $t, L } from "../../utils/i18n";
import type { ICondition } from "../actions/GameAction";
import { makeModifierGetter } from "../definitions/Modifier";
import type { Province } from "../definitions/Province";
import type { SaveGame } from "../GameState";
import { MapGrid } from "../MapGrid";
import { tileIsOurCoreCondition } from "./MissionLogic";
import { getDistanceFromNearestCapital } from "./TileLogic";
import { timedActionConditions } from "./TimedActionLogic";
import { getWarForTile } from "./WarLogic";

const getRegionalCapitalCountBreakdown = makeModifierGetter("RegionalCapitalCount", 0, () => {});

export function getRegionalCapitalCount(province: Province, save: SaveGame): number {
   return Math.max(0, Math.floor(getRegionalCapitalCountBreakdown(province, save).value));
}

export function isEligibleRegionalCapital(tile: Tile, province: Province, save: SaveGame): ICondition[] {
   const state = save.state.provinces[province];
   return [
      tileIsOurCoreCondition(tile, province, save),
      {
         name: $t(L.TileIsNotACapital),
         value: !!state && state.capital !== tile && !state.regionalCapitals.has(tile),
      },
   ];
}

export function relocateCapitalConditions(tile: Tile, province: Province, save: SaveGame): ICondition[] {
   const state = save.state.provinces[province];
   return [
      ...timedActionConditions({ action: "RelocateCapital" }, province, save),
      tileIsOurCoreCondition(tile, province, save),
      { name: $t(L.TileIsNotAtWar), value: !getWarForTile(tile, save) },
      {
         name: $t(L.TileIsNotACapital),
         value: !!state && state.capital !== tile && !state.regionalCapitals.has(tile),
      },
   ];
}

export function getBestRegionalCapitalTiles(province: Province, save: SaveGame): Tile | undefined {
   let bestTile: Tile | undefined;
   let bestSavings = 0;
   const tiles = [...save.state.tiles].filter(([, data]) => data.province === province);
   const candidates = tiles.filter(([tile]) => isEligibleRegionalCapital(tile, province, save).every((c) => c.value));
   if (candidates.length === 0) {
      return undefined;
   }
   const distances = tiles.map(([tile]) => ({ tile, distance: getDistanceFromNearestCapital(tile, save) }));
   for (const [candidate] of candidates) {
      let savings = 0;
      for (const { tile, distance } of distances) {
         savings += Math.max(0, distance - MapGrid.distanceTile(tile, candidate));
      }
      if (bestTile === undefined || savings > bestSavings) {
         bestTile = candidate;
         bestSavings = savings;
      }
   }
   return bestTile;
}
