import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/SectionHeader";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: { select: { name: true } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-4">
      <SectionHeader title="Products and Inventory" subtitle="Admins can add, update stock, and delete products." />
      <AdminProductsClient initialProducts={products as any} categories={categories as any} />
    </div>
  );
}
