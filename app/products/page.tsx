import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";
import ProductCatalogueClient from "@/components/ProductCatalogueClient";
import SectionHeading from "@/components/SectionHeading";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { categories, products } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Product Catalogue | ANKUSH Playways",
  description:
    "Browse ANKUSH Playways products by category, search product codes, compare MRP, and enquire directly on WhatsApp.",
};

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const requestedCategory = params?.category ? decodeURIComponent(params.category) : "all";
  const initialCategory = categories.some((category) => category.name === requestedCategory) ? requestedCategory : "all";

  return (
    <main className="bg-[#f8fcff]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-[#dff7ff] px-5 pb-16 pt-32 sm:px-8">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,0.85)_0_3px,transparent_4px)] [background-size:82px_82px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <h1 className="text-4xl font-black leading-tight text-sky-900 sm:text-6xl">
              Browse every product with real catalogue images
            </h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-700">
              Filter by category, search by product code or name, compare MRP, and enquire instantly for your school,
              play zone, or retail requirement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalogue-list" className="rounded-full bg-teal-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-teal-100 transition hover:bg-teal-600">
                View Products
              </a>
              <WhatsAppButton>Ask for Catalogue Help</WhatsAppButton>
            </div>
          </div>
          <div className="grid aspect-square place-items-center rounded-[34px] bg-white/80 p-8 shadow-2xl shadow-sky-100">
            <img
              src={categories[0]?.image.src ?? "/assets/catalog/play-slide.jpg"}
              alt="ANKUSH Playways catalogue product"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Quick category access"
          title="Shop by"
          accent="Category"
          description="Start with a product family, or use the filters below for exact product-code searches."
        />
        <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      <section id="catalogue-list" className="px-5 pb-24 sm:px-8">
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
