"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// SVG <defs> — gradients shared across all SVG layers
// ---------------------------------------------------------------------------
function ClockDefs() {
    return (
        <defs>
            {/* Hour hand — mirror-polished chrome, sharp highlight */}
            <linearGradient id="grad-hour" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#1a1a1a" />
                <stop offset="18%"  stopColor="#aaaaaa" />
                <stop offset="38%"  stopColor="#f8f8f8" />
                <stop offset="50%"  stopColor="#ffffff" />
                <stop offset="62%"  stopColor="#e0e0e0" />
                <stop offset="82%"  stopColor="#888888" />
                <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>

            {/* Minute hand — high-contrast polished steel */}
            <linearGradient id="grad-minute" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#111" />
                <stop offset="20%"  stopColor="#999" />
                <stop offset="40%"  stopColor="#f0f0f0" />
                <stop offset="50%"  stopColor="#ffffff" />
                <stop offset="60%"  stopColor="#d8d8d8" />
                <stop offset="82%"  stopColor="#777" />
                <stop offset="100%" stopColor="#111" />
            </linearGradient>

            {/* Second hand — razor polished silver */}
            <linearGradient id="grad-second" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#222" />
                <stop offset="35%"  stopColor="#dddddd" />
                <stop offset="50%"  stopColor="#ffffff" />
                <stop offset="65%"  stopColor="#cccccc" />
                <stop offset="100%" stopColor="#222" />
            </linearGradient>

            {/* Pinion cap — convex mirror chrome */}
            <radialGradient id="grad-cap" cx="30%" cy="25%" r="65%">
                <stop offset="0%"   stopColor="#ffffff" />
                <stop offset="25%"  stopColor="#d0d0d0" />
                <stop offset="55%"  stopColor="#777" />
                <stop offset="85%"  stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#000" />
            </radialGradient>

            {/* Sharp specular shimmer on hands */}
            <filter id="glow-hand" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Crisp luminance glow on hour markers */}
            <filter id="glow-marker" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
    );
}

