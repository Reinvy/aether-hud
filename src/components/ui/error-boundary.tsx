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

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[AETHER] Section error (${this.props.section ?? "unknown"}):`, error, errorInfo);
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
          <div className="pointer-events-none absolute inset-0 bg-deep-space" />
          <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />

          <div className="relative mx-auto max-w-2xl px-4 text-center">
            <div className="glass-panel chamfered p-8">
              <div className="flex flex-col items-center gap-4">
                {/* Error icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-hud-danger/30 bg-hud-danger/5">
                  <AlertTriangle className="h-6 w-6 text-hud-danger" />
                </div>

                {/* Error label */}
                <div className="space-y-2">
                  <span className="sys-label-gold text-[10px] tracking-[0.2em]">
                    {this.props.section ? `${this.props.section.toUpperCase()} // FAULT` : "SYSTEM // FAULT"}
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-[0.08em] text-text-main">
                    Section <span className="text-hud-danger">Unavailable</span>
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-text-muted font-body">
                    An error occurred while rendering this module. System integrity preserved.
                  </p>
                </div>

                {/* Error detail (collapsed) */}
                {this.state.error && (
                  <details className="w-full max-w-md">
                    <summary className="cursor-pointer font-mono text-[10px] tracking-wider text-text-muted/50 hover:text-gold-400 transition-colors">
                      [ERROR_LOG // EXPAND]
                    </summary>
                    <pre className="mt-2 max-h-24 overflow-auto chamfered-sm border border-border-subtle bg-deep-space p-3 text-left font-mono text-[10px] text-hud-danger/80">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}

                {/* Retry button */}
                <button
                  onClick={this.handleRetry}
                  className="btn-glow-sweep tactical-btn inline-flex items-center gap-2 border border-border-glass bg-glass-card px-6 py-2.5 text-xs font-mono tracking-wider text-gold-400 transition-all hover:bg-[rgba(242,201,76,0.12)]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  RETRY MODULE
                </button>
              </div>

              {/* Corner sys node */}
              <span className="absolute bottom-3 right-3 sys-label text-[8px] text-text-muted/20">
                [ERR_NODE]
              </span>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
