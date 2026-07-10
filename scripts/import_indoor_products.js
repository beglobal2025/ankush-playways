const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categoryAliases = {
  "Ball Pool": "Ball Pools & Fences",
  Bench: "Benches & Chairs",
  Fence: "Ball Pools & Fences",
  "For All Category Classes": "Benches & Chairs",
  "Middle & High Classes": "Classroom Furniture",
  "Middle Classes": "Classroom Furniture",
  "Pre Classes": "Classroom Furniture",
  Premium: "Classroom Furniture",
  "Primary , Middle & High Classes": "Classroom Furniture",
  "Primary Classes": "Classroom Furniture",
  Rideon: "Rockers & Ride-ons",
  "Rideon & Balls": "Rockers & Ride-ons",
  Rockers: "Rockers & Ride-ons",
  "Rockers & See-Saw": "Rockers & Ride-ons",
  "Sand pit": "Sand Pits",
  "Shelf & Pencil Dustbin": "Storage & Shelves",
  Slides: "Slides & Swings",
  "Soft Play Seating": "Soft Seating",
  Sports: "Sports Equipment",
  "Tent House": "Play Equipment",
  "Toy Shelf": "Storage & Shelves",
  Trampoline: "Trampolines",
};

const categoryDescriptions = {
  "Ball Pools & Fences": "Ball pools play fences and enclosed soft play boundary products for indoor activity zones",
  "Benches & Chairs": "Plastic chairs benches and seating products for indoor school and playroom use",
  "Classroom Furniture": "Indoor classroom desks tables and chairs for pre-primary primary middle and high school spaces",
  "Gym Equipment": "Indoor gym and fitness activity equipment for balance movement and physical development",
  "Learning Toys": "Educational learning toys for early childhood play motor skills and classroom activities",
  Mats: "EVA mats folding mats rolling carpets and soft floor products for indoor play and classrooms",
  "Play Equipment": "Indoor playhouses activity play sets tunnels balance sets and developmental play equipment",
  Puzzles: "Educational puzzles for alphabets numbers opposites body parts and early learning activities",
  Puppets: "Finger puppets animal puppets fruit and vegetable puppets for storytelling and classroom play",
  "Rockers & Ride-ons": "Rockers see-saws ride-ons tricycles and movement play products for children",
  "Role Play Costumes": "Role play costumes for professions community helpers and imaginative classroom activities",
  "Sand Pits": "Water and sand play products including sandpits and activity sand play sets",
  "Slides & Swings": "Indoor slides swings and slide-with-swing play combinations for children",
  "Soft Seating": "Soft seating and flexible seating options for preschool and classroom activity corners",
  "Sports Equipment": "Sports activity products hurdles rings dividers swings and physical activity accessories",
  "Storage & Shelves": "Toy shelves book shelves pencil dustbins and indoor classroom storage products",
  Toys: "Indoor toys blocks stacking toys bowling sets sand toys musical toys and activity play products",
  Trampolines: "Indoor trampoline products for active play movement and school activity zones",
  "Flash Cards": "Flash card sets for alphabets numbers colours shapes animals fruits vegetables and early learning",
};

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  const [header, ...records] = rows;
  if (!header) return [];

  const keys = header.map((key) => key.trim());
  return records.map((record) =>
    Object.fromEntries(keys.map((key, index) => [key, (record[index] || "").trim()])),
  );
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function parseSpecifications(value) {
  if (!value) return {};

  try {
    return JSON.parse(value);
  } catch {
    return { details: [value] };
  }
}

function splitList(value) {
  return String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function storefrontCategoryName(rawCategoryName) {
  return categoryAliases[rawCategoryName] || rawCategoryName || "Catalogue";
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const pruneEmptyCategories = process.argv.includes("--prune-empty-categories");
  const useOriginalImages = process.argv.includes("--use-original-images");
  const positionalArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const csvPath = path.resolve(positionalArgs[0] || "imports/indoor-products.csv");

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const categoryCovers = new Map();
  let created = 0;
  let updated = 0;

  for (const [index, row] of rows.entries()) {
    const code = row.code;
    const name = row.name;
    const categoryName = storefrontCategoryName(row.category);
    const categorySlug = slugify(categoryName);
    const productSlug = row.slug || `${slugify(row.id || code)}-${slugify(name)}`;
    const imageSources = useOriginalImages ? splitList(row.images) : splitList(row.webp_images);
    const fallbackImages = splitList(row.images);
    const images = imageSources.length ? imageSources : fallbackImages;

    if (!code || !name || !categorySlug || !productSlug) {
      throw new Error(`Invalid product row ${index + 2}: ${JSON.stringify(row)}`);
    }

    if (images[0] && !categoryCovers.has(categorySlug)) {
      categoryCovers.set(categorySlug, {
        categoryName,
        imageAlt: `${categoryName} product category`,
        imageSrc: images[0],
      });
    }

    if (dryRun) {
      continue;
    }

    const category =
      (await prisma.category.findFirst({
        where: {
          OR: [{ slug: categorySlug }, { name: categoryName }],
        },
      })) ??
      (await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          description: categoryDescriptions[categoryName] || "",
          imageAlt: `${categoryName} product category`,
          imageSrc: images[0] || "",
        },
      }));

    if (category.name !== categoryName && !(await prisma.category.findUnique({ where: { name: categoryName } }))) {
      await prisma.category.update({
        where: { id: category.id },
        data: {
          description: categoryDescriptions[categoryName] || category.description,
          name: categoryName,
        },
      });
    } else if (!category.description && categoryDescriptions[categoryName]) {
      await prisma.category.update({
        where: { id: category.id },
        data: { description: categoryDescriptions[categoryName] },
      });
    }

    const existing = await prisma.product.findUnique({ where: { code } });
    const product = await prisma.product.upsert({
      where: { code },
      update: {
        categoryId: category.id,
        name,
        price: parsePrice(row.price),
        slug: productSlug,
        sortOrder: index,
        specifications: parseSpecifications(row.specifications_json),
        status: "PUBLISHED",
      },
      create: {
        categoryId: category.id,
        code,
        name,
        price: parsePrice(row.price),
        slug: productSlug,
        sortOrder: index,
        specifications: parseSpecifications(row.specifications_json),
        status: "PUBLISHED",
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: (images.length ? images : ["/assets/catalog/play-slide.jpg"]).map((src, imageIndex) => ({
        productId: product.id,
        src,
        alt: `${code} - ${name}`,
        sortOrder: imageIndex,
      })),
    });

    if (existing) updated += 1;
    else created += 1;
  }

  if (!dryRun) {
    for (const [slug, cover] of categoryCovers.entries()) {
      const category = await prisma.category.findFirst({
        where: {
          OR: [{ slug }, { name: cover.categoryName }],
        },
      });
      if (!category) continue;

      await prisma.category.update({
        where: { id: category.id },
        data: {
          imageAlt: cover.imageAlt,
          imageSrc: cover.imageSrc,
        },
      });
    }

    if (pruneEmptyCategories) {
      const deleted = await prisma.category.deleteMany({
        where: {
          products: { none: {} },
        },
      });
      console.log(`Deleted empty categories: ${deleted.count}.`);
    }
  }

  const mode = dryRun ? "Validated" : "Imported";
  console.log(`${mode} indoor products. Created: ${created}. Updated: ${updated}. Total: ${rows.length}.`);
  console.log(`Images: ${useOriginalImages ? "original catalogue images" : "WebP catalogue images"}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
