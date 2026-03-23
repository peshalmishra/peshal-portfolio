"use client";

import React, {
    useState, useEffect, useMemo, useRef, useCallback,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FALLBACK_REPOS } from "../data/fallbackRepos";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Repo {
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count: number;
    html_url: string;
    updated_at: string;
    created_at: string;
    topics: string[];
    fork: boolean;
    size: number;
    homepage: string | null;
}

type SortKey = "updated" | "stars" | "forks" | "name";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Go: "#00ADD8", Java: "#b07219", Rust: "#dea584", "C++": "#f34b7d",
    C: "#555555", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
    Kotlin: "#A97BFF", Swift: "#F05138", Ruby: "#701516",
    PHP: "#4F5D95", Dart: "#00B4AB", Vue: "#41b883", Svelte: "#ff3e00",
};
const langColor = (lang: string | null) =>
    lang && LANG_COLORS[lang] ? LANG_COLORS[lang] : "#8b8b8b";

const timeAgo = (dateStr: string) => {
    const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (secs < 60)       return `${secs}s ago`;
    if (secs < 3600)     return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400)    return `${Math.floor(secs / 3600)}h ago`;
    if (secs < 2592000)  return `${Math.floor(secs / 86400)}d ago`;
    if (secs < 31536000) return `${Math.floor(secs / 2592000)}mo ago`;
    return `${Math.floor(secs / 31536000)}y ago`;
};

// Guess repo type from topics / name
function repoType(repo: Repo): { label: string; emoji: string; color: string } {
    const t = [...(repo.topics ?? []), repo.name].join(" ").toLowerCase();
    if (t.match(/frontend|react|vue|svelte|next|ui|web/))
        return { label: "Frontend", emoji: "🌐", color: "#60A5FA" };
    if (t.match(/backend|api|server|express|fastapi|django|spring|go|grpc/))
        return { label: "Backend", emoji: "⚙️", color: "#34D399" };
    if (t.match(/ml|ai|nlp|model|tensorflow|pytorch|llm|gpt/))
        return { label: "AI / ML", emoji: "🧠", color: "#A78BFA" };
    if (t.match(/cli|tool|script|util|automation/))
        return { label: "Tooling", emoji: "🛠", color: "#FBBF24" };
    if (t.match(/practice|leetcode|algo|dsa|kata|challenge/))
        return { label: "Practice", emoji: "🧪", color: "#F87171" };
    return { label: "Project", emoji: "🚀", color: "#6EE7B7" };
}

// ---------------------------------------------------------------------------
// GithubIcon
// ---------------------------------------------------------------------------
const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

// ---------------------------------------------------------------------------
// Count-up hook
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1200) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, target, duration]);
    return { ref, value };
}

// ---------------------------------------------------------------------------
// Stat Dashboard Cards
// ---------------------------------------------------------------------------
function StatCard({
    label, value, icon, color, bg, delay = 0,
}: {
    label: string; value: number; icon: React.ReactNode;
    color: string; bg: string; delay?: number;
}) {
    const { ref, value: animated } = useCountUp(value, 1400);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.45 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative rounded-2xl overflow-hidden p-5 flex flex-col gap-3 bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.07]"
            style={{
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 0 0 ${color}`,
            }}
        >
            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 10% 20%, ${color}12 0%, transparent 65%)` }} />

            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}
                style={{ color }}>
                {icon}
            </div>
            <span ref={ref} className="text-3xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
                {animated.toLocaleString()}
            </span>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500">{label}</p>

            {/* Bottom accent */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.35 }}
                style={{ background: `linear-gradient(90deg, ${color}, transparent)`, originX: 0 }}
            />
        </motion.div>
    );
}

