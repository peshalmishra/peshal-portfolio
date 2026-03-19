"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, MapPin, Mail, Github, Linkedin, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// CV Data — extracted from peshalcv.doc
// ---------------------------------------------------------------------------

const CONTACT = {
    name:     "Peshal Mishra",
    title:    "Full Stack & Cloud Engineer",
    location: "Phagwara, Punjab, India",
    email:    "peshalmishra13@gmail.com",
    phone:    "+91-9508572455",
    github:   "github.com/peshalmishra",
    linkedin: "linkedin.com/in/peshalmishra",
    leetcode: "leetcode.com/u/PeshalMishra",
};

const SKILLS = {
    "Languages":            ["C++", "Java", "JavaScript", "Python"],
    "Frameworks / Libs":    ["React", "Next.js", "Node.js", "Express.js", "Bootstrap", "Tkinter"],
    "Cloud & DevOps":       ["AWS EC2", "AWS S3", "AWS Lambda", "CloudFront", "Docker", "CI/CD"],
    "Databases":            ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB"],
    "Tools":                ["Git", "GitHub", "Vercel", "JWT", "WebSockets", "REST APIs"],
    "Soft Skills":          ["Analytical Thinking", "Learning Agility", "Attention to Detail", "Emotional Intelligence"],
};

const EXPERIENCE = [
    {
        role:     "Freelance Full Stack & Cloud Engineer",
        org:      "Self-employed",
        period:   "Jan 2024 – Present",
        location: "Remote",
        bullets: [
            "Engineered a full-stack inventory platform using React/Next.js, Node.js, and PostgreSQL, enabling seamless multi-device access and 3-warehouse management, improving process efficiency by 35%.",
            "Deployed on AWS (EC2, S3, Lambda, CloudFront), ensuring 99.9% uptime, secure file storage, automated backend workflows, and 40% faster load performance.",
            "Integrated AI-based stock prediction, voice-enabled commands, and real-time WebSocket monitoring, reducing manual tracking time by 50%.",
            "Implemented QR/Barcode scanning for automated stock-in/out, cutting data entry errors by 60%.",
        ],
    },
    {
        role:     "Technical Lead",
        org:      "Microsoft Achievers Club — Lovely Professional University",
        period:   "Sep 2023 – Present",
        location: "Phagwara, Punjab",
        bullets: [
            "Led and mentored a team in organizing technical workshops, hackathons, and projects to enhance student engagement in emerging technologies.",
        ],
    },
];

const PROJECTS = [
    {
        name:  "Cloud-based Inventory Management System",
        date:  "Jan 2025",
        url:   null,
        stack: "React, Next.js, Node.js, Express.js, PostgreSQL, AWS EC2, AWS S3, AWS Lambda, CloudFront, WebSockets, TensorFlow, QR/Barcode SDK, JWT",
        bullets: [
            "Full-stack inventory platform with multi-device access and 3-warehouse management — 35% efficiency gain.",
            "99.9% uptime on AWS with AI stock prediction, voice commands, and real-time WebSocket monitoring.",
        ],
    },
    {
        name:  "DevOps AI Chatbot",
        date:  "Apr 2025",
        url:   "https://github.com/peshalmishra/cloudwise-bot",
        stack: "React, TypeScript, Vite, Tailwind CSS, Shadcn-UI",
        bullets: [
            "Modern cloud-based bot interface with reusable Tailwind/Shadcn components and optimized rendering.",
            "Scalable frontend architecture for cloud integrations and bot-driven automation workflows.",
        ],
    },
    {
        name:  "Smart AI Plant Identification Website",
        date:  "Jan 2024",
        url:   "https://github.com/peshalmishra/plant-identification-website",
        stack: "HTML, CSS, JavaScript, Bootstrap, MySQL, PHP, REST APIs",
        bullets: [
            "Plant identification website with responsive Bootstrap front-end and MySQL data storage.",
            "REST APIs connecting database with web interface for real-time recognition results.",
        ],
    },
    {
        name:  "Text Editor Application",
        date:  "2024",
        url:   "https://github.com/peshalmishra/text-editor",
        stack: "Python, Tkinter, ttk, OOP",
        bullets: [
            "Desktop text editor with file open/save, search & replace, and light/dark theme toggle.",
            "Modular OOP architecture with ttk styling and real-time UI updates.",
        ],
    },
];

const ACHIEVEMENTS = [
    {
        title:  "Global Rank 181 — LeetCode Weekly Contest 489",
        detail: "Competing among 41,000+ participants worldwide",
        icon:   "🏆",
    },
    {
        title:  "LeetCode Contest Rating 1795 — Top 7.89%",
        detail: "332+ problems solved including 29 Hard",
        icon:   "⚡",
    },
    {
        title:  "Grand Finalist — Smart India Hackathon",
        detail: "Among 50 participants in the Final Division — Sep 2025",
        icon:   "🚀",
    },
];

const CERTIFICATIONS = [
    {
        name: "AWS Cloud Practitioner",
        date: "Jan 2025",
        url:  "https://drive.google.com/file/d/1d0fSlY8Q6HDi0AB5h6GMxeZKqux",
    },
    {
        name: "Mastering Data Structures and Algorithms",
        date: "Jun 2025",
        url:  "https://drive.google.com/file/d/1gIUk471WrBSCHH6abetDbeRakgB2dFSi/view",
    },
    {
        name: "Natural Language Processing",
        date: "Aug 2024",
        url:  "https://drive.google.com/file/d/1APuh5Ic1QvOvebBtVee8vfBfHYh4CgJT/view",
    },
];

