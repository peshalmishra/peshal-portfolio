import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/Customcursor";
import ParticleBackground from "@/components/ParticleBackground";
import DevtoolsBlocker from "@/components/DevtoolsBlocker";

const inter = Inter({
    variable: "--font-inter",
    subsets:  ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets:  ["latin"],
});

/*
    FIX: metadataBase was missing — Next.js needs this to resolve absolute
    URLs for og:image and twitter:image. Without it you get the
    "metadataBase property in metadata export is not set" warning and
    social images may not resolve correctly in production.
*/
export const metadata: Metadata = {
    metadataBase: new URL("https://peshalmishra.dev"),
    title:        "Peshal Mishra | Cloud-Focused Full Stack Developer",
    description:  "Portfolio of Peshal Mishra – building scalable cloud-native applications and backend systems.",
    openGraph: {
        title:       "Peshal Mishra | Cloud-Focused Full Stack Developer",
        description: "Portfolio of Peshal Mishra – building scalable cloud-native applications and backend systems.",
        url:         "https://peshalmishra.dev",
        siteName:    "Peshal Mishra Portfolio",
        images: [
            {
                url:    "/og-image.jpg",
                width:  1200,
                height: 630,
                alt:    "Peshal Mishra Portfolio",
            },
        ],
        locale: "en_US",
        type:   "website",
    },
    twitter: {
        card:        "summary_large_image",
        title:       "Peshal Mishra | Cloud-Focused Full Stack Developer",
        description: "Portfolio of Peshal Mishra – building scalable cloud-native applications and backend systems.",
        images:      ["/og-image.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Global custom cursor — sits above everything */}
                    <CustomCursor />

                    {/* Particle canvas — fixed, behind all content */}
                    <ParticleBackground />

                    <Navbar />

                    <main className="relative min-h-screen selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-black">
                        {children}
                    </main>

                    <Footer />
                </ThemeProvider>
                <DevtoolsBlocker />
            </body>
        </html>
    );
}