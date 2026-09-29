import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL, PORTFOLIO_CONFIG } from "@/lib/constants";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { WebVitalsReporter } from "@/components/features/web-vitals";

/**
 * Self-hosted typography — Cormorant Garamond & Cinzel carry the display
 * serif headings, Inter the body copy, JetBrains Mono the technical values.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Interactive Traveler Dossier`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    "portfolio", "developer", "full-stack", "AI", "Next.js",
    "Teyvat Codex", "dossier", "portfolio website",
    "frontend", "TypeScript", "React", "Bahrul Ulumul Haq",
    "web developer", "interactive dossier",
  ],
  authors: [{ name: "Bahrul Ulumul Haq" }],
  creator: "Bahrul Ulumul Haq",
  publisher: "Bahrul Ulumul Haq",
  metadataBase: new URL(APP_URL),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: `${APP_NAME} — Interactive Traveler Dossier`,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Interactive Traveler Dossier`,
    description: APP_DESCRIPTION,
    creator: "@reinvy",
    site: "@reinvy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      "en-US": APP_URL,
    },
  },
  category: "technology",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#FAF8F5",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1A120C" },
  ],
  colorScheme: "light dark",
};

/**
 * Resolves the stored theme before first paint.
 *
 * ThemeProvider applies `data-theme` in an effect, which runs after the first
 * paint — an OS-dark visitor in light mode would see one frame of the espresso
 * palette. This blocking script mirrors the provider's logic (same
 * `aether_theme` key, same `dark` class) so the first paint already matches.
 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("aether_theme");var n=t==="celestial-night";var r=document.documentElement;r.dataset.theme=n?"celestial-night":"teyvat-codex";r.classList.toggle("dark",n);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PORTFOLIO_CONFIG.name,
    url: APP_URL,
    jobTitle: PORTFOLIO_CONFIG.tagline,
    email: `mailto:${PORTFOLIO_CONFIG.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: PORTFOLIO_CONFIG.location.split(",")[0]?.trim() ?? "",
      addressCountry: "ID",
    },
    knowsAbout: ["Next.js", "TypeScript", "React", "AI", "Full-Stack Development"],
    sameAs: [
      "https://github.com/Reinvy",
      "https://linkedin.com/in/bahrul-ulumul-haq",
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    inLanguage: "en-US",
    publisher: {
      "@type": "Person",
      name: PORTFOLIO_CONFIG.name,
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/icon.svg`,
    founder: {
      "@type": "Person",
      name: PORTFOLIO_CONFIG.name,
    },
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme resolution must precede the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* PWA / Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content={APP_NAME} />
      </head>
      <body className="min-h-full bg-parchment-base text-leather-dark dark:bg-deep-space dark:text-platinum-50 font-body transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        {/* Performance observability — renders nothing, beacons Core Web Vitals */}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
