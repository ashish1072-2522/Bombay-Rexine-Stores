"use client";
import Image from "next/image";
import { formatINR } from "@/lib/money";
import { useState } from "react";

export function CartClient({ items, totalPaise }: { items: any[]; totalPaise: number }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function updateQuantity(cartItemId: string, quantity: number) {
    setBusyId(cartItemId); setMsg(null);
    const res = await fetch("/api/cart/update", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ cartItemId, quantity }) });
    setBusyId(null);
    if (!res.ok) setMsg("Could not update cart."); else window.location.reload();
  }

  async function removeItem(cartItemId: string) {
    setBusyId(cartItemId); setMsg(null);
    const res = await fetch("/api/cart/remove", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ cartItemId }) });
    setBusyId(null);
    if (!res.ok) setMsg("Could not remove item."); else window.location.reload();
  }

  if (items.length === 0) return <div className="rounded-2xl border bg-neutral-50 p-6 text-sm text-neutral-700">Your cart is empty.</div>;

  return (
    <div className="rounded-2xl border p-5">
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="flex gap-4">
            <div className="relative h-20 w-28 overflow-hidden rounded-xl border bg-white">
              <Image src={it.product.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"} alt={it.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{it.product.name}</div>
              <div className="mt-1 text-sm text-neutral-600">{formatINR(it.product.pricePaise)}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50" disabled={busyId===it.id || it.quantity<=1} onClick={()=>updateQuantity(it.id, it.quantity-1)}>-</button>
                <div className="text-sm">Qty: <span className="font-medium">{it.quantity}</span></div>
                <button className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50" disabled={busyId===it.id || it.quantity>=it.product.stock} onClick={()=>updateQuantity(it.id, it.quantity+1)}>+</button>
                <button className="ml-auto rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50" disabled={busyId===it.id} onClick={()=>removeItem(it.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {msg ? <div className="mt-4 text-sm text-red-600">{msg}</div> : null}
      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <div className="text-sm text-neutral-600">Subtotal</div>
        <div className="text-sm font-semibold">{formatINR(totalPaise)}</div>
      </div>
    </div>
  );
}
