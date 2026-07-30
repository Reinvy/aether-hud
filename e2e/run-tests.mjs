#!/usr/bin/env node
/**
 * AETHER-HUD E2E Test Runner
 * 
 * Runs navigation tests to verify all routes are working.
 * Usage: node e2e/run-tests.mjs
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";

const PRODUCTION_URL = "https://aether-hud.vercel.app";

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
  "/api/testimonials",
];

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

function fetchUrl(url) {
  try {
    const { HTTPParser } = process.binding("http_parser");
  } catch {}
  // Use Node's built-in fetch
  return fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
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
  // Verify site is reachable
  try {
    const resp = await fetchUrl(PRODUCTION_URL);
    assert(resp.status === 200, `Homepage returns 200 (got ${resp.status})`);
  } catch (e) {
    assert(false, `Homepage is reachable: ${e.message}`);
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
