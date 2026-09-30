# Teyvat Codex

**Interactive Traveler Dossier & Codex Console**

A portfolio and CMS designed as an illuminated traveler dossier — warm parchment,
saddle leather, imperial gold, organic fantasy curves, and Genshin-style lore
vocabulary. The public site renders from the database when one is configured and
from an authored dataset when it is not, so it is never half-empty.

## Design System

- **Theme:** ☀️ Teyvat Codex — one warm parchment palette, light-only (no theme switch)
- **Palette:** Parchment `#FAF8F5`, Saddle leather `#8C6239`, Imperial gold `#B88414` / `#F2C94C`, Jade `#38EF7D`, Espresso `#2C1E14`
- **Typography:** Cinzel (display), Cormorant Garamond (serif), Inter (body)
- **Icons:** Teyvat Codex artwork (`public/ui-icons`) through `AssetIcon`, plus typographic codex marks through `CodexGlyph` — no third-party icon library
- **Components:** Codex panels and cards, elemental vision badges, bookmark ribbons, diamond spinners, segment bars
- Full specification: [DESIGNS.md](DESIGNS.md)

## Tech Stack

- **Framework:** Next.js 16 (App Router, server components + ISR)
- **Styling:** Tailwind CSS v4 (CSS-variable token theme)
- **Animation:** Framer Motion (shared `EASE_CODEX` curve)
- **Database:** PostgreSQL + Prisma v7 (`@prisma/adapter-pg`)
- **Icons:** bundled Teyvat Codex artwork + typographic marks (no icon dependency)
- **Tests:** Node.js E2E suite (`e2e/`)
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Server composition root (fetches every dataset)
│   ├── home-content.tsx         # Presentational homepage composition
│   ├── projects/[id]/page.tsx   # Public domain dossier
│   ├── dashboard/               # Codex Console (auth-gated CMS)
│   ├── login/                   # Console sign-in
│   ├── api/                     # JSON route handlers
│   ├── opengraph-image.tsx      # Social share card
│   └── globals.css              # Tokens, theme scopes, class registry
├── components/
│   ├── ui/                      # Primitives (Button, Card, Modal, ListToolbar, …)
│   ├── features/                # Domain blocks (forms, cards, rows, panels)
│   ├── layout/                  # Site header/footer, rail, dock, console sidebar
│   └── sections/                # Landing sections (prop-driven)
├── lib/
│   ├── dto.ts                   # The wire contract for every payload
│   ├── portfolio-repo.ts        # The only content reader (DB-or-fallback)
│   ├── navigation.ts            # The only navigation registry
│   ├── session.ts               # HMAC session tokens
│   ├── api-client.ts            # Typed dashboard mutation client
│   └── use-list-controls.ts     # Search + sort + pagination + selection
└── data/
    ├── portfolio.ts             # Authored dataset (static-data mode + seed source)
    └── sections.ts              # Section registry fallbacks
```

## Pages

1. **Dossier** (`/`) — hero dossier, domains, talents, quests, allies and summon sections
2. **Domain dossier** (`/projects/<id>`) — full project record with links and specs
3. **Codex Console** (`/login` → `/dashboard`) — projects, skills, experiences, testimonials, socials, codex pages, profile, telemetry and settings

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env`:

| Variable | Purpose |
|---|---|
| `DASHBOARD_SECRET` | Console password **and** the HMAC key for session cookies. Unset → the console fails closed (`503`). |
| `DATABASE_URL` | PostgreSQL connection string. **Absent → static-data mode**: reads come from `src/data/*`, writes return `503`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical deployment URL (metadata, sitemap, robots). |
| `NEXT_PUBLIC_PORTFOLIO_NAME` / `NEXT_PUBLIC_PORTFOLIO_TAGLINE` | Optional profile overrides. |

### Static-data mode (default)

Leave `DATABASE_URL` commented out. Every page, list and empty state renders from
the authored dataset, and mutating endpoints answer `503` with an explanatory
message that the console displays. Use this for local development, e2e runs and
demo deployments.

### Real database

```bash
# uncomment DATABASE_URL in .env, then
npx prisma migrate deploy
node --experimental-strip-types prisma/seed.ts
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Production build + route, navigation and API contract suites |

The e2e suite starts its own production server on `TEST_PORT` (default `3005`) and
never touches a running `:3000` dev server.

## Documentation

- **[AGENTS.md](AGENTS.md)** — engineering directive: architecture, layering rules, security and quality gates.
- **[DESIGNS.md](DESIGNS.md)** — UI/UX specification: tokens, class registry, iconography and anti-patterns.
