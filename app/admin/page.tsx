import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/SectionHeader";

export default async function AdminDashboard() {
  const [products, orders, discounts] = await Promise.all([prisma.product.count(), prisma.order.count(), prisma.discount.count()]);
  return (
    <div>
      <SectionHeader title="Admin Dashboard" subtitle="Manage inventory and orders." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-5"><div className="text-sm text-neutral-600">Products</div><div className="mt-2 text-2xl font-semibold">{products}</div></div>
        <div className="rounded-2xl border p-5"><div className="text-sm text-neutral-600">Orders</div><div className="mt-2 text-2xl font-semibold">{orders}</div></div>
        <div className="rounded-2xl border p-5"><div className="text-sm text-neutral-600">Discounts</div><div className="mt-2 text-2xl font-semibold">{discounts}</div></div>
      </div>
    </div>
  );
}
