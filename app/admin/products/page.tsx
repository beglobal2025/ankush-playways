import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { deleteProductAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <AdminHeader
      active="products"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Review, edit, publish, and remove catalogue items from one place."
      eyebrow="Products"
      title="Manage catalogue"
      action={
        <Link href="/admin/products/new" className="rounded-lg bg-[var(--sun-mint-strong)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
          Add Product
        </Link>
      }
    >
      <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-black text-slate-950">Catalogue items</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{products.length} products found</p>
          </div>
          <span className="rounded-full bg-[var(--sun-sky-soft)] px-3 py-1 text-xs font-black text-[var(--sun-sky-dark)]">
            Latest updates first
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="align-middle transition hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-slate-100">
                        {product.images[0]?.src ? (
                          <img src={product.images[0].src} alt="" className="h-12 w-12 object-contain" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900">{product.name}</p>
                        <p className="text-xs font-bold text-slate-500">{product.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{product.category.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-black",
                        product.status === "PUBLISHED"
                          ? "bg-[var(--sun-mint-soft)] text-[#16835f]"
                          : "bg-[var(--sun-yellow-soft)] text-[#9b6500]",
                      ].join(" ")}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-600">
                    {product.price ? `₹${product.price.toLocaleString("en-IN")}` : "Request"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="rounded-full px-3 py-2 font-black text-[var(--sun-sky-dark)] transition hover:bg-[var(--sun-sky-soft)]">
                        Edit
                      </Link>
                      <form action={deleteProductAction.bind(null, product.id)}>
                        <button className="rounded-full px-3 py-2 font-black text-red-600 transition hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminHeader>
  );
}
