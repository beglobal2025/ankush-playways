import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminProductSearchList from "@/components/admin/AdminProductSearchList";
import { deleteProductAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  const products = await prisma.product.findMany({
    include: {
      category: true,
      colorOptions: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: [{ updatedAt: "desc" }],
  });
  const productList = products.map((product) => ({
    categoryName: product.category.name,
    code: product.code,
    colorOptions: product.colorOptions.map((option) => option.color),
    id: product.id,
    imageSrc: product.images[0]?.src ?? "",
    name: product.name,
    price: product.price,
    status: product.status,
  }));

  return (
    <AdminHeader
      active="products"
      adminEmail={admin.email}
      adminName={admin.name}
      description="Review, edit, publish, and remove catalogue items from one place."
      eyebrow="Products"
      title="Manage catalogue"
      action={
        <Link href="/admin/products/new" className="rounded-lg bg-[var(--sun-mint-strong)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#a6e5cd]/30 transition hover:bg-[var(--sun-sky-dark)]">
          Add Product
        </Link>
      }
    >
      <AdminProductSearchList deleteAction={deleteProductAction} products={productList} />
    </AdminHeader>
  );
}
