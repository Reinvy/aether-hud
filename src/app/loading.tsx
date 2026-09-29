import { CodexLoader } from "@/components/ui/codex-loader";

/**
 * Root route loading state — codex-style boot screen shown while the
 * landing page chunk streams in (works with the dynamic section
 * imports in page.tsx for a seamless boot sequence).
 */
export default function RootLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-parchment-base dark:bg-deep-space">
      <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />
      <CodexLoader label="Opening the codex" size="lg" />
    </div>
  );
}
