#!/usr/bin/env node

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const productsPath = path.join(root, "products.json");
const csvPath = path.join(root, "imports", "indoor-products.csv");
const webpRoot = path.join(root, "public", "catalogue-webp");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

function formatCode(id) {
  const upper = String(id || "").toUpperCase();
  if (/^(LF|LFT|LFP|LFO)-/.test(upper)) {
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

function webpPathFor(publicPath) {
  const cleanPath = String(publicPath || "").replace(/^\/?catalogue\//, "");
  const parsed = path.parse(cleanPath);
  const outputRelative = path.join(parsed.dir, `${parsed.name}.webp`);
  return {
    local: path.join(webpRoot, outputRelative),
    public: `/${path.posix.join("catalogue-webp", ...outputRelative.split(path.sep))}`,
  };
}

function convertImage(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  execFileSync("cwebp", ["-quiet", "-q", "88", source, "-o", destination], {
    stdio: "ignore",
  });
}

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const rows = [];
let convertedCount = 0;
let missingImageCount = 0;

for (const product of products) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const webpImages = [];

  for (const image of images) {
    const source = publicPathToLocal(image);
    const webp = webpPathFor(image);

    if (!fs.existsSync(source)) {
      missingImageCount += 1;
      continue;
    }

    convertImage(source, webp.local);
    convertedCount += 1;
    webpImages.push(webp.public);
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
console.log(`WebP images converted: ${convertedCount}`);
console.log(`Missing source images: ${missingImageCount}`);
console.log(`CSV: ${path.relative(root, csvPath)}`);
console.log(`WebP root: ${path.relative(root, webpRoot)}`);
