import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { Platform, type Product, ProductType, store } from "capacitor-plugin-cdv-purchase";
import { showPanel } from "../ui/common/ShowPanel";
import { MobilePurchaseSingletonModal } from "../ui/MobilePurchaseSingletonModal";
import { isMobilePlatform, readFile, writeFile } from "./NativeUtils";
import { getBuildNumber } from "./Version";

export async function initMobile(): Promise<void> {
   initLiveUpdate();
   initInAppPurchase();
}

async function initLiveUpdate(): Promise<void> {
   if (!isMobilePlatform()) {
      return;
   }
   await LiveUpdate.ready();
   const response = await fetch(`https://ota.fishpondstudio.com/restitutor-v1.json?t=${Date.now()}`);
   const json = await response.json();
   if (getBuildNumber() >= json.build) {
      console.log("Current app is shipped with latest build:", json.build);
      return;
   }
   const build = String(json.build);
   const current = await LiveUpdate.getCurrentBundle();
   if (current.bundleId === build) {
      console.log("Current bundle is already the latest build:", build);
      return;
   }
   const bundles = await LiveUpdate.getDownloadedBundles();
   const bundle = bundles.bundleIds.find((id) => id === build);
   if (bundle) {
      console.log("Found latest bundle on disk, will set it as next bundle:", build);
      await LiveUpdate.setNextBundle({ bundleId: build });
   } else {
      console.log("Will download the latest bundle:", build);
      await LiveUpdate.downloadBundle({
         url: `https://ota.fishpondstudio.com/restitutor-${build}.zip`,
         bundleId: build,
      });
      await LiveUpdate.setNextBundle({ bundleId: build });
   }
}

const ProductId = "fullgame";
let _product: Product | undefined;

export async function initInAppPurchase(): Promise<void> {
   store.register([
      {
         id: ProductId,
         type: ProductType.NON_CONSUMABLE,
         platform: Platform.APPLE_APPSTORE,
      },
      {
         id: ProductId,
         type: ProductType.NON_CONSUMABLE,
         platform: Platform.GOOGLE_PLAY,
      },
   ]);
   store.error((error) => {
      console.error("Store error:", error.code, error.message);
   });
   store
      .when()
      .productUpdated((product) => {
         if (product.id === ProductId) {
            _product = product;
         }
      })
      .approved(async (transaction) => {
         _product = store.get(ProductId);
         if (transaction.products.some((p) => p.id === ProductId)) {
            await setLocalPurchase(true);
            transaction.finish();
         }
      })
      .receiptUpdated(async (receipt) => {
         _product = store.get(ProductId);
         if (store.owned(ProductId)) {
            await setLocalPurchase(true);
         } else {
            await setLocalPurchase(false);
         }
      });

   await store.initialize([Platform.APPLE_APPSTORE, Platform.GOOGLE_PLAY]);
}

const LocalPurchase = "RestitutorLocalPurchase";

export async function isMobilePurchased(): Promise<boolean> {
   return (await getLocalPurchase()) || store.owned(ProductId);
}

async function getLocalPurchase(): Promise<boolean> {
   try {
      return (await readFile(LocalPurchase)) === "true";
   } catch {
      return false;
   }
}

async function setLocalPurchase(purchased: boolean): Promise<void> {
   if (purchased && !(await getLocalPurchase())) {
      showPanel(MobilePurchaseSingletonModal, {});
   }
   await writeFile(LocalPurchase, purchased ? "true" : "false");
}

export async function purchaseMobile() {
   const product = store.get(ProductId);
   if (!product) {
      throw new Error("Product is not available");
   }
   const result = await product.getOffer()?.order();
   if (result?.isError) {
      throw new Error(result.message);
   }
}

export async function restorePurchaseMobile(): Promise<void> {
   const result = await store.restorePurchases();
   if (result?.isError) {
      throw new Error(result.message);
   }
}
