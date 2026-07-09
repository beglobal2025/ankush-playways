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
  const defaultColorOption = product.colorOptions[0];
  const productHref = defaultColorOption
    ? `/products/${product.slug}?color=${encodeURIComponent(defaultColorOption.color)}`
    : `/products/${product.slug}`;
  const productImage = defaultColorOption?.image ?? product.images[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--sun-line)] bg-white p-4 shadow-lg shadow-[#7ecae1]/20 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7ecae1]/20">
      <Link href={productHref} className="grid aspect-[4/3] place-items-center rounded-[18px] bg-[var(--sun-yellow-pale)] p-5">
        <img
          src={productImage?.src}
          alt={productImage?.alt ?? product.name}
          className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-h-[9rem] flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--sun-coral-soft)] px-3 py-1 text-xs font-black text-[var(--sun-coral-strong)]">{product.code}</span>
          <span className="line-clamp-2 min-h-8 text-right text-xs font-bold leading-4 text-slate-500">{product.category}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-black leading-6 text-slate-900">{product.name}</h3>
        {product.colorOptions.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colorOptions.map((option) => (
              <Link
                key={option.id}
                href={`/products/${product.slug}?color=${encodeURIComponent(option.color)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sun-line)] bg-white px-2.5 py-1.5 text-xs font-black text-[var(--sun-coral-strong)] transition hover:border-[var(--sun-coral-strong)] hover:bg-[var(--sun-coral-soft)]"
              >
                <img src={option.image.src} alt="" className="size-6 rounded-full object-contain mix-blend-multiply" />
                {option.color}
              </Link>
            ))}
          </div>
        ) : null}
        {showPrice ? <p className="mt-3 text-lg font-black text-[var(--sun-ink)]">{formatPrice(product.price)}</p> : null}
        {showActions ? (
          <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
            <Link
              href={productHref}
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
