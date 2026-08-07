# AETHER-HUD Changelog

All notable changes to this project are documented here.

---

## [2026-08-07] — C5 Performance Optimization & Code Maintenance

### Cleanup
- **`src/components/features/social-form-modal.tsx`** — removed 5 unused lucide-react icon imports (`Globe`, `GitBranch`, `MessageCircle`, `Mail`, `Link2`); made `SocialFormRecord` interface module-private (was exported but never imported outside the file).
- **`src/components/ui/list-table-header.tsx`** — `ListColumn` interface made module-private (only consumed by `ListTableHeader` itself).
- **`src/lib/telemetry-store.ts`** — `TelemetrySample` and `MetricSummary` interfaces made module-private (internal to the store; only `recordTelemetry` / `telemetrySummary` are consumed externally).

### Dependencies
- **`lucide-react`** 1.28.0 → **1.30.0** (minor update; icon set additions, no breaking changes — build verified).
- **Deliberately skipped (major versions — need dedicated upgrade PRs):** `eslint` 9→10, `typescript` 5→7, `framer-motion` 12→13, `@types/node` 20→26.
- **Known advisory:** `js-yaml` 4.3.0 (CVE-2026-59870, high, via `@eslint/eslintrc` ← eslint devDep) — fix not backported to 3.x/4.x lines; `npm audit fix` has no resolution. Dev-tooling only, no runtime exposure.

