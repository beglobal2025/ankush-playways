"use server";

import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

function publicAssetUrl(key: string) {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || process.env.AWS_S3_PUBLIC_URL;

  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/${key}`;
  }

  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.AWS_S3_BUCKET;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function s3Client() {
  return new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
  });
}

function shouldUseS3() {
  return Boolean(process.env.AWS_S3_BUCKET);
}

export async function saveUploadedImage(file: File, folder: string, baseName: string, index = 0): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded");
  }

  const filename = `${slugify(baseName) || "image"}-${Date.now()}-${index}${safeExtension(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!shouldUseS3()) {
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
    return `/uploads/${folder}/${filename}`;
  }

  const prefix = (process.env.AWS_S3_UPLOAD_PREFIX || "uploads").replace(/^\/+|\/+$/g, "");
  const key = `${prefix}/${folder}/${filename}`;

  await s3Client().send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return publicAssetUrl(key);
}
