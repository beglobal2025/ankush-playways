import AdminHeader from "@/components/admin/AdminHeader";
import AdminCategorySearchList from "@/components/admin/AdminCategorySearchList";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategoryAction, deleteCategoryAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const admin = await requireAdmin();
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  const categoryList = categories.map((category) => ({
    description: category.description,
    id: category.id,
    imageAlt: category.imageAlt,
    imageSrc: category.imageSrc,
    name: category.name,
    productCount: category._count.products,
    slug: category.slug,
  }));

  return (
    <AdminHeader
      active="new-category"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Add a catalogue category first, then create products under that category."
      eyebrow="New Category"
      maxWidth="form"
      title="Add category"
    >
      <div className="mt-8">
        <CategoryForm action={createCategoryAction} />
      </div>

      <AdminCategorySearchList categories={categoryList} deleteAction={deleteCategoryAction} />
    </AdminHeader>
  );
}