// ---------------------------------------------------------------------------
// Outer tick ring — THREE distinct tiers:
//   • Quarter (12/3/6/9) — tallest & thickest
//   • Hour   (other 8)   — medium
//   • Minute (remaining) — shortest & thinnest
// ---------------------------------------------------------------------------
function DialTicks() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
        >
            <ClockDefs />
            {Array.from({ length: 60 }).map((_, i) => {
                const isQuarter = i % 15 === 0;              // 12, 3, 6, 9
                const isHour    = !isQuarter && i % 5 === 0;  // other 8 hours

                const outerR = 96;
                // Three visually distinct inner radii
                const innerR = isQuarter ? 81   // 15 units long
                             : isHour    ? 87   //  9 units long
                             :             93;  //  3 units long

                const stroke = isQuarter ? "rgba(255,255,255,1.00)"
                             : isHour    ? "rgba(255,255,255,0.72)"
                             :             "rgba(255,255,255,0.28)";

                const width  = isQuarter ? 2.6
                             : isHour    ? 1.5
                             :             0.7;

                const angle = (i * 6 - 90) * (Math.PI / 180);
                const x1 = 100 + outerR * Math.cos(angle);
                const y1 = 100 + outerR * Math.sin(angle);
                const x2 = 100 + innerR * Math.cos(angle);
                const y2 = 100 + innerR * Math.sin(angle);

                return (
                    <line
                        key={i}
                        x1={x1} y1={y1}
                        x2={x2} y2={y2}
                        stroke={stroke}
                        strokeWidth={width}
                        strokeLinecap="round"
                    />
                );
            })}
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Outer minute number labels — one per 5-minute mark, rotated to read upright
// ---------------------------------------------------------------------------
function MinuteLabels() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
        >
            {Array.from({ length: 12 }).map((_, i) => {
                const minute   = i * 5;           // 0, 5, 10 … 55
                const label    = minute === 0 ? "60" : String(minute).padStart(2, "0");
                const angleDeg = i * 30 - 90;     // 12 o'clock = -90°
                const angleRad = angleDeg * (Math.PI / 180);
                // Sit just inside the tick marks (outerR = 95) → place at r ≈ 83
                const r = 83;
                const x = 100 + r * Math.cos(angleRad);
                const y = 100 + r * Math.sin(angleRad);

                return (
                    <text
                        key={minute}
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="5.8"
                        fontFamily="'Inter', 'SF Pro Display', sans-serif"
                        fontWeight="300"
                        letterSpacing="0.6"
                        fill="rgba(255,255,255,0.38)"
                    >
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Inner 24-hour number ring
// ---------------------------------------------------------------------------
function InnerRing() {
    // All 12 even hours, one every 30°, starting at 12 o'clock = "24"
    const labels = [
        { label: "24", angleDeg:   0 },
        { label: "02", angleDeg:  30 },
        { label: "04", angleDeg:  60 },
        { label: "06", angleDeg:  90 },
        { label: "08", angleDeg: 120 },
        { label: "10", angleDeg: 150 },
        { label: "12", angleDeg: 180 },
        { label: "14", angleDeg: 210 },
        { label: "16", angleDeg: 240 },
        { label: "18", angleDeg: 270 },
        { label: "20", angleDeg: 300 },
        { label: "22", angleDeg: 330 },
    ];

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
        >
            {/* Subtle inner circle track */}
            <circle
                cx="100" cy="100" r="71"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
            />
            {labels.map(({ label, angleDeg }) => {
                const rad = (angleDeg - 90) * (Math.PI / 180);
                const x   = 100 + 71 * Math.cos(rad);
                const y   = 100 + 71 * Math.sin(rad);
                return (
                    <text
                        key={label}
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="6.5"
                        fontFamily="'Inter', 'SF Pro Display', sans-serif"
                        fontWeight="300"
                        fill="rgba(255,255,255,0.38)"
                        letterSpacing="0.8"
                    >
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Baton hour markers — slim white rectangles with a luminance glow
// ---------------------------------------------------------------------------
function HourMarkers() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
        >
            {Array.from({ length: 12 }).map((_, i) => {
                const angleDeg = i * 30 - 90;
                const angleRad = angleDeg * (Math.PI / 180);
                const isQuarter = i % 3 === 0; // 12, 3, 6, 9
                const isTwelve  = i === 0;

                const w      = isTwelve ? 4 : isQuarter ? 3.5 : 2.6;
                const len    = isTwelve ? 15 : isQuarter ? 14  : 11;
                const outerR = 84;
                const innerR = outerR - len;

                const x1 = 100 + outerR * Math.cos(angleRad);
                const y1 = 100 + outerR * Math.sin(angleRad);
                const x2 = 100 + innerR * Math.cos(angleRad);
                const y2 = 100 + innerR * Math.sin(angleRad);

                return (
                    <line
                        key={i}
                        x1={x1} y1={y1}
                        x2={x2} y2={y2}
                        stroke="rgba(255,255,255,0.92)"
                        strokeWidth={w}
                        strokeLinecap="butt"
                        filter="url(#glow-marker)"
                    />
                );
            })}
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Hands — luxury Dauphine pointed hands (polygon shapes)
// ---------------------------------------------------------------------------
interface HandsProps {
    hourRef:   React.RefObject<SVGGElement | null>;
    minuteRef: React.RefObject<SVGGElement | null>;
    secondRef: React.RefObject<SVGGElement | null>;
}

function Hands({ hourRef, minuteRef, secondRef }: HandsProps) {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
        >
            {/*
                HOUR HAND — Dauphine diamond:
                Sharp tip at top, bulges to shoulder ~⅔ down,
                necks back to pivot, tiny pointed tail stub below.
                All coords relative to centre = (100, 100).
            */}
            <g ref={hourRef} style={{ transformOrigin: "100px 100px" }}>
                {/* Depth shadow — offset clone */}
                <polygon
                    points="100,45 106,68 103.2,94 101.8,112 100,115 98.2,112 96.8,94 94,68"
                    fill="rgba(0,0,0,0.55)"
                    transform="translate(0.6, 1)"
                />
                {/* Main body */}
                <polygon
                    points="100,45 106,68 103.2,94 101.8,112 100,115 98.2,112 96.8,94 94,68"
                    fill="url(#grad-hour)"
                />
                {/* Faceted centre-ridge highlight — slim inner diamond */}
                <polygon
                    points="100,45 101,70 100.5,94 100.2,113 100,115 99.8,113 99.5,94 99,70"
                    fill="rgba(255,255,255,0.28)"
                />
                {/* Thin hair-line spine for the 3D raised-edge illusion */}
                <line x1="100" y1="45" x2="100" y2="113"
                    stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
            </g>

            {/*
                MINUTE HAND — slim Dauphine:
                Longer and narrower than hour, same diamond taper.
            */}
            <g ref={minuteRef} style={{ transformOrigin: "100px 100px" }}>
                {/* Depth shadow */}
                <polygon
                    points="100,27 103.2,62 101.5,94 100.9,117 100,120 99.1,117 98.5,94 96.8,62"
                    fill="rgba(0,0,0,0.55)"
                    transform="translate(0.5, 1)"
                />
                {/* Main body */}
                <polygon
                    points="100,27 103.2,62 101.5,94 100.9,117 100,120 99.1,117 98.5,94 96.8,62"
                    fill="url(#grad-minute)"
                />
                {/* Faceted ridge */}
                <polygon
                    points="100,27 100.8,64 100.4,94 100.2,118 100,120 99.8,118 99.6,94 99.2,64"
                    fill="rgba(255,255,255,0.24)"
                />
                {/* Spine */}
                <line x1="100" y1="27" x2="100" y2="118"
                    stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
            </g>

            {/*
                SECOND HAND — razor needle:
                Paper-thin shaft tapering to a needle point.
                Small teardrop counterweight below pivot.
            */}
            <g ref={secondRef} style={{ transformOrigin: "100px 100px" }}>
                {/* Main needle shaft — tapers from 0 at tip to 1px at pivot */}
                <polygon
                    points="100,30 100.5,82 100,95 99.5,82"
                    fill="url(#grad-second)"
                />
                {/* Counterweight tail — wider teardrop */}
                <polygon
                    points="100,95 101.2,108 100,124 98.8,108"
                    fill="url(#grad-second)"
                    opacity="0.85"
                />
                {/* Specular streak along needle */}
                <line x1="100" y1="30" x2="100" y2="90"
                    stroke="rgba(255,255,255,0.45)" strokeWidth="0.3" />
            </g>

            {/* ── Pinion cap — multi-layer mirror chrome ─────────── */}
            {/* Outer ring */}
            <circle cx="100" cy="100" r="6.5"
                fill="url(#grad-cap)"
                stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            {/* Dark recess */}
            <circle cx="100" cy="100" r="3.2" fill="#080808" />
            {/* Inner chrome dot */}
            <circle cx="100" cy="100" r="1.8"
                fill="url(#grad-cap)" />
            {/* Specular highlight */}
            <circle cx="98.6" cy="98.4" r="1" fill="rgba(255,255,255,0.70)" />
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function Clock() {
    const hourHandRef   = useRef<SVGGElement>(null);
    const minuteHandRef = useRef<SVGGElement>(null);
    const secondHandRef = useRef<SVGGElement>(null);
    const rafRef        = useRef<number | null>(null);

    useEffect(() => {
        const tick = () => {
            const now     = new Date();
            const hours   = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const millis  = now.getMilliseconds();

            const hourDeg   = (hours % 12 + minutes / 60) * 30;
            const minuteDeg = (minutes + seconds / 60) * 6;
            const secondDeg = (seconds + millis / 1000) * 6; // smooth sweep

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
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full rounded-full flex items-center justify-center"
            style={{
                /* Outermost housing — true black with micro rim catch-light */
                background: "radial-gradient(circle at 36% 26%, #1c1c1c 0%, #060606 40%, #000000 100%)",
                boxShadow: `
                    0 0 0 1px   rgba(255,255,255,0.18),
                    0 0 0 2.5px rgba(0,0,0,1),
                    0 0 0 4px   rgba(255,255,255,0.05),
                    0 24px 80px rgba(0,0,0,1),
                    0 8px  32px rgba(0,0,0,0.9),
                    inset 0 2px 4px rgba(255,255,255,0.18),
                    inset 0 -2px 4px rgba(0,0,0,1)
                `,
            }}
        >
            {/* ── Bezel ring — conic brushed gunmetal ──────────────── */}
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    inset: "1.5%",
                    background: `conic-gradient(
                        from 108deg,
                        #050505  0%,
                        #505050 10%,
                        #0a0a0a 22%,
                        #686868 33%,
                        #080808 44%,
                        #555555 55%,
                        #060606 66%,
                        #606060 77%,
                        #080808 88%,
                        #484848 94%,
                        #050505 100%
                    )`,
                    boxShadow: `
                        inset 0 0 0 1px rgba(255,255,255,0.12),
                        inset 0 1px 2px rgba(255,255,255,0.08),
                        0 0 20px rgba(0,0,0,0.9)
                    `,
                }}
            />

            {/* ── Dial glass reflection ring ────────────────────────── */}
            <div
                className="absolute rounded-full pointer-events-none z-10"
                style={{
                    inset: "4.5%",
                    background: `conic-gradient(
                        from 210deg,
                        rgba(255,255,255,0.045) 0%,
                        transparent 18%,
                        transparent 82%,
                        rgba(255,255,255,0.025) 100%
                    )`,
                }}
            />

            {/* ── Main dial face ────────────────────────────────────── */}
            <div
                className="absolute rounded-full overflow-hidden"
                style={{
                    inset: "5%",
                    /* Near-absolute black with a cold blue-black micro tint at centre */
                    background: `
                        radial-gradient(circle at 40% 34%, #0c0d0e 0%, #050506 38%, #010101 100%)
                    `,
                    boxShadow: `
                        inset 0 0 80px rgba(0,0,0,1),
                        inset 0 0 20px rgba(0,0,0,0.95),
                        inset 0 4px 30px rgba(0,0,50,0.15)
                    `,
                }}
            >
                {/* Sapphire-glass gloss arc — brighter, more realistic */}
                <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                        background: `
                            radial-gradient(
                                ellipse 70% 38% at 50% 8%,
                                rgba(255,255,255,0.10) 0%,
                                rgba(255,255,255,0.03) 50%,
                                transparent 100%
                            )
                        `,
                    }}
                />

                <DialTicks />
                <MinuteLabels />
                <InnerRing />
                <HourMarkers />
                <Hands
                    hourRef={hourHandRef}
                    minuteRef={minuteHandRef}
                    secondRef={secondHandRef}
                />
            </div>
        </motion.div>
    );
}