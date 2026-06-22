"use client";

import type { ChangeEvent } from "react";
import type { Category } from "@/lib/catalogue";

export type SortOption = "name" | "price-asc" | "price-desc";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  search: string;
  sort: SortOption;
  resultCount: number;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  search,
  sort,
  resultCount,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="rounded-[28px] border border-[var(--sun-line)] bg-white p-4 shadow-xl shadow-[#7ecae1]/20">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Search catalogue
          <input
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
            placeholder="Search by code or name"
            className="h-12 rounded-2xl border border-[var(--sun-line)] bg-[var(--sun-sky-soft)] px-4 text-sm font-semibold outline-none transition focus:border-[#7ecae1]/40 focus:bg-white"
          />
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Category
          <select
            value={selectedCategory}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onCategoryChange(event.target.value)}
            className="h-12 rounded-2xl border border-[var(--sun-line)] bg-[var(--sun-sky-soft)] px-4 text-sm font-semibold outline-none transition focus:border-[#7ecae1]/40 focus:bg-white"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Sort
          <select
            value={sort}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onSortChange(event.target.value as SortOption)}
            className="h-12 rounded-2xl border border-[var(--sun-line)] bg-[var(--sun-sky-soft)] px-4 text-sm font-semibold outline-none transition focus:border-[#7ecae1]/40 focus:bg-white"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500">{resultCount} products found</p>
    </div>
  );
}
