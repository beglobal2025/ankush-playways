"use client";

import { useState } from "react";
import type { ProductColorOption, ProductImage } from "@/lib/catalogue";

interface ProductGalleryProps {
  colorOptions?: ProductColorOption[];
  images: ProductImage[];
  initialColor?: string;
  title: string;
}

export default function ProductGallery({ colorOptions = [], images, initialColor = "", title }: ProductGalleryProps) {
  const safeImages = images.length ? images : [{ src: "/assets/catalog/play-slide.jpg", alt: title }];
  const initialColorOption = initialColor
    ? colorOptions.find((option) => option.color.toLowerCase() === initialColor.toLowerCase()) ?? null
    : null;
  const [active, setActive] = useState(0);
  const [activeColorId, setActiveColorId] = useState<string | null>(initialColorOption?.id ?? null);
  const activeColor = colorOptions.find((option) => option.id === activeColorId) ?? null;
  const current = activeColor?.image ?? safeImages[active] ?? safeImages[0];

  return (
    <div>
      <div className="grid aspect-square place-items-center rounded-[34px] border border-[var(--sun-line)] bg-white p-6 shadow-2xl shadow-[#7ecae1]/20">
        <img src={current.src} alt={current.alt} className="h-full w-full object-contain mix-blend-multiply" />
      </div>
      {colorOptions.length ? (
        <div className="mt-4 rounded-[24px] border border-[var(--sun-line)] bg-white p-4 shadow-xl shadow-[#7ecae1]/10">
          <p className="text-sm font-black text-[var(--sun-ink)]">Available colors</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              aria-pressed={!activeColorId}
              onClick={() => setActiveColorId(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-black transition ${
                !activeColorId
                  ? "border-[var(--sun-sky-dark)] bg-[var(--sun-sky-soft)] text-[var(--sun-sky-dark)]"
                  : "border-[var(--sun-line)] bg-white text-slate-600 hover:border-[var(--sun-sky-dark)]"
              }`}
            >
              <span className="grid size-9 place-items-center rounded-full bg-white">
                <img src={safeImages[0].src} alt="" className="h-8 w-8 rounded-full object-contain mix-blend-multiply" />
              </span>
              Main image
            </button>
            {colorOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={activeColorId === option.id}
                onClick={() => setActiveColorId(option.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-black transition ${
                  activeColorId === option.id
                    ? "border-[var(--sun-coral-strong)] bg-[var(--sun-coral-soft)] text-[var(--sun-coral-strong)]"
                    : "border-[var(--sun-line)] bg-white text-slate-600 hover:border-[var(--sun-sky-dark)]"
                }`}
              >
                <span className="grid size-9 place-items-center rounded-full bg-white">
                  <img src={option.image.src} alt="" className="h-8 w-8 rounded-full object-contain mix-blend-multiply" />
                </span>
                {option.color}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {safeImages.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {safeImages.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => {
                setActive(index);
                setActiveColorId(null);
              }}
              className={`grid aspect-square place-items-center rounded-2xl border bg-white p-2 transition ${
                !activeColorId && active === index
                  ? "border-[var(--sun-sky-dark)] shadow-lg shadow-[#7ecae1]/20"
                  : "border-[var(--sun-line)]"
              }`}
            >
              <img src={image.src} alt="" className="h-full w-full object-contain mix-blend-multiply" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
