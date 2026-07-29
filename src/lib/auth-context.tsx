"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  checkAuth: () => false,
});

const AUTH_KEY = "aether_hud_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    const token = sessionStorage.getItem(AUTH_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        if (payload.authenticated && payload.ts) {
          // Token valid for 24 hours
          const age = Date.now() - payload.ts;
          if (age < 24 * 60 * 60 * 1000) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem(AUTH_KEY);
          }
        }
      } catch {
        sessionStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    sessionStorage.setItem(AUTH_KEY, token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  const checkAuth = useCallback(() => {
    const token = sessionStorage.getItem(AUTH_KEY);
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token));
      return !!(payload.authenticated && payload.ts);
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
