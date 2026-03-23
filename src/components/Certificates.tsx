"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date: string;
    credentialId: string;
    skills: string[];
    level: "Beginner" | "Beginner+" | "Intermediate" | "Advanced";
    levelPct: number; // 0–100
    category: "Cloud" | "AI/ML" | "DSA" | "Theory";
    color: string;
    colorEnd: string;
    logo?: React.ReactNode;
    verifyUrl: string;
    pdfFile: string;
    backDesc: string; // flip-card back description
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const CERTIFICATES: Certificate[] = [
    {
        id: 1,
        title: "AWS Academy Cloud Foundations",
        issuer: "Amazon Web Services",
        date: "Apr 2025",
        credentialId: "Credly · uCtFyBNf",
        category: "Cloud",
        level: "Intermediate",
        levelPct: 62,
        skills: ["Cloud Concepts", "AWS Core Services", "Security", "Architecture", "Pricing"],
        color: "#FF9900",
        colorEnd: "#FF6600",
        verifyUrl: "https://www.credly.com/go/uCtFyBNf",
        pdfFile: "aws-cloud-foundations.pdf",
        backDesc:
            "Covers core AWS services, cloud architecture principles, security best practices, billing models, and the Well-Architected Framework. A solid foundation for cloud engineering.",
    },
    {
        id: 2,
        title: "Mastering Data Structures & Algorithms",
        issuer: "Board Infinity",
        date: "Jul 2025",
        credentialId: "BI_07272025_13",
        category: "DSA",
        level: "Advanced",
        levelPct: 84,
        skills: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Sorting"],
        color: "#6366F1",
        colorEnd: "#A855F7",
        verifyUrl: "#",
        pdfFile: "dsa-board-infinity.pdf",
        backDesc:
            "Comprehensive deep-dive into algorithmic problem solving — from arrays & linked lists through graphs, DP, and complexity analysis. Completed advanced competitive-programming challenges.",
    },
    {
        id: 3,
        title: "ChatGPT-4 Prompt Engineering: Generative AI & LLM",
        issuer: "Infosys Springboard",
        date: "Aug 2025",
        credentialId: "Verify · onwingspan.com",
        category: "AI/ML",
        level: "Intermediate",
        levelPct: 70,
        skills: ["Prompt Engineering", "ChatGPT", "LLMs", "Generative AI", "AI Tools"],
        color: "#0EA5E9",
        colorEnd: "#7B3FE4",
        verifyUrl: "https://verify.onwingspan.com",
        pdfFile: "chatgpt-prompt-engineering.pdf",
        backDesc:
            "Practical mastery of prompt design patterns, chain-of-thought reasoning, few-shot prompting, and building real applications on top of OpenAI's GPT-4 APIs.",
    },
    {
        id: 4,
        title: "Build Generative AI Apps with No-Code Tools",
        issuer: "Infosys Springboard",
        date: "Aug 2025",
        credentialId: "Verify · onwingspan.com",
        category: "AI/ML",
        level: "Beginner+",
        levelPct: 45,
        skills: ["No-Code AI", "Generative AI", "AI Workflows", "App Building", "LLM APIs"],
        color: "#10B981",
        colorEnd: "#059669",
        verifyUrl: "https://verify.onwingspan.com",
        pdfFile: "genai-no-code-tools.pdf",
        backDesc:
            "Explored no-code platforms to orchestrate AI pipelines, connect LLM APIs, and ship generative AI micro-apps without writing backend infrastructure from scratch.",
    },
    {
        id: 5,
        title: "Computational Theory: Language Principle & Finite Automata",
        issuer: "Infosys Springboard",
        date: "Aug 2025",
        credentialId: "Verify · onwingspan.com",
        category: "Theory",
        level: "Advanced",
        levelPct: 80,
        skills: ["Finite Automata", "Regular Expressions", "Turing Machines", "Formal Languages", "Computability"],
        color: "#8B5CF6",
        colorEnd: "#6D28D9",
        verifyUrl: "https://verify.onwingspan.com",
        pdfFile: "computational-theory.pdf",
        backDesc:
            "Formal treatment of DFAs, NFAs, pushdown automata, context-free grammars, decidability, and complexity classes (P, NP). Essential theoretical CS groundwork.",
    },
    {
        id: 6,
        title: "Natural Language Processing",
        issuer: "NPTEL · IIT Kharagpur",
        date: "Jul–Oct 2023",
        credentialId: "NPTEL23CS80S642304115",
        category: "AI/ML",
        level: "Intermediate",
        levelPct: 68,
        skills: ["NLP", "Text Processing", "Machine Learning", "Linguistics", "Neural NLP"],
        color: "#DC2626",
        colorEnd: "#B91C1C",
        verifyUrl: "#",
        pdfFile: "nptel-nlp.pdf",
        backDesc:
            "8-week IIT Kharagpur course covering classical NLP (HMMs, CRFs) through deep-learning approaches (transformers, BERT). Included weekly graded assignments.",
    },
];

