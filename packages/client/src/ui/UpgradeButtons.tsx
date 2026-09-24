import type { Tile } from "@project/shared/src/utils/Helper";
import { useCallback } from "react";
import {
   UpgradeInfrastructureAction,
   UpgradePopulationAction,
   UpgradeProductionAction,
} from "../game/actions/UpgradeActions";
import { getTileUpgradeCost } from "../game/logic/TileLogic";
import { TimedActionDescComp } from "../game/logic/TimedActionDescComp";
import { G } from "../utils/Global";
import { $t, L } from "../utils/i18n";
import { ActionButton } from "./ActionButton";
import { BreakdownComp } from "./BreakdownComp";

export function UpgradeInfrastructureButton({
   tile,
   children,
   className,
   style,
   id,
}: React.PropsWithChildren<{
   tile: Tile;
   className?: string;
   style?: React.CSSProperties;
   id?: string;
}>): React.ReactNode {
   const tooltip = useCallback(
      (element: React.ReactNode) => (
         <>
            <TimedActionDescComp action="UpgradeInfrastructure" />
            {element}
            <div className="box m5">
               <div className="h2">{$t(L.TheCostIsCalculatedAsFollows)}</div>
               <BreakdownComp breakdown={getTileUpgradeCost(tile, "administrative", G.save)} />
            </div>
         </>
      ),
      [tile],
   );
   return (
      <ActionButton
         id={id}
         className={className}
         style={style}
         action={() => UpgradeInfrastructureAction(tile, G.save.state.playerProvince, G.save)}
         tooltip={tooltip}
      >
         {children}
      </ActionButton>
   );
}

export function UpgradeProductionButton({
   tile,
   children,
   className,
   style,
   id,
}: React.PropsWithChildren<{
   tile: Tile;
   className?: string;
   style?: React.CSSProperties;
   id?: string;
}>): React.ReactNode {
   const tooltip = useCallback(
      (element: React.ReactNode) => (
         <>
            <TimedActionDescComp action="UpgradeProduction" />
            {element}
            <div className="box m5">
               <div className="h2">{$t(L.TheCostIsCalculatedAsFollows)}</div>
               <BreakdownComp breakdown={getTileUpgradeCost(tile, "diplomatic", G.save)} />
            </div>
         </>
      ),
      [tile],
   );
   return (
      <ActionButton
         id={id}
         className={className}
         style={style}
         action={() => UpgradeProductionAction(tile, G.save.state.playerProvince, G.save)}
         tooltip={tooltip}
      >
         {children}
      </ActionButton>
   );
}

export function UpgradePopulationButton({
   tile,
   children,
   className,
   style,
   id,
}: React.PropsWithChildren<{
   tile: Tile;
   className?: string;
   style?: React.CSSProperties;
   id?: string;
}>): React.ReactNode {
   const tooltip = useCallback(
      (element: React.ReactNode) => (
         <>
            <TimedActionDescComp action="UpgradePopulation" />
            {element}
            <div className="box m5">
               <div className="h2">{$t(L.TheCostIsCalculatedAsFollows)}</div>
               <BreakdownComp breakdown={getTileUpgradeCost(tile, "military", G.save)} />
            </div>
         </>
      ),
      [tile],
   );
   return (
      <ActionButton
         id={id}
         className={className}
         style={style}
         tooltip={tooltip}
         action={() => UpgradePopulationAction(tile, G.save.state.playerProvince, G.save)}
      >
         {children}
      </ActionButton>
   );
}
