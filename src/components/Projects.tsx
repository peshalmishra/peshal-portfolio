"use client";

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
    {
        title: "Cloud-Native E-Commerce Platform",
        description: "A highly resilient microservices architecture handling large-scale traffic, built with Spring Boot, Kafka, and Kubernetes.",
        tech: ["Java", "Spring Boot", "Kafka", "Docker", "AWS EKS"],
        github: "#",
        live: "#",
        // Server room / cloud infrastructure
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Server infrastructure for cloud-native e-commerce platform",
    },
    {
        title: "Outfit Accessories Recommender",
        description: "An AI-powered outfit and accessories recommendation system that analyzes user preferences and trends.",
        tech: ["React", "Node.js", "Express", "MongoDB", "AI/ML"],
        github: "#",
        live: "#",
        // Fashion / style flat lay
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Fashion accessories for AI outfit recommender",
    },
    {
        title: "Serverless Analytics Pipeline",
        description: "Real-time log ingestion and analytics pipeline using AWS Lambda, Kinesis, and DynamoDB.",
        tech: ["Node.js", "AWS Lambda", "Kinesis", "Terraform", "DynamoDB"],
        github: "#",
        live: "#",
        // Data / analytics dashboard
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Analytics dashboard for serverless pipeline",
    },
    {
        title: "Distributed Caching System",
        description: "A custom distributed LRU caching layer in Go, reducing database reads by 80% under peak load.",
        tech: ["Go", "gRPC", "Redis", "Prometheus", "Grafana"],
        github: "#",
        live: "#",
        // Network / speed / connections
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Network connections representing distributed caching",
    },
    {
        title: "Real-Time Collaboration Whiteboard",
        description: "A high-performance simultaneous multi-user canvas using WebSockets for real-time state synchronization.",
        tech: ["React", "Node.js", "Socket.io", "Redis", "Canvas API"],
        github: "#",
        live: "#",
        // Collaboration / whiteboard / workspace
        image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Collaboration workspace for real-time whiteboard",
    },
    {
        title: "AI-Powered API Gateway",
        description: "Intelligent gateway providing predictive caching and anomaly detection for microservice architectures.",
        tech: ["Python", "FastAPI", "Docker", "PostgreSQL", "TensorFlow"],
        github: "#",
        live: "#",
        // AI / neural network / tech
        image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80&auto=format&fit=crop",
        imageAlt: "AI neural network for intelligent API gateway",
    },
];

