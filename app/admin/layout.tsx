import Link from "next/link";
import { requireAdmin } from "@/lib/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border p-4">
        <div className="font-semibold">Admin</div>
        <nav className="mt-3 space-y-1 text-sm">
          <Link className="block rounded-lg px-3 py-2 hover:bg-neutral-50" href="/admin">Dashboard</Link>
          <Link className="block rounded-lg px-3 py-2 hover:bg-neutral-50" href="/admin/products">Products</Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
