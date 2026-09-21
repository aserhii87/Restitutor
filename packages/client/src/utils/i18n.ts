import { EN } from "../languages/en";

export function $t(str: string, ...subs: (string | number | bigint)[]): string {
   const translation = str;
   if (translation) {
      return interpolate(translation, subs);
   }
   return `⚠️${str}`;
}

// Keep HTML as a string when a downstream consumer handles rendering.
export function htmlText(value: string): string {
   return value;
}

// Keep HTML and custom markup as a string for downstream renderMarkup() calls.
export function markupText(value: string): string {
   return value;
}

function interpolate(phase: string, subs: (string | number | bigint)[]): string {
   if (!phase.includes("$")) return phase;

   let out = "";
   let from = 0;

   for (let i = 0; i < phase.length; i++) {
      if (phase[i] === "$" && i + 1 < phase.length && phase[i + 1] >= "0" && phase[i + 1] <= "9") {
         out += phase.slice(from, i);

         let num = 0;
         let j = i + 1;
         while (j < phase.length && phase[j] >= "0" && phase[j] <= "9") {
            num = num * 10 + (phase.charCodeAt(j) - 48);
            j++;
         }

         const idx = num - 1;
         const sub = subs[idx];
         out += sub === undefined ? `⚠️${num}` : String(sub);

         from = j;
         i = j - 1;
      }
   }

   return out + phase.slice(from);
}

// We need to clone it because when switching languages, we will mutate the object!
export const L = structuredClone(EN);
