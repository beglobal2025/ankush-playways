"use client";

import Link from "next/link";
import { useState } from "react";

import { useScrolled } from "@/hooks/useScrolled";

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
  const scrolled = useScrolled(24, overlayUntilScroll);
  const glassVisible = !overlayUntilScroll || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[400ms] ease-out ${
        glassVisible
          ? "border-white/[0.35] bg-white/[0.82] shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-[18px]"
          : "border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <nav className="relative mx-auto flex h-[90px] max-w-7xl items-center justify-between px-5 sm:h-[100px] sm:px-8 lg:h-[110px]">
        <Link
          href="/"
          className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#173A63] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="Ankush Playways home"
        >
          <img
            src="/assets/ankush-logo.png"
            alt="Ankush Playways"
            className="h-[70px] w-auto translate-y-[0px] object-contain [filter:drop-shadow(0_8px_20px_rgba(0,0,0,0.12))] sm:h-[81px] lg:h-[95px]"
          />
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-white/50 bg-white/70 text-[#173A63] shadow-sm backdrop-blur-md transition-colors duration-[250ms] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A63] focus-visible:ring-offset-2 lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
            <span className="absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current" />
          </span>
        </button>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-sm font-bold text-[#173A63] lg:flex">
          {navItems.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="relative whitespace-nowrap rounded-sm py-2 outline-none transition-colors duration-[250ms] ease-out after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-[var(--sun-coral-strong)] after:transition-transform after:duration-[250ms] after:ease-out hover:text-[var(--sun-coral-strong)] hover:after:scale-x-100 focus-visible:text-[var(--sun-coral-strong)] focus-visible:ring-2 focus-visible:ring-[#173A63]/70 focus-visible:ring-offset-4 focus-visible:after:scale-x-100"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/40 bg-white/[0.9] px-5 py-4 shadow-[0_16px_35px_rgba(0,0,0,0.08)] backdrop-blur-[18px] lg:hidden">
          <div className="grid gap-2 text-sm font-bold text-[#173A63]">
            {navItems.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 transition-colors duration-[250ms] hover:bg-[var(--sun-sky-soft)] hover:text-[var(--sun-coral-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A63]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
