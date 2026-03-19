"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const ALL_POSTS = [
    {
        title:       "Why Scaling Microservices is Harder Than You Think",
        date:        "Feb 24, 2026",
        readTime:    "6 min read",
        description: "Discussing common pitfalls in distributed systems, including split-brain scenarios and network partitions.",
        link:        "#",
        tags:        ["architecture", "backend", "cloud"],
    },
    {
        title:       "Optimizing DynamoDB for High-Throughput Workloads",
        date:        "Jan 12, 2026",
        readTime:    "8 min read",
        description: "A deep dive into partition keys, GSI overloading, and handling hot partitions in DynamoDB.",
        link:        "#",
        tags:        ["database", "aws", "backend"],
    },
    {
        title:       "From React to Rust: A Backend Journey",
        date:        "Dec 05, 2025",
        readTime:    "5 min read",
        description: "How transitioning some of our core BFF logic to memory-safe languages improved latency.",
        link:        "#",
        tags:        ["backend", "rust", "performance"],
    },
    {
        title:       "Kubernetes Cost Optimization in Production",
        date:        "Nov 18, 2025",
        readTime:    "7 min read",
        description: "Practical strategies to reduce cloud spend without sacrificing reliability or performance.",
        link:        "#",
        tags:        ["cloud", "kubernetes", "devops"],
    },
    {
        title:       "Building Type-Safe APIs with tRPC and Zod",
        date:        "Oct 30, 2025",
        readTime:    "6 min read",
        description: "End-to-end type safety without code generation — how tRPC changed the way I build full-stack apps.",
        link:        "#",
        tags:        ["typescript", "backend", "api"],
    },
    {
        title:       "The Real Cost of Over-Engineering",
        date:        "Oct 05, 2025",
        readTime:    "4 min read",
        description: "When abstraction becomes a liability — lessons learned from building systems that were too clever.",
        link:        "#",
        tags:        ["engineering", "architecture"],
    },
];

const ALL_TAGS = ["All Posts", ...Array.from(new Set(ALL_POSTS.flatMap((p) => p.tags)))];

// ---------------------------------------------------------------------------
// Custom circular cursor
// ---------------------------------------------------------------------------

