import { mapSafePush, type Tile } from "@project/shared/src/utils/Helper";
import type { Province } from "./definitions/Province";
import { RomeMap } from "./RomeMap";

export const ProvinceOriginalTiles: Map<Province, Tile[]> = new Map();
for (const [tile, data] of RomeMap) {
   if (data.province) {
      mapSafePush(ProvinceOriginalTiles, data.province, tile);
   }
}
