"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

export default function ParticleBackground() {
    const [init, setInit] = useState(false);
    const { resolvedTheme } = useTheme();
    const isLight = resolvedTheme === "light";

    // Initialize the tsParticles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // loadSlim is a smaller bundle that provides basic shapes and movement.
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (_container?: Container): Promise<void> => {
        // Optional debugging if needed
        // console.log("Particles container loaded", container);
    };

    const options: ISourceOptions = {
        background: {
            color: {
                value: "transparent",
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                // Keep interactivity minimal or disabled so it doesn't distract.
                // We're disabling hover/click to ensure the background stays passive.
            },
        },
        particles: {
            color: {
                // Adapt particle colors to the current theme
                value: isLight ? ["#000000", "#333333"] : ["#ffffff", "#e0f2fe"],
            },
            links: {
                // Adapt linking lines color and opacity based on theme
                color: isLight ? "#000000" : "#ffffff",
                distance: 150,
                enable: true,
                opacity: isLight ? 0.2 : 0.1, // Slightly darker in light mode for visibility
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce", // Bounce off walls to keep particles in view
                },
                random: false,
                speed: 0.6, // Very slow, elegant drift
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    // width: 800, // Replaced by height/width properties below internally usually, but 'area' is modern syntax if supported. Using default responsive density.
                },
                value: 45, // Not too crowded
            },
            opacity: {
                value: 0.3, // Soft glowing dots
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 2.5 }, // Small dots
            },
        },
        detectRetina: true,
    };

    if (!init) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[-10] pointer-events-none data-particles-bg">
            <Particles
                key={resolvedTheme} // Force re-render on theme change
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                className="w-full h-full"
            />
        </div>
    );
}
