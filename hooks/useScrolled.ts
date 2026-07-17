"use client";

import { useEffect, useState } from "react";

export function useScrolled(threshold = 24, enabled = true) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setScrolled(false);
      return;
    }

    let animationFrame = 0;

    const updateScrolled = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > threshold;
        setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
      });
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScrolled);
    };
  }, [enabled, threshold]);

  return scrolled;
}
