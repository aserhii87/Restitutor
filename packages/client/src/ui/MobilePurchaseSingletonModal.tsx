import { saveGame } from "../game/LoadSave";
import { G } from "../utils/Global";
import { $t, L } from "../utils/i18n";
import { ModalComp, ModalImageHeader } from "../utils/ModalManager";
import { HeaderImages } from "./HeaderImages";

export function MobilePurchaseSingletonModal(): React.ReactNode {
   return (
      <ModalComp title={<ModalImageHeader image={HeaderImages.Rebirth} title={$t(L.FullGamePurchased)} dismiss />}>
         <div className="m10">
            <div className="my10">{$t(L.FullGamePurchasedDesc)}</div>
            <button
               className="btn w100 py2"
               onClick={async () => {
                  await saveGame(G.save);
                  window.location.reload();
               }}
            >
               {$t(L.SaveAndReload)}
            </button>
         </div>
      </ModalComp>
   );
}
