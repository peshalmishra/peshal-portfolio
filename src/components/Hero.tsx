"use client";

import { motion } from "framer-motion";
import { ConnectCard } from "./ConnectCard";
import { Clock } from "./Clock";
import { Globe } from "./Globe";
import { Github, Linkedin, Twitter, MapPin, Layers } from "lucide-react";
import { Skills } from "./Skills";

// ---------------------------------------------------------------------------
// CLOCK SIZING — single source of truth.
//
// The clock diameter must equal --mask-radius × 2 in globals.css so the
// circular notch carved into the cards matches the clock edge perfectly.
//
//   md  breakpoint: clock = 14rem (w-56)  → mask-radius = 7rem  + 4px gap
//   lg  breakpoint: clock = 18rem (w-72)  → mask-radius = 9rem  + 4px gap
//   xl  breakpoint: clock = 22rem         → mask-radius = 11rem + 4px gap
//
// The +4px gap gives a hair of breathing room so the clock sits in the void
// without touching the card edges — matches the reference exactly.
// ---------------------------------------------------------------------------

interface HeroProps {
    isLoaded?: boolean;
}

const FADE_UP = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0  },
};

const VIEWPORT = { once: true, margin: "-80px" as const };

function SocialLink({
    href,
    label,
    children,
}: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-neutral-500 hover:text-white transition-colors duration-200"
        >
            {children}
        </a>
    );
}

