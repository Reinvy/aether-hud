"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { useData } from "@/lib/use-data";

interface MotionContextType {
  /** Operator preference from `/api/config`; off means "no animation anywhere". */
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  /** Re-read the stored preference (called after a settings save). */
  syncConfig: () => void;
}

const MotionContext = createContext<MotionContextType>({
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
  syncConfig: () => {},
});

/**
 * MotionProvider — the runtime motion preference.
 *
 * The codex is light-only, so the only global visual preference an operator
 * controls is whether the Teyvat motion layer plays. It drives two things:
 * the `no-animations` class on <html> (which neutralises the CSS keyframes)
 * and framer-motion's `reducedMotion`, so declarative animation honours the
 * same switch without any component reading the preference itself.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const { data: config, refetch } = useData<{ animationsEnabled?: boolean }>("/api/config");
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);

  useEffect(() => {
    if (typeof config?.animationsEnabled === "boolean") {
      setAnimationsEnabledState(config.animationsEnabled);
    }
  }, [config]);

  useEffect(() => {
    document.documentElement.classList.toggle("no-animations", !animationsEnabled);
  }, [animationsEnabled]);

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setAnimationsEnabledState(enabled);
  }, []);

  return (
    <MotionContext.Provider value={{ animationsEnabled, setAnimationsEnabled, syncConfig: refetch }}>
      <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotionPrefs(): MotionContextType {
  return useContext(MotionContext);
}
