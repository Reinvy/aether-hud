import { CodexLoader } from "@/components/ui/codex-loader";

/**
 * Login route loading state — codex-style session boot indicator.
 */
export default function LoginLoading() {
  return (
    <div className="codex-rise relative flex min-h-screen items-center justify-center bg-parchment-base">
      <CodexLoader label="Opening the codex" size="lg" />
    </div>
  );
}
