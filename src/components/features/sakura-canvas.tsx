"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "@/components/motion-provider";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
}

interface Stardust {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface SakuraCanvasProps {
  /** True while the intro gate owns the screen — the drift layer holds still. */
  paused?: boolean;
}

/**
 * SakuraCanvas — the ambient petal-and-stardust drift behind the dossier.
 *
 * A raw `requestAnimationFrame` loop, so it honours the motion preference by
 * stopping rather than by CSS: it does not run at all while the intro gate is
 * open, while the tab is hidden, or when the operator turns motion off in the
 * console. Phones get a thinner field (fewer particles) instead of the same
 * count on a smaller screen.
 */
export function SakuraCanvas({ paused = false }: SakuraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { animationsEnabled } = useMotionPrefs();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibilityChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const suspended = paused || hidden || !animationsEnabled;

  useEffect(() => {
    if (suspended) return;
    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const compact = window.innerWidth < 640;

    // Initialize Sakura Petals
    const PETAL_COUNT = compact ? 12 : 24;
    const petals: Petal[] = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: 7 + Math.random() * 8,
      speedY: 0.6 + Math.random() * 0.8,
      speedX: 0.3 + Math.random() * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.4 + Math.random() * 0.4,
      swaySpeed: 0.02 + Math.random() * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
    }));

    // Initialize Celestial Stardust
    const STARDUST_COUNT = compact ? 16 : 32;
    const stardust: Stardust[] = Array.from({ length: STARDUST_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.5,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render Stardust
      for (const star of stardust) {
        const currentOpacity =
          star.opacity * (0.6 + 0.4 * Math.sin(frame * star.pulseSpeed + star.pulseOffset));
        ctx.fillStyle = `rgba(242, 201, 76, ${currentOpacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Sakura Petals
      for (const p of petals) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(frame * p.swaySpeed + p.swayOffset) * 0.5;
        p.rotation += p.rotSpeed;

        // Wrap around
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity.toFixed(2)})`;

        // Petal shape curve
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, p.size / 3, 0, p.size);
        ctx.bezierCurveTo(-p.size, p.size / 3, -p.size / 2, -p.size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [suspended]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 opacity-75"
    />
  );
}
