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
/* Teyvat Codex — one warm parchment palette, no theme switching */
--color-parchment-base: #FAF8F5;        /* Base warm ivory canvas */
--color-parchment-subtle: #F3EDDF;      /* Secondary parchment tone */
--color-parchment-elevated: #EDE5D2;    /* Elevated surface tone */
--color-leather-dark: #2C1E14;          /* High-contrast deep espresso text (WCAG AAA) */
--color-leather-muted: #5E412A;         /* Muted leather metadata text */
--color-leather-caramel: #8C6239;       /* Rich caramel leather border & accent */

/* Ink values — text-safe on the darkest light surface (#F3EDDF) */
--color-gold-ink: #6E4F0E;              /* Gold-tone text & values */
--color-jade-ink: #0A6E3A;              /* Success / active text */
--color-amber-ink: #8A5A00;             /* Warning text */
--color-info-ink: #01579B;              /* Informational text */
--color-crimson-600: #B3261E;           /* Danger text, destroy actions */
--color-crimson-700: #8C1D18;           /* Danger hover / pressed */
```

Every surface renders light. The `*Ink` values exist because the elemental
*fills* are decoration only and never carry text — text uses the ink variant.

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

#### Jade Scale (Sanctioned green — growth, health, "deployed")
| Token | Hex Value | Usage |
|---|---|---|
| `--color-jade-300` | `#86E29B` | Light jade on dark surfaces |
| `--color-jade-400` | `#38EF7D` | **Primary jade** (success, active status) |
| `--color-jade-500` | `#19C46A` | Jade fill (segment bars, charts) |
| `--color-jade-600` | `#0E9B52` | Deep jade |

#### Radii, elevation & typography
```css
--radius-codex-panel: 1.5rem;      /* panels */
--radius-codex-card: 1.25rem;      /* cards */
--radius-codex-control: 0.875rem;  /* buttons, inputs */

--shadow-codex-card: 0 8px 30px rgba(60, 40, 15, 0.07);
--shadow-codex-raised: 0 12px 36px rgba(60, 40, 15, 0.10);
--shadow-codex-glow: 0 0 20px rgba(242, 201, 76, 0.20);

--font-display: var(--font-cinzel), var(--font-cormorant), Georgia, serif;
--font-serif: var(--font-cormorant), var(--font-cinzel), Georgia, serif;
--font-body / --font-sans: var(--font-inter), "Plus Jakarta Sans", system-ui, sans-serif;
```

---

## 5. Non-Negotiable Rules & Anti-Patterns

> [!CAUTION]
> **STRICT PROHIBITION OF TACTICAL, MECHA, OR CYBERPUNK STYLING**  
> Never use sharp 45-degree mecha chamfer cuts, monospace telemetry system jargon (`SYS_NODE // 0x482A`, `SCANNING ARRAY`), scanlines, or generic dark-grey/slate boxes in Light Mode.  
> **Always** use pure Genshin Impact fantasy curves, warm cognac leather accents, and authentic Teyvat Codex terminology.

| Tactical / Mecha Pattern (FORBIDDEN ❌) | Teyvat Codex Standard (REQUIRED ✅) |
|---|---|
| Sharp 45° chamfered polygon cuts | Soft organic fantasy curves (`rounded-3xl`, `rounded-2xl`) with warm leather borders |
| `rounded-none` / square panels | Radius policy below — panels `codex-panel-radius`, cards `codex-radius-card`, controls `codex-radius-sm` / `codex-btn`, pills & dots `rounded-full` |
| Dark grey / slate cards in light mode | Warm Ivory Parchment cards (`#FFFFFF` / `#FAF8F5`) with warm caramel borders |
| Faint / ghost-white text on light background | Deep Espresso text (`#2C1E14` / `#1E1208`) with Imperial Amber Gold highlights |
| Monospace telemetry jargon (`SYS_REF // 0x482A`) | Authentic Teyvat lore (`TEYVAT CODEX`, `ADVENTURER HANDBOOK`, `COMMISSION`) |
| Generic circular spinners (`animate-spin`) | Official diamond celestial rotation — `.elemental-rotate` / `CodexLoader` |
| Dark grey social / email button boxes | Warm Ivory buttons with rich caramel borders and gold hover sheen |

---

## 6. Class & Icon Registry

### 6.1. Codex class registry (`src/app/globals.css`)

These classes are defined outside Tailwind's layers, so they win over utility
classes on the same element. Prefer them over re-deriving the same styles.

