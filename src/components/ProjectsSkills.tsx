"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Skill data with icons, levels, tools, and libraries
// ---------------------------------------------------------------------------
const SKILL_CATEGORIES = [
    {
        label: "Frontend",
        color: "#38bdf8",
        colorEnd: "#818cf8",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
        ),
        skills: [
            { name: "React",         level: 90, icon: "⚛️",  gradient: "from-[#61DAFB] to-[#21a1c4]" },
            { name: "Next.js",       level: 85, icon: "▲",   gradient: "from-[#ffffff] to-[#888888]" },
            { name: "TypeScript",    level: 80, icon: "🟦",  gradient: "from-[#3178c6] to-[#235a97]" },
            { name: "Tailwind CSS",  level: 88, icon: "🎨",  gradient: "from-[#38bdf8] to-[#0ea5e9]" },
            { name: "Framer Motion", level: 75, icon: "✨",  gradient: "from-[#a855f7] to-[#7c3aed]" },
            { name: "HTML/CSS",      level: 95, icon: "🌐",  gradient: "from-[#e34c26] to-[#f06529]" },
        ],
        tools: ["Vite", "Webpack", "Storybook"],
        libraries: ["Radix UI", "shadcn/ui", "React Query"],
        experience: "2+ years",
    },
    {
        label: "Backend",
        color: "#34d399",
        colorEnd: "#059669",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
        ),
        skills: [
            { name: "Node.js",     level: 85, icon: "🟢", gradient: "from-[#68a063] to-[#3d6b35]" },
            { name: "Express",     level: 82, icon: "🚂", gradient: "from-[#ffffff] to-[#aaaaaa]" },
            { name: "Spring Boot", level: 78, icon: "🍃", gradient: "from-[#6db33f] to-[#3d7a1a]" },
            { name: "FastAPI",     level: 72, icon: "⚡", gradient: "from-[#009688] to-[#00695c]" },
            { name: "REST APIs",   level: 90, icon: "🔗", gradient: "from-[#34d399] to-[#059669]" },
            { name: "GraphQL",     level: 68, icon: "🔮", gradient: "from-[#e535ab] to-[#a01070]" },
        ],
        tools: ["Postman", "Insomnia", "Swagger"],
        libraries: ["Passport.js", "Socket.io", "Bull"],
        experience: "2+ years",
    },
    {
        label: "Cloud & DevOps",
        color: "#fb923c",
        colorEnd: "#f59e0b",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
        ),
        skills: [
            { name: "AWS",        level: 80, icon: "☁️", gradient: "from-[#FF9900] to-[#FF6600]" },
            { name: "Docker",     level: 85, icon: "🐳", gradient: "from-[#2496ed] to-[#1a6db5]" },
            { name: "Kubernetes", level: 70, icon: "☸️", gradient: "from-[#326ce5] to-[#1e46b5]" },
            { name: "Terraform",  level: 65, icon: "🏗️", gradient: "from-[#7b42bc] to-[#5a2d8a]" },
            { name: "CI/CD",      level: 78, icon: "♻️", gradient: "from-[#fb923c] to-[#f59e0b]" },
            { name: "Linux",      level: 82, icon: "🐧", gradient: "from-[#fcc624] to-[#c9a000]" },
        ],
        tools: ["GitHub Actions", "Jenkins", "ArgoCD"],
        libraries: ["Helm", "Prometheus", "Grafana"],
        experience: "1.5+ years",
    },
    {
        label: "Databases",
        color: "#c084fc",
        colorEnd: "#a855f7",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
        ),
        skills: [
            { name: "PostgreSQL", level: 82, icon: "🐘", gradient: "from-[#336791] to-[#1e4d6b]" },
            { name: "MongoDB",    level: 85, icon: "🍃", gradient: "from-[#47a248] to-[#2e7a2e]" },
            { name: "Redis",      level: 75, icon: "🔴", gradient: "from-[#dc382d] to-[#a52019]" },
            { name: "MySQL",      level: 80, icon: "🐬", gradient: "from-[#4479a1] to-[#2d5a7a]" },
            { name: "DynamoDB",   level: 68, icon: "⚡", gradient: "from-[#FF9900] to-[#FF6600]" },
            { name: "Kafka",      level: 70, icon: "📨", gradient: "from-[#c084fc] to-[#a855f7]" },
        ],
        tools: ["DBeaver", "TablePlus", "DataGrip"],
        libraries: ["Prisma", "Mongoose", "TypeORM"],
        experience: "2+ years",
    },
    {
        label: "Languages",
        color: "#f472b6",
        colorEnd: "#ec4899",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
        ),
        skills: [
            { name: "Java",       level: 85, icon: "☕", gradient: "from-[#b07219] to-[#7d4f10]" },
            { name: "Python",     level: 80, icon: "🐍", gradient: "from-[#3572A5] to-[#1e4a75]" },
            { name: "TypeScript", level: 82, icon: "🟦", gradient: "from-[#3178c6] to-[#235a97]" },
            { name: "Go",         level: 70, icon: "🐹", gradient: "from-[#00ADD8] to-[#007fa3]" },
            { name: "JavaScript", level: 90, icon: "🟨", gradient: "from-[#f7df1e] to-[#c9b100]" },
            { name: "Bash",       level: 72, icon: "💻", gradient: "from-[#4eaa25] to-[#2e7a12]" },
        ],
        tools: ["ESLint", "Prettier", "Black"],
        libraries: ["NumPy", "Pandas", "TensorFlow"],
        experience: "3+ years",
    },
    {
        label: "Tools",
        color: "#94a3b8",
        colorEnd: "#64748b",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
        ),
        skills: [
            { name: "Git",    level: 92, icon: "🔀", gradient: "from-[#f05032] to-[#b52e10]" },
            { name: "GitHub", level: 90, icon: "🐙", gradient: "from-[#ffffff] to-[#999999]" },
            { name: "VS Code",level: 95, icon: "💙", gradient: "from-[#007acc] to-[#005a9e]" },
            { name: "Postman",level: 85, icon: "📮", gradient: "from-[#FF6C37] to-[#cc4a20]" },
            { name: "Jira",   level: 78, icon: "📋", gradient: "from-[#0052CC] to-[#003d99]" },
            { name: "Figma",  level: 70, icon: "🎨", gradient: "from-[#a259ff] to-[#7c2dff]" },
        ],
        tools: ["Notion", "Slack", "Linear"],
        libraries: ["Husky", "lint-staged", "commitlint"],
        experience: "3+ years",
    },
];

