export const GENSHIN_UI_ICONS = {
  // Paimon Menu & Core Navigation
  character: "/ui-icons/Icon_Character.png",
  characterAether: "/ui-icons/Icon_Character_Aether.png",
  characterLumine: "/ui-icons/Icon_Character_Lumine.png",
  inventory: "/ui-icons/Icon_Inventory.png",
  artifacts: "/ui-icons/Icon_Artifacts.png",
  talents: "/ui-icons/Icon_Talents.png",
  quests: "/ui-icons/Icon_Quests.png",
  handbook: "/ui-icons/Icon_Adventurer_Handbook.png",
  friends: "/ui-icons/Icon_Friends.png",
  mail: "/ui-icons/Icon_Mail.png",
  wish: "/ui-icons/Icon_Wish.png",
  events: "/ui-icons/Icon_Events.png",
  sereniteaPot: "/ui-icons/Icon_Serenitea_Pot.png",
  archive: "/ui-icons/Icon_Archive.png",
  map: "/ui-icons/Icon_Map.png",
  settings: "/ui-icons/Icon_Settings.png",
  time: "/ui-icons/Icon_Time.png",
  achievements: "/ui-icons/Icon_Achievements.png",
  battlePass: "/ui-icons/Icon_Battle_Pass.png",
  switchCharacter: "/ui-icons/Icon_Switch_Character.png",
  community: "/ui-icons/Icon_Community.png",
  feedback: "/ui-icons/Icon_Feedback.png",

  // Items & Currency
  primogem: "/ui-icons/Item_Primogem.png",
  mora: "/ui-icons/Item_Mora.png",
  crown: "/ui-icons/Item_Crown_of_Insight.png",
  intertwinedFate: "/ui-icons/Item_Intertwined_Fate.png",
  acquaintFate: "/ui-icons/Item_Acquaint_Fate.png",

  // Domains & Quests
  domain: "/ui-icons/Icon_Domain.png",
  abyssStar: "/ui-icons/Icon_Abyss_Star.png",
  abyssalStar: "/ui-icons/Icon_Abyssal_Star.png",
  trainingGuide: "/ui-icons/Icon_Training_Guide.png",
  warning: "/ui-icons/Icon_Warning.png",
} as const;

export type GenshinIconKey = keyof typeof GENSHIN_UI_ICONS;

export function getGenshinIcon(key: GenshinIconKey): string {
  return GENSHIN_UI_ICONS[key] || GENSHIN_UI_ICONS.character;
}
