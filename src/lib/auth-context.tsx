"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiRequest } from "@/lib/api-client";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Verifies the password with the server, then holds the session cookie. */
  login: (password: string) => Promise<void>;
  /** Clears the server cookie and returns to the login screen. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

/**
 * AuthProvider — cookie-backed dashboard session.
 *
 * The retired flow kept a base64 `{ authenticated: true }` blob in
 * `sessionStorage`, which anyone could mint from the dev console. The session
 * is now an HMAC-signed `httpOnly` cookie set by `/api/auth`, and the only
 * client-side knowledge of it is this `authenticated` flag, re-checked against
 * the server on mount.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    apiGet<{ authenticated: boolean }>("/api/auth")
      .then((session) => {
        if (!cancelled) setIsAuthenticated(session.authenticated);
      })
      .catch(() => {
        // An unreachable or unconfigured server leaves the session closed.
        if (!cancelled) setIsAuthenticated(false);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    await apiRequest<{ success: boolean }>("/api/auth", {
      method: "POST",
      body: { password },
    });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest<{ success: boolean }>("/api/auth", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
