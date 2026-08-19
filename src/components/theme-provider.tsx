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

interface ThemeConfig {
  themePreset: string;
  animationsEnabled: boolean;
}

interface ThemeContextType {
  themePreset: string;
  animationsEnabled: boolean;
  setThemePreset: (preset: string) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  syncConfig: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themePreset: "obsidian",
  animationsEnabled: true,
  setThemePreset: () => {},
  setAnimationsEnabled: () => {},
  syncConfig: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: config, refetch } = useData<ThemeConfig>("/api/config");
  const [themePreset, setThemePresetState] = useState("obsidian");
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);

  // Sync from API on initial load
  useEffect(() => {
    if (config) {
      if (config.themePreset) {
        setThemePresetState(config.themePreset);
      }
      if (typeof config.animationsEnabled === "boolean") {
        setAnimationsEnabledState(config.animationsEnabled);
      }
    }
  }, [config]);

  // Apply theme preset to document root
  useEffect(() => {
    const root = document.documentElement;
    if (themePreset && themePreset !== "obsidian") {
      root.dataset.theme = themePreset;
    } else {
      delete root.dataset.theme;
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

  const setThemePreset = useCallback((preset: string) => {
    setThemePresetState(preset);
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
