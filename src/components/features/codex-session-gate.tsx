"use client";

import { CodexLoader } from "@/components/ui/codex-loader";

interface CodexSessionGateProps {
  /** What the gate is doing — shown under the loader. */
  label: string;
}

/**
 * CodexSessionGate — the surface shown while the console verifies the session.
 *
 * Replaces the bare centred spinner for both gate states (verifying, and the
 * frame between "no session" and the redirect). It is deliberately the same
 * card vocabulary as every other console surface so the private area never
 * flashes a different design language than the page behind it.
 */
export function CodexSessionGate({ label }: CodexSessionGateProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-parchment-base p-4">
      <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />

      <div className="codex-card codex-panel-radius relative w-full max-w-md p-8">
        <CodexLoader label={label} size="lg" />
        <div className="codex-shimmer codex-btn mt-6 h-1.5 w-full" />
        <p className="codex-label mt-4 text-center">Teyvat Codex — secure chamber</p>
      </div>
    </div>
  );
}