function StatChips({ repos }: { repos: Repo[] }) {
    const totalStars  = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks  = repos.reduce((s, r) => s + r.forks_count, 0);
    const totalIssues = repos.reduce((s, r) => s + r.open_issues_count, 0);

    const stats = [
        {
            label: "Public Repos", value: repos.length, delay: 0,
            color: "#60A5FA", bg: "bg-blue-500/10",
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
            ),
        },
        {
            label: "Total Stars", value: totalStars, delay: 0.07,
            color: "#FBBF24", bg: "bg-yellow-500/10",
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            ),
        },
        {
            label: "Total Forks", value: totalForks, delay: 0.14,
            color: "#A78BFA", bg: "bg-purple-500/10",
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/>
                    <circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
                    <path d="M18 9a9 9 0 0 1-9 9"/>
                </svg>
            ),
        },
        {
            label: "Open Issues", value: totalIssues, delay: 0.21,
            color: "#34D399", bg: "bg-emerald-500/10",
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Language Stats (animated bars + insight)
// ---------------------------------------------------------------------------
function LanguageStats({ repos }: { repos: Repo[] }) {
    const [hovered, setHovered] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true });

    const langMap = useMemo(() => {
        const map: Record<string, number> = {};
        repos.forEach((r) => { if (r.language) map[r.language] = (map[r.language] ?? 0) + 1; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 7);
    }, [repos]);

    const total = langMap.reduce((s, [, n]) => s + n, 0);
    const mostUsed = langMap[0]?.[0] ?? "—";
    const recentLangs = useMemo(() => {
        const sorted = [...repos].filter((r) => r.language)
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5).map((r) => r.language!);
        return [...new Set(sorted)].slice(0, 2);
    }, [repos]);

    return (
        <div ref={ref} className="rounded-2xl flex flex-col overflow-hidden bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.07]"
            style={{
                backdropFilter: "blur(14px)",
            }}>
            <div className="p-6 flex flex-col gap-5 flex-1">
                <p className="text-[10px] font-bold tracking-[0.18em] text-neutral-500 uppercase">Top Languages</p>

                {/* Segmented bar */}
                <div className="flex h-2.5 rounded-full overflow-hidden gap-[2px]">
                    {langMap.map(([lang, count]) => (
                        <motion.div
                            key={lang}
                            className="h-full first:rounded-l-full last:rounded-r-full cursor-pointer transition-opacity duration-200"
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${(count / total) * 100}%` } : { width: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                            style={{
                                backgroundColor: langColor(lang),
                                opacity: hovered === null || hovered === lang ? 1 : 0.25,
                                boxShadow: hovered === lang ? `0 0 8px ${langColor(lang)}88` : "none",
                            }}
                            title={`${lang}: ${((count / total) * 100).toFixed(1)}%`}
                            onMouseEnter={() => setHovered(lang)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="space-y-2.5">
                    {langMap.map(([lang, count], i) => (
                        <motion.div
                            key={lang}
                            initial={{ opacity: 0, x: -12 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.1 + i * 0.06 }}
                            className="flex items-center justify-between group cursor-pointer"
                            onMouseEnter={() => setHovered(lang)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ opacity: hovered === null || hovered === lang ? 1 : 0.4, transition: "opacity 0.2s" }}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-black/20"
                                    style={{
                                        backgroundColor: langColor(lang),
                                        boxShadow: hovered === lang ? `0 0 8px ${langColor(lang)}` : "none",
                                    }} />
                                <span className="text-sm text-neutral-800 dark:text-neutral-300 truncate">{lang}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <div className="w-20 h-1 rounded-full overflow-hidden bg-white/5">
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={inView ? { width: `${(count / total) * 100}%` } : {}}
                                        transition={{ duration: 1, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                                        style={{ backgroundColor: langColor(lang) }}
                                    />
                                </div>
                                <span className="text-xs text-neutral-500 w-8 text-right tabular-nums">
                                    {((count / total) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Insight footer */}
            <div className="mx-6 pt-4 pb-5 border-t border-white/[0.06] space-y-1.5">
                <p className="text-[11px] text-neutral-400">
                    <span className="text-neutral-200 font-semibold">Most used:</span>{" "}
                    <span style={{ color: langColor(mostUsed) }}>{mostUsed}</span>
                </p>
                <p className="text-[11px] text-neutral-400">
                    <span className="text-neutral-200 font-semibold">Recently active:</span>{" "}
                    {recentLangs.map((l, i) => (
                        <span key={l} style={{ color: langColor(l) }}>{l}{i < recentLangs.length - 1 ? ", " : ""}</span>
                    ))}
                </p>
                <p className="text-[10px] text-neutral-600">Across {repos.length} public repos</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Contribution Graph (enhanced)
// ---------------------------------------------------------------------------
function ContributionGraph() {
    const [weeks, setWeeks] = useState<{ days: { count: number; date: string }[] }[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

    // Streak calculation
    const { currentStreak, bestStreak } = useMemo(() => {
        const allDays = weeks.flatMap((w) => w.days).reverse();
        let cur = 0, best = 0, run = 0;
        for (const d of allDays) {
            if (d.count > 0) { run++; best = Math.max(best, run); }
            else run = 0;
        }
        // current streak from today backward
        const flat = weeks.flatMap((w) => w.days);
        let i = flat.length - 1;
        while (i >= 0 && flat[i].count > 0) { cur++; i--; }
        return { currentStreak: cur, bestStreak: best };
    }, [weeks]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://github-contributions-api.jogruber.de/v4/peshalmishra?y=last");
                if (!res.ok) throw new Error();
                const json = await res.json();
                const contributions: { date: string; count: number }[] = json.contributions;
                const totalCount = Object.values(json.total as Record<string, number>).reduce((a, b) => a + b, 0);
                const grouped: { days: { count: number; date: string }[] }[] = [];
                let week: { count: number; date: string }[] = [];
                contributions.forEach((day: any, i: number) => {
                    week.push({ count: day.count, date: day.date });
                    if (week.length === 7 || i === contributions.length - 1) { grouped.push({ days: week }); week = []; }
                });
                setWeeks(grouped); setTotal(totalCount);
            } catch { setError(true); }
            finally { setLoading(false); }
        })();
    }, []);

    const cellStyle = (count: number) => {
        if (count === 0) return { bg: "rgba(255,255,255,0.05)", glow: "none" };
        if (count <= 2)  return { bg: "#0e4429", glow: "none" };
        if (count <= 5)  return { bg: "#006d32", glow: "0 0 4px rgba(34,197,94,0.35)" };
        if (count <= 10) return { bg: "#26a641", glow: "0 0 6px rgba(34,197,94,0.55)" };
        return                   { bg: "#39d353", glow: "0 0 8px rgba(34,197,94,0.75), 0 0 16px rgba(34,197,94,0.35)" };
    };

    const monthLabels = useMemo(() => {
        if (!weeks.length) return [];
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const labels: { month: string }[] = [];
        let lastMonth = -1;
        weeks.forEach((week) => {
            if (!week.days[0]) return;
            const m = new Date(week.days[0].date).getMonth();
            if (m !== lastMonth) { labels.push({ month: MONTHS[m] }); lastMonth = m; }
        });
        return labels;
    }, [weeks]);

    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.07]"
            style={{
                backdropFilter: "blur(14px)",
            }}>
            {/* Background glow behind graph */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(34,197,94,0.07) 0%, transparent 70%)", filter: "blur(20px)" }} />

            <div className="relative p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <GithubIcon className="w-5 h-5 text-neutral-900 dark:text-white" />
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            {loading ? "Loading…"
                                : error ? "Could not load contributions"
                                : <><span className="font-bold text-neutral-900 dark:text-white">{total?.toLocaleString()}</span> contributions in the last year</>}
                        </p>
                    </div>

                    {/* Streak counters */}
                    {!loading && !error && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}>
                                🔥 Current streak: <span className="tabular-nums">{currentStreak}d</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                style={{ background: "rgba(250,204,21,0.10)", border: "1px solid rgba(250,204,21,0.2)", color: "#fbbf24" }}>
                                🚀 Best: <span className="tabular-nums">{bestStreak}d</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 mb-4">
                    <span>Less</span>
                    {[
                        "rgba(255,255,255,0.05)", "#0e4429", "#006d32", "#26a641", "#39d353"
                    ].map((bg, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ background: bg }} />
                    ))}
                    <span>More</span>
                </div>

                {loading && (
                    <div className="h-32 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-green-500/40 border-t-green-500 rounded-full animate-spin" />
                    </div>
                )}
                {error && <p className="text-center text-sm text-neutral-500 py-8">Unable to load GitHub data.</p>}

                {!loading && !error && (
                    <div className="overflow-x-auto relative">
                        {/* Tooltip */}
                        {tooltip && (
                            <div className="fixed z-50 pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xl"
                                style={{
                                    left: tooltip.x + 12, top: tooltip.y - 36,
                                    background: "rgba(10,10,14,0.95)", border: "1px solid rgba(255,255,255,0.12)",
                                    backdropFilter: "blur(10px)",
                                }}>
                                {tooltip.text}
                            </div>
                        )}

                        <div className="min-w-max">
                            <div className="flex mb-1 ml-8">
                                {monthLabels.map((m, i) => (
                                    <div key={i} className="text-[10px] text-neutral-500"
                                        style={{ width: `${(weeks.length / monthLabels.length) * 13}px`, minWidth: 28 }}>
                                        {m.month}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-[3px]">
                                {/* Day labels */}
                                <div className="flex flex-col gap-[3px] mr-1 justify-between py-0.5" style={{ width: 28 }}>
                                    {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                                        <span key={i} className="text-[10px] text-neutral-600 leading-none" style={{ height: 11 }}>{d}</span>
                                    ))}
                                </div>
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="flex flex-col gap-[3px]">
                                        {week.days.map((day, di) => {
                                            const { bg, glow } = cellStyle(day.count);
                                            return (
                                                <div
                                                    key={di}
                                                    className="w-[11px] h-[11px] rounded-sm cursor-default transition-transform hover:scale-125"
                                                    style={{ background: bg, boxShadow: glow }}
                                                    onMouseEnter={(e) => setTooltip({
                                                        x: e.clientX, y: e.clientY,
                                                        text: `${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`,
                                                    })}
                                                    onMouseLeave={() => setTooltip(null)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Premium Repo Card
// ---------------------------------------------------------------------------
function RepoCard({ repo, index, featured = false }: { repo: Repo; index: number; featured?: boolean }) {
    const [hovered, setHovered] = useState(false);
    const color = langColor(repo.language);
    const type = repoType(repo);
    const hasLive = repo.homepage && repo.homepage.startsWith("http");

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ delay: index * 0.04, duration: 0.38, ease: "easeOut" }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ y: -6, scale: featured ? 1.015 : 1.02 }}
            className="relative group rounded-2xl overflow-hidden flex flex-col bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.07]"
            style={{
                backdropFilter: "blur(14px)",
                boxShadow: hovered
                    ? `0 16px 40px rgba(0,0,0,0.25), 0 0 0 1px ${color}30, 0 0 30px ${color}14`
                    : "0 4px 16px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.3s ease",
                minHeight: featured ? 240 : 200,
            }}
        >
            {/* Language accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] transition-opacity"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)`, opacity: hovered ? 1 : 0.5 }} />

            {/* Spotlight glow */}
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(ellipse at 10% 0%, ${color}10 0%, transparent 60%)`,
                    opacity: hovered ? 1 : 0,
                }} />

            {/* Hover CTA overlay */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-end justify-center pb-5 z-20 gap-3"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }}
                    >
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${color}cc, ${color}88)`, backdropFilter: "blur(8px)" }}>
                            <GithubIcon className="w-3.5 h-3.5" /> Code
                        </a>
                        {hasLive && (
                            <a href={repo.homepage!} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                                🔗 Live
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative p-5 flex flex-col h-full z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}18`, color }}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate transition-colors group-hover:text-black dark:group-hover:text-white"
                            style={{ color: hovered ? color : undefined }}>
                            {repo.name}
                        </p>
                    </div>

                    {/* Type badge */}
                    <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide border"
                        style={{ color: type.color, background: `${type.color}12`, border: `1px solid ${type.color}25` }}>
                        {type.emoji} {type.label}
                    </span>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed text-neutral-500 mb-3 ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
                    {repo.description ?? "No description provided."}
                </p>

                {/* Topics */}
                {repo.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {repo.topics.slice(0, featured ? 5 : 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold border"
                                style={{ color, background: `${color}0d`, border: `1px solid ${color}25` }}>
                                {t}
                            </span>
                        ))}
                        {repo.topics.length > (featured ? 5 : 3) && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] text-neutral-600 border border-white/8">
                                +{repo.topics.length - (featured ? 5 : 3)}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer stats */}
                <div className="flex items-center gap-3 text-xs mt-auto pt-3 border-t border-white/[0.05]">
                    {repo.language && (
                        <span className="flex items-center gap-1.5 font-semibold" style={{ color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }} />
                            {repo.language}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-neutral-500">
                        <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span className="tabular-nums">{repo.stargazers_count}</span>
                    </span>
                    <span className="flex items-center gap-1 text-neutral-500">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
                            <path d="M18 9a9 9 0 0 1-9 9"/>
                        </svg>
                        <span className="tabular-nums">{repo.forks_count}</span>
                    </span>
                    <span className="ml-[10px] text-[10px] text-neutral-600 tabular-nums">{timeAgo(repo.updated_at)}</span>
                </div>
            </div>

            {/* Bottom shimmer */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                style={{ background: `linear-gradient(90deg, ${color}, ${color}44)`, originX: 0 }}
            />
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Repo Grid with smart animated sort
// ---------------------------------------------------------------------------
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "updated", label: "Recent" },
    { key: "stars",   label: "Stars"  },
    { key: "forks",   label: "Forks"  },
    { key: "name",    label: "A–Z"    },
];

function RepoGrid({ repos }: { repos: Repo[] }) {
    const [sortBy, setSortBy] = useState<SortKey>("updated");
    const [showAll, setShowAll] = useState(false);

    const sorted = useMemo(() => {
        const base = [...repos].filter((r) => !r.fork);
        switch (sortBy) {
            case "stars": return base.sort((a, b) => b.stargazers_count - a.stargazers_count);
            case "forks": return base.sort((a, b) => b.forks_count - a.forks_count);
            case "name":  return base.sort((a, b) => a.name.localeCompare(b.name));
            default:      return base.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        }
    }, [repos, sortBy]);

    const PAGE = 7;
    const visible = showAll ? sorted : sorted.slice(0, PAGE);
    const [featured, ...rest] = visible;

    return (
        <div className="rounded-2xl overflow-hidden"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 pb-0">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-neutral-500 uppercase">Repositories</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{sorted.length} original repos</p>
                </div>

                {/* Animated sort pills */}
                <div className="relative flex items-center gap-0.5 p-1 rounded-xl self-start sm:self-auto"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => { setSortBy(opt.key); setShowAll(false); }}
                            className="relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 z-10"
                            style={{ color: sortBy === opt.key ? "#fff" : "rgba(255,255,255,0.35)" }}
                        >
                            {sortBy === opt.key && (
                                <motion.span
                                    layoutId="sort-indicator"
                                    className="absolute inset-0 rounded-lg"
                                    style={{ background: "rgba(255,255,255,0.09)" }}
                                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                />
                            )}
                            <span className="relative">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            <div className="p-4">
                <AnimatePresence mode="popLayout">
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {featured && (
                            <div className="sm:col-span-2 lg:col-span-1">
                                <RepoCard key={`${featured.name}-${sortBy}-f`} repo={featured} index={0} featured />
                            </div>
                        )}
                        {rest.map((repo, i) => (
                            <RepoCard key={`${repo.name}-${sortBy}`} repo={repo} index={i + 1} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {sorted.length > PAGE && (
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAll((p) => !p)}
                        className="mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        style={{
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.45)",
                            background: "rgba(255,255,255,0.02)",
                        }}>
                        {showAll
                            ? <>Show less <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg></>
                            : <>Show {sorted.length - PAGE} more <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></>
                        }
                    </motion.button>
                )}

                <a href="https://github.com/peshalmishra" target="_blank" rel="noopener noreferrer"
                    className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)" }}>
                    <GithubIcon className="w-4 h-4" />
                    View all on GitHub
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main GitHubActivity export
// ---------------------------------------------------------------------------
export function GitHubActivity() {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://api.github.com/users/peshalmishra/repos?sort=updated&per_page=100&type=public");
                if (!res.ok) throw new Error();
                setRepos(await res.json());
            } catch { 
                console.warn("GitHub API rate limit reached. Using local fallback repositories datastore.");
                setRepos(FALLBACK_REPOS as any); 
            }
            finally { setLoading(false); }
        })();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full mt-32 px-4"
        >
            {/* Section heading */}
            <div className="text-center mb-16">
                <p className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">My Code Journey</p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
                    GitHub Activity
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1">
                    <span className="font-serif italic" style={{
                        background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        && Open Source
                    </span>
                </h2>
                {/* Narrative */}
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                    Actively building and experimenting with real-world projects and open-source contributions.
                </motion.p>
            </div>

            <div className="w-full max-w-5xl mx-auto space-y-4">
                {/* Contribution heatmap */}
                <ContributionGraph />

                {/* Stat dashboard */}
                {!loading && repos.length > 0 && <StatChips repos={repos} />}

                {/* Repos + Language sidebar */}
                {!loading && repos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="md:col-span-2">
                            <RepoGrid repos={repos} />
                        </div>
                        <div className="md:sticky md:top-8">
                            <LanguageStats repos={repos} />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
