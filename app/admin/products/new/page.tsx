import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const admin = await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminHeader
      active="new-product"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Create a new product listing with images, category, pricing, and specifications."
      eyebrow="New Product"
      maxWidth="form"
      title="Add catalogue item"
    >
      <div className="mt-8">
        <ProductForm action={createProductAction} categories={categories} />
      </div>
    </AdminHeader>
  );
}
