import { MapLegendPanel } from "./MapLegendPanel";
import { TutorialPanel } from "./TutorialPanel";

export function BottomRightPanel(): React.ReactNode {
   return (
      <div className="bottom-right-panel">
         <TutorialPanel />
         <MapLegendPanel />
      </div>
   );
}
