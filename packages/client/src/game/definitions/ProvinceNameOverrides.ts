import { $t, L } from "../../utils/i18n";

export const ProvinceNameOverrides = {
   GallicEmpire: () => $t(L.GallicEmpire),
   WesternRomanEmpire: () => $t(L.ProvinceWesternRomanEmpire),
   AlpineConfederation: () => $t(L.ProvinceAlpineConfederation),
   Illyria: () => $t(L.ProvinceIllyria),
   DanubianAlliance: () => $t(L.ProvinceDanubianAlliance),
} as const satisfies Record<string, () => string>;

export type ProvinceNameOverride = keyof typeof ProvinceNameOverrides;
