"use client";

import { useState } from "react";

interface ColorOptionRow {
  id: string;
  color: string;
  imageAlt: string;
  imageSrc: string;
}

interface ProductColorOptionsFieldProps {
  options: ColorOptionRow[];
}

function blankRow(index: number): ColorOptionRow {
  return {
    id: `new-${Date.now()}-${index}`,
    color: "",
    imageAlt: "",
    imageSrc: "",
  };
}

export default function ProductColorOptionsField({ options }: ProductColorOptionsFieldProps) {
  const [rows, setRows] = useState<ColorOptionRow[]>(options.length ? options : [blankRow(0)]);

  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-700 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950">Color options</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Add one row per colour and upload the matching product image.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRows((currentRows) => [...currentRows, blankRow(currentRows.length)])}
          className="rounded-lg bg-[var(--sun-sky-soft)] px-4 py-2 text-sm font-black text-[var(--sun-sky-dark)] transition hover:bg-[var(--sun-sky)] hover:text-white"
        >
          Add color
        </button>
      </div>

      <div className="grid gap-4">
        {rows.map((option, index) => (
          <div key={option.id} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1.4fr_auto_auto] sm:items-end">
            <input type="hidden" name="colorOptionExistingImages" value={option.imageSrc} />
            <label className="grid gap-2">
              Color name
              <input
                name="colorOptionColors"
                defaultValue={option.color}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
                placeholder={index === 0 ? "Red" : "Blue"}
              />
            </label>
            <label className="grid gap-2">
              Color image
              <input
                name="colorOptionImages"
                type="file"
                accept="image/*"
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[var(--sun-sky-soft)] file:px-4 file:py-2 file:text-sm file:font-black file:text-[var(--sun-sky-dark)] focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              />
            </label>
            <div className="grid h-20 w-20 place-items-center rounded-lg border border-slate-200 bg-white p-2">
              {option.imageSrc ? <img src={option.imageSrc} alt={option.imageAlt} className="h-full w-full object-contain" /> : null}
            </div>
            <button
              type="button"
              onClick={() => setRows((currentRows) => (currentRows.length === 1 ? [blankRow(0)] : currentRows.filter((row) => row.id !== option.id)))}
              className="rounded-lg bg-white px-4 py-3 text-sm font-black text-red-600 ring-1 ring-slate-200 transition hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
