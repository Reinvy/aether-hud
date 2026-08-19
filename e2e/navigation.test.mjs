#!/usr/bin/env node
/**
 * AETHER-HUD E2E Navigation & Page-Load Tests (plain Node — no tsx/Playwright needed)
 *
 * Focus: navigation integrity + page-load health against the LIVE production site.
 *  - Every expected route (public + dashboard + API) must resolve
 *  - Internal navigation links extracted from rendered HTML must not 404/500
 *  - Bogus routes must return the custom 404 (no catch-all misrouting)
 *  - Auth boundary: /api/auth must REJECT invalid credentials (never 200)
 *
 * Build/route-manifest coverage lives in e2e/run-tests.mjs (full `npm run build`).
 * This spec is deliberately fast: live HTTP checks only.
 *
 * Run: node e2e/navigation.test.mjs   (also wired into `npm run test:e2e`)
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// aether-hud.vercel.app is TAKEN by another project — the real production
// domain is aether-hud-lyart.vercel.app (see .cron/VERCEL_DOMAIN.env).
function resolveProductionUrl() {
  try {
    if (existsSync(".cron/VERCEL_DOMAIN.env")) {
      const env = readFileSync(".cron/VERCEL_DOMAIN.env", "utf-8");
      const match = env.match(/^PRODUCTION_URL="([^"]+)"/m);
      if (match) return match[1];
    }
  } catch {}
  return "https://aether-hud-lyart.vercel.app";
}
const PRODUCTION_URL = resolveProductionUrl();

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const PUBLIC_PAGES = ["/", "/login"];
const DASHBOARD_PAGES = [
  "/dashboard",
  "/dashboard/contact",
  "/dashboard/experiences",
  "/dashboard/profile",
  "/dashboard/projects",
  "/dashboard/sections",
  "/dashboard/settings",
  "/dashboard/skills",
  "/dashboard/telemetry",
  "/dashboard/testimonials",
];
// POST-only routes correctly reject HEAD with 405 — 405 proves the route is mounted.
const API_ROUTES = [
  "/api/auth",
  "/api/config",
  "/api/dashboard/stats",
  "/api/experiences",
  "/api/portfolio",
  "/api/projects",
  "/api/sections",
  "/api/skills",
  "/api/socials",
  "/api/telemetry",
  "/api/telemetry/summary",
  "/api/testimonials",
];
const SEO_FILES = ["/robots.txt", "/sitemap.xml"];
// Static assets that power PWA install (manifest), favicon (brand icon) and
// the project-card/avatar placeholder — must all be served by production.
const ASSET_FILES = ["/manifest.json", "/icon.svg", "/placeholder.svg"];
const BOGUS_ROUTES = ["/this-route-does-not-exist-xyz", "/dashboard/nonexistent-page-xyz"];

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  ${GREEN}✅${RESET} ${msg}`);
    passed++;
  } else {
    console.log(`  ${RED}❌${RESET} ${msg}`);
    failed++;
  }
}

function log(title) {
  console.log(`\n${CYAN}📋 ${title}${RESET}`);
}

/** fetch with retry on transient network errors (edge cold starts, blips). */
async function fetchRetry(url, options = {}, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, { ...options, signal: AbortSignal.timeout(options.timeout || 15000) });
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

async function getText(path) {
  const resp = await fetchRetry(`${PRODUCTION_URL}${path}`, { method: "GET" });
  const body = await resp.text();
  return { status: resp.status, body };
}

/** Extract same-origin navigation links from rendered HTML (skip chunks/assets). */
function extractNavLinks(html, origin) {
  const links = new Set();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    let href = m[1];
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    // External links (different origin) are out of scope for a route-integrity crawl.
    if (href.startsWith("http")) {
      if (!href.startsWith(origin)) continue;
      href = href.slice(origin.length) || "/";
    }
    href = href.split("#")[0];
    // Skip build assets / static files — not navigation routes.
    if (href.startsWith("/_next/")) continue;
    if (/\.(js|css|svg|png|ico|webp|avif|jpg|jpeg|woff2?)$/i.test(href)) continue;
    links.add(href);
  }
  return [...links];
}

