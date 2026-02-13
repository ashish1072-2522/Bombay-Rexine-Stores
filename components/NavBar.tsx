"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Logo } from "./Logo";
import { ShoppingCart, Heart, User, Menu } from "lucide-react";

type NavItem = { label: string; href: string; adminOnly?: boolean };
const NAV_ITEMS: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Discounts", href: "/discounts" },
  { label: "Payments", href: "/payments" },
  { label: "Inventory (Admin)", href: "/admin", adminOnly: true }
];

export function NavBar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const items = useMemo(() => NAV_ITEMS.filter(i => (i.adminOnly ? isAdmin : true)), [isAdmin]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q); else params.delete("q");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0"><Logo /></Link>

        <form onSubmit={onSearchSubmit} className="flex flex-1 items-center gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search car accessories..." className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200" />
          <button type="submit" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800">Search</button>
        </form>

        <div className="relative">
          <details className="group">
            <summary className="list-none cursor-pointer rounded-xl border px-3 py-2 text-sm flex items-center gap-2"><Menu size={16} /> Menu</summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-sm">
              <div className="p-2">
                {items.map(it => (
                  <Link key={it.href} href={it.href} className={"block rounded-lg px-3 py-2 text-sm hover:bg-neutral-50 " + (pathname === it.href ? "bg-neutral-50" : "")}>
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/wishlist" className="rounded-xl border p-2 hover:bg-neutral-50" aria-label="Wishlist"><Heart size={18} /></Link>
          <Link href="/cart" className="rounded-xl border p-2 hover:bg-neutral-50" aria-label="Cart"><ShoppingCart size={18} /></Link>
          <Link href="/orders" className="rounded-xl border p-2 hover:bg-neutral-50" aria-label="Orders"><User size={18} /></Link>
        </div>
      </div>
    </header>
  );
}
