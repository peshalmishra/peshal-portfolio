"use client";

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Project data
// ---------------------------------------------------------------------------
const projects = [
    {
        title: "Cloud-Native E-Commerce Platform",
        description: "A highly resilient microservices architecture handling large-scale traffic, built with Spring Boot, Kafka, and Kubernetes.",
        tech: ["Java", "Spring Boot", "Kafka", "Docker", "AWS EKS"],
        github: "#",
        live: "#",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Server infrastructure for cloud-native e-commerce platform",
    },
    {
        title: "Outfit Accessories Recommender",
        description: "An AI-powered outfit and accessories recommendation system that analyzes user preferences and trends.",
        tech: ["React", "Node.js", "Express", "MongoDB", "AI/ML"],
        github: "#",
        live: "#",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Fashion accessories for AI outfit recommender",
    },
    {
        title: "Serverless Analytics Pipeline",
        description: "Real-time log ingestion and analytics pipeline using AWS Lambda, Kinesis, and DynamoDB.",
        tech: ["Node.js", "AWS Lambda", "Kinesis", "Terraform", "DynamoDB"],
        github: "#",
        live: "#",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Analytics dashboard for serverless pipeline",
    },
    {
        title: "Distributed Caching System",
        description: "A custom distributed LRU caching layer in Go, reducing database reads by 80% under peak load.",
        tech: ["Go", "gRPC", "Redis", "Prometheus", "Grafana"],
        github: "#",
        live: "#",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Network connections representing distributed caching",
    },
    {
        title: "Real-Time Collaboration Whiteboard",
        description: "A high-performance simultaneous multi-user canvas using WebSockets for real-time state synchronization.",
        tech: ["React", "Node.js", "Socket.io", "Redis", "Canvas API"],
        github: "#",
        live: "#",
        image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop",
        imageAlt: "Collaboration workspace for real-time whiteboard",
    },
    {
        title: "AI-Powered API Gateway",
        description: "Intelligent gateway providing predictive caching and anomaly detection for microservice architectures.",
        tech: ["Python", "FastAPI", "Docker", "PostgreSQL", "TensorFlow"],
        github: "#",
        live: "#",
        image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80&auto=format&fit=crop",
        imageAlt: "AI neural network for intelligent API gateway",
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
    TypeScript:  "#3178c6",
    JavaScript:  "#f1e05a",
    Python:      "#3572A5",
    Go:          "#00ADD8",
    Java:        "#b07219",
    Rust:        "#dea584",
    "C++":       "#f34b7d",
    C:           "#555555",
    HTML:        "#e34c26",
    CSS:         "#563d7c",
    Shell:       "#89e051",
    Kotlin:      "#A97BFF",
    Swift:       "#F05138",
    Ruby:        "#701516",
    PHP:         "#4F5D95",
    Dart:        "#00B4AB",
    Vue:         "#41b883",
    Svelte:      "#ff3e00",
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

// ---------------------------------------------------------------------------
// Shared icons
// ---------------------------------------------------------------------------
const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
);

// ===========================================================================
// PROJECT CAROUSEL
// ===========================================================================
export function Projects() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isHovered,    setIsHovered]    = useState(false);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handleNext = useCallback(() => setCurrentIndex((p) => (p + 1) % projects.length), []);
    const handlePrev = useCallback(() => setCurrentIndex((p) => (p - 1 + projects.length) % projects.length), []);

    useEffect(() => {
        if (isHovered) return;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;
        const t = setInterval(handleNext, 5000);
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

    return (
        <section id="projects" className="py-24 px-4 w-full overflow-hidden flex flex-col items-center" aria-label="Projects showcase">
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

            <div
                className="relative w-full max-w-6xl h-[520px] flex items-center justify-center perspective-[1400px]"
                role="region" aria-roledescription="carousel" aria-label="Featured projects"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <button onClick={handlePrev}
                    className="absolute left-4 md:left-12 z-50 p-4 rounded-full border border-white/10 dark:border-white/5 hover:bg-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-110 hidden sm:flex"
                    aria-label="Previous project">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNext}
                    className="absolute right-4 md:right-12 z-50 p-4 rounded-full border border-white/10 dark:border-white/5 hover:bg-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-110 hidden sm:flex"
                    aria-label="Next project">
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="relative w-full max-w-[360px] md:max-w-[440px] h-[500px] flex justify-center items-center preserve-3d">
                    {projects.map((project, index) => {
                        const position = getSliderPosition(index);
                        if (position === 2) return null;
                        return (
                            <motion.div
                                key={project.title}
                                animate={{
                                    x:       position === 0 ? "0%"  : position === -1 ? "-80%" : "80%",
                                    z:       position === 0 ? 0     : -250,
                                    rotateY: position === 0 ? 0     : position === -1 ? 30 : -30,
                                    scale:   position === 0 ? 1     : 0.82,
                                    opacity: Math.abs(position) <= 1 ? 1 : 0,
                                    zIndex:  position === 0 ? 40    : 20,
                                    filter:  position === 0 ? "blur(0px) brightness(1)" : "blur(6px) brightness(0.4)",
                                }}
                                transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1.2 }}
                                className={`absolute inset-0 flex flex-col p-6 md:p-8 rounded-[2.5rem] overflow-hidden border transition-colors duration-300 group
                                    ${position === 0
                                        ? "bg-neutral-100/90 dark:bg-black/40 border-white/40 dark:border-white/10 backdrop-blur-3xl shadow-[0_12px_44px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_32px_0_rgba(255,255,255,0.03)]"
                                        : "bg-neutral-200/50 dark:bg-neutral-900/40 border-transparent"
                                    }`}
                                onClick={() => { if (position === 1) handleNext(); if (position === -1) handlePrev(); }}
                                style={{
                                    cursor: position === 0 ? "default" : "pointer",
                                    boxShadow: position === 0 ? "inset 0 0 0 1px rgba(255,255,255,0.1), 0 30px 60px -12px rgba(0,0,0,0.5)" : "none",
                                }}
                                role="group" aria-roledescription="slide"
                                aria-label={`Project ${index + 1} of ${projects.length}: ${project.title}`}
                                aria-hidden={position !== 0}
                            >
                                {position === 0 && (
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/5 to-white/20 dark:to-white/10 pointer-events-none" />
                                )}
                                <div className="w-full h-[45%] mb-6 rounded-2xl overflow-hidden relative border border-white/10 dark:border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
                                    <img src={project.image} alt={project.imageAlt}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy" draggable={false} />
                                </div>
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
                                                <span key={tech} className="px-3 py-1 text-[11px] font-medium tracking-wide rounded-full text-neutral-800 dark:text-neutral-200 bg-white/50 dark:bg-white/5 border border-neutral-300/50 dark:border-white/10 backdrop-blur-md shadow-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.tech.length > 4 && (
                                                <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-neutral-200/50 dark:bg-white/5 border border-neutral-300/50 dark:border-white/5 text-neutral-500">
                                                    +{project.tech.length - 4}
                                                </span>
                                            )}
                                        </div>
                                        {position === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.25, duration: 0.4 }}
                                                className="flex space-x-5 pt-4 border-t border-neutral-300/50 dark:border-white/10"
                                            >
                                                <a href={project.github}
                                                    className="flex items-center text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors group"
                                                    aria-label={`View source code for ${project.title} on GitHub`}
                                                    tabIndex={0}>
                                                    <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Code
                                                </a>
                                                <a href={project.live}
                                                    className="flex items-center text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors group"
                                                    aria-label={`View live demo for ${project.title}`}
                                                    tabIndex={0}>
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

            {/* Pagination dots */}
            <div className="flex justify-center items-center space-x-3 mt-10" role="tablist" aria-label="Project navigation">
                {projects.map((project, idx) => (
                    <button key={idx} role="tab"
                        aria-selected={idx === currentIndex}
                        aria-label={`Go to project ${idx + 1}: ${project.title}`}
                        onClick={() => setCurrentIndex(idx)}
                        className="p-1.5 rounded-full group transition-all">
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                            ${idx === currentIndex
                                ? "bg-neutral-800 dark:bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "bg-neutral-400 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-400 cursor-pointer"
                            }`} />
                    </button>
                ))}
            </div>

            <ProjectsSkills />
            <GitHubActivity />
            <Certificates />
            <BehindTheCurtains />
        </section>
    );
}


// ===========================================================================
// PROJECTS SKILLS — rotating orb background + categorised skill grid
// ===========================================================================

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
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML/CSS"],
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
        skills: ["Node.js", "Express", "Spring Boot", "FastAPI", "REST APIs", "GraphQL"],
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
        skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
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
        skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "DynamoDB", "Kafka"],
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
        skills: ["Java", "Python", "TypeScript", "Go", "JavaScript", "Bash"],
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
        skills: ["Git", "GitHub", "VS Code", "Postman", "Jira", "Figma"],
    },
];

// Static orb positions — deterministic, no hydration mismatch
const ORB_POSITIONS = [
    { top: "10%",  left: "15%",  w: 320, h: 320, color: "#38bdf8", dur: 18 },
    { top: "60%",  left: "70%",  w: 280, h: 280, color: "#818cf8", dur: 22 },
    { top: "40%",  left: "40%",  w: 200, h: 200, color: "#34d399", dur: 15 },
    { top: "75%",  left: "10%",  w: 240, h: 240, color: "#f472b6", dur: 25 },
    { top: "5%",   left: "75%",  w: 180, h: 180, color: "#fb923c", dur: 20 },
];

function ProjectsSkills() {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

    const displayed = activeCategory
        ? SKILL_CATEGORIES.filter(c => c.label === activeCategory)
        : SKILL_CATEGORIES;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full mt-32 px-4 pb-4 overflow-hidden"
        >
            {/* ── Rotating orb background ─────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
                {ORB_POSITIONS.map((orb, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            top:    orb.top,
                            left:   orb.left,
                            width:  orb.w,
                            height: orb.h,
                            background: `radial-gradient(circle, ${orb.color}18 0%, transparent 70%)`,
                            filter: "blur(40px)",
                        }}
                        animate={{
                            x:       [0, 30, -20, 15, 0],
                            y:       [0, -20, 25, -10, 0],
                            scale:   [1, 1.08, 0.94, 1.04, 1],
                            opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
                        }}
                        transition={{
                            duration: orb.dur,
                            repeat:   Infinity,
                            ease:     "easeInOut",
                            delay:    i * 1.2,
                        }}
                    />
                ))}

                {/* Slow rotating ring */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: 600, height: 600 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 600 600" className="w-full h-full opacity-[0.04] dark:opacity-[0.07]">
                        <circle cx="300" cy="300" r="250" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 12"/>
                        <circle cx="300" cy="300" r="180" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 16"/>
                        <circle cx="300" cy="300" r="110" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 20"/>
                    </svg>
                </motion.div>

                {/* Counter-rotating inner ring */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: 400, height: 400 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 400 400" className="w-full h-full opacity-[0.03] dark:opacity-[0.06]">
                        <circle cx="200" cy="200" r="160" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 9"/>
                    </svg>
                </motion.div>
            </div>

            {/* ── Section heading ──────────────────────────────────────────── */}
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
                                WebkitTextFillColor:  "transparent",
                                backgroundClip:       "text",
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
                    style={{ background: "linear-gradient(90deg, transparent, #818cf8, #38bdf8, transparent)" }}
                />
            </div>

            {/* ── Category filter tabs ─────────────────────────────────────── */}
            <div className="relative flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border
                        ${activeCategory === null
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent shadow-lg"
                            : "bg-white/60 dark:bg-white/[0.04] text-neutral-500 border-neutral-200 dark:border-white/8 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                >
                    All
                </button>
                {SKILL_CATEGORIES.map((cat) => (
                    <button
                        key={cat.label}
                        onClick={() => setActiveCategory(prev => prev === cat.label ? null : cat.label)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border
                            ${activeCategory === cat.label
                                ? "text-white border-transparent shadow-lg"
                                : "bg-white/60 dark:bg-white/[0.04] text-neutral-500 border-neutral-200 dark:border-white/8 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                        style={activeCategory === cat.label ? {
                            background: `linear-gradient(135deg, ${cat.color}, ${cat.colorEnd})`,
                        } : {}}
                    >
                        <span style={{ color: activeCategory === cat.label ? "white" : cat.color }}>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* ── Skills grid ─────────────────────────────────────────────── */}
            <div className="relative w-full max-w-5xl mx-auto">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeCategory ?? "all"}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className={`grid gap-4 ${
                            activeCategory
                                ? "grid-cols-1"
                                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        }`}
                    >
                        {displayed.map((cat, ci) => (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: ci * 0.06, duration: 0.4, ease: "easeOut" }}
                                className="group relative rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/70 dark:bg-[#0a0a0a] overflow-hidden p-5"
                            >
                                {/* Card glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(ellipse at top left, ${cat.color}0D 0%, transparent 65%)` }}
                                />
                                {/* Top accent bar */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-[2px]"
                                    style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.colorEnd})` }}
                                />

                                {/* Category header */}
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                                        style={{ background: `${cat.color}18`, color: cat.color }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <span
                                        className="text-xs font-bold tracking-widest uppercase"
                                        style={{ color: cat.color }}
                                    >
                                        {cat.label}
                                    </span>
                                </div>

                                {/* Skill pills */}
                                <div className="flex flex-wrap gap-2">
                                    {cat.skills.map((skill, si) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: ci * 0.06 + si * 0.04, duration: 0.3 }}
                                            className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-default hover:scale-105"
                                            style={{
                                                color:           cat.color,
                                                backgroundColor: `${cat.color}10`,
                                                borderColor:     `${cat.color}28`,
                                            }}
                                            whileHover={{
                                                backgroundColor: `${cat.color}22`,
                                                borderColor:     `${cat.color}55`,
                                            }}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ===========================================================================
// GITHUB ACTIVITY
// ===========================================================================

function ContributionGraph() {
    const [weeks,   setWeeks]   = React.useState<{ days: { count: number; date: string }[] }[]>([]);
    const [total,   setTotal]   = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error,   setError]   = React.useState(false);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://github-contributions-api.jogruber.de/v4/peshalmishra?y=last");
                if (!res.ok) throw new Error();
                const json = await res.json();
                const contributions: { date: string; count: number }[] = json.contributions;
                const totalCount = Object.values(json.total as Record<string, number>).reduce((a, b) => a + b, 0);
                const grouped: { days: { count: number; date: string }[] }[] = [];
                let week: { count: number; date: string }[] = [];
                contributions.forEach((day, i) => {
                    week.push({ count: day.count, date: day.date });
                    if (week.length === 7 || i === contributions.length - 1) { grouped.push({ days: week }); week = []; }
                });
                setWeeks(grouped);
                setTotal(totalCount);
            } catch { setError(true); }
            finally  { setLoading(false); }
        })();
    }, []);

    const cellColor = (count: number) => {
        if (count === 0) return "bg-neutral-200 dark:bg-neutral-800/60";
        if (count <= 2)  return "bg-[#0e4429]";
        if (count <= 5)  return "bg-[#006d32]";
        if (count <= 10) return "bg-[#26a641]";
        return                  "bg-[#39d353]";
    };

    const monthLabels = React.useMemo(() => {
        if (!weeks.length) return [];
        const labels: { month: string }[] = [];
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let lastMonth = -1;
        weeks.forEach((week) => {
            if (!week.days[0]) return;
            const m = new Date(week.days[0].date).getMonth();
            if (m !== lastMonth) { labels.push({ month: MONTHS[m] }); lastMonth = m; }
        });
        return labels;
    }, [weeks]);

    return (
        <div className="w-full rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <GithubIcon className="w-6 h-6 text-neutral-800 dark:text-white" />
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {loading ? "Loading contributions…"
                            : error ? "Could not load contributions"
                            : <><strong className="text-neutral-900 dark:text-white">{total?.toLocaleString()}</strong> contributions in the last year</>}
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
                    <span>Less</span>
                    {["bg-neutral-200 dark:bg-neutral-800/60","bg-[#0e4429]","bg-[#006d32]","bg-[#26a641]","bg-[#39d353]"].map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            {loading && <div className="h-32 flex items-center justify-center"><div className="w-5 h-5 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" /></div>}
            {error   && <p className="text-center text-sm text-neutral-400 py-8">Unable to load GitHub data. Check back later.</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <div className="min-w-max">
                        <div className="flex mb-1 ml-8">
                            {monthLabels.map((m, i) => (
                                <div key={i} className="text-[10px] text-neutral-500 dark:text-neutral-400"
                                    style={{ width: `${(weeks.length / monthLabels.length) * 13}px`, minWidth: 28 }}>
                                    {m.month}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-[3px]">
                            <div className="flex flex-col gap-[3px] mr-1 justify-between py-0.5" style={{ width: 28 }}>
                                {["","Mon","","Wed","","Fri",""].map((d, i) => (
                                    <span key={i} className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-none" style={{ height: 11 }}>{d}</span>
                                ))}
                            </div>
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.days.map((day, di) => (
                                        <div key={di}
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
    );
}

function StatChips({ repos }: { repos: Repo[] }) {
    const totalStars  = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks  = repos.reduce((s, r) => s + r.forks_count, 0);
    const totalIssues = repos.reduce((s, r) => s + r.open_issues_count, 0);

    const stats = [
        {
            label: "Public Repos", value: repos.length,
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
            color: "text-blue-500", bg: "bg-blue-500/10",
        },
        {
            label: "Total Stars", value: totalStars,
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
            color: "text-yellow-500", bg: "bg-yellow-500/10",
        },
        {
            label: "Total Forks", value: totalForks,
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
            color: "text-purple-500", bg: "bg-purple-500/10",
        },
        {
            label: "Open Issues", value: totalIssues,
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
            color: "text-emerald-500", bg: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s, i) => (
                <motion.div key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="rounded-xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-4">
                    <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">{s.value.toLocaleString()}</p>
                    <p className="text-[10px] tracking-wider text-neutral-500 uppercase mt-1">{s.label}</p>
                </motion.div>
            ))}
        </div>
    );
}

function LanguageStats({ repos }: { repos: Repo[] }) {
    const langMap = React.useMemo(() => {
        const map: Record<string, number> = {};
        repos.forEach((r) => { if (r.language) map[r.language] = (map[r.language] ?? 0) + 1; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 7);
    }, [repos]);
    const total = langMap.reduce((s, [, n]) => s + n, 0);

    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6 flex flex-col">
            <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-5">Top Languages</p>
            {/* Segmented bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-6 gap-[2px]">
                {langMap.map(([lang, count]) => (
                    <div key={lang} className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{ width: `${(count / total) * 100}%`, backgroundColor: langColor(lang) }}
                        title={`${lang}: ${((count / total) * 100).toFixed(1)}%`} />
                ))}
            </div>
            {/* Legend */}
            <div className="space-y-3">
                {langMap.map(([lang, count], i) => (
                    <motion.div key={lang}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-black/5 dark:ring-white/5"
                                style={{ backgroundColor: langColor(lang) }} />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">{lang}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <div className="w-16 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(count / total) * 100}%`, backgroundColor: langColor(lang) }} />
                            </div>
                            <span className="text-xs text-neutral-400 w-9 text-right tabular-nums">
                                {((count / total) * 100).toFixed(0)}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-white/8">
                <p className="text-[10px] text-neutral-400">Across {repos.length} public repositories</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Repo card
