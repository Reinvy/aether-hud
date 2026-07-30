import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — High-End Tactical Portfolio`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
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
  },
  category: "technology",
  verification: {
    // google: "google-site-verification-code",
  },
  other: {
    "theme-color": "#030407",
    "msapplication-TileColor": "#030407",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bahrul Ulumul Haq",
    url: APP_URL,
    jobTitle: "Full-Stack Developer & AI Engineer",
    knowsAbout: ["Next.js", "TypeScript", "React", "AI", "Full-Stack Development"],
    alumniOf: [],
    sameAs: [
      "https://github.com/Reinvy",
      "https://linkedin.com/in/bahrul-ulumul-haq",
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
