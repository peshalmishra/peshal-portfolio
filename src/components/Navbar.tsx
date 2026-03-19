"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CommandMenu } from "./CommandMenu";

const links = [
    { name: "Home",  path: "/"         },
    { name: "About", path: "/about"    },
    { name: "Work",  path: "/projects" },
    { name: "Blogs", path: "/blog"     },
];

// ---------------------------------------------------------------------------
// More dropdown — shared between both nav states
// ---------------------------------------------------------------------------

function MoreDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{    opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48 z-50"
                >
                    <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-[#333] rounded-2xl shadow-xl overflow-hidden p-2 flex flex-col items-start">
                        <Link href="/contact" onClick={onClose}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222] rounded-xl transition-colors mb-1">
                            Contact Me
                        </Link>
                        <Link href="/resume" onClick={onClose}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222] rounded-xl transition-colors mb-1 flex items-center justify-between group/resume">
                            <span>Resume</span>
                            <svg className="w-3 h-3 opacity-40 group-hover/resume:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                        <div className="w-full h-px bg-neutral-200 dark:bg-[#333] my-1" />
                        <div className="w-full px-4 py-2">
                            <p className="text-[10px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-2">Links</p>
                            <div className="flex flex-col space-y-1 -mx-2">
                                {[
                                    { label: "LinkedIn", href: "https://linkedin.com/in/peshalmishra"  },
                                    { label: "GitHub",   href: "https://github.com/peshalmishra"       },
                                    { label: "Twitter",  href: "https://twitter.com/peshalmishra"      },
                                ].map((item) => (
                                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClose}
                                        className="w-full text-left px-2 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222] rounded-lg transition-colors flex items-center justify-between group/link">
                                        {item.label}
                                        <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export function Navbar() {
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isScrolled,    setIsScrolled]    = useState(false);
    const [hoveredPath,   setHoveredPath]   = useState<string | null>(null);
    const [moreOpen,      setMoreOpen]      = useState(false);
    const moreRef = useRef<HTMLLIElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCommandOpen((prev) => !prev);
            }
            if (e.key === "Escape") setMoreOpen(false);
        };
        const handleScroll       = () => setIsScrolled(window.scrollY > 80);
        const handleClickOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node))
                setMoreOpen(false);
        };

        window.addEventListener("keydown",     handleKeyDown);
        window.addEventListener("scroll",      handleScroll, { passive: true });
        document.addEventListener("mousedown", handleClickOutside);
        handleScroll();

        return () => {
            window.removeEventListener("keydown",     handleKeyDown);
            window.removeEventListener("scroll",      handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(path + "/");
    };

    // Shared nav links list
    const NavLinks = ({ pillId, compact }: { pillId: string; compact?: boolean }) => (
        <ul className="flex items-center relative" onMouseLeave={() => setHoveredPath(null)}>
            {links.map((link) => {
                const active   = isActive(link.path);
                const showPill = hoveredPath === link.path || (hoveredPath === null && active);
                return (
                    <li key={link.name} className="relative" onMouseEnter={() => setHoveredPath(link.path)}>
                        <Link href={link.path}
                            className={`relative ${compact ? "px-4 py-1.5" : "px-5 py-2"} text-sm font-medium transition-colors duration-300 rounded-full flex items-center justify-center z-10 ${
                                showPill
                                    ? "text-white dark:text-[#111]"
                                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                            }`}
                        >
                            {link.name}
                        </Link>
                        {showPill && (
                            <motion.div
                                layoutId={pillId}
                                className="absolute inset-0 bg-[#111] dark:bg-white rounded-full shadow-sm -z-10"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        )}
                    </li>
                );
            })}

            {/* More */}
            <li ref={moreRef} className="relative"
                onMouseEnter={() => { setHoveredPath("more"); setMoreOpen(true); }}
                onMouseLeave={() => setMoreOpen(false)}
            >
                <button
                    onClick={() => setMoreOpen((p) => !p)}
                    onFocus={() => setMoreOpen(true)}
                    aria-haspopup="true"
                    aria-expanded={moreOpen}
                    className={`${compact ? "px-4 py-1.5" : "px-5 py-2"} text-sm font-medium transition-all duration-300 rounded-full flex items-center relative z-10 space-x-1 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                        hoveredPath === "more"
                            ? "text-white dark:text-[#111]"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                >
                    <span>More</span>
                    <motion.svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                        animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                        className="mt-0.5 opacity-50"
                    >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                </button>
                {hoveredPath === "more" && (
                    <motion.div
                        layoutId={pillId}
                        className="absolute inset-0 bg-[#111] dark:bg-white rounded-full shadow-sm -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                )}
                <MoreDropdown open={moreOpen} onClose={() => setMoreOpen(false)} />
            </li>
        </ul>
    );

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
                style={{ padding: isScrolled ? "14px 24px" : "20px 24px" }}
            >

                {/* ── NOT scrolled: full-width, logo left, nav+controls right ── */}
                <AnimatePresence>
                    {!isScrolled && (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pointer-events-auto max-w-[1400px] mx-auto flex items-center justify-between"
                        >
                            {/* Left — logo + tagline */}
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl font-serif italic font-bold text-black dark:text-white">PM</div>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-[10px] tracking-widest font-semibold text-neutral-500 dark:text-neutral-400">CREATIVE ENGINEER</span>
                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]" />
                                        <span className="text-[10px] tracking-widest font-semibold text-green-600 dark:text-green-500">BUILDING THE FUTURE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right — nav pill + controls */}
                            <div className="flex items-center gap-3">
                                <nav className="hidden md:flex items-center px-1.5 py-1.5 rounded-full bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border border-neutral-200 dark:border-[#222] shadow-sm">
                                    <NavLinks pillId="nav-pill-full" />
                                </nav>

                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-[#333] flex items-center justify-center bg-white dark:bg-[#111] shadow-sm hidden sm:flex">
                                        <ThemeToggle />
                                    </div>
                                    <Link href="/contact"
                                        className="hidden sm:flex px-5 py-2.5 text-sm font-medium text-white bg-[#111] dark:text-[#111] dark:bg-[#ededed] rounded-full hover:bg-black dark:hover:bg-white transition-colors shadow-sm whitespace-nowrap">
                                        Book a Call
                                    </Link>
                                    <button onClick={() => setIsCommandOpen(true)} aria-label="Open command menu (⌘K)"
                                        className="w-10 h-10 rounded-full border border-neutral-200 dark:border-[#333] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors shadow-sm bg-white dark:bg-[#111]">
                                        <Command className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Scrolled: compact centered pill ── */}
                <AnimatePresence>
                    {isScrolled && (
                        <motion.div
                            key="pill"
                            initial={{ opacity: 0, y: -12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0,   scale: 1    }}
                            exit={{    opacity: 0, y: -12, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="pointer-events-auto w-fit mx-auto flex items-center gap-2 bg-white/85 dark:bg-[#111]/85 backdrop-blur-md border border-neutral-200 dark:border-[#222] rounded-full px-3 py-2 shadow-lg"
                        >
                            {/* Mini logo */}
                            <div className="text-base font-serif italic font-bold text-black dark:text-white px-1">PM</div>

                            <div className="w-px h-4 bg-neutral-200 dark:bg-[#333]" />

                            {/* Compact nav */}
                            <nav className="hidden md:flex items-center">
                                <NavLinks pillId="nav-pill-compact" compact />
                            </nav>

                            <div className="w-px h-4 bg-neutral-200 dark:bg-[#333]" />

                            {/* Controls */}
                            <div className="flex items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full border border-neutral-200 dark:border-[#333] flex items-center justify-center bg-white dark:bg-[#111]">
                                    <ThemeToggle />
                                </div>
                                <Link href="/contact"
                                    className="px-4 py-1.5 text-sm font-medium text-white bg-[#111] dark:text-[#111] dark:bg-[#ededed] rounded-full hover:bg-black dark:hover:bg-white transition-colors whitespace-nowrap hidden sm:flex">
                                    Book a Call
                                </Link>
                                <button onClick={() => setIsCommandOpen(true)} aria-label="Open command menu"
                                    className="w-8 h-8 rounded-full border border-neutral-200 dark:border-[#333] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white bg-white dark:bg-[#111]">
                                    <Command className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.header>

            <CommandMenu isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        </>
    );
}