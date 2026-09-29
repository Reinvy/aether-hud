"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="pointer-events-none absolute inset-0 bg-parchment-base" />
          <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />

          <div className="relative mx-auto max-w-2xl px-4 text-center">
            <div className="codex-card codex-panel-radius p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center codex-panel-radius border border-crimson-600/30 bg-crimson-600/8">
                  <AlertTriangle className="h-6 w-6 text-crimson-600" />
                </div>

                <div className="space-y-2">
                  <span className="codex-label-gold text-[10px] tracking-[0.2em]">
                    {this.props.section ?? "Section"}
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-[0.08em] text-leather-dark">
                    This part of the <span className="text-crimson-600">codex</span> did not load
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-leather-muted font-body">
                    The rest of the dossier is unaffected. Try again, or reload
                    the page if it keeps failing.
                  </p>
                </div>

                {this.state.error && (
                  <details className="w-full max-w-md">
                    <summary className="cursor-pointer text-[11px] font-semibold tracking-wider text-leather-muted transition-colors hover:text-leather-dark">
                      Show details
                    </summary>
                    <pre className="mt-2 max-h-24 overflow-auto codex-radius-card border border-border-subtle bg-parchment-subtle p-3 text-left text-[10px] text-crimson-600">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}

                <Button variant="secondary" size="sm" glow="none" onClick={this.handleRetry}>
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
