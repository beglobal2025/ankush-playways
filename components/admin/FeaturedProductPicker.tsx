"use client";

import { useMemo, useState } from "react";

type FeaturedPickerProduct = {
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

type FeaturedPickerCategory = {
  id: string;
  name: string;
  products: FeaturedPickerProduct[];
};

interface FeaturedProductPickerProps {
  categories: FeaturedPickerCategory[];
  featureAction: (productId: string) => Promise<void>;
}

function ProductThumb({ product }: { product: FeaturedPickerProduct }) {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-100">
      {product.images[0]?.src ? <img src={product.images[0].src} alt="" className="h-10 w-10 object-contain" /> : null}
    </div>
  );
}

function StatusText({ status }: { status: FeaturedPickerProduct["status"] }) {
  return <span className={status === "PUBLISHED" ? "text-[#16835f]" : "text-[#9b6500]"}>{status === "PUBLISHED" ? "Published" : "Draft"}</span>;
}

export default function FeaturedProductPicker({ categories, featureAction }: FeaturedProductPickerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [query, setQuery] = useState("");

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId) ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const matchingProducts = useMemo(() => {
    if (!selectedCategory || !normalizedQuery) {
      return [];
    }

    return selectedCategory.products.filter((product) => {
      const haystack = `${product.name} ${product.code}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, selectedCategory]);

  const hasCategory = Boolean(selectedCategory);
  const hasQuery = Boolean(normalizedQuery);

  return (
    <section className="mt-8 overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-black text-slate-950">Add featured product</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Select a category first, then type to find matching products.</p>
        </div>
        {hasCategory || query ? (
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId("");
              setQuery("");
            }}
            className="text-sm font-black text-slate-400 transition hover:text-[var(--sun-sky-dark)]"
          >
            Reset
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <span className={["rounded-full px-3 py-1", hasCategory ? "bg-[var(--sun-mint-soft)] text-[#16835f]" : "bg-[var(--sun-coral-soft)] text-[var(--sun-coral-strong)]"].join(" ")}>
            1. Select Category
          </span>
          <span className="text-slate-300">›</span>
          <span className={["rounded-full px-3 py-1", hasCategory ? "bg-[var(--sun-coral-soft)] text-[var(--sun-coral-strong)]" : "bg-slate-100 text-slate-400"].join(" ")}>
            2. Search Product
          </span>
          <span className="text-slate-300">›</span>
          <span className={["rounded-full px-3 py-1", hasCategory && hasQuery ? "bg-[var(--sun-mint-soft)] text-[#16835f]" : "bg-slate-100 text-slate-400"].join(" ")}>
            3. Add to Featured
          </span>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Category
          <select
            value={selectedCategoryId}
            onChange={(event) => {
              setSelectedCategoryId(event.target.value);
              setQuery("");
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
          >
            <option value="">Select a category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="relative">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Search product{selectedCategory ? ` in "${selectedCategory.name}"` : ""}
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={!hasCategory}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-coral-strong)] focus:ring-4 focus:ring-[var(--sun-coral-soft)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              placeholder={hasCategory ? "Type product name or code..." : "Select a category first..."}
            />
          </label>

          {hasCategory && hasQuery ? (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
              {matchingProducts.map((product) => (
                <div key={product.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <ProductThumb product={product} />
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{product.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {product.code} / <StatusText status={product.status} />
                    </p>
                  </div>
                  <form action={featureAction.bind(null, product.id)}>
                    <button className="w-full rounded-lg bg-[var(--sun-mint-strong)] px-4 py-3 text-sm font-black text-white transition hover:bg-[var(--sun-sky-dark)] sm:w-auto">
                      Add Featured
                    </button>
                  </form>
                </div>
              ))}

              {matchingProducts.length === 0 ? (
                <div className="p-5 text-sm font-bold text-slate-500">No matching unfeatured products found in this category.</div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
