"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

type GlobeInstance = ReturnType<typeof createGlobe>;

interface GlobeConfig {
  markers?: { location: [number, number]; size: number }[];
  baseColor?: [number, number, number];
  markerColor?: [number, number, number];
  glowColor?: [number, number, number];
  mapBrightness?: number;
  mapSamples?: number;
  dark?: number;
  diffuse?: number;
  theta?: number;
  rotationSpeed?: number;
}

interface GlobeProps {
  config?: GlobeConfig;
  className?: string;
}

// ---------------------------------------------------------------------------
// FIX #1: baseColor was pure black [0,0,0], which kills contrast between the
// land-dots and the ocean — that's why the dotted continent texture was
// invisible in your screenshot. The reference globe uses a mid-gray base
// (cobe's own default demo value) so the dot grid actually reads.
//
// FIX #2: mapBrightness was 8, way too hot — it overexposes the dots into a
// blurry glow instead of crisp points. Dropped to 6.
//
// FIX #3: diffuse tuned down slightly + glowColor brightened so the ambient
// halo softens the edge without washing out the dot pattern.
// ---------------------------------------------------------------------------
const DARK_CONFIG: Required<GlobeConfig> = {
  markers: [{ location: [20.5937, 78.9629], size: 0.09 }],
  baseColor:   [0.3,  0.3,  0.3 ],   // was [0,0,0] — this is what made the dots vanish
  markerColor: [1.0,  1.0,  1.0 ],   // bright white India dot
  glowColor:   [1.0,  1.0,  1.0 ],   // was [0.08,0.08,0.08] — too dim to read as a halo
  mapBrightness: 6,                  // was 8 — dots were overexposed/blurred
  mapSamples:    16000,
  dark:    1,
  diffuse: 1.2,
  theta:   0.3,
  rotationSpeed: 0.003,
};

const LIGHT_CONFIG: Required<GlobeConfig> = {
  markers: [{ location: [20.5937, 78.9629], size: 0.09 }],
  baseColor:   [0.9,  0.9,  0.9 ],
  markerColor: [0.2,  0.2,  0.2 ],
  glowColor:   [0.85, 0.85, 0.85],
  mapBrightness: 5,
  mapSamples:    16000,
  dark:    0,
  diffuse: 2.5,
  theta:   0.3,
  rotationSpeed: 0.003,
};

function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isDark;
}

// ---------------------------------------------------------------------------
// useGlobe — manages the cobe instance lifecycle cleanly
// ---------------------------------------------------------------------------
function useGlobe(config: Required<GlobeConfig>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef  = useRef<GlobeInstance | null>(null);
  const phiRef    = useRef(0);

  const destroy = useCallback(() => {
    if (globeRef.current) {
      try { globeRef.current.destroy(); } catch (_) { /* ignore */ }
      globeRef.current = null;
    }
  }, []);

  const create = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // FIX #4: fall back to the *container's* clientWidth first — offsetWidth
    // on the canvas itself can read 0 or stale on first paint, which was
    // producing a smaller-than-intended globe in your build.
    const w =
      canvas.parentElement?.clientWidth ||
      canvas.offsetWidth ||
      0;
    if (w <= 0) return;

    destroy();

    const dpr  = Math.min(window.devicePixelRatio ?? 1, 2);
    const size = w;

    try {
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width:  size * dpr,
        height: size * dpr,
        phi:    phiRef.current,
        theta:  config.theta,
        dark:   config.dark,
        diffuse: config.diffuse,
        mapSamples:    config.mapSamples,
        mapBrightness: config.mapBrightness,
        baseColor:   config.baseColor,
        markerColor: config.markerColor,
        glowColor:   config.glowColor,
        markers:     config.markers,
        onRender: (state) => {
          state.phi   = phiRef.current;
          phiRef.current += config.rotationSpeed;
        },
      });
    } catch (err) {
      console.error("[Globe] Failed to initialize:", err);
    }
  }, [config, destroy]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      create();
    });

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return () => { cancelAnimationFrame(raf); destroy(); };

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => create());
    });
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      destroy();
    };
  }, [create, destroy]);

  return canvasRef;
}

// ---------------------------------------------------------------------------
// Globe component
// ---------------------------------------------------------------------------
export function Globe({ config = {}, className = "" }: GlobeProps) {
  const isDark = useTheme();

  const baseConfig   = isDark ? DARK_CONFIG : LIGHT_CONFIG;
  const mergedConfig = { ...baseConfig, ...config } as Required<GlobeConfig>;

  const canvasRef = useGlobe(mergedConfig);

  const glowOuter = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const glowMid   = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const glowCore  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  return (
    // FIX #5: reference globe visibly fills more of its column. Bumping the
    // min-width/scale here so it isn't shrunk by a tight flex parent — adjust
    // the scale-[1.15] if your layout needs it tighter or looser.
    <div
      className={`relative w-full aspect-square flex items-center justify-center scale-[1.15] ${className}`}
      aria-label="Interactive 3D globe"
      role="img"
    >
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-20%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${glowOuter} 30%, transparent 70%)`,
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-5%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${glowMid} 45%, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: "10%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${glowCore} 30%, transparent 65%)`,
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.02, 0.97] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        style={{
          width:   "100%",
          height:  "100%",
          display: "block",
        }}
      />
    </div>
  );
}