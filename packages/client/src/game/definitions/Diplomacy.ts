import { $t, L } from "../../utils/i18n";
import type { CasusBelli } from "./CasusBelli";
import type { IModifier } from "./Modifier";
import type { ActiveTrade } from "./Trade";

export const Treaty = ["DefensePact", "Alliance", "Client", "Patron"] as const;
export type Treaty = (typeof Treaty)[number];

export const TreatyNames: Record<Treaty, () => string> = {
   DefensePact: () => $t(L.DefensePact),
   Alliance: () => $t(L.Alliance),
   Client: () => $t(L.Clientage),
   Patron: () => $t(L.Patronage),
} as const;

export interface IRelation {
   treaty?: { type: Treaty; month: number };
   patronMonths: number;
   guaranteeDefense?: number;
   deterAggression?: number;
   revealElectionBacking?: number;
   truceUntil: number;
   improveRelations: { active: boolean; value: number };
   infiltrate: { active: boolean; value: number };
   casusBelli: Map<CasusBelli, { monthsLeft: number }>;
   attitudeModifier: IModifier[];
   trade?: ActiveTrade;
}
