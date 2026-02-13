import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/money";

export function ProductCard({ p }: { p: any }) {
  const img = p.images?.[0] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80";
  const outOfStock = p.stock <= 0;

  return (
    <Link href={`/products/${p.slug}`} className="group overflow-hidden rounded-2xl border bg-white hover:shadow-sm">
      <div className="relative aspect-[4/3] w-full">
        <Image src={img} alt={p.name} fill className="object-cover" />
        {outOfStock ? <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">Out of stock</div> : null}
      </div>
      <div className="p-4">
        <div className="text-xs text-neutral-500">{p.category?.name}</div>
        <div className="mt-1 font-medium leading-snug group-hover:underline">{p.name}</div>
        <div className="mt-2 text-sm font-semibold">{formatINR(p.pricePaise)}</div>
      </div>
    </Link>
  );
}