const EDUCATION = [
    {
        degree:  "Bachelor of Technology — Computer Science and Engineering",
        school:  "Lovely Professional University",
        location:"Phagwara, Punjab, India",
        period:  "Aug 2023 – Present",
        detail:  "CGPA: 8.25",
    },
    {
        degree:  "Senior Secondary (Class XII)",
        school:  "Saint Francis School, B.Deoghar",
        location:"Deoghar, Jharkhand, India",
        period:  "Apr 2021 – Mar 2022",
        detail:  "",
    },
    {
        degree:  "Secondary (Class X)",
        school:  "Saint Francis School, B.Deoghar",
        location:"Deoghar, Jharkhand, India",
        period:  "Apr 2019 – Mar 2020",
        detail:  "",
    },
];

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

function SectionHeading({ label, title }: { label: string; title: string }) {
    return (
        <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] font-semibold text-neutral-500 uppercase mb-2">
                {label}
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                {title}
            </h2>
            <div className="mt-3 h-px bg-neutral-200 dark:bg-white/8" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Resume page
// ---------------------------------------------------------------------------

export function Resume() {
    return (
        <div className="w-full min-h-screen">

            {/* ── Hero header ───────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Name */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-none mb-4">
                        {CONTACT.name}
                    </h1>
                    <p className="text-xl md:text-2xl font-serif italic text-neutral-500 dark:text-neutral-400 mb-8">
                        {CONTACT.title}
                    </p>

                    {/* Contact row */}
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />{CONTACT.location}
                        </span>
                        <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
                            <Mail className="w-4 h-4" />{CONTACT.email}
                        </a>
                        <a href={`https://${CONTACT.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
                            <Github className="w-4 h-4" />{CONTACT.github}
                        </a>
                        <a href={`https://${CONTACT.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />{CONTACT.linkedin}
                        </a>
                    </div>

                    {/* Download button */}
                    <div className="flex gap-3">
                        <a
                            href="/resume.pdf"
                            download="Peshal_Mishra_Resume.pdf"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </a>
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 dark:border-white/15 text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            View PDF
                        </a>
                    </div>
                </motion.div>
            </section>

            <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pb-32 space-y-20">

                {/* ── Skills ──────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading label="Technical" title="Skills" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(SKILLS).map(([category, items]) => (
                            <div
                                key={category}
                                className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3 p-5"
                            >
                                <p className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-3">
                                    {category}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/8 text-neutral-700 dark:text-neutral-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Experience ──────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading label="Work" title="Experience" />
                    <div className="space-y-8">
                        {EXPERIENCE.map((exp, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                                <div className="md:col-span-1 text-sm">
                                    <p className="font-bold text-neutral-900 dark:text-white text-base">{exp.org}</p>
                                    <p className="text-neutral-500 mt-1">{exp.period}</p>
                                    <p className="text-neutral-400 text-xs mt-0.5 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />{exp.location}
                                    </p>
                                </div>
                                <div className="md:col-span-3">
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                                        {exp.role}
                                    </h3>
                                    <ul className="space-y-2">
                                        {exp.bullets.map((b, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-2 flex-shrink-0" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Projects ────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading label="Built" title="Projects" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {PROJECTS.map((proj, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3 p-6 flex flex-col gap-4 group hover:border-neutral-300 dark:hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
                                        {proj.name}
                                    </h3>
                                    {proj.url && (
                                        <a href={proj.url} target="_blank" rel="noopener noreferrer"
                                            className="flex-shrink-0 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                <ul className="space-y-1.5">
                                    {proj.bullets.map((b, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-2 flex-shrink-0" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-white/5">
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono leading-relaxed">
                                        {proj.stack}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Achievements ────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading label="Recognition" title="Achievements" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {ACHIEVEMENTS.map((ach, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3 p-6"
                            >
                                <div className="text-3xl mb-4">{ach.icon}</div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug mb-2">
                                    {ach.title}
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {ach.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Certifications ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading label="Credentials" title="Certifications" />
                    <div className="space-y-3">
                        {CERTIFICATIONS.map((cert, i) => (
                            <a
                                key={i}
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-5 rounded-2xl border border-neutral-200 dark:border-white/8 bg-white/60 dark:bg-white/3 hover:border-neutral-300 dark:hover:border-white/20 transition-colors group"
                            >
                                <div>
                                    <p className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                                        {cert.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-0.5">{cert.date}</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* ── Education ───────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading label="Academic" title="Education" />
                    <div className="space-y-6">
                        {EDUCATION.map((edu, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 py-5 border-b border-neutral-100 dark:border-white/5 last:border-0">
                                <div className="md:col-span-1">
                                    <p className="text-xs text-neutral-500 font-medium">{edu.period}</p>
                                    {edu.detail && (
                                        <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-1">{edu.detail}</p>
                                    )}
                                </div>
                                <div className="md:col-span-3">
                                    <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
                                        {edu.degree}
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1.5">
                                        {edu.school}
                                        <span className="text-neutral-300 dark:text-neutral-700">·</span>
                                        <MapPin className="w-3 h-3" />{edu.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}