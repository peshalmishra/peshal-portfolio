"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Preloader onLoadingComplete={() => setIsLoaded(true)} />
      <Hero isLoaded={isLoaded} />
    </>
  );
}