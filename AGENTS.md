# AETHER-HUD — Agent Convention

This file defines the protocol that all AI agents (including cron agents, coding agents, and review agents) must follow when working on this project.

---

## 1. Design System

All UI must follow the **AETHER-HUD Design System**:

### Visual Identity
- **Theme:** Obsidian & Imperial Gold — Luxury Cybernetics / Tactical Glassmorphism
- **Background:** `bg-deep-space (#030407)` + `.bg-starfield` + `.bg-grid-hud` + `.scanline`
- **Panels:** `.glass-panel` (backdrop-filter: blur(20px)) with `.chamfered` corners
- **Buttons:** `.btn-glow-sweep` with gold gradient for primary, glass for secondary
- **Inputs:** `.input-recessed` (dark recessed with gold inner glow on focus)
- **Labels:** `.sys-label` / `.sys-label-gold` / `.sys-label-active` (JetBrains Mono, all caps)
- **Typography:** 'Orbitron' (display), 'Inter' (body), 'JetBrains Mono' (code/mono)
- **Accents:** Imperial Gold (#F2C94C), Titanium (#E0E6ED), Stellar Green (#38EF7D)

### Micro-Details
- `.corner-decor` (+ symbols), `.corner-brackets` (gold L-brackets), `.sys-node`
- `.segment-bar` for skill progress visualization
- `.tech-badge` (hexagonal clip-path badges for tech tags)
- `.crosshair-ring` (crosshair effect on hover for CTA buttons)

### Animations
- Framer Motion for all enter/exit animations (stagger, fade-in-up)
- `.energy-sweep` (hover light sweep), `.btn-glow-sweep` (button glow)
- `.animate-glow-pulse`, `.animate-float-drift`, `.animate-energy-pulse`

### Prohibited
- DO NOT use generic rounded-xl borders — use chamfered corners (clip-path)
- DO NOT use flat/simple shadows — use gold/platinum glow effects
- DO NOT use bright/neon colors — stay in Obsidian/Gold/Titanium palette

---

## 2. Git Protocol

### 2.1 Before Starting Work
- Always run `git pull --ff-only origin main`
- Work only from the `main` branch as a base.

### 2.2 Branch Naming
- All branches **must** follow the pattern:
  ```
  feat/aether-{short-description}
  ```
  Example: `feat/aether-add-analytics`, `feat/aether-fix-nav-responsive`

### 2.3 No Direct Pushes to `main`
- Direct pushes are **strictly forbidden**.
- All changes go through PR → merge workflow.

### 2.4 Commits
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`

---

## 3. Pull Request Workflow

### 3.1 Always Create a PR
- Branch → push → create PR. Never merge locally.

### 3.2 PR Description
Must include:
- **What** was changed
- **Why** it was changed
- **How to test**
- **Environment variables** affected

### 3.3 Squash-Merge
- Merge via **squash-merge** only.
- The squash commit message should summarize the PR.

---

## 4. Code Structure

### 4.1 TypeScript Strict Mode
- The project uses TypeScript with `"strict": true`.
- All code must compile without errors.
- Avoid `any` — use `unknown` + type narrowing.

### 4.2 Source Directory
- All source code lives under `src/`.
- Use `@/` path alias (maps to `src/`).

### 4.3 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`
- **Animation:** Framer Motion
- **Icons:** Lucide React

---

## 5. Cron & Automation Agents

- Cron agents operate via the `.cron/git_helper.sh` script.
- They must read `AGENTS.md` before executing.
- They must follow the same branch/PR/review conventions.
- Output a structured summary at the end of each run.