// ---------------------------------------------------------------------------
type SortKey = "updated" | "stars" | "forks" | "name";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "updated", label: "Recent" },
    { key: "stars",   label: "Stars"  },
    { key: "forks",   label: "Forks"  },
    { key: "name",    label: "A–Z"    },
];

function RepoCard({ repo, index, featured = false }: { repo: Repo; index: number; featured?: boolean }) {
    const color = langColor(repo.language);

    return (
        <motion.a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ delay: index * 0.04, duration: 0.32, ease: "easeOut" }}
            className={`group relative flex flex-col rounded-2xl border bg-neutral-50 dark:bg-white/[0.03] overflow-hidden
                transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 hover:-translate-y-1
                ${featured ? "border-neutral-300 dark:border-white/12" : "border-neutral-200 dark:border-white/8"}`}
        >
            {/* Language accent bar along top */}
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: color }} />

            {/* Hover radial glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}10 0%, transparent 65%)` }} />

            <div className="p-5 flex flex-col h-full relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${color}20` }}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate transition-colors"
                            style={{ color: undefined }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
                            {repo.name}
                        </p>
                    </div>
                    {/* External link arrow */}
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mt-0.5"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 flex-1 ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
                    {repo.description ?? "No description provided."}
                </p>

                {/* Topics */}
                {repo.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {repo.topics.slice(0, featured ? 5 : 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border"
                                style={{ color, backgroundColor: `${color}12`, borderColor: `${color}30` }}>
                                {t}
                            </span>
                        ))}
                        {repo.topics.length > (featured ? 5 : 3) && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 dark:bg-white/5 text-neutral-400 border border-neutral-200 dark:border-white/8">
                                +{repo.topics.length - (featured ? 5 : 3)}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer stats */}
                <div className="flex items-center gap-3 text-xs mt-auto pt-3 border-t border-neutral-100 dark:border-white/[0.05]">
                    {repo.language && (
                        <span className="flex items-center gap-1.5 font-semibold" style={{ color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            {repo.language}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-neutral-400">
                        <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span className="tabular-nums">{repo.stargazers_count.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
                            <path d="M18 9a9 9 0 0 1-9 9"/>
                        </svg>
                        <span className="tabular-nums">{repo.forks_count}</span>
                    </span>
                    {repo.open_issues_count > 0 && (
                        <span className="flex items-center gap-1 text-neutral-400">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span className="tabular-nums">{repo.open_issues_count}</span>
                        </span>
                    )}
                    <span className="ml-auto text-[10px] text-neutral-400 tabular-nums">{timeAgo(repo.updated_at)}</span>
                </div>
            </div>
        </motion.a>
    );
}

function RepoGrid({ repos }: { repos: Repo[] }) {
    const [sortBy,  setSortBy]  = React.useState<SortKey>("updated");
    const [showAll, setShowAll] = React.useState(false);

    const sorted = React.useMemo(() => {
        const base = [...repos].filter((r) => !r.fork);
        switch (sortBy) {
            case "stars": return base.sort((a, b) => b.stargazers_count - a.stargazers_count);
            case "forks": return base.sort((a, b) => b.forks_count      - a.forks_count);
            case "name":  return base.sort((a, b) => a.name.localeCompare(b.name));
            default:      return base.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        }
    }, [repos, sortBy]);

    const PAGE = 7;
    const visible = showAll ? sorted : sorted.slice(0, PAGE);
    const [featured, ...rest] = visible;

    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-[#0a0a0a] p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Repositories</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{sorted.length} original repos</p>
                </div>
                {/* Sort pills */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/8 self-start sm:self-auto">
                    {SORT_OPTIONS.map((opt) => (
                        <button key={opt.key}
                            onClick={() => { setSortBy(opt.key); setShowAll(false); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                ${sortBy === opt.key
                                    ? "bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                }`}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            <AnimatePresence mode="popLayout">
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Featured card spans 2 cols on sm, 1 on lg */}
                    {featured && (
                        <div className="sm:col-span-2 lg:col-span-1">
                            <RepoCard key={`${featured.name}-${sortBy}-featured`} repo={featured} index={0} featured />
                        </div>
                    )}
                    {rest.map((repo, i) => (
                        <RepoCard key={`${repo.name}-${sortBy}`} repo={repo} index={i + 1} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Show more toggle */}
            {sorted.length > PAGE && (
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAll((p) => !p)}
                    className="mt-4 w-full py-3 rounded-xl border border-neutral-200 dark:border-white/8 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all duration-200 flex items-center justify-center gap-2">
                    {showAll
                        ? <>Show less <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg></>
                        : <>Show {sorted.length - PAGE} more repos <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></>
                    }
                </motion.button>
            )}

            {/* View on GitHub */}
            <a href="https://github.com/peshalmishra" target="_blank" rel="noopener noreferrer"
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors">
                <GithubIcon className="w-4 h-4" />
                View all on GitHub
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
            </a>
        </div>
    );
}

function GitHubActivity() {
    const [repos,   setRepos]   = React.useState<Repo[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://api.github.com/users/peshalmishra/repos?sort=updated&per_page=100&type=public");
                if (!res.ok) throw new Error();
                const data: Repo[] = await res.json();
                setRepos(data);
            } catch { setRepos([]); }
            finally  { setLoading(false); }
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
            <div className="text-center mb-16">
                <p className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">My Code Journey</p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                    GitHub Activity
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mt-1">
                    <span className="font-serif italic" style={{
                        background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        &amp;&amp; Open Source
                    </span>
                </h2>
            </div>

            <div className="w-full max-w-5xl mx-auto space-y-4">
                {/* Heatmap */}
                <ContributionGraph />

                {/* 4 stat chips */}
                {!loading && repos.length > 0 && <StatChips repos={repos} />}

                {/* Repos (2/3) + Languages (1/3) — language sidebar sticky on desktop */}
                {!loading && repos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="md:col-span-2"><RepoGrid repos={repos} /></div>
                        <div className="md:sticky md:top-8"><LanguageStats repos={repos} /></div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ===========================================================================
// BEHIND THE CURTAINS
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
    const [idx,     setIdx]     = React.useState(0);
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
    const [commit,  setCommit]  = React.useState<{ message: string; repo: string; time: string } | null>(null);
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

// ===========================================================================
// CERTIFICATES
// ===========================================================================

interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date: string;
    credentialId: string;
    skills: string[];
    color: string;      // accent gradient start
    colorEnd: string;   // accent gradient end
    logo: React.ReactNode;
    verifyUrl: string;
    pdfFile: string;    // filename in /public/certificates/
}

const CERTIFICATES: Certificate[] = [
    {
        id: 1,
        title: "AWS Academy Cloud Foundations",
        issuer: "Amazon Web Services",
        date: "Apr 2025",
        credentialId: "Credly · uCtFyBNf",
        skills: ["Cloud Concepts", "AWS Core Services", "Security", "Architecture", "Pricing"],
        color: "#FF9900",
        colorEnd: "#FF6600",
        verifyUrl: "https://www.credly.com/go/uCtFyBNf",
        pdfFile: "aws-cloud-foundations.pdf",
        logo: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M13.527 12.003c0 .808.079 1.462.221 1.944.157.482.35.999.63 1.557.1.157.14.315.14.457 0 .2-.122.4-.378.6l-1.255.836a.963.963 0 0 1-.52.174c-.2 0-.4-.1-.598-.278a6.184 6.184 0 0 1-.716-.935 15.395 15.395 0 0 1-.614-1.174c-1.546 1.825-3.49 2.737-5.834 2.737-1.667 0-2.994-.477-3.97-1.43-.975-.954-1.47-2.224-1.47-3.81 0-1.686.597-3.055 1.806-4.088C2.167 7.56 3.77 7.043 5.795 7.043c.657 0 1.333.056 2.048.155.716.1 1.45.258 2.225.437V6.27c0-1.528-.32-2.6-.94-3.235-.636-.636-1.706-.947-3.228-.947-.694 0-1.407.08-2.14.259-.735.178-1.451.397-2.147.676a5.68 5.68 0 0 1-.695.259.962.962 0 0 1-.319.059c-.278 0-.418-.2-.418-.617V1.47c0-.318.04-.557.139-.695.1-.14.278-.279.557-.418C1.653.02 2.507-.2 3.562-.2c1.075 0 1.965.119 2.683.358.715.238 1.37.596 1.965 1.073.595.478 1.03 1.035 1.31 1.67.276.637.413 1.37.413 2.2v2.9h.039c.395-.993.988-1.905 1.766-2.716.776-.81 1.726-1.432 2.836-1.847 1.11-.416 2.337-.623 3.662-.623 1.667 0 3.016.478 4.029 1.432.654.614 1.108 1.345 1.352 2.183-.477-.1-1.01-.159-1.607-.159-1.326 0-2.483.34-3.453 1.015-.975.677-1.448 1.65-1.448 2.923v1.194c-.199-.06-.397-.099-.597-.12a5.34 5.34 0 0 0-.596-.04c-.993 0-1.787.319-2.384.956-.598.637-.894 1.491-.894 2.562zm-6.35 2.977c.636 0 1.29-.12 1.985-.358.694-.239 1.31-.676 1.826-1.313.318-.377.556-.795.695-1.253.137-.458.197-.995.197-1.611v-.777a16.116 16.116 0 0 0-1.767-.318 14.484 14.484 0 0 0-1.806-.12c-1.29 0-2.225.259-2.842.794-.617.537-.914 1.293-.914 2.284 0 .934.238 1.63.735 2.107.478.497 1.174.765 2.088.765h-.197zm14.69.954c-.158 0-.278-.04-.378-.1-.1-.06-.198-.2-.298-.417l-3.33-10.965a1.985 1.985 0 0 1-.1-.458c0-.179.08-.278.239-.278h1.965c.178 0 .318.04.397.1.099.06.179.2.259.417l2.383 9.393 2.215-9.393c.06-.218.14-.358.239-.417.1-.06.258-.1.437-.1h1.607c.179 0 .318.04.438.1.1.06.198.2.238.417l2.244 9.513 2.463-9.513c.08-.218.178-.358.258-.417.1-.06.238-.1.397-.1h1.866c.16 0 .239.08.239.278 0 .059-.02.12-.04.2a1.93 1.93 0 0 1-.08.277l-3.41 10.965c-.08.218-.178.358-.298.417-.12.06-.258.1-.397.1H22.8c-.179 0-.318-.04-.437-.1-.1-.06-.199-.2-.259-.437l-2.204-9.154-2.185 9.134c-.06.238-.14.377-.258.437-.12.06-.258.1-.437.1h-1.35z"/>
            </svg>
        ),
    },
    {
        id: 2,
        title: "Mastering Data Structures and Algorithms",
        issuer: "Board Infinity",
        date: "Jul 2025",
        credentialId: "BI_07272025_13",
        skills: ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Sorting"],
        color: "#1E40AF",
        colorEnd: "#F59E0B",
        verifyUrl: "#",
        pdfFile: "dsa-board-infinity.pdf",
        logo: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
        ),
    },
    {
        id: 3,
        title: "ChatGPT-4 Prompt Engineering: Generative AI & LLM",
        issuer: "Infosys Springboard",
        date: "Aug 2025",
        credentialId: "Verify · onwingspan.com",
        skills: ["Prompt Engineering", "ChatGPT", "LLMs", "Generative AI", "AI Tools"],
        color: "#0EA5E9",
        colorEnd: "#7B3FE4",
        verifyUrl: "https://verify.onwingspan.com",
        pdfFile: "chatgpt-prompt-engineering.pdf",
        logo: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M11.998 0C5.366 0 0 5.367 0 12c0 6.633 5.366 12 11.998 12C18.63 24 24 18.633 24 12c0-6.633-5.37-12-12.002-12zm5.863 7.708l-1.912 9.016c-.142.63-.51.784-.946.486l-2.612-1.926-1.26 1.213c-.14.14-.257.257-.526.257l.187-2.665 4.84-4.372c.21-.187-.046-.29-.324-.103L6.4 14.667 3.82 13.877c-.564-.176-.576-.565.12-.835l11.489-4.427c.467-.17.878.114.432 1.093z"/>
            </svg>
        ),
    },
    {
        id: 4,
        title: "Build Generative AI Apps with No-Code Tools",
        issuer: "Infosys Springboard",
        date: "Aug 2025",
        credentialId: "Verify · onwingspan.com",
        skills: ["No-Code AI", "Generative AI", "AI Workflows", "App Building", "LLM APIs"],
        color: "#10B981",
        colorEnd: "#059669",
        verifyUrl: "https://verify.onwingspan.com",
        pdfFile: "genai-no-code-tools.pdf",
        logo: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M11.998 0C5.366 0 0 5.367 0 12c0 6.633 5.366 12 11.998 12C18.63 24 24 18.633 24 12c0-6.633-5.37-12-12.002-12zm5.863 7.708l-1.912 9.016c-.142.63-.51.784-.946.486l-2.612-1.926-1.26 1.213c-.14.14-.257.257-.526.257l.187-2.665 4.84-4.372c.21-.187-.046-.29-.324-.103L6.4 14.667 3.82 13.877c-.564-.176-.576-.565.12-.835l11.489-4.427c.467-.17.878.114.432 1.093z"/>
            </svg>
        ),
    },
    {
        id: 5,
        title: "Computational Theory: Language Principle & Finite Automata",
        issuer: "Infosys Springboard",
        date: "Aug 2025",
        credentialId: "Verify · onwingspan.com",
        skills: ["Finite Automata", "Regular Expressions", "Turing Machines", "Formal Languages", "Computability"],
        color: "#8B5CF6",
        colorEnd: "#6D28D9",
        verifyUrl: "https://verify.onwingspan.com",
        pdfFile: "computational-theory.pdf",
        logo: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M11.998 0C5.366 0 0 5.367 0 12c0 6.633 5.366 12 11.998 12C18.63 24 24 18.633 24 12c0-6.633-5.37-12-12.002-12zm5.863 7.708l-1.912 9.016c-.142.63-.51.784-.946.486l-2.612-1.926-1.26 1.213c-.14.14-.257.257-.526.257l.187-2.665 4.84-4.372c.21-.187-.046-.29-.324-.103L6.4 14.667 3.82 13.877c-.564-.176-.576-.565.12-.835l11.489-4.427c.467-.17.878.114.432 1.093z"/>
            </svg>
        ),
    },
    {
        id: 6,
        title: "Natural Language Processing",
        issuer: "NPTEL · IIT Kharagpur",
        date: "Jul–Oct 2023",
        credentialId: "NPTEL23CS80S642304115",
        skills: ["NLP", "Text Processing", "Machine Learning", "Linguistics", "Neural NLP"],
        color: "#DC2626",
        colorEnd: "#B91C1C",
        verifyUrl: "#",
        pdfFile: "nptel-nlp.pdf",
        logo: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        ),
    },
];

// Pre-computed seal spokes — static module-level constant so SSR and client always match
const SEAL_SPOKES = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const r = (n: number) => parseFloat(n.toFixed(4));
    return { x1: r(40 + 24 * Math.cos(angle)), y1: r(40 + 24 * Math.sin(angle)), x2: r(40 + 30 * Math.cos(angle)), y2: r(40 + 30 * Math.sin(angle)) };
});

// Seal SVG — decorative certificate watermark
function CertSeal({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 80 80" className="w-full h-full opacity-100" fill="none">
            <circle cx="40" cy="40" r="36" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4"/>
            <circle cx="40" cy="40" r="28" stroke={color} strokeWidth="1" opacity="0.25"/>
            <circle cx="40" cy="40" r="20" fill={color} opacity="0.08"/>
            {SEAL_SPOKES.map((s, i) => (
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={color} strokeWidth="1.5" opacity="0.3" />
            ))}
            <path d="M29 40l7 7 15-15" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
        </svg>
    );
}

// ---------------------------------------------------------------------------
// Lightbox modal — renders the PDF in a full-screen iframe overlay
// ---------------------------------------------------------------------------
function CertLightbox({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
    const pdfSrc = `/${cert.pdfFile}`;
    // Track whether cursor is over the iframe — used to restore cursor on top bar
    const [iframeHovered, setIframeHovered] = React.useState(false);

    // Close on Escape key
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Prevent body scroll while open
    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // When iframe is focused (mouse entered it), listen for mousemove at window
    // level so we know when the cursor leaves the iframe area back to chrome
    React.useEffect(() => {
        if (!iframeHovered) return;
        const handleMove = (e: MouseEvent) => {
            // Top bar is ~52px tall — if mouse is in top 60px, restore cursor
            if (e.clientY < 60) setIframeHovered(false);
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [iframeHovered]);

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                key="lightbox-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 flex flex-col"
                style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", zIndex: 99999, cursor: "default" }}
                onClick={onClose}
            >
                {/* Top bar — always rendered above iframe, always receives pointer events */}
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="flex items-center justify-between px-4 py-3 flex-shrink-0 relative"
                    style={{ zIndex: 100001, cursor: "default" }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => setIframeHovered(false)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${cert.color}30, ${cert.colorEnd}20)`, color: cert.color }}>
                            {cert.logo}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-tight">{cert.title}</p>
                            <p className="text-[11px] text-neutral-400">{cert.issuer} · {cert.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Download button */}
                        <a href={pdfSrc} download
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => e.stopPropagation()}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                        </a>
                        {/* Close button */}
                        <button onClick={onClose}
                            style={{ cursor: "pointer" }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </motion.div>

                {/* PDF iframe wrapper — transparent shield sits on top to intercept
                    pointer-enter so we know the cursor has gone into the iframe */}
                <motion.div
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="relative flex-1 mx-4 mb-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => setIframeHovered(true)}
                    onMouseLeave={() => setIframeHovered(false)}
                >
                    <iframe
                        src={`${pdfSrc}#toolbar=1&navpanes=0&scrollbar=1`}
                        className="w-full h-full"
                        title={cert.title}
                        style={{ background: "#fff", display: "block" }}
                    />
                    {/* Thin top-edge shield — always pointer-events-auto so the
                        top-bar close button is reachable without cursor vanishing.
                        Height matches the accent bar so it doesn't block PDF content. */}
                    <div
                        className="absolute top-0 left-0 right-0"
                        style={{ height: 6, zIndex: 100002, cursor: "default", pointerEvents: "none" }}
                    />
                </motion.div>

                {/* Accent line at top of iframe */}
                <div className="absolute left-4 right-4 rounded-t-2xl h-[3px]"
                    style={{
                        top: "52px",
                        zIndex: 100003,
                        background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})`,
                    }} />

                {/* Invisible full-width strip along the top bar area that
                    sits above the iframe stacking context — guarantees the
                    cursor is always visible and clickable when near close btn */}
                <div
                    className="absolute left-0 right-0 top-0"
                    style={{ height: "56px", zIndex: 100004, cursor: "default", pointerEvents: "none" }}
                />
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

// ---------------------------------------------------------------------------
// Certificate card — clicking opens the lightbox
// ---------------------------------------------------------------------------
function CertCard({ cert, index }: { cert: Certificate; index: number }) {
    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const isPlaceholder = cert.credentialId.includes("PLACEHOLDER");

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 32, rotateX: -6 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                className="group relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/8 bg-white dark:bg-[#0d0d0d] flex flex-col cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => !isPlaceholder && setLightboxOpen(true)}
                role="button"
                tabIndex={isPlaceholder ? -1 : 0}
                onKeyDown={(e) => { if (e.key === "Enter" && !isPlaceholder) setLightboxOpen(true); }}
                aria-label={`View certificate: ${cert.title}`}
            >
                {/* Gradient top bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})` }} />

                {/* Coming-soon overlay */}
                {isPlaceholder && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl backdrop-blur-[2px] bg-white/60 dark:bg-black/60">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center"
                                style={{ borderColor: cert.color }}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={cert.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: cert.color }}>
                                Coming Soon
                            </span>
                        </div>
                    </div>
                )}

                {/* Card body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                    {/* Header: logo + issuer + date */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                                style={{ background: `linear-gradient(135deg, ${cert.color}22, ${cert.colorEnd}18)`, color: cert.color }}>
                                {cert.logo}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">{cert.issuer}</p>
                                <p className="text-[11px] text-neutral-400 mt-0.5">{cert.date}</p>
                            </div>
                        </div>
                        {/* Decorative seal */}
                        <div className="w-10 h-10 flex-shrink-0 transition-transform duration-700 group-hover:rotate-[30deg]">
                            <CertSeal color={cert.color} />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug tracking-tight">
                            {cert.title}
                        </h3>
                        {!isPlaceholder && (
                            <p className="text-[10px] text-neutral-400 font-mono mt-1 tracking-widest">
                                {cert.credentialId}
                            </p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                        {cert.skills.map((skill) => (
                            <span key={skill}
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold border tracking-wide"
                                style={{ color: cert.color, backgroundColor: `${cert.color}10`, borderColor: `${cert.color}25` }}>
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* View certificate CTA */}
                    {!isPlaceholder && (
                        <div className="mt-auto flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                                style={{ color: cert.color }}>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                </svg>
                                View Certificate
                            </span>
                            <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Click to open
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom shimmer line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.colorEnd})` }} />
            </motion.div>

            {/* Lightbox portal */}
            {lightboxOpen && (
                <CertLightbox cert={cert} onClose={() => setLightboxOpen(false)} />
            )}
        </>
    );
}

function Certificates() {
    // Stable seeded particles — identical on server + client, no hydration mismatch
    const particles = React.useMemo(() => {
        let s = 0x9e3779b9;
        const rng = () => { s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0); return (s >>> 0) / 0xffffffff; };
        return Array.from({ length: 18 }, (_, i) => ({
            id:       i,
            x:        rng() * 100,
            y:        rng() * 100,
            size:     2 + rng() * 3,
            duration: 4 + rng() * 6,
            delay:    rng() * 4,
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
            {/* Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-[0.06] dark:opacity-[0.10]"
                    style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-[0.05] dark:opacity-[0.08]"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
                {/* Floating dots */}
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-neutral-400 dark:bg-white"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.06 }}
                        animate={{ y: [0, -12, 0], opacity: [0.06, 0.15, 0.06] }}
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
                    transition={{ duration: 0.5 }}
                    className="text-[11px] tracking-[0.3em] font-medium text-neutral-500 uppercase mb-4">
                    Credentials &amp; Learning
                </motion.p>

                {/* Animated heading letters */}
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
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor:  "transparent",
                            backgroundClip:       "text",
                        }}>
                            &amp;&amp; Badges
                        </span>
                    </motion.h2>
                </div>

                {/* Decorative divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mx-auto mt-8 h-px w-32 origin-center"
                    style={{ background: "linear-gradient(90deg, transparent, #a855f7, #f59e0b, transparent)" }}
                />
            </div>

            {/* Cards grid */}
            <div className="relative w-full max-w-5xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CERTIFICATES.map((cert, i) => (
                        <CertCard key={cert.id} cert={cert} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 flex flex-col items-center gap-3"
                >
                    <p className="text-sm text-neutral-500">
                        {CERTIFICATES.length} certificates earned
                    </p>
                    <a href="https://www.linkedin.com/in/peshalmishra" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-300 dark:border-white/10 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-white/25 transition-all hover:scale-105">
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