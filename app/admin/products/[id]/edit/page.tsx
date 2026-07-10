import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const admin = await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        colorOptions: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminHeader
      active="products"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Update product details, images, publishing status, and structured specifications."
      eyebrow="Edit Product"
      maxWidth="form"
      title={product.name}
    >
      <div className="mt-8">
        <ProductForm action={updateProductAction.bind(null, product.id)} categories={categories} product={product} />
      </div>
    </AdminHeader>
  );
}
