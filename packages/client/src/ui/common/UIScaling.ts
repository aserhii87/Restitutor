export function applyUiScale(uiScale: number): void {
   document.documentElement.style.setProperty("font-size", `${62.5 * uiScale}%`);
}

export function remToPx(rem: string): number {
   return Number.parseFloat(rem) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
}
