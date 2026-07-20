const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categoryName = "Outdoor Playground Equipment";
const categorySlug = "outdoor-playground-equipments";
const categoryDescription = "Outdoor playground equipments selected from the Outdoor Catalogue March 2026.";

const products = [
  {
    code: "APO-MPS-01A",
    name: "Outdoor Multiplay Station APO-MPS-01A",
    price: 164990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-01a.webp",
    specifications: {
      "Equipment Size": "L-24.76 x W-8.7 x H-6.56 ft",
      "Safe Play Area": "L-30.76 x W-11.7 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-02",
    name: "Outdoor Multiplay Station APO-MPS-02",
    price: 279990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-02.webp",
    specifications: {
      "Equipment Size": "L-24 x W-8.7 x H-12 ft",
      "Safe Play Area": "L-23.66 x W-15.33 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-02A",
    name: "Outdoor Multiplay Station APO-MPS-02A",
    price: 529990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-02a.webp",
    specifications: {
      "Equipment Size": "L-24 x W-23 x H-13 ft",
      "Safe Play Area": "L-30 x W-27 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-03",
    name: "Outdoor Multiplay Station APO-MPS-03",
    price: 219990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-03.webp",
    specifications: {
      "Equipment Size": "L-13.28 x W-10.49 x H-12 ft",
      "Safe Play Area": "L-16.66 x W-13.33 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-03B",
    name: "Outdoor Multiplay Station APO-MPS-03B",
    price: 229990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-03b.webp",
    specifications: {
      "Equipment Size": "L-16.9 x W-10.33 x H-12.66 ft",
      "Safe Play Area": "L-16.66 x W-13.33 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-03C",
    name: "Outdoor Multiplay Station APO-MPS-03C",
    price: 239990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-03c.webp",
    specifications: {
      "Equipment Size": "L-14.83 x W-14.60 x H-10.5 ft",
      "Safe Play Area": "L-20.83 x W-18.60 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-03D",
    name: "Outdoor Multiplay Station APO-MPS-03D",
    price: 239990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-03d.webp",
    specifications: {
      "Equipment Size": "L-13.52 x W-6.49 x H-9.84 ft",
      "Safe Play Area": "L-19.52 x W-12.49 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-03E",
    name: "Outdoor Multiplay Station APO-MPS-03E",
    price: 159990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-03e.webp",
    specifications: {
      "Equipment Size": "L-10.55 x W-7.94 x H-9.84 ft",
      "Safe Play Area": "L-16.55 x W-11.94 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
  {
    code: "APO-MPS-04",
    name: "Outdoor Multiplay Station APO-MPS-04",
    price: 359990,
    image: "/catalogue-webp/outdoor-playground-equipments/lfo-mps-04.webp",
    specifications: {
      "Equipment Size": "L-18.6 x W-14 x H-12.66 ft",
      "Safe Play Area": "L-22 x W-15.33 ft",
      catalogue: "Outdoor Catalogue March 2026",
    },
  },
];

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {
      description: categoryDescription,
      imageAlt: `${categoryName} product category`,
      imageSrc: products[0].image,
      name: categoryName,
    },
    create: {
      description: categoryDescription,
      imageAlt: `${categoryName} product category`,
      imageSrc: products[0].image,
      name: categoryName,
      slug: categorySlug,
    },
  });

  for (const [index, item] of products.entries()) {
    const slug = `${slugify(item.code)}-${slugify(item.name)}`;
    const product = await prisma.product.upsert({
      where: { code: item.code },
      update: {
        categoryId: category.id,
        isFeatured: false,
        name: item.name,
        price: item.price,
        slug,
        sortOrder: index,
        specifications: item.specifications,
        status: "PUBLISHED",
      },
      create: {
        categoryId: category.id,
        code: item.code,
        isFeatured: false,
        name: item.name,
        price: item.price,
        slug,
        sortOrder: index,
        specifications: item.specifications,
        status: "PUBLISHED",
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        alt: `${item.code} - ${item.name}`,
        productId: product.id,
        sortOrder: 0,
        src: item.image,
      },
    });
  }

  await prisma.product.deleteMany({
    where: {
      categoryId: category.id,
      code: { notIn: products.map((product) => product.code) },
    },
  });

  console.log(`Imported ${products.length} products into ${categoryName}.`);
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
