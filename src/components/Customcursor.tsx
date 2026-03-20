"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = cursorRef.current;
        if (!el) return;

        let rafId: number;
        let targetX = -200, targetY = -200;
        let scale   = 1;
        let hovering = false;

        /*
            All bugs from original fixed:

            BUG 1 — useEffect deps [clicking, hovering, visible]:
            Effect re-ran and re-registered ALL event listeners on every state
            change (every mousemove, every click). Fixed: empty deps [], runs once.

            BUG 2 — lerp (x += (target - x) * 0.15):
            Made cursor lag behind real pointer. Custom cursors must be pixel-exact
            or they feel broken. Fixed: direct position, no lerp.

            BUG 3 — el.style.scale (separate CSS property):
            Applies scale from element center (50% 50%) so cursor shifted sideways.
            Fixed: scale baked into transform string + transformOrigin "0 0" so
            scaling happens from the tip.

            BUG 4 — useState for clicking/hovering/visible:
            Triggered React re-renders on every interaction. Fixed: plain let
            variables mutated directly in event handlers, read in rAF loop.

            BUG 5 — per-element hover listeners via querySelectorAll:
            Misses dynamically added elements (dropdowns, portals).
            Fixed: event delegation on mousemove via closest().
        */

        const render = () => {
            el.style.transform = `translate(${targetX}px, ${targetY}px) scale(${scale})`;
            rafId = requestAnimationFrame(render);
        };
        rafId = requestAnimationFrame(render);

        const onMove = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            el.style.opacity = "1";

            // Delegation — detect hover over interactive elements
            const target = e.target as HTMLElement;
            const isInteractive = !!target.closest("a, button, [role='button'], input, textarea, select, label");

            if (isInteractive && !hovering) {
                hovering = true;
                scale    = 1.35;
            } else if (!isInteractive && hovering) {
                hovering = false;
                scale    = 1;
            }
        };

        const onDown  = () => { scale = 0.78; };
        const onUp    = () => { scale = hovering ? 1.35 : 1; };
        const onLeave = () => { el.style.opacity = "0"; };
        const onEnter = () => { el.style.opacity = "1"; };

        window.addEventListener("mousemove",    onMove,   { passive: true });
        window.addEventListener("mousedown",    onDown);
        window.addEventListener("mouseup",      onUp);
        document.addEventListener("mouseleave", onLeave);
        document.addEventListener("mouseenter", onEnter);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove",    onMove);
            window.removeEventListener("mousedown",    onDown);
            window.removeEventListener("mouseup",      onUp);
            document.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("mouseenter", onEnter);
        };
    }, []); // empty — registers once, never re-registers

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none select-none"
            style={{
                zIndex:          9999,
                opacity:         0,
                willChange:      "transform",
                transformOrigin: "0 0",
                transition:      "opacity 0.2s ease",
            }}
        >
            <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
                }}
            >
                <path
                    d="M0 0L20 9L13 13L9 24L0 0Z"
                    fill="white"
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}