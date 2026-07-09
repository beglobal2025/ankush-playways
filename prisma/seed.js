const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");
const products = require("../products.json");

const prisma = new PrismaClient();

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatProductCode(id) {
  const upper = String(id).toUpperCase();
  if (/^(LF|LFT|LFP|LFO)-/.test(upper)) {
    return upper.replace("-", "");
  }
  return upper;
}

function productSlug(product) {
  return `${product.id}-${slugify(product.name)}`;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const categoryCovers = new Map();

  if (adminEmail && adminPassword) {
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "Admin",
        passwordHash: hashPassword(adminPassword),
      },
    });
  }

  for (const item of products) {
    const id = slugify(item.id || item.name || "product");
    const name = item.name?.trim() || formatProductCode(id);
    const categoryName = item.category?.trim() || "Catalogue";
    const categorySlug = slugify(categoryName);
    const code = formatProductCode(id);
    const slug = productSlug({ id, name });
    const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
    if (images[0] && !categoryCovers.has(categorySlug)) {
      categoryCovers.set(categorySlug, {
        imageSrc: images[0],
        imageAlt: `${categoryName} product category`,
      });
    }

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug: categorySlug,
        imageSrc: images[0] || "",
        imageAlt: `${categoryName} product category`,
      },
    });

    const product = await prisma.product.upsert({
      where: { code },
      update: {
        name,
        slug,
        price: typeof item.price === "number" ? item.price : null,
        specifications: item.specifications || {},
        categoryId: category.id,
      },
      create: {
        code,
        slug,
        name,
        price: typeof item.price === "number" ? item.price : null,
        specifications: item.specifications || {},
        categoryId: category.id,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: (images.length ? images : ["/assets/catalog/play-slide.jpg"]).map((src, index) => ({
        productId: product.id,
        src,
        alt: `${code} - ${name}`,
        sortOrder: index,
      })),
    });
  }

  for (const [slug, cover] of categoryCovers.entries()) {
    await prisma.category.update({
      where: { slug },
      data: cover,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
