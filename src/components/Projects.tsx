"use client";

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ProjectsSkills } from "./ProjectsSkills";
import { Certificates } from "./Certificates";
import { GitHubActivity } from "./GitHubActivity";
import { ExternalLink, Github, ChevronLeft, ChevronRight, Star, GitFork, Zap } from "lucide-react";

// ---------------------------------------------------------------------------
// Project data
// ---------------------------------------------------------------------------
const projects = [
    {
        title: "Cloud-Native E-Commerce Platform",
        description: "A highly resilient microservices architecture handling large-scale traffic, built with Spring Boot, Kafka, and Kubernetes.",
        highlight: "Handles 50K+ req/s under load 🚀",
        tech: ["Java", "Spring Boot", "Kafka", "Docker", "AWS EKS"],
        github: "#",
        live: "#",
        stars: 128,
        forks: 34,
        accent: "#3b82f6",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Server infrastructure for cloud-native e-commerce platform",
    },
    {
        title: "Outfit Accessories Recommender",
        description: "An AI-powered outfit and accessories recommendation system that analyzes user preferences and trends.",
        highlight: "92% recommendation accuracy ✨",
        tech: ["React", "Node.js", "Express", "MongoDB", "AI/ML"],
        github: "#",
        live: "#",
        stars: 87,
        forks: 19,
        accent: "#ec4899",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Fashion accessories for AI outfit recommender",
    },
    {
        title: "Serverless Analytics Pipeline",
        description: "Real-time log ingestion and analytics pipeline using AWS Lambda, Kinesis, and DynamoDB.",
        highlight: "Processes 1M+ events/day ⚡",
        tech: ["Node.js", "AWS Lambda", "Kinesis", "Terraform", "DynamoDB"],
        github: "#",
        live: "#",
        stars: 213,
        forks: 56,
        accent: "#f59e0b",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Analytics dashboard for serverless pipeline",
    },
    {
        title: "Distributed Caching System",
        description: "A custom distributed LRU caching layer in Go, reducing database reads by 80% under peak load.",
        highlight: "80% fewer DB reads 🔥",
        tech: ["Go", "gRPC", "Redis", "Prometheus", "Grafana"],
        github: "#",
        live: "#",
        stars: 342,
        forks: 78,
        accent: "#10b981",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Network connections representing distributed caching",
    },
    {
        title: "Real-Time Collaboration Whiteboard",
        description: "A high-performance simultaneous multi-user canvas using WebSockets for real-time state synchronization.",
        highlight: "Sub-10ms sync latency 🎯",
        tech: ["React", "Node.js", "Socket.io", "Redis", "Canvas API"],
        github: "#",
        live: "#",
        stars: 156,
        forks: 41,
        accent: "#8b5cf6",
        image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Collaboration workspace for real-time whiteboard",
    },
    {
        title: "AI-Powered API Gateway",
        description: "Intelligent gateway providing predictive caching and anomaly detection for microservice architectures.",
        highlight: "60% latency reduction 🧠",
        tech: ["Python", "FastAPI", "Docker", "PostgreSQL", "TensorFlow"],
        github: "#",
        live: "#",
        stars: 289,
        forks: 63,
        accent: "#06b6d4",
        image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80&auto=format&fit=crop",
        imageAlt: "AI neural network for intelligent API gateway",
    },
    {
        title: "Kartme – MERN Ecommerce",
        description: "A full-stack quick-commerce app inspired by Blinkit. Features JWT auth, admin panel, cart & orders, Stripe payments, Cloudinary image uploads, and OTP email flows.",
        highlight: "Full Stripe checkout flow 💳",
        tech: ["React", "Node.js", "MongoDB", "Express", "Redux Toolkit", "Stripe"],
        github: "https://github.com/shivam6677ojh/ShopWeb",
        live: "https://shopweb-1-usch.onrender.com",
        stars: 44,
        forks: 12,
        accent: "#f97316",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Kartme MERN full-stack ecommerce shopping app",
    },
];

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
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Go: "#00ADD8", Java: "#b07219", Rust: "#dea584", "C++": "#f34b7d",
    C: "#555555", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
    Kotlin: "#A97BFF", Swift: "#F05138", Ruby: "#701516", PHP: "#4F5D95",
    Dart: "#00B4AB", Vue: "#41b883", Svelte: "#ff3e00",
};
const langColor = (lang: string | null) => lang && LANG_COLORS[lang] ? LANG_COLORS[lang] : "#8b8b8b";
const timeAgo = (dateStr: string) => {
    const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    if (secs < 2592000) return `${Math.floor(secs / 86400)}d ago`;
    if (secs < 31536000) return `${Math.floor(secs / 2592000)}mo ago`;
    return `${Math.floor(secs / 31536000)}y ago`;
};

