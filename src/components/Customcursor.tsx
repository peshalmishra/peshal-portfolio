"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: -200, y: -200 });
    const currentRef = useRef({ x: -200, y: -200 });
    const rafRef = useRef<number | null>(null);

    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY };
            if (!visible) setVisible(true);
        };

        const down = () => setClicking(true);
        const up = () => setClicking(false);

        const leave = () => setVisible(false);
        const enter = () => setVisible(true);

        const hover = () => setHovering(true);
        const unhover = () => setHovering(false);

        const attachHoverListeners = () => {
            const elements = document.querySelectorAll("a, button");
            elements.forEach((el) => {
                el.addEventListener("mouseenter", hover);
                el.addEventListener("mouseleave", unhover);
            });
        };

        attachHoverListeners();

        const tick = () => {
            if (cursorRef.current) {
                const { x, y } = posRef.current;

                currentRef.current.x += (x - currentRef.current.x) * 0.15;
                currentRef.current.y += (y - currentRef.current.y) * 0.15;

                let scale = 1;

                if (clicking) scale = 0.8;
                if (hovering) scale = 1.4;

                cursorRef.current.style.transform =
                    `translate(${currentRef.current.x}px, ${currentRef.current.y}px) scale(${scale})`;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        window.addEventListener("mousemove", move, { passive: true });
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);
        document.addEventListener("mouseleave", leave);
        document.addEventListener("mouseenter", enter);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            document.removeEventListener("mouseleave", leave);
            document.removeEventListener("mouseenter", enter);
        };
    }, [clicking, hovering, visible]);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none select-none"
            style={{
                willChange: "transform",
                transformOrigin: "0 0",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease",
                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
            }}
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0 0L22 10L14 14L10 26L0 0Z"
                    fill="white"
                    stroke="#222"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}