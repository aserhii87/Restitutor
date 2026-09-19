import { SegmentedControl } from "@mantine/core";
import { formatNumber } from "@project/shared/src/utils/Helper";
import { useState } from "react";
import { finalizeCondition } from "../game/actions/GameAction";
import { durationToString } from "../game/definitions/Modifier";
import { TimedActions } from "../game/definitions/TimedAction";
import { GameStateUpdated } from "../game/Events";
import { activeTimedActionCondition, provinceOnMapCondition } from "../game/logic/MissionLogic";
import {
   getProvinceEmperor,
   Tetrarchy,
   underDifferentEmperorsCondition,
   underSameEmperorCondition,
} from "../game/logic/TetrarchyLogic";
import { getTimedActionTimeLeft, startTimedAction, timedActionConditions } from "../game/logic/TimedActionLogic";
import { G } from "../utils/Global";
import { refreshOnTypedEvent } from "../utils/Hook";
import { $t, L } from "../utils/i18n";
import { ActionButton } from "./ActionButton";
import { SidebarComp, SidebarImageHeader } from "./common/SidebarComp";
import { HeaderImages } from "./HeaderImages";
import { renderMarkup } from "./ParseMarkup";

export function TetrarchyPage(): React.ReactNode {
   refreshOnTypedEvent(GameStateUpdated);
   const [tab, setTab] = useState<Tetrarchy>(getProvinceEmperor(G.save.state.playerProvince) ?? "WestAugustus");
   return (
      <SidebarComp
         title={
            <>
               <SidebarImageHeader image={HeaderImages.Tetrarchy} title={TimedActions.Tetrarchy.name()} />
               <div className="divider" />
            </>
         }
      >
         <div className="mx10 my5">
            {$t(
               L.$1EndsIn$2Months,
               TimedActions.Tetrarchy.name(),
               formatNumber(getTimedActionTimeLeft("Tetrarchy", G.save.state.playerProvince, G.save)),
            )}
         </div>
         <div className="box m10">
            <SegmentedControl
               fullWidth
               className="text-display"
               classNames={{
                  indicator: "frame frame-thin frame-btn",
               }}
               styles={{
                  root: {
                     background: "none",
                     "--sc-font-size": "var(--mantine-font-size-md)",
                  },
                  label: {
                     padding: "0.5rem 1rem",
                     textAlign: "left",
                  },
               }}
               orientation="vertical"
               data={[
                  { label: Tetrarchy.WestAugustus.name(), value: "WestAugustus" },
                  { label: Tetrarchy.WestCaesar.name(), value: "WestCaesar" },
                  { label: Tetrarchy.EastAugustus.name(), value: "EastAugustus" },
                  { label: Tetrarchy.EastCaesar.name(), value: "EastCaesar" },
               ]}
               value={tab}
               onChange={(value) => setTab(value as Tetrarchy)}
            />
         </div>
         {Tetrarchy[tab].provinces.map((province) => {
            if (G.save.state.playerProvince === province) {
               return null;
            }
            return (
               <div className="box row m10 px10 py5 g5" key={province}>
                  <div className="text-display text-lg">{renderMarkup(`<Province>${province}</Province>`)}</div>
                  <div className="f1" />
                  <ActionButton
                     action={() => ({
                        cost: {
                           diplomatic: 50,
                        },
                        condition: finalizeCondition([
                           ...timedActionConditions({ action: "TetrarchyAction" }, G.save.state.playerProvince, G.save),
                           activeTimedActionCondition("Tetrarchy", G.save.state.playerProvince, G.save),
                           provinceOnMapCondition(province, G.save),
                           underDifferentEmperorsCondition(province, G.save.state.playerProvince, G.save),
                        ]),
                        execute: () => {
                           startTimedAction("TetrarchyAction", G.save.state.playerProvince, G.save);
                        },
                        effect: {
                           name: () => $t(L.InciteDiplomaticFriction),
                           casusBelli: {
                              [province]: {
                                 casusBelli: "DiplomaticDispute",
                                 duration: TimedActions.TetrarchyAction.duration,
                              },
                           },
                        },
                     })}
                     tooltip={(element) => (
                        <>
                           <div className="h2">{$t(L.InciteDiplomaticFriction)}</div>
                           <div className="row mx10 my5">
                              <div className="f1">{$t(L.Cooldown)}</div>
                              <div className="text-sm text-dimmed">
                                 {durationToString(TimedActions.TetrarchyAction.cooldown)}
                              </div>
                           </div>
                           {element}
                        </>
                     )}
                  >
                     <div className="mi sm py2">crisis_alert</div>
                  </ActionButton>
                  <ActionButton
                     action={() => ({
                        cost: {
                           diplomatic: 25,
                        },
                        condition: finalizeCondition([
                           ...timedActionConditions({ action: "TetrarchyAction" }, G.save.state.playerProvince, G.save),
                           activeTimedActionCondition("Tetrarchy", G.save.state.playerProvince, G.save),
                           provinceOnMapCondition(province, G.save),
                           underSameEmperorCondition(province, G.save.state.playerProvince, G.save),
                        ]),
                        execute: () => {
                           startTimedAction("TetrarchyAction", G.save.state.playerProvince, G.save);
                        },
                        effect: {
                           name: () => $t(L.ArrangeOfficialVisit),
                           attitudes: {
                              [province]: {
                                 type: "add",
                                 value: 25,
                                 duration: TimedActions.TetrarchyAction.duration,
                              },
                           },
                        },
                     })}
                     tooltip={(element) => (
                        <>
                           <div className="h2">{$t(L.ArrangeOfficialVisit)}</div>
                           <div className="row mx10 my5">
                              <div className="f1">{$t(L.Cooldown)}</div>
                              <div className="text-sm text-dimmed">
                                 {durationToString(TimedActions.TetrarchyAction.cooldown)}
                              </div>
                           </div>
                           {element}
                        </>
                     )}
                  >
                     <div className="mi sm py2">heart_plus</div>
                  </ActionButton>
                  <ActionButton
                     action={() => ({
                        cost: {
                           diplomatic: 25,
                        },
                        condition: finalizeCondition([
                           ...timedActionConditions({ action: "TetrarchyAction" }, G.save.state.playerProvince, G.save),
                           activeTimedActionCondition("Tetrarchy", G.save.state.playerProvince, G.save),
                           provinceOnMapCondition(province, G.save),
                           underSameEmperorCondition(province, G.save.state.playerProvince, G.save),
                        ]),
                        execute: () => {
                           startTimedAction("TetrarchyAction", G.save.state.playerProvince, G.save);
                        },
                        effect: {
                           name: () => $t(L.ExpandSpyNetwork),
                           infiltration: {
                              [province]: 25,
                           },
                        },
                     })}
                     tooltip={(element) => (
                        <>
                           <div className="h2">{$t(L.ExpandSpyNetwork)}</div>
                           <div className="row mx10 my5">
                              <div className="f1">{$t(L.Cooldown)}</div>
                              <div className="text-sm text-dimmed">
                                 {durationToString(TimedActions.TetrarchyAction.cooldown)}
                              </div>
                           </div>
                           {element}
                        </>
                     )}
                  >
                     <div className="mi sm py2">domino_mask</div>
                  </ActionButton>
                  <ActionButton
                     action={() => ({
                        cost: {
                           military: 25,
                        },
                        condition: finalizeCondition([
                           ...timedActionConditions({ action: "TetrarchyAction" }, G.save.state.playerProvince, G.save),
                           activeTimedActionCondition("Tetrarchy", G.save.state.playerProvince, G.save),
                           provinceOnMapCondition(province, G.save),
                           underSameEmperorCondition(province, G.save.state.playerProvince, G.save),
                        ]),
                        execute: () => {
                           startTimedAction("TetrarchyAction", G.save.state.playerProvince, G.save);
                        },
                        effect: {
                           name: () => $t(L.ConductJointDrills),
                           provinceModifiers: [
                              {
                                 type: "multiply",
                                 value: 0.1,
                                 duration: TimedActions.TetrarchyAction.duration,
                                 modifier: "WarPower",
                                 province: G.save.state.playerProvince,
                              },
                              {
                                 type: "multiply",
                                 value: 0.1,
                                 duration: TimedActions.TetrarchyAction.duration,
                                 modifier: "WarPower",
                                 province: province,
                              },
                           ],
                        },
                     })}
                     tooltip={(element) => (
                        <>
                           <div className="h2">{$t(L.ConductJointDrills)}</div>
                           <div className="row mx10 my5">
                              <div className="f1">{$t(L.Cooldown)}</div>
                              <div className="text-sm text-dimmed">
                                 {durationToString(TimedActions.TetrarchyAction.cooldown)}
                              </div>
                           </div>
                           {element}
                        </>
                     )}
                  >
                     <div className="mi sm py2">local_police</div>
                  </ActionButton>
               </div>
            );
         })}
      </SidebarComp>
   );
}
