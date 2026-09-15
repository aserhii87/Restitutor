import { cls } from "@project/shared/src/utils/Helper";
import { useState } from "react";
import { SignPeaceTreatyAction } from "../game/actions/SignPeaceTreatyAction";
import type { Province } from "../game/definitions/Province";
import { GameStateUpdated } from "../game/Events";
import {
   getAvailablePeaceTreatyOptions,
   getPeaceTreatyOptionDescription,
   type PeaceTreatyOption,
   PeaceTreatyOptions,
} from "../game/logic/PeaceTreatyLogic";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import type { IWar } from "../game/logic/WarLogic";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";
import { ActionButton } from "./ActionButton";
import { SidebarComp, SidebarImageHeader } from "./common/SidebarComp";
import { HeaderImages } from "./HeaderImages";
import { PeaceTreatyTerms, PeaceTreatyTooltip } from "./PeaceTreatyTooltip";
import { Grid1 } from "./UIConstant";

export function PeaceTreatyPage({ war, province }: { war: IWar; province: Province }): React.ReactNode {
   refreshOnTypedEvent(GameStateUpdated);
   const options = getAvailablePeaceTreatyOptions(war, G.save);
   const [selectedOption, setSelectedOption] = useState<PeaceTreatyOption>(options[0]);
   return (
      <SidebarComp title={<SidebarImageHeader image={HeaderImages.Peace} title={$t(L.PeaceTreaty)} />}>
         <div className="h1">
            {$t(L.$1$2PeaceTreaty, getProvinceName(war.attacker, G.save), getProvinceName(war.defender, G.save))}
         </div>
         <PeaceTreatyTerms war={war} />
         <div className="h1">
            {$t(L.AdditionalTerms)} {$t(L.ChooseOne)}
         </div>
         <div style={Grid1} className="m10">
            {options.map((availableOption) => (
               <div
                  className={cls("box pointer", selectedOption === availableOption ? "primary text-primary" : null)}
                  key={availableOption}
                  onClick={() => setSelectedOption(availableOption)}
               >
                  <div className="mx10 my5 text-display row">
                     <div className={cls(selectedOption === availableOption ? "text-primary" : null)}>
                        {PeaceTreatyOptions[availableOption].name()}
                     </div>
                     <div className="f1" />
                     {selectedOption === availableOption && <div className="mi xs text-primary">check_circle</div>}
                  </div>
                  <div className="mx10 my5 text-sm">
                     {getPeaceTreatyOptionDescription(availableOption, war, G.save)}
                  </div>
               </div>
            ))}
         </div>
         <div className="m10">
            <ActionButton
               id="PeaceTreatyModal_SignPeaceTreaty"
               className="py2 primary w100"
               action={() => SignPeaceTreatyAction(war, province, selectedOption, G.save)}
               tooltip={(element) => (
                  <>
                     {element}
                     <PeaceTreatyTooltip war={war} peaceTreatyOption={selectedOption} />
                  </>
               )}
            >
               {$t(L.SignPeaceTreaty)}
            </ActionButton>
         </div>
      </SidebarComp>
   );
}
