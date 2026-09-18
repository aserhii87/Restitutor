export const Grid4 = { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" } as const;
export const Grid3 = { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem" } as const;
export const Grid2 = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" } as const;
export const Grid1 = { display: "grid", gridTemplateColumns: "repeat(1, minmax(0, 1fr))", gap: "1rem" } as const;
export const CloseButtonClass = "close-button-shortcut";

export const DiplomacyActionWidth = "25rem";
export const DiplomacyWidth = "60rem";

export const TopRightPanelHeight = "3.5rem";
export const TopRightPanelMargin = "1rem";
document.documentElement.style.setProperty("--top-right-panel-height", TopRightPanelHeight);
document.documentElement.style.setProperty("--top-right-panel-margin", TopRightPanelMargin);

export const ResourcePanelHeight = "7rem";
export const ResourcePanelMargin = "1rem";
document.documentElement.style.setProperty("--resource-panel-height", ResourcePanelHeight);
document.documentElement.style.setProperty("--resource-panel-margin", ResourcePanelMargin);

export const SidebarWidth = "40rem";
export const SidebarWiderWidth = "50rem";
export const SidebarTopMargin = `${Number.parseFloat(ResourcePanelHeight) + 2 * Number.parseFloat(ResourcePanelMargin)}rem`;
export const SidebarMargin = "1rem";
export const SidebarLeftMargin = `calc(${SidebarMargin} + var(--safe-area-inset-left, env(safe-area-inset-left, 0px)))`;

export const HeaderHeight = "3.6rem";
document.documentElement.style.setProperty("--header-height", HeaderHeight);

export const ModalFullHeight = "calc(80vh - var(--header-height))";

export const LegacyUpgradeNodeWidth = "16rem";
export const LegacyUpgradeNodeHeight = "9rem";
export const LegacyUpgradeNodeSpacingX = "9rem";
export const LegacyUpgradeNodeSpacingY = "9rem";
document.documentElement.style.setProperty("--legacy-upgrade-node-width", LegacyUpgradeNodeWidth);
document.documentElement.style.setProperty("--legacy-upgrade-node-height", LegacyUpgradeNodeHeight);

export const FamilyNodeWidth = "25rem";
export const FamilyNodeHeight = "10rem";

document.documentElement.style.setProperty("--family-node-width", FamilyNodeWidth);
document.documentElement.style.setProperty("--family-node-height", FamilyNodeHeight);

export const ProductionNodeWidth = "15rem";
export const ProductionNodeHeight = "15rem";
export const ProductionNodeSpacingX = "2rem";
export const ProductionNodeSpacingY = "10rem";
document.documentElement.style.setProperty("--production-node-width", ProductionNodeWidth);
document.documentElement.style.setProperty("--production-node-height", ProductionNodeHeight);
