"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Activity, Shield, Eye, EyeOff, KeyRound, AlertCircle, Terminal, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { StatusDot } from "@/components/ui/status-dot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"init" | "password">("init");
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect
  if (isAuthenticated) {
    router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        login(data.token);
        router.replace("/dashboard");
      } else {
        setError("ACCESS DENIED // Invalid credentials");
        setPassword("");
      }
    } catch {
      setError("CONNECTION ERROR // Unable to reach authentication node");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-space p-4">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-starfield" />
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-20" />
      <div className="pointer-events-none absolute inset-0 scanline" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet" />

      {/* Decorative particles */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full border border-border-glass/30 blur-3xl bg-gold-500/5" />
        <div className="absolute bottom-1/3 right-1/3 h-96 w-96 rounded-full border border-border-glass/20 blur-3xl bg-stellar-400/5" />
      </div>

      {/* Main Login Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Decorative corner brackets */}
        <div className="pointer-events-none absolute -left-2 -top-2 text-gold-400/40 font-mono text-[10px]">[SYS_AUTH//01]</div>
        <div className="pointer-events-none absolute -right-2 -bottom-2 text-gold-400/40 font-mono text-[10px]">[NODE_SECURE]</div>

        <div className="glass-panel chamfered overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3">
            <div className="flex gap-1.5">
              <StatusDot tone="danger" label="Terminal closed" className="h-2.5 w-2.5" />
              <StatusDot tone="warning" label="Terminal minimized" className="h-2.5 w-2.5" />
              <StatusDot tone="active" label="Terminal open" className="h-2.5 w-2.5" />
            </div>
            <div className="ml-3 flex items-center gap-1 sys-label text-[10px]">
              <Shield className="h-3 w-3 text-gold-400" />
              <span className="text-gold-400">AETHER</span>
              <span className="text-text-muted/30">/</span>
              <span className="text-text-muted/50">auth_node</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <StatusDot tone="active" pulse label="Encrypted" className="h-1.5 w-1.5" />
              <span className="sys-label-active text-[8px]">ENCRYPTED</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {step === "init" ? (
                <motion.div
                  key="init"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  {/* Logo/Icon */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center chamfered border-2 border-gold-400/30 bg-deep-space"
                  >
                    <Activity className="h-10 w-10 text-gold-400" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 font-display text-2xl font-bold tracking-[0.08em] text-text-main"
                  >
                    AETHER // <span className="text-gradient-gold">DASH</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 font-mono text-xs text-text-muted"
                  >
                    Restricted Access // Authentication Required
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setStep("password")}
                      className="border-gold-400/50 px-8 py-3 font-mono text-xs tracking-widest text-gold-400 hover:bg-[rgba(242,201,76,0.08)] hover:border-gold-400/50 hover-scale-sm"
                    >
                      <Shield className="h-4 w-4" />
                      INITIALIZE ACCESS
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 sys-label text-[9px]"
                  >
                    [SYS_NODE] // Unauthorized access is prohibited
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Terminal prompt */}
                  <div className="mb-6 flex items-center gap-2 chamfered-sm border border-border-subtle bg-deep-space/50 px-4 py-2.5">
                    <span className="text-gold-400 font-mono text-xs">[AETHER@DASH]</span>
                    <span className="text-text-muted/30">:~$</span>
                    <span className="text-stellar-400 font-mono text-xs">authenticate --level=admin</span>
                    <span className="ml-auto animate-energy-pulse text-gold-400 font-mono text-xs">_</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password field — reusable Input with interactive
                        eye-toggle suffix (suffixInteractive keeps the
                        toggle clickable; pr-20 reserves room for it). */}
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="PASSWORD // 8-32 characters"
                      placeholder="Enter security credentials..."
                      className="pr-20 font-mono text-sm tracking-widest"
                      autoFocus
                      disabled={loading}
                      suffixInteractive
                      suffix={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="flex h-9 w-9 items-center justify-center chamfered-xs text-text-muted transition-all duration-300 hover:text-gold-400 hover-scale-sm press-scale focus-ring-gold"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />

                    {/* Error message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 chamfered-sm border border-hud-danger/30 bg-[rgba(255,0,85,0.06)] px-4 py-3"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0 text-hud-danger" />
                          <span className="font-mono text-[11px] text-hud-danger">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => {
                          setStep("init");
                          setError("");
                          setPassword("");
                        }}
                        className="flex-1 px-4 py-3 font-mono text-xs tracking-widest text-text-muted hover:bg-transparent hover:text-gold-400 hover-scale-sm"
                        disabled={loading}
                      >
                        ABORT
                      </Button>
                      <Button
                        type="submit"
                        variant="outline"
                        size="md"
                        loading={loading}
                        disabled={!password.trim()}
                        className="flex-1 border-gold-400/50 px-4 py-3 font-mono text-xs tracking-widest text-gold-400 hover:bg-[rgba(242,201,76,0.08)] hover:border-gold-400/50 hover-scale-sm"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            AUTHENTICATING...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <KeyRound className="h-4 w-4" />
                            UNLOCK
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Access log */}
                  <div className="mt-6 space-y-1 chamfered-sm border border-border-subtle bg-deep-space/30 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="sys-label text-[8px]">[ACCESS_LOG]</span>
                      <StatusDot tone="gold" label="Access log live" className="h-1 w-1 opacity-30" glow={false} />
                    </div>
                    <p className="font-mono text-[9px] text-text-muted/50">
                      {new Date().toLocaleString("en-US", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Asia/Jakarta",
                      })}{" "}
                      WIB // SESSION INIT // IP_MASKED
                    </p>
                    <p className="font-mono text-[9px] text-text-muted/30">
                      3 failed attempts will trigger rate limit
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted/40 transition-colors hover:text-gold-400/60 hover-scale-sm focus-ring-gold"
          >
            <Terminal className="h-3 w-3" />
            RETURN TO PORTAL
          </a>
        </div>
      </motion.div>
    </div>
  );
}
