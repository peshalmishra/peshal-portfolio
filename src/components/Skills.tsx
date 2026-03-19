"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Skill categories
// ---------------------------------------------------------------------------

const CATEGORIES = [
    {
        name: "Frontend",
        icon: "⌥",
        color: "#818cf8",
        skills: [
            { name: "ReactJS",      icon: "⚛️" },
            { name: "NextJS",       icon: "▲"  },
            { name: "TypeScript",   icon: "TS" },
            { name: "Tailwind CSS", icon: "~"  },
            { name: "Framer Motion",icon: "◈"  },
            { name: "HTML / CSS",   icon: "🌐" },
        ],
    },
    {
        name: "Backend",
        icon: "⚙",
        color: "#34d399",
        skills: [
            { name: "NodeJS",    icon: "⬡"  },
            { name: "ExpressJS", icon: "EX" },
            { name: "Go",        icon: "Go" },
            { name: "Java",      icon: "☕" },
            { name: "GraphQL",   icon: "◉"  },
            { name: "REST APIs", icon: "⇄"  },
        ],
    },
    {
        name: "Databases",
        icon: "🗄",
        color: "#60a5fa",
        skills: [
            { name: "PostgreSQL", icon: "🐘" },
            { name: "MongoDB",    icon: "🍃" },
            { name: "Redis",      icon: "⚡" },
            { name: "DynamoDB",   icon: "◆"  },
            { name: "Prisma",     icon: "◭"  },
            { name: "Kafka",      icon: "📨" },
        ],
    },
    {
        name: "Cloud & DevOps",
        icon: "☁",
        color: "#fb923c",
        skills: [
            { name: "AWS",        icon: "☁️" },
            { name: "Docker",     icon: "🐳" },
            { name: "Kubernetes", icon: "⎈"  },
            { name: "Terraform",  icon: "◈"  },
            { name: "CI/CD",      icon: "⟳"  },
            { name: "Linux",      icon: "🐧" },
        ],
    },
    {
        name: "Tools & Misc",
        icon: "🔧",
        color: "#f472b6",
        skills: [
            { name: "Git",     icon: "◎"  },
            { name: "GitHub",  icon: "⊙"  },
            { name: "Vercel",  icon: "▲"  },
            { name: "Sanity",  icon: "S"  },
            { name: "Clerk",   icon: "🔑" },
            { name: "Expo",    icon: "✦"  },
        ],
    },
];

// ---------------------------------------------------------------------------
// Background HUD wheel — rotates on scroll
// ---------------------------------------------------------------------------

