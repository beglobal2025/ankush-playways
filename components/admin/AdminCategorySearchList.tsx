"use client";

import { useMemo, useState } from "react";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";

export interface AdminCategoryListItem {
  description: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  name: string;
  productCount: number;
  slug: string;
}

interface AdminCategorySearchListProps {
  categories: AdminCategoryListItem[];
  deleteAction: (formData: FormData) => void;
}

export default function AdminCategorySearchList({ categories, deleteAction }: AdminCategorySearchListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) => {
      return `${category.name} ${category.slug} ${category.description}`.toLowerCase().includes(normalizedQuery);
    });
  }, [categories, normalizedQuery]);

  return (
    <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-black text-slate-950">Added categories</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {filteredCategories.length} {query ? "matching" : ""} categories available
          </p>
        </div>
        <a href="/admin/products/new" className="rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
          Add Product
        </a>
      </div>

      <div className="border-b border-slate-100 p-5">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Search categories
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
            placeholder="Type category name, slug, or description..."
          />
        </label>
      </div>

      <div className="grid gap-3 p-5">
        {filteredCategories.map((category) => (
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
                {category.productCount} products
              </span>

              <form action={deleteAction}>
                <input type="hidden" name="categoryId" value={category.id} />
                <AdminSubmitButton
                  idleText="Delete"
                  pendingText="Deleting..."
                  className="rounded-lg bg-white px-3 py-1 text-xs font-black text-red-600 ring-1 ring-red-100 transition hover:bg-red-50"
                />
              </form>
            </div>
          </article>
        ))}

        {filteredCategories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-bold text-slate-500">
            {query ? "No categories matched your search." : "No categories added yet."}
          </div>
        ) : null}
      </div>
    </section>
  );
}
