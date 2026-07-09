import type { Category, Product, ProductColorOption, ProductImage } from "@prisma/client";
import ProductColorOptionsField from "@/components/admin/ProductColorOptionsField";

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

  return (
    <form action={action} className="grid gap-6">
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
              placeholder="LF802"
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
            Upload one or more images. The first uploaded image becomes the main thumbnail.
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
          className="mt-2 rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-[var(--sun-mint-strong)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
          Save Product
        </button>
        <a href="/admin/products" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
          Cancel
        </a>
      </div>
    </form>
  );
}
