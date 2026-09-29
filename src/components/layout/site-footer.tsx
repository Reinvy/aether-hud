import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";
import { PUBLIC_NAV } from "@/lib/navigation";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

interface SiteFooterProps {
  siteName?: string;
  authorName?: string;
  version?: string;
}

/**
 * SiteFooter — public shell footer.
 *
 * Section links are derived from `PUBLIC_NAV`, so the footer can never drift
 * from the header/rail/dock, and the back-to-top control is a single `#hero`
 * link rather than the previous duplicated STAFF/TOP pair.
 */
export function SiteFooter({
  siteName = APP_NAME,
  authorName = PORTFOLIO_CONFIG.name,
  version = PORTFOLIO_CONFIG.edition,
}: SiteFooterProps) {
  return (
    <footer
      aria-label="Traveler dossier footer"
      className="relative border-t border-leather-caramel/30 bg-parchment-subtle transition-colors"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-leather-caramel/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="codex-icon-plate h-7 w-7 shrink-0">
              <Image
                src={GENSHIN_UI_ICONS.archive}
                alt=""
                width={20}
                height={20}
                className="codex-icon-on-plate h-4 w-4 object-contain"
                unoptimized
              />
            </span>
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-leather-dark">
              {siteName}
            </span>
            <span className="codex-label tabular-nums">Version {version}</span>
          </div>

          <nav aria-label="Codex sections" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {PUBLIC_NAV.map((item) => (
              <a
                key={item.sectionId}
                href={item.href}
                className="codex-radius-sm px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-leather-muted transition-colors hover:text-leather-dark codex-focus"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="codex-radius-sm px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-leather-muted transition-colors hover:text-leather-dark codex-focus"
            >
              Codex Console
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-[11px] tabular-nums text-leather-muted">
              &copy; {new Date().getFullYear()} {authorName}
            </p>
            <a
              href="#hero"
              aria-label="Scroll back to the top of the dossier"
              className="inline-flex items-center gap-1.5 codex-radius-sm border border-leather-caramel/25 px-3 py-1.5 text-xs font-semibold text-leather-muted transition-colors hover:text-leather-dark codex-focus"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
