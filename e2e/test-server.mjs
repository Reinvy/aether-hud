/**
 * AETHER-HUD E2E Test Server Orchestrator
 *
 * Manages local test server lifecycle (start/health-check/stop) and target resolution.
 * Supports running tests against local server (http://localhost:3005) or live production (--live).
 */

import { spawn, execSync } from "child_process";
import { readFileSync, existsSync } from "fs";

const DEFAULT_PORT = 3005;

export function isLiveMode() {
  return (
    process.argv.includes("--live") ||
    process.env.TEST_TARGET === "production" ||
    process.env.TEST_MODE === "live"
  );
}

export function resolveProductionUrl() {
  try {
    if (existsSync(".cron/VERCEL_DOMAIN.env")) {
      const env = readFileSync(".cron/VERCEL_DOMAIN.env", "utf-8");
      const match = env.match(/^PRODUCTION_URL="([^"]+)"/m);
      if (match) return match[1];
    }
  } catch {}
  return "https://aether-hud-lyart.vercel.app";
}

export function resolveTargetPort() {
  const portEnv = process.env.TEST_PORT || process.env.PORT;
  if (portEnv && !isNaN(Number(portEnv))) {
    return Number(portEnv);
  }
  return DEFAULT_PORT;
}

export function resolveTargetUrl() {
  if (isLiveMode()) {
    return resolveProductionUrl();
  }
  const port = resolveTargetPort();
  return `http://localhost:${port}`;
}

async function isPortResponding(url, timeoutMs = 1500) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res.status < 500;
  } catch {
    return false;
  }
}

let spawnedProcess = null;

function cleanupSpawnedProcess() {
  if (spawnedProcess && !spawnedProcess.killed) {
    try {
      spawnedProcess.kill("SIGTERM");
    } catch {}
    spawnedProcess = null;
  }
}

process.on("exit", cleanupSpawnedProcess);
process.on("SIGINT", () => {
  cleanupSpawnedProcess();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanupSpawnedProcess();
  process.exit(143);
});

export async function startTestServer() {
  const isLive = isLiveMode();
  const targetUrl = resolveTargetUrl();

  if (isLive) {
    return {
      url: targetUrl,
      isLive: true,
      spawned: false,
      stop: async () => {},
    };
  }

  const port = resolveTargetPort();
  const alreadyResponding = await isPortResponding(targetUrl, 1500);

  if (alreadyResponding) {
    return {
      url: targetUrl,
      isLive: false,
      spawned: false,
      stop: async () => {},
    };
  }

  // Ensure build exists before starting `next start`
  if (!existsSync(".next")) {
    console.log("  ⚡ No .next build found, compiling application before starting test server...");
    execSync("npm run build", { stdio: "inherit" });
  }

  console.log(`  🚀 Starting local test server on ${targetUrl}...`);

  spawnedProcess = spawn(
    "npx",
    ["next", "start", "-p", String(port)],
    {
      stdio: "pipe",
      env: {
        ...process.env,
        PORT: String(port),
        NEXT_PUBLIC_SITE_URL: targetUrl,
      },
    }
  );

  let serverStarted = false;
  const maxWaitMs = 30000;
  const intervalMs = 500;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    if (await isPortResponding(targetUrl, 500)) {
      serverStarted = true;
      break;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  if (!serverStarted) {
    cleanupSpawnedProcess();
    throw new Error(`Local test server at ${targetUrl} failed to become ready within ${maxWaitMs / 1000}s`);
  }

  console.log(`  ✅ Local test server ready at ${targetUrl}\n`);

  return {
    url: targetUrl,
    isLive: false,
    spawned: true,
    stop: async () => {
      cleanupSpawnedProcess();
    },
  };
}

export async function stopTestServer() {
  cleanupSpawnedProcess();
}
