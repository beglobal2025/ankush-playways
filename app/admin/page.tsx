import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const [productCount, categoryCount, draftCount, featuredCount, publishedCount, recentCategories, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { status: "DRAFT" } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.product.findMany({
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
    ]);

  const cards = [
    { accent: "bg-[var(--sun-sky-soft)] text-[var(--sun-sky-dark)]", icon: "P", label: "Total Products", value: productCount },
    { accent: "bg-[var(--sun-coral-soft)] text-[var(--sun-coral-strong)]", icon: "C", label: "Categories", value: categoryCount },
    { accent: "bg-[var(--sun-yellow-soft)] text-[#b76d00]", icon: "D", label: "Draft Items", value: draftCount },
    { accent: "bg-[var(--sun-mint-soft)] text-[#1d966f]", icon: "F", label: "Featured", value: featuredCount },
  ];

  return (
    <AdminHeader
      active="dashboard"
      adminEmail={admin.email}
      adminName={admin.name}
      description="A clear overview of your catalogue, publishing status, and latest updates."
      eyebrow="Dashboard"
      title="Catalogue dashboard"
      action={
        <Link href="/admin/products/new" className="rounded-lg bg-[var(--sun-mint-strong)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
          Add Product
        </Link>
      }
    >
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-black ${card.accent}`}>{card.icon}</div>
            <p className="mt-5 text-3xl font-black tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{card.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-black text-slate-950">Recent Categories</h2>
            <Link href="/admin/products" className="text-sm font-black text-[var(--sun-coral-strong)]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--sun-coral-soft)] text-xs font-black text-[var(--sun-coral-strong)]">
                    C
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-900">{category.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{category.slug}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[var(--sun-mint-soft)] px-3 py-1 text-xs font-black text-[#16835f]">
                  {category._count.products} items
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-black text-slate-950">Publishing Snapshot</h2>
            <Link href="/admin/products" className="text-sm font-black text-[var(--sun-coral-strong)]">
              Manage
            </Link>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{publishedCount}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">Published</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{draftCount}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">Drafts</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{featuredCount}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">Featured</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-black text-slate-950">Recent Products</h2>
          <Link href="/admin/products" className="text-sm font-black text-[var(--sun-coral-strong)]">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentProducts.map((product) => (
            <div key={product.id} className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-100">
                  {product.images[0]?.src ? <img src={product.images[0].src} alt="" className="h-10 w-10 object-contain" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-900">{product.name}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {product.code} / {product.category.name}
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-full bg-[var(--sun-mint-soft)] px-3 py-1 text-xs font-black text-[#16835f]">
                {product.status}
              </span>
              <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-black text-[var(--sun-sky-dark)]">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </AdminHeader>
  );
}
