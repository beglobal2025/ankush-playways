"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Catalogue", "/products"],
  ["Categories", "/#products"],
  ["Offers", "/#offer"],
  ["Contact", "/#contact"],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-white/90 shadow-[0_10px_30px_rgba(30,120,180,0.10)] backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/#home" className="flex items-center" aria-label="ANKUSH Playways home">
          <img
            src="/assets/logo.svg"
            alt="ANKUSH Playways"
            className="h-16 w-auto max-w-[150px] object-contain sm:h-[80px] sm:max-w-[180px]"
          />
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-sky-100 bg-sky-50 text-sky-700 shadow-sm md:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
            <span className="absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current" />
          </span>
        </button>

        <div className="hidden items-center gap-7 text-sm font-bold text-sky-800 md:flex">
          {navItems.map(([label, href]) => (
            <Link key={label} href={href} className="transition hover:text-pink-500">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-sky-100 bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3 text-sm font-bold text-sky-800">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-full bg-sky-50 px-4 py-3">
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
