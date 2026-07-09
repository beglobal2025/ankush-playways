import AdminHeader from "@/components/admin/AdminHeader";
import BannerImageForm from "@/components/admin/BannerImageForm";
import { updateBannerImageAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { HOME_BANNER_CATEGORY_SETTING_KEYS, HOME_BANNER_LEGACY_KEY, HOME_BANNER_SETTING_KEYS, HOME_BANNER_SLOTS } from "@/lib/banner-settings";
import { getPublishedCategories } from "@/lib/catalogue-db";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const [admin, bannerSettings, categories] = await Promise.all([
    requireAdmin(),
    prisma.siteSetting.findMany({
      where: { key: { in: [...HOME_BANNER_SETTING_KEYS, ...HOME_BANNER_CATEGORY_SETTING_KEYS, HOME_BANNER_LEGACY_KEY] } },
    }),
    getPublishedCategories(),
  ]);
  const bannerByKey = new Map(bannerSettings.map((setting) => [setting.key, setting.value]));
  const banners = HOME_BANNER_SLOTS.map((slot, index) => ({
    category: bannerByKey.get(HOME_BANNER_CATEGORY_SETTING_KEYS[index]) ?? "",
    defaultImageSrc: slot.defaultImageSrc,
    description: slot.description,
    imageSrc: bannerByKey.get(slot.key) ?? (index === 0 ? bannerByKey.get(HOME_BANNER_LEGACY_KEY) ?? "" : ""),
    key: slot.key,
    label: slot.label,
  }));

  return (
    <AdminHeader
      active="banner"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Upload the images shown in the homepage banner carousel."
      eyebrow="Homepage"
      maxWidth="wide"
      title="Banner images"
    >
      <BannerImageForm action={updateBannerImageAction} banners={banners} categories={categories} />
    </AdminHeader>
  );
}
