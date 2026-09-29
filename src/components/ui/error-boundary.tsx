"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — isolates a failing region so the rest of the page survives.
 *
 * Wraps each landing section and each console widget; when a subtree throws,
 * only that region degrades and the visitor can retry it in place.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[CODEX_SECTION] ${this.props.section ?? "unknown"}`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-parchment-base dark:bg-deep-space" />
          <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />

          <div className="relative mx-auto max-w-2xl px-4 text-center">
            <div className="codex-card codex-panel-radius p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center codex-panel-radius border border-hud-danger/30 bg-hud-danger/5">
                  <AlertTriangle className="h-6 w-6 text-hud-danger" />
                </div>

                <div className="space-y-2">
                  <span className="codex-label-gold text-[10px] tracking-[0.2em]">
                    {this.props.section ?? "Section"}
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-[0.08em] text-text-main">
                    This part of the <span className="text-hud-danger">codex</span> did not load
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-text-muted font-body">
                    The rest of the dossier is unaffected. Try again, or reload
                    the page if it keeps failing.
                  </p>
                </div>

                {this.state.error && (
                  <details className="w-full max-w-md">
                    <summary className="cursor-pointer text-[11px] font-semibold tracking-wider text-text-muted/70 dark:text-platinum-200/80 transition-colors hover:text-leather-dark dark:hover:text-gold-400">
                      Show details
                    </summary>
                    <pre className="mt-2 max-h-24 overflow-auto codex-radius-sm border border-border-subtle bg-parchment-subtle p-3 text-left text-[10px] text-hud-danger/80 dark:bg-deep-space">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}

                <button
                  onClick={this.handleRetry}
                  className="codex-sheen codex-btn codex-focus inline-flex items-center gap-2 border border-leather-caramel/35 px-6 py-2.5 text-xs font-semibold tracking-wider text-leather-dark transition-all hover:bg-leather-caramel/10 dark:border-border-glass dark:text-gold-400 dark:hover:bg-gold-400/10"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
