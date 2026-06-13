import Link from "next/link";
import type { Category } from "@/lib/catalogue";

const accents = ["bg-[#fff1a8]", "bg-[#c7f3ec]", "bg-[#ffd6e7]", "bg-[#dcebff]", "bg-[#eadbff]", "bg-[#ffe0bd]"];

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <article className="group h-full overflow-hidden rounded-[24px] border border-sky-100 bg-white p-4 shadow-xl shadow-sky-100/70 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-100">
      <div className={`grid aspect-[4/3] place-items-center rounded-[20px] ${accents[index % accents.length]} p-4`}>
        <img
          src={category.image.src}
          alt={category.image.alt}
          className="h-full max-h-52 w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-black leading-tight text-slate-900">{category.name}</h3>
          <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
            {category.productCount} items
          </span>
        </div>
        <p className="mt-3 min-h-14 text-sm font-medium leading-6 text-slate-600">{category.description}</p>
        <Link
          href={`/products?category=${encodeURIComponent(category.name)}`}
          className="mt-5 inline-flex rounded-full bg-teal-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-100 transition hover:bg-teal-600"
        >
          View Products
        </Link>
      </div>
    </article>
  );
}
