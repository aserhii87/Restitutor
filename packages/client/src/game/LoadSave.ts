import { dateToYYYYMMDD } from "@project/shared/src/utils/Helper";
import { jsonDecode, jsonEncode } from "@project/shared/src/utils/Serialization";
import { compressToUint8Array, decompressFromUint8Array } from "lz-string";
import { BackupCount, BackupFrequency, SaveKey } from "./definitions/Constant";
import type { SaveGame } from "./GameState";
import { getGameDate } from "./logic/GameDateTime";
import { deleteFile, readFile, writeFile } from "./NativeUtils";

export async function loadGame(): Promise<SaveGame> {
   const json = await readFile(SaveKey);
   if (!json) {
      throw new Error("Save not found");
   }
   return jsonDecode<SaveGame>(json);
}

export async function saveGame(save: SaveGame): Promise<void> {
   if (resetRequested) {
      return;
   }
   const serialized = jsonEncode(save);
   await writeFile(SaveKey, serialized);
}

let counter = 0;
let lastBackupTime = Date.now();

export async function saveAndBackupGame(save: SaveGame): Promise<void> {
   await saveGame(save);
   if (Date.now() - lastBackupTime > BackupFrequency) {
      await writeFile(`${SaveKey}_${(counter % BackupCount) + 1}`, jsonEncode(save));
      ++counter;
      lastBackupTime = Date.now();
   }
}

let resetRequested = false;

export async function resetGame(): Promise<void> {
   resetRequested = true;
   await deleteFile(SaveKey);
}

export async function loadFromFile(): Promise<SaveGame> {
   const [fileHandle] = await window.showOpenFilePicker();
   const file = await fileHandle.getFile();
   const json = await file.arrayBuffer();
   return jsonDecode<SaveGame>(decompressFromUint8Array(new Uint8Array(json)));
}

export async function saveToFile(save: SaveGame): Promise<FileSystemFileHandle> {
   const fileHandle = await window.showSaveFilePicker({
      suggestedName: `${save.state.playerProvince}_${dateToYYYYMMDD(getGameDate(save.state.tick))}_V${save.options.version}.save`,
   });
   const writable = await fileHandle.createWritable();
   await writable.write(compressToUint8Array(jsonEncode(save)) as Uint8Array<ArrayBuffer>);
   await writable.close();
   return fileHandle;
}
