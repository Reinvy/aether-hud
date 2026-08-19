# DESIGNS.md — Master UI/UX Design System Specification

> **AETHER-HUD Design System: Teyvat Codex Edition**  
> **Aesthetic Philosophy:** Luxury Fantasy RPG / Illuminated Traveler Dossier  
> **Inspirations:** *Genshin Impact* (Teyvat Codex, Traveler Showcase, Adventurer Handbook, Inazuma Celestial Night, Archon Elegance).  
> **Core Directives:** Pure Genshin Impact fantasy UI aesthetics. Zero tactical, modern, or mecha elements.

---

## 1. Design Philosophy & Vision

The **AETHER-HUD (Teyvat Codex Edition)** embodies the warmth, craft, and editorial grandeur of an ancient illuminated traveler's chronicle from Teyvat. Every card, badge, dialog, and panel is styled as an authentic artifact, dossier page, or celestial stone tablet.

### Core Aesthetic Pillars:
1. **Dual-Mode Chromatic Harmony:**
   - **Teyvat Codex (Default / Warm Light Mode):** Warm ivory parchment canvas (`#FAF7EE`), rich warm cognac & saddle leather (`#8D6343`, `#8C6239`, `#603813`), deep espresso walnut typography (`#1E1208`, `#2B1A0D`), and imperial amber gold accents (`#B88414`, `#C69214`, `#DFAE2A`).
   - **Inazuma Celestial Night (Dark Mode / `[data-theme="celestial-night"]`):** Deep midnight indigo (`#070913`), celestial obsidian containers (`#0D1122`), and luminous electro gold highlights (`#F2C94C`, `#B388FF`).
2. **High-Contrast Editorial Typography:**
   - Classical display serif (`Cinzel`) for grand character titles and domain headings.
   - Clean, high-legibility sans-serif (`Inter` / `Plus Jakarta Sans`) with deep contrast for long-form chronicle lore.
   - Strict WCAG AAA/AA readability: no ghosted or faint text on parchment surfaces.
3. **7 Elemental Resonance Palette:**
   - **Pyro:** Blazing Vermilion (`#FF5E41`) — AI Platforms & Neural Engines.
   - **Hydro:** Cerulean Azure (`#29B6F6`) — Full-Stack Architectures & Data Pipelines.
   - **Anemo:** Radiant Teal (`#4DD0E1`) — Core Languages, Speed & High Performance.
   - **Electro:** Violet Pulse (`#B388FF`) — Real-Time Streaming & Event Queues.
   - **Dendro:** Lush Jade (`#7CB342`) — Autonomous Agents & Ecosystem Logic.
   - **Cryo:** Glacial Frost (`#80DEEA`) — Cryptography, Security & Zero-Trust Perimeters.
   - **Geo:** Amber Gold (`#FFB74D`) — Resilient Databases & Cloud Infrastructure.
4. **Authentic Genshin Fantasy Embellishments:**
   - Generous organic fantasy curves (`rounded-3xl`, `rounded-2xl`, `rounded-full`).
   - Ornate gilded filigree borders, wax seals, and hanging bookmark ribbons with heart cutouts.
   - Official Genshin Impact UI icons (Paimon/Aether crest, Adventurer Handbook, Domains, Quests, Wish, Mora, Primogem, Serenitea Pot).
   - Living atmosphere with falling sakura blossom petals (`SakuraCanvas`) and subtle celestial stardust.

---

## 2. Non-Negotiable Rules & Anti-Patterns

> [!CAUTION]
> **STRICT PROHIBITION OF TACTICAL, MECHA, OR CYBERPUNK STYLING**  
> Never use sharp 45-degree mecha chamfer cuts, monospace telemetry system jargon (`SYS_NODE // 0x482A`, `SCANNING ARRAY`), scanlines, or generic dark-grey/slate boxes in Light Mode.  
> **Always** use pure Genshin Impact fantasy curves, warm cognac leather accents, and authentic Teyvat Codex terminology.

