import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import SectionHeading from "@/components/SectionHeading";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/catalogue";
import { getPublishedProductBySlug, getRelatedProducts } from "@/lib/catalogue-db";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    color?: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Ankush Playways",
    };
  }

  return {
    title: `${product.code} - ${product.name} | Ankush Playways`,
    description: `View ${product.code} ${product.name} from the Ankush Playways ${product.category} catalogue. MRP: ${formatPrice(product.price)}.`,
    openGraph: {
      title: `${product.code} - ${product.name}`,
      description: `Ankush Playways ${product.category} product details and enquiry.`,
      images: product.images.map((image) => image.src),
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const selectedColor = (await searchParams)?.color ?? "";
  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 4);
  const details = product.specifications.details ?? [];
  const extraSpecs = Object.entries(product.specifications).filter(([key]) => key !== "details");

  return (
    <main className="bg-[var(--sun-yellow-pale)]">
      <SiteHeader />
      <section className="px-5 pb-16 pt-32 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/products" className="text-sm font-black text-[var(--sun-ink)] transition hover:text-[var(--sun-coral-strong)]">
            Back to catalogue
          </Link>
          <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <ProductGallery colorOptions={product.colorOptions} images={product.images} initialColor={selectedColor} title={product.name} />

            <div className="rounded-[34px] bg-white p-7 shadow-2xl shadow-[#7ecae1]/20 sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--sun-coral-soft)] px-4 py-2 text-sm font-black text-[var(--sun-coral-strong)]">{product.code}</span>
                <span className="rounded-full bg-[var(--sun-sky-soft)] px-4 py-2 text-sm font-black text-[var(--sun-ink)]">{product.category}</span>
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">{product.name}</h1>
              <p className="mt-5 text-3xl font-black text-[var(--sun-ink)]">{formatPrice(product.price)}</p>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600">
                Real catalogue product from Ankush Playways. Enquire for availability, finish options, dispatch, and
                institutional supply details.
              </p>
              {product.colorOptions.length ? (
                <div className="mt-6 rounded-2xl bg-[var(--sun-yellow-soft)] p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--sun-yellow)]">Available colors</p>
                  <p className="mt-1 font-bold text-slate-700">{product.colorOptions.map((option) => option.color).join(", ")}</p>
                </div>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppButton product={product}>Enquire on WhatsApp</WhatsAppButton>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--sun-sky)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#7ecae1]/20 transition hover:bg-[var(--sun-sky-dark)]"
                >
                  View Similar
                </Link>
              </div>

              <div className="mt-10 grid gap-4">
                <h2 className="text-2xl font-black text-[var(--sun-ink)]">Specifications</h2>
                {extraSpecs.length || details.length ? (
                  <div className="grid gap-3">
                    {extraSpecs.map(([key, value]) => (
                      <div key={key} className="rounded-2xl bg-[var(--sun-sky-soft)] p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-[var(--sun-sky-dark)]">{key}</p>
                        <p className="mt-1 font-bold text-slate-700">{Array.isArray(value) ? value.join(", ") : value}</p>
                      </div>
                    ))}
                    {details.length ? (
                      <div className="rounded-2xl bg-[var(--sun-yellow-soft)] p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-[var(--sun-yellow)]">Dimensions, materials & features</p>
                        <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-slate-700">
                          {details.map((detail, index) => (
                            <li key={`${detail}-${index}`}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-[var(--sun-sky-soft)] p-4 font-semibold text-slate-600">
                    Detailed specifications are available on request.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="px-5 py-20 sm:px-8">
          <SectionHeading eyebrow="Same range" title="Related" accent="Products" />
          <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <SiteFooter />
      <WhatsAppButton floating />
    </main>
  );
}
