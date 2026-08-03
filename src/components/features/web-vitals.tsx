"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * WebVitalsReporter — performance observability foundation.
 *
 * Uses Next.js `useReportWebVitals` to capture Core Web Vitals (FCP, LCP,
 * INP, CLS, TTFB). In development the metrics are logged to the console
 * with a HUD label; in production they are beaconed (fire-and-forget) to
 * the /api/telemetry collector endpoint so real-user performance can be
 * aggregated without a third-party script.
 *
 * Mount once in the root layout. Renders nothing.
 */
const LABEL = "[SYS_VITALS]";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const { name, value, rating, delta, id } = metric;

    if (process.env.NODE_ENV === "development") {
      console.debug(LABEL, name, {
        value,
        rating,
        delta,
        id,
      });
      return;
    }

    // Production: fire-and-forget beacon — telemetry must never block or
    // break the app, so failures are swallowed silently.
    try {
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const payload = JSON.stringify({
          name,
          value,
          rating,
          delta,
          id,
          path: window.location.pathname,
          href: window.location.href,
        });
        navigator.sendBeacon(
          "/api/telemetry",
          new Blob([payload], { type: "application/json" })
        );
      }
    } catch {
      /* no-op */
    }
  });

  return null;
}