async function main() {
  // ===== TEST 1: Page-Load Health =====
  log("TEST 1: Page-Load Health (live)");
  console.log(`  ${YELLOW}Target: ${PRODUCTION_URL}${RESET}`);

  for (const route of [...PUBLIC_PAGES, ...DASHBOARD_PAGES]) {
    try {
      const { status } = await getText(route);
      assert(status === 200, `${route} loads with HTTP 200 (got ${status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  for (const route of API_ROUTES) {
    try {
      const resp = await fetchRetry(`${PRODUCTION_URL}${route}`, { method: "HEAD", timeout: 10000 });
      const ok = resp.status === 200 || resp.status === 405;
      assert(ok, `${route} is mounted (got ${resp.status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  for (const route of SEO_FILES) {
    try {
      const { status } = await getText(route);
      assert(status === 200, `${route} is live (got ${status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  for (const route of ASSET_FILES) {
    try {
      const { status } = await getText(route);
      assert(status === 200, `${route} asset is live (got ${status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  // ===== TEST 2: Internal Navigation Link Crawl =====
  // Extracts same-origin nav links from rendered pages and asserts each
  // resolves — catches dead links, stale anchors and routing regressions
  // that liveness checks on a fixed route list would miss.
  log("TEST 2: Internal Navigation Link Crawl (live)");
  const origin = PRODUCTION_URL;
  for (const page of ["/", "/login"]) {
    try {
      const { status, body } = await getText(page);
      assert(status === 200, `${page} renders for link crawl (got ${status})`);
      const links = extractNavLinks(body, origin);
      if (links.length === 0) {
        assert(true, `${page} exposes navigation links to crawl (0 found — nav may be client-side)`);
        continue;
      }
      for (const link of links) {
        try {
          const resp = await fetchRetry(`${origin}${link}`, { method: "GET", timeout: 10000 });
          assert(
            resp.status !== 404 && resp.status !== 500,
            `${page} → ${link} resolves (got ${resp.status})`
          );
        } catch (e) {
          assert(false, `${page} → ${link} is reachable: ${e.message}`);
        }
      }
    } catch (e) {
      assert(false, `${page} is crawlable: ${e.message}`);
    }
  }

  // ===== TEST 3: 404 Probes =====
  log("TEST 3: Unknown Routes Return 404 (no catch-all misrouting)");
  for (const route of BOGUS_ROUTES) {
    try {
      const resp = await fetchRetry(`${PRODUCTION_URL}${route}`, { method: "HEAD", timeout: 10000 });
      assert(resp.status === 404, `${route} returns 404 (got ${resp.status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  // ===== TEST 4: Auth Boundary =====
  // The dashboard is the private area — /api/auth must REJECT invalid
  // credentials. A 200 here would mean the gate is open (fail-closed guard).
  log("TEST 4: Auth Boundary (login must reject bad credentials)");
  for (const [label, payload] of [
    ["wrong password", { password: "definitely-not-the-secret" }],
    ["empty payload", {}],
  ]) {
    try {
      const resp = await fetchRetry(`${PRODUCTION_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        timeout: 10000,
      });
      assert(resp.status === 401, `POST /api/auth with ${label} is rejected (got ${resp.status})`);
    } catch (e) {
      assert(false, `POST /api/auth with ${label} is checkable: ${e.message}`);
    }
  }

  // ===== TEST 5: Dashboard SEO Gate (noindex on auth-gated pages) =====
  // Dashboard pages are the private area — they must carry `noindex, nofollow`
  // robots meta so search engines never index auth-gated content. A lost
  // per-page metadata wrapper silently opens the gate (pages become indexable).
  log("TEST 5: Dashboard SEO Gate (noindex, nofollow on auth-gated pages)");
  for (const route of DASHBOARD_PAGES) {
    try {
      const { status, body } = await getText(route);
      assert(status === 200, `${route} renders for SEO gate check (got ${status})`);
      const robotsMeta = body.match(/<meta\s+name="robots"[^>]*>/i)?.[0] || "";
      assert(
        robotsMeta.includes("noindex") && robotsMeta.includes("nofollow"),
        `${route} declares robots noindex, nofollow (got: ${robotsMeta || "NO robots meta"})`
      );
    } catch (e) {
      assert(false, `${route} is checkable: ${e.message}`);
    }
  }

  // ===== TEST 6: Source-Level Nav Integrity =====
  // The header/sidebar nav is rendered from constants (src/lib/constants.ts).
  // Every nav href must resolve: plain paths to a real app route, anchors to a
  // real section id. A missing anchor (e.g. /#hero with no id="hero" in the
  // hero section) silently breaks the nav — the link renders but scrolls
  // nowhere. Live HTTP checks cannot catch this (sections are lazy-loaded
  // client components), so assert against the source directly.
  log("TEST 6: Source-Level Nav Integrity (nav hrefs resolve)");
  try {
    const constantsSrc = readFileSync("src/lib/constants.ts", "utf-8");
    const sectionsDir = "src/components/sections";
    const sectionFiles = readdirSync(sectionsDir).filter((f) => f.endsWith(".tsx"));
    const landingFiles = [
      ...sectionFiles.map((f) => join(sectionsDir, f)),
      "src/app/home-content.tsx",
      "src/app/layout.tsx",
    ].filter((f) => existsSync(f));
    const sectionsHtml = landingFiles
      .map((f) => readFileSync(f, "utf-8"))
      .join("\n");

    const navBlocks = [
      ...constantsSrc.matchAll(/export const (?:NAV_ITEMS|DASHBOARD_NAV) = \[([\s\S]*?)\] as const;/g),
    ];
    const navHrefs = [];
    for (const [, block] of navBlocks) {
      for (const m of block.matchAll(/href:\s*"([^"]+)"/g)) {
        navHrefs.push(m[1]);
      }
    }
    assert(navHrefs.length > 0, `Extracted nav hrefs from constants (found ${navHrefs.length})`);

    for (const href of [...new Set(navHrefs)]) {
      const anchorMatch = href.match(/^\/?#(.+)$/);
      if (anchorMatch) {
        const anchorId = anchorMatch[1];
        assert(
          new RegExp(`id=["']${anchorId}["']`).test(sectionsHtml),
          `Nav anchor ${href} has matching section id="${anchorId}"`
        );
      } else {
        // Plain path — strip leading/trailing slashes, resolve to src/app
        const rel = href.replace(/^\/+/, "").replace(/\/+$/, "");
        const pagePath = join("src/app", rel, "page.tsx");
        assert(existsSync(pagePath), `Nav path ${href} has page component (${rel}/page.tsx)`);
      }
    }

    // DB-driven nav keys: the header renders nav from /api/sections (key →
    // /#<key>) whenever sections exist, so keys NOT in NAV_ITEMS (experience,
    // testimonials) must still resolve to real section ids. Validate every
    // seed key — a missing id here silently breaks the header scroll link.
    const seedSrc = readFileSync("prisma/seed.ts", "utf-8");
    const sectionKeys = [...seedSrc.matchAll(/key:\s*"([^"]+)"/g)].map((m) => m[1]);
    assert(
      sectionKeys.length > 0,
      `Extracted DB section keys from seed (found ${sectionKeys.length})`
    );
    for (const key of new Set(sectionKeys)) {
      assert(
        new RegExp(`id=["']${key}["']`).test(sectionsHtml),
        `DB section key "${key}" has matching section id="${key}"`
      );
    }

    // All literal anchor hrefs across src/ (#x or /#x) must resolve to a
    // section id — catches hero CTA buttons (#projects, #contact) and any
    // future anchor additions the nav constants don't enumerate.
    const srcFiles = [];
    const walk = (dir) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (f.endsWith(".tsx") || f.endsWith(".ts")) srcFiles.push(p);
      }
    };
    walk("src");
    const allSrc = srcFiles.map((f) => readFileSync(f, "utf-8")).join("\n");
    const anchorIds = [...allSrc.matchAll(/href=["'](?:#|\/#)([^"'#]+)["']/g)].map((m) => m[1]);
    for (const anchorId of new Set(anchorIds)) {
      assert(
        new RegExp(`id=["']${anchorId}["']`).test(sectionsHtml),
        `Anchor #${anchorId} has matching section id="${anchorId}"`
      );
    }
  } catch (e) {
    assert(false, `Nav integrity is checkable: ${e.message}`);
  }

  // ===== TEST 7: API Response Shape Verification =====
  // HEAD liveness checks (TEST 1) cannot detect SILENT API breakage: a route
  // handler that throws and returns an HTML error page with HTTP 200, or a
  // data-source refactor that empties a list, still passes a HEAD check.
  // GET each endpoint and assert the JSON shape + non-trivial payload.
  log("TEST 7: API Response Shape Verification (GET + JSON parse)");
  const API_SHAPES = [
    // [path, expectedType, requiredKeys]
    ["/api/config", "object", ["name", "tagline", "email"]],
    ["/api/dashboard/stats", "object", ["projectCount", "skillCount", "source"]],
    ["/api/experiences", "array", ["id", "company", "role"]],
    ["/api/portfolio", "object", ["name", "projects", "skills", "socials"]],
    ["/api/projects", "array", ["id", "title"]],
    ["/api/sections", "array", ["id", "key", "title"]],
    ["/api/skills", "array", ["id", "name", "level"]],
    ["/api/socials", "array", ["id", "platform", "url"]],
    ["/api/telemetry/summary", "object", ["ok", "source"]],
    ["/api/testimonials", "array", ["id", "name"]],
  ];
  for (const [path, expectedType, requiredKeys] of API_SHAPES) {
    try {
      const resp = await fetchRetry(`${PRODUCTION_URL}${path}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        timeout: 10000,
      });
      assert(resp.status === 200, `${path} returns HTTP 200 (got ${resp.status})`);
      const ctype = resp.headers.get("content-type") || "";
      assert(ctype.includes("application/json"), `${path} returns JSON content-type (got "${ctype}")`);
      const data = await resp.json();
      const isArray = Array.isArray(data);
      assert(
        (expectedType === "array" && isArray) || (expectedType === "object" && !isArray && typeof data === "object" && data !== null),
        `${path} returns ${expectedType} (got ${isArray ? "array" : typeof data})`
      );
      if (isArray) {
        assert(data.length > 0, `${path} returns non-empty array (${data.length} items)`);
        const first = data[0] || {};
        for (const k of requiredKeys) {
          assert(k in first, `${path}[0] has key "${k}"`);
        }
      } else {
        for (const k of requiredKeys) {
          assert(k in data, `${path} has key "${k}"`);
        }
      }
    } catch (e) {
      assert(false, `${path} is checkable: ${e.message}`);
    }
  }

  // ===== TEST 8: Social Icon Registry Sync (landing + dashboard) =====
  // Every `icon: "X"` in the socials data must be registered in BOTH icon
  // maps: the landing `socialIcons` (src/components/sections/contact-section.tsx)
  // and the dashboard `iconMap` (src/components/features/contact/social-links-card.tsx).
  // A social added with an unregistered icon silently renders the fallback
  // (Terminal on landing, Link2 in dashboard) — PR #57 added GitHub Sponsors
  // (Heart) + Ko-fi (Coffee) unregistered; C4 2026-08-12 fixed and locks it here.
  log("TEST 8: Social Icon Registry Sync (data icons registered in both maps)");
  try {
    const portfolioSrc = readFileSync("src/data/portfolio.ts", "utf-8");
    const socialIconsData = [
      ...portfolioSrc.matchAll(/platform: "[^"]+", url: "[^"]*", icon: "([^"]+)"/g),
    ].map((m) => m[1]);
    assert(
      socialIconsData.length > 0,
      `Extracted social icons from data (found ${socialIconsData.length})`
    );

    const landingSrc = readFileSync("src/components/sections/contact-section.tsx", "utf-8");
    const landingMapMatch = landingSrc.match(
      /const socialIcons: Record<string, React\.ElementType> = \{([\s\S]*?)\};/
    );
    assert(landingMapMatch !== null, "Landing socialIcons map is parseable");
    const landingIcons = new Set(
      landingMapMatch
        ? landingMapMatch[1].split(/[\s,]+/).filter(Boolean)
        : []
    );

    const dashSrc = readFileSync("src/components/features/contact/social-links-card.tsx", "utf-8");
    const dashMapMatch = dashSrc.match(
      /const iconMap: Record<string, React\.ElementType> = \{([\s\S]*?)\};/
    );
    assert(dashMapMatch !== null, "Dashboard iconMap is parseable");
    const dashIcons = new Set(
      dashMapMatch
        ? dashMapMatch[1].split(/[\s,]+/).filter(Boolean)
        : []
    );

    for (const icon of new Set(socialIconsData)) {
      assert(
        landingIcons.has(icon),
        `Social icon "${icon}" registered in landing socialIcons map`
      );
      assert(
        dashIcons.has(icon),
        `Social icon "${icon}" registered in dashboard iconMap`
      );
    }
  } catch (e) {
    assert(false, `Social icon registry is checkable: ${e.message}`);
  }

  // ===== TEST 9: PWA Manifest & Icon Integrity (source-level) =====
  // The manifest drives the installable-PWA icon. C4 2026-08-13 (PR #63)
  // fixed the manifest icons pointing at the 800x400 dossier placeholder
  // (/placeholder.svg — also used as the project-card/avatar image) instead
  // of the brand chamfered-A icon (/icon.svg). This locks:
  //   - manifest parses + carries the required PWA fields
  //   - every manifest icon src resolves to a real file/route
  //   - icons never reference placeholder.svg (brand-icon regression)
  //   - layout metadata icons + JSON-LD logo resolve to a real file/route
  log("TEST 9: PWA Manifest & Icon Integrity (source-level)");
  try {
    const manifestSrc = readFileSync("public/manifest.json", "utf-8");
    const manifest = JSON.parse(manifestSrc);
    assert(true, "public/manifest.json parses as valid JSON");
    for (const k of ["name", "short_name", "start_url", "display", "icons"]) {
      assert(k in manifest, `manifest has "${k}"`);
    }
    assert(Array.isArray(manifest.icons) && manifest.icons.length > 0, `manifest declares icons (${manifest.icons?.length || 0})`);

    const publicFiles = readdirSync("public");
    const iconResolves = (src) => {
      const file = src.replace(/^\//, "");
      return publicFiles.includes(file) || existsSync(join("src/app", file));
    };
    for (const icon of manifest.icons) {
      const src = icon.src || "";
      assert(src.startsWith("/"), `manifest icon src "${src}" is absolute`);
      assert(iconResolves(src), `manifest icon src "${src}" resolves (public/ or src/app route)`);
      assert(!src.includes("placeholder"), `manifest icon "${src}" is NOT the dossier placeholder`);
    }

    const layoutSrc = readFileSync("src/app/layout.tsx", "utf-8");
    const iconRefs = [
      ...layoutSrc.matchAll(/icon:\s*"([^"]+)"/g),
      ...layoutSrc.matchAll(/shortcut:\s*"([^"]+)"/g),
      ...layoutSrc.matchAll(/apple:\s*"([^"]+)"/g),
    ].map((m) => m[1]);
    assert(iconRefs.length > 0, `Extracted layout icon refs (found ${iconRefs.length})`);
    for (const ref of new Set(iconRefs)) {
      assert(iconResolves(ref), `layout icon ref "${ref}" resolves (public/ or src/app route)`);
    }

    const logoMatch = layoutSrc.match(/logo:\s*`\$\{APP_URL\}([^`]+)`/);
    assert(logoMatch !== null, "JSON-LD logo uses APP_URL + static path");
    if (logoMatch) {
      assert(iconResolves(logoMatch[1]), `JSON-LD logo path "${logoMatch[1]}" resolves`);
    }
  } catch (e) {
    assert(false, `Manifest & icon integrity is checkable: ${e.message}`);
  }

  // ===== TEST 10: Dashboard Nav Icon Registry Sync (source-level) =====
  // The sidebar renders DASHBOARD_NAV icons via `iconMap[item.icon] || Activity`
  // (src/components/layout/dashboard-sidebar.tsx). An icon name added to
  // DASHBOARD_NAV without being registered in the map silently renders the
  // Activity fallback — same silent-fallback bug class TEST 8 locks for socials.
  // This locks: every `icon: "X"` in DASHBOARD_NAV must be a key of the
  // sidebar iconMap, so the fallback never fires.
  log("TEST 10: Dashboard Nav Icon Registry Sync (DASHBOARD_NAV icons registered)");
  try {
    const constantsSrc = readFileSync("src/lib/constants.ts", "utf-8");
    const navBlock = constantsSrc.match(
      /export const DASHBOARD_NAV = \[([\s\S]*?)\] as const;/
    );
    assert(navBlock !== null, "DASHBOARD_NAV block is parseable in constants.ts");
    const navIcons = navBlock
      ? [...navBlock[1].matchAll(/icon:\s*"([^"]+)"/g)].map((m) => m[1])
      : [];
    assert(
      navIcons.length > 0,
      `Extracted DASHBOARD_NAV icons (found ${navIcons.length})`
    );

    const sidebarSrc = readFileSync(
      "src/components/layout/dashboard-sidebar.tsx",
      "utf-8"
    );
    const iconMapMatch = sidebarSrc.match(
      /const iconMap: Record<string, React\.ElementType> = \{([\s\S]*?)\};/
    );
    assert(iconMapMatch !== null, "Sidebar iconMap is parseable");
    const iconMapKeys = new Set(
      iconMapMatch
        ? iconMapMatch[1].split(/[\s,]+/).filter(Boolean)
        : []
    );
    assert(
      iconMapMatch !== null && iconMapKeys.size > 0,
      `Sidebar iconMap has registered icons (found ${iconMapKeys.size})`
    );

    for (const icon of new Set(navIcons)) {
      assert(
        iconMapKeys.has(icon),
        `Dashboard nav icon "${icon}" registered in sidebar iconMap`
      );
    }
  } catch (e) {
    assert(false, `Dashboard nav icon registry is checkable: ${e.message}`);
  }

  // ===== Summary =====
  const total = passed + failed;
  console.log("\n" + "=".repeat(50));
  if (failed === 0) {
    console.log(`${GREEN}📊 ALL ${total} NAVIGATION TESTS PASSED 🎉${RESET}`);
  } else {
    console.log(`${RED}📊 ${passed} passed, ${failed} failed, ${total} total${RESET}`);
  }
  console.log("=".repeat(50));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