export function Hero({ isLoaded = true }: HeroProps) {
    if (!isLoaded) return null;

    return (
        <section id="home" className="w-full flex flex-col items-center overflow-x-hidden text-white">

            {/* ── Hero typography ─────────────────────────────────────────── */}
            <div className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 w-full min-h-screen">
                <div className="z-10 text-center max-w-7xl mx-auto w-full flex flex-col items-center">
                    <motion.h1
                        variants={FADE_UP}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-[4.5rem] sm:text-[7rem] md:text-[10rem] lg:text-[14rem] font-bold tracking-tighter text-[#111] dark:text-[#EAEAEA] leading-[0.8] w-full uppercase"
                    >
                        PESHAL{" "}
                        <span className="lg:hidden"><br /></span>
                    </motion.h1>

                    <motion.div
                        variants={FADE_UP}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="mt-12 md:mt-16 flex flex-col items-center space-y-4 md:space-y-6"
                    >
                        <p className="text-[10px] md:text-sm tracking-[0.35em] font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                            Full Stack Developer focused on
                        </p>
                        <p className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-[#111] dark:text-[#EAEAEA] font-light tracking-tight">
                            scalable cloud architecture.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute bottom-8 left-6 md:bottom-12 md:left-12 flex flex-col items-center md:items-start"
                >
                    <div className="mb-3 w-8 h-8 rounded-full border border-green-500/30 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-[#111] dark:text-[#EAEAEA] tracking-wider uppercase">
                        BASED IN Phagwara, Punjab<br />
                        <span className="text-neutral-500 font-medium">INDIA</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute bottom-8 right-6 md:bottom-12 md:right-12 flex flex-col items-center md:items-end"
                >
                    <div className="mb-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-[#111] dark:text-[#EAEAEA] tracking-wider uppercase text-right">
                        Aspiring FULL STACK DEV,<br />
                        <span className="text-neutral-500 font-medium">& Cloud Engineer</span>
                    </p>
                </motion.div>
            </div>

            {/* ── Bento grid ──────────────────────────────────────────────── */}
            <div className="w-full max-w-[1400px] px-4 sm:px-6 md:px-8 pb-32 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

                {/* ── Row 1 ── */}

                {/* Profile card */}
                <motion.div
                    variants={FADE_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEWPORT}
                    transition={{ duration: 0.7 }}
                    className="bento-card md:col-span-3 rounded-[2rem] bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/5 flex flex-col p-6 sm:p-8 overflow-hidden min-h-[360px]"
                >
                    <div className="flex justify-between items-start mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-black dark:text-white">
                            Peshal{" "}
                            <span className="font-light italic text-neutral-400">Mishra</span>
                        </h2>
                        <div className="flex items-center space-x-1.5 text-neutral-400 opacity-60">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[10px] tracking-wider uppercase">India</span>
                        </div>
                    </div>

                    {/* Three-photo strip */}
                    <div className="flex-1 flex items-center justify-center mb-6">
                        <div className="flex items-end gap-2">
                            {/* Photo 1 — formal suit, tilted left */}
                            <div className="w-20 h-28 rounded-xl shadow-lg overflow-hidden flex-shrink-0 -rotate-3">
                                <img
                                    src="/peshal-1.jpg"
                                    alt="Peshal Mishra formal"
                                    className="w-full h-full object-cover object-top"
                                    draggable={false}
                                />
                            </div>
                            {/* Photo 3 — black blazer, center, taller */}
                            <div className="w-24 h-32 rounded-xl shadow-xl overflow-hidden flex-shrink-0">
                                <img
                                    src="/peshal-3.jpg"
                                    alt="Peshal Mishra blazer"
                                    className="w-full h-full object-cover object-top"
                                    draggable={false}
                                />
                            </div>
                            {/* Photo 2 — casual mirror, tilted right */}
                            <div className="w-20 h-28 rounded-xl shadow-lg overflow-hidden flex-shrink-0 rotate-3">
                                <img
                                    src="/peshal-2.jpg"
                                    alt="Peshal Mishra casual"
                                    className="w-full h-full object-cover object-top"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-6 mt-auto">
                        <SocialLink href="https://linkedin.com/in/peshalmishra" label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </SocialLink>
                        <SocialLink href="https://github.com/peshalmishra" label="GitHub">
                            <Github className="w-5 h-5" />
                        </SocialLink>
                        <SocialLink href="https://twitter.com/peshalmishra" label="Twitter / X">
                            <Twitter className="w-5 h-5" />
                        </SocialLink>
                    </div>
                </motion.div>

                {/*
                    Tagline card — cutout-top carves a semicircle from its bottom
                    center edge. The clock sits in that void.
                    Bottom padding is sized so text never slides under the clock.
                    At md: clock radius = 7rem → pb-[8rem] gives comfortable clearance.
                    At lg: clock radius = 9rem → pb-[10rem].
                    At xl: clock radius = 11rem → pb-[12rem].
                */}
                <motion.div
                    variants={FADE_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEWPORT}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="bento-card md:col-span-6 relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/5 p-8 md:p-12 flex flex-col justify-between cutout-top min-h-[360px]"
                >
                    <div className="flex justify-between items-start opacity-60 relative z-20">
                        <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-neutral-500 dark:text-neutral-400">
                            Detail-driven Backend
                        </span>
                        <div className="flex space-x-2">
                            <span className="px-3 py-1 text-[10px] rounded-full border border-neutral-300 dark:border-white/10 text-neutral-600 dark:text-white/70">Cloud</span>
                            <span className="px-3 py-1 text-[10px] rounded-full border border-neutral-300 dark:border-white/10 text-neutral-600 dark:text-white/70">Architecture</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 pb-[8rem] md:pb-[8rem] lg:pb-[10rem] xl:pb-[12rem] relative z-10 max-w-[85%]">
                        <h3 className="text-[2.5rem] sm:text-[3.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tighter leading-[0.85] text-black dark:text-white">
                            Scalable <br />
                            <span className="font-serif italic font-light text-neutral-400 leading-none">systems.</span>
                        </h3>
                        <p className="mt-4 text-[11px] sm:text-xs md:text-sm text-neutral-400 max-w-xs leading-relaxed">
                            I sweat spacing, timing, and security — the tiny stuff that makes applications bulletproof.
                        </p>
                    </div>
                </motion.div>

                {/* Connect card */}
                <motion.div
                    variants={FADE_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEWPORT}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="bento-card md:col-span-3 rounded-[2rem] overflow-hidden"
                >
                    <ConnectCard />
                </motion.div>

                {/* ── Row 2 — Globe + Clock + Right panel ─────────────────── */}
                <motion.div
                    variants={FADE_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEWPORT}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="md:col-span-12 relative"
                >
                    {/*
                        Inner card — cutout-bottom carves a semicircle from its top
                        center edge, matching the clock from above.
                        Top padding on content inside must clear the notch.
                        At md: clock radius = 7rem → pt-[8rem] gives clearance.
                        At lg: 9rem → pt-[10rem]. At xl: 11rem → pt-[12rem].
                    */}
                    <div className="bento-card w-full rounded-[2rem] bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/5 relative flex flex-col md:flex-row overflow-hidden cutout-bottom">

                        {/* ── Left: Globe panel ──────────────────────────── */}
                        <div className="relative flex-1 overflow-hidden min-h-[480px] pt-[8rem] md:pt-[8rem] lg:pt-[10rem] xl:pt-[12rem]">

                            {/* Text — pushed below the notch clearance */}
                            <div className="relative z-10 px-6 sm:px-10">
                                <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                    Available Globally
                                </span>
                                <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
                                    Adaptable across <br /> time zones
                                </h3>
                            </div>

                            {/* Globe — bleeds bottom-left, intentionally oversized */}
                            <div
                                className="absolute pointer-events-none"
                                style={{
                                    bottom:      "-20%",
                                    left:        "-12%",
                                    width:       "80%",
                                    opacity:     0.9,
                                    mixBlendMode:"screen",
                                }}
                            >
                                <Globe />
                            </div>

                            {/* Country pills — bottom right */}
                            <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-2">
                                <span className="px-4 py-1.5 text-[10px] rounded-full border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 bg-white/70 dark:bg-black/50 backdrop-blur-sm">
                                    GB UK
                                </span>
                                <span className="px-4 py-1.5 text-[10px] rounded-full border border-[#f5592e]/40 text-[#f5592e] bg-[#f5592e]/10 font-bold">
                                    IN India
                                </span>
                                <span className="px-4 py-1.5 text-[10px] rounded-full border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 bg-white/70 dark:bg-black/50 backdrop-blur-sm">
                                    US USA
                                </span>
                            </div>

                            {/* Remote / India badge — bottom left */}
                            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                <div>
                                    <p className="text-[9px] tracking-widest text-neutral-500 uppercase font-medium leading-none">Remote</p>
                                    <p className="text-sm font-bold text-black dark:text-white tracking-tight">India</p>
                                </div>
                            </div>
                        </div>

                        {/* Vertical divider */}
                        <div className="hidden md:block w-px bg-neutral-200 dark:bg-white/5 self-stretch" />

                        {/* ── Right: Projects / work panel ───────────────── */}
                        <div className="flex-1 flex flex-col justify-between text-black dark:text-white min-h-[480px] pt-[8rem] md:pt-[8rem] lg:pt-[10rem] xl:pt-[12rem] px-6 sm:px-10 pb-10">

                            <div>
                                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                    Explorer of{" "}
                                    <span className="font-serif italic bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                                        Tech
                                    </span>
                                </h3>
                                <p className="text-[10px] text-neutral-500 font-mono mt-2">
                                    &lt; Crafting Digital Experiences /&gt;
                                </p>
                            </div>

                            {/* Three iPhone mockups — staggered with rich tech UI content */}
                            <div className="flex items-end justify-end gap-3 mt-8 overflow-hidden">

                                {/* Left phone — analytics dashboard */}
                                <div className="w-28 h-48 flex-shrink-0 rounded-[18px] bg-[#0d0d0d] border border-white/10 shadow-xl overflow-hidden translate-y-6 flex flex-col"
                                    style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                                    <div className="h-5 bg-black flex items-center justify-between px-3 flex-shrink-0">
                                        <span className="text-[6px] text-white/60 font-medium">9:41</span>
                                        <div className="w-2.5 h-1.5 rounded-sm border border-white/40 flex items-center justify-end pr-px flex-shrink-0">
                                            <div className="w-1.5 h-1 rounded-sm bg-white/60" />
                                        </div>
                                    </div>
                                    <div className="px-2.5 pt-2 pb-1 flex-shrink-0">
                                        <div className="text-[6px] text-white/30 font-mono uppercase tracking-widest">Dashboard</div>
                                        <div className="text-[9px] text-white font-bold mt-0.5">Analytics</div>
                                    </div>
                                    <div className="px-2 flex gap-1.5 flex-shrink-0">
                                        <div className="flex-1 bg-indigo-500/20 rounded-lg p-1.5 border border-indigo-500/20">
                                            <div className="text-[5px] text-indigo-300/70">Requests</div>
                                            <div className="text-[8px] text-indigo-300 font-bold mt-0.5">2.4M</div>
                                        </div>
                                        <div className="flex-1 bg-emerald-500/20 rounded-lg p-1.5 border border-emerald-500/20">
                                            <div className="text-[5px] text-emerald-300/70">Uptime</div>
                                            <div className="text-[8px] text-emerald-300 font-bold mt-0.5">99.9%</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 px-2.5 pt-2 flex flex-col justify-end pb-2">
                                        <div className="text-[5px] text-white/20 mb-1 font-mono">TRAFFIC 7D</div>
                                        <div className="flex items-end gap-0.5 h-10">
                                            {[40,65,45,80,55,90,70].map((h,i) => (
                                                <div key={i} className="flex-1 rounded-sm bg-indigo-500/60" style={{ height:`${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Center phone — cloud deploy UI (tallest, hero) */}
                                <div className="w-36 h-64 flex-shrink-0 rounded-[20px] bg-[#080808] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                                    style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                                    <div className="h-5 bg-black flex items-center justify-between px-3 flex-shrink-0">
                                        <span className="text-[6px] text-white/60 font-medium">9:41</span>
                                        <div className="w-10 h-3 bg-black rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        </div>
                                        <div className="w-2.5 h-1.5 rounded-sm border border-white/40 flex items-center justify-end pr-px flex-shrink-0">
                                            <div className="w-1.5 h-1 rounded-sm bg-white/60" />
                                        </div>
                                    </div>
                                    <div className="px-3 pt-2.5 pb-2 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
                                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[6px] text-white font-black">☁</span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[8px] text-white font-semibold leading-none">CloudDeploy</div>
                                            <div className="text-[6px] text-white/30 mt-0.5">Production</div>
                                        </div>
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow:"0 0 4px #34d399" }} />
                                    </div>
                                    <div className="px-3 pt-2 flex-shrink-0">
                                        <div className="text-[6px] text-white/30 uppercase tracking-widest font-mono">Latest Deploy</div>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                            <span className="text-[7px] text-emerald-400 font-mono font-medium">Live · v2.4.1</span>
                                        </div>
                                        <div className="text-[5px] text-white/20 mt-0.5 font-mono">2 mins ago · main</div>
                                    </div>
                                    <div className="px-3 pt-2 flex flex-col gap-1.5 flex-shrink-0">
                                        {[
                                            { label:"Build",  color:"bg-emerald-400" },
                                            { label:"Test",   color:"bg-emerald-400" },
                                            { label:"Deploy", color:"bg-blue-400"    },
                                            { label:"Health", color:"bg-emerald-400" },
                                        ].map((s) => (
                                            <div key={s.label} className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.color}`} />
                                                <span className="text-[6px] text-white/40 font-mono">{s.label}</span>
                                                <div className="flex-1 h-px bg-white/5" />
                                                <span className="text-[6px] text-white/20">✓</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-1 px-3 pt-2 flex flex-col justify-end pb-3">
                                        <div className="grid grid-cols-3 gap-1">
                                            {[
                                                { label:"CPU", val:"12%",  color:"text-blue-300"    },
                                                { label:"MEM", val:"2.1G", color:"text-violet-300"  },
                                                { label:"REQ", val:"840/s",color:"text-emerald-300" },
                                            ].map((m) => (
                                                <div key={m.label} className="rounded-lg p-1.5 border border-white/5" style={{ background:"rgba(255,255,255,0.03)" }}>
                                                    <div className="text-[5px] text-white/25 font-mono">{m.label}</div>
                                                    <div className={`text-[7px] font-bold mt-0.5 ${m.color}`}>{m.val}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right phone — API explorer, rotated */}
                                <div className="w-28 h-52 flex-shrink-0 rounded-[18px] bg-[#0a0a0a] border border-white/10 shadow-xl overflow-hidden -translate-y-2 rotate-[2deg] flex flex-col"
                                    style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                                    <div className="h-5 bg-black flex items-center justify-between px-3 flex-shrink-0">
                                        <span className="text-[6px] text-white/60 font-medium">9:41</span>
                                        <div className="w-2.5 h-1.5 rounded-sm border border-white/40 flex items-center justify-end pr-px flex-shrink-0">
                                            <div className="w-1.5 h-1 rounded-sm bg-white/60" />
                                        </div>
                                    </div>
                                    <div className="px-2.5 pt-2 pb-1.5 border-b border-white/5 flex-shrink-0">
                                        <div className="text-[5px] text-white/25 font-mono uppercase tracking-widest">API Gateway</div>
                                        <div className="text-[8px] text-white font-semibold mt-0.5">Endpoints</div>
                                    </div>
                                    <div className="flex-1 flex flex-col px-2 pt-1.5 gap-1 overflow-hidden">
                                        {[
                                            { method:"GET",    path:"/users",  color:"text-emerald-400 bg-emerald-400/10" },
                                            { method:"POST",   path:"/deploy", color:"text-blue-400 bg-blue-400/10"       },
                                            { method:"PUT",    path:"/config", color:"text-amber-400 bg-amber-400/10"     },
                                            { method:"DELETE", path:"/cache",  color:"text-red-400 bg-red-400/10"         },
                                        ].map((ep) => (
                                            <div key={ep.path} className="flex items-center gap-1.5 rounded-md p-1 border border-white/5" style={{ background:"rgba(255,255,255,0.02)" }}>
                                                <span className={`text-[5px] font-black px-1 py-0.5 rounded font-mono flex-shrink-0 ${ep.color}`}>
                                                    {ep.method}
                                                </span>
                                                <span className="text-[6px] text-white/35 font-mono truncate">{ep.path}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-2.5 pb-2.5 pt-1.5 flex items-center gap-2 border-t border-white/5 flex-shrink-0">
                                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
                                            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                                        </div>
                                        <span className="text-[6px] text-white/25 font-mono flex-shrink-0">124ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*
                        Clock — centered on the gap between row 1 and row 2.
                        Positioned absolute relative to the row-2 motion.div wrapper.
                        top-0 + -translate-y-1/2 = sits exactly half above, half below
                        the top edge of the bottom card, which aligns with the bottom
                        edge of the top card — perfect for the cutout notches.

                        Sizes must match --mask-radius × 2 in globals.css:
                          md  → w-56  h-56  (14rem) — mask-radius: calc(7rem  + 4px)
                          lg  → w-72  h-72  (18rem) — mask-radius: calc(9rem  + 4px)
                          xl  → w-[22rem]   (22rem) — mask-radius: calc(11rem + 4px)
                    */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block w-56 h-56 lg:w-72 lg:h-72 xl:w-[22rem] xl:h-[22rem]">
                        <Clock />
                    </div>

                    {/* Mobile clock — inline below content */}
                    <div className="w-36 h-36 mx-auto mt-6 relative z-30 md:hidden">
                        <Clock />
                    </div>
                </motion.div>
            </div>

            {/* ── Skills section ──────────────────────────────────────────── */}
            <Skills />

        </section>
    );
}