| Class | Purpose |
|---|---|
| `.codex-panel` / `.codex-panel-strong` | Parchment glass panel (page surfaces, cards) |
| `.codex-card` / `.codex-card-strong` | Leather-glass card (lists, modals) |
| `.codex-label` / `-gold` / `-active` | Uppercase Inter eyebrow labels |
| `.codex-input` | Recessed field with gold focus ring |
| `.codex-badge` | Small tag pill (category, type, counts) |
| `.codex-btn` / `.codex-btn-primary` / `.codex-btn-secondary` | Canonical button surfaces |
| `.codex-panel-radius` / `.codex-radius-card` / `.codex-radius-xs` / `.codex-btn` | Panel / card / control radii |
| `.codex-icon-plate` / `.codex-icon-ink` | Artwork medallion plate / mono-art ink filter on parchment |
| `.codex-glyph` | Typographic codex mark (`CODEX_GLYPHS`) |
| `.codex-scrim` | Modal / drawer scrim |
| `.codex-rise` | Entrance animation for server-rendered surfaces |
| `.codex-sheen` | Hover light sweep |
| `.codex-lift` | Hover lift + shadow |
| `.codex-glow-gold` | Gold ambient glow |
| `.codex-focus` | Focus-visible ring |
| `.codex-gradient-text` | Gold gradient headline text |
| `.codex-grid-bg` | Faint parchment grid |
| `.codex-shimmer` / `.elemental-rotate` | Loading shimmer / diamond spinner (tune via `--codex-spin-duration`) |
| `.hover-scale-sm` / `.press-scale` | Micro-interaction transforms |
| `.bg-starfield` / `.bg-ambient-gold` | Atmospheric washes |
| `.vision-badge` + `.vision-{pyro…geo}` | Elemental vision pills |
| `.cognac-panel` / `.cognac-card-subtle` | Saddle-leather dossier panel |
| `.bookmark-ribbon` | Hanging bookmark ribbon with heart cutout |
| `.figure-shadow-layer` | Offset character silhouette shadow |
| `.segment-bar` (+ `.segment`, `.segment.active`, `.segment.jade`) | Segmented progress readout |

### 6.2. Icon language — artwork pool + typographic marks

There is exactly one icon language: the official Genshin Impact UI artwork in
`public/ui-icons/`, registered in `src/lib/ui-icons.ts` (`GENSHIN_UI_ICONS`,
keyed by `GenshinIconKey`). **No third-party icon library is imported anywhere
in this repository.**

Three rules cover every case:

1. **Artwork on parchment → a leather plate.** `<AssetIcon icon="…" size tone="plate" />`
   renders the pool art on `.codex-icon-plate` (sm 28px / md 36px / lg 44px).
   Plate glyphs are **never filtered** — the pool mixes mono-white and colour
   art, and both read on leather. This is the default for list rows, page
   headers, panel titles and stat cards.
2. **Mono art on parchment → ink.** `tone="ink"` renders the bare glyph with
   `.codex-icon-ink`. Only for the mono-white silhouettes (`pinDelete`, `map`,
   `quitGame`, `survey`, `deckList`, `community`, `back`, `elementalSight`).
   The colour-art keys (`warning`, `performanceMedal`, `paimonMenu`, `domain`)
   must always use a plate.
3. **Marks the pool has no honest glyph for → typographic codex marks.**
   `<CodexGlyph name="…" />` renders `CODEX_GLYPHS` in the display serif:
   `up ▴`, `down ▾`, `prev ◂`, `next ▸`, `close ✕`, `refresh ↻`, `confirm ✓`,
   `edit ✎`, `add +`, `open ↗`. Direction, confirmation, dismissal and
   edit affordances are typographic; an icon library is never the fallback.

Dark fills (`cognac-panel`, `bg-gold-900`, `bg-leather-*`) use `tone="plain"`:
the unfiltered pool art as-is.

`AssetIcon` and `CodexGlyph` are the only renderers (`src/components/ui/`).
No other module may import `GENSHIN_UI_ICONS`; `CodexGlyph` text lives in
`src/lib/ui-icons.ts` beside the pool.

Console navigation icons are declared once in `src/lib/navigation.ts`
(`DASHBOARD_NAV[].icon` is a `GenshinIconKey`); `e2e/navigation.test.mjs`
locks every nav icon to a pool key whose file exists on disk, and locks the
pool itself (unique paths, raster only).

| Console surface | Pool key |
|---|---|
| Overview | `list` |
| Domains | `domain` |
| Talents | `talents` |
| Quests | `quests` |
| Allies | `friends` |
| Summon Desk | `mail` |
| Traveler Profile | `character` |
| Codex Pages | `deckList` |
| Observatory | `elementalSight` |
| Settings | `settings` |

| UI Component | Official Genshin UI Icon | Path |
|---|---|---|
| **Traveler / Profile** | `Icon Character Aether` | `/ui-icons/Icon_Character_Aether.png` |
| **Domains / Projects** | `Icon Domain` / `Icon Artifacts` | `/ui-icons/Icon_Domain.png` |
| **Talents / Skills** | `Icon Gathering of Stars` | `/ui-icons/Icon_Gathering_of_Stars.png` |
| **Crown / Max Mastery** | `Item Crown of Insight` | `/ui-icons/Item_Crown_of_Insight.png` |
| **Quests / Handbook** | `Icon Adventurer Handbook` / `Icon Quests` | `/ui-icons/Icon_Adventurer_Handbook.png` |
| **Rewards (Primogem & Mora)**| `Item Primogem` / `Item Mora` | `/ui-icons/Item_Primogem.png` |
| **Companions / Allies** | `Icon Friends` / `Icon Serenitea Pot` | `/ui-icons/Icon_Friends.png` |
| **Dispatch Shrine / Mail** | `Icon Mail` / `Icon Wish` | `/ui-icons/Icon_Mail.png` |
| **Archive / Codex** | `Icon Archive` | `/ui-icons/Icon_Archive.png` |
| **Clock / Time** | `Icon Time` | `/ui-icons/Icon_Time.png` |
| **Skill vision medallions** | `Elements_Flat_White/Element_White_*` | `/elements/Elements_Flat/Elements_Flat_White/` |



