import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { getFeaturedProducts, getPublishedCategories, getPublishedProducts } from "@/lib/catalogue-db";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Browse ANKUSH Playways products with real catalogue images, featured categories, popular products, and WhatsApp enquiries.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, featuredProducts, banner] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
    getFeaturedProducts(),
    prisma.siteSetting.findUnique({
      where: { key: "home_banner_image" },
    }),
  ]);

  return <LandingPage bannerImageSrc={banner?.value ?? ""} categories={categories} featuredProducts={featuredProducts} products={products} />;
}
