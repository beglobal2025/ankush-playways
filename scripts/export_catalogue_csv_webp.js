#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const productsPath = path.join(root, "products.json");
const csvPath = path.join(root, "imports", "indoor-products.csv");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

function formatCode(id) {
  const upper = String(id || "").toUpperCase();
  if (/^(AP|APT|APP|APO)-/.test(upper)) {
    return upper.replace("-", "");
  }
  return upper;
}

function flattenSpecValue(value) {
  if (Array.isArray(value)) {
    return value.map(flattenSpecValue).filter(Boolean).join(" | ");
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${flattenSpecValue(nestedValue)}`)
      .filter(Boolean)
      .join("; ");
  }
  return value == null ? "" : String(value);
}

function specificationText(specifications) {
  if (!specifications || typeof specifications !== "object") {
    return "";
  }
  return Object.entries(specifications)
    .map(([key, value]) => {
      const flattened = flattenSpecValue(value);
      return flattened ? `${key}: ${flattened}` : "";
    })
    .filter(Boolean)
    .join("; ");
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function publicPathToLocal(publicPath) {
  const cleanPath = String(publicPath || "").replace(/^\/+/, "");
  return path.join(root, "public", cleanPath);
}

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const rows = [];
let verifiedImageCount = 0;
let missingImageCount = 0;

for (const product of products) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const webpImages = [];

  for (const image of images) {
    const source = publicPathToLocal(image);

    if (!fs.existsSync(source)) {
      missingImageCount += 1;
      continue;
    }

    verifiedImageCount += 1;
    webpImages.push(image);
  }

  const id = slugify(product.id || product.name);
  const code = formatCode(id);
  const specifications = product.specifications || {};

  rows.push({
    id,
    code,
    slug: `${id}-${slugify(product.name || code)}`,
    name: product.name || code,
    category: product.category || "Catalogue",
    price: typeof product.price === "number" ? product.price : "",
    specifications_text: specificationText(specifications),
    specifications_json: JSON.stringify(specifications),
    images: images.join("|"),
    webp_images: webpImages.join("|"),
  });
}

const headers = [
  "id",
  "code",
  "slug",
  "name",
  "category",
  "price",
  "specifications_text",
  "specifications_json",
  "images",
  "webp_images",
];

fs.mkdirSync(path.dirname(csvPath), { recursive: true });
fs.writeFileSync(
  csvPath,
  `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`,
);

console.log(`Products exported: ${rows.length}`);
console.log(`WebP images verified: ${verifiedImageCount}`);
console.log(`Missing source images: ${missingImageCount}`);
console.log(`CSV: ${path.relative(root, csvPath)}`);
