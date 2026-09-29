import { CodexLoader } from "@/components/ui/codex-loader";

/**
 * Login route loading state — codex-style session boot indicator.
 */
export default function LoginLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-parchment-base dark:bg-deep-space">
      <CodexLoader label="Opening the codex" size="lg" />
    </div>
  );
}
