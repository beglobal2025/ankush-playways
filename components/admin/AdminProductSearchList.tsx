"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";

export interface AdminProductListItem {
  categoryName: string;
  code: string;
  colorOptions: string[];
  id: string;
  imageSrc: string;
  name: string;
  price: number | null;
  slug: string;
  status: string;
}

interface AdminProductSearchListProps {
  deleteAction: (productId: string) => void;
  products: AdminProductListItem[];
}

export default function AdminProductSearchList({ deleteAction, products }: AdminProductSearchListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      return `${product.name} ${product.code} ${product.categoryName} ${product.colorOptions.join(" ")}`.toLowerCase().includes(normalizedQuery);
    });
  }, [normalizedQuery, products]);

  return (
    <>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Search products
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
            placeholder="Type product name, code, or category..."
          />
        </label>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-black text-slate-950">Catalogue items</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {filteredProducts.length} {query ? "matching" : ""} products found
            </p>
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="align-middle transition hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-slate-100">
                        {product.imageSrc ? <img src={product.imageSrc} alt="" className="h-12 w-12 object-contain" /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900">{product.name}</p>
                        <p className="text-xs font-bold text-slate-500">
                          {product.code}
                          {product.colorOptions.length ? ` - ${product.colorOptions.join(", ")}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{product.categoryName}</td>
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
                      {product.status === "PUBLISHED" ? (
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full px-3 py-2 font-black text-[#16835f] transition hover:bg-[var(--sun-mint-soft)]"
                        >
                          View
                        </Link>
                      ) : (
                        <span
                          title="Publish this product before viewing it on the website"
                          className="cursor-not-allowed rounded-full px-3 py-2 font-black text-slate-300"
                        >
                          View
                        </span>
                      )}
                      <Link href={`/admin/products/${product.id}/edit`} className="rounded-full px-3 py-2 font-black text-[var(--sun-sky-dark)] transition hover:bg-[var(--sun-sky-soft)]">
                        Edit
                      </Link>
                      <form action={deleteAction.bind(null, product.id)}>
                        <AdminSubmitButton
                          idleText="Delete"
                          pendingText="Deleting..."
                          className="rounded-full px-3 py-2 font-black text-red-600 transition hover:bg-red-50"
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 ? (
            <div className="border-t border-slate-100 p-8 text-center text-sm font-bold text-slate-500">
              No products matched your search.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