function HudWheel() {
    const wheelRef    = useRef<SVGSVGElement>(null);
    const rotationRef = useRef(0);
    const targetRef   = useRef(0);
    const rafRef      = useRef<number | null>(null);
    const lastScrollY = useRef(0);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const mq    = window.matchMedia("(prefers-color-scheme: dark)");
        const check = () =>
            setIsDark(document.documentElement.classList.contains("dark") || mq.matches);
        check();
        mq.addEventListener("change", check);
        const obs = new MutationObserver(check);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        const onScroll = () => {
            const delta = window.scrollY - lastScrollY.current;
            lastScrollY.current = window.scrollY;
            targetRef.current += delta * 0.18;
        };
        const tick = () => {
            rotationRef.current += (targetRef.current - rotationRef.current) * 0.06;
            if (wheelRef.current)
                wheelRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
            rafRef.current = requestAnimationFrame(tick);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener("scroll", onScroll);
            mq.removeEventListener("change", check);
            obs.disconnect();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const CX = 360, CY = 360;
    const R_OUTER = 330, R_DATA = 308, R_MID = 280, R_INNER = 240, R_DETAIL = 200, R_CORE = 90, R_HUB = 32;
    const pt  = (r: number, a: number) => ({ x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r });
    const arc = (r: number, a1: number, a2: number, large = false) => {
        const s = pt(r, a1), e = pt(r, a2);
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large ? 1 : 0} 1 ${e.x} ${e.y}`;
    };

    const ticks96   = Array.from({ length: 96 }, (_, i) => {
        const a = (i / 96) * Math.PI * 2 - Math.PI / 2;
        const is6 = i % 24 === 0, is12 = i % 8 === 0, is3 = i % 4 === 0;
        const len = is6 ? 20 : is12 ? 13 : is3 ? 8 : 4;
        const op  = is6 ? 0.55 : is12 ? 0.30 : is3 ? 0.18 : 0.09;
        return { s: pt(R_OUTER, a), e: pt(R_OUTER - len, a), op, sw: is6 ? 1.5 : is12 ? 1.0 : 0.6 };
    });
    const segArcs   = Array.from({ length: 8 }, (_, i) => {
        const gap = 0.04;
        return { path: arc(R_DATA, (i / 8) * Math.PI * 2 - Math.PI / 2 + gap, ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2 - gap, true), bright: i % 2 === 0 };
    });
    const spokes12  = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return { s: pt(R_CORE + 4, a), e: pt(R_INNER - 4, a), major: i % 3 === 0 };
    });
    const diamonds  = Array.from({ length: 24 }, (_, i) => {
        const c = pt(R_MID, (i / 24) * Math.PI * 2 - Math.PI / 2);
        return { ...c, sz: i % 6 === 0 ? 5 : 3, bright: i % 6 === 0 };
    });
    const brackets  = Array.from({ length: 4 }, (_, i) => arc(R_DETAIL, (i / 4) * Math.PI * 2 - Math.PI / 4 - 0.22, (i / 4) * Math.PI * 2 - Math.PI / 4 + 0.22));
    const dataLabels = ["SYS//ACTIVE","NET::0xF2A","CPU:98.6%","MEM:16.0G","BUS:PCIe5","CLK:4.8GHz"]
        .map((text, i) => ({ text, p: pt(R_OUTER + 22, -Math.PI / 2 + (i / 6) * Math.PI * 2) }));

    const C = isDark ? {
        ring:"rgba(255,255,255,0.12)", ringMid:"rgba(255,255,255,0.06)", ringInner:"rgba(255,255,255,0.10)",
        ringDetail:"rgba(255,255,255,0.06)", tick:(op:number)=>`rgba(255,255,255,${op})`,
        segBright:"rgba(200,220,255,0.22)", segDim:"rgba(255,255,255,0.07)",
        diamondBright:"rgba(200,220,255,0.50)", diamondDim:"rgba(255,255,255,0.18)",
        bracket:"rgba(200,220,255,0.35)", spokeMajor:"rgba(255,255,255,0.12)", spokeMinor:"rgba(255,255,255,0.05)",
        core:"rgba(255,255,255,0.12)", coreDash:"rgba(255,255,255,0.05)", coreHub:"rgba(255,255,255,0.03)",
        hubRing:"rgba(200,220,255,0.25)", hubDash:"rgba(255,255,255,0.08)", hubDot:"rgba(200,220,255,0.15)",
        hubDotRing:"rgba(200,220,255,0.40)", cross:"rgba(255,255,255,0.20)", label:"rgba(180,200,255,0.35)",
        scan:"rgba(160,200,255,0.25)", clusterMain:"rgba(200,220,255,0.25)", clusterSide:"rgba(255,255,255,0.08)",
    } : {
        ring:"rgba(30,40,100,0.18)", ringMid:"rgba(30,40,100,0.10)", ringInner:"rgba(30,40,100,0.15)",
        ringDetail:"rgba(30,40,100,0.08)", tick:(op:number)=>`rgba(30,40,100,${op})`,
        segBright:"rgba(60,80,200,0.28)", segDim:"rgba(30,40,100,0.10)",
        diamondBright:"rgba(60,80,200,0.55)", diamondDim:"rgba(30,40,100,0.22)",
        bracket:"rgba(60,80,200,0.40)", spokeMajor:"rgba(30,40,100,0.16)", spokeMinor:"rgba(30,40,100,0.07)",
        core:"rgba(30,40,100,0.18)", coreDash:"rgba(30,40,100,0.08)", coreHub:"rgba(30,40,100,0.05)",
        hubRing:"rgba(60,80,200,0.30)", hubDash:"rgba(30,40,100,0.12)", hubDot:"rgba(60,80,200,0.20)",
        hubDotRing:"rgba(60,80,200,0.45)", cross:"rgba(30,40,100,0.25)", label:"rgba(40,60,180,0.45)",
        scan:"rgba(60,100,220,0.50)", clusterMain:"rgba(60,80,200,0.55)", clusterSide:"rgba(30,40,100,0.20)",
    };

    return (
        <svg ref={wheelRef} viewBox="0 0 720 720" aria-hidden="true"
            className="absolute left-1/2 top-1/2 pointer-events-none select-none"
            style={{ width:"min(820px,100vw)", height:"min(820px,100vw)", marginLeft:"calc(min(820px,100vw)/-2)", marginTop:"calc(min(820px,100vw)/-2)", willChange:"transform" }}>
            <defs>
                <filter id="wglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="wsglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={C.ring} strokeWidth="0.75"/>
            {ticks96.map((t,i)=><line key={i} x1={t.s.x} y1={t.s.y} x2={t.e.x} y2={t.e.y} stroke={C.tick(t.op)} strokeWidth={t.sw} strokeLinecap="round"/>)}
            {segArcs.map((s,i)=><path key={i} d={s.path} fill="none" stroke={s.bright?C.segBright:C.segDim} strokeWidth={s.bright?2:1} filter={s.bright?"url(#wsglow)":undefined}/>)}
            <circle cx={CX} cy={CY} r={R_MID} fill="none" stroke={C.ringMid} strokeWidth="0.75"/>
            {diamonds.map((d,i)=><rect key={i} x={d.x-d.sz/2} y={d.y-d.sz/2} width={d.sz} height={d.sz} fill={d.bright?C.diamondBright:C.diamondDim} stroke="none" transform={`rotate(45 ${d.x} ${d.y})`} filter={d.bright?"url(#wglow)":undefined}/>)}
            <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke={C.ringInner} strokeWidth="1"/>
            <circle cx={CX} cy={CY} r={R_DETAIL} fill="none" stroke={C.ringDetail} strokeWidth="0.75" strokeDasharray="4 6"/>
            {brackets.map((b,i)=><path key={i} d={b} fill="none" stroke={C.bracket} strokeWidth="2" strokeLinecap="round" filter="url(#wsglow)"/>)}
            {spokes12.map((s,i)=><line key={i} x1={s.s.x} y1={s.s.y} x2={s.e.x} y2={s.e.y} stroke={s.major?C.spokeMajor:C.spokeMinor} strokeWidth={s.major?1:0.5} strokeDasharray={s.major?"none":"3 5"}/>)}
            <circle cx={CX} cy={CY} r={R_CORE} fill="none" stroke={C.core} strokeWidth="1"/>
            <circle cx={CX} cy={CY} r={R_CORE-8} fill="none" stroke={C.coreDash} strokeWidth="0.5" strokeDasharray="2 4"/>
            <line x1={CX-R_CORE} y1={CY} x2={CX-R_HUB-4} y2={CY} stroke={C.cross} strokeWidth="0.75"/>
            <line x1={CX+R_HUB+4} y1={CY} x2={CX+R_CORE} y2={CY} stroke={C.cross} strokeWidth="0.75"/>
            <line x1={CX} y1={CY-R_CORE} x2={CX} y2={CY-R_HUB-4} stroke={C.cross} strokeWidth="0.75"/>
            <line x1={CX} y1={CY+R_HUB+4} x2={CX} y2={CY+R_CORE} stroke={C.cross} strokeWidth="0.75"/>
            <circle cx={CX} cy={CY} r={R_HUB} fill={C.coreHub} stroke={C.hubRing} strokeWidth="1.5" filter="url(#wsglow)"/>
            <circle cx={CX} cy={CY} r={R_HUB-8} fill="none" stroke={C.hubDash} strokeWidth="0.75" strokeDasharray="3 5"/>
            <circle cx={CX} cy={CY} r={8} fill={C.hubDot} stroke={C.hubDotRing} strokeWidth="1" filter="url(#wglow)"/>
            {dataLabels.map(({text,p},i)=><text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="8" fontFamily="monospace" letterSpacing="0.08em" fill={C.label}>{text}</text>)}
            <path d={arc(R_DATA-2,-Math.PI/6,-Math.PI/6+Math.PI*0.6)} fill="none" stroke={C.scan} strokeWidth="2" strokeLinecap="round" filter="url(#wglow)"/>
            {[0,Math.PI/2,Math.PI,(3*Math.PI)/2].map((a,i)=>[-0.06,-0.03,0,0.03,0.06].map((off,j)=>{
                const s=pt(R_INNER+6,a+off),e=pt(R_INNER+18,a+off);
                return <line key={`${i}-${j}`} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke={j===2?C.clusterMain:C.clusterSide} strokeWidth={j===2?1.5:0.75}/>;
            }))}
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Red diagonal scrolling banner
// ---------------------------------------------------------------------------

function RedBanner() {
    const WORDS = ["PRODUCTION-READY","IMMERSIVE","PROTECTED","DEPENDABLE","CAPTIVATING","USER-FRIENDLY","ADAPTIVE","FLUID","FUTURE-PROOF","SEO-READY"];
    const tripled = [...WORDS, ...WORDS, ...WORDS];

    return (
        <div className="relative w-full" style={{ height: 160, overflow: "hidden" }}>

            {/* ── Empty crossing strip — deep crimson ── */}
            <div
                className="absolute w-[200%] -left-[50%]"
                style={{
                    height:     80,
                    top:        50,
                    transform:  "skewY(5deg)",
                    background: "#8B0000",
                    zIndex:     1,
                }}
            />

            {/* ── Text strip — vivid scarlet ── */}
            <div
                className="absolute w-[200%] -left-[50%]"
                style={{
                    height:     80,
                    top:        26,
                    transform:  "skewY(-4deg)",
                    background: "#E8173A",
                    zIndex:     2,
                    overflow:   "hidden",
                    display:    "flex",
                    alignItems: "center",
                }}
            >
                <div
                    className="flex items-center gap-16 w-max px-8"
                    style={{ animation: "banner-scroll 40s linear infinite" }}
                >
                    {tripled.map((word, i) => (
                        <span key={i} className="flex items-center gap-16 text-white font-black tracking-[0.22em] text-[18px] uppercase whitespace-nowrap flex-shrink-0">
                            {word}
                            <svg width="16" height="16" viewBox="0 0 13 13" fill="white" opacity="0.75">
                                <path d="M6.5 0l1.2 4.8L12.5 6.5l-4.8 1.2L6.5 13l-1.2-4.8L0 6.5l4.8-1.2z"/>
                            </svg>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Skills section
// ---------------------------------------------------------------------------

export function Skills() {
    const [active, setActive] = useState(0);

    return (
        <section id="skills" className="relative w-full" style={{ contain: "paint" }}>

            {/* ── Content ────────────────────────────────────────────────── */}
            <div className="relative flex flex-col items-center pt-24 pb-10 px-4 sm:px-6" style={{ overflowX: "clip" }}>

                {/* Background wheel */}
                <HudWheel />

                {/* Section label */}
                <p className="relative z-10 text-[11px] tracking-[0.3em] font-medium text-neutral-400 dark:text-white/35 uppercase mb-5">
                    My Skillset
                </p>

                {/* Heading */}
                <h2 className="relative z-10 text-center text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-12 px-6 w-full">
                    The Magic{" "}
                    <span className="font-serif italic inline-block" style={{ background:"linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#f97316 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", paddingRight: "0.05em" }}>
                        Behind
                    </span>
                </h2>

                {/* ── Category tabs + skill grid ── */}
                <div className="relative z-10 w-full max-w-5xl mx-auto rounded-[2rem] border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-black/40 backdrop-blur-md overflow-hidden shadow-xl dark:shadow-none flex flex-col md:flex-row min-h-[380px]">

                    {/* Left — category list */}
                    <div className="flex flex-row md:flex-col gap-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-white/8 flex-shrink-0 md:w-52 overflow-x-auto md:overflow-visible">
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={cat.name}
                                onClick={() => setActive(i)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 flex-shrink-0 w-full
                                    ${active === i
                                        ? "bg-neutral-100 dark:bg-white/8 text-neutral-900 dark:text-white"
                                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-700 dark:hover:text-white"
                                    }
                                `}
                            >
                                {/* Colored left accent bar when active */}
                                <span
                                    className="text-base leading-none flex-shrink-0"
                                    style={{ color: active === i ? cat.color : "inherit" }}
                                >
                                    {cat.icon}
                                </span>
                                <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                                {active === i && (
                                    <span
                                        className="ml-auto w-1 h-5 rounded-full flex-shrink-0 hidden md:block"
                                        style={{ background: cat.color }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right — skill grid */}
                    <div className="flex-1 p-6 sm:p-8 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0  }}
                                exit={{    opacity: 0, y: -8  }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="h-full"
                            >
                                {/* Category heading */}
                                <div className="flex items-center gap-2 mb-6">
                                    <span
                                        className="text-lg"
                                        style={{ color: CATEGORIES[active].color }}
                                    >
                                        {CATEGORIES[active].icon}
                                    </span>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                                        {CATEGORIES[active].name}
                                    </h3>
                                    <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400">
                                        {CATEGORIES[active].skills.length} tools
                                    </span>
                                </div>

                                {/* Skill pills grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {CATEGORIES[active].skills.map((skill, si) => (
                                        <motion.div
                                            key={skill.name}
                                            initial={{ opacity: 0, scale: 0.92 }}
                                            animate={{ opacity: 1, scale: 1    }}
                                            transition={{ duration: 0.2, delay: si * 0.04 }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/8 bg-white/70 dark:bg-white/4 hover:border-neutral-300 dark:hover:border-white/15 hover:bg-white dark:hover:bg-white/8 transition-all duration-200 cursor-default select-none group"
                                        >
                                            <span
                                                className="text-base leading-none w-6 text-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                                                style={{ color: CATEGORIES[active].color }}
                                            >
                                                {skill.icon}
                                            </span>
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
                                                {skill.name}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-16" />
            </div>

            {/* ── Red banner ─────────────────────────────────────────────── */}
            <RedBanner />
        </section>
    );
}