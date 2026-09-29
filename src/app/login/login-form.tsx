"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { EASE_CODEX } from "@/lib/motion-variants";

/** Loader-speed spin for the submit diamond (`.elemental-rotate` default is 7s). */
const SPIN_FAST = { "--codex-spin-duration": "1s" } as CSSProperties;

/**
 * Codex Console sign-in.
 *
 * Two steps: an introduction that explains the gate, then the password form.
 * The password is handed to `useAuth().login`, which verifies it against
 * `/api/auth` and throws an `ApiError` (401 rejected, 503 unconfigured) whose
 * message is rendered inline with `role="alert"`. A resolved login flips the
 * session flag, and the effect below routes the traveler into the dashboard.
 *
 * The panel follows the Teyvat Codex surface language — warm parchment,
 * saddle leather and imperial gold — with no terminal chrome.
 */
export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"intro" | "password">("intro");
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      // The raw value goes to the server — never a trimmed credential.
      await login(password);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "The console could not be reached. Check your connection and try again."
      );
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-parchment-base p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_CODEX }}
        className="relative w-full max-w-md"
      >
        <div className="codex-panel codex-panel-radius overflow-hidden">
          {/* Gilded crest + console wordmark */}
          <div className="flex items-center gap-3 border-b border-leather-caramel/20 px-6 py-4">
            <span className="codex-icon-plate h-11 w-11 shrink-0">
              <Image
                src={GENSHIN_UI_ICONS.archive}
                alt=""
                width={22}
                height={22}
                className="codex-icon-on-plate h-6 w-6 object-contain"
                unoptimized
              />
            </span>
            <div className="min-w-0">
              <span className="codex-label-gold block">Teyvat Codex</span>
              <p className="font-display text-sm font-bold tracking-[0.12em] text-leather-dark">
                Codex Console
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="codex-card codex-radius-card p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {step === "intro" ? (
                <motion.section
                  key="intro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE_CODEX }}
                  className="text-center"
                >
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-leather-caramel/30 bg-leather-caramel/10">
                    <KeyRound className="h-9 w-9 text-leather-caramel" />
                  </span>

                  <h1 className="mt-6 font-display text-2xl font-bold tracking-[0.08em] text-leather-dark">
                    Sign in to the <span className="codex-gradient-text">console</span>
                  </h1>
                  <p className="mx-auto mt-3 max-w-xs text-sm font-body text-leather-muted">
                    The archive is sealed. Present your key to manage the dossier.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep("password")}
                    className="codex-btn-primary codex-focus mt-8 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-bold tracking-wide"
                  >
                    Enter the console
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <span className="codex-label mt-6 block">Access is reserved for the archivist</span>
                </motion.section>
              ) : (
                <motion.section
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE_CODEX }}
                >
                  <h1 className="font-display text-xl font-bold tracking-[0.08em] text-leather-dark">
                    Who goes there?
                  </h1>
                  <p className="mt-2 text-sm font-body text-leather-muted">
                    Enter the archivist password to open the Codex Console.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) setError("");
                      }}
                      label="Password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      autoFocus
                      disabled={submitting}
                      suffixInteractive
                      suffix={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                          className="codex-focus flex h-9 w-9 items-center justify-center codex-radius-xs text-leather-muted transition-colors duration-300 hover:text-leather-caramel"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      }
                    />

                    {error && (
                      <p
                        role="alert"
                        className="flex items-start gap-2 codex-radius-sm border border-crimson-600/30 bg-crimson-600/8 px-4 py-3 text-xs font-medium text-crimson-600"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{error}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        glow="none"
                        onClick={() => {
                          setStep("intro");
                          setError("");
                          setPassword("");
                        }}
                        disabled={submitting}
                        className="flex-1"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back
                      </Button>
                      <button
                        type="submit"
                        disabled={!password.trim() || submitting}
                        aria-busy={submitting || undefined}
                        className="codex-btn-primary codex-focus inline-flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {submitting ? (
                          <>
                            <span className="relative block h-4 w-4 shrink-0" aria-hidden="true">
                              <span className="absolute inset-0 rotate-45 codex-radius-xs border-2 border-gold-900/35" />
                              <span
                                style={SPIN_FAST}
                                className="elemental-rotate absolute inset-0 rotate-45 codex-radius-xs border-2 border-transparent border-t-gold-900"
                              />
                            </span>
                            Opening…
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4" aria-hidden="true" />
                            Unlock
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <p className="codex-label mt-6 block">
                    The session ends when you close the codex
                  </p>
                </motion.section>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="codex-focus inline-flex items-center gap-1.5 text-xs font-semibold text-leather-muted transition-colors duration-300 hover:text-leather-caramel"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Return to the dossier
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
