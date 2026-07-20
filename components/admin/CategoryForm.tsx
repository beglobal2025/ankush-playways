import AdminSubmitButton from "@/components/admin/AdminSubmitButton";

interface CategoryFormProps {
  action: (formData: FormData) => Promise<void>;
}

export default function CategoryForm({ action }: CategoryFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-black text-slate-950">Category details</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Create a catalogue category before adding products into it.</p>
        </div>
        <div className="grid gap-5 p-5">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Category name
            <input
              name="name"
              required
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              placeholder="Play Equipment"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Description
            <textarea
              name="description"
              rows={4}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              placeholder="Slides, tunnels, balance toys, and active-play products for indoor fun."
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Category image
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[var(--sun-sky-soft)] file:px-4 file:py-2 file:text-sm file:font-black file:text-[var(--sun-sky-dark)] focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Image alt text
              <input
                name="imageAlt"
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
                placeholder="Play Equipment product category"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <AdminSubmitButton
          idleText="Save Category"
          pendingText="Saving category..."
          className="rounded-lg bg-[var(--sun-mint-strong)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]"
        />
        <a href="/admin/products/new" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
          Add Product
        </a>
      </div>
    </form>
  );
}
