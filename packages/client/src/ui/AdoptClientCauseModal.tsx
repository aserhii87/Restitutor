import { formatNumber } from "@project/shared/src/utils/Helper";
import { AdoptClientCauseAction, getClientCasusBelli as getClientCasusBellis } from "../game/actions/ClientActions";
import { CasusBelli } from "../game/definitions/CasusBelli";
import type { Province } from "../game/definitions/Province";
import { GameStateUpdated } from "../game/Events";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import { TimedActionDescComp } from "../game/logic/TimedActionDescComp";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";
import { ModalComp, ModalTitleBar } from "../utils/ModalManager";
import { ActionButton } from "./ActionButton";
import { FloatingTip } from "./components/FloatingTip";
import { renderMarkup } from "./ParseMarkup";

export function AdoptClientCauseModal({ province }: { province: Province }): React.ReactNode {
   refreshOnTypedEvent(GameStateUpdated);
   const ourProvince = G.save.state.playerProvince;
   const casusBellis = getClientCasusBellis(ourProvince, province, G.save);
   return (
      <ModalComp
         size="sm"
         title={<ModalTitleBar title={$t(L.Adopt$1sCause, getProvinceName(province, G.save))} dismiss />}
      >
         <div className="box m10">
            <TimedActionDescComp action="AdoptClientCause" />
         </div>
         <div className="box m10">
            {casusBellis.map((cb) => (
               <div key={`${cb.province}:${cb.casusBelli}`} className="row m10">
                  <FloatingTip label={() => CasusBelli[cb.casusBelli].effect?.()}>
                     <div className="f1">
                        <div>
                           {renderMarkup(`<Province>${cb.province}</Province>`)} ·{" "}
                           <i>{CasusBelli[cb.casusBelli].name()}</i>
                        </div>
                        <div className="text-sm text-dimmed">{$t(L.$1MonthsLeft, formatNumber(cb.monthsLeft))}</div>
                     </div>
                  </FloatingTip>
                  <ActionButton action={() => AdoptClientCauseAction(ourProvince, province, cb, G.save)}>
                     {$t(L.Adopt)}
                  </ActionButton>
               </div>
            ))}
         </div>
      </ModalComp>
   );
}
