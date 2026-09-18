import { GrantLandAction, getGrantLandTiles } from "../game/actions/ClientActions";
import type { Province } from "../game/definitions/Province";
import { GameStateUpdated } from "../game/Events";
import { getProvinceName } from "../game/logic/ProvinceLogic";
import { TimedActionDescComp } from "../game/logic/TimedActionDescComp";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";
import { ActionButton } from "./ActionButton";
import { SidebarComp, SidebarHeader } from "./common/SidebarComp";
import { renderMarkup } from "./ParseMarkup";

export function GrantLandPage({ province }: { province: Province }): React.ReactNode {
   refreshOnTypedEvent(GameStateUpdated);
   const ourProvince = G.save.state.playerProvince;
   const tiles = getGrantLandTiles(ourProvince, province, G.save);
   return (
      <SidebarComp title={<SidebarHeader title={$t(L.GrantLandTo$1, getProvinceName(province, G.save))} />}>
         <div className="box m10">
            <TimedActionDescComp action="GrantLand" />
         </div>
         <div className="box m10">
            <div className="h2">{$t(L.TilesAvailableToGrant)}</div>
            {tiles.map((tile) => (
               <div key={tile} className="row mx10 my5 g5">
                  <div className="f1">{renderMarkup(`<Tile>${tile}</Tile>`)}</div>
                  <ActionButton className="text-sm" action={() => GrantLandAction(ourProvince, province, tile, G.save)}>
                     {$t(L.Grant)}
                  </ActionButton>
               </div>
            ))}
         </div>
      </SidebarComp>
   );
}
