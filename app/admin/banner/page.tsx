import AdminHeader from "@/components/admin/AdminHeader";
import { updateBannerImageAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const admin = await requireAdmin();
  const banner = await prisma.siteSetting.findUnique({
    where: { key: "home_banner_image" },
  });

  return (
    <AdminHeader
      active="banner"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Upload the image shown in the homepage banner."
      eyebrow="Homepage"
      maxWidth="form"
      title="Banner image"
    >
      <form action={updateBannerImageAction} className="mt-8 grid gap-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-black text-slate-950">Current banner</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Upload a JPG, PNG, WEBP, GIF, or AVIF image.</p>
          </div>

          <div className="grid gap-5 p-5">
            {banner?.value ? (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img src={banner.value} alt="Current homepage banner" className="h-64 w-full object-cover" />
              </div>
            ) : (
              <div className="grid h-52 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
                <p className="text-sm font-bold text-slate-500">No custom banner image uploaded yet.</p>
              </div>
            )}

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Banner image
              <input
                name="bannerImage"
                type="file"
                accept="image/*"
                required
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[var(--sun-sky-soft)] file:px-4 file:py-2 file:text-sm file:font-black file:text-[var(--sun-sky-dark)] focus:border-[var(--sun-sky-dark)] focus:ring-4 focus:ring-[var(--sun-sky-soft)]"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg bg-[var(--sun-mint-strong)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
            Save Banner
          </button>
          <a href="/" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
            View Site
          </a>
        </div>
      </form>
    </AdminHeader>
  );
}