export function Projects() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    // Touch tracking refs for swipe support
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }, []);

    // FIX 1: Respect prefers-reduced-motion; auto-rotate only when not hovering
    useEffect(() => {
        if (isHovered) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const autoRotateTimer = setInterval(handleNext, 2000);
        return () => clearInterval(autoRotateTimer);
    }, [isHovered, handleNext]);

    // FIX 2: Correct getSliderPosition using modular arithmetic to handle all wrap-around cases
    const getSliderPosition = (index: number) => {
        const total = projects.length;
        // Normalize diff to always be in range [0, total)
        const diff = ((index - currentIndex) + total) % total;

        if (diff === 0) return 0;          // active / center
        if (diff === 1) return 1;          // immediately to the right
        if (diff === total - 1) return -1; // immediately to the left (wrap)
        return 2;                          // hidden / behind
    };

    // FIX 3: Touch/swipe support for mobile (nav buttons are hidden on small screens)
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || touchStartY.current === null) return;

        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;

        // Only trigger if horizontal swipe dominates (ignore mostly-vertical scrolls)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
            if (deltaX < 0) handleNext();
            else handlePrev();
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    return (
        // FIX 4: Add ARIA landmark roles for accessibility
        <section
            id="projects"
            className="py-24 px-4 w-full overflow-hidden flex flex-col items-center"
            aria-label="Projects showcase"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 relative z-10"
            >
                <h2 className="text-4xl font-bold tracking-tight mb-4">Projects</h2>
                <p className="text-neutral-500 dark:text-neutral-400">A showcase of some of my featured work</p>
            </motion.div>

            {/*
              FIX 5: Add role="region" + aria-roledescription="carousel" on the carousel container.
              Also wire up touch handlers for mobile swipe support.
            */}
            <div
                className="relative w-full max-w-6xl h-[520px] flex items-center justify-center perspective-[1400px]"
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured projects"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-12 z-50 p-4 rounded-full border border-white/10 dark:border-white/5 hover:bg-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-110 hidden sm:flex"
                    aria-label="Previous project"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-12 z-50 p-4 rounded-full border border-white/10 dark:border-white/5 hover:bg-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-110 hidden sm:flex"
                    aria-label="Next project"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Project Cards */}
                <div className="relative w-full max-w-[360px] md:max-w-[440px] h-[500px] flex justify-center items-center preserve-3d">
                    {/*
                      FIX 6: Remove AnimatePresence — it was unused because:
                        (a) cards are never truly unmounted/remounted (they're conditionally returned null),
                        (b) initial={false} suppressed enter animations anyway.
                      Cards that are hidden (position === 2) are simply not rendered.
                      All transitions are handled by framer-motion's `animate` prop on the motion.div.
                    */}
                    {projects.map((project, index) => {
                        const position = getSliderPosition(index);

                        // Don't render cards that are not center or immediate neighbors
                        if (position === 2) return null;

                        return (
                            <motion.div
                                key={project.title}
                                animate={{
                                    x: position === 0 ? "0%" : position === -1 ? "-80%" : "80%",
                                    z: position === 0 ? 0 : -250,
                                    rotateY: position === 0 ? 0 : position === -1 ? 30 : -30,
                                    scale: position === 0 ? 1 : 0.82,
                                    opacity: Math.abs(position) <= 1 ? 1 : 0,
                                    zIndex: position === 0 ? 40 : 20,
                                    filter: position === 0
                                        ? "blur(0px) brightness(1)"
                                        : "blur(6px) brightness(0.4)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 20,
                                    mass: 1.2,
                                }}
                                className={`
                                    absolute inset-0 flex flex-col p-6 md:p-8 rounded-[2.5rem] overflow-hidden
                                    border transition-colors duration-300 group
                                    ${position === 0
                                        ? "bg-neutral-100/90 dark:bg-black/40 border-white/40 dark:border-white/10 backdrop-blur-3xl shadow-[0_12px_44px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_32px_0_rgba(255,255,255,0.03)]"
                                        : "bg-neutral-200/50 dark:bg-neutral-900/40 border-transparent"
                                    }
                                `}
                                // FIX 7: Side cards navigate; center card is not clickable (no accidental navigation)
                                onClick={() => {
                                    if (position === 1) handleNext();
                                    if (position === -1) handlePrev();
                                }}
                                // FIX 8: cursor-pointer only on side cards; default on center
                                style={{
                                    cursor: position === 0 ? "default" : "pointer",
                                    boxShadow:
                                        position === 0
                                            ? "inset 0 0 0 1px rgba(255,255,255,0.1), 0 30px 60px -12px rgba(0,0,0,0.5)"
                                            : "none",
                                }}
                                // FIX 9: Proper ARIA for each slide
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`Project ${index + 1} of ${projects.length}: ${project.title}`}
                                aria-hidden={position !== 0}
                            >
                                {/* Edge highlight gradient — center card only */}
                                {position === 0 && (
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/5 to-white/20 dark:to-white/10 pointer-events-none" />
                                )}

                                {/* Project preview image */}
                                <div className="w-full h-[45%] mb-6 rounded-2xl overflow-hidden relative border border-white/10 dark:border-white/5">
                                    {/* Gradient overlay for readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
                                    <img
                                        src={project.image}
                                        alt={project.imageAlt}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                        draggable={false}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-[-0.02em] mb-3 text-neutral-900 dark:text-white drop-shadow-sm">
                                            {project.title}
                                        </h3>
                                        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300/80 font-light line-clamp-3">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {project.tech.slice(0, 4).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-3 py-1 text-[11px] font-medium tracking-wide rounded-full text-neutral-800 dark:text-neutral-200 bg-white/50 dark:bg-white/5 border border-neutral-300/50 dark:border-white/10 backdrop-blur-md shadow-sm"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.tech.length > 4 && (
                                                <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-neutral-200/50 dark:bg-white/5 border border-neutral-300/50 dark:border-white/5 text-neutral-500">
                                                    +{project.tech.length - 4}
                                                </span>
                                            )}
                                        </div>

                                        {/* Links — only visible on the active center card */}
                                        {position === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.25, duration: 0.4 }}
                                                className="flex space-x-5 pt-4 border-t border-neutral-300/50 dark:border-white/10"
                                            >
                                                <a
                                                    href={project.github}
                                                    className="flex items-center text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors group"
                                                    aria-label={`View source code for ${project.title} on GitHub`}
                                                    tabIndex={position === 0 ? 0 : -1}
                                                >
                                                    <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Code
                                                </a>
                                                <a
                                                    href={project.live}
                                                    className="flex items-center text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors group"
                                                    aria-label={`View live demo for ${project.title}`}
                                                    tabIndex={position === 0 ? 0 : -1}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Live Demo
                                                </a>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Dots */}
            <div
                className="flex justify-center items-center space-x-3 mt-10"
                role="tablist"
                aria-label="Project navigation"
            >
                {projects.map((project, idx) => (
                    <button
                        key={idx}
                        role="tab"
                        aria-selected={idx === currentIndex}
                        aria-label={`Go to project ${idx + 1}: ${project.title}`}
                        onClick={() => setCurrentIndex(idx)}
                        className="p-1.5 rounded-full group transition-all"
                    >
                        <div
                            className={`
                                w-2.5 h-2.5 rounded-full transition-all duration-300
                                ${idx === currentIndex
                                    ? "bg-neutral-800 dark:bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    : "bg-neutral-400 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-400 cursor-pointer"
                                }
                            `}
                        />
                    </button>
                ))}
            </div>

            {/* ── GitHub Activity ─────────────────────────────────────────── */}
            <GitHubActivity />

            {/* ── Behind The Curtains ─────────────────────────────────────── */}
            <BehindTheCurtains />

        </section>
    );
}

