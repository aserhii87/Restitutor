import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
   appId: "com.fishpondstudio.restitutor",
   appName: "Restitutor",
   webDir: "dist",
   // server: {
   //    url: "http://192.168.3.12:5173/",
   //    cleartext: true,
   // },
   loggingBehavior: "production",
   backgroundColor: "#000000",
   plugins: {
      LiveUpdate: {
         readyTimeout: 30_000,
      },
   },
};

export default config;
