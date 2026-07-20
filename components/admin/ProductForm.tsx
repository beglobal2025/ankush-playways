"use client";

import type { Category, Product, ProductColorOption, ProductImage } from "@prisma/client";
import { useState, type FormEvent } from "react";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import ProductColorOptionsField from "@/components/admin/ProductColorOptionsField";
import { createProductImageUploadTarget } from "@/lib/admin/upload-actions";
import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_COLOR_OPTIONS = 2;
const MAX_PRODUCT_IMAGES = 8;

type ProductWithImagesAndCategory = Product & {
  category: Category;
  colorOptions: ProductColorOption[];
  images: ProductImage[];
};

interface ProductFormProps {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  product?: ProductWithImagesAndCategory;
}

export default function ProductForm({ action, categories, product }: ProductFormProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  function specsToLines(spec: any) {
    if (!spec) return "";
    if (typeof spec === "string") return spec;
    if (typeof spec !== "object") return String(spec);

    return Object.entries(spec)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  }

  const specifications = product ? specsToLines(product.specifications ?? {}) : "";
  const currentImages = product?.images ?? [];
  const colorOptionRows = (product?.colorOptions ?? []).map((option) => ({
    id: option.id,
    color: option.color,
    imageSrc: option.imageSrc,
    imageAlt: option.imageAlt,
  }));

  async function uploadImage(file: File, baseName: string, index: number) {
    const target = await createProductImageUploadTarget({
      baseName,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      index,
    });
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(target.bucket)
      .uploadToSignedUrl(target.path, target.token, file, {
        cacheControl: "31536000",
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Could not upload ${file.name}: ${uploadError.message}`);
    }

    return target.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const productFiles = formData
      .getAll("imageFiles")
      .filter((value): value is File => value instanceof File && value.size > 0);
    const colorFiles = formData
      .getAll("colorOptionImages")
      .map((value) => (value instanceof File && value.size > 0 ? value : null));
    const colorNames = formData
      .getAll("colorOptionColors")
      .filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
    const allFiles = [...productFiles, ...colorFiles.filter((file): file is File => file !== null)];

    if (productFiles.length > MAX_PRODUCT_IMAGES) {
      setError(`Please select no more than ${MAX_PRODUCT_IMAGES} product images.`);
      return;
    }

    if (colorNames.length > MAX_COLOR_OPTIONS) {
      setError(`Please add no more than ${MAX_COLOR_OPTIONS} color variations.`);
      return;
    }

    const oversizedFile = allFiles.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversizedFile) {
      setError(`${oversizedFile.name} is larger than 10 MB. Please choose a smaller image.`);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const code = String(formData.get("code") || "product");
      const name = String(formData.get("name") || "image");
      const totalUploads = allFiles.length;
      let completedUploads = 0;

      formData.delete("imageFiles");
      formData.delete("colorOptionImages");

      for (let index = 0; index < productFiles.length; index += 1) {
        setLoadingText(`Uploading image ${completedUploads + 1} of ${totalUploads}...`);
        const publicUrl = await uploadImage(productFiles[index], `${code}-${name}`, index);
        formData.append("imageUploadedUrls", publicUrl);
        completedUploads += 1;
      }

      for (let index = 0; index < colorFiles.length; index += 1) {
        const file = colorFiles[index];

        if (file) {
          setLoadingText(`Uploading image ${completedUploads + 1} of ${totalUploads}...`);
          const color = String(formData.getAll("colorOptionColors")[index] || `color-${index + 1}`);
          const publicUrl = await uploadImage(file, `${code}-${name}-${color}`, productFiles.length + index);
          formData.append("colorOptionUploadedImages", publicUrl);
          completedUploads += 1;
        } else {
          formData.append("colorOptionUploadedImages", "");
        }
      }

      setLoadingText(product ? "Updating product..." : "Adding product...");
      await action(formData);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not save the product. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoadingText("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-black text-slate-950">Product details</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Core catalogue information used across the public website.</p>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Product code
            <input
              name="code"
              required
              defaultValue={product?.code}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              placeholder="AP802"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Product name
            <input
              name="name"
              required
              defaultValue={product?.name}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              placeholder="Kids play equipment"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            <span className="flex items-center justify-between gap-3">
              Category
              <a href="/admin/categories/new" className="text-xs font-black text-[var(--sun-coral-strong)] transition hover:text-[var(--sun-sky-dark)]">
                Add Category
              </a>
            </span>
            <input
              name="category"
              required
              list="admin-categories"
              defaultValue={product?.category.name}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              placeholder="Play Equipment"
            />
            <datalist id="admin-categories">
              {categories.map((category) => (
                <option key={category.id} value={category.name} />
              ))}
            </datalist>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Price
            <input
              name="price"
              type="number"
              min="0"
              defaultValue={product?.price ?? ""}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              placeholder="Leave blank for price on request"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Status
            <select
              name="status"
              defaultValue={product?.status ?? "PUBLISHED"}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </label>
          <label className="flex items-center gap-3 self-end rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            {/* Featured product flag is managed separately in the Featured admin page */}
            <span className="text-xs text-slate-500">Featured status is managed from the Featured admin panel.</span>
          </label>
        </div>
      </div>

      <ProductColorOptionsField options={colorOptionRows} />

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-700 shadow-sm">
        <div>
          <h2 className="text-base font-black text-slate-950">Product images</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Upload up to 8 images, maximum 10 MB each. The first uploaded image becomes the main thumbnail.
          </p>
        </div>

        {currentImages.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {currentImages.map((image) => (
              <div key={image.id} className="grid place-items-center rounded-lg border border-slate-200 bg-slate-50 p-3">
                <img src={image.src} alt={image.alt} className="h-24 w-full object-contain" />
              </div>
            ))}
          </div>
        ) : null}

        <label className="grid gap-2">
          Upload images
          <input
            name="imageFiles"
            type="file"
            accept="image/*"
            multiple
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[var(--sun-sky-soft)] file:px-4 file:py-2 file:text-sm file:font-black file:text-[var(--sun-sky-dark)] focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
          />
        </label>

        {product ? (
          <p className="text-xs font-semibold text-slate-500">
            Leave this empty to keep the current product images. Uploading new images replaces the current set.
          </p>
        ) : null}
      </div>

      <label className="grid gap-2 rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-700 shadow-sm">
        <span className="text-base font-black text-slate-950">Specifications</span>
        <span className="text-sm font-semibold text-slate-500">
          Enter one specification per line as <span className="font-mono">key: value</span>. Numeric and boolean
          values are parsed automatically. You can also paste a JSON object.
        </span>
        <textarea
          name="specifications"
          rows={9}
          defaultValue={specifications}
          placeholder={`Size: 120 x 60 x 80 cm
Material: LLDPE plastic
Recommended Age: 3 to 8 years
Usage: Indoor and outdoor
Assembly Required: Yes`}
          className="mt-2 rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
        />
      </label>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <AdminSubmitButton
          idleText="Save Product"
          pendingText={product ? "Updating product..." : "Adding product..."}
          loading={isSubmitting}
          loadingText={loadingText}
          className="rounded-lg bg-[var(--sun-mint-strong)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]"
        />
        <a href="/admin/products" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
          Cancel
        </a>
      </div>
    </form>
  );
}
