"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Nav columns — matching the reference layout
// ---------------------------------------------------------------------------

const NAV = [
    {
        heading: "General",
        links: [
            { label: "Home",      href: "/#home"     },
            { label: "Skills",    href: "/#skills"   },
            { label: "Work",      href: "/#projects" },
            { label: "Blogs",     href: "/blog"      },
        ],
    },
    {
        heading: "About",
        links: [
            { label: "About Me",  href: "/about"    },
            { label: "Projects",  href: "/#projects" },
            { label: "Contact",   href: "/#contact"  },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy Policy",     href: "/privacy" },
            { label: "Terms & Conditions", href: "/terms"   },
        ],
    },
];

// ---------------------------------------------------------------------------
// Wavy morphing blob orb
// ---------------------------------------------------------------------------

// Each keyframe is a different organic blob shape via border-radius
// Using the 8-value border-radius syntax: tl-x tl-y / tr-x tr-y / br-x br-y / bl-x bl-y
const BLOB_SHAPES = [
    "60% 40% 70% 30% / 50% 60% 40% 50%",
    "40% 60% 30% 70% / 60% 40% 60% 40%",
    "70% 30% 50% 50% / 40% 70% 30% 60%",
    "30% 70% 60% 40% / 70% 30% 50% 50%",
    "50% 50% 40% 60% / 30% 60% 70% 40%",
    "60% 40% 70% 30% / 50% 60% 40% 50%",
];

function GlowOrb() {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="absolute top-8 right-8 sm:top-12 sm:right-12 cursor-pointer"
            style={{ width: 160, height: 160 }}
        >
            {/* Outer ambient glow — steady, no flicker */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    opacity: hovered ? 0.8 : 0.35,
                    scale:   hovered ? 1.2  : 1,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                    borderRadius: "50%",
                    background:   "radial-gradient(circle, rgba(129,140,248,0.4) 0%, rgba(192,132,252,0.2) 40%, transparent 70%)",
                    filter:       "blur(20px)",
                }}
            />

            {/* Main blob — round in idle, wavy on hover */}
            <motion.div
                className="absolute inset-4"
                animate={{
                    borderRadius: hovered ? BLOB_SHAPES : "50%",
                    rotate:       hovered ? [0, 360]    : 0,
                    scale:        hovered ? 1.08         : 1,
                }}
                transition={{
                    borderRadius: {
                        duration: hovered ? 2.5 : 0.6,
                        repeat:   hovered ? Infinity : 0,
                        ease:     "easeInOut",
                        times:    hovered ? [0, 0.2, 0.4, 0.6, 0.8, 1] : undefined,
                    },
                    rotate: {
                        duration: 6,
                        repeat:   hovered ? Infinity : 0,
                        ease:     "linear",
                    },
                    scale: { duration: 0.6, ease: "easeInOut" },
                }}
                style={{
                    background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)",
                    opacity:    hovered ? 0.9 : 0.7,
                }}
            />

            {/* Border ring — round in idle, morphs on hover, no flicker */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    borderRadius: hovered ? BLOB_SHAPES : "50%",
                    rotate:       hovered ? [0, -360]   : 0,
                    boxShadow:    hovered
                        ? "0 0 40px rgba(129,140,248,0.6), 0 0 80px rgba(192,132,252,0.3)"
                        : "0 0 20px rgba(129,140,248,0.3)",
                }}
                transition={{
                    borderRadius: {
                        duration: hovered ? 2.5 : 0.6,
                        repeat:   hovered ? Infinity : 0,
                        ease:     "easeInOut",
                        times:    hovered ? [0, 0.2, 0.4, 0.6, 0.8, 1] : undefined,
                    },
                    rotate: {
                        duration: 8,
                        repeat:   hovered ? Infinity : 0,
                        ease:     "linear",
                    },
                    boxShadow: { duration: 0.6, ease: "easeInOut" },
                }}
                style={{
                    border:     "2px solid transparent",
                    background: "linear-gradient(#050505, #050505) padding-box, linear-gradient(135deg, #818cf8, #c084fc, #38bdf8) border-box",
                }}
            />
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export function Footer() {
    return (
        <footer className="w-full bg-[#050505] text-white overflow-hidden">

            {/* ── Top CTA section ─────────────────────────────────────────── */}
            <div className="relative px-6 md:px-12 lg:px-20 pt-24 pb-16 flex flex-col items-start gap-6">

                {/* Profile avatar + heading row */}
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 bg-neutral-800">
                        <img
                            src="/peshal-2.jpg"
                            alt="Peshal Mishra"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    {/* Large CTA heading */}
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[clamp(2.5rem,8vw,7rem)] font-black tracking-tighter leading-none text-white"
                    >
                        Let&apos;s create
                    </motion.h2>
                </div>

                {/* Second line — faded */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-[clamp(2.5rem,8vw,7rem)] font-black tracking-tighter leading-none text-white/20 -mt-4"
                >
                    something real.
                </motion.p>

                {/* Wavy morphing glow orb — top right */}
                <GlowOrb />
            </div>

            {/* ── Card section — name + nav columns ──────────────────────── */}
            <div className="mx-4 md:mx-8 mb-6 rounded-[2rem] bg-[#0f0f0f] border border-white/5 p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">

                    {/* Left — name + tagline */}
                    <div className="lg:w-72 flex-shrink-0 space-y-4">
                        <p className="text-3xl font-black tracking-tight text-white uppercase">
                            PESHAL<br />MISHRA
                        </p>
                        <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                            Building digital experiences that matter, one line of code at a time.
                            Crafting interfaces that feel alive, solving problems that make a difference,
                            and turning ideas into reality. Every pixel has a purpose.
                        </p>
                    </div>

                    {/* Right — nav columns */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {NAV.map((col) => (
                            <div key={col.heading} className="space-y-4">
                                <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                                    {col.heading}
                                </p>
                                <ul className="space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ──────────────────────────────────────────────── */}
            <div className="px-8 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 text-xs text-neutral-500">
                <p>© {new Date().getFullYear()} Peshal Mishra. All rights reserved.</p>
                <p>Built with Next.js, Framer Motion, and Tailwind CSS.</p>
            </div>
        </footer>
    );
}