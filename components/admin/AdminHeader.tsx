import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/lib/admin/actions";

type AdminSection = "dashboard" | "products" | "featured" | "banner" | "new-product" | "new-category";

interface AdminHeaderProps {
  active: AdminSection;
  adminEmail?: string;
  adminName: string;
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  eyebrow: string;
  maxWidth?: "wide" | "form";
  title: string;
}

const navItems: Array<{
  href: string;
  icon: string;
  id: AdminSection;
  label: string;
}> = [
  { href: "/admin", icon: "D", id: "dashboard", label: "Dashboard" },
  { href: "/admin/products", icon: "P", id: "products", label: "Products" },
  { href: "/admin/featured", icon: "F", id: "featured", label: "Featured" },
  { href: "/admin/banner", icon: "B", id: "banner", label: "Banner" },
  { href: "/admin/categories/new", icon: "C", id: "new-category", label: "Add Category" },
  { href: "/admin/products/new", icon: "+", id: "new-product", label: "Add Product" },
];

export default function AdminHeader({
  active,
  adminEmail,
  adminName,
  action,
  children,
  description,
  eyebrow,
  maxWidth = "wide",
  title,
}: AdminHeaderProps) {
  return (
    <div className="min-h-screen bg-[#f6f9fc] text-slate-950 lg:flex">
      <aside className="border-b border-sky-100 bg-[var(--sun-ink)] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:border-sky-200">
        <div className="flex items-center gap-3 px-5 py-5 lg:px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <img src="/assets/sunshine-logo.png" alt="ANKUSH Playways" className="h-10 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <Link href="/admin" className="block text-lg font-black leading-tight tracking-tight">
              ANKUSH Admin
            </Link>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">Admin Panel</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 text-sm font-bold lg:grid lg:gap-2 lg:overflow-visible lg:px-4 lg:pb-0">
          {navItems.map((item) => {
            const isActive = item.id === active;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={[
                  "flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 transition",
                  isActive
                    ? "bg-white text-[var(--sun-ink)] shadow-sm"
                    : "text-sky-100 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-8 w-8 place-items-center rounded-md text-xs font-black",
                    isActive ? "bg-[var(--sun-sky-soft)] text-[var(--sun-sky-dark)]" : "bg-white/10 text-white",
                  ].join(" ")}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden border-t border-white/15 p-5 lg:block">
          <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--sun-coral-strong)] text-sm font-black text-white">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{adminName}</p>
              <p className="truncate text-xs font-semibold text-sky-100">{adminEmail ?? "Catalogue manager"}</p>
            </div>
          </div>
          <form action={logoutAction} className="mt-3">
            <button className="w-full rounded-lg border border-white/20 px-4 py-3 text-left text-sm font-black text-sky-50 transition hover:bg-white hover:text-[var(--sun-ink)]">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-900">{title}</p>
              <p className="truncate text-xs font-semibold text-slate-500">Signed in as {adminName}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-[var(--sun-sky-dark)] hover:text-[var(--sun-sky-dark)] sm:inline-flex"
              >
                View site
              </Link>
              <form action={logoutAction} className="lg:hidden">
                <button className="rounded-lg bg-[var(--sun-ink)] px-4 py-2 text-sm font-black text-white transition hover:bg-[var(--sun-sky-dark)]">
                  Logout
                </button>
              </form>
              <div className="hidden h-10 w-10 place-items-center rounded-full bg-[var(--sun-coral-strong)] text-sm font-black text-white sm:grid">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className={["mx-auto px-5 py-8 sm:px-8", maxWidth === "form" ? "max-w-5xl" : "max-w-[1600px]"].join(" ")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--sun-coral-strong)]">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
              {description ? <p className="mt-2 text-sm font-semibold text-slate-500">{description}</p> : null}
            </div>
            {action}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
