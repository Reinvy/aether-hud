export const GENSHIN_UI_ICONS = {
  // Paimon Menu & Core Navigation
  character: "/ui-icons/Icon%20Character.png",
  characterAether: "/ui-icons/Icon%20Character%20Aether.png",
  characterLumine: "/ui-icons/Icon%20Character%20Lumine.png",
  inventory: "/ui-icons/Icon%20Inventory.png",
  artifacts: "/ui-icons/Icon%20Artifacts.png",
  talents: "/ui-icons/Icon%20Talents.png",
  quests: "/ui-icons/Icon%20Quests.png",
  handbook: "/ui-icons/Icon%20Adventurer%20Handbook.png",
  friends: "/ui-icons/Icon%20Friends.png",
  mail: "/ui-icons/Icon%20Mail.png",
  wish: "/ui-icons/Icon%20Wish.png",
  events: "/ui-icons/Icon%20Events.png",
  sereniteaPot: "/ui-icons/Icon%20Serenitea%20Pot.png",
  archive: "/ui-icons/Icon%20Archive.png",
  map: "/ui-icons/Icon%20Map.png",
  settings: "/ui-icons/Icon%20Settings.png",
  time: "/ui-icons/Icon%20Time.png",
  achievements: "/ui-icons/Icon%20Achievements.png",
  battlePass: "/ui-icons/Icon%20Battle%20Pass.png",
  switchCharacter: "/ui-icons/Icon%20Switch%20Character.png",
  community: "/ui-icons/Icon%20Community.png",
  feedback: "/ui-icons/Icon%20Feedback.png",

  // Items & Currency
  primogem: "/ui-icons/Item%20Primogem.png",
  mora: "/ui-icons/Item%20Mora.png",
  crown: "/ui-icons/Item%20Crown%20of%20Insight.png",
  intertwinedFate: "/ui-icons/Item%20Intertwined%20Fate.png",
  acquaintFate: "/ui-icons/Item%20Acquaint%20Fate.png",

  // Domains & Quests
  domain: "/ui-icons/Icon%20Domain.png",
  abyssStar: "/ui-icons/Icon%20Abyss%20Star.png",
  abyssalStar: "/ui-icons/Icon%20Abyssal%20Star.png",
  trainingGuide: "/ui-icons/Icon%20Training%20Guide.png",
  warning: "/ui-icons/Icon%20Warning.png",
} as const;

export type GenshinIconKey = keyof typeof GENSHIN_UI_ICONS;

export function getGenshinIcon(key: GenshinIconKey): string {
  return GENSHIN_UI_ICONS[key] || GENSHIN_UI_ICONS.character;
}
