"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HOME_BANNER_CATEGORY_SETTING_KEYS, HOME_BANNER_LEGACY_KEY, HOME_BANNER_SETTING_KEYS } from "@/lib/banner-settings";
import { prisma } from "@/lib/prisma";
import { signInAdmin, signOutAdmin, requireAdmin } from "./auth";
import { slugify } from "./slug";
import { saveUploadedImage } from "./storage";

function requiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function optionalString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parsePrice(value: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function parseSpecifications(value: string) {
  if (!value) return {};

  const trimmed = value.trim();

  // Try JSON first
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      // fall through to line parser
    }
  }

  const obj: Record<string, any> = {};

  for (const rawLine of trimmed.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const idx = line.indexOf(":");
    if (idx === -1) {
      // single token — store as boolean true
      obj[line] = true;
      continue;
    }

    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();

    if (val === "") {
      obj[key] = "";
      continue;
    }

    // parse numbers
    if (/^-?\d+(?:\.\d+)?$/.test(val)) {
      obj[key] = Number(val);
      continue;
    }

    // parse booleans
    const lower = val.toLowerCase();
    if (lower === "true" || lower === "false") {
      obj[key] = lower === "true";
      continue;
    }

    obj[key] = val;
  }

  return obj;
}

function uploadedFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function uploadedFileAt(formData: FormData, key: string, index: number): File | null {
  const value = formData.getAll(key)[index];
  return value instanceof File && value.size > 0 ? value : null;
}

async function saveOptionalImage(formData: FormData, key: string, folder: string, baseName: string): Promise<string | null> {
  const [file] = uploadedFiles(formData, key);
  return file ? saveUploadedImage(file, folder, baseName) : null;
}

async function parseProductImages(formData: FormData, code: string, name: string, fallbackToDefault: boolean) {
  const files = uploadedFiles(formData, "imageFiles");
  const sources = await Promise.all(files.map((file, index) => saveUploadedImage(file, "products", `${code}-${name}`, index)));
  const imageSources = sources.length || fallbackToDefault ? (sources.length ? sources : ["/assets/catalog/play-slide.jpg"]) : [];

  return imageSources.map((src, index) => ({
    src,
    alt: `${code} - ${name}`,
    sortOrder: index,
  }));
}

async function parseProductColorOptions(formData: FormData, code: string, name: string) {
  const colors = formData.getAll("colorOptionColors");
  const existingImages = formData.getAll("colorOptionExistingImages");
  const options = [];

  for (let index = 0; index < colors.length; index += 1) {
    const colorValue = colors[index];
    const existingImageValue = existingImages[index];
    const color = typeof colorValue === "string" ? colorValue.trim() : "";

    if (!color) {
      continue;
    }

    const existingImage = typeof existingImageValue === "string" ? existingImageValue.trim() : "";
    const uploadedImage = uploadedFileAt(formData, "colorOptionImages", index);
    const imageSrc = uploadedImage
      ? await saveUploadedImage(uploadedImage, "products", `${code}-${name}-${color}`, index)
      : existingImage;

    if (!imageSrc) {
      continue;
    }

    options.push({
      color,
      imageSrc,
      imageAlt: `${code} - ${name} - ${color}`,
      sortOrder: options.length,
    });
  }

  return options;
}

async function getOrCreateCategory(name: string) {
  const categorySlug = slugify(name);

  return prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name },
    create: {
      name,
      slug: categorySlug,
      imageAlt: `${name} product category`,
    },
  });
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const name = requiredString(formData, "name");
  const categorySlug = slugify(name);

  if (!categorySlug) {
    throw new Error("Category name must include letters or numbers");
  }

  const uploadedImageSrc = await saveOptionalImage(formData, "imageFile", "categories", categorySlug);
  const imageAlt = optionalString(formData, "imageAlt") || `${name} product category`;

  await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {
      description: optionalString(formData, "description"),
      ...(uploadedImageSrc ? { imageSrc: uploadedImageSrc } : {}),
      imageAlt,
      name,
    },
    create: {
      name,
      slug: categorySlug,
      description: optionalString(formData, "description"),
      imageSrc: uploadedImageSrc ?? "",
      imageAlt,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products/new");
}

export async function featureProductAction(productId: string) {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { isFeatured: true },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  revalidatePath("/admin/featured");
  revalidatePath("/admin/products");
}

