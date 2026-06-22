import Link from "next/link";
import type { Product } from "@/lib/catalogue";
import { formatPrice } from "@/lib/catalogue";
import WhatsAppButton from "@/components/WhatsAppButton";

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  showActions?: boolean;
}

export default function ProductCard({ product, showPrice = true, showActions = true }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--sun-line)] bg-white p-4 shadow-lg shadow-[#7ecae1]/20 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7ecae1]/20">
      <Link href={`/products/${product.slug}`} className="grid aspect-[4/3] place-items-center rounded-[18px] bg-[var(--sun-yellow-pale)] p-5">
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt ?? product.name}
          className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-h-[9rem] flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--sun-coral-soft)] px-3 py-1 text-xs font-black text-[var(--sun-coral-strong)]">{product.code}</span>
          <span className="line-clamp-2 min-h-8 text-right text-xs font-bold leading-4 text-slate-500">{product.category}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-black leading-6 text-slate-900">{product.name}</h3>
        {showPrice ? <p className="mt-3 text-lg font-black text-[var(--sun-ink)]">{formatPrice(product.price)}</p> : null}
        {showActions ? (
          <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-[var(--sun-sky)] px-4 py-3 text-sm font-black text-white transition hover:bg-[var(--sun-sky-dark)]"
            >
              View Details
            </Link>
            <WhatsAppButton product={product} className="px-4" />
          </div>
        ) : null}
      </div>
    </article>
  );
}
