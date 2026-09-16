import { CasusBelli } from "../game/definitions/CasusBelli";
import { getTileName } from "../game/definitions/TileName";
import { EventImage } from "../game/events/EventImages";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import type { IWar } from "../game/logic/WarLogic";
import { G } from "../utils/Global";
import { $t, L } from "../utils/i18n";
import { hideModal } from "../utils/ModalManager";
import { html } from "./components/RenderHTMLComp";
import { GameEventButton } from "./GameEventModal";
import { GenericEventModal } from "./GenericEventModal";

export function DeclareWarOnUsModal({ war }: { war: IWar }): React.ReactNode {
   const warGoal = Array.from(war.tiles)
      .map((tile) => getTileName(tile, G.save))
      .join(", ");
   return (
      <GenericEventModal
         title={$t(L.$1DeclaredWar, getProvinceName(war.attacker, G.save))}
         content={html(
            $t(
               L.GovernorDeclaredWarOnUsDesc$1$2$3,
               getProvinceName(war.attacker, G.save),
               CasusBelli[war.casusBelli].name(),
               warGoal,
            ),
         )}
         image={EventImage.HoratiiOath.url}
         titleTooltip={() => <div className="m10">{$t(L.ImageCredit$1, EventImage.HoratiiOath.credit)}</div>}
         buttons={[
            <GameEventButton
               key="0"
               tooltip={<div className="m10">{$t(L.WarInfoTooltip)}</div>}
               label={$t(L.WeShallDefendOurHomeland)}
               onClick={() => {
                  hideModal();
               }}
            />,
         ]}
      />
   );
}
