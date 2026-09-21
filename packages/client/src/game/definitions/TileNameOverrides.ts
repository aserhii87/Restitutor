import { $t, L } from "../../utils/i18n";

export const TileNameOverrides = {
   Constantinople: () => $t(L.TileConstantinople),
} as const satisfies Record<string, () => string>;
export type TileNameOverride = keyof typeof TileNameOverrides;
