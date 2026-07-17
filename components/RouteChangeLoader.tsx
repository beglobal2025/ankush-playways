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
  const routeAtStartRef = useRef<string | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRoute = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!shouldShowLoader(event)) {
        return;
      }

      const routeBeforeNavigation = `${window.location.pathname}${window.location.search}`;
      routeAtStartRef.current = routeBeforeNavigation;
      setLoading(true);
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!loading || !routeAtStartRef.current || currentRoute === routeAtStartRef.current) {
      return;
    }

    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
    }

    finishTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      routeAtStartRef.current = null;
    }, 180);

    return () => {
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
      }
    };
  }, [currentRoute, loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-white/55 backdrop-blur-[2px]" role="status" aria-live="polite" aria-label="Loading page">
      <div className="absolute inset-x-0 top-0 h-1 w-full overflow-hidden bg-[var(--sun-sky-soft)]">
        <div className="route-loader-bar h-full w-1/2 rounded-r-full bg-[var(--sun-coral-strong)]" />
      </div>
      <div className="mx-5 flex min-w-52 flex-col items-center rounded-[24px] border border-[var(--sun-line)] bg-white/95 px-8 py-6 shadow-2xl shadow-[#7ecae1]/25">
        <div className="flex h-8 items-center gap-2" aria-hidden="true">
          <span className="route-loader-dot size-3 rounded-full bg-[var(--sun-coral-strong)]" />
          <span className="route-loader-dot size-3 rounded-full bg-[var(--sun-yellow)] [animation-delay:0.14s]" />
          <span className="route-loader-dot size-3 rounded-full bg-[var(--sun-mint-strong)] [animation-delay:0.28s]" />
        </div>
        <span className="mt-2 text-sm font-black text-[var(--sun-ink)]">Loading your page…</span>
      </div>
    </div>
  );
}
