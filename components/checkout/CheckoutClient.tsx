"use client";
import { useState } from "react";

export function CheckoutClient({ method }: { method: "COD" | "RAZORPAY" }) {
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState<string|null>(null);

  async function placeOrder() {
    setBusy(true); setMsg(null);
    const res = await fetch("/api/checkout/create", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ method }) });
    const j = await res.json().catch(()=>({}));
    setBusy(false);
    if (!res.ok) return setMsg(j?.message ?? "Could not create order.");
    if (method === "COD") return (window.location.href = "/orders");
    setMsg("Razorpay order created. Connect Razorpay Checkout UI next.");
  }

  return (
    <div className="space-y-3">
      <button onClick={placeOrder} disabled={busy} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
        {busy ? "Processing..." : (method === "COD" ? "Place COD order" : "Pay with Razorpay")}
      </button>
      {msg ? <div className="text-sm text-neutral-700">{msg}</div> : null}
    </div>
  );
}
