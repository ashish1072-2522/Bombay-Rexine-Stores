import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";

export default async function HomePage() {
  const products = await prisma.product.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { category: { select: { name: true, slug: true } } } });
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border bg-gradient-to-br from-neutral-50 to-white p-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">Bombay Rexine Stores</h1>
          <p className="mt-3 text-neutral-700">Premium car accessories for Indian cars. Shop seat covers, mats, perfumes, phone holders and more.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/products" className="rounded-xl bg-neutral-900 px-5 py-2.5 text-white hover:bg-neutral-800">Browse products</Link>
            <Link href="/discounts" className="rounded-xl border px-5 py-2.5 hover:bg-neutral-50">View discounts</Link>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="New arrivals" subtitle="Fresh picks from our inventory" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p as any} />)}
        </div>
      </section>
    </div>
  );
}
