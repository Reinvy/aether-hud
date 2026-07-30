# AETHER-HUD Changelog

All notable changes to this project are documented here.

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
