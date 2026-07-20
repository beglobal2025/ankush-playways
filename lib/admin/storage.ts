"use server";

import { extname } from "path";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { slugify } from "./slug";

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

function safeExtension(file: File): string {
  const extension = extname(file.name).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    return extension;
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  if (file.type === "image/avif") {
    return ".avif";
  }

  return ".jpg";
}

function storageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || "ankushplayways_storage";
}

async function storageClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (url && secretKey) {
    return createSupabaseClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createServerClient();
}

function uploadedProductObjectPath(source: string, bucket: string): string | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !source.startsWith("https://")) {
    return null;
  }

  try {
    const sourceUrl = new URL(source);
    const projectUrl = new URL(supabaseUrl);
    const publicPathPrefix = `/storage/v1/object/public/${bucket}/`;

    if (sourceUrl.origin !== projectUrl.origin || !sourceUrl.pathname.startsWith(publicPathPrefix)) {
      return null;
    }

    const objectPath = decodeURIComponent(sourceUrl.pathname.slice(publicPathPrefix.length));
    const storagePrefix = (process.env.SUPABASE_STORAGE_PREFIX || "uploads").replace(/^\/+|\/+$/g, "");

    return objectPath.startsWith(`${storagePrefix}/products/`) ? objectPath : null;
  } catch {
    return null;
  }
}

export async function deleteUploadedProductImages(imageSources: string[]) {
  const bucket = storageBucket();
  const objectPaths = Array.from(
    new Set(
      imageSources
        .map((source) => uploadedProductObjectPath(source, bucket))
        .filter((path): path is string => Boolean(path)),
    ),
  );

  if (!objectPaths.length) {
    return { error: null, removedCount: 0 };
  }

  try {
    const supabase = await storageClient();
    const { error } = await supabase.storage.from(bucket).remove(objectPaths);

    return {
      error: error?.message ?? null,
      removedCount: error ? 0 : objectPaths.length,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown storage cleanup error",
      removedCount: 0,
    };
  }
}

export async function saveUploadedImage(file: File, folder: string, baseName: string, index = 0): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Image ${file.name} is larger than the 10 MB upload limit`);
  }

  const filename = `${slugify(baseName) || "image"}-${Date.now()}-${index}${safeExtension(file)}`;
  const prefix = (process.env.SUPABASE_STORAGE_PREFIX || "uploads").replace(/^\/+|\/+$/g, "");
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const objectPath = `${prefix}/${normalizedFolder}/${filename}`;
  const bucket = storageBucket();
  const supabase = await createServerClient();
  const { error } = await supabase.storage.from(bucket).upload(objectPath, await file.arrayBuffer(), {
    cacheControl: "31536000",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}
