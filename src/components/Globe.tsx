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

const DARK_CONFIG: Required<GlobeConfig> = {
  markers: [{ location: [20.5937, 78.9629], size: 0.05 }],

  baseColor: [0.18, 0.18, 0.18],
  markerColor: [1, 1, 1],
  glowColor: [0.35, 0.35, 0.35],

  mapBrightness: 7,
  mapSamples: 16000,

  dark: 1,
  diffuse: 1.8,
  theta: 0.3,
  rotationSpeed: 0.003,
};

const LIGHT_CONFIG: Required<GlobeConfig> = {
  markers: [{ location: [20.5937, 78.9629], size: 0.05 }],

  baseColor: [0.92, 0.92, 0.92],
  markerColor: [0.15, 0.15, 0.15],
  glowColor: [0.7, 0.7, 0.7],

  mapBrightness: 4,
  mapSamples: 16000,

  dark: 0,
  diffuse: 1.4,
  theta: 0.3,
  rotationSpeed: 0.003,
};

function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setTimeout(() => setIsDark(media.matches), 0);

    const listener = () => setIsDark(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isDark;
}

function useGlobe(config: Required<GlobeConfig>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  const initGlobe = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || widthRef.current <= 0) return;

    if (globeRef.current) {
      globeRef.current.destroy();
      globeRef.current = null;
    }

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const size = widthRef.current;

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,

      phi: 0,
      theta: config.theta,
      dark: config.dark,
      diffuse: config.diffuse,

      mapSamples: config.mapSamples,
      mapBrightness: config.mapBrightness,

      baseColor: config.baseColor,
      markerColor: config.markerColor,
      glowColor: config.glowColor,

      markers: config.markers,

      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += config.rotationSpeed;
      },
    });
  }, [config]);

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) {
        widthRef.current = w;
        initGlobe();
      }
    });

    observer.observe(parent);

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      observer.disconnect();
    };
  }, [initGlobe]);

  return canvasRef;
}

export function Globe({ config = {}, className = "" }: GlobeProps) {
  const isDark = useTheme();

  const baseConfig = isDark ? DARK_CONFIG : LIGHT_CONFIG;
  const mergedConfig: Required<GlobeConfig> = { ...baseConfig, ...config };

  const canvasRef = useGlobe(mergedConfig);

  const glowOuter = isDark
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.05)";

  const glowMid = isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(0,0,0,0.08)";

  const glowCore = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.06)";

  return (
    <div
      className={`relative w-full aspect-square max-w-[600px] flex items-center justify-center ${className}`}
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
          width: "100%",
          height: "100%",
          contain: "layout paint size",
        }}
      />
    </div>
  );
}