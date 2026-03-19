"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    onLoadingComplete: () => void;
}

export function Preloader({ onLoadingComplete }: PreloaderProps) {
    const [isLoading, setIsLoading] = useState(true);

    /*
        FIX 1: Stabilise the callback with a ref so it never appears in the
        effect's dependency array. The parent (page.tsx) passes an inline
        arrow function which creates a new reference on every render —
        including it in deps would re-run the effect and restart the timer
        on every parent render.
    */
    const callbackRef = useRef(onLoadingComplete);
    useEffect(() => {
        callbackRef.current = onLoadingComplete;
    }, [onLoadingComplete]);

    /*
        FIX 2: Both timers are stored in refs and explicitly cleared in the
        cleanup function. Previously the inner setTimeout was untracked —
        if the component unmounted between the two timeouts firing (HMR,
        fast navigation) the inner callback would still call onLoadingComplete
        and mutate document.body on an already-unmounted tree.

        FIX 3: Dependency array is now [] (run once on mount only). The
        original [isLoading, onLoadingComplete] caused a spurious re-run
        when isLoading flipped to false, which re-entered the effect and
        re-set the timer unnecessarily.
    */
    const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
    const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Lock scroll while preloader is visible
        document.body.style.overflow = "hidden";

        // After 1.5 s — begin exit animation
        t1.current = setTimeout(() => {
            setIsLoading(false);

            // After exit animation completes (0.8 s) — unlock and notify parent
            t2.current = setTimeout(() => {
                document.body.style.overflow = "";
                callbackRef.current();
            }, 800);
        }, 1500);

        return () => {
            // Clean up both timers and restore scroll on early unmount
            if (t1.current !== null) clearTimeout(t1.current);
            if (t2.current !== null) clearTimeout(t2.current);
            document.body.style.overflow = "";
        };
    }, []); // intentionally empty — runs once on mount

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#050505]"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1,   opacity: 1 }}
                        exit={{    scale: 3,   opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center"
                    >
                        <video
                            src="/Progress of loading hand.webm"
                            autoPlay
                            muted
                            playsInline
                            // loop intentionally kept — video plays for 1.5s window;
                            // if video is shorter than 1.5s, looping looks intentional.
                            // Remove if video has a preferred freeze-frame end state.
                            loop
                            className="w-full h-full object-contain pointer-events-none"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}