"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/catalogue";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const safeImages = images.length ? images : [{ src: "/assets/catalog/play-slide.jpg", alt: title }];
  const [active, setActive] = useState(0);
  const current = safeImages[active] ?? safeImages[0];

  return (
    <div>
      <div className="grid aspect-square place-items-center rounded-[34px] border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-100">
        <img src={current.src} alt={current.alt} className="h-full w-full object-contain mix-blend-multiply" />
      </div>
      {safeImages.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {safeImages.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActive(index)}
              className={`grid aspect-square place-items-center rounded-2xl border bg-white p-2 transition ${
                active === index ? "border-sky-500 shadow-lg shadow-sky-100" : "border-sky-100"
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