// Static orb positions
const ORB_POSITIONS = [
    { top: "10%",  left: "15%",  w: 400, h: 400, color: "#38bdf8", dur: 18 },
    { top: "55%",  left: "65%",  w: 360, h: 360, color: "#818cf8", dur: 22 },
    { top: "35%",  left: "38%",  w: 280, h: 280, color: "#34d399", dur: 15 },
    { top: "70%",  left: "8%",   w: 320, h: 320, color: "#f472b6", dur: 25 },
    { top: "2%",   left: "72%",  w: 260, h: 260, color: "#fb923c", dur: 20 },
];

// Dot-level indicator component
function SkillDots({ level }: { level: number }) {
    const filled = Math.round(level / 20); // 0–5 dots
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                        backgroundColor: i < filled ? "currentColor" : "transparent",
                        border: "1.5px solid currentColor",
                        opacity: i < filled ? 1 : 0.3,
                    }}
                />
            ))}
        </div>
    );
}

// Individual skill pill — gradient, icon, hover glow, lift
function SkillPill({
    skill,
    catColor,
    index,
}: {
    skill: { name: string; level: number; icon: string; gradient: string };
    catColor: string;
    index: number;
}) {
    const [hovered, setHovered] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative group cursor-default"
        >
            <motion.div
                animate={hovered ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl border overflow-hidden bg-black/5 dark:bg-white/[0.04] border-black/10 dark:border-white/[0.08]"
                style={{
                    ...(hovered && {
                        background: `linear-gradient(135deg, ${catColor}25, ${catColor}10)`,
                        borderColor: `${catColor}60`,
                        boxShadow: `0 0 18px ${catColor}40, 0 4px 16px rgba(0,0,0,0.3)`
                    }),
                    backdropFilter: "blur(12px)",
                    transition: "background 0.25s, border-color 0.25s, box-shadow 0.25s",
                }}
            >
                {/* Animated shimmer on hover */}
                {hovered && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 w-1/2 skew-x-12 pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${catColor}20, transparent)`,
                        }}
                    />
                )}

                {/* Icon */}
                <span className="text-sm leading-none select-none">{skill.icon}</span>

                {/* Name */}
                <span
                    className="text-xs font-semibold tracking-wide whitespace-nowrap text-neutral-600 dark:text-white/75"
                    style={hovered ? { color: catColor } : {}}
                >
                    {skill.name}
                </span>

                {/* Dot level */}
                <div style={{ color: catColor }}>
                    <SkillDots level={skill.level} />
                </div>
            </motion.div>
        </motion.div>
    );
}

// Expandable category card
function CategoryCard({
    cat,
    isActive,
    onToggle,
    cardIndex,
}: {
    cat: typeof SKILL_CATEGORIES[0];
    isActive: boolean;
    onToggle: () => void;
    cardIndex: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                delay: cardIndex * 0.07,
                duration: 0.55,
                ease: [0.23, 1, 0.32, 1],
            }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/[0.09]"
            onClick={onToggle}
            style={{
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: isActive
                    ? `0 0 0 1.5px ${cat.color}80, 0 8px 32px ${cat.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`
                    : "0 2px 16px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.3s ease",
            }}
        >
            {/* Gradient top accent bar */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.colorEnd})` }}
            />

            {/* Background glow behind card */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse at top left, ${cat.color}12 0%, transparent 65%)`,
                    opacity: isActive ? 1 : 0,
                }}
            />

            {/* Hover shimmer overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse at 0% 0%, ${cat.color}08 0%, transparent 60%)`,
                }}
            />

            <div className="relative p-5">
                {/* ── Card header ── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Glowing icon box */}
                        <motion.div
                            animate={isActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${cat.color}25, ${cat.colorEnd}15)`,
                                color: cat.color,
                                boxShadow: isActive ? `0 0 14px ${cat.color}50` : "none",
                                transition: "box-shadow 0.3s",
                            }}
                        >
                            {cat.icon}
                        </motion.div>

                        {/* Gradient category title */}
                        <div>
                            <span
                                className="text-xs font-black tracking-[0.18em] uppercase"
                                style={{
                                    background: `linear-gradient(135deg, ${cat.color}, ${cat.colorEnd})`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                {cat.label}
                            </span>
                            <p className="text-[10px] text-neutral-500 mt-0.5">{cat.experience}</p>
                        </div>
                    </div>

                    {/* Expand chevron */}
                    <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-shrink-0"
                        style={{ color: cat.color }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </motion.div>
                </div>

                {/* ── Skill pills (always visible) ── */}
                <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, si) => (
                        <SkillPill
                            key={skill.name}
                            skill={skill}
                            catColor={cat.color}
                            index={si}
                        />
                    ))}
                </div>

                {/* ── Expanded section: tools + libraries ── */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                        >
                            <div
                                className="mt-4 pt-4"
                                style={{ borderTop: `1px solid ${cat.color}20` }}
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Tools */}
                                    <div>
                                        <p
                                            className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
                                            style={{ color: cat.color, opacity: 0.7 }}
                                        >
                                            Tools
                                        </p>
                                        <div className="flex flex-col gap-1.5">
                                            {cat.tools.map((tool, i) => (
                                                <motion.div
                                                    key={tool}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.06 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className="w-1 h-1 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: cat.color }}
                                                    />
                                                    <span className="text-[11px] text-neutral-400">{tool}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Libraries */}
                                    <div>
                                        <p
                                            className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
                                            style={{ color: cat.colorEnd, opacity: 0.7 }}
                                        >
                                            Libraries
                                        </p>
                                        <div className="flex flex-col gap-1.5">
                                            {cat.libraries.map((lib, i) => (
                                                <motion.div
                                                    key={lib}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.06 + 0.1 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className="w-1 h-1 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: cat.colorEnd }}
                                                    />
                                                    <span className="text-[11px] text-neutral-400">{lib}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar for overall proficiency */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[9px] tracking-widest uppercase text-neutral-500">
                                            Overall Proficiency
                                        </span>
                                        <span
                                            className="text-[10px] font-bold tabular-nums"
                                            style={{ color: cat.color }}
                                        >
                                            {Math.round(
                                                cat.skills.reduce((s, sk) => s + sk.level, 0) / cat.skills.length
                                            )}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${Math.round(
                                                    cat.skills.reduce((s, sk) => s + sk.level, 0) / cat.skills.length
                                                )}%`,
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: `linear-gradient(90deg, ${cat.color}, ${cat.colorEnd})`,
                                                boxShadow: `0 0 8px ${cat.color}80`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Animated bottom shimmer border on hover / active */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isActive ? 1 : 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                    background: `linear-gradient(90deg, ${cat.color}, ${cat.colorEnd})`,
                    transformOrigin: "left",
                }}
            />
        </motion.div>
    );
}

