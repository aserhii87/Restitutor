import { entriesOf } from "@project/shared/src/utils/Helper";
import { $t, L } from "../../utils/i18n";
import type { ICondition } from "../actions/GameAction";
import type { Province } from "../definitions/Province";
import {
   EastAugustusProvinces,
   EastCaesarProvinces,
   WestAugustusProvinces,
   WestCaesarProvinces,
} from "../definitions/TileConstants";
import type { SaveGame } from "../GameState";
import { getProvinceName } from "./ProvinceLogic";

export const Tetrarchy = {
   EastAugustus: {
      name: () => $t(L.TetrarchyEasternAugustus),
      provinces: EastAugustusProvinces,
   },
   WestAugustus: {
      name: () => $t(L.TetrarchyWesternAugustus),
      provinces: WestAugustusProvinces,
   },
   EastCaesar: {
      name: () => $t(L.TetrarchyEasternCaesar),
      provinces: EastCaesarProvinces,
   },
   WestCaesar: {
      name: () => $t(L.TetrarchyWesternCaesar),
      provinces: WestCaesarProvinces,
   },
} as const satisfies Record<string, { name: () => string; provinces: Province[] }>;

export type Tetrarchy = keyof typeof Tetrarchy;

export function getProvinceEmperor(province: Province): Tetrarchy | null {
   for (const [tetrarchy, config] of entriesOf(Tetrarchy)) {
      if (config.provinces.includes(province)) {
         return tetrarchy;
      }
   }
   return null;
}

export function underSameEmperorCondition(province1: Province, province2: Province, save: SaveGame): ICondition {
   return {
      name: $t(L.$1And$2AreUnderTheSameEmperor, getProvinceName(province1, save), getProvinceName(province2, save)),
      value: getProvinceEmperor(province1) === getProvinceEmperor(province2),
   };
}

export function underDifferentEmperorsCondition(province1: Province, province2: Province, save: SaveGame): ICondition {
   return {
      name: $t(L.$1And$2AreUnderDifferentEmperors, getProvinceName(province1, save), getProvinceName(province2, save)),
      value: getProvinceEmperor(province1) !== getProvinceEmperor(province2),
   };
}
