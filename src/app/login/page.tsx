/**
 * Login — server page wrapper for the Codex Console sign-in.
 *
 * The form itself is the client component (login-form.tsx); this wrapper
 * owns per-page metadata. /login is a credential gate — it must never appear
 * in search results, so robots noindex is applied here as defense-in-depth on
 * top of robots.ts.
 */
import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Codex Console",
  description: "Sign in to manage your dossier",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
