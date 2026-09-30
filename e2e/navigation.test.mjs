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
import { startTestServer, resolveTargetUrl } from "./test-server.mjs";

let targetUrl = resolveTargetUrl();

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// `/projects/proj-01` must resolve from the authored dataset, so static-data
// mode publishes working domain dossiers.
const PUBLIC_PAGES = ["/", "/login", "/projects/proj-01"];
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
// Operator data: these read the private archive, so an unauthenticated GET must
// be refused (401 with a configured secret, 503 without one — never 200).
const SESSION_GUARDED_ROUTES = ["/api/dashboard/stats", "/api/dashboard/activity"];
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
  const resp = await fetchRetry(`${targetUrl}${path}`, { method: "GET" });
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

/**
 * Parse the artwork pool literal from src/lib/ui-icons.ts into a key → path map.
 * Read statically so a wrong or missing asset key fails here instead of
 * rendering an empty plate on a live page.
 */
function parseAssetRegistry(source) {
  const block = source.match(/GENSHIN_UI_ICONS = \{([\s\S]*?)\} as const;/);
  if (!block) return new Map();
  const entries = [...block[1].matchAll(/^\s*([A-Za-z0-9_]+):\s*"([^"]+)"/gm)];
  return new Map(entries.map((m) => [m[1], m[2]]));
}

