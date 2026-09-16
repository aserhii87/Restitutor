import { EventImage } from "../game/events/EventImages";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import type { IWar } from "../game/logic/WarLogic";
import { G } from "../utils/Global";
import { $t, L } from "../utils/i18n";
import { hideModal } from "../utils/ModalManager";
import { GameEventButton } from "./GameEventModal";
import { GenericEventModal } from "./GenericEventModal";
import { WhitePeaceTooltip } from "./WhitePeaceTooltip";

export function InvaderSueForWhitePeaceModal({ war }: { war: IWar }): React.ReactNode {
   return (
      <GenericEventModal
         title={$t(L.$1SuedForWhitePeace, getProvinceName(war.attacker, G.save))}
         content={$t(L.InvaderSuedForWhitePeaceDesc$1$2, war.log.length, getProvinceName(war.attacker, G.save))}
         image={EventImage.CaesarsTriumph.url}
         titleTooltip={() => <div className="m10">{$t(L.ImageCredit$1, EventImage.CaesarsTriumph.credit)}</div>}
         buttons={[
            <GameEventButton
               key="0"
               tooltip={<WhitePeaceTooltip war={war} />}
               label={$t(L.WeHopeTheyveLearnedTheirLesson)}
               onClick={() => {
                  hideModal();
               }}
            />,
         ]}
      />
   );
}
