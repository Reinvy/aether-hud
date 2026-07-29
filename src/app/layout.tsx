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
    "frontend", "TypeScript", "React",
  ],
  openGraph: {
    title: `${APP_NAME} — High-End Tactical Portfolio`,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — High-End Tactical Portfolio`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Chakra+Petch:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-deep-space text-text-main font-body scanline">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
