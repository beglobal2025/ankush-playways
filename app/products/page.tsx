import type { Metadata } from "next";
import ProductCatalogueClient from "@/components/ProductCatalogueClient";
import SectionHeading from "@/components/SectionHeading";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPublishedCategories, getPublishedProducts } from "@/lib/catalogue-db";

export const metadata: Metadata = {
  title: "Product Catalogue | ANKUSH Playways",
  description:
    "Browse ANKUSH Playways products by category, search product codes, compare MRP, and enquire directly on WhatsApp.",
};

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories, products] = await Promise.all([getPublishedCategories(), getPublishedProducts()]);
  const params = await searchParams;
  const requestedCategory = params?.category ? decodeURIComponent(params.category) : "all";
  const initialCategory = categories.some((category) => category.name === requestedCategory) ? requestedCategory : "all";

  return (
    <main className="bg-[var(--sun-yellow-pale)]">
      <SiteHeader />
      <section id="catalogue-list" className="scroll-mt-24 px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="left"
            eyebrow="All products"
            title={`${products.length} catalogue`}
            accent="Items"
            description="Use the filters to narrow the catalogue by category, price, or product code."
          />
          <ProductCatalogueClient products={products} categories={categories} initialCategory={initialCategory} />
        </div>
      </section>
      <SiteFooter />
      <WhatsAppButton floating />
    </main>
  );
}