| Tactical / Mecha Pattern (FORBIDDEN ❌) | Teyvat Codex Standard (REQUIRED ✅) |
|---|---|
| Sharp 45° chamfered polygon cuts | Soft organic fantasy curves (`rounded-3xl`, `rounded-2xl`) with warm leather borders |
| Dark grey / slate cards in light mode | Warm Ivory Parchment cards (`#FFFFFF` / `#FAF7EE`) with warm caramel borders |
| Faint / ghost-white text on light background | Deep Espresso text (`#1E1208` / `#2B1A0D`) with Imperial Amber Gold highlights |
| Monospace telemetry jargon (`SYS_REF // 0x482A`) | Authentic Teyvat lore (`TEYVAT CODEX`, `ADVENTURER HANDBOOK`, `COMMISSION`) |
| Generic circular spinners | Official diamond celestial rotation (`elemental-rotate` / `hud-spinner`) |
| Dark grey social / email button boxes | Warm Ivory buttons with rich caramel borders and gold hover sheen |

---

## 3. Complete Design Token Registry

Tokens are defined in [src/app/globals.css](file:///Volumes/Reinshy/Workspace/Personal/Aether%20HUD/aether-hud/src/app/globals.css) via Tailwind CSS v4 `@theme inline`.

### 3.1. Surface & Background Tokens

```css
/* Teyvat Codex (Default / Warm Light Mode) */
--color-parchment-base: #FAF7EE;        /* Base warm ivory canvas */
--color-parchment-subtle: #F3EDDF;      /* Secondary parchment tone */
--color-parchment-elevated: #EDE5D2;    /* Elevated surface tone */
--color-leather-dark: #1E1208;          /* High-contrast deep espresso text */
--color-leather-caramel: #8C6239;       /* Rich caramel leather border & accent */
--color-leather-cognac: #8D6343;        /* Warm cognac / saddle leather panel background */
--color-leather-muted: #5E412A;         /* Muted leather metadata text */
--color-leather-accent: #4A2B0E;        /* Deep accent tone */

/* Inazuma Celestial Night (Dark Mode / [data-theme="celestial-night"]) */
--color-deep-space: #070913;            /* Deepest midnight viewport background */
--color-surface-primary: #0D1122;       /* Primary dark container surface */
--color-surface-overlay: rgba(13, 17, 34, 0.78); /* High-density glass backdrop */
--color-glass-card: rgba(22, 28, 52, 0.50);      /* Translucent night glass */
```

### 3.2. Metallic & Accent Color Scales

#### Imperial Gold Scale (Primary Luxury Accent)
| Token | Hex Value | Usage |
|---|---|---|
| `--color-gold-50` | `#FEFAEE` | Brightest highlight / sparkle |
| `--color-gold-100` | `#FDF2CA` | Light metallic text accent |
| `--color-gold-200` | `#FCE69C` | Light hover state |
| `--color-gold-300` | `#F9D66E` | Hover active glow |
| `--color-gold-400` | `#F2C94C` | **Primary Brand Gold** (Buttons, active borders) |
| `--color-gold-500` | `#DFAE2A` | Gradient mid-stop / Rich gold |
| `--color-gold-600` | `#B88414` | High-contrast amber gold text & filigree |
| `--color-gold-700` | `#936B14` | Deep gold borders |
| `--color-gold-800` | `#6E4F0E` | Ambient low-contrast gold |
| `--color-gold-900` | `#4A3509` | Shadow tone |

---

## 4. Typography Hierarchy & Text Contrast

Typography pairs majestic classical display serif with crisp high-legibility sans-serif:

```
Display Headings  ──► Cinzel (Majestic, Classical, All-Caps, Tracked)
Body & Narrative  ──► Inter / Plus Jakarta Sans (Clean, Warm, High Legibility)
System Badges     ──► JetBrains Mono (Crisp, Elegant, Small Caps)
```

### 4.1. Text Color Rules (WCAG AAA/AA Compliance):
- **Heading Titles:** `text-leather-dark` (`#1E1208`) with `.text-gradient-gold` highlight (`#B88414` / `#C69214`).
- **Body & Lore Paragraphs:** `text-[#2B1A0D]` or `text-leather-dark` (`#1E1208`) on parchment cards.
- **Section Badges:** `bg-leather-caramel/10 border-leather-caramel/25 text-leather-dark`.
- **Right Sidebar Content (Hero Cognac Panel):** Crisp ivory text (`#FAF7EE`, `#FDF2CA`) on warm cognac leather.

---

## 5. Hero Traveler Dossier Architecture (1:1 with `references/ref2.png`)

The Hero Section is the master showcase of the platform:
1. **Expansive Max Width:** Container spans `max-w-7xl` (1400px) for a wide, immersive gaming dossier aspect ratio.
2. **Top Navigation Bar:**
   - Gilded archive medallion on the left (`DOC NO. 07-EXPEDITION`).
   - Centered traveler switcher (`LUMINE ◄► AETHER`) with caramel active tab.
   - Hanging top-right bookmark ribbon with heart seal.
3. **Left Character Diorama:**
   - High-res 3D traveler figure (Aether / Lumine) with subtle grayscale shadow silhouette.
   - Ambient element glow matching the active vision.
   - Floating 5-star traveler badge (`★★★★★ 5-STAR TRAVELER`).
4. **Center Narrative & Lore:**
   - "The Traveler // 旅人" in classical serif.
   - Giant serif title ("Aether" / "Lumine") with intersecting warm caramel block.
   - Developer name and professional tagline.
   - Rich, high-contrast bio narrative in deep espresso text.
   - Genshin primary button ("SUMMON ARCHITECT") & secondary button ("EXPLORE DOMAINS").
5. **Right Cognac Leather Panel (`.cognac-panel`):**
   - Rich warm cognac background (`#8D6343` / `#956845`) with crisp ivory/gold text.
   - `fragment -`: 7 elemental vision runes with glowing active state.
   - `wishful +`: Expandable featured banner.
   - `memory -`: Latin motto “Memoria nostra sit aeterna...”.
   - `myriad -`: Tech stack badges in warm ivory pills.

---

## 6. Official Genshin UI Icon Registry

All UI iconography across navigation, headings, cards, and interactives must utilize the official Genshin Impact UI icons registered in [references/UI_ICONS.md](file:///Volumes/Reinshy/Workspace/Personal/Aether%20HUD/aether-hud/references/UI_ICONS.md) and exported via [src/lib/ui-icons.ts](file:///Volumes/Reinshy/Workspace/Personal/Aether%20HUD/aether-hud/src/lib/ui-icons.ts).

### 6.1. Core Icon Mappings:
| UI Component | Official Genshin UI Icon | Path |
|---|---|---|
| **Traveler / Profile** | `Icon Character Aether` | `/ui-icons/Icon%20Character%20Aether.png` |
| **Domains / Projects** | `Icon Domain` / `Icon Artifacts` | `/ui-icons/Icon%20Domain.png` |
| **Talents / Skills** | `Icon Talents` | `/ui-icons/Icon%20Talents.png` |
| **Crown / Max Mastery** | `Item Crown of Insight` | `/ui-icons/Item%20Crown%20of%20Insight.png` |
| **Quests / Handbook** | `Icon Adventurer Handbook` / `Icon Quests` | `/ui-icons/Icon%20Adventurer%20Handbook.png` |
| **Rewards (Primogem & Mora)**| `Item Primogem` / `Item Mora` | `/ui-icons/Item%20Primogem.png` |
| **Companions / Allies** | `Icon Friends` / `Icon Serenitea Pot` | `/ui-icons/Icon%20Friends.png` |
| **Dispatch Shrine / Mail** | `Icon Mail` / `Icon Wish` | `/ui-icons/Icon%20Mail.png` |
| **Archive / Codex** | `Icon Archive` | `/ui-icons/Icon%20Archive.png` |
| **Clock / Time** | `Icon Time` | `/ui-icons/Icon%20Time.png` |


