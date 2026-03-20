"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SocialLinkProps {
    href: string;
    label: string;
    children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Photo card shuffle — auto-rotates every 3s
// ---------------------------------------------------------------------------

const PHOTOS = [
    { src: "/peshal-1.jpg", alt: "Peshal Mishra in formal wear", rotate: -6 },
    { src: "/peshal-2.jpg", alt: "Peshal Mishra casual",         rotate:  4 },
    { src: "/peshal-3.jpg", alt: "Peshal Mishra in black suit",  rotate: -3 },
];

function PhotoStack() {
    const [order, setOrder] = useState([0, 1, 2]);
    const [animating, setAnimating] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const shuffle = () => {
        if (animating) return;
        setAnimating(true);
        setOrder((prev) => {
            const next = [...prev];
            next.push(next.shift()!);
            return next;
        });
        setTimeout(() => setAnimating(false), 500);
    };

    useEffect(() => {
        intervalRef.current = setInterval(shuffle, 3000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative w-[280px] md:w-[320px] h-[400px] md:h-[460px] select-none">
            {order.map((photoIndex, stackPosition) => {
                const photo  = PHOTOS[photoIndex];
                const total  = order.length;
                const isTop  = stackPosition === total - 1;
                const isMid  = stackPosition === total - 2;

                const rotate     = isTop ?  3  : isMid ? -5 :  7;
                const translateX = isTop ? -8  : isMid ?  8 : -4;
                const translateY = isTop ? -8  : isMid ?  6 :  14;
                const scale      = isTop ?  1  : isMid ? 0.96 : 0.92;
                const zIndex     = stackPosition + 1;

                return (
                    <motion.div
                        key={photoIndex}
                        className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10"
                        style={{ zIndex }}
                        animate={{
                            rotate, x: translateX, y: translateY, scale,
                            boxShadow: isTop
                                ? "0 25px 60px rgba(0,0,0,0.45)"
                                : isMid
                                ? "0 12px 35px rgba(0,0,0,0.30)"
                                : "0 6px 20px rgba(0,0,0,0.20)",
                        }}
                        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 1 }}
                    >
                        <img src={photo.src} alt={photo.alt}
                            className="w-full h-full object-cover object-top pointer-events-none"
                            draggable={false} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                        {!isTop && (
                            <div className="absolute inset-0 pointer-events-none"
                                style={{ background: `rgba(0,0,0,${isMid ? 0.15 : 0.30})` }} />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SocialLink({ href, label, children }: SocialLinkProps) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200">
            {children}
        </a>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <span className="px-4 py-2 rounded-full text-[13px] font-medium border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors">
            {label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Timeline item
// ---------------------------------------------------------------------------

interface TimelineItemProps {
    date: string;
    company: string;
    role: string;
    location: string;
    type: string;
    highlights: React.ReactNode[];
    skills: string[];
    gradient?: string;
    dimmed?: boolean;
}

function TimelineItem({ date, company, role, location, type, highlights, skills, gradient, dimmed = false }: TimelineItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative pl-12 md:pl-0 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-32 group"
        >
            <div className="md:col-span-1 flex flex-col items-start text-left space-y-4">
                <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">{date}</p>
                <h3 className={`text-3xl font-serif italic font-bold ${gradient ? "bg-clip-text text-transparent" : "text-black dark:text-white"}`}
                    style={gradient ? { backgroundImage: gradient } : undefined}>
                    {company}
                </h3>
                <div className="flex flex-col items-start gap-2 text-sm text-neutral-400 font-light">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {type}
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 space-y-8 min-w-0">
                <h4 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${
                    dimmed ? "text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white" : "text-black dark:text-white"
                }`}>
                    {role}
                </h4>
                <div className={`space-y-6 text-base tracking-wide leading-relaxed font-light transition-colors duration-500 ${
                    dimmed ? "text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-400" : "text-neutral-600 dark:text-neutral-400"
                }`}>
                    {highlights.map((h, i) => <p key={i}>{h}</p>)}
                </div>
                <div className={`flex flex-wrap gap-3 pt-4 transition-opacity duration-500 ${dimmed ? "opacity-60 group-hover:opacity-100" : ""}`}>
                    {skills.map((s) => <Tag key={s} label={s} />)}
                </div>
            </div>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Education item
// ---------------------------------------------------------------------------

interface EducationItemProps {
    year: string;
    degree: string;
    school: string;
    status: string;
    gradient: string;
    index: number;
}

function EducationItem({ year, degree, school, status, gradient, index }: EducationItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.1 }}
            className="relative pl-12 md:pl-0 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-20 group"
        >
            <div className="md:col-span-1 flex flex-col items-start text-left space-y-4">
                <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">{year}</p>
                <h3 className="text-3xl font-serif italic font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: gradient }}>
                    {school}
                </h3>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: status === "Pursuing" ? "#22c55e" : "#a3a3a3" }} />
                    {status}
                </span>
            </div>

            <div className="md:col-span-2 space-y-4 min-w-0">
                <h4 className="text-3xl font-bold tracking-tight text-black dark:text-white">{degree}</h4>
                <div className="flex items-center gap-2 text-sm text-neutral-400 font-light">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Academic qualification
                </div>
            </div>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function About() {
    const experienceRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: experienceRef,
        offset: ["start center", "end center"],
    });

    const rawProgress    = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const smoothProgress = useSpring(rawProgress, { stiffness: 60, damping: 20 });
    const timelineTop    = useTransform(smoothProgress, (v) => `${v}%`);
    const fillHeight     = useTransform(smoothProgress, (v) => `${v}%`);

    return (
        <div className="relative min-h-screen">

            {/* ── 1. Sticky cinematic hero ────────────────────────────────── */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-0"
                style={{ overflowX: "hidden" }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none rounded-full blur-3xl opacity-60 dark:opacity-100" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full"
                >
                    <h1 className="text-[18vw] sm:text-[20vw] md:text-[220px] font-black leading-none tracking-tighter text-black dark:text-white uppercase w-full">
                        ABOUT ME
                    </h1>
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-neutral-500 dark:text-neutral-400">
                            Get to know more about
                        </p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-black dark:text-white tracking-tight">
                            who i am.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ── 2. Bio section ──────────────────────────────────────────── */}
            <section id="about"
                className="relative z-10 min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-24 px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-16 lg:gap-8 items-start justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 max-w-2xl space-y-10"
                >
                    <div className="space-y-4">
                        <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">A little about me</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Nice to meet you. I&apos;m{" "}
                            <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent font-serif italic pr-2">
                                Peshal Mishra
                            </span>
                        </h2>
                    </div>
                    <div className="space-y-6 text-base md:text-lg text-neutral-400 leading-relaxed font-light">
                        <p>I transform complex ideas into high-speed, scalable web products. As an engineering-driven developer, I focus on the entire stack — prioritizing clean architecture, seamless performance, and modern solutions that drive real value.</p>
                        <p>Beyond writing code, I understand the product lifecycle. From architecting initial cloud infrastructure to deploying robust microservices, I&apos;ve learned firsthand how to build, ship, and scale meaningful applications in a fast-paced environment.</p>
                        <p>My philosophy is simple: build things that last. I help startups and businesses bridge the gap between concept and reality with code that performs.</p>
                    </div>
                    <div className="pt-4 flex items-center gap-6">
                        <SocialLink href="https://linkedin.com/in/peshalmishra" label="LinkedIn">LinkedIn</SocialLink>
                        <SocialLink href="https://github.com/peshalmishra"      label="GitHub">GitHub</SocialLink>
                        <SocialLink href="https://twitter.com/peshalmishra"     label="Twitter / X">Twitter</SocialLink>
                    </div>
                    <button className="mt-8 flex items-center gap-2 text-sm font-medium text-black dark:text-white hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors group">
                        Dive in deeper
                        <span className="p-1 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-black/20 dark:group-hover:bg-white/20 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex-1 w-full relative min-h-[500px] flex items-center justify-center lg:justify-end pr-0 lg:pr-12"
                >
                    <PhotoStack />
                </motion.div>
            </section>

            {/* ── 3. Experience timeline ──────────────────────────────────── */}
            <section id="experience" ref={experienceRef}
                className="relative z-10 min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white py-32 px-6 md:px-12 lg:px-24"
            >
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center mb-32"
                >
                    <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-8">The Experience</p>
                    <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black tracking-tight leading-[1.1]">
                        Experience That<br />
                        Brings{" "}
                        <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent font-serif italic pr-4 pb-2">
                            Ideas to Life
                        </span>
                    </h2>
                </motion.div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="absolute left-0 md:left-1/3 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 xl:-translate-x-[50px]">
                        <motion.div style={{ height: fillHeight }}
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-red-500/50 to-red-500" />
                        <motion.div style={{ top: timelineTop }}
                            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                        </motion.div>
                    </div>

                    <TimelineItem
                        date="JAN 2024 – PRESENT"
                        company="Freelance"
                        role="Full Stack & Cloud Engineer"
                        location="Remote — Worldwide"
                        type="Self-employed"
                        gradient="linear-gradient(to right, #3b82f6, #ec4899)"
                        highlights={[
                            <>Designed and delivered end-to-end web applications for clients across startups and SMBs, handling everything from <strong className="font-semibold text-black dark:text-neutral-200">system architecture</strong> to final deployment on cloud infrastructure.</>,
                            <>Built and shipped <strong className="font-semibold text-black dark:text-neutral-200">production-grade REST APIs and microservices</strong> using Node.js, Spring Boot, and Go — serving thousands of daily active users with 99.9% uptime.</>,
                            <>Architected and managed <strong className="font-semibold text-black dark:text-neutral-200">AWS infrastructure</strong> (EC2, S3, Lambda, RDS) with Terraform, reducing client cloud costs by an average of <strong className="font-semibold text-black dark:text-neutral-200">30%</strong> through right-sizing and automation.</>,
                            <>Delivered responsive, performant frontends using <strong className="font-semibold text-black dark:text-neutral-200">Next.js, React, and Tailwind CSS</strong> — consistently scoring 90+ on Lighthouse performance audits.</>,
                            <>Containerised and deployed applications with <strong className="font-semibold text-black dark:text-neutral-200">Docker and Kubernetes</strong>, implementing CI/CD pipelines via GitHub Actions for zero-downtime releases.</>,
                            <>Maintained direct client relationships — translating business requirements into technical specs, providing weekly progress updates, and iterating rapidly on feedback.</>,
                        ]}
                        skills={["Next.js","Node.js","Spring Boot","Go","AWS","Docker","Kubernetes","Terraform","PostgreSQL","Redis","Tailwind CSS","GitHub Actions"]}
                    />

                    <TimelineItem
                        date="2023 – 2024"
                        company="Self-directed Learning"
                        role="Cloud & DevOps Practice"
                        location="Remote"
                        type="Personal Development"
                        dimmed
                        highlights={[
                            <>Worked on learning and implementing cloud technologies using <strong className="font-semibold text-black dark:text-neutral-300">Amazon Web Services</strong>, building hands-on experience with real infrastructure from the ground up.</>,
                            <>Practiced deploying applications and managing <strong className="font-semibold text-black dark:text-neutral-300">virtual machines</strong> on AWS, gaining a solid understanding of cloud infrastructure concepts including <strong className="font-semibold text-black dark:text-neutral-300">virtualization, scalability, and high availability</strong>.</>,
                            <>Explored <strong className="font-semibold text-black dark:text-neutral-300">containerization using Docker</strong> — building, tagging, and running containers, managing images, and understanding how containers compare to traditional VMs.</>,
                            <>Set up and experimented with basic <strong className="font-semibold text-black dark:text-neutral-300">CI/CD workflows</strong>, automating build and deployment pipelines to understand how modern software delivery works end-to-end.</>,
                        ]}
                        skills={["AWS","EC2","S3","Docker","CI/CD","GitHub Actions","Linux","Networking","Virtualization"]}
                    />
                </div>
            </section>

            {/* ── 4. Education ────────────────────────────────────────────── */}
            <section id="education"
                className="relative z-10 bg-white dark:bg-[#050505] text-black dark:text-white py-32 px-6 md:px-12 lg:px-24"
            >
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center mb-32"
                >
                    <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-8">The Foundation</p>
                    <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black tracking-tight leading-[1.1]">
                        Education &{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-serif italic pr-4 pb-2">
                            Background
                        </span>
                    </h2>
                </motion.div>

                <div className="relative max-w-6xl mx-auto">
                    <EducationItem index={0} year="2023 – 2027" degree="BTech – Computer Science Engineering" school="Graduation" status="Pursuing" gradient="linear-gradient(to right, #10b981, #06b6d4)" />
                    <EducationItem index={1} year="2022" degree="12th Grade" school="Saint Francis School, Deoghar" status="Completed" gradient="linear-gradient(to right, #3b82f6, #6366f1)" />
                    <EducationItem index={2} year="2020" degree="10th Grade"  school="Saint Francis School, Deoghar" status="Completed" gradient="linear-gradient(to right, #8b5cf6, #ec4899)" />
                </div>
            </section>

            {/* ── 5. Passions & Interests ─────────────────────────────────── */}
            <section className="relative z-10 bg-white dark:bg-[#050505] text-black dark:text-white py-24 px-6 md:px-12 lg:px-24 border-t border-neutral-100 dark:border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-6xl mx-auto"
                >
                    <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-3">Beyond the Code</p>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12 overflow-visible">
                        Passions &{" "}
                        <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent font-serif italic pr-4">Interests</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { emoji:"🚀", title:"Technology & Innovation", body:"Love building apps and exploring emerging frameworks — always chasing what's next in the tech ecosystem.", color:"from-blue-500/10 to-indigo-500/5", border:"border-blue-500/20 hover:border-blue-500/40" },
                            { emoji:"🧩", title:"Problem-Solving",          body:"Enjoy tackling algorithms, competitive coding, and optimizing systems until they're as efficient as they can be.", color:"from-purple-500/10 to-pink-500/5", border:"border-purple-500/20 hover:border-purple-500/40" },
                            { emoji:"📚", title:"Continuous Learning",      body:"Passionate about courses, tutorials, and contributing to open-source. The day I stop learning is a day wasted.", color:"from-emerald-500/10 to-teal-500/5", border:"border-emerald-500/20 hover:border-emerald-500/40" },
                            { emoji:"🎨", title:"Hobbies",                  body:"Reading tech blogs, experimenting with new tools, or designing small side projects just for the joy of building.", color:"from-orange-500/10 to-yellow-500/5", border:"border-orange-500/20 hover:border-orange-500/40" },
                        ].map((item, i) => (
                            <motion.div key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`group rounded-2xl border bg-gradient-to-br ${item.color} ${item.border} p-6 transition-all duration-300 backdrop-blur-sm`}
                            >
                                <div className="text-3xl mb-4">{item.emoji}</div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">{item.title}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── 6. Career Vision ────────────────────────────────────────── */}
            <section className="relative z-10 bg-white dark:bg-[#050505] text-black dark:text-white py-24 px-6 md:px-12 lg:px-24 border-t border-neutral-100 dark:border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-6xl mx-auto"
                >
                    <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-3">Where I&apos;m Headed</p>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12 overflow-visible">
                        Career{" "}
                        <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-serif italic pr-4">Vision</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { badge:"SHORT-TERM", badgeColor:"bg-blue-500/15 text-blue-500 border-blue-500/25",   cardClass:"border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3", title:"Deepen the Craft",  body:"Gain deeper expertise in full-stack development and cloud computing, and contribute to impactful real-world projects that challenge my skills." },
                            { badge:"LONG-TERM",  badgeColor:"bg-indigo-500/15 text-indigo-400 border-indigo-500/25", cardClass:"border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 to-purple-500/5", title:"Cloud Architect", body:"Become a cloud architect or senior software engineer designing scalable, efficient distributed systems at enterprise scale." },
                            { badge:"MISSION",    badgeColor:"bg-purple-500/15 text-purple-400 border-purple-500/25", cardClass:"border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3", title:"Real Impact",      body:"Focused on creating solutions that genuinely improve user experience and solve real-world problems — not just writing code, but building things that matter." },
                        ].map((card, i) => (
                            <motion.div key={card.badge}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`rounded-2xl border ${card.cardClass} p-7 backdrop-blur-sm`}
                            >
                                <div className="mb-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${card.badgeColor}`}>{card.badge}</span>
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">{card.title}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{card.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── 7. Soft Skills ──────────────────────────────────────────── */}
            <section className="relative z-10 bg-white dark:bg-[#050505] text-black dark:text-white py-24 px-6 md:px-12 lg:px-24 border-t border-neutral-100 dark:border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-6xl mx-auto"
                >
                    <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-3">The Human Side</p>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12 overflow-visible">
                        Soft{" "}
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent font-serif italic pr-4">Skills</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { icon:"🤝", title:"Teamwork & Collaboration",            tag:"People",  body:"Works effectively in teams, contributing ideas and supporting peers — believes the best products are built together." },
                            { icon:"💡", title:"Problem-Solving & Critical Thinking", tag:"Mindset", body:"Approaches challenges logically, breaks them into solvable parts, and implements efficient solutions without over-engineering." },
                            { icon:"⚡", title:"Adaptability",                        tag:"Growth",  body:"Quick learner of new tools, languages, and concepts — thrives in fast-moving environments and embraces change as opportunity." },
                            { icon:"🗣️", title:"Communication",                       tag:"Clarity", body:"Clearly articulates technical ideas to both teammates and non-technical stakeholders — bridges the gap between code and business." },
                        ].map((skill, i) => (
                            <motion.div key={skill.title}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="flex items-start gap-5 p-6 rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3 hover:border-neutral-300 dark:hover:border-white/15 transition-colors duration-300 backdrop-blur-sm group"
                            >
                                <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{skill.icon}</div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">{skill.title}</h3>
                                        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest bg-neutral-100 dark:bg-white/8 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-white/8 uppercase flex-shrink-0">
                                            {skill.tag}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{skill.body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

        </div>
    );
}