import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL, PORTFOLIO_CONFIG } from "@/lib/constants";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — High-End Tactical Portfolio`,
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
    "game UI", "HUD design", "Honkai Star Rail", "tactical design",
    "frontend", "TypeScript", "React", "Bahrul Ulumul Haq",
    "web developer", "portfolio website", "AAA game UI",
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
    title: `${APP_NAME} — High-End Tactical Portfolio`,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    url: APP_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Tactical Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — High-End Tactical Portfolio`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
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
  verification: {
    // google: "google-site-verification-code",
  },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#030407",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030407" },
    { media: "(prefers-color-scheme: light)", color: "#030407" },
  ],
  colorScheme: "dark",
};

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
    email: "mailto:hello@aether-hud.dev",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressCountry: "ID",
    },
    knowsAbout: ["Next.js", "TypeScript", "React", "AI", "Full-Stack Development"],
    alumniOf: [],
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
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Chakra+Petch:wght@600;700&display=swap"
          rel="stylesheet"
        />
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
      <body className="min-h-full bg-deep-space text-text-main font-body scanline">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
