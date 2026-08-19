"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { useData } from "@/lib/use-data";

export type GenshinTheme = "teyvat-codex" | "celestial-night";

interface ThemeConfig {
  themePreset?: string;
  animationsEnabled?: boolean;
}

interface ThemeContextType {
  themePreset: GenshinTheme;
  animationsEnabled: boolean;
  setThemePreset: (preset: GenshinTheme | string) => void;
  toggleTheme: () => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  syncConfig: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themePreset: "teyvat-codex",
  animationsEnabled: true,
  setThemePreset: () => {},
  toggleTheme: () => {},
  setAnimationsEnabled: () => {},
  syncConfig: () => {},
});

function sanitizeTheme(preset?: string | null): GenshinTheme {
  if (preset === "celestial-night" || preset === "night-ops") {
    return "celestial-night";
  }
  return "teyvat-codex";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: config, refetch } = useData<ThemeConfig>("/api/config");
  const [themePreset, setThemePresetState] = useState<GenshinTheme>("teyvat-codex");
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);

  // Sync from API / localStorage on initial load
  useEffect(() => {
    // Check localStorage first if available
    try {
      const stored = localStorage.getItem("aether_theme");
      if (stored) {
        setThemePresetState(sanitizeTheme(stored));
        return;
      }
    } catch (_error) {
      // Ignore localStorage access failures in restricted environments
      void _error;
    }

    if (config?.themePreset) {
      setThemePresetState(sanitizeTheme(config.themePreset));
    }
    if (typeof config?.animationsEnabled === "boolean") {
      setAnimationsEnabledState(config.animationsEnabled);
    }
  }, [config]);

  // Apply theme preset to document root
  useEffect(() => {
    const root = document.documentElement;
    if (themePreset === "celestial-night") {
      root.dataset.theme = "celestial-night";
      root.classList.add("dark");
    } else {
      root.dataset.theme = "teyvat-codex";
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("aether_theme", themePreset);
    } catch (_error) {
      // Ignore localStorage write failures in restricted environments
      void _error;
    }
  }, [themePreset]);

  // Apply animations toggle to document root
  useEffect(() => {
    const root = document.documentElement;
    if (!animationsEnabled) {
      root.classList.add("no-animations");
    } else {
      root.classList.remove("no-animations");
    }
  }, [animationsEnabled]);

  const setThemePreset = useCallback((preset: GenshinTheme | string) => {
    setThemePresetState(sanitizeTheme(preset));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePresetState((prev) =>
      prev === "celestial-night" ? "teyvat-codex" : "celestial-night"
    );
  }, []);

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setAnimationsEnabledState(enabled);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themePreset,
        animationsEnabled,
        setThemePreset,
        toggleTheme,
        setAnimationsEnabled,
        syncConfig: refetch,
      }}
    >
      <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
