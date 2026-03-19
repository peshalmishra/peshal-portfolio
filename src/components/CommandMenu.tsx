"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Moon, Sun, Home, User, Briefcase, FileText,
    MessageSquare, Monitor,
    Github, Linkedin, Twitter, Shield, FileOutput,
    Download, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface CommandMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const pages = [
    { name: "Home",      desc: "Go to homepage",        icon: Home,          path: "/"         },
    { name: "About",     desc: "Learn more about me",   icon: User,          path: "/about"    },
    { name: "Projects",  desc: "View my work",          icon: Briefcase,     path: "/projects" },
    { name: "Blog",      desc: "Read my thoughts",      icon: FileText,      path: "/blog"     },
    { name: "Contact",   desc: "Get in touch",          icon: MessageSquare, path: "/contact"  },
    { name: "Skills",    desc: "My tech stack",         icon: Monitor,       path: "/skills"   },
];

const resume = [
    {
        name:     "View Resume",
        desc:     "Open PDF in new tab",
        icon:     ExternalLink,
        path:     "/resume.pdf",
        external: true,
        download: false,
    },
    {
        name:     "Download Resume",
        desc:     "Save PDF to device",
        icon:     Download,
        path:     "/resume.pdf",
        external: false,
        download: true,
    },
];

const connect = [
    { name: "GitHub",     desc: "@peshalmishra",       icon: Github,   path: "https://github.com/peshalmishra",          external: true },
    { name: "LinkedIn",   desc: "Professional network", icon: Linkedin, path: "https://linkedin.com/in/peshalmishra",     external: true },
    { name: "X (Twitter)",desc: "@peshalmishra",       icon: Twitter,  path: "https://twitter.com/peshalmishra",         external: true },
];

const legal = [
    { name: "Privacy Policy",   desc: "Data handling", icon: Shield,     path: "/privacy" },
    { name: "Terms of Service", desc: "Usage rules",   icon: FileOutput, path: "/terms"   },
];

// ---------------------------------------------------------------------------
// Row components
// ---------------------------------------------------------------------------

function NavRow({ item, onClose }: { item: typeof pages[0]; onClose: () => void }) {
    return (
        <Link
            href={item.path}
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#222] group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
        >
            <item.icon className="w-4 h-4 text-neutral-500 mr-4 flex-shrink-0 group-hover:text-black dark:group-hover:text-white transition-colors" />
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</span>
            </div>
        </Link>
    );
}

function ExternalRow({
    item,
    onClose,
}: {
    item: { name: string; desc: string; icon: React.ElementType; path: string; external?: boolean; download?: boolean };
    onClose: () => void;
}) {
    return (
        <a
            href={item.path}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            download={item.download ? "Peshal_Mishra_Resume.pdf" : undefined}
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#222] group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
        >
            <item.icon className="w-4 h-4 text-neutral-500 mr-4 flex-shrink-0 group-hover:text-black dark:group-hover:text-white transition-colors" />
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</span>
            </div>
        </a>
    );
}

function SectionLabel({ label }: { label: string }) {
    return (
        <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
            {label}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
    const { setTheme, resolvedTheme } = useTheme();
    const [search, setSearch]   = useState("");
    const inputRef              = useRef<HTMLInputElement>(null);

    // Filter helpers
    const q = search.toLowerCase();
    const filteredPages   = pages.filter(  (p) => p.name.toLowerCase().includes(q));
    const filteredResume  = resume.filter( (r) => r.name.toLowerCase().includes(q));
    const filteredConnect = connect.filter((c) => c.name.toLowerCase().includes(q));
    const filteredLegal   = legal.filter(  (l) => l.name.toLowerCase().includes(q));

    const hasResults = filteredPages.length + filteredResume.length + filteredConnect.length + filteredLegal.length > 0;

    useEffect(() => {
        if (isOpen) {
            /*
                FIX: was setting overflow "auto" on close — should be "" (empty)
                to restore whatever the stylesheet's value is (e.g. overflow-x: hidden
                from globals.css). Setting "auto" explicitly overrides that.
            */
            document.body.style.overflow = "hidden";
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = "";
            setTimeout(() => setSearch(""), 0);
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{    opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1,    y: 0   }}
                        exit={{    opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-[600px] bg-white/70 dark:bg-black/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search header */}
                        <div className="flex items-center px-4 py-3 border-b border-neutral-100 dark:border-[#222]">
                            <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a command or search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 text-[15px]"
                            />
                            <div className="flex items-center space-x-3 ml-3 shrink-0">
                                {/* Theme toggle — shows correct icon for current theme */}
                                <button
                                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                    aria-label="Toggle theme"
                                    className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                                >
                                    {resolvedTheme === "dark"
                                        ? <Sun  className="w-4 h-4" />
                                        : <Moon className="w-4 h-4" />
                                    }
                                </button>
                                <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 dark:bg-[#222] px-2 py-1 rounded-md">esc</span>
                            </div>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 p-2 space-y-4">

                            {/* No results */}
                            {!hasResults && (
                                <p className="text-center text-sm text-neutral-400 py-8">
                                    No results for &ldquo;{search}&rdquo;
                                </p>
                            )}

                            {/* Pages */}
                            {filteredPages.length > 0 && (
                                <div>
                                    <SectionLabel label="Pages" />
                                    <div className="space-y-0.5">
                                        {filteredPages.map((item) => (
                                            <NavRow key={item.name} item={item} onClose={onClose} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resume */}
                            {filteredResume.length > 0 && (
                                <div>
                                    <SectionLabel label="Resume" />
                                    <div className="space-y-0.5">
                                        {filteredResume.map((item) => (
                                            <ExternalRow key={item.name} item={item} onClose={onClose} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Connect */}
                            {filteredConnect.length > 0 && (
                                <div>
                                    <SectionLabel label="Connect" />
                                    <div className="space-y-0.5">
                                        {filteredConnect.map((item) => (
                                            <ExternalRow key={item.name} item={item} onClose={onClose} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Legal */}
                            {filteredLegal.length > 0 && (
                                <div>
                                    <SectionLabel label="Legal" />
                                    <div className="space-y-0.5">
                                        {filteredLegal.map((item) => (
                                            <NavRow key={item.name} item={{ ...item, icon: item.icon }} onClose={onClose} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-neutral-50 dark:bg-[#0a0a0a] border-t border-neutral-100 dark:border-[#222] flex justify-between items-center text-[11px] text-neutral-500">
                            <div className="flex space-x-4">
                                <Link href="/privacy" onClick={onClose} className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
                                <Link href="/terms"   onClick={onClose} className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center gap-1">↑↓ Navigate</span>
                                <span className="flex items-center gap-1">↵ Open</span>
                                <span className="flex items-center gap-1">esc Close</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}