// ---------------------------------------------------------------------------
// GitHub Activity — contribution graph matching the reference screenshot
// ---------------------------------------------------------------------------

function GitHubActivity() {
    const [weeks,       setWeeks]       = React.useState<{ days: { count: number; date: string }[] }[]>([]);
    const [total,       setTotal]       = React.useState<number | null>(null);
    const [loading,     setLoading]     = React.useState(true);
    const [error,       setError]       = React.useState(false);

    React.useEffect(() => {
        // GitHub contribution data via the public contributions calendar endpoint.
        // We parse the SVG response — no auth token needed.
        const fetchContributions = async () => {
            try {
                const res  = await fetch(
                    "https://github-contributions-api.jogruber.de/v4/peshalmishra?y=last"
                );
                if (!res.ok) throw new Error("fetch failed");
                const json = await res.json();

                // API returns { total: { [year]: n }, contributions: [{ date, count, level }] }
                const contributions: { date: string; count: number }[] = json.contributions;
                const totalCount = Object.values(json.total as Record<string, number>)
                    .reduce((a, b) => a + b, 0);

                // Group into weeks (Sunday-first)
                const grouped: { days: { count: number; date: string }[] }[] = [];
                let week: { count: number; date: string }[] = [];

                contributions.forEach((day, i) => {
                    week.push({ count: day.count, date: day.date });
                    if (week.length === 7 || i === contributions.length - 1) {
                        grouped.push({ days: week });
                        week = [];
                    }
                });

                setWeeks(grouped);
                setTotal(totalCount);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchContributions();
    }, []);

    // Contribution level → colour class
    const cellColor = (count: number) => {
        if (count === 0) return "bg-neutral-800/60 dark:bg-neutral-800/60";
        if (count <= 2)  return "bg-[#0e4429]";
        if (count <= 5)  return "bg-[#006d32]";
        if (count <= 10) return "bg-[#26a641]";
        return                  "bg-[#39d353]";
    };

    // Month labels from the weeks data
    const monthLabels = React.useMemo(() => {
        if (!weeks.length) return [];
        const labels: { month: string; colIndex: number }[] = [];
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            if (!week.days[0]) return;
            const m = new Date(week.days[0].date).getMonth();
            if (m !== lastMonth) {
                labels.push({ month: MONTHS[m], colIndex: wi });
                lastMonth = m;
            }
        });
        return labels;
    }, [weeks]);

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
                <p className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">
                    My Code Journey
                </p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                    GitHub Activity
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1">
                    <span
                        className="font-serif italic"
                        style={{
                            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor:  "transparent",
                            backgroundClip:       "text",
                        }}
                    >
                        &amp;&amp; Open Source
                    </span>
                </h2>
            </div>

            {/* Graph card */}
            <div className="w-full max-w-5xl mx-auto rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] backdrop-blur-sm p-6 md:p-8">

                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {/* GitHub icon */}
                        <svg className="w-6 h-6 text-neutral-800 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            {loading
                                ? "Loading contributions…"
                                : error
                                ? "Could not load contributions"
                                : <><strong className="text-neutral-900 dark:text-white">{total?.toLocaleString()}</strong> contributions in the last year</>
                            }
                        </p>
                    </div>

                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
                        <span>Less</span>
                        {["bg-neutral-800/60","bg-[#0e4429]","bg-[#006d32]","bg-[#26a641]","bg-[#39d353]"].map((c, i) => (
                            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                        ))}
                        <span>More</span>
                    </div>
                </div>

                {/* Graph */}
                {loading && (
                    <div className="h-32 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <p className="text-center text-sm text-neutral-400 py-8">
                        Unable to load GitHub data. Check back later.
                    </p>
                )}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <div className="min-w-max">
                            {/* Month labels */}
                            <div className="flex mb-1 ml-8">
                                {monthLabels.map((m, i) => (
                                    <div
                                        key={i}
                                        className="text-[10px] text-neutral-500 dark:text-neutral-400"
                                        style={{ width: `${(weeks.length / monthLabels.length) * 13}px`, minWidth: 28 }}
                                    >
                                        {m.month}
                                    </div>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="flex gap-[3px]">
                                {/* Day labels */}
                                <div className="flex flex-col gap-[3px] mr-1 justify-between py-0.5" style={{ width: 28 }}>
                                    {["","Mon","","Wed","","Fri",""].map((d, i) => (
                                        <span key={i} className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-none" style={{ height: 11 }}>
                                            {d}
                                        </span>
                                    ))}
                                </div>

                                {/* Weeks */}
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="flex flex-col gap-[3px]">
                                        {week.days.map((day, di) => (
                                            <div
                                                key={di}
                                                title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                                                className={`w-[11px] h-[11px] rounded-sm transition-opacity hover:opacity-70 cursor-default ${cellColor(day.count)}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Behind The Curtains — GitHub latest push, guestbook CTA, rotating quotes
// ---------------------------------------------------------------------------

const QUOTES = [
    { text: "The best error message is the one that never shows up.",      author: "Thomas Fuchs"         },
    { text: "First, solve the problem. Then, write the code.",             author: "John Johnson"         },
    { text: "Make it work, make it right, make it fast.",                  author: "Kent Beck"            },
    { text: "Any fool can write code that a computer can understand.",     author: "Martin Fowler"        },
    { text: "Simplicity is the soul of efficiency.",                       author: "Austin Freeman"       },
    { text: "Code is like humor. When you have to explain it, it's bad.",  author: "Cory House"           },
    { text: "Fix the cause, not the symptom.",                             author: "Steve Maguire"        },
    { text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
    { text: "Programs must be written for people to read.",                author: "Harold Abelson"       },
    { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" },
];

function RotatingQuote() {
    const [idx,     setIdx]     = React.useState(0);
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        const interval = setInterval(() => {
            // fade out → swap → fade in
            setVisible(false);
            setTimeout(() => {
                setIdx((prev) => (prev + 1) % QUOTES.length);
                setVisible(true);
            }, 400);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const q = QUOTES[idx];

    return (
        <div className="flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-black">&quot;</span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">Dev Wisdom</span>
            </div>

            {/* Quote */}
            <div
                className="flex-1 flex flex-col justify-center transition-opacity duration-400"
                style={{ opacity: visible ? 1 : 0 }}
            >
                <p className="text-base md:text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed mb-4">
                    &ldquo;{q.text}&rdquo;
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    — {q.author}
                </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-6">
                {QUOTES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 400); }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            i === idx
                                ? "w-6 bg-violet-500"
                                : "w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
                        }`}
                        aria-label={`Quote ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

function LatestPush() {
    const [commit,  setCommit]  = React.useState<{ message: string; repo: string; time: string } | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res  = await fetch("https://api.github.com/users/peshalmishra/events/public?per_page=10");
                if (!res.ok) throw new Error();
                const events = await res.json();
                const pushEvent = events.find((e: { type: string }) => e.type === "PushEvent");
                if (!pushEvent) throw new Error();

                const msg  = pushEvent.payload.commits?.[0]?.message ?? "No message";
                const repo = pushEvent.repo.name.split("/")[1];
                const time = timeAgo(new Date(pushEvent.created_at));
                setCommit({ message: msg, repo, time });
            } catch {
                setCommit({ message: "Building something new…", repo: "private", time: "recently" });
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    const timeAgo = (date: Date) => {
        const secs = Math.floor((Date.now() - date.getTime()) / 1000);
        if (secs < 60)   return `${secs}s ago`;
        if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
        if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
        return `${Math.floor(secs / 86400)}d ago`;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <svg className="w-7 h-7 text-neutral-800 dark:text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="text-lg font-serif italic font-bold text-neutral-900 dark:text-white">
                    Peshal&apos;s Github
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">
                    Latest Push
                </p>
                {loading ? (
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" />
                ) : commit ? (
                    <>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 text-[10px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {commit.time}
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug mb-3 line-clamp-3">
                            &ldquo;{commit.message}&rdquo;
                        </p>
                        <p className="text-xs text-neutral-500">
                            Repo: <span className="text-orange-400 font-medium">{commit.repo}</span>
                        </p>
                    </>
                ) : null}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-6 mt-auto border-t border-neutral-200 dark:border-white/8">
                {[
                    { href: "https://github.com/peshalmishra",       label: "GitHub",   icon: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/> },
                    { href: "https://linkedin.com/in/peshalmishra",  label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                    { href: "https://twitter.com/peshalmishra",      label: "Twitter",  icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
                ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                    </a>
                ))}
            </div>
        </div>
    );
}

function BehindTheCurtains() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full mt-32 px-4 pb-24"
        >
            {/* Heading */}
            <div className="text-center mb-16">
                <p className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">
                    Behind The Curtains
                </p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                    Decoding logic
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1">
                    <span
                        className="font-serif italic"
                        style={{
                            background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #ec4899 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor:  "transparent",
                            backgroundClip:       "text",
                        }}
                    >
                        &amp;&amp; the ideas
                    </span>
                </h2>
            </div>

            {/* Three-column bento */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Col 1 — Latest GitHub push */}
                <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 min-h-[340px] flex flex-col">
                    <LatestPush />
                </div>

                {/* Col 2 — Guestbook CTA */}
                <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 min-h-[340px] flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-6">
                            Visitors
                        </p>
                        <h3 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-none mb-2">
                            Leave your
                        </h3>
                        <h3
                            className="text-4xl font-black tracking-tight leading-none font-serif italic"
                            style={{
                                background: "linear-gradient(135deg, #818cf8 0%, #ec4899 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor:  "transparent",
                                backgroundClip:       "text",
                            }}
                        >
                            signature
                        </h3>
                        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                            Let me know you were here.
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                        {/* Avatar stack placeholder */}
                        <div className="flex -space-x-2">
                            {["/peshal-3.jpg", "/peshal-1.jpg", "/peshal-2.jpg"].map((src, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] overflow-hidden bg-neutral-300 dark:bg-neutral-700 flex-shrink-0">
                                    <img src={src} alt="" className="w-full h-full object-cover object-top" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                <span className="text-[8px] font-bold text-neutral-500">+99</span>
                            </div>
                        </div>

                        <a
                            href="/contact"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                        >
                            Sign Guestbook
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Col 3 — Rotating dev quotes (replaces Spotify) */}
                <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 min-h-[340px] flex flex-col">
                    <RotatingQuote />
                </div>
            </div>
        </motion.div>
    );
}