"use server";

import { extname } from "node:path";
import { requireAdmin } from "./auth";
import { slugify } from "./slug";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

interface UploadTargetRequest {
  baseName: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  index: number;
}

function safeExtension(fileName: string, fileType: string): string {
  const extension = extname(fileName).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    return extension;
  }

  if (fileType === "image/png") return ".png";
  if (fileType === "image/webp") return ".webp";
  if (fileType === "image/avif") return ".avif";
  return ".jpg";
}

export async function createProductImageUploadTarget(request: UploadTargetRequest) {
  await requireAdmin();

  if (!request.fileType.startsWith("image/")) {
    throw new Error("Only image files can be uploaded");
  }

  if (request.fileSize <= 0 || request.fileSize > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`${request.fileName} must be smaller than 10 MB`);
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "ankushplayways_storage";
  const prefix = (process.env.SUPABASE_STORAGE_PREFIX || "uploads").replace(/^\/+|\/+$/g, "");
  const filename = `${slugify(request.baseName) || "product"}-${Date.now()}-${request.index}${safeExtension(request.fileName, request.fileType)}`;
  const path = `${prefix}/products/${filename}`;
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);

  if (error) {
    throw new Error(`Could not prepare image upload: ${error.message}`);
  }

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

  return {
    bucket,
    path: data.path,
    publicUrl,
    token: data.token,
  };
}
