#!/usr/bin/env node
/**
 * AETHER-HUD E2E Test Runner
 * 
 * Runs navigation tests to verify all routes are working.
 * Usage: node e2e/run-tests.mjs
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";

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

// ─── Color helpers ──────────────────────────────────────────
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

// ─── Expected Routes ───────────────────────────────────────
const ALL_ROUTES = [
  // Public pages
  "/",
  "/login",
  // Dashboard pages
  "/dashboard",
  "/dashboard/contact",
  "/dashboard/experiences",
  "/dashboard/profile",
  "/dashboard/projects",
  "/dashboard/sections",
  "/dashboard/settings",
  "/dashboard/skills",
  "/dashboard/testimonials",
];

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
  "/api/testimonials",
];

// SEO files must be live AND reference the ACTUAL production domain.
// aether-hud.vercel.app is taken by another project — if robots/sitemap
// ever point there (stale-domain regression), search engines index the
// wrong site. Guard against that.
const SEO_ROUTES = ["/robots.txt", "/sitemap.xml"];

function log(msg, color = "") {
  console.log(`${color}${msg}${RESET}`);
}

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", timeout: 120_000 });
  } catch (e) {
    return e.stdout || e.stderr || String(e);
  }
}

async function fetchUrl(url, method = "HEAD", retries = 3) {
  // Retry transient network failures (edge cold starts, rate-limit blips)
  // before declaring a route dead. HTTP status codes are NOT retried —
  // a 404/500 is a real result, only fetch-level errors/timeouts are.
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, { method, signal: AbortSignal.timeout(10000) });
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  let passed = 0;
  let failed = 0;

  function assert(condition, msg) {
    if (condition) {
      log(`  ✅ ${msg}`, GREEN);
      passed++;
    } else {
      log(`  ❌ ${msg}`, RED);
      failed++;
    }
  }

  // ===== TEST 1: Build Test =====
  log("\n📋 TEST 1: Build Verification", CYAN);
  const buildOut = run("npm run build 2>&1 || true");
  const hasBuildError = buildOut.includes("Build error") || buildOut.includes("Error:") || buildOut.includes("Failed to compile");
  assert(!hasBuildError, "Build completes without errors");

  // Check all routes exist in build output
  for (const route of [...ALL_ROUTES, ...API_ROUTES]) {
    assert(buildOut.includes(route), `Build includes route ${route}`);
  }

  // ===== TEST 2: Live Page Check =====
  log("\n📋 TEST 2: Production Page Accessibility", CYAN);
  log(`  Target: ${PRODUCTION_URL}`, YELLOW);
  // Verify ALL expected routes (pages + APIs) are live, not just the homepage.
  // 405 is acceptable for API routes that are POST-only (e.g. /api/auth) —
  // it proves the route is mounted even though HEAD is not allowed.
  for (const route of [...ALL_ROUTES, ...API_ROUTES]) {
    try {
      const resp = await fetchUrl(`${PRODUCTION_URL}${route}`);
      const ok = resp.status === 200 || (resp.status === 405 && route.startsWith("/api/"));
      assert(ok, `${route} is live (got ${resp.status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  // SEO files: live AND reference the correct production domain.
  for (const route of SEO_ROUTES) {
    try {
      const resp = await fetchUrl(`${PRODUCTION_URL}${route}`, "GET");
      assert(resp.status === 200, `${route} is live (got ${resp.status})`);
      const body = await resp.text();
      assert(
        body.includes(PRODUCTION_URL),
        `${route} references the correct production domain (${PRODUCTION_URL})`
      );
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  // Sitemap ↔ robots consistency: every URL listed in sitemap.xml must NOT be
  // disallowed by robots.txt. Crawlers that honor robots never fetch disallowed
  // URLs, so listing them signals auth-gated routes as indexable content — a
  // silent SEO contradiction (see vercel-deployment skill pitfalls).
  try {
    const robotsResp = await fetchUrl(`${PRODUCTION_URL}/robots.txt`, "GET");
    const robotsBody = await robotsResp.text();
    const disallowed = robotsBody
      .split("\n")
      .filter((l) => l.trim().startsWith("Disallow:"))
      .map((l) => l.trim().replace(/^Disallow:\s*/, ""))
      .filter((p) => p.length > 0);
    assert(disallowed.length > 0, `robots.txt declares Disallow rules (found ${disallowed.length})`);
    const sitemapResp = await fetchUrl(`${PRODUCTION_URL}/sitemap.xml`, "GET");
    const sitemapBody = await sitemapResp.text();
    const locs = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert(locs.length >= 1, `sitemap.xml lists at least one URL (found ${locs.length})`);
    const violations = locs.filter((loc) => {
      const path = loc.replace(PRODUCTION_URL, "").replace(/\/+$/, "") || "/";
      return disallowed.some((d) => d === "/" || path === d.replace(/\/+$/, "") || path.startsWith(d.replace(/\/+$/, "") + "/"));
    });
    assert(
      violations.length === 0,
      `sitemap.xml lists NO robots-disallowed routes${violations.length ? ` (violations: ${violations.join(", ")})` : ""}`
    );
  } catch (e) {
    assert(false, `sitemap/robots consistency is checkable: ${e.message}`);
  }

  // Unknown routes must return the custom 404 page (not 200 or 500).
  // Guards against catch-all routing misconfiguration that silently
  // serves the wrong page for typos or stale links.
  for (const route of ["/this-route-does-not-exist-xyz", "/dashboard/nonexistent-page-xyz"]) {
    try {
      const resp = await fetchUrl(`${PRODUCTION_URL}${route}`);
      assert(resp.status === 404, `${route} returns 404 (got ${resp.status})`);
    } catch (e) {
      assert(false, `${route} is reachable: ${e.message}`);
    }
  }

  // ===== TEST 3: Git Health =====
  log("\n📋 TEST 3: Git Health", CYAN);
  const branch = run("git branch --show-current").trim();
  assert(branch.length > 0, `On a valid branch: ${branch}`);

  const status = run("git status --porcelain").trim();
  if (status.length > 0) {
    log(`  ℹ️  Working tree has ${status.split("\n").length} uncommitted change(s)`, YELLOW);
    // Count passing test for info (not failure)
    passed++;
  } else {
    assert(true, "Working tree is clean (no uncommitted changes)");
  }

  // ===== TEST 4: Dependency Integrity =====
  log("\n📋 TEST 4: Dependency Integrity", CYAN);
  const pkgStr = readFileSync("package.json", "utf-8");
  const pkg = JSON.parse(pkgStr);
  assert(!!pkg.dependencies.next, "Next.js is in dependencies");
  assert(!!pkg.dependencies.react, "React is in dependencies");
  assert(!!pkg.dependencies["framer-motion"], "Framer Motion is in dependencies");

  // ===== TEST 5: Content & Design System Verification =====
  // HEAD liveness checks above cannot detect SILENT content loss (e.g. a
  // server component throwing and dropping the JSON-LD, or a CSS class
  // refactor stripping the design system). GET the rendered HTML and assert
  // on the actual content + design-system markers.
  log("\n📋 TEST 5: Content & Design System Verification", CYAN);
  const DESIGN_MARKERS = [
    "glass-panel",
    "chamfered",
    "btn-glow-sweep",
    "bg-deep-space",
    "starfield",
    "grid-hud",
    "sys-label",
  ];
  for (const [path, markers] of [
    ["/", DESIGN_MARKERS],
    ["/login", DESIGN_MARKERS],
    ["/dashboard", DESIGN_MARKERS],
  ]) {
    try {
      const resp = await fetchUrl(`${PRODUCTION_URL}${path}`, "GET");
      assert(resp.status === 200, `${path} renders HTTP 200 (got ${resp.status})`);
      const body = await resp.text();
      assert(body.length > 1000, `${path} returns non-trivial HTML (${body.length} bytes)`);
      for (const m of markers) {
        assert(body.includes(m), `${path} includes design-system marker "${m}"`);
      }
    } catch (e) {
      assert(false, `${path} is fetchable: ${e.message}`);
    }
  }

  // JSON-LD structured data must render in the homepage HTML and parse cleanly.
  try {
    const resp = await fetchUrl(`${PRODUCTION_URL}/`, "GET");
    const body = await resp.text();
    const blocks = [...body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert(blocks.length >= 1, `Homepage emits JSON-LD blocks (found ${blocks.length})`);
    let parsedOk = 0;
    let hasItemList = false;
    for (const [, raw] of blocks) {
      try {
        const data = JSON.parse(raw);
        parsedOk++;
        if (data["@type"] === "ItemList") hasItemList = true;
      } catch {}
    }
    assert(parsedOk === blocks.length, `All ${blocks.length} JSON-LD blocks parse cleanly`);
    assert(hasItemList, "JSON-LD includes an ItemList (portfolio items render)");
    // The ItemList must enumerate ALL projects from the data file — a server
    // component throwing mid-render (or a data-file refactor) silently drops
    // items while the block still parses. Count `id: "proj-` in portfolio.ts
    // and require the live list to match.
    try {
      const dataSrc = readFileSync("src/data/portfolio.ts", "utf-8");
      const expectedCount = (dataSrc.match(/id:\s*"proj-/g) || []).length;
      for (const [, raw] of blocks) {
        const data = JSON.parse(raw);
        if (data["@type"] === "ItemList") {
          const liveCount = (data.itemListElement || []).length;
          assert(
            liveCount === expectedCount,
            `JSON-LD ItemList count matches data file (${liveCount} === ${expectedCount} projects)`
          );
        }
      }
    } catch (e) {
      assert(false, `JSON-LD item count is verifiable: ${e.message}`);
    }
  } catch (e) {
    assert(false, `Homepage JSON-LD is verifiable: ${e.message}`);
  }

  // ===== Summary =====
  const total = passed + failed;
  log("\n" + "=".repeat(50));
  if (failed === 0) {
    log(`📊 ALL ${total} TESTS PASSED 🎉`, GREEN);
  } else {
    log(`📊 ${passed} passed, ${failed} failed, ${total} total`, failed > 0 ? RED : GREEN);
  }
  log("=".repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
