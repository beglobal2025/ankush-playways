import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { HOME_BANNER_CATEGORY_SETTING_KEYS, HOME_BANNER_LEGACY_KEY, HOME_BANNER_SETTING_KEYS } from "@/lib/banner-settings";
import { getFeaturedProducts, getPublishedCategories, getPublishedProducts } from "@/lib/catalogue-db";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Browse ANKUSH Playways products with real catalogue images, featured categories, popular products, and WhatsApp enquiries.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, featuredProducts, bannerSettings] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
    getFeaturedProducts(),
    prisma.siteSetting.findMany({
      where: { key: { in: [...HOME_BANNER_SETTING_KEYS, ...HOME_BANNER_CATEGORY_SETTING_KEYS, HOME_BANNER_LEGACY_KEY] } },
    }),
  ]);
  const bannerByKey = new Map(bannerSettings.map((setting) => [setting.key, setting.value]));
  const bannerImageSrcs = HOME_BANNER_SETTING_KEYS.map((key, index) => {
    return bannerByKey.get(key) ?? (index === 0 ? bannerByKey.get(HOME_BANNER_LEGACY_KEY) ?? "" : "");
  });
  const bannerCtaHrefs = HOME_BANNER_CATEGORY_SETTING_KEYS.map((key) => {
    const categoryName = bannerByKey.get(key);
    return categoryName ? `/products?category=${encodeURIComponent(categoryName)}#catalogue-list` : "/products";
  });

  return <LandingPage bannerCtaHrefs={bannerCtaHrefs} bannerImageSrcs={bannerImageSrcs} categories={categories} featuredProducts={featuredProducts} products={products} />;
}