const ALL_CATEGORIES = ["All", "Cloud", "AI/ML", "DSA", "Theory"] as const;
type FilterCat = (typeof ALL_CATEGORIES)[number];

const LEVEL_META: Record<Certificate["level"], { label: string; color: string }> = {
    "Beginner":     { label: "Beginner",     color: "#60A5FA" },
    "Beginner+":    { label: "Beginner+",    color: "#34D399" },
    "Intermediate": { label: "Intermediate", color: "#FBBF24" },
    "Advanced":     { label: "Advanced",     color: "#F87171" },
};

// ---------------------------------------------------------------------------
// Pre-computed seal spokes (SSR-safe)
// ---------------------------------------------------------------------------
const SEAL_SPOKES = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const r = (n: number) => parseFloat(n.toFixed(4));
    return { x1: r(40 + 24 * Math.cos(a)), y1: r(40 + 24 * Math.sin(a)), x2: r(40 + 30 * Math.cos(a)), y2: r(40 + 30 * Math.sin(a)) };
});

function CertSeal({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
            <circle cx="40" cy="40" r="36" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
            <circle cx="40" cy="40" r="28" stroke={color} strokeWidth="1" opacity="0.25" />
            <circle cx="40" cy="40" r="20" fill={color} opacity="0.08" />
            {SEAL_SPOKES.map((s, i) => (
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth="1.5" opacity="0.3" />
            ))}
            <path d="M29 40l7 7 15-15" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Achievement banner
// ---------------------------------------------------------------------------
function AchievementBanner({ certs }: { certs: Certificate[] }) {
    const topSkills = useMemo(() => {
        const map: Record<string, number> = {};
        certs.forEach((c) => c.skills.forEach((s) => { map[s] = (map[s] ?? 0) + 1; }));
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s);
    }, [certs]);

    const stats = [
        { icon: "🏆", label: `${certs.length} Certificates Earned`,    accent: "#FBBF24" },
        { icon: "🔥", label: `Top Skills: ${topSkills.join(", ")}`,     accent: "#F87171" },
        { icon: "📈", label: "Active Learning Streak",                  accent: "#34D399" },
        { icon: "⚡", label: `${[...new Set(certs.map((c) => c.category))].length} Domains Covered`, accent: "#A78BFA" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto mb-12 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
            {stats.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    className="relative flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-4 overflow-hidden"
                    style={{ backdropFilter: "blur(14px)" }}
                >
                    {/* Glow */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at 0% 50%, ${s.accent}18 0%, transparent 70%)` }} />
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 leading-tight">{s.label}</p>
                </motion.div>
            ))}
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Filter pills
// ---------------------------------------------------------------------------
function FilterPills({ active, onChange }: { active: FilterCat; onChange: (c: FilterCat) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
        >
            {ALL_CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all duration-300 overflow-hidden ${active === cat ? "border-black/20 dark:border-white/25 bg-black/10 dark:bg-white/10 text-black dark:text-white" : "border-black/10 dark:border-white/[0.07] text-neutral-500 dark:text-white/45 bg-transparent"}`}
                >
                    {active === cat && (
                        <motion.span
                            layoutId="filter-pill"
                            className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/[0.08]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative">{cat}</span>
                </button>
            ))}
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// 3D Tilt Card (Flip-able)
// ---------------------------------------------------------------------------
function CertCard({ cert, index }: { cert: Certificate; index: number }) {
    const [flipped, setFlipped] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const springConfig = { stiffness: 200, damping: 22, mass: 0.6 };
    const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]) as any, springConfig);
    const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]) as any, springConfig);
    const glowX   = useTransform(rawX, [-0.5, 0.5], [0, 100]);
    const glowY   = useTransform(rawY, [-0.5, 0.5], [0, 100]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || flipped) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        rawX.set((e.clientX - left) / width - 0.5);
        rawY.set((e.clientY - top) / height - 0.5);
    }, [flipped, rawX, rawY]);

    const handleMouseLeave = useCallback(() => {
        rawX.set(0);
        rawY.set(0);
    }, [rawX, rawY]);

    const levelMeta = LEVEL_META[cert.level];

    return (
        <>
            <motion.div
                ref={cardRef}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: index * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                style={{ perspective: 900, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer select-none"
                onClick={() => setFlipped((f) => !f)}
            >
                <motion.div
                    style={{
                        rotateX: flipped ? 0 : rotateX,
                        rotateY: flipped ? 0 : rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                    className="relative w-full"
                    whileHover={flipped ? {} : { scale: 1.025 }}
                >
                    {/* ── FRONT ── */}
                    <FrontFace
                        cert={cert}
                        levelMeta={levelMeta}
                        glowX={glowX}
                        glowY={glowY}
                        onOpenLightbox={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                    />

                    {/* ── BACK ── */}
                    <BackFace cert={cert} onOpenLightbox={(e) => { e.stopPropagation(); setLightboxOpen(true); }} />
                </motion.div>
            </motion.div>

            {lightboxOpen && <CertLightbox cert={cert} onClose={() => setLightboxOpen(false)} />}
        </>
    );
}

// ---------------------------------------------------------------------------
// Front face
// ---------------------------------------------------------------------------
function FrontFace({
    cert,
    levelMeta,
    glowX,
    glowY,
    onOpenLightbox,
}: {
    cert: Certificate;
    levelMeta: { label: string; color: string };
    glowX: MotionValue<number>;
    glowY: MotionValue<number>;
    onOpenLightbox: (e: React.MouseEvent) => void;
}) {
    const [glowXVal, setGlowXVal] = useState(50);
    const [glowYVal, setGlowYVal] = useState(50);

    useEffect(() => {
        const unsub1 = glowX.on("change", (v: any) => setGlowXVal(v as number));
        const unsub2 = glowY.on("change", (v: any) => setGlowYVal(v as number));
        return () => { unsub1(); unsub2(); };
    }, [glowX, glowY]);

    return (
        <div
            className="relative rounded-2xl overflow-hidden flex flex-col min-h-[340px]"
            style={{
                background: "rgba(12,12,16,0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: `0 0 30px ${cert.color}22, 0 20px 60px -20px rgba(0,0,0,0.6)`,
            }}
        >
            {/* Dynamic glow spotlight */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(circle at ${glowXVal}% ${glowYVal}%, ${cert.color}18 0%, transparent 60%)`,
                    opacity: 0.6,
                }}
            />

            {/* Top accent bar with gradient */}
            <div className="h-[3px] w-full flex-shrink-0"
                style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})` }} />

            {/* Hover glow border shimmer */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${cert.color}14 0%, transparent 50%, ${cert.colorEnd}0a 100%)`,
                }} />

            <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${cert.color}25, ${cert.colorEnd}18)`, color: cert.color }}
                        >
                            {cert.logo}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.15em] uppercase"
                                style={{ color: cert.color }}>{cert.issuer}</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">{cert.date}</p>
                        </div>
                    </div>

                    {/* Animated seal */}
                    <motion.div
                        className="w-11 h-11 flex-shrink-0"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <CertSeal color={cert.color} />
                    </motion.div>
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-white leading-snug tracking-tight line-clamp-2">
                    {cert.title}
                </h3>

                {/* Credential ID */}
                <p className="text-[10px] text-neutral-600 font-mono tracking-widest">{cert.credentialId}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                    {cert.skills.slice(0, 4).map((skill) => (
                        <motion.span
                            key={skill}
                            whileHover={{ scale: 1.1, y: -1 }}
                            className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border cursor-default"
                            style={{
                                color: cert.color,
                                background: `${cert.color}12`,
                                border: `1px solid ${cert.color}30`,
                            }}
                        >
                            {skill}
                        </motion.span>
                    ))}
                    {cert.skills.length > 4 && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] text-neutral-500 bg-white/5 border border-white/8">
                            +{cert.skills.length - 4}
                        </span>
                    )}
                </div>

                {/* Level + progress */}
                <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Skill Level</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: levelMeta.color, background: `${levelMeta.color}18`, border: `1px solid ${levelMeta.color}30` }}>
                            {levelMeta.label}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${cert.levelPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})` }}
                        />
                    </div>
                    <p className="text-[10px] text-neutral-600 text-right tabular-nums">{cert.levelPct}% mastery</p>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onOpenLightbox}
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: cert.color }}
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        View PDF
                    </motion.button>
                    <span className="text-[10px] text-neutral-600 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        Click to flip
                    </span>
                </div>
            </div>

            {/* Bottom shimmer on hover */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})`, originX: 0 }}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Back face
