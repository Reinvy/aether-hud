# DESIGNS.md — Master UI/UX Design System Specification

> **AETHER-HUD Design System: Teyvat Codex Edition**  
> **Aesthetic Philosophy:** Luxury Fantasy RPG / Illuminated Traveler Dossier  
> **Inspirations:** *Genshin Impact* (Teyvat Codex, Traveler Showcase, Adventurer Handbook, Inazuma Celestial Night, Archon Elegance).  
> **Direct References:** `references/ref_video.mp4`, `references/ref1.jpg`, `references/ref2.png`.  
> **Core Directives:** Pure Genshin Impact fantasy UI aesthetics. Zero tactical, modern, or mecha elements. Strict WCAG AAA/AA readability and contrast.

---

## 1. Design Philosophy & Visual Directives

The **AETHER-HUD (Teyvat Codex Edition)** delivers a game-tier UI experience inspired directly by official Genshin Impact character showcases, animated promotional videos, and illuminated lore dossiers.

### Core Aesthetic Pillars:
1. **Dual-Theme Chromatic Architecture:**
   - **☀️ Teyvat Codex (Default / Warm Light Mode):** Warm ivory parchment canvas (`#FAF8F5` / `#FAF7EE`), rich warm cognac & saddle leather (`#8B5738`, `#945E3B`, `#6E4024`), deep espresso charcoal typography (`#1E1208`, `#2C1E14`), and imperial amber gold accents (`#B88414`, `#C59A4E`, `#DFAE2A`).
   - **🌙 Inazuma Celestial Night (Dark Mode / `[data-theme="celestial-night"]`):** Deep midnight indigo (`#070913`), celestial obsidian containers (`#0D1122`), ethereal cherry blossom sakura petals, and luminous electro gold highlights (`#F2C94C`, `#B388FF`).
2. **High-Contrast Editorial Typography (WCAG AAA Compliance):**
   - Classical display serif (`Cinzel` / `Cormorant Garamond`) for grand character titles and domain headings.
   - Clean, high-legibility sans-serif (`Inter` / `Plus Jakarta Sans`) with deep contrast for long-form chronicle lore (`#2C1E14` on ivory).
   - Zero low-contrast faint text: body copy contrast ratio must strictly exceed 7:1 against light card backgrounds.
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
   - Ornate gilded filigree borders, wax seals, and hanging bookmark ribbons with heart cutouts (`.bookmark-ribbon`).
   - Official Genshin Impact UI icons (Paimon/Aether crest, Adventurer Handbook, Domains, Quests, Wish, Mora, Primogem, Serenitea Pot).
   - Living atmosphere with falling sakura blossom petals (`SakuraCanvas`) and subtle celestial stardust.

---

## 2. Phase 1: Minimalist 7 Elements Intro Gate (`references/ref_video.mp4`)

The introductory gate creates an elegant, quiet threshold before entering the traveler codex:
- **Canvas Surface:** Pure, clean warm ivory parchment (`#FAF8F5` / `#F8F5EE`).
- **7 Elemental Glyphs:** Displayed in a single, balanced horizontal row in warm sepia/bronze monochrome (`#8C6239` / `#7B5232`), evenly spaced.
- **Subtext:** `kyou x gfx indonesia` in elegant lowercase classical serif with generous letter-spacing (`tracking-[0.25em]`).
- **Call-To-Action:** `Click to Proceed` with a delicate, pulsing circular cursor indicator.
- **Interaction & Transition:** On click, Enter key, or Spacebar, the intro smoothly fades out and scales up slightly (`duration: 0.7s`, `ease: [0.16, 1, 0.3, 1]`), revealing the master Traveler Dossier.

---

## 3. Phase 2: Master Hero Traveler Dossier Architecture (`references/ref2.png`)

The Hero Section is the master centerpiece of the entire portfolio:
1. **Expansive Max Width:** Container spans `max-w-7xl` (1400px) with generous rounded corners (`rounded-3xl` / `rounded-[28px]`), warm ivory background, and a subtle 1.5px warm caramel border (`rgba(140, 98, 57, 0.35)`).
2. **Top Navigation Bar:**
   - **Left:** Circular gilded medallion badge housing the Genshin Archive icon + `TEYVAT CODEX // ARCHIVE` label.
   - **Center/Right:** Minimalist character switcher: `LUMINE  ◄◄  ►►  AETHER` with a clean, solid caramel underline indicator beneath the active character.
   - **Top-Right:** Hanging saddle leather bookmark ribbon (`#8B5738`) with heart cutout hanging down over the top border (`.bookmark-ribbon`).
3. **Left Column — Character Diorama:**
   - High-resolution character figure (Aether / Lumine) with an offset grayscale silhouette shadow layer behind (`.figure-shadow-layer`).
   - Ambient element glow matching the active vision.
   - Floating 5-star traveler badge (`★★★★★ 5-STAR TRAVELER`).
4. **Center Column — Editorial Biography & Identity:**
   - Japanese Kanji & English category tag: `The Traveler // 旅人`.
   - Massive serif title (`Aether` / `Lumine`) with a vertical warm brown rectangular color block accent (`#8C6239`) intersecting/behind the initial letter.
   - Developer name and professional tagline in crisp monospace tracking.
   - High-contrast editorial biography in deep espresso charcoal (`#2C1E14`) with comfortable reading line-height.
   - Genshin action buttons: `SUMMON ARCHITECT` (gradient gold) & `EXPLORE DOMAINS` (parchment secondary).
   - Watermark crest: Subtle large Traveler star emblem in the background (`#E2D8C9`).
5. **Right Column — Cognac Leather Accordion Panel (`.cognac-panel`):**
   - Rich warm cognac saddle leather background (`#8B5738` / `#945E3B`) spanning full height.
   - Crisp ivory/cream typography (`#FAF7EE`, `#FDF2CA`) with 4 interactive accordions:
     - `fragment  -` : 7 elemental vision runes with glowing active state.
     - `wishful  +` : Expandable featured item / portfolio wish banner.
     - `memory  -` : Latin motto *“Memoria nostra sit aeterna, quam nullus in hoc mundo pereat.”* with translation.
     - `myriad  -` : Tech stack specifications in rounded translucent ivory pills (`bg-[#FAF7EE]/25`).

---

## 4. Complete Design Token Registry

Defined in [src/app/globals.css](file:///Users/reincry/Workspace/Personal/aether-hud/src/app/globals.css) via Tailwind CSS v4 `@theme inline`.

### 4.1. Surface & Background Tokens

```css
/* Teyvat Codex (Default / Warm Light Mode) */
--color-parchment-base: #FAF8F5;        /* Base warm ivory canvas */
--color-parchment-subtle: #F3EDDF;      /* Secondary parchment tone */
--color-parchment-elevated: #EDE5D2;    /* Elevated surface tone */
--color-leather-dark: #2C1E14;          /* High-contrast deep espresso text (WCAG AAA) */
--color-leather-caramel: #8C6239;       /* Rich caramel leather border & accent */
--color-leather-cognac: #8B5738;        /* Warm cognac / saddle leather panel background */
--color-leather-muted: #5E412A;         /* Muted leather metadata text */
--color-leather-accent: #6E4024;        /* Deep accent tone */

/* Genshin Dark Brown Codex (Dark Mode / [data-theme="celestial-night"]) */
--color-deep-space: #1A120C;            /* Deepest Genshin roasted espresso background */
--color-surface-primary: #241810;       /* Primary dark roasted chocolate container surface */
--color-surface-overlay: rgba(36, 24, 16, 0.95); /* High-density warm dark leather backdrop */
--color-glass-card: rgba(45, 30, 21, 0.90);      /* Deep Genshin dark leather glass */
```

### 4.2. Metallic & Accent Color Scales

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

## 5. Non-Negotiable Rules & Anti-Patterns

> [!CAUTION]
> **STRICT PROHIBITION OF TACTICAL, MECHA, OR CYBERPUNK STYLING**  
> Never use sharp 45-degree mecha chamfer cuts, monospace telemetry system jargon (`SYS_NODE // 0x482A`, `SCANNING ARRAY`), scanlines, or generic dark-grey/slate boxes in Light Mode.  
> **Always** use pure Genshin Impact fantasy curves, warm cognac leather accents, and authentic Teyvat Codex terminology.

| Tactical / Mecha Pattern (FORBIDDEN ❌) | Teyvat Codex Standard (REQUIRED ✅) |
|---|---|
| Sharp 45° chamfered polygon cuts | Soft organic fantasy curves (`rounded-3xl`, `rounded-2xl`) with warm leather borders |
| Dark grey / slate cards in light mode | Warm Ivory Parchment cards (`#FFFFFF` / `#FAF8F5`) with warm caramel borders |
| Faint / ghost-white text on light background | Deep Espresso text (`#2C1E14` / `#1E1208`) with Imperial Amber Gold highlights |
| Monospace telemetry jargon (`SYS_REF // 0x482A`) | Authentic Teyvat lore (`TEYVAT CODEX`, `ADVENTURER HANDBOOK`, `COMMISSION`) |
| Generic circular spinners | Official diamond celestial rotation (`elemental-rotate` / `hud-spinner`) |
| Dark grey social / email button boxes | Warm Ivory buttons with rich caramel borders and gold hover sheen |

---

## 6. Official Genshin UI Icon Registry

All UI iconography across navigation, headings, cards, and interactives must utilize the official Genshin Impact UI icons registered in [references/UI_ICONS.md](file:///Users/reincry/Workspace/Personal/aether-hud/references/UI_ICONS.md) and exported via [src/lib/ui-icons.ts](file:///Users/reincry/Workspace/Personal/aether-hud/src/lib/ui-icons.ts).

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