async function main() {
  const server = await startTestServer();
  targetUrl = server.url;

  try {
    // ===== TEST 1: Page-Load Health =====
    log(`TEST 1: Page-Load Health (${server.isLive ? "live" : "local"})`);
    console.log(`  ${YELLOW}Target: ${targetUrl}${RESET}`);

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
        const resp = await fetchRetry(`${targetUrl}${route}`, { method: "HEAD", timeout: 10000 });
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
  log(`TEST 2: Internal Navigation Link Crawl (${server.isLive ? "live" : "local"})`);
  const origin = targetUrl;
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
      const resp = await fetchRetry(`${targetUrl}${route}`, { method: "HEAD", timeout: 10000 });
      assert(resp.status === 404, `${route} returns 404 (got ${resp.status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  // ===== TEST 3b: Operator Data Guard =====
  // The console's stats and activity streams name the private archive's records
  // and their edit times. They were public AND CDN-cached; a 200 here means the
  // operator's own working data is readable by anyone who can reach the route.
  log("TEST 3b: Operator Data Guard (stats & activity require a session)");
  for (const route of SESSION_GUARDED_ROUTES) {
    try {
      const resp = await fetchRetry(`${targetUrl}${route}`, { method: "GET", timeout: 10000 });
      assert(
        resp.status === 401 || resp.status === 503,
        `GET ${route} is refused without a session (got ${resp.status})`
      );
      assert(
        (resp.headers.get("cache-control") || "").includes("no-store"),
        `GET ${route} is never CDN-cached (got "${resp.headers.get("cache-control")}")`
      );
    } catch (e) {
      assert(false, `GET ${route} is checkable: ${e.message}`);
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
      const resp = await fetchRetry(`${targetUrl}/api/auth`, {
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
  // The header, rail, dock, footer and console sidebar all render from the
  // single registry in src/lib/navigation.ts. Every nav href must resolve:
  // plain paths to a real app route, anchors to a real section id. A missing
  // anchor (e.g. /#hero with no id="hero" in the hero section) silently breaks
  // the nav — the link renders but scrolls nowhere. Live HTTP checks cannot
  // catch this (sections are client-hydrated), so assert against the source.
  log("TEST 6: Source-Level Nav Integrity (nav hrefs resolve)");
  try {
    const navSrc = readFileSync("src/lib/navigation.ts", "utf-8");
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
      ...navSrc.matchAll(/export const (PUBLIC_NAV|DASHBOARD_NAV) = \[([\s\S]*?)\] as const;/g),
    ];
    const navHrefs = [];
    for (const [, , block] of navBlocks) {
      for (const m of block.matchAll(/href:\s*"([^"]+)"/g)) {
        navHrefs.push(m[1]);
      }
    }
    assert(navHrefs.length > 0, `Extracted nav hrefs from navigation.ts (found ${navHrefs.length})`);

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

    // Single-source guard: no module may declare its own navigation array.
    // Four competing definitions once drifted apart — including one on a
    // header component that no route ever imported.
    const srcFiles = [];
    const walk = (dir) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (f.endsWith(".tsx") || f.endsWith(".ts")) srcFiles.push(p);
      }
    };
    walk("src");
    const NAV_DECLARATION = /(PUBLIC_NAV|DASHBOARD_NAV|RAIL_ITEMS|MOBILE_NAV_ITEMS|NAV_ITEMS)\s*[:=]/;
    const navOwners = srcFiles
      .filter((f) => NAV_DECLARATION.test(readFileSync(f, "utf-8")))
      .map((f) => f.replace(/\\/g, "/"));
    assert(
      navOwners.length === 1 && navOwners[0] === "src/lib/navigation.ts",
      `Only src/lib/navigation.ts declares a nav registry (got: ${navOwners.join(", ") || "none"})`
    );

    // DB-driven nav keys: sections created in the console render as /#<key>, so
    // every seed key must resolve to a real section id.
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
    // future anchor additions the nav registry doesn't enumerate.
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
      const resp = await fetchRetry(`${targetUrl}${path}`, {
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

  // ===== TEST 8: Social Channel Integrity (landing + console) =====
  // This used to lock two per-platform icon maps (landing `socialIcons` and
  // console `iconMap`) because a channel whose icon was missing from a map
  // silently rendered a fallback glyph (PR #57: GitHub Sponsors + Ko-fi
  // unregistered). Both maps are gone — one channel mark serves every platform
  // — so the failure mode to guard now is a channel DISAPPEARING from a
  // surface. Asserted behaviourally: the console list source (/api/socials)
  // and the public dossier source (/api/portfolio) must expose the same
  // channels, and the rendered homepage must carry exactly one anchor per
  // channel. No source map can drift out of sync when there is no map.
  log("TEST 8: Social Channel Integrity (one row per channel, both surfaces)");
  try {
    const { status: consoleStatus, body: consoleBody } = await getText("/api/socials");
    assert(consoleStatus === 200, `/api/socials answers the console list source (got ${consoleStatus})`);
    const consoleSocials = JSON.parse(consoleBody);
    assert(
      Array.isArray(consoleSocials) && consoleSocials.length > 0,
      `Console social list is non-empty (${Array.isArray(consoleSocials) ? consoleSocials.length : "not an array"})`
    );

    const { status: publicStatus, body: publicBody } = await getText("/api/portfolio");
    assert(publicStatus === 200, `/api/portfolio answers the public source (got ${publicStatus})`);
    const publicSocials = JSON.parse(publicBody).socials;
    assert(
      Array.isArray(publicSocials) && publicSocials.length > 0,
      `Public portfolio payload carries socials (${Array.isArray(publicSocials) ? publicSocials.length : "not an array"})`
    );

    const urls = (list) => new Set(list.map((s) => s.url));
    const consoleUrls = urls(consoleSocials);
    const publicUrls = urls(publicSocials);
    assert(
      consoleUrls.size === consoleSocials.length && publicUrls.size === publicSocials.length,
      "Neither social list repeats a channel url"
    );
    assert(
      consoleUrls.size === publicUrls.size &&
        [...consoleUrls].every((url) => publicUrls.has(url)),
      `Console and public surfaces expose the same ${consoleUrls.size} channels`
    );

    const { body: home } = await getText("/");
    // The landing renders the collapsed channel set on first paint (8 rows)
    // plus a disclosure control naming the full roster, so the assertion is
    // data-driven: the rendered set must be exactly the collapsed slice, every
    // rendered channel link must be a real payload channel, and the page must
    // disclose the total. A channel cannot vanish without failing here.
    const payloadUrls = new Set(consoleSocials.map((s) => s.url));
    const renderedChannels = consoleSocials.filter((social) => {
      const escaped = social.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`href="${escaped}"`).test(home);
    });
    assert(
      renderedChannels.length === Math.min(8, consoleSocials.length),
      `Homepage renders the collapsed channel set (${renderedChannels.length} of ${consoleSocials.length})`
    );
    assert(
      renderedChannels.every((social) => payloadUrls.has(social.url)),
      "Every rendered channel link is a channel the payload serves"
    );
    const disclosure = home.match(/(\d+)\s+channels/i);
    assert(
      disclosure !== null && Number(disclosure[1]) === consoleSocials.length,
      `Homepage discloses the full roster (${disclosure?.[1] ?? "no count"} of ${consoleSocials.length})`
    );
  } catch (e) {
    assert(false, `Social channel integrity is checkable: ${e.message}`);
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
  // The sidebar renders DASHBOARD_NAV icons straight from the artwork pool
  // (`AssetIcon` + GENSHIN_UI_ICONS in src/lib/ui-icons.ts). This used to lock
  // a string-keyed lucide `iconMap` whose fallback (`Activity`) silently
  // swallowed any unregistered name. There is no fallback and no third-party
  // icon library any more — a nav icon that is not a pool key, or a pool key
  // whose file is missing, would render nothing. This locks every
  // DASHBOARD_NAV icon to a real, on-disk asset.
  log("TEST 10: Dashboard Nav Icon Registry Sync (DASHBOARD_NAV icons in the pool)");
  try {
    const registrySrc = readFileSync("src/lib/ui-icons.ts", "utf-8");
    assert(registrySrc.length > 0, "src/lib/ui-icons.ts is readable");

    const navSrc = readFileSync("src/lib/navigation.ts", "utf-8");
    const navBlock = navSrc.match(
      /export const DASHBOARD_NAV = \[([\s\S]*?)\] as const;/
    );
    assert(navBlock !== null, "DASHBOARD_NAV block is parseable in navigation.ts");
    const navIcons = navBlock
      ? [...navBlock[1].matchAll(/icon:\s*"([^"]+)"/g)].map((m) => m[1])
      : [];
    assert(
      navIcons.length > 0,
      `Extracted DASHBOARD_NAV icons (found ${navIcons.length})`
    );

    const registry = parseAssetRegistry(registrySrc);
    assert(
      registry.size > 0,
      `Parsed the artwork pool (found ${registry.size} keys)`
    );

    for (const icon of new Set(navIcons)) {
      assert(
        registry.has(icon),
        `Dashboard nav icon "${icon}" is a key of GENSHIN_UI_ICONS`
      );
      const path = registry.get(icon);
      assert(
        typeof path === "string" && existsSync(join("public", path.replace(/^\//, ""))),
        `Dashboard nav icon "${icon}" resolves to a real asset (${path})`
      );
    }
  } catch (e) {
    assert(false, `Dashboard nav icon registry is checkable: ${e.message}`);
  }

  // ===== TEST 10b: Artwork Pool Integrity (source-level) =====
  // Every surface now resolves its artwork through GENSHIN_UI_ICONS, so one
  // wrong literal breaks a page with an empty plate. Locks: each entry points
  // under public/ui-icons/, the file exists, paths are unique (a copy-paste
  // registry row would render the wrong mark silently) and nothing points at
  // an SVG — next/image refuses SVG unless dangerouslyAllowSVG is enabled.
  log("TEST 10b: Artwork Pool Integrity (every registry path resolves on disk)");
  try {
    const registry = parseAssetRegistry(readFileSync("src/lib/ui-icons.ts", "utf-8"));
    assert(registry.size > 0, `Artwork pool is parseable (found ${registry.size} keys)`);

    const seen = new Map();
    for (const [key, path] of registry) {
      assert(
        path.startsWith("/ui-icons/"),
        `Pool entry "${key}" lives under /ui-icons/ (${path})`
      );
      assert(
        !path.toLowerCase().endsWith(".svg"),
        `Pool entry "${key}" is raster art, not SVG (${path})`
      );
      assert(
        existsSync(join("public", path.replace(/^\//, ""))),
        `Pool entry "${key}" resolves on disk (${path})`
      );
      const duplicate = seen.get(path);
      assert(
        duplicate === undefined,
        `Pool path "${path}" is unique (already used by "${duplicate}")`
      );
      seen.set(path, key);
    }
  } catch (e) {
    assert(false, `Artwork pool integrity is checkable: ${e.message}`);
  }

  // ===== TEST 11: Write Guard =====
  // The dashboard session is an HMAC cookie minted by /api/auth. Every mutating
  // endpoint must refuse an unauthenticated caller: `401` when DASHBOARD_SECRET
  // is configured, `503` when it is not (fail closed). A `200`/`201` here means
  // the console is writable by anyone who can reach the route — the exact hole
  // the old forgeable sessionStorage token left open.
  log("TEST 11: Write Guard (mutations require a session)");
  const WRITE_PROBES = [
    ["POST", "/api/projects", {}],
    ["POST", "/api/skills", {}],
    ["POST", "/api/sections", { key: "probe", title: "Probe" }],
    ["DELETE", "/api/projects/nonexistent-id", undefined],
    ["PUT", "/api/config", { name: "probe" }],
    ["POST", "/api/config/reset", undefined],
  ];
  for (const [method, path, body] of WRITE_PROBES) {
    try {
      const resp = await fetchRetry(`${targetUrl}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        timeout: 10000,
      });
      assert(
        resp.status === 401 || resp.status === 503,
        `${method} ${path} is refused without a session (got ${resp.status})`
      );
    } catch (e) {
      assert(false, `${method} ${path} is checkable: ${e.message}`);
    }
  }

  // The summon desk has no server side: the public dossier composes a mailto:
  // hand-off instead, so the homepage must expose the address as a link. A
  // fabricated "delivered" receipt from a stateless endpoint was worse than no
  // endpoint at all.
  try {
    const { body } = await getText("/");
    assert(
      /href="mailto:[^"]+@[^"]+"/.test(body),
      "Homepage exposes a mailto: dispatch link"
    );
  } catch (e) {
    assert(false, `Homepage mailto hand-off is checkable: ${e.message}`);
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
    process.exitCode = failed > 0 ? 1 : 0;
  } finally {
    await server.stop();
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
