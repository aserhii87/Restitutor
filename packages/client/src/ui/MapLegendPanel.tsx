import { Switch } from "@mantine/core";
import { cls, hasFlag, mapSafeAdd, toggleFlag } from "@project/shared/src/utils/Helper";
import { Culture } from "../game/definitions/Culture";
import { Religion } from "../game/definitions/Religion";
import { GameOptionUpdated, GameStateUpdated, RefreshOverlay, RefreshTiles } from "../game/Events";
import { GameOptionFlag } from "../game/GameOption";
import { getOverlay, Overlays } from "../scenes/Overlays";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";
import { Grid2 } from "./UIConstant";

export function MapLegendPanel(): React.ReactNode {
   refreshOnTypedEvent(RefreshOverlay);
   refreshOnTypedEvent(GameStateUpdated);
   refreshOnTypedEvent(RefreshTiles);
   refreshOnTypedEvent(GameOptionUpdated);
   const overlay = getOverlay();
   if (!G.save || (overlay !== "Culture" && overlay !== "Religion")) {
      return null;
   }
   const present = new Map<string, number>();
   for (const data of G.save.state.tiles.values()) {
      mapSafeAdd(present, overlay === "Culture" ? data.culture : data.religion, 1);
   }
   const entries = Object.entries(overlay === "Culture" ? Culture : Religion)
      .filter(([key]) => present.has(key))
      .map(([key, config]) => ({ key, code: config.code, name: config.name(), count: present.get(key) ?? 0 }))
      .sort((a, b) => {
         if (hasFlag(G.save.options.flag, GameOptionFlag.SortMapLegendByCount)) {
            return b.count - a.count;
         }
         return a.name.localeCompare(b.name);
      });
   if (entries.length === 0) {
      return null;
   }
   return (
      <div className="panel">
         <div className="h2 row">
            <div className="f1">{Overlays[overlay]()}</div>
            <div className="f1" />
            <Switch
               size="xs"
               checked={hasFlag(G.save.options.flag, GameOptionFlag.SortMapLegendByCount)}
               onChange={() => {
                  G.save.options.flag = toggleFlag(G.save.options.flag, GameOptionFlag.SortMapLegendByCount);
                  GameOptionUpdated.emit();
               }}
            />
            <div
               className={cls(
                  hasFlag(G.save.options.flag, GameOptionFlag.SortMapLegendByCount) ? "text-primary" : "text-dimmed",
               )}
            >
               {$t(L.SortByCount)}
            </div>
         </div>
         <div className="m10 text-sm" style={{ ...Grid2, gap: "0.5rem 1rem", lineHeight: "1.0" }}>
            {entries.map(({ key, code, name, count }) => (
               <div key={key} className="row g5">
                  <div className="text-mono">{code}</div>
                  <div>
                     {name} <span className="text-dimmed">({count})</span>
                  </div>
                  <div className="f1" />
               </div>
            ))}
         </div>
      </div>
   );
}
