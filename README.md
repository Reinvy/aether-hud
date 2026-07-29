# AETHER-HUD

**High-End Tactical Portfolio — Obsidian & Imperial Gold Edition**

A portfolio website designed like a AAA Game HUD, inspired by Honkai: Star Rail, Cyberpunk 2077, and Armored Core. Features chamfered corners, glassmorphism panels, gold accents, and HUD-style UI elements.

## Design System

- **Theme:** Luxury Cybernetics / Tactical Glassmorphism
- **Palette:** Obsidian (#030407), Imperial Gold (#F2C94C), Titanium (#E0E6ED), Stellar Green (#38EF7D)
- **Typography:** Orbitron (display), Inter (body), JetBrains Mono (code)
- **Components:** Glass panels, chamfered corners, HUD indicators, segment bars, tech badges

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design system CSS
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Portfolio main page
│   └── dashboard/           # CMS Dashboard
│       ├── layout.tsx
│       ├── page.tsx         # Overview
│       ├── projects/page.tsx
│       ├── skills/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── ui/                  # Base components (Button, Card, Badge, etc.)
│   ├── layout/              # Header, Footer, Sidebar
│   └── sections/            # Portfolio sections (Hero, Projects, Skills, Contact)
├── lib/
│   ├── constants.ts         # Config, types, navigation data
│   └── utils.ts             # cn() utility
└── data/
    └── portfolio.ts         # Sample portfolio data
```

## Pages

1. **Main Page** (`/`) — Portfolio showcase with Hero, Projects, Skills, Contact sections
2. **Dashboard** (`/dashboard`) — Content management system

## Cron Automation

5 autonomous cron agents maintain the project:

| Agent | Schedule | Focus |
|-------|----------|-------|
| C1 | 02:00 WIB | Feature & Scalability |
| C2 | 06:00 WIB | UI/UX & Design System |
| C3 | 10:00 WIB | Content & Seed |
| C4 | 14:00 WIB | E2E & Integration Test |
| C5 | 18:00 WIB | Performance & Maintenance |

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `NEXT_PUBLIC_SITE_URL` — Deployment URL
- `NEXT_PUBLIC_PORTFOLIO_NAME` — Your name
- `NEXT_PUBLIC_PORTFOLIO_TAGLINE` — Your tagline