// ---------------------------------------------------------------------------
// Shared icons
// ---------------------------------------------------------------------------
const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
);

// ---------------------------------------------------------------------------
// 3D Tilt Card Hook
// ---------------------------------------------------------------------------
function useTilt(active: boolean) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]);
    const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
    const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
    const springConfig = { stiffness: 200, damping: 25 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!active || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }, [active, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return { ref, rotateX: rotateXSpring, rotateY: rotateYSpring, glowX, glowY, handleMouseMove, handleMouseLeave };
}

// ---------------------------------------------------------------------------
// Progress Bar (replaces dots)
// ---------------------------------------------------------------------------
function ProgressBar({ current, total, onSelect }: { current: number; total: number; onSelect: (i: number) => void }) {
    return (
        <div className="flex items-center gap-2 mt-8" role="tablist" aria-label="Project navigation">
            {Array.from({ length: total }).map((_, idx) => (
                <button
                    key={idx}
                    role="tab"
                    aria-selected={idx === current}
                    aria-label={`Go to project ${idx + 1}: ${projects[idx].title}`}
                    onClick={() => onSelect(idx)}
                    className="relative h-1 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                    style={{ width: idx === current ? 32 : 8, background: "rgba(255,255,255,0.15)" }}
                >
                    {idx === current && (
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ background: projects[current].accent }}
                            layoutId="activeBar"
                        />
                    )}
                </button>
            ))}
            <span className="text-[11px] text-neutral-500 ml-2 tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Project Card
// ---------------------------------------------------------------------------
function ProjectCard({ project, position, onNext, onPrev }: {
    project: typeof projects[0];
    position: number;
    onNext: () => void;
    onPrev: () => void;
}) {
    const isActive = position === 0;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hovered, setHovered] = useState(false);
    const tilt = useTilt(isActive && hovered);

    return (
        <motion.div
            animate={{
                x: position === 0 ? "0%" : position === -1 ? "-78%" : "78%",
                z: position === 0 ? 0 : -280,
                rotateY: position === 0 ? 0 : position === -1 ? 28 : -28,
                scale: position === 0 ? 1 : 0.8,
                opacity: Math.abs(position) <= 1 ? 1 : 0,
                zIndex: position === 0 ? 40 : 20,
                filter: position === 0 ? "blur(0px) brightness(1)" : "blur(4px) brightness(0.35)",
            }}
            transition={{ type: "spring", stiffness: 75, damping: 22, mass: 1.1 }}
            className="absolute inset-0 flex flex-col rounded-[28px] overflow-hidden"
            onClick={() => { if (position === 1) onNext(); if (position === -1) onPrev(); }}
            style={{ cursor: position === 0 ? "default" : "pointer" }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${project.title}`}
            aria-hidden={!isActive}
        >
            {/* Gradient border wrapper */}
            <div
                className="absolute inset-0 rounded-[28px] p-[1px] pointer-events-none z-10"
                style={{
                    background: isActive
                        ? `linear-gradient(135deg, ${project.accent}55, transparent 50%, ${project.accent}33)`
                        : "transparent",
                }}
            >
                <div className="w-full h-full rounded-[28px]" />
            </div>

            <motion.div
                ref={tilt.ref}
                onMouseMove={tilt.handleMouseMove}
                style={{
                    rotateX: isActive ? tilt.rotateX : 0,
                    rotateY: isActive ? tilt.rotateY : 0,
                    transformStyle: "preserve-3d",
                }}
                className={`w-full h-full flex flex-col rounded-[28px] overflow-hidden
                    ${isActive
                        ? "bg-[#0d0d0d]/95 border border-white/[0.07] shadow-2xl"
                        : "bg-[#0a0a0a]/70 border border-transparent"
                    }`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => { setHovered(false); tilt.handleMouseLeave(); }}
            >
                {/* Dynamic glow that follows cursor */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at ${tilt.glowX} ${tilt.glowY}, ${project.accent}18 0%, transparent 60%)`,
                            opacity: hovered ? 1 : 0,
                            transition: "opacity 0.3s ease",
                        }}
                    />
                )}

                {/* Ambient glow behind card */}
                {isActive && (
                    <div
                        className="absolute -inset-8 pointer-events-none -z-10 rounded-[40px] opacity-30 blur-3xl"
                        style={{ background: `radial-gradient(ellipse, ${project.accent}40, transparent 70%)` }}
                    />
                )}

                {/* Image section */}
                <div className="relative w-full h-[44%] overflow-hidden flex-shrink-0">
                    {/* Skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
                    )}
                    <img
                        src={project.image}
                        alt={project.imageAlt}
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover transition-all duration-700 ${isActive && hovered ? "scale-105" : "scale-100"} ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                        loading="lazy"
                        draggable={false}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent" />

                    {/* Stats overlay (top-right) */}
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-3 right-3 flex items-center gap-2"
                        >
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-black/50 border border-white/10 text-yellow-400">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                {project.stars}
                            </span>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-black/50 border border-white/10 text-neutral-300">
                                <GitFork className="w-3 h-3" />
                                {project.forks}
                            </span>
                        </motion.div>
                    )}

                    {/* Highlight badge */}
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                            className="absolute bottom-3 left-3"
                        >
                            <span
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md border"
                                style={{
                                    background: `${project.accent}22`,
                                    borderColor: `${project.accent}44`,
                                    color: project.accent,
                                }}
                            >
                                <Zap className="w-3 h-3" />
                                {project.highlight}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Content section */}
                <div className="flex-1 flex flex-col justify-between p-6 md:p-7">
                    {/* Title + description */}
                    <div>
                        <h3 className="text-[22px] md:text-[24px] font-bold tracking-[-0.03em] mb-2.5 text-white leading-tight">
                            {project.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-neutral-500 font-normal line-clamp-2">
                            {project.description}
                        </p>
                    </div>

                    {/* Tech tags */}
                    <div>
                        <div className="flex flex-wrap gap-1.5 mb-5 mt-4">
                            {project.tech.slice(0, 4).map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-md text-neutral-400 transition-all duration-200 hover:text-white cursor-default"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    {tech}
                                </span>
                            ))}
                            {project.tech.length > 4 && (
                                <span className="px-2 py-1 text-[10px] font-semibold rounded-md text-neutral-600" style={{ background: "rgba(255,255,255,0.03)" }}>
                                    +{project.tech.length - 4}
                                </span>
                            )}
                        </div>

                        {/* CTAs */}
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.35 }}
                                className="flex items-center gap-3 pt-5 border-t border-white/[0.06]"
                            >
                                {/* Primary: Live Demo */}
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                                    style={{ background: `linear-gradient(135deg, ${project.accent}cc, ${project.accent})`, boxShadow: `0 4px 20px ${project.accent}40` }}
                                    aria-label={`Live demo for ${project.title}`}
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Live Demo
                                </a>

                                {/* Secondary: Code */}
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-neutral-300 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    aria-label={`Source code for ${project.title}`}
                                >
                                    <Github className="w-3.5 h-3.5" />
                                    Code
                                </a>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ===========================================================================
