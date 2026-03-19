"use client";

import { Projects } from "@/components/Projects";
import { motion } from "framer-motion";

export default function ProjectsPage() {
    return (
        <div className="min-h-screen flex flex-col pt-24 pb-12 overflow-x-hidden">
            {/* Hero Section */}
            <section className="w-full flex flex-col items-center justify-center text-center min-h-[50vh] relative mt-10 md:mt-20 z-10">
                {/* Subtle gentle circular glow in the center behind the text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/[0.03] dark:bg-white/[0.04] blur-[80px] md:blur-[120px] rounded-full pointer-events-none -z-10" />

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black tracking-[-.05em] leading-none text-neutral-900 dark:text-white"
                >
                    MY WORKS
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 md:mt-8 flex flex-col items-center space-y-4 md:space-y-6"
                >
                    <p className="text-xs sm:text-sm md:text-base tracking-[0.3em] md:tracking-[0.4em] font-semibold text-neutral-500 uppercase">
                        Crafting Digital Experiences
                    </p>
                    <p className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-neutral-800 dark:text-neutral-200">
                        with passion & code.
                    </p>
                </motion.div>
            </section>

            {/* Projects List */}
            <div className="w-full relative z-20 mt-12 md:mt-24">
                <Projects />
            </div>
        </div>
    );
}
