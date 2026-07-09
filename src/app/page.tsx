"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    // Always show hero immediately for better UX
    setShowHero(true);
  }, []);

  return (
    <>
      <Preloader onLoadingComplete={() => setIsLoaded(true)} />
      {showHero && <Hero isLoaded={isLoaded} hidePreloader={!isLoaded} />}
    </>
  );
}