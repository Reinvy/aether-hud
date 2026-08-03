/**
 * Login — server page wrapper.
 *
 * The auth form is a client component (login-form.tsx); this wrapper
 * provides per-page metadata. /login is a credential gate — it must never
 * appear in search results, so robots noindex is applied here as
 * defense-in-depth on top of robots.ts.
 */
import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "AUTHENTICATION",
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
