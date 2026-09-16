import { EventImage } from "../game/events/EventImages";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import type { IWar } from "../game/logic/WarLogic";
import { G } from "../utils/Global";
import { $t, L } from "../utils/i18n";
import { hideModal } from "../utils/ModalManager";
import { GameEventButton } from "./GameEventModal";
import { GenericEventModal } from "./GenericEventModal";

export function WarEndedModal({ war }: { war: IWar }): React.ReactNode {
   const ourAlly = war.coAttackers.has(G.save.state.playerProvince) ? war.attacker : war.defender;
   const victor = war.actualWarScore >= war.requiredWarScore ? war.attacker : war.defender;
   return (
      <GenericEventModal
         title={$t(L.$1$2WarEnded, getProvinceName(war.attacker, G.save), getProvinceName(war.defender, G.save))}
         content={$t(
            L.WarEndedDesc$1$2$3$4$5,
            war.log.length,
            getProvinceName(war.attacker, G.save),
            getProvinceName(war.defender, G.save),
            getProvinceName(victor, G.save),
            getProvinceName(ourAlly, G.save),
         )}
         image={EventImage.ScipiosClemency1.url}
         titleTooltip={() => <div className="m10">{$t(L.ImageCredit$1, EventImage.ScipiosClemency1.credit)}</div>}
         buttons={[
            <GameEventButton
               key="0"
               tooltip={<div className="m10">{$t(L.OneLessWarTooltip)}</div>}
               label={$t(L.WeAreGladThatPeaceIsRestored)}
               onClick={() => {
                  hideModal();
               }}
            />,
         ]}
      />
   );
}
