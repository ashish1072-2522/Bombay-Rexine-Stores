import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("UNAUTHENTICATED");
  if ((session as any).role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}