function BlogCursor() {
    const cursorX  = useMotionValue(-200);
    const cursorY  = useMotionValue(-200);
    const [active, setActive] = useState(false);

    const springConfig = { stiffness: 150, damping: 18, mass: 0.5 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        const enter = () => setActive(true);
        const leave = () => setActive(false);

        // Only show cursor when hovering a card
        const cards = document.querySelectorAll("[data-blog-card]");
        cards.forEach((c) => {
            c.addEventListener("mouseenter", enter);
            c.addEventListener("mouseleave", leave);
        });

        window.addEventListener("mousemove", move);
        return () => {
            window.removeEventListener("mousemove", move);
            cards.forEach((c) => {
                c.removeEventListener("mouseenter", enter);
                c.removeEventListener("mouseleave", leave);
            });
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 z-[200] pointer-events-none select-none flex items-center justify-center"
            style={{
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.div
                animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center"
            >
                {/* Rotating text ring */}
                <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 80 80"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                    <defs>
                        <path id="circle-path" d="M 40,40 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" />
                    </defs>
                    <text fontSize="8.5" fontWeight="600" letterSpacing="2.5" fill="#111" textAnchor="middle">
                        <textPath href="#circle-path" startOffset="0%">
                            READ ARTICLE • READ ARTICLE •
                        </textPath>
                    </text>
                </motion.svg>
                {/* Eye icon */}
                <svg className="w-5 h-5 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            </motion.div>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Blog card
// ---------------------------------------------------------------------------

function BlogCard({ post, index }: { post: typeof ALL_POSTS[0]; index: number }) {
    return (
        <motion.a
            href={post.link}
            data-blog-card
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
            className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/80 dark:bg-white/4 hover:bg-neutral-50 dark:hover:bg-white/8 p-7 cursor-none transition-colors duration-300 min-h-[280px]"
            style={{ backdropFilter: "blur(8px)" }}
        >
            {/* Top row — date + arrow */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500 font-medium uppercase tracking-wide">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                    <span>{post.readTime}</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-neutral-300 dark:border-white/15 flex items-center justify-center text-neutral-400 dark:text-white/40 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:border-neutral-500 dark:group-hover:border-white/50 group-hover:bg-neutral-100 dark:group-hover:bg-white/10 transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Title + description */}
            <div className="flex-1">
                <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white leading-snug mb-3 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors">
                    {post.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed line-clamp-3">
                    {post.description}
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/5"
                    >
                        {tag}
                    </span>
                ))}
                {post.tags.length > 3 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-neutral-200 dark:border-white/10 text-neutral-400 dark:text-neutral-500">
                        +{post.tags.length - 3}
                    </span>
                )}
            </div>
        </motion.a>
    );
}

// ---------------------------------------------------------------------------
// Main Blog component
// ---------------------------------------------------------------------------

export function Blog() {
    const [search,      setSearch]      = useState("");
    const [activeTag,   setActiveTag]   = useState("All Posts");
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = ALL_POSTS.filter((p) => {
        const matchTag    = activeTag === "All Posts" || p.tags.includes(activeTag.toLowerCase());
        const matchSearch = search === "" ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchTag && matchSearch;
    });

    return (
        <>
            <BlogCursor />

            <div id="blog" className="w-full" style={{ cursor: "none" }}>

                {/* ── Hero ──────────────────────────────────────────────────── */}
                <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="font-black uppercase text-neutral-900 dark:text-white select-none w-full"
                            style={{
                                fontSize:      "clamp(5rem, 20vw, 18rem)",
                                letterSpacing: "-0.02em",
                                lineHeight:    0.88,
                            }}
                        >
                            BLOGS
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="mt-10 flex flex-col items-center gap-3"
                        >
                            <p className="text-neutral-500 dark:text-white/40 font-semibold uppercase tracking-[0.3em] text-sm sm:text-base">
                                Thoughts, Tutorials, and
                            </p>
                            <p
                                className="font-serif italic text-neutral-900 dark:text-white font-light tracking-tight"
                                style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.1 }}
                            >
                                insights i share.
                            </p>
                        </motion.div>
                    </div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="absolute bottom-12 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-white/25 uppercase">Scroll</span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-px h-8 bg-gradient-to-b from-neutral-400/50 dark:from-white/25 to-transparent"
                        />
                    </motion.div>
                </section>

                {/* ── Search + filter + cards ───────────────────────────────── */}
                <section className="py-16 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">

                    {/* Search + filter row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row gap-4 mb-10"
                    >
                        {/* Search */}
                        <div className="relative flex items-center w-full md:max-w-sm">
                            <Search className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm outline-none focus:border-neutral-400 dark:focus:border-white/25 transition-all"
                                style={{ cursor: "text" }}
                            />
                        </div>

                        {/* Category pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
                            {ALL_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag)}
                                    style={{ cursor: "pointer" }}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                                        activeTag === tag
                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white"
                                            : "bg-white dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white"
                                    }`}
                                >
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Cards grid */}
                    <AnimatePresence mode="wait">
                        {filtered.length > 0 ? (
                            <motion.div
                                key={activeTag + search}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {filtered.map((post, i) => (
                                    <BlogCard key={post.title} post={post} index={i} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.p
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-neutral-500 dark:text-neutral-500 py-24 text-sm"
                            >
                                No posts found for &ldquo;{search}&rdquo;
                            </motion.p>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Competitive Programming & Achievements ───────────────── */}
                <CompetitiveProgramming />

            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Competitive Programming & Achievements
// ---------------------------------------------------------------------------

const CP_PLATFORMS = [
    {
        name:     "LeetCode",
        handle:   "@peshalmishra",
        url:      "https://leetcode.com/peshalmishra",
        color:    "#FFA116",
        gradient: "from-[#FFA116]/20 to-[#FF6B00]/10",
        border:   "border-[#FFA116]/25 hover:border-[#FFA116]/60",
        glow:     "rgba(255,161,22,0.15)",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
        ),
        stats: [
            { label: "Problems Solved",  value: "300+"     },
            { label: "Contest Rating",   value: "Top 25%"  },
        ],
        achievements: [
            "Strong in DSA & algorithms",
            "Top percentile ranking",
            "Solved across all difficulty levels",
        ],
        badge: "Active",
        badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    },
    {
        name:     "HackerRank",
        handle:   "@peshalmishra",
        url:      "https://hackerrank.com/peshalmishra",
        color:    "#00EA64",
        gradient: "from-[#00EA64]/20 to-[#00B050]/10",
        border:   "border-[#00EA64]/25 hover:border-[#00EA64]/60",
        glow:     "rgba(0,234,100,0.15)",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24C10.712 24 2.25 19.114 1.608 18 .963 16.886.963 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm-.236 16.332h-.76v-3.967h-3.2v3.967h-.76V7.668h.76v3.967h3.2V7.668h.76v8.664zm7.044 0h-.924l-3.996-7.311v7.311h-.76V7.668h.924l3.996 7.312V7.668h.76v8.664z"/>
            </svg>
        ),
        stats: [
            { label: "Problem Solving", value: "5★"   },
            { label: "C++",             value: "4★"   },
        ],
        achievements: [
            "5★ in Problem Solving",
            "4★ in C++",
            "Participated in coding challenges",
        ],
        badge: "Gold",
        badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    },
    {
    name: "CodeChef",
    handle: "@peshalmishra",
    url: "https://codechef.com/users/peshalmishra",

    color: "#e8845e",

    gradient: "from-[#e8845e]/25 to-[#c06a3a]/15",

    border: "border-[#e8845e]/30 hover:border-[#e8845e]/70",

    glow: "rgba(232,132,94,0.45)",

    icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
            <path d="M11.257.004C5.22-.114.1 4.838 0 10.875v.148c.077 3.293 1.7 6.35 4.376 8.316L3.43 21.13c-.252.555-.005 1.21.55 1.46a1.073 1.073 0 0 0 1.283-.31l1.364-1.736a11.547 11.547 0 0 0 5.573 1.453c1.56.005 3.103-.317 4.532-.946l1.35 1.726c.37.475 1.05.56 1.525.188a1.073 1.073 0 0 0 .217-1.413l-.022-.029-.91-1.165c2.685-1.974 4.307-5.044 4.376-8.344C24.1 5.977 19.41.67 13.372.061a11.587 11.587 0 0 0-2.115-.057zm.743 1.984c5.046-.05 9.194 3.952 9.306 8.997.088 4.02-2.46 7.644-6.253 9.018l-1.302-1.662c-.37-.474-1.05-.56-1.524-.19-.475.37-.56 1.05-.19 1.525l.021.028.499.637a9.598 9.598 0 0 1-4.704-.056l.513-.658c.37-.474.284-1.154-.19-1.524s-1.154-.285-1.524.19L5.32 19.905c-3.78-1.377-6.32-5.003-6.229-9.028C-.776 5.776 3.5 1.697 8.545 1.81c1.15-.02 1.15-.02 3.455-.022z"/>
        </svg>
    ),

    stats: [
        { label: "Rating", value: "1600+" },
        { label: "Division", value: "Div. 2" },
    ],

    achievements: [
        "Competitive programming contests",
        "Regular long challenge participant",
        "Strong algorithmic thinking",
    ],

    badge: "Rated",

    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    },
    {
        name:     "Codeforces",
        handle:   "@peshalmishra",
        url:      "https://codeforces.com/profile/peshalmishra",
        color:    "#1F8ACB",
        gradient: "from-[#1F8ACB]/20 to-[#0d5fa1]/10",
        border:   "border-[#1F8ACB]/25 hover:border-[#1F8ACB]/60",
        glow:     "rgba(31,138,203,0.15)",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9A1.5 1.5 0 0 1 1.5 7.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5A1.5 1.5 0 0 1 22.5 21h-3A1.5 1.5 0 0 1 18 19.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"/>
            </svg>
        ),
        stats: [
            { label: "Max Rating", value: "1400+" },
            { label: "Rank",       value: "Specialist" },
        ],
        achievements: [
            "Specialist rank achieved",
            "100+ problems solved",
            "Consistent contest participation",
        ],
        badge: "Specialist",
        badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    },
];

function CompetitiveProgramming() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto"
        >
            {/* Heading */}
            <div className="text-center mb-16">
                <p className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 dark:text-neutral-500 uppercase mb-4">
                    Problem Solving
                </p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                    Competitive
                </h2>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mt-1">
                    <span
                        className="font-serif italic"
                        style={{
                            background: "linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#f97316 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor:  "transparent",
                            backgroundClip:       "text",
                        }}
                    >
                        Programming &amp; Achievements
                    </span>
                </h2>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {CP_PLATFORMS.map((platform, i) => (
                    <motion.div
                        key={platform.name}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                        className={`group relative flex flex-col rounded-2xl border bg-white/60 dark:bg-white/3 backdrop-blur-md p-6 transition-all duration-300 overflow-hidden ${platform.border}`}
                        style={{ boxShadow: `0 0 0 0 ${platform.glow}` }}
                        whileHover={{ y: -4, boxShadow: `0 20px 40px ${platform.glow}` }}
                    >
                        {/* Gradient background blob */}
                        <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${platform.gradient} pointer-events-none`}
                        />

                        {/* Platform icon + name */}
                        <div className="relative z-10 flex items-center gap-3 mb-5">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${platform.color}20`, color: platform.color }}
                            >
                                {platform.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                                    {platform.name}
                                </h3>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-500 font-mono">
                                    {platform.handle}
                                </p>
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="relative z-10 mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${platform.badgeColor}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {platform.badge}
                            </span>
                        </div>

                        {/* Stats row */}
                        <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
                            {platform.stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl p-3 border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/4"
                                >
                                    <p className="text-[10px] text-neutral-500 dark:text-neutral-500 mb-1 font-medium">
                                        {stat.label}
                                    </p>
                                    <p className="text-sm font-black text-neutral-900 dark:text-white" style={{ color: platform.color }}>
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Achievements list */}
                        <ul className="relative z-10 space-y-2 mb-6 flex-1">
                            {platform.achievements.map((ach) => (
                                <li key={ach} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                    <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: platform.color }} />
                                    {ach}
                                </li>
                            ))}
                        </ul>

                        {/* View profile button */}
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold tracking-wide border transition-all duration-200 group/btn"
                            style={{
                                borderColor: `${platform.color}40`,
                                color:        platform.color,
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.background = `${platform.color}18`;
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = platform.color;
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${platform.color}40`;
                            }}
                        >
                            View Profile
                            <svg className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}