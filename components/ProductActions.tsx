"use client";
import { useState } from "react";

export function ProductActions({ productId, disabled }: { productId: string; disabled: boolean }) {
  const [busy, setBusy] = useState<"wish" | "cart" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function toggleWishlist() {
    setBusy("wish"); setMsg(null);
    const res = await fetch("/api/wishlist/toggle", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) });
    const j = await res.json().catch(()=>({}));
    setBusy(null);
    setMsg(j?.message ?? (res.ok ? "Updated wishlist" : "Please sign in first"));
  }

  async function addToCart() {
    setBusy("cart"); setMsg(null);
    const res = await fetch("/api/cart/add", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, quantity: 1 }) });
    const j = await res.json().catch(()=>({}));
    setBusy(null);
    setMsg(j?.message ?? (res.ok ? "Added to cart" : "Please sign in first"));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button onClick={toggleWishlist} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50" disabled={busy !== null}>
          {busy === "wish" ? "Saving..." : "Wishlist"}
        </button>
        <button onClick={addToCart} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50" disabled={disabled || busy !== null}>
          {disabled ? "Out of stock" : (busy === "cart" ? "Adding..." : "Add to cart")}
        </button>
      </div>
      {msg ? <div className="text-sm text-neutral-700">{msg}</div> : null}
    </div>
  );
}