// PROJECT CAROUSEL
// ===========================================================================
export function Projects() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isHovered, setIsHovered]       = useState(false);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handleNext = useCallback(() => setCurrentIndex((p) => (p + 1) % projects.length), []);
    const handlePrev = useCallback(() => setCurrentIndex((p) => (p - 1 + projects.length) % projects.length), []);

    useEffect(() => {
        if (isHovered) return;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;
        const t = setInterval(handleNext, 5500);
        return () => clearInterval(t);
    }, [isHovered, handleNext]);

    const getSliderPosition = (index: number) => {
        const total = projects.length;
        const diff  = ((index - currentIndex) + total) % total;
        if (diff === 0)         return 0;
        if (diff === 1)         return 1;
        if (diff === total - 1) return -1;
        return 2;
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) dx < 0 ? handleNext() : handlePrev();
        touchStartX.current = null;
        touchStartY.current = null;
    };

    const currentProject = projects[currentIndex];

    return (
        <section id="projects" className="py-24 px-4 w-full overflow-hidden flex flex-col items-center" aria-label="Projects showcase">
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 relative z-10"
            >
                <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase mb-4">Featured Work</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] mb-3 text-neutral-900 dark:text-white">Projects</h2>
                <p className="text-neutral-500 text-[15px]">A showcase of some of my featured work</p>
            </motion.div>

            {/* Carousel */}
            <div
                className="relative w-full max-w-6xl h-[530px] flex items-center justify-center"
                style={{ perspective: "1400px" }}
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured projects"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Ambient background glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-20"
                    style={{ background: currentProject.accent }}
                />

                {/* Nav buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-8 z-50 p-3.5 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60 shadow-xl backdrop-blur-xl text-black dark:text-white transition-all hover:scale-110 hover:border-black/20 dark:hover:border-white/20 hidden sm:flex"
                    aria-label="Previous project"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 z-50 p-3.5 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60 shadow-xl backdrop-blur-xl text-black dark:text-white transition-all hover:scale-110 hover:border-black/20 dark:hover:border-white/20 hidden sm:flex"
                    aria-label="Next project"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Cards */}
                <div
                    className="relative w-full max-w-[360px] md:max-w-[430px] h-[500px] flex justify-center items-center"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {projects.map((project, index) => {
                        const position = getSliderPosition(index);
                        if (position === 2) return null;
                        return (
                            <ProjectCard
                                key={project.title}
                                project={project}
                                position={position}
                                onNext={handleNext}
                                onPrev={handlePrev}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Progress bar */}
            <ProgressBar current={currentIndex} total={projects.length} onSelect={setCurrentIndex} />

            <ProjectsSkills />
            <GitHubActivity />
            <Certificates />
            <BehindTheCurtains />
        </section>
    );
}


// ===========================================================================
// BEHIND THE CURTAINS (unchanged logic, refined styles)
// ===========================================================================
const QUOTES = [
    { text: "The best error message is the one that never shows up.",               author: "Thomas Fuchs"    },
    { text: "First, solve the problem. Then, write the code.",                      author: "John Johnson"    },
    { text: "Make it work, make it right, make it fast.",                           author: "Kent Beck"       },
    { text: "Any fool can write code that a computer can understand.",              author: "Martin Fowler"   },
    { text: "Simplicity is the soul of efficiency.",                                author: "Austin Freeman"  },
    { text: "Code is like humor. When you have to explain it, it's bad.",           author: "Cory House"      },
    { text: "Fix the cause, not the symptom.",                                      author: "Steve Maguire"   },
    { text: "Debugging is twice as hard as writing the code in the first place.",   author: "Brian Kernighan" },
    { text: "Programs must be written for people to read.",                         author: "Harold Abelson"  },
    { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" },
];

function RotatingQuote() {
    const [idx, setIdx]         = React.useState(0);
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => { setIdx((p) => (p + 1) % QUOTES.length); setVisible(true); }, 400);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const q = QUOTES[idx];
    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-black">&quot;</span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">Dev Wisdom</span>
            </div>
            <div className="flex-1 flex flex-col justify-center transition-opacity duration-400" style={{ opacity: visible ? 1 : 0 }}>
                <p className="text-base md:text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-relaxed mb-4">
                    &ldquo;{q.text}&rdquo;
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">— {q.author}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-6">
                {QUOTES.map((_, i) => (
                    <button key={i}
                        onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 400); }}
                        className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-violet-500" : "w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"}`}
                        aria-label={`Quote ${i + 1}`} />
                ))}
            </div>
        </div>
    );
}

