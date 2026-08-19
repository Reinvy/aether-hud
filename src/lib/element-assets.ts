export interface ElementAsset {
  key: string;
  name: string;
  color: string;
  gildedIcon: string;
  glowIcon: string;
  domain: string;
}

export const TEYVAT_ELEMENTS: ElementAsset[] = [
  {
    key: "pyro",
    name: "Pyro",
    color: "#FF5E41",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Pyro.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Pyro.png",
    domain: "Domain of Guyun // AI Platform & Neural Art",
  },
  {
    key: "hydro",
    name: "Hydro",
    color: "#29B6F6",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Hydro.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Hydro.png",
    domain: "Clear Pool // Full-Stack Mesh & Data Streams",
  },
  {
    key: "anemo",
    name: "Anemo",
    color: "#4DD0E1",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Anemo.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Anemo.png",
    domain: "Valley of Remembrance // Core Languages & Speed",
  },
  {
    key: "electro",
    name: "Electro",
    color: "#B388FF",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Electro.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Electro.png",
    domain: "Momiji-Dyed Court // Real-Time WebSockets & Event Streaming",
  },
  {
    key: "dendro",
    name: "Dendro",
    color: "#7CB342",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Dendro.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Dendro.png",
    domain: "Spire of Solitary Enlightenment // AI Agents & Logic",
  },
  {
    key: "cryo",
    name: "Cryo",
    color: "#80DEEA",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Cryo.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Cryo.png",
    domain: "Peak of Vindagnyr // Zero-Trust Security & Cryptography",
  },
  {
    key: "geo",
    name: "Geo",
    color: "#FFB74D",
    gildedIcon: "/elements/Elements_Gilded/Element_Gilded_Geo.png",
    glowIcon: "/elements/Elements_Glow/Element_Glow_Geo.png",
    domain: "Ridge Watch // Distributed DBs & Cloud Infrastructure",
  },
];

export function getElementByKey(key: string): ElementAsset {
  return (
    TEYVAT_ELEMENTS.find((el) => el.key.toLowerCase() === key.toLowerCase()) ||
    TEYVAT_ELEMENTS[0]
  );
}
