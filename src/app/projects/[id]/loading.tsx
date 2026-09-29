import { CodexLoader } from "@/components/ui/codex-loader";

/**
 * Domain dossier loading state — shown while a published artifact's page is
 * fetched, so a slow read gets the codex boot screen instead of the root
 * boundary's full-page loader.
 */
export default function DomainDossierLoading() {
  return (
    <div className="codex-rise relative flex min-h-screen items-center justify-center bg-parchment-base">
      <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />
      <CodexLoader label="Opening the domain dossier" size="lg" />
    </div>
  );
}