// ===========================================================================
// MAIN EXPORT — drop-in replacement for ProjectsSkills()
// ===========================================================================
export function ProjectsSkills() {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
    const [filterTab, setFilterTab] = React.useState<string | null>(null);

    const displayed = filterTab
        ? SKILL_CATEGORIES.filter((c) => c.label === filterTab)
        : SKILL_CATEGORIES;

    const handleToggle = (label: string) => {
        setActiveCategory((prev) => (prev === label ? null : label));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full mt-32 px-4 pb-4"
            style={{ minHeight: "800px" }}
        >
            {/* ── Rotating orb background ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ minHeight: "100%", height: "100%" }}
                aria-hidden
            >
                {ORB_POSITIONS.map((orb, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            top: orb.top,
                            left: orb.left,
                            width: orb.w,
                            height: orb.h,
                            background: `radial-gradient(circle, ${orb.color}55 0%, transparent 70%)`,
                            filter: "blur(60px)",
                        }}
                        animate={{
                            x: [0, 30, -20, 15, 0],
                            y: [0, -20, 25, -10, 0],
                            scale: [1, 1.08, 0.94, 1.04, 1],
                            opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
                        }}
                        transition={{
                            duration: orb.dur,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.2,
                        }}
                    />
                ))}

                {/* Slow rotating ring */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: 700, height: 700 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 700 700" width="700" height="700" style={{ opacity: 0.7 }}>
                        <circle cx="350" cy="350" r="300" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="8 12"/>
                        <circle cx="350" cy="350" r="220" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 16"/>
                        <circle cx="350" cy="350" r="140" fill="none" stroke="#f472b6" strokeWidth="1.2" strokeDasharray="2 20"/>
                    </svg>
                </motion.div>

                {/* Counter-rotating inner ring */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: 500, height: 500 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 500 500" width="500" height="500" style={{ opacity: 0.6 }}>
                        <circle cx="250" cy="250" r="200" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 9"/>
                        <circle cx="250" cy="250" r="120" fill="none" stroke="#fb923c" strokeWidth="1.2" strokeDasharray="5 15"/>
                    </svg>
                </motion.div>
            </div>

            {/* ── Section heading ── */}
            <div className="relative text-center mb-16">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4"
                >
                    What I Work With
                </motion.p>
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: 60, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none"
                    >
                        Skills &amp;
                    </motion.h2>
                </div>
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: 60, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1"
                    >
                        <span
                            className="font-serif italic"
                            style={{
                                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f472b6 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Technologies
                        </span>
                    </motion.h2>
                </div>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mx-auto mt-8 h-px w-32 origin-center"
                    style={{
                        background: "linear-gradient(90deg, transparent, #818cf8, #38bdf8, transparent)",
                    }}
                />
            </div>

            {/* ── Filter tabs ── */}
            <div className="relative flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto">
                <button
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border backdrop-blur-md ${filterTab === null ? "bg-black/10 dark:bg-white/10 text-black dark:text-white border-black/20 dark:border-white/20 shadow-sm" : "bg-black/[0.02] dark:bg-white/[0.04] border-black/5 dark:border-white/[0.08] text-neutral-500 dark:text-white/40"}`}
                >
                    All
                </button>

                {SKILL_CATEGORIES.map((cat) => (
                    <button
                        key={cat.label}
                        onClick={() => {
                            setFilterTab((prev) => (prev === cat.label ? null : cat.label));
                            setActiveCategory(null);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border backdrop-blur-md ${filterTab === cat.label ? "text-white border-transparent" : "bg-black/[0.02] dark:bg-white/[0.04] border-black/5 dark:border-white/[0.08] text-neutral-500 dark:text-white/40"}`}
                        style={
                            filterTab === cat.label
                                ? {
                                      background: `linear-gradient(135deg, ${cat.color}, ${cat.colorEnd})`,
                                      boxShadow: `0 0 18px ${cat.color}50`,
                                  }
                                : {}
                        }
                    >
                        <span style={{ color: filterTab === cat.label ? "white" : cat.color }}>
                            {cat.icon}
                        </span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* ── Cards grid ── */}
            <div className="relative w-full max-w-5xl mx-auto">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={filterTab ?? "all"}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className={`grid gap-4 ${
                            filterTab
                                ? "grid-cols-1 max-w-2xl mx-auto"
                                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        }`}
                    >
                        {displayed.map((cat, ci) => (
                            <CategoryCard
                                key={cat.label}
                                cat={cat}
                                isActive={activeCategory === cat.label}
                                onToggle={() => handleToggle(cat.label)}
                                cardIndex={ci}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Hint text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-[11px] text-neutral-600 mt-8 tracking-wide"
                >
                    Click any card to expand tools, libraries &amp; proficiency
                </motion.p>
            </div>
        </motion.div>
    );
}
