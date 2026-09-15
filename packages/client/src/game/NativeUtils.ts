import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";

import { isSteam, SteamClient } from "../rpc/SteamClient";
import { idbDel, idbGet, idbSet } from "../utils/BrowserStorage";

export async function writeFile(name: string, data: string): Promise<void> {
   if (isSteam()) {
      return SteamClient.fileWrite(name, data);
   }
   if (Capacitor.isNativePlatform()) {
      await Filesystem.writeFile({
         path: name,
         directory: Directory.Data,
         encoding: Encoding.UTF8,
         data,
      });
      return;
   }
   await idbSet(name, data);
   return;
}

export async function readFile(name: string): Promise<string | undefined> {
   if (isSteam()) {
      return SteamClient.fileRead(name);
   }
   if (Capacitor.isNativePlatform()) {
      const { data } = await Filesystem.readFile({
         path: name,
         directory: Directory.Data,
         encoding: Encoding.UTF8,
      });
      return data.toString();
   }
   return await idbGet<string>(name);
}

export async function deleteFile(name: string): Promise<void> {
   if (isSteam()) {
      return SteamClient.fileDelete(name);
   }
   if (Capacitor.isNativePlatform()) {
      await Filesystem.deleteFile({
         path: name,
         directory: Directory.Data,
      });
      return;
   }
   await idbDel(name);
   return;
}

export function isIOS(): boolean {
   return Capacitor.getPlatform() === "ios";
}

export function isAndroid(): boolean {
   return Capacitor.getPlatform() === "android";
}

export function isMobilePlatform(): boolean {
   return isIOS() || isAndroid();
}
