"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Catalogue", "/products#catalogue-list"],
  ["Categories", "/#products"],
  ["Contact Us", "/contact"],
];

interface SiteHeaderProps {
  overlayUntilScroll?: boolean;
}

export default function SiteHeader({ overlayUntilScroll = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!overlayUntilScroll);
  const headerVisible = !overlayUntilScroll || scrolled || open;

  useEffect(() => {
    if (!overlayUntilScroll) {
      return;
    }

    const updateScrolled = () => {
      setScrolled(window.scrollY > 60);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, [overlayUntilScroll]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        headerVisible
          ? "border-b border-[var(--sun-line)] bg-white/90 shadow-[0_10px_30px_rgba(30,120,180,0.10)] backdrop-blur"
          : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="brand-logo-badge group relative isolate flex items-center overflow-hidden rounded-[22px] border border-white/90 bg-white/95 px-3 py-1.5 shadow-[0_12px_30px_rgba(254,179,0,0.24),0_4px_0_rgba(243,108,120,0.14)] ring-1 ring-[var(--sun-line)]/80 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.025] hover:shadow-[0_16px_34px_rgba(254,179,0,0.30),0_4px_0_rgba(243,108,120,0.18)]"
          aria-label="Ankush Playways home"
        >
          <span className="absolute -left-10 top-0 h-full w-10 -skew-x-12 bg-white/45 opacity-0 transition-all duration-700 group-hover:left-[115%] group-hover:opacity-100" aria-hidden="true" />
          <img
            src="/assets/sunshine-logo-cropped.png"
            alt="Ankush Playways"
            className="relative z-10 h-auto w-[142px] object-contain sm:w-[164px]"
          />
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`grid size-11 place-items-center rounded-full border text-[var(--sun-ink)] shadow-sm transition ${
            headerVisible
              ? "border-[var(--sun-line)] bg-[var(--sun-sky-soft)]"
              : "border-white/70 bg-white/75 backdrop-blur"
          } md:hidden`}
        >
          <span className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
            <span className="absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current" />
          </span>
        </button>

        <div
          className={`hidden items-center gap-7 text-sm font-bold text-[var(--sun-ink)] transition-all duration-300 md:flex ${
            headerVisible ? "opacity-100" : "pointer-events-none opacity-0 -translate-y-2"
          }`}
        >
          {navItems.map(([label, href]) => (
            <Link key={label} href={href} className="transition hover:text-[var(--sun-coral-strong)]">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--sun-line)] bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3 text-sm font-bold text-[var(--sun-ink)]">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-full bg-[var(--sun-sky-soft)] px-4 py-3">
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
