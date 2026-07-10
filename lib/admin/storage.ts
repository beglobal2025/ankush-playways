"use server";

import { extname } from "path";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "./slug";

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

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
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error("Missing required environment variable: SUPABASE_STORAGE_BUCKET");
  }

  return bucket;
}

export async function saveUploadedImage(file: File, folder: string, baseName: string, index = 0): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded");
  }

  const filename = `${slugify(baseName) || "image"}-${Date.now()}-${index}${safeExtension(file)}`;
  const prefix = (process.env.SUPABASE_STORAGE_PREFIX || "uploads").replace(/^\/+|\/+$/g, "");
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const objectPath = `${prefix}/${normalizedFolder}/${filename}`;
  const bucket = storageBucket();
  const supabase = await createClient();
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
