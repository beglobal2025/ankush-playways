import Link from "next/link";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import AdminHeader from "@/components/admin/AdminHeader";
import FeaturedProductPicker from "@/components/admin/FeaturedProductPicker";
import { featureProductAction, unfeatureProductAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminProductCard = {
  id: string;
  code: string;
  name: string;
  status: "DRAFT" | "PUBLISHED";
  category: {
    name: string;
  };
  images: Array<{
    src: string;
  }>;
};

function ProductThumb({ product }: { product: AdminProductCard }) {
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-slate-100">
      {product.images[0]?.src ? <img src={product.images[0].src} alt="" className="h-14 w-14 object-contain" /> : null}
    </div>
  );
}

function StatusPill({ status }: { status: AdminProductCard["status"] }) {
  return (
    <span
      className={[
        "w-fit rounded-full px-3 py-1 text-xs font-black",
        status === "PUBLISHED" ? "bg-[var(--sun-mint-soft)] text-[#16835f]" : "bg-[var(--sun-yellow-soft)] text-[#9b6500]",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export default async function FeaturedProductsPage() {
  const admin = await requireAdmin();
  const productIncludes = {
    category: true,
    images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
  };

  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      include: {
        products: {
          where: { isFeatured: false },
          include: productIncludes,
          orderBy: [{ name: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      include: productIncludes,
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  return (
    <AdminHeader
      active="featured"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Search catalogue products and choose any products to feature on the homepage."
      eyebrow="Featured Products"
      title="Manage featured products"
      action={
        <Link href="/admin/products/new" className="rounded-lg bg-[var(--sun-mint-strong)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
          Add Product
        </Link>
      }
    >
      <FeaturedProductPicker categories={categories} featureAction={featureProductAction} />

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-black text-slate-950">Featured products</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">All products currently marked as featured.</p>
        </div>

        <div className="grid gap-3 p-5 lg:grid-cols-2">
          {featuredProducts.map((product) => (
            <article key={product.id} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <ProductThumb product={product} />
              <div className="min-w-0">
                <p className="truncate font-black text-slate-950">{product.name}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {product.code} / {product.category.name}
                </p>
                <div className="mt-2">
                  <StatusPill status={product.status} />
                </div>
              </div>
              <form action={unfeatureProductAction.bind(null, product.id)}>
                <AdminSubmitButton
                  idleText="Remove"
                  pendingText="Removing..."
                  className="w-full justify-center rounded-lg bg-white px-4 py-3 text-sm font-black text-red-600 ring-1 ring-red-100 transition hover:bg-red-50 sm:w-auto"
                />
              </form>
            </article>
          ))}

          {featuredProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-bold text-slate-500">
              No featured products yet.
            </div>
          ) : null}
        </div>
      </section>
    </AdminHeader>
  );
}
