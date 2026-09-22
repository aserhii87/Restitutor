import { formatNumber, keysOf } from "@project/shared/src/utils/Helper";
import {
   AcquireContestedImperiumAction,
   ConvertCrisisConsulPointAction,
   EnactThirdCenturyCrisisMeasureAction,
   ThirdCenturyCrisisMeasures,
} from "../game/actions/ThirdCenturyCrisisActions";
import { CasusBelli } from "../game/definitions/CasusBelli";
import { durationToString } from "../game/definitions/Modifier";
import { TimedActions } from "../game/definitions/TimedAction";
import { GameStateUpdated } from "../game/Events";
import { getNeighborProvinces, getProvinceName } from "../game/logic/ProvinceLogic";
import { getTimedActionCooldownLeft, getTimedActionTimeLeft } from "../game/logic/TimedActionLogic";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";
import { ActionButton } from "./ActionButton";
import { SidebarComp, SidebarImageHeader } from "./common/SidebarComp";
import { HeaderImages } from "./HeaderImages";

export function ThirdCenturyCrisisPage(): React.ReactNode {
   refreshOnTypedEvent(GameStateUpdated);
   const province = G.save.state.playerProvince;
   if (getTimedActionTimeLeft("ThirdCenturyCrisis", province, G.save) <= 0) {
      return null;
   }
   const neighbors = Array.from(getNeighborProvinces(province, G.save)).sort();
   const measureCooldown = getTimedActionCooldownLeft("ThirdCenturyCrisisMeasure", province, G.save);
   return (
      <SidebarComp
         title={
            <>
               <SidebarImageHeader image={HeaderImages.Crisis} title={TimedActions.ThirdCenturyCrisis.name()} />
               <div className="divider" />
            </>
         }
      >
         <div className="mx10 my5">
            {$t(
               L.$1EndsIn$2Months,
               TimedActions.ThirdCenturyCrisis.name(),
               formatNumber(getTimedActionTimeLeft("ThirdCenturyCrisis", province, G.save)),
            )}
         </div>
         <div className="h1">{CasusBelli.ContestedImperium.name()}</div>
         {neighbors.map((neighbor) => (
            <div className="row mx10 my5" key={neighbor}>
               <div className="f1">{getProvinceName(neighbor, G.save)}</div>
               <ActionButton
                  className="text-sm"
                  action={() => AcquireContestedImperiumAction(neighbor, G.save.state.playerProvince, G.save)}
               >
                  {$t(L.CasusBelli)}
               </ActionButton>
            </div>
         ))}
         <div className="box m10">
            <div className="h3">{$t(L.$1CasusBelli, CasusBelli.ContestedImperium.name())}</div>
            <div className="m10 text-sm">{CasusBelli.ContestedImperium.effect?.()}</div>
         </div>
         <div className="h1">{TimedActions.ThirdCenturyCrisisConversion.name()}</div>
         <div className="m10">
            <ActionButton
               className="w100 py2"
               action={() => ConvertCrisisConsulPointAction(G.save.state.playerProvince, G.save)}
            >
               {TimedActions.ThirdCenturyCrisisConversion.name()}
            </ActionButton>
         </div>
         <div className="h1">{TimedActions.ThirdCenturyCrisisMeasure.name()}</div>
         <div className="m10 text-sm">
            {$t(
               L.AllEmergencyMeasuresShareACooldownOf$1,
               durationToString(TimedActions.ThirdCenturyCrisisMeasure.cooldown),
            )}{" "}
            {measureCooldown > 0 && (
               <span className="text-primary">
                  {$t(L.EmergencyMeasuresWillBeAvailableIn$1Months, formatNumber(measureCooldown))}
               </span>
            )}
         </div>

         <div className="m10 col stretch g5">
            {keysOf(ThirdCenturyCrisisMeasures).map((measure) => (
               <ActionButton
                  className="py2"
                  key={measure}
                  action={() => EnactThirdCenturyCrisisMeasureAction(measure, G.save.state.playerProvince, G.save)}
               >
                  {ThirdCenturyCrisisMeasures[measure].name()}
               </ActionButton>
            ))}
         </div>
      </SidebarComp>
   );
}
