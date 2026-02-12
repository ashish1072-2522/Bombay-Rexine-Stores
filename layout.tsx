import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

export const metadata = { title: "Bombay Rexine Stores", description: "Car accessories store in India" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isAdmin = ((session as any)?.role ?? "USER") === "ADMIN";

  return (
    <html lang="en">
      <body>
        <NavBar isAdmin={isAdmin} />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t py-8">
          <div className="mx-auto max-w-6xl px-4 text-sm text-neutral-600">© {new Date().getFullYear()} Bombay Rexine Stores</div>
        </footer>
      </body>
    </html>
  );
}
