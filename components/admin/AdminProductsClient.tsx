"use client";
import { useMemo, useState } from "react";
import { formatINR } from "@/lib/money";

type Category = { id: string; name: string; slug: string };
type Product = { id: string; name: string; slug: string; description: string; pricePaise: number; stock: number; category: { name: string }; categoryId: string };

export function AdminProductsClient({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceInr, setPriceInr] = useState("1999");
  const [stock, setStock] = useState("10");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState("");

  const canCreate = useMemo(() => name.trim().length > 2 && categoryId, [name, categoryId]);

  async function refresh() {
    const res = await fetch("/api/admin/products");
    const j = await res.json();
    setProducts(j.products);
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;
    setBusy("create"); setMsg(null);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name, description, pricePaise: Math.round(Number(priceInr) * 100),
        stock: Number(stock), categoryId, images: imageUrl ? [imageUrl] : []
      })
    });

    const j = await res.json().catch(()=>({}));
    setBusy(null);
    if (!res.ok) return setMsg(j?.message ?? "Could not create product.");
    setName(""); setDescription(""); setPriceInr("1999"); setStock("10"); setImageUrl("");
    setMsg("Product created.");
    await refresh();
  }

  async function updateField(productId: string, patch: any) {
    setBusy(productId); setMsg(null);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch)
    });
    const j = await res.json().catch(()=>({}));
    setBusy(null);
    if (!res.ok) return setMsg(j?.message ?? "Could not update product.");
    await refresh();
  }

  async function deleteProduct(productId: string) {
    if (!confirm("Delete this product?")) return;
    setBusy(productId); setMsg(null);
    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    const j = await res.json().catch(()=>({}));
    setBusy(null);
    if (!res.ok) return setMsg(j?.message ?? "Could not delete product.");
    setMsg("Product deleted.");
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-5">
        <div className="font-semibold">Add new product</div>
        <form onSubmit={createProduct} className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm">Name</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Example: Steering Wheel Cover (Brown)" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Description</label>
            <textarea className="mt-1 w-full rounded-xl border px-3 py-2" value={description} onChange={(e)=>setDescription(e.target.value)} rows={3} placeholder="Short product description..." />
          </div>
          <div>
            <label className="text-sm">Price (INR)</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={priceInr} onChange={(e)=>setPriceInr(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Stock</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={stock} onChange={(e)=>setStock(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <select className="mt-1 w-full rounded-xl border px-3 py-2" value={categoryId} onChange={(e)=>setCategoryId(e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Image URL (optional)</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <button disabled={!canCreate || busy==="create"} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
              {busy==="create" ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>
      </div>

      {msg ? <div className="rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-800">{msg}</div> : null}

      <div className="rounded-2xl border">
        <div className="border-b p-4 font-semibold">Inventory</div>
        <div className="divide-y">
          {products.map(p => (
            <div key={p.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="mt-1 text-sm text-neutral-600">{p.category.name} · {formatINR(p.pricePaise)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-sm text-neutral-600">Stock</label>
                  <input
                    className="w-24 rounded-xl border px-3 py-2 text-sm"
                    defaultValue={p.stock}
                    onBlur={(e)=>updateField(p.id, { stock: Number(e.target.value) })}
                    disabled={busy===p.id}
                  />
                  <button onClick={()=>deleteProduct(p.id)} disabled={busy===p.id} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </div>
              {p.description ? <div className="mt-2 text-sm text-neutral-700">{p.description}</div> : null}
            </div>
          ))}
          {products.length === 0 ? <div className="p-6 text-sm text-neutral-700">No products yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
