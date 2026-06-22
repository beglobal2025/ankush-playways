import Link from "next/link";
import type { Category } from "@/lib/catalogue";

const themes = [
  {
    frame: "border-[var(--sun-sky)] bg-[var(--sun-sky)]",
    image: "bg-[var(--sun-sky-soft)]",
    footer: "bg-[var(--sun-sky-dark)]",
    pill: "bg-white/95 text-[var(--sun-sky-dark)]",
  },
  {
    frame: "border-[var(--sun-mint-strong)] bg-[var(--sun-mint-strong)]",
    image: "bg-[var(--sun-mint-soft)]",
    footer: "bg-[var(--sun-mint-strong)]",
    pill: "bg-white/95 text-[#188b6e]",
  },
  {
    frame: "border-[var(--sun-yellow)] bg-[var(--sun-yellow)]",
    image: "bg-[var(--sun-yellow-pale)]",
    footer: "bg-[var(--sun-yellow)]",
    pill: "bg-white/95 text-[#9a6800]",
  },
  {
    frame: "border-[var(--sun-coral-strong)] bg-[var(--sun-coral-strong)]",
    image: "bg-[var(--sun-coral-soft)]",
    footer: "bg-[var(--sun-coral-strong)]",
    pill: "bg-white/95 text-[var(--sun-coral-strong)]",
  },
];

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const theme = themes[index % themes.length];

  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.name)}`}
      className={`group block h-full overflow-hidden rounded-[12px] border-[5px] ${theme.frame} shadow-xl shadow-[#7ecae1]/20 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7ecae1]/25 focus:outline-none focus:ring-4 focus:ring-[var(--sun-yellow-soft)]`}
    >
      <article className="flex h-full flex-col bg-white">
        <div className={`grid aspect-[4/3] place-items-center ${theme.image} p-4`}>
          <img
            src={category.image.src}
            alt={category.image.alt}
            className="h-full max-h-48 w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className={`flex flex-1 flex-col p-5 text-white ${theme.footer}`}>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-black leading-tight text-white">{category.name}</h3>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black shadow-sm ${theme.pill}`}>
              {category.productCount} items
            </span>
          </div>
          <p className="mt-3 min-h-14 text-sm font-semibold leading-6 text-white/90">{category.description}</p>
        </div>
      </article>
    </Link>
  );
}
