"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export function ConnectCard() {
    const [copied, setCopied] = useState(false);
    const email = "Email-Address";

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#111] dark:border dark:border-white/5 shadow-sm h-full min-h-[400px]"
        >
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-black flex items-center justify-center border border-neutral-200 dark:border-white/10">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white relative">
                        <div className="absolute inset-0 rounded-full bg-black dark:bg-white animate-ping opacity-50" />
                    </div>
                </div>

                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-300">Available for work</span>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white leading-[1.1]">
                    LET&apos;S BUILD<br />
                    SOMETHING<br />
                    <span className="font-serif italic font-light text-neutral-500 dark:text-neutral-400">that actually works.</span>
                </h2>
            </div>

            <div className="mt-12 flex items-center space-x-3 cursor-pointer group" onClick={copyEmail}>
                <div className="w-8 h-8 rounded-full border border-neutral-200 dark:border-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-serif italic text-black dark:text-white tracking-wide">
                        {email}
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 mt-1 uppercase">
                        {copied ? "Copied to clipboard!" : "Tap to copy email"}
                    </span>
                </div>
            </div>

            <a
                href="mailto:peshalmishra13@gmail.com"
                className="mt-8 flex items-center justify-center w-full py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-widest hover:scale-[0.98] transition-transform"
            >
                CONNECT NOW <ArrowUpRight className="w-4 h-4 ml-2" />
            </a>
        </motion.div>
    );
}
