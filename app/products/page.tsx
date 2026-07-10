import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";
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
  const showCategoryAccess = initialCategory === "all";
  const selectedCategory = categories.find((c) => c.name === initialCategory) ?? null;
  const heroImageSrc = selectedCategory?.image?.src ?? categories[0]?.image.src ?? "/assets/catalog/play-slide.jpg";
  const heroImageAlt = selectedCategory?.image?.alt ?? categories[0]?.image?.alt ?? "ANKUSH Playways catalogue product";
  const heroTitle = selectedCategory ? `Browse ${selectedCategory.name} products with real catalogue images` : "Browse every product with real catalogue images";
  const heroDescription = selectedCategory ? selectedCategory.description : `Filter by category, search by product code or name, compare MRP, and enquire instantly for your school, play zone, or retail requirement.`;

  return (
    <main className="bg-[var(--sun-yellow-pale)]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-[var(--sun-sky-soft)] px-5 pb-16 pt-32 sm:px-8">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,0.85)_0_3px,transparent_4px)] [background-size:82px_82px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <h1 className="text-4xl font-black leading-tight text-[var(--sun-sky-dark)] sm:text-6xl">{heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-700">{heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogue-list" className="rounded-full bg-[var(--sun-mint-strong)] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#a6e5cd]/40 transition hover:bg-[var(--sun-sky-dark)]">
                View Products
              </a>
              <WhatsAppButton>Ask for Catalogue Help</WhatsAppButton>
            </div>
          </div>
          <div className="grid aspect-square place-items-center rounded-[34px] bg-white/80 p-8 shadow-2xl shadow-[#7ecae1]/20">
            <img src={heroImageSrc} alt={heroImageAlt} className="h-full w-full object-contain mix-blend-multiply" />
          </div>
        </div>
      </section>

      {showCategoryAccess ? (
        <section className="px-5 py-20 sm:px-8">
          <SectionHeading
            eyebrow="Quick category access"
            title="Shop by"
            accent="Category"
            description="Start with a product family, or use the filters below for exact product-code searches."
          />
          <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="catalogue-list" className={`px-5 pb-24 sm:px-8 ${showCategoryAccess ? "" : "pt-16"}`}>
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