function LatestPush() {
    const [commit, setCommit]   = React.useState<{ message: string; repo: string; time: string } | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://api.github.com/users/peshalmishra/events/public?per_page=10");
                if (!res.ok) throw new Error();
                const events = await res.json();
                const pushEvent = events.find((e: { type: string }) => e.type === "PushEvent");
                if (!pushEvent) throw new Error();
                setCommit({
                    message: pushEvent.payload.commits?.[0]?.message ?? "No message",
                    repo:    pushEvent.repo.name.split("/")[1],
                    time:    timeAgo(pushEvent.created_at),
                });
            } catch {
                setCommit({ message: "Building something new…", repo: "private", time: "recently" });
            } finally { setLoading(false); }
        })();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <GithubIcon className="w-7 h-7 text-neutral-800 dark:text-white flex-shrink-0" />
                <span className="text-lg font-serif italic font-bold text-neutral-900 dark:text-white">Peshal&apos;s Github</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
                <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-3">Latest Push</p>
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
                        <p className="text-xs text-neutral-500">Repo: <span className="text-orange-400 font-medium">{commit.repo}</span></p>
                    </>
                ) : null}
            </div>
            <div className="flex items-center gap-4 pt-6 mt-auto border-t border-neutral-200 dark:border-white/8">
                {[
                    { href: "https://github.com/peshalmishra",      label: "GitHub",   icon: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/> },
                    { href: "https://linkedin.com/in/peshalmishra", label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                    { href: "https://twitter.com/peshalmishra",     label: "Twitter",  icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
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
            <div className="text-center mb-16">
                <p className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">Behind The Curtains</p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                    Decoding logic
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1">
                    <span className="font-serif italic" style={{
                        background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #ec4899 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        &amp;&amp; the ideas
                    </span>
                </h2>
            </div>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 min-h-[340px] flex flex-col">
                    <LatestPush />
                </div>
                <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 min-h-[340px] flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-6">Visitors</p>
                        <h3 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-none mb-2">Leave your</h3>
                        <h3 className="text-4xl font-black tracking-tight leading-none font-serif italic" style={{
                            background: "linear-gradient(135deg, #818cf8 0%, #ec4899 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        }}>
                            signature
                        </h3>
                        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">Let me know you were here.</p>
                    </div>
                    <div className="flex items-center justify-between mt-8">
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
                        <a href="/contact"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                            Sign Guestbook
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 min-h-[340px] flex flex-col">
                    <RotatingQuote />
                </div>
            </div>
        </motion.div>
    );
}