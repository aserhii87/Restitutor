import { forEach } from "@project/shared/src/utils/Helper";
import { showPanel } from "../ui/common/ShowPanel";
import { tryDismissSidebar } from "../ui/common/SidebarManager";
import { G, revertSpeed, setSpeed } from "../utils/Global";
import { hasOpenModal, tryDismissTopModal } from "../utils/ModalManager";
import { CurrentShortcuts, OnKeydown, OnKeyup } from "./Events";
import { isShortcutEqual, makeShortcut } from "./Shortcut";

export function initShortcut(): void {
   window.addEventListener("keydown", (e) => {
      OnKeydown.emit(e);
      const isTextInput =
         e.target instanceof HTMLTextAreaElement ||
         (e.target instanceof HTMLInputElement && (!e.target.type || e.target.type === "text")) ||
         (e.target as HTMLElement).isContentEditable;
      if (isTextInput) {
         return;
      }
      const shortcut = makeShortcut(e);

      forEach(G.save.options.shortcuts, (key, config) => {
         if (isShortcutEqual(config, shortcut)) {
            const callback = CurrentShortcuts.get(key);
            if (callback) {
               e.preventDefault();
               e.stopPropagation();
               callback(e);
            }
         }
      });
   });
   window.addEventListener("keyup", (e) => {
      OnKeyup.emit(e);
   });
   CurrentShortcuts.set("Pause", () => {
      if (G.speed !== 0) {
         setSpeed(0);
      } else {
         revertSpeed();
      }
   });

   CurrentShortcuts.set("CloseOpenModal", async () => {
      if (tryDismissTopModal() || hasOpenModal() || tryDismissSidebar()) {
         return;
      }
      const { SettingsSingletonModal } = await import("../ui/SettingsSingletonModal");
      showPanel(SettingsSingletonModal, {});
   });
}
