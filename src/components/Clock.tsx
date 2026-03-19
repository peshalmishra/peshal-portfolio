"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Tick markers — rendered once, never change
// ---------------------------------------------------------------------------

function DialMarkers() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Minute / hour tick marks */}
            {Array.from({ length: 60 }).map((_, i) => {
                const isHour = i % 5 === 0;
                return (
                    <div
                        key={i}
                        className="absolute inset-0 flex items-start justify-center"
                        style={{ transform: `rotate(${i * 6}deg)` }}
                    >
                        <div
                            className={`mt-[2%] ${
                                isHour
                                    ? "w-[1.5px] h-[5%] bg-white"
                                    : "w-[1px]   h-[2.5%] bg-white/50"
                            }`}
                        />
                    </div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Hour index markers (Rolex-style)
// ---------------------------------------------------------------------------

function HourMarkers() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => {
                const hour     = i === 0 ? 12 : i;
                const rotation = i * 30;

                if (hour === 12) {
                    return (
                        <div
                            key={hour}
                            className="absolute inset-0 flex flex-col items-center justify-start z-10"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            <svg
                                className="mt-[7%] sm:mt-[6%] w-[16px] sm:w-[22px] h-[16px] sm:h-[22px]"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <polygon
                                    points="12,22 2,2 22,2"
                                    className="fill-[#f1faee] stroke-neutral-300"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    );
                }

                if (hour === 3 || hour === 6 || hour === 9) {
                    return (
                        <div
                            key={hour}
                            className="absolute inset-0 flex flex-col items-center justify-start z-10"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            <div className="mt-[8%] sm:mt-[7%] w-[8px] sm:w-[12px] h-[18px] sm:h-[24px] bg-[#f1faee] border-[1.5px] sm:border-[2px] border-neutral-300 rounded-[1px] shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
                        </div>
                    );
                }

                return (
                    <div
                        key={hour}
                        className="absolute inset-0 flex flex-col items-center justify-start z-10"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <div className="mt-[8%] sm:mt-[7%] w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] bg-[#f1faee] border-[1.5px] sm:border-[2px] border-neutral-300 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
                    </div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Hands — direct DOM mutation via refs for 60 fps with zero re-renders
// ---------------------------------------------------------------------------

interface HandsProps {
    hourRef:   React.RefObject<HTMLDivElement | null>;
    minuteRef: React.RefObject<HTMLDivElement | null>;
    secondRef: React.RefObject<HTMLDivElement | null>;
}

function Hands({ hourRef, minuteRef, secondRef }: HandsProps) {
    return (
        <div className="absolute inset-0 pointer-events-none">

            {/* Hour hand — Mercedes style */}
            <div ref={hourRef} className="absolute inset-0 z-20">
                <div
                    className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom flex flex-col items-center justify-end"
                    style={{ height: "30%", width: "16px" }}
                >
                    {/*
                        FIX: drop-shadow moved to a static wrapper, NOT the animating element.
                        CSS filters on RAF-animated elements trigger re-compositing every frame,
                        causing dropped frames on mobile. The wrapper is static so the filter
                        is composited once.
                    */}
                    <div className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 24 100"
                            preserveAspectRatio="xMidYMax meet"
                        >
                            <rect x="10" y="35" width="4"  height="65" className="fill-neutral-200" />
                            <circle cx="12" cy="24" r="10" className="fill-neutral-200" />
                            <circle cx="12" cy="24" r="8"  className="fill-[#f1faee]" />
                            <path d="M12,24 L12,16 M12,24 L7,29 M12,24 L17,29" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" />
                            <polygon points="12,-5 18,13 6,13"  className="fill-neutral-200" />
                            <polygon points="12,0 15,11 9,11"  className="fill-[#f1faee]" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Minute hand — sword style */}
            <div ref={minuteRef} className="absolute inset-0 z-20">
                <div
                    className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom flex flex-col items-center justify-end"
                    style={{ height: "42%", width: "12px" }}
                >
                    <div className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 12 100"
                            preserveAspectRatio="none"
                        >
                            <polygon points="6,-5 12,15 9,100 3,100 0,15" className="fill-neutral-200" />
                            <polygon points="6,0 10,18 8,95 4,95 2,18"   className="fill-[#f1faee]" />
                            <line x1="6" y1="0" x2="6" y2="100" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                        </svg>
                    </div>
                </div>
            </div>

            {/*
                FIX: Second hand now uses the same origin-bottom / bottom-1/2 pattern
                as the other two hands instead of the magic-number origin-[50%_83.33%].
                The tail (counter-weight) is drawn below y=0 in SVG space, which
                naturally extends behind the pivot when rotated from the bottom.
            */}
            <div ref={secondRef} className="absolute inset-0 z-30">
                <div
                    className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom flex flex-col items-center justify-end"
                    style={{ height: "45%", width: "8px" }}
                >
                    <div className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 10 100"
                            preserveAspectRatio="xMidYMax meet"
                        >
                            {/* Main shaft up to pivot */}
                            <rect x="4" y="0"   width="2" height="85" className="fill-[#e3342f]" />
                            {/* Counter-weight tail (extends "below" origin in SVG = behind pivot on screen) */}
                            <rect x="3" y="85"  width="4" height="20" className="fill-[#e3342f]" rx="2" />
                            {/* Lollipop circle near tip */}
                            <circle cx="5" cy="15" r="4"   className="fill-[#e3342f]" />
                            <circle cx="5" cy="15" r="2.2" className="fill-[#f1faee]" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Center pinion cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="w-[6px] sm:w-[10px] h-[6px] sm:h-[10px] rounded-full bg-neutral-300 shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-neutral-400 flex items-center justify-center">
                    <div className="w-[40%] h-[40%] rounded-full bg-neutral-200" />
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Clock() {
    const hourHandRef   = useRef<HTMLDivElement>(null);
    const minuteHandRef = useRef<HTMLDivElement>(null);
    const secondHandRef = useRef<HTMLDivElement>(null);
    const rafRef        = useRef<number | null>(null);

    useEffect(() => {
        /*
            FIX 1: updateClock defined INSIDE useEffect so it is never redefined
            on re-renders. Previously it was defined in component scope, meaning
            every render created a new function — if a render happened mid-loop,
            a second RAF loop would start, the old rafRef value would be overwritten,
            and the first loop could never be cancelled (memory + CPU leak).

            FIX 2: isMounted state removed entirely. The hands render immediately
            (no SSR value needed — they start at rotate(0deg) and update on the
            first RAF tick). Removing isMounted eliminates the flash where hands
            were absent for one render cycle and avoids the extra state + re-render.

            FIX 3: Hour hand formula corrected from ÷24 to ÷12.
            Original: (hours + minutes / 60) * (360 / 24)  → 15° per hour (24-hr clock)
            Fixed:    (hours % 12 + minutes / 60) * 30      → 30° per hour (12-hr clock)
            At 3:00 the hand now correctly points to the 3 position instead of the 6.
        */
        const tick = () => {
            const now     = new Date();
            const hours   = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const millis  = now.getMilliseconds();

            const hourDeg   = (hours % 12 + minutes / 60) * 30;          // FIX 3
            const minuteDeg = (minutes + seconds / 60) * 6;
            const secondDeg = (seconds + millis / 1000) * 6;             // smooth sweep

            if (hourHandRef.current)
                hourHandRef.current.style.transform   = `rotate(${hourDeg}deg)`;
            if (minuteHandRef.current)
                minuteHandRef.current.style.transform = `rotate(${minuteDeg}deg)`;
            if (secondHandRef.current)
                secondHandRef.current.style.transform = `rotate(${secondDeg}deg)`;

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []); // empty deps — tick is stable, defined inside the effect

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative w-full h-full rounded-full bg-gradient-to-br from-[#c0c0c0] to-[#888888] dark:from-[#333] dark:to-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.3),_0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center"
        >
            {/* Brushed metallic bezel */}
            <div className="absolute inset-[3%] sm:inset-[4%] rounded-full bg-[conic-gradient(from_0deg,#e0e0e0_0%,#f8f8f8_10%,#b0b0b0_20%,#e0e0e0_30%,#a0a0a0_40%,#f0f0f0_50%,#b0b0b0_60%,#e8e8e8_70%,#9c9c9c_80%,#fafafa_90%,#e0e0e0_100%)] dark:bg-[conic-gradient(from_0deg,#222_0%,#555_10%,#111_20%,#444_30%,#1a1a1a_40%,#666_50%,#151515_60%,#555_70%,#0a0a0a_80%,#666_90%,#222_100%)] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),_0_2px_10px_rgba(0,0,0,0.5)] border border-neutral-300 dark:border-neutral-700">

                {/* Deep sunburst dial */}
                <div className="absolute inset-[10%] sm:inset-[12%] rounded-full bg-[#111] dark:bg-black shadow-[inset_0_0_30px_rgba(0,0,0,0.9),_0_0_15px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10">

                    {/* Sunburst reflection */}
                    <div className="absolute inset-0 bg-[conic-gradient(from_45deg,rgba(255,255,255,0.02)_0%,transparent_20%,transparent_40%,rgba(255,255,255,0.03)_50%,transparent_60%,transparent_80%,rgba(255,255,255,0.02)_100%)] pointer-events-none mix-blend-screen" />

                    <DialMarkers />
                    <HourMarkers />

                    {/* Branding */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
                        <div className="absolute top-[28%] sm:top-[26%] flex flex-col items-center">
                            <span className="font-serif font-bold text-white text-[10px] sm:text-[14px] tracking-wider drop-shadow-md">PESHAL</span>
                            <span className="font-sans font-medium text-white/90 text-[5px] sm:text-[7px] tracking-[0.2em] mt-0.5 drop-shadow-md">CLOUD ENGINEER</span>
                        </div>
                        <div className="absolute bottom-[28%] sm:bottom-[26%] flex flex-col items-center">
                            <span className="font-serif italic text-white/90 text-[6px] sm:text-[9px] tracking-wide drop-shadow-md">Software</span>
                            <span className="font-sans font-medium text-white/80 text-[4px] sm:text-[6px] tracking-[0.15em] mt-0.5 uppercase drop-shadow-md">Officially Certified</span>
                        </div>
                    </div>

                    <Hands
                        hourRef={hourHandRef}
                        minuteRef={minuteHandRef}
                        secondRef={secondHandRef}
                    />
                </div>
            </div>
        </motion.div>
    );
}