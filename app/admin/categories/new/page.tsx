import AdminHeader from "@/components/admin/AdminHeader";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategoryAction, deleteCategoryAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const admin = await requireAdmin();
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AdminHeader
      active="new-category"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Add a catalogue category first, then create products under that category."
      eyebrow="New Category"
      maxWidth="form"
      title="Add category"
    >
      <div className="mt-8">
        <CategoryForm action={createCategoryAction} />
      </div>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-black text-slate-950">Added categories</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{categories.length} categories available</p>
          </div>
          <a href="/admin/products/new" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
            Add Product
          </a>
        </div>

        <div className="grid gap-3 p-5">
          {categories.map((category) => (
            <article key={category.id} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white">
                {category.imageSrc ? (
                  <img src={category.imageSrc} alt={category.imageAlt || category.name} className="h-14 w-14 object-contain" />
                ) : (
                  <span className="text-lg font-black text-[var(--sun-sky-dark)]">{category.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-black text-slate-950">{category.name}</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-500">{category.description || category.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-fit rounded-full bg-[var(--sun-mint-soft)] px-3 py-1 text-xs font-black text-[#16835f]">
                  {category._count.products} products
                </span>

                <form action={deleteCategoryAction} method="post">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <button
                    type="submit"
                    className="rounded-lg bg-white px-3 py-1 text-xs font-black text-red-600 ring-1 ring-red-100 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}

          {categories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-bold text-slate-500">
              No categories added yet.
            </div>
          ) : null}
        </div>
      </section>
    </AdminHeader>
  );
}