export async function unfeatureProductAction(productId: string) {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { isFeatured: false },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  revalidatePath("/admin/featured");
  revalidatePath("/admin/products");
}

export async function loginAction(formData: FormData) {
  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");
  const didLogin = await signInAdmin(email, password);

  if (!didLogin) {
    redirect("/admin/login?error=invalid");
  }

  redirect("/admin");
}

export async function logoutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function updateBannerImageAction(formData: FormData) {
  await requireAdmin();

  const updates = await Promise.all(
    HOME_BANNER_SETTING_KEYS.map(async (key, index) => {
      const uploadedImageSrc = await saveOptionalImage(formData, `bannerImage_${index}`, "banners", `home-banner-${index + 1}`);
      return uploadedImageSrc ? { key, value: uploadedImageSrc, index } : null;
    }),
  );
  const uploadedBannerUpdates = updates.filter((update): update is NonNullable<(typeof updates)[number]> => update !== null);
  const categoryUpdates = HOME_BANNER_CATEGORY_SETTING_KEYS.map((key, index) => ({
    key,
    value: optionalString(formData, `bannerCategory_${index}`),
  }));

  await Promise.all(
    [...uploadedBannerUpdates, ...categoryUpdates].map((update) =>
      prisma.siteSetting.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: {
          key: update.key,
          value: update.value,
        },
      }),
    ),
  );

  const firstBannerUpdate = uploadedBannerUpdates.find((update) => update.index === 0);

  if (firstBannerUpdate) {
    await prisma.siteSetting.upsert({
      where: { key: HOME_BANNER_LEGACY_KEY },
      update: { value: firstBannerUpdate.value },
      create: {
        key: HOME_BANNER_LEGACY_KEY,
        value: firstBannerUpdate.value,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/banner");
  redirect("/admin/banner");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const code = requiredString(formData, "code").toUpperCase().replace(/\s+/g, "");
  const name = requiredString(formData, "name");
  const categoryName = requiredString(formData, "category");
  const category = await getOrCreateCategory(categoryName);
  const slug = `${slugify(code)}-${slugify(name)}`;
  const images = await parseProductImages(formData, code, name, true);
  const colorOptions = await parseProductColorOptions(formData, code, name);

  await prisma.product.create({
    data: {
      code,
      name,
      slug,
      price: parsePrice(optionalString(formData, "price")),
      specifications: parseSpecifications(optionalString(formData, "specifications")),
      isFeatured: optionalString(formData, "isFeatured") === "on",
      status: optionalString(formData, "status") === "DRAFT" ? "DRAFT" : "PUBLISHED",
      categoryId: category.id,
      colorOptions: {
        create: colorOptions,
      },
      images: {
        create: images,
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();

  const code = requiredString(formData, "code").toUpperCase().replace(/\s+/g, "");
  const name = requiredString(formData, "name");
  const categoryName = requiredString(formData, "category");
  const category = await getOrCreateCategory(categoryName);
  const slug = `${slugify(code)}-${slugify(name)}`;
  const uploadedImages = await parseProductImages(formData, code, name, false);
  const colorOptions = await parseProductColorOptions(formData, code, name);

  await prisma.product.update({
    where: { id: productId },
    data: {
      code,
      name,
      slug,
      price: parsePrice(optionalString(formData, "price")),
      specifications: parseSpecifications(optionalString(formData, "specifications")),
      isFeatured: optionalString(formData, "isFeatured") === "on",
      status: optionalString(formData, "status") === "DRAFT" ? "DRAFT" : "PUBLISHED",
      categoryId: category.id,
      colorOptions: {
        deleteMany: {},
        create: colorOptions,
      },
      ...(uploadedImages.length
        ? {
            images: {
              deleteMany: {},
              create: uploadedImages,
            },
          }
        : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  if (product) {
    revalidatePath(`/products/${product.slug}`);
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();

  const value = formData.get("categoryId");
  if (typeof value !== "string" || !value) {
    throw new Error("categoryId is required");
  }

  const category = await prisma.category.findUnique({
    where: { id: value },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category._count.products > 0) {
    throw new Error("Cannot delete category with products. Remove products first.");
  }

  await prisma.category.delete({
    where: { id: value },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories/new");
  redirect("/admin/categories/new");
}
