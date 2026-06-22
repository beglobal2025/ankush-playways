"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/catalogue";
import ProductCard from "@/components/ProductCard";
import ProductFilters, { type SortOption } from "@/components/ProductFilters";

interface ProductCatalogueClientProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ProductCatalogueClient({
  products,
  categories,
  initialCategory = "all",
}: ProductCatalogueClientProps) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products
      .filter((product) => category === "all" || product.category === category)
      .filter((product) => {
        if (!query) {
          return true;
        }
        return `${product.code} ${product.name}`.toLowerCase().includes(query);
      });

    return result.sort((a, b) => {
      if (sort === "price-asc") {
        return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      }
      if (sort === "price-desc") {
        return (b.price ?? -1) - (a.price ?? -1);
      }
      return a.name.localeCompare(b.name);
    });
  }, [category, products, search, sort]);

  return (
    <div>
      <ProductFilters
        categories={categories}
        selectedCategory={category}
        search={search}
        sort={sort}
        resultCount={filteredProducts.length}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      {filteredProducts.length ? (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[28px] border border-dashed border-[var(--sun-line)] bg-white p-10 text-center shadow-xl shadow-[#7ecae1]/20">
          <h2 className="text-2xl font-black text-[var(--sun-ink)]">No products found</h2>
          <p className="mt-3 font-medium text-slate-600">Try another category or search term.</p>
        </div>
      )}
    </div>
  );
}
