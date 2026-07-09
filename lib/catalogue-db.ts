import type { Prisma } from "@prisma/client";
import type { Category, Product, Specification } from "@/lib/catalogue";
import { prisma } from "@/lib/prisma";

const fallbackImage = "/assets/catalog/play-slide.jpg";

type DbProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
    colorOptions: true;
    images: true;
  };
}>;

type DbCategory = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        colorOptions: true;
        images: true;
      };
    };
  };
}>;

function productImageAlt(code: string, name: string) {
  return `${code} - ${name}`;
}

export function toCatalogueProduct(product: DbProduct): Product {
  return {
    id: product.code.toLowerCase(),
    code: product.code,
    slug: product.slug,
    name: product.name,
    colorOptions: product.colorOptions.map((option) => ({
      id: option.id,
      color: option.color,
      image: {
        src: option.imageSrc,
        alt: option.imageAlt || `${product.code} - ${product.name} - ${option.color}`,
      },
    })),
    category: product.category.name,
    price: product.price,
    specifications: product.specifications as Specification,
    images: (product.images.length ? product.images : [{ src: fallbackImage, alt: productImageAlt(product.code, product.name) }]).map((image) => ({
      src: image.src,
      alt: image.alt || productImageAlt(product.code, product.name),
    })),
  };
}

function toCatalogueCategory(category: DbCategory): Category {
  const products = category.products.map((product) => ({
    id: product.code.toLowerCase(),
    code: product.code,
    slug: product.slug,
    name: product.name,
    colorOptions: product.colorOptions.map((option) => ({
      id: option.id,
      color: option.color,
      image: {
        src: option.imageSrc,
        alt: option.imageAlt || `${product.code} - ${product.name} - ${option.color}`,
      },
    })),
    category: category.name,
    price: product.price,
    specifications: product.specifications as Specification,
    images: (product.images.length ? product.images : [{ src: fallbackImage, alt: productImageAlt(product.code, product.name) }]).map((image) => ({
      src: image.src,
      alt: image.alt || productImageAlt(product.code, product.name),
    })),
  }));
  const firstProductImage = products[0]?.images[0];
  const image = {
    src: category.imageSrc || firstProductImage?.src || fallbackImage,
    alt: category.imageAlt || firstProductImage?.alt || `${category.name} product category`,
  };

  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description || `Explore ${products.length} catalogue products from the ${category.name.toLowerCase()} range.`,
    productCount: products.length,
    image,
    products,
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: true,
      colorOptions: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return products.map(toCatalogueProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      colorOptions: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return products.map(toCatalogueProduct);
}

export async function getPublishedCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: {
          colorOptions: { orderBy: { sortOrder: "asc" } },
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map(toCatalogueCategory).sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));
}

export async function getPublishedProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      colorOptions: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return product ? toCatalogueProduct(product) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const relatedProducts = await prisma.product.findMany({
    where: {
      slug: { not: product.slug },
      status: "PUBLISHED",
      category: {
        name: product.category,
      },
    },
    include: {
      category: true,
      colorOptions: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: limit,
  });

  return relatedProducts.map(toCatalogueProduct);
}
