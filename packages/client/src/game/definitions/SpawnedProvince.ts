import type { Tile, ValueOf } from "@project/shared/src/utils/Helper";
import type { Province } from "./Province";
import type { ProvinceResource } from "./ProvinceResources";
import type { ProvinceStat } from "./ProvinceStats";

export const SpawnedProvinceBoostMonths = 12 * 20;
export const MaxRaidMonths = 12;
export const BarbarianRaidNegativeEffect = -10;

export const SpawnedProvinceFlags = {
   None: 0,
   Raid: 1 << 0,
} as const;

export type SpawnedProvinceFlags = ValueOf<typeof SpawnedProvinceFlags>;

const BaseSpawnedProvinceData: SpawnedProvinceData = {
   stats: {
      targetConscription: 20,
      actualConscription: 20,
   },
   resources: {
      generalSkillPoint: 10,
   },
   flags: SpawnedProvinceFlags.Raid,
};

export const _SpawnedProvinces = {
   Suebi: {
      ...BaseSpawnedProvinceData,
      tiles: [8454222, 8388685, 8454220, 8454221, 8519756, 8454223, 8454224],
   },
   Visigoths: {
      ...BaseSpawnedProvinceData,
      tiles: [8912972, 8781897, 8847433, 8912970, 8912971, 8912973],
   },
   Vandals: {
      ...BaseSpawnedProvinceData,
      tiles: [9371731, 9306195, 9306196, 9371732, 9240660, 9568338, 9371733],
   },
   Burgundians: {
      ...BaseSpawnedProvinceData,
      tiles: [9044041, 9109576, 9109577, 9044042, 9109575, 9175112, 9044039],
   },
   Franks: {
      ...BaseSpawnedProvinceData,
      tiles: [8978497, 8978498, 9044033, 9109568, 9109569, 9044034, 9109567],
   },
   Saxons: {
      ...BaseSpawnedProvinceData,
      tiles: [8847424, 8847420, 8781885, 8847422, 8847423, 8912959, 8781884],
   },
   Alemanni: {
      ...BaseSpawnedProvinceData,
      tiles: [9240647, 9175111, 9306183, 9240646, 9306182, 9371718, 9306181],
   },
   Ostrogoths: {
      ...BaseSpawnedProvinceData,
      tiles: [9568328, 9633865, 9568329, 9633864, 9502792, 9437256, 9437257],
   },
   Huns: {
      ...BaseSpawnedProvinceData,
      tiles: [
         9764935, 9764934, 9830471, 9830470, 9699397, 9896008, 9896007, 9896006, 9830469, 9961542, 9961543, 9764933,
      ],
   },
   Avars: {
      ...BaseSpawnedProvinceData,
      tiles: [9961543, 9961542, 10027078, 9896007, 9896008],
   },
   Lombards: {
      ...BaseSpawnedProvinceData,
      tiles: [9568328, 9502792, 9437256, 9437257, 9371721],
   },
   Caliphate: {
      ...BaseSpawnedProvinceData,
      tiles: [
         10944609, 10879073, 10944610, 10944611, 11010148, 10879072, 10813535, 10813534, 10747997, 10879069, 10879070,
         10879071, 10944608, 10944607, 11010144, 11075684, 11010149, 11075685, 11075686, 11075687, 11141223, 11010145,
         11010146,
      ],
      flags: SpawnedProvinceFlags.None,
   },
   Bulgars: {
      ...BaseSpawnedProvinceData,
      tiles: [10223691, 10289227, 10223692, 10289226, 10289228],
   },
} as const satisfies Partial<Record<Province, SpawnedProvinceConfig>>;

export interface SpawnedProvinceData {
   stats: Partial<Record<ProvinceStat, number>>;
   resources: Partial<Record<ProvinceResource, number>>;
   flags: SpawnedProvinceFlags;
}

export interface SpawnedProvinceConfig extends SpawnedProvinceData {
   tiles: Tile[];
}

export type SpawnedProvince = keyof typeof _SpawnedProvinces;
export const SpawnedProvinces: Record<SpawnedProvince, SpawnedProvinceConfig> = _SpawnedProvinces;
