"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Category } from "@/lib/catalogue";

interface BannerSlot {
  category: string;
  defaultImageSrc: string;
  description: string;
  imageSrc: string;
  key: string;
  label: string;
}

interface BannerImageFormProps {
  action: (formData: FormData) => void;
  banners: BannerSlot[];
  categories: Category[];
}

export default function BannerImageForm({ action, banners, categories }: BannerImageFormProps) {
  const [previews, setPreviews] = useState<Record<number, string>>({});

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const updatePreview = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setPreviews((current) => {
      if (current[index]) {
        URL.revokeObjectURL(current[index]);
      }

      if (!file) {
        const next = { ...current };
        delete next[index];
        return next;
      }

      return {
        ...current,
        [index]: URL.createObjectURL(file),
      };
    });
  };

  return (
    <form action={action} className="mt-8 grid gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {banners.map((banner, index) => {
          const previewSrc = previews[index];
          const imageSrc = previewSrc || banner.imageSrc || banner.defaultImageSrc;
          const status = previewSrc ? "Preview" : banner.imageSrc ? "Custom image" : "Default image";

          return (
            <section key={banner.key} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--sun-coral-strong)]">
                    Homepage slide {index + 1}
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">{banner.label}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{banner.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--sun-mint-soft)] px-3 py-1 text-xs font-black text-[#16835f]">
                  {status}
                </span>
              </div>

              <div className="grid gap-5 p-5">
                <div className="overflow-hidden rounded-lg bg-slate-100">
                  <img src={imageSrc} alt={`${banner.label} preview`} className="h-64 w-full object-cover" />
                </div>

                <label className="grid cursor-pointer gap-2 text-sm font-bold text-slate-700">
                  Change image for {banner.label}
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-[var(--sun-sky-dark)] transition hover:border-[var(--sun-sky-dark)] hover:bg-[var(--sun-sky-soft)]">
                    Choose image
                  </span>
                  <input
                    name={`bannerImage_${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(event) => updatePreview(index, event)}
                    className="sr-only"
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Button opens category
                  <select
                    name={`bannerCategory_${index}`}
                    defaultValue={banner.category}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
                  >
                    <option value="">All products</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-[var(--sun-mint-strong)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
          Save Banners
        </button>
        <a href="/" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
          View Site
        </a>
      </div>
    </form>
  );
}
