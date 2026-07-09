"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function shouldShowLoader(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  const target = event.target;
  const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>("a") : null;

  if (!anchor) {
    return false;
  }

  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || anchor.target || anchor.hasAttribute("download")) {
    return false;
  }

  const url = new URL(anchor.href);

  if (url.origin !== window.location.origin) {
    return false;
  }

  return `${url.pathname}${url.search}` !== `${window.location.pathname}${window.location.search}`;
}

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!shouldShowLoader(event)) {
        return;
      }

      setLoading(true);
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 350);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, pathname, searchParams]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => clearTimeout(fallbackTimeout);
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80]" role="status" aria-live="polite" aria-label="Loading page">
      <div className="h-1 w-full overflow-hidden bg-[var(--sun-sky-soft)]">
        <div className="route-loader-bar h-full w-1/2 rounded-r-full bg-[var(--sun-coral-strong)]" />
      </div>
      <div className="mx-auto mt-4 flex max-w-7xl justify-end px-5 sm:px-8">
        <div className="flex items-center gap-3 rounded-full border border-[var(--sun-line)] bg-white/95 px-4 py-2 shadow-xl shadow-[#7ecae1]/20 backdrop-blur">
          <span className="relative grid size-8 place-items-center rounded-full bg-[var(--sun-yellow-soft)]">
            <span className="route-loader-dot absolute size-2 rounded-full bg-[var(--sun-coral-strong)]" />
            <span className="size-4 rounded-full border-2 border-[var(--sun-sky)] bg-white" />
          </span>
          <span className="text-sm font-black text-[var(--sun-ink)]">Loading</span>
        </div>
      </div>
    </div>
  );
}
