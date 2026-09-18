import { Culture } from "../game/definitions/Culture";
import { Religion } from "../game/definitions/Religion";
import { GameStateUpdated, RefreshOverlay, RefreshTiles } from "../game/Events";
import { getOverlay, Overlays } from "../scenes/Overlays";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { Grid3 } from "./UIConstant";

export function MapLegendPanel(): React.ReactNode {
   refreshOnTypedEvent(RefreshOverlay);
   refreshOnTypedEvent(GameStateUpdated);
   refreshOnTypedEvent(RefreshTiles);
   const overlay = getOverlay();
   if (!G.save || (overlay !== "Culture" && overlay !== "Religion")) {
      return null;
   }
   const present = new Set<string>();
   for (const data of G.save.state.tiles.values()) {
      present.add(overlay === "Culture" ? data.culture : data.religion);
   }
   const entries = Object.entries(overlay === "Culture" ? Culture : Religion)
      .filter(([key]) => present.has(key))
      .map(([key, config]) => ({ key, code: config.code, name: config.name() }))
      .sort((a, b) => a.name.localeCompare(b.name));
   if (entries.length === 0) {
      return null;
   }
   return (
      <div className="panel">
         <div className="h2">{Overlays[overlay]()}</div>
         <div className="m10 text-sm" style={{ ...Grid3, gap: "0.5rem 1rem", lineHeight: "1.0" }}>
            {entries.map(({ key, code, name }) => (
               <div key={key} className="row g5">
                  <div className="text-mono">{code}</div>
                  <div className="f1">{name}</div>
               </div>
            ))}
         </div>
      </div>
   );
}
