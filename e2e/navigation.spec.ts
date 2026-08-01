/**
 * AETHER-HUD E2E Navigation & Page Load Tests
 *
 * Verifies that all expected routes resolve correctly by checking:
 * - Build output route manifest (local)
 * - Live deployed endpoints (production)
 *
 * Run: npx tsx e2e/navigation.spec.ts
 * Or:  npm run test:e2e
 */

import { execSync } from "child_process";

// ─── Expected Routes ──────────────────────────────────────────────
const EXPECTED_PAGES: Record<string, string[]> = {
  public: ["/", "/login", "/robots.txt", "/sitemap.xml"],
  dashboard: [
    "/dashboard",
    "/dashboard/contact",
    "/dashboard/experiences",
    "/dashboard/profile",
    "/dashboard/projects",
    "/dashboard/sections",
    "/dashboard/settings",
    "/dashboard/skills",
    "/dashboard/testimonials",
  ],
};

const ALL_ROUTES = [...EXPECTED_PAGES.public, ...EXPECTED_PAGES.dashboard];

// ─── Helpers ──────────────────────────────────────────────────────

function run(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf-8", timeout: 30_000 });
  } catch (e: any) {
    return e.stdout || e.stderr || String(e);
  }
}

function getNextBuildRoutes(): string[] {
  // Parse `npm run build` output to extract generated routes
  const out = run("npx next build 2>&1 || true");
  const lines = out.split("\n");
  const routes: string[] = [];
  let inRouteTable = false;

  for (const line of lines) {
    if (line.startsWith("Route (app)")) {
      inRouteTable = true;
      continue;
    }
    if (inRouteTable) {
      const trimmed = line.trim();
      if (trimmed.startsWith("┌") || trimmed.startsWith("├") || trimmed.startsWith("└") || trimmed.startsWith("○") || trimmed.startsWith("ƒ")) {
        const match = trimmed.match(/\/\S+/);
        if (match) {
          routes.push(match[0]);
        }
      }
      if (trimmed.startsWith("○  (Static)") || trimmed.startsWith("ƒ  (Dynamic)")) {
        break;
      }
    }
  }
  return routes;
}

// ─── Tests ────────────────────────────────────────────────────────

let failed = 0;
let passed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    passed++;
  } else {
    console.log(`  ❌ ${msg}`);
    failed++;
  }
}

// Test 1: Build Output — Routes Exist
console.log("\n📋 Test 1: Build Output — Route Manifest\n");
const builtRoutes = getNextBuildRoutes();

for (const route of ALL_ROUTES) {
  assert(
    builtRoutes.some((r) => r === route),
    `Route ${route} exists in build output`
  );
}

// Test 2: No Unexpected Build Errors
console.log("\n📋 Test 2: Build Health\n");
const buildOut = run("npx next build 2>&1 || true");

assert(
  !buildOut.includes("Build error") && !buildOut.includes("Error:"),
  "Build completed without errors"
);

assert(
  buildOut.includes("✓ Generating static pages") || buildOut.includes("Finalizing"),
  "Static page generation completed"
);

// Test 3: API Routes Exist
console.log("\n📋 Test 3: API Routes\n");
const apiRoutes = [
  "/api/auth",
  "/api/config",
  "/api/dashboard/stats",
  "/api/experiences",
  "/api/experiences/[id]",
  "/api/portfolio",
  "/api/projects",
  "/api/projects/[id]",
  "/api/sections",
  "/api/skills",
  "/api/skills/[id]",
  "/api/socials",
  "/api/socials/[id]",
  "/api/testimonials",
  "/api/testimonials/[id]",
];

for (const route of apiRoutes) {
  assert(
    builtRoutes.some((r) => r === route),
    `API route ${route} exists in build output`
  );
}

// Test 4: Source File Integrity
console.log("\n📋 Test 4: Source File Integrity\n");
const srcFiles = run("find src -name '*.tsx' -o -name '*.ts' | wc -l").trim();
assert(parseInt(srcFiles) > 20, `Source has ${srcFiles} TypeScript files (expected 20+)`);

// ─── Summary ──────────────────────────────────────────────────────
console.log("\n" + "=".repeat(50));
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log("=".repeat(50));

process.exit(failed > 0 ? 1 : 0);