// ---------------------------------------------------------------------------
function BackFace({
    cert,
    onOpenLightbox,
}: {
    cert: Certificate;
    onOpenLightbox: (e: React.MouseEvent) => void;
}) {
    return (
        <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
            style={{
                background: `linear-gradient(135deg, ${cert.color}18 0%, rgba(12,12,16,0.95) 40%, ${cert.colorEnd}12 100%)`,
                backdropFilter: "blur(20px)",
                border: `1px solid ${cert.color}35`,
                boxShadow: `0 0 40px ${cert.color}30, 0 20px 60px -20px rgba(0,0,0,0.7)`,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
            }}
        >
            {/* Top accent */}
            <div className="h-[3px] w-full"
                style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})` }} />

            <div className="p-6 flex flex-col gap-5 flex-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: cert.color }} />
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: cert.color }}>
                        What I Learned
                    </p>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed flex-1">{cert.backDesc}</p>

                {/* Key skills */}
                <div>
                    <p className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {cert.skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold"
                                style={{ color: cert.color, background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3 border-t border-white/[0.06]">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onOpenLightbox}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                        style={{ background: `linear-gradient(135deg, ${cert.color}, ${cert.colorEnd})` }}
                    >
                        📄 View Certificate
                    </motion.button>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center border transition-all"
                        style={{ color: cert.color, border: `1px solid ${cert.color}40`, background: `${cert.color}10` }}
                    >
                        🔗 Verify
                    </motion.a>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function CertLightbox({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
    const pdfSrc = `/${cert.pdfFile}`;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
    }, [onClose]);

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex flex-col"
                style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", zIndex: 99999 }}
                onClick={onClose}
            >
                {/* Top bar */}
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                    style={{ zIndex: 100001 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${cert.color}25`, color: cert.color }}>
                            {cert.logo}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{cert.title}</p>
                            <p className="text-[11px] text-neutral-400">{cert.issuer} · {cert.date}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href={pdfSrc} download onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all">
                            ⬇ Download
                        </a>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                            ✕
                        </button>
                    </div>
                </motion.div>

                {/* PDF */}
                <motion.div
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <iframe src={`${pdfSrc}#toolbar=1&navpanes=0`} className="w-full h-full" title={cert.title}
                        style={{ background: "#fff", display: "block" }} />
                </motion.div>

                {/* Accent line */}
                <div className="absolute left-4 right-4 h-[3px] rounded-t-2xl"
                    style={{ top: "52px", background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})`, zIndex: 100002 }} />
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

// ---------------------------------------------------------------------------
// Logo helpers (same as original)
// ---------------------------------------------------------------------------
const AWS_LOGO = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M13.527 12.003c0 .808.079 1.462.221 1.944.157.482.35.999.63 1.557.1.157.14.315.14.457 0 .2-.122.4-.378.6l-1.255.836a.963.963 0 0 1-.52.174c-.2 0-.4-.1-.598-.278a6.184 6.184 0 0 1-.716-.935 15.395 15.395 0 0 1-.614-1.174c-1.546 1.825-3.49 2.737-5.834 2.737-1.667 0-2.994-.477-3.97-1.43-.975-.954-1.47-2.224-1.47-3.81 0-1.686.597-3.055 1.806-4.088C2.167 7.56 3.77 7.043 5.795 7.043c.657 0 1.333.056 2.048.155.716.1 1.45.258 2.225.437V6.27c0-1.528-.32-2.6-.94-3.235-.636-.636-1.706-.947-3.228-.947-.694 0-1.407.08-2.14.259-.735.178-1.451.397-2.147.676a5.68 5.68 0 0 1-.695.259.962.962 0 0 1-.319.059c-.278 0-.418-.2-.418-.617V1.47c0-.318.04-.557.139-.695.1-.14.278-.279.557-.418C1.653.02 2.507-.2 3.562-.2c1.075 0 1.965.119 2.683.358.715.238 1.37.596 1.965 1.073.595.478 1.03 1.035 1.31 1.67.276.637.413 1.37.413 2.2v2.9h.039c.395-.993.988-1.905 1.766-2.716.776-.81 1.726-1.432 2.836-1.847 1.11-.416 2.337-.623 3.662-.623 1.667 0 3.016.478 4.029 1.432.654.614 1.108 1.345 1.352 2.183-.477-.1-1.01-.159-1.607-.159-1.326 0-2.483.34-3.453 1.015-.975.677-1.448 1.65-1.448 2.923v1.194c-.199-.06-.397-.099-.597-.12a5.34 5.34 0 0 0-.596-.04c-.993 0-1.787.319-2.384.956-.598.637-.894 1.491-.894 2.562z"/>
    </svg>
);

const DSA_LOGO = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
);

const AI_LOGO = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M11.998 0C5.366 0 0 5.367 0 12c0 6.633 5.366 12 11.998 12C18.63 24 24 18.633 24 12c0-6.633-5.37-12-12.002-12zm5.863 7.708l-1.912 9.016c-.142.63-.51.784-.946.486l-2.612-1.926-1.26 1.213c-.14.14-.257.257-.526.257l.187-2.665 4.84-4.372c.21-.187-.046-.29-.324-.103L6.4 14.667 3.82 13.877c-.564-.176-.576-.565.12-.835l11.489-4.427c.467-.17.878.114.432 1.093z"/>
    </svg>
);

const THEORY_LOGO = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const NLP_LOGO = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

// Inject logos into cert data
const CERT_LOGOS: Record<number, React.ReactNode> = {
    1: AWS_LOGO,
    2: DSA_LOGO,
    3: AI_LOGO,
    4: AI_LOGO,
    5: THEORY_LOGO,
    6: NLP_LOGO,
};

// ---------------------------------------------------------------------------
// Main Certificates section
// ---------------------------------------------------------------------------
export function Certificates() {
    const [filter, setFilter] = useState<FilterCat>("All");

    const certsWithLogos = useMemo(() =>
        CERTIFICATES.map((c) => ({ ...c, logo: CERT_LOGOS[c.id] })),
    []);

    const filtered = useMemo(() =>
        filter === "All" ? certsWithLogos : certsWithLogos.filter((c) => c.category === filter),
    [filter, certsWithLogos]);

    // Seeded ambient particles (SSR-safe)
    const particles = useMemo(() => {
        let s = 0x9e3779b9;
        const rng = () => { s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0); return (s >>> 0) / 0xffffffff; };
        return Array.from({ length: 20 }, (_, i) => ({
            id: i, x: rng() * 100, y: rng() * 100,
            size: 1.5 + rng() * 3, duration: 5 + rng() * 7, delay: rng() * 5,
        }));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative w-full mt-32 px-4 overflow-hidden"
        >
            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
                    style={{ background: "radial-gradient(circle, #a855f7, transparent)", filter: "blur(140px)", opacity: 0.07 }} />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent)", filter: "blur(120px)", opacity: 0.05 }} />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ background: "radial-gradient(circle, #f59e0b, transparent)", filter: "blur(100px)", opacity: 0.04 }} />
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-white"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.05 }}
                        animate={{ y: [0, -15, 0], opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* Section heading */}
            <div className="relative text-center mb-16">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">
                    Credentials &amp; Learning
                </motion.p>

                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: 60, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                        Certifications
                    </motion.h2>
                </div>
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: 60, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1">
                        <span className="font-serif italic" style={{
                            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #a855f7 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>
                            &amp;&amp; Badges
                        </span>
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mx-auto mt-8 h-px w-32 origin-center"
                    style={{ background: "linear-gradient(90deg, transparent, #a855f7, #f59e0b, transparent)" }}
                />
            </div>

            {/* Achievement banner */}
            <AchievementBanner certs={certsWithLogos} />

            {/* Filter pills */}
            <FilterPills active={filter} onChange={setFilter} />

            {/* Cards grid */}
            <div className="relative w-full max-w-5xl mx-auto">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {filtered.map((cert, i) => (
                            <CertCard key={cert.id} cert={cert} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 flex flex-col items-center gap-3"
                >
                    <p className="text-sm text-neutral-500">{CERTIFICATES.length} certificates earned</p>
                    <a href="https://www.linkedin.com/in/peshalmishra" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/25 transition-all hover:scale-105">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        View all on LinkedIn
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
}