### Audit (verified, no change needed)
- **Build** — `npm run build` passes (route table compiles clean; 31 routes).
- **Lint** — `npx eslint src/` 0 errors (previously 5 unused-import errors).
- **Security** — `.env` not tracked (`git ls-files` shows only `.env.example` + `.cron/VERCEL_DOMAIN.env`); `.env.example` contains placeholders only; no `vcp_`/`ghp_`/`sk-`/connection-string secrets in `src/` or `prisma/`.
- **Error handling** — structured throughout: 16/16 API routes use try/catch with JSON error responses; fetch hooks use AbortController + stale-guards (`src/lib/use-data.ts`); client-side errors tagged `console.error("Failed to ...")`; ErrorBoundary present.
- **Design system** — no `rounded-xl`/`rounded-lg`/`rounded-2xl` (chamfered corners enforced); hardcoded colors only as design-token gold glows (#F2C94C low-alpha); all data sourced from `src/data/portfolio.ts`.

### Verified
- Dead-export audit: 0 unused exports, 0 unreferenced files (after cleanup).
- `npm run build` — passes post-cleanup.

---

## [2026-08-07] — C3 Dynamic Content & Seed Orchestration

### Portfolio content
- **`src/data/portfolio.ts`** — added **AETHER Signal** (proj-17, CLASS-A): AI-powered market intelligence engine with real-time sentiment analysis, social listening, and predictive trend scoring across global feeds. Added **AETHER Circuit** (proj-18, CLASS-S): CI/CD pipeline orchestration platform with visual build graphs, incremental caching, and automated security gating (introduces the **Developer Tools** category). Portfolio now carries **18 projects** across 9 categories.
- **Skill levels** — bumped `Go / Rust` 72 → 76, `Kubernetes / Orchestration` 74 → 78, and `AI Agents / LLM Ops` 85 → 87 (reflecting systems/agentic infrastructure work).
- **Social links** — added **Twitch** (`https://twitch.tv/reinvy`, icon `MonitorPlay`) and **Dribbble** (`https://dribbble.com/reinvy`, icon `Palette`); social roster is now **17 channels**.

### API
- **`src/app/api/portfolio/route.ts`** — new **`?year=<YYYY>`** filter (exact match on project year) added to the shared `filterProjects` helper, so both `?section=projects` and the full-portfolio branch honor it consistently (alongside `search` / `category` / `tags` / `complexity` / `sort` / `limit`).

### UI
- **`src/components/sections/contact-section.tsx`** — registered `MonitorPlay` and `Palette` in the `socialIcons` map so the new channels render their proper glyphs (no silent `Terminal` fallback). Dashboard contact `iconMap` registers the same icons for DB-driven socials.

### Design system
- Verified landing sections still carry the AETHER-HUD markers (`glass-panel`, `chamfered`, `btn-glow-sweep`, `sys-label`, `bg-deep-space`, `starfield`, `grid-hud`) — no regressions. All data remains sourced from `src/data/portfolio.ts`; nothing hardcoded.

### Verified
- `npm run build` — passes (route table compiles clean; portfolio JSON-LD ItemList auto-extends to 18 items via `src/app/page.tsx`).
- `node e2e/run-tests.mjs` — all checks green post-deploy.

---

## [2026-08-06] — C3 Dynamic Content & Seed Orchestration

### Portfolio content
- **`src/data/portfolio.ts`** — added **AETHER Pulse** (proj-15, CLASS-S): real-time event analytics engine with streaming aggregation, anomaly detection, and instant alerting. Added **AETHER Relay** (proj-16, CLASS-A): realtime event streaming gateway with pub/sub fan-out, backpressure handling, and dead-letter queues. Portfolio now carries **16 projects** across 8 categories.
- **Skill levels** — bumped `WebSockets / Realtime` 88 → 90, `Redis / Queues` 80 → 83, and `PostgreSQL` 86 → 87 (reflecting realtime streaming and queue-driven infrastructure work).
- **Social links** — added **Reddit** (`https://reddit.com/u/reinvy`, icon `MessageSquare`) and **RSS** (`https://aether-hud.dev/feed.xml`, icon `Rss`); social roster is now **15 channels**.

### API
- **`src/app/api/portfolio/route.ts`** — extended the query surface with three new filters (shared `filterProjects` helper keeps `?section=projects` and full-portfolio responses consistent):
  - `?tags=<tag1,tag2>` — filter projects matching ANY of the given tags (case-insensitive, comma-separated).
  - `?complexity=<class-s|class-a|class-b>` — filter by complexity class (case-insensitive).
  - `?sort=<year|title|performance>` — sort projects by year (desc), title (asc), or performance (desc).
  - `?section=summary` now also returns `complexityClasses` (distinct sorted list) for dashboard widget consumption.

### UI
- **`src/components/sections/contact-section.tsx`** — registered `MessageSquare` and `Rss` in the `socialIcons` map so the new Reddit/RSS channels render their proper glyphs.

### Design system
- Verified landing sections still carry the AETHER-HUD markers (`glass-panel`, `chamfered`, `btn-glow-sweep`, `sys-label`, `bg-deep-space`, `starfield`, `grid-hud`) — no regressions. All data remains sourced from `src/data/portfolio.ts`; nothing hardcoded.

### Verified
- `npm run build` — passes (27 routes; portfolio JSON-LD ItemList auto-extends to 16 items via `src/app/page.tsx`).
- `node e2e/run-tests.mjs` — all checks green post-deploy.

---

## [2026-08-05] — C5 Performance & Code Maintenance

### Cleanup (dead code)
- **`src/components/features/activity-feed.tsx`** — `ActivityItem` is now module-private (used only by `ActivityFeed`'s own props; no external importers).
- **`src/components/ui/section-skeleton.tsx`** — `SectionSkeletonVariant` is now module-private (used only by `SectionSkeleton`'s `variant` prop; no external importers).

### Error handling
- **`src/app/api/telemetry/route.ts`** — catch block now logs with the tagged `console.error("[TELEMETRY]", …)` pattern used by all other 15 API routes (was a silent catch). Malformed-payload 400 contract unchanged.

### Dependencies
- **`next` 16.2.12 → 16.3.0**, **`eslint-config-next` 16.2.12 → 16.3.0** (same-major minor update). Build verified: 27 routes compile, zero errors/warnings.
- **`npm audit` — 2 high → 0 vulnerabilities.** Safe `npm audit fix` cleared `brace-expansion` (DoS via unbounded intermediate arrays, GHSA-rgw5-rvv9-x895) and `fast-uri` (host confusion via backslash authority, GHSA-7p8r-x3mc-p8w7), both in dev tooling. `sharp`/`postcss` overrides still hold (0.35.3 / 8.5.25).
- Major-version jumps (`@types/node` 20→26, `eslint` 9→10, `typescript` 5→7) intentionally NOT applied in a maintenance patch.

### Audit (verified, no change needed)
- **Security**: no secrets in tracked files; `.env` gitignored and untracked; `.env.example` contains only placeholders (`DATABASE_URL` / `DASHBOARD_SECRET` empty, auth fails closed HTTP 503 when unset); no token-like patterns in `src/` or `prisma/`.
- **Design system**: no prohibited `rounded-xl`/`rounded-2xl` panel corners outside chamfered tokens (remaining `rounded-full` hits are sanctioned status dots / avatars / loader spinners); only inline hex is the deep-space `#030407` theme-color in `layout.tsx`; all UI components carry AETHER-HUD classes.
- **Dead-file audit**: every `src/components/ui/*` has ≥1 importer; unreferenced files list = Next.js App Router convention files (`page.tsx` / `route.ts` / `loading.tsx`), not dead code.

### Verified
- `npx eslint src/` — 0 errors, 0 warnings.
- `npm run build` — passes with zero errors/warnings (27 routes).

---

## [2026-08-05] — C3 Dynamic Content & Seed Orchestration

### Portfolio content
- **`src/data/portfolio.ts`** — added **AETHER Cortex** (proj-13, CLASS-S): autonomous AI agent orchestration hub with multi-agent planning, tool-call routing, memory persistence, and human-in-the-loop approval gates. Added **AETHER Mantle** (proj-14, CLASS-A): edge rendering mesh distributing SSR workloads across global PoPs with sub-50ms cold starts and smart cache tiering. Portfolio now carries 14 projects across AI Platform, No-Code, Education, Portfolio, AI Tooling, Infrastructure, Security, and Data Platform categories.
- **Skill levels** — bumped `AI Agents / LLM Ops` 82 → 85 and `System Design / Architecture` 80 → 82 (reflecting active agent-orchestration and edge-architecture work).
- **Social links** — added **Medium** (`https://medium.com/@reinvy`, icon `BookOpen`) and **GitLab** (`https://gitlab.com/reinvy`, icon `GitFork`); social roster is now 13 channels.

### API
- **`src/app/api/portfolio/route.ts`** — new query capabilities without breaking the existing contract:
  - `?section=summary` — aggregate counts (projectCount / skillCount / socialCount), average skill level, and distinct category list for dashboards/widgets.
  - `?category=<name>` — filter projects by category (case-insensitive substring) on both the full and `?section=projects` responses.
  - `?limit=<n>` — cap the number of projects returned (e.g. `?section=projects&limit=4`).

### UI
- **`src/components/sections/contact-section.tsx`** — registered `BookOpen` and `GitFork` icons in the `socialIcons` map so the new Medium/GitLab channels render their proper glyphs (previously unknown icons fell back to `Terminal`).

### Design system
- Verified all landing sections (hero / projects / skills / experience / testimonials / contact) still carry the AETHER-HUD markers (`glass-panel`, `chamfered`, `btn-glow-sweep`, `sys-label`, `bg-deep-space`, `starfield`, `grid-hud`) — no regressions.

### Verified
- `npx eslint src/` — clean.
- `npm run build` — passes (27 routes; portfolio JSON-LD ItemList auto-extends to 14 items via `src/app/page.tsx`).

---

## [2026-08-03] — C5 Performance & Code Maintenance

### Dead code cleanup
- **`src/components/ui/card.tsx`** — removed unused `CardDescription` and `CardFooter` exports (no importers anywhere in `src/`); dropped now-unused `ReactNode` type import.
- **`src/components/ui/button.tsx`** — `ButtonProps` is now module-private (used only by `Button` itself; no external importers).
- **`src/app/dashboard/experiences/page.tsx`** — removed unused `DashboardFormSkeleton` import.
- **`src/app/dashboard/projects/page.tsx`** — removed dead `tags` parse IIFE inside the list row renderer (result was never consumed; the edit form already parses tags via `parseTagsDisplay`).
- **`src/app/dashboard/sections/page.tsx`** — removed unused `ToggleLeft` / `ToggleRight` icon imports.
- **`src/app/dashboard/settings/page.tsx`** — removed unused `Sun` / `Moon` icon imports.
- **`src/components/features/skill-bar.tsx`** — removed unused `Cpu` icon import.
- **`src/components/sections/contact-section.tsx`** — removed unused `FileText` icon import, unused `cn` import, and unused `Config` type.
- **`src/components/sections/hero-section.tsx`** — removed unused `socials` fetch + `Social` type (hero does not render social links; contact section owns that) and unused `configLoading` from the config fetch.

### Lint gate (was a silent no-op)
- **`eslint.config.mjs`** — replaced the no-op config (only `ignores`, no rules — `npm run lint` exited 0 without linting anything) with a functional flat config using the already-installed `@eslint/js` recommended + `typescript-eslint` recommended. `npm run lint` now actually checks `src/` and surfaces unused imports/vars/dead code. First run surfaced 13 `no-unused-vars` errors — all fixed above; lint is now clean (0 errors).

### Error handling
- **`src/app/api/auth/route.ts`** — catch block now logs with the tagged `console.error("[AUTH_POST]", …)` pattern used by all other API routes (was a silent catch).

### Audit (verified, no change needed)
- **Build**: `npm run build` passes with zero errors/warnings (27 routes compile; static + dynamic as expected).
- **Dependencies**: `npm outdated` — all packages within semver range. Only major-version jumps available (`@types/node` 20→26, `eslint` 9→10, `typescript` 5→7) — intentionally NOT applied in a maintenance patch (breaking changes, would require a dedicated upgrade PR).
- **Security**: no secrets in tracked files; `.env` gitignored and not tracked; `.env.example` contains only placeholders; `DASHBOARD_SECRET` fails closed (HTTP 503) when unset; no hardcoded credentials in `src/`.
- **Error handling**: all 16 API routes use structured try/catch with tagged `console.error` + JSON error responses.
- **Design system**: no generic `rounded-xl`/`rounded-lg`/`rounded-2xl` outside the chamfered design tokens; color usage goes through AETHER-HUD CSS vars / token classes; the only inline hex (`#38EF7D`) is the sanctioned Stellar Green accent; `bg-starfield` + `bg-grid-hud` + `.scanline` present across all landing sections.

### Verified
- `npx eslint src/` — 0 errors, 0 warnings.
- `npm run build` — passes with zero errors/warnings.

---

## [2026-08-03] — C2 UI/UX Enhancement & Design System

### Refactor (reusable components)
- **`src/components/sections/contact-section.tsx`** — subject + message fields now use the shared `Input` / `Textarea` components instead of raw HTML elements (labels, error slots, focus rings consistent with name/email fields). Added prefix icons (User / AtSign / Hash) to all form fields.
- Contact form now has a real sending state: `Button loading` HUD diamond spinner + "ENCRYPTING..." label while transmitting, then "TRANSMITTED" — no more silent 1s pause.

### Micro-interactions
- **Hero terminal panel** — added `.corner-brackets` gold L-brackets + hover border/glow.
- **Skill bars** — new `.skillbar-hover` segment hover glow (segments brighten, active segments gold-300 + stronger glow, stellar variant included); skill name/icon/percentage tint gold on hover.
- **Experience timeline** — node scales up with gold glow on hover; role title transitions to gold.
- **Project cards** — banner gradient subtle zoom (scale-110), grid overlay brightens, gold gradient overlay fades in on hover.

### Loading states (HUD-style)
- **Projects / Skills / Experience / Testimonials** landing sections now use the reusable `HudLoader` diamond spinner + sys-label instead of ad-hoc pulsing dots.
- **Projects grid** shows a 2-card `CardSkeleton` preview while fetching, matching the real card layout.

### Verified
- `npm run build` passes with zero errors/warnings.
- Design-system compliant: all new styles use chamfered corners, gold glow (never neon), `cubic-bezier(0.16, 1, 0.3, 1)` transitions, Orbitron/JetBrains Mono typography.

---

## [2026-08-02] — C5 Performance & Code Maintenance

### Cleanup (dead code)
- **`src/lib/motion-variants.ts`** — removed unused `fadeIn` export; `EASE_HUD` is now module-private (used only by the shared variants). Consumers import `fadeInUp` / `fadeInView` / `staggerContainer` / `fadeInUpItem` — API unchanged.
- **`src/components/ui/skeleton.tsx`** — removed unused `SegmentSkeleton` and `TextSkeleton` exports (no importers anywhere in `src/`); `DashboardStatSkeleton` is now module-private (used only by `DashboardPageSkeleton`).
- **`src/components/features/skill-bar.tsx`** — `skillIconMap` is now module-private (used only inside `SkillBar`).

### Audit (verified, no change needed)
- **Build**: `npm run build` passes with zero errors/warnings (all 27 routes compile, static + dynamic as expected).
- **Dependencies**: `npm outdated` — all packages at latest within semver range. Only major-version jumps available (`@types/node` 20→26, `eslint` 9→10, `typescript` 5→7) — intentionally NOT applied in a maintenance patch (breaking changes, would require a dedicated upgrade PR).
- **Security**: no secrets in tracked files; `.env` is gitignored and not tracked; `.env.example` contains only placeholders; auth fails closed (HTTP 503) when `DASHBOARD_SECRET` is unset; no hardcoded credentials in `src/` or `prisma/` (matches in `portfolio.ts` are skill IDs, not keys).
- **Error handling**: all 15 API routes use structured try/catch with tagged `console.error` + JSON error responses; `useData` hook has AbortController cleanup, stale-response guards, and HTTP-status → message mapping.
- **Design system**: no generic `rounded-xl`/`rounded-lg` outside the chamfered design tokens; all color usage goes through AETHER-HUD CSS vars / token classes (`glass-panel`, `btn-glow-sweep`, `sys-label`, `bg-deep-space` + starfield + grid-hud, gold `#F2C94C` accents).

### Verified
- Dead-export audit script: 0 remaining unused exports; 0 unreferenced source files.

---

## [2026-08-02] — C3 Dynamic Content Update

### Added
- **Projects**: 2 new portfolio entries
  - `AETHER Sentinel` — Autonomous security operations platform with AI threat detection & SIEM ingestion (CLASS-S)
  - `AETHER Atlas` — Geospatial data intelligence platform with vector tile streaming & map analytics (CLASS-A)
- **Skills**: 2 new skill entries — AI Agents/LLM Ops (82), System Design/Architecture (80)
- **Socials**: TikTok and Mastodon profile links added

### Updated
- Skill levels incremented across all categories (Next.js/React 98, TypeScript 96, Tailwind CSS 94, Node.js/API 93, Prisma/SQL 90, Python/AI 88, Framer Motion 91, Docker 84, Figma 88, Vercel/Deploy 95, Go/Rust 72, PostgreSQL 86, WebSockets 88, Redis/Queues 80, Kubernetes 74, GraphQL/tRPC 77)
- Portfolio data file now seeds 12 projects, 18 skills, and 11 social links

### Verified
- All landing sections (hero, projects, skills, testimonials, experience, contact) render content from API routes and use AETHER-HUD design tokens (glass-panel, chamfered, btn-glow-sweep, sys-label, bg-deep-space + starfield + grid-hud) — no hardcoded content

---

## [2026-08-02] — C2 UI/UX Design System Enhancement

### Added
- **`src/lib/motion-variants.ts`** — single source of truth for animation variants
  (`fadeInUp`, `fadeInView`, `staggerContainer`, `fadeInUpItem`, `fadeIn`, `EASE_HUD`
  cubic-bezier(0.16, 1, 0.3, 1)). Removes 12 duplicated `const fadeInUp` blocks across
  dashboard pages and landing sections — every enter animation now uses the SAME
  curve per the design system.
- **`StatCard` component** (`src/components/ui/stat-card.tsx`) — reusable HUD stat
  tile (glass chamfered panel, sys-label, display value, tone-colored icon with
  hover scale/rotate/brighten), extracted from the dashboard overview page.

### Updated
- **Dashboard overview** — stat grid now renders via `StatCard` (shared variants +
  reusable tile), removing duplicated markup.
- **RowActions** — mobile-first touch targets: 36px min hit area (`min-h-9 min-w-9`)
  on <640px, plus hover background feedback on edit/delete.
- **Modal** — close button gets a 36px mobile touch target.
- **Mobile dashboard hamburger** — 40px touch target (`min-h-10 min-w-10`).
- **Badge** — micro-interaction: gold glow shadow + subtle scale on hover.

---

## [2026-08-01] — C5 Performance Optimization & Code Maintenance

### Maintenance
- **Dead code removal**: Removed unused `WebConfig` type from `src/lib/constants.ts`; removed unused deps `@libsql/client` + `@prisma/adapter-libsql` (0 imports anywhere in src/prisma); untracked leftover SQLite dev artifacts (`dev.db`, `test.db`) — project uses PostgreSQL — and added `*.db` to `.gitignore`
- **Security hardening**: Removed hardcoded fallback password `"aether-admin-2026"` from `src/app/api/auth/route.ts` — auth now **fails closed** (HTTP 503) when `DASHBOARD_SECRET` is unset instead of accepting a known default
- **Documentation**: `.env.example` now documents `DATABASE_URL` and `DASHBOARD_SECRET` (no defaults — both required), and updates `NEXT_PUBLIC_SITE_URL` to the real production domain (`aether-hud-lyart.vercel.app`)
- **Structured error handling**: Standardized context-prefix error logging (`console.error("[PREFIX]", ...)`) across API routes that lacked it — projects (GET/POST/PUT), experiences (GET/POST/PUT/DELETE), and all `[id]` DELETE routes (skills, socials, testimonials, projects, experiences); descriptive error messages replace generic `"Failed"`
- **Dependencies updated**: `@types/react` 19.2.17→19.2.18, `@types/react-dom` 19.2.3→19.2.4 (patch-level only; major bumps to eslint 10 / typescript 7 skipped for stability)

---

## [2026-08-01] — C2 UI/UX Design System Enhancement

### Added
- **`HudLoader` component** (`src/components/ui/hud-loader.tsx`) — reusable HUD-style loading indicator with gold diamond spinner + `[SYS_NODE]` label, replacing ad-hoc `animate-spin rounded-full` spinners across dashboard layout, login, and contact pages
- **Button `loading` prop** — renders the HUD diamond spinner, disables the button, sets `aria-busy`; used by all dashboard save/deploy buttons (projects, skills, experiences, testimonials, sections, settings, profile, contact) replacing duplicated `saving ? "SAVING..." : "SAVE"` text-swap logic
- **`prefers-reduced-motion` support** — global animation/transition disable for accessibility
- **HUD diamond spinner keyframes** (`.hud-spinner`, `hud-spin`) and `.press-scale` press micro-interaction utility in globals.css

### Updated
- **DashboardPageHeader** — responsive: title scales down on mobile (`text-xl` → `sm:text-2xl`), wraps actions, hides status label on <640px
- **Dashboard stat cards** — icon micro-interaction: scale + rotate + brighten on hover
- **Sidebar nav** — added `.press-scale` tactile press feedback
- **Login page** — AUTHENTICATING spinner now uses HUD diamond spinner

---

## [2026-08-01] — C3 Dynamic Content Update

### Added
- **Projects**: 2 new portfolio entries
  - `AETHER Nexus` — Zero-trust API gateway & service mesh with edge auth (CLASS-S)
  - `AETHER Vault` — Encrypted secrets management with zero-knowledge architecture (CLASS-A)
- **Skills**: 2 new skill entries — Kubernetes/Orchestration (72), GraphQL/tRPC (75)
- **Socials**: Telegram and Dev.to profile links added
- **API**: `GET /api/portfolio?search=<term>` — search filter for projects (matches title, category, and tags)

### Updated
- Skill levels incremented across all categories (Next.js/React 97, TypeScript 95, Python/AI 87, Vercel/Deploy 94, PostgreSQL 85, WebSockets 86, Redis/Queues 78)

---

## [2026-07-31] — C3 Dynamic Content Update

### Added
- **Projects**: 2 new portfolio entries
  - `AETHER Forge` — AI-assisted creative studio for game-ready asset generation (CLASS-S)
  - `AETHER Beacon` — Observability command center with logs/metrics/traces aggregation (CLASS-A)
- **Skills**: 2 new skill entries — WebSockets/Realtime (84), Redis/Queues (76)
- **Socials**: Instagram and Email profile links added
- **API**: `GET /api/portfolio?section=projects|skills|socials` — section filtering with CDN cache headers
- **API**: Dashboard stats graceful fallback — derives counts from data file when database is unreachable (`source: "data-file-fallback"`), plus `avgSkillLevel` metric

### Updated
- Skill levels incremented across all categories (Node.js/API 91, Prisma/SQL 88, Python/AI 85, Docker 80, Go/Rust 68, PostgreSQL 83)
- Portfolio API route now serves with `Cache-Control` headers (`s-maxage=3600`)

---

## [2026-07-30] — C5 Performance Optimization & Code Maintenance

### Maintenance
- **Dead code removal**: Removed unused `useEffect` import from `experience-section.tsx`, unused `LoadingDots` component from `skeleton.tsx`
- **Dependencies updated**: next@16.2.12, react@19.2.8, react-dom@19.2.8, eslint-config-next@16.2.12, lucide-react@1.28.0
- **Error handling**: Enhanced `use-data` hook with AbortController, stale-response prevention, and descriptive HTTP error messages
- **API error resilience**: Standardized error logging across all API routes with context prefixes and descriptive error messages
- **Security**: Verified `.env` is gitignored — no secrets exposed

## [2026-07-30] — C3 Content Update

### Added
- **Projects**: 2 new portfolio entries
  - `Hermes Agent CLI` — AI coding agent with MCP tool integration (CLASS-S)
  - `AETHER Grid` — Distributed computing dashboard with WebSocket monitoring (CLASS-A)
- **Skills**: 2 new skill entries — Go/Rust (65), PostgreSQL (82)
- **Socials**: YouTube and Discord profile links added
- **API**: `GET /api/portfolio` endpoint — returns full portfolio data from data file
- **Changelog**: Initial changelog document

### Updated
- Skill levels incremented across all categories (reflecting continuous growth)
- Portfolio data file with latest project metadata and live links
