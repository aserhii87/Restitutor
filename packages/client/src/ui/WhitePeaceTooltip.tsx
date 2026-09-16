import { formatNumber } from "@project/shared/src/utils/Helper";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import { getTruceDuration, type IWar } from "../game/logic/WarLogic";
import { G } from "../utils/Global";
import { $t, L } from "../utils/i18n";
import { BreakdownComp } from "./BreakdownComp";

export function WhitePeaceTooltip({ war }: { war: IWar }): React.ReactNode {
   const duration = getTruceDuration(war, G.save);
   return (
      <>
         <div className="m10">
            {$t(
               L.WhitePeaceTooltip$1$2$3,
               formatNumber(duration.value),
               getProvinceName(war.attacker, G.save),
               getProvinceName(war.defender, G.save),
            )}
         </div>
         <div className="h2">{$t(L.TruceDuration)}</div>
         <BreakdownComp breakdown={duration} />
      </>
   );
}
