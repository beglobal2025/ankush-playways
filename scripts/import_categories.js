const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadLocalEnv() {
  const root = process.cwd();
  loadEnvFile(path.join(root, ".env"));
  loadEnvFile(path.join(root, ".env.local"));
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
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
      if (char === "\r" && next === "\n") i += 1;
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
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function contentTypeFor(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  if (extension === ".gif") return "image/gif";
  return "image/jpeg";
}

function createStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Image uploads need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env. The service role key must stay server-only and must never be exposed to the browser.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function uploadCategoryImage({ fileName, imageDir, slug, storageClient }) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const prefix = (process.env.SUPABASE_STORAGE_PREFIX || "uploads").replace(/^\/+|\/+$/g, "");

  if (!bucket) {
    throw new Error("Missing SUPABASE_STORAGE_BUCKET in .env");
  }

  const sourcePath = path.join(imageDir, fileName);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing category image: ${sourcePath}`);
  }

  const extension = path.extname(fileName).toLowerCase() || ".jpg";
  const objectPath = `${prefix}/categories/${slug}${extension}`;
  const fileBuffer = fs.readFileSync(sourcePath);

  const { error } = await storageClient.storage.from(bucket).upload(objectPath, fileBuffer, {
    cacheControl: "31536000",
    contentType: contentTypeFor(fileName),
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload ${fileName}: ${error.message}`);
  }

  const { data } = storageClient.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function main() {
  loadLocalEnv();

  const dryRun = process.argv.includes("--dry-run");
  const withImages = process.argv.includes("--with-images");
  const positionalArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const csvPath = path.resolve(positionalArgs[0] || "imports/indoor-categories.csv");
  const imageDir = path.resolve(positionalArgs[1] || "imports/category-images");

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const rowsWithFiles = rows.filter((row) => row.imageFile);
  const storageClient = rowsWithFiles.length > 0 && withImages && !dryRun ? createStorageClient() : null;

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const name = row.name;
    const slug = row.slug || slugify(name);

    if (!name || !slug) {
      throw new Error(`Category row requires name and slug: ${JSON.stringify(row)}`);
    }

    let imageSrc = row.imageSrc || "";

    if (row.imageFile && storageClient) {
      imageSrc = await uploadCategoryImage({
        fileName: row.imageFile,
        imageDir,
        slug,
        storageClient,
      });
    } else if (row.imageFile && !row.imageSrc && withImages && !dryRun) {
      console.warn(`Skipping image for ${slug}: ${row.imageFile} was not uploaded in this run.`);
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    const baseData = {
      description: row.description || "",
      imageAlt: row.imageAlt || name,
      name,
      seoDescription: row.seoDescription || null,
      seoTitle: row.seoTitle || null,
    };
    const data = imageSrc ? { ...baseData, imageSrc } : baseData;

    if (dryRun) {
      console.log(`${existing ? "UPDATE" : "CREATE"} ${slug} -> ${name}`);
      continue;
    }

    await prisma.category.upsert({
      where: { slug },
      update: data,
      create: {
        ...baseData,
        imageSrc,
        slug,
      },
    });

    if (existing) updated += 1;
    else created += 1;
  }

  console.log(`Imported categories. Created: ${created}. Updated: ${updated}. Total: ${rows.length}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
