import { type DependencyList, useEffect, useState } from "react";
import { isDev } from "../utils/Global";
import { useTypedEvent } from "../utils/Hook";
import { CurrentShortcuts, OnKeydown, OnKeyup } from "./Events";
import type { IShortcutConfig, Shortcut } from "./ShortcutDefinition";

export function getShortcutKey(s: IShortcutConfig | undefined | null): string | undefined {
   if (!s) {
      return undefined;
   }
   const keys: string[] = [];
   if (s.ctrl) {
      keys.push("Ctrl");
   }
   if (s.shift) {
      keys.push("Shift");
   }
   if (s.alt) {
      keys.push("Alt");
   }
   if (s.meta) {
      keys.push("Command");
   }

   if (s.key === " ") {
      keys.push("Space");
   } else {
      keys.push(s.key);
   }

   return keys.join(" + ").toUpperCase();
}

export function isShortcutEqual(a: IShortcutConfig | undefined | null, b: IShortcutConfig | undefined | null): boolean {
   if (!a || !b) {
      return false;
   }
   return (
      a.ctrl === b.ctrl &&
      a.shift === b.shift &&
      a.alt === b.alt &&
      a.meta === b.meta &&
      a.key.toUpperCase() === b.key.toUpperCase()
   );
}

export function makeShortcut(e: {
   ctrlKey: boolean;
   shiftKey: boolean;
   altKey: boolean;
   metaKey: boolean;
   key: string;
}): IShortcutConfig {
   return {
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey,
      key: e.key,
   };
}

export const useShortcut = (shortcut: Shortcut, callback: (event: KeyboardEvent) => void, deps: DependencyList) => {
   useEffect(() => {
      CurrentShortcuts.set(shortcut, callback);
      return () => {
         CurrentShortcuts.delete(shortcut);
      };
   }, [shortcut, callback, ...deps]);
};

export function useDebugKey(): boolean {
   const [isDebug, setIsDebug] = useState(false);
   useTypedEvent(OnKeydown, (e) => {
      if (isDev() && e.key.toLowerCase() === "`") {
         setIsDebug(true);
      }
   });
   useTypedEvent(OnKeyup, (e) => {
      if (e.key.toLowerCase() === "`") {
         setIsDebug(false);
      }
   });
   return isDebug;
}
