"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{
                clipPath: "circle(0% at 50% 50%)",
                opacity: 0,
            }}
            animate={{
                clipPath: "circle(150% at 50% 50%)",
                opacity: 1,
            }}
            transition={{
                clipPath: {
                    duration: 0.75,
                    ease: [0.76, 0, 0.24, 1],
                },
                opacity: {
                    duration: 0.15,
                    ease: "easeOut",
                },
            }}
            style={{ willChange: "clip-path" }}
        >
            {children}
        </motion.div>
    );
}
