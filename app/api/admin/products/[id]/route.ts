import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PatchBody = z.object({
  stock: z.number().int().min(0).optional(),
  pricePaise: z.number().int().min(0).optional(),
  description: z.string().optional()
});

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { ok: false as const, status: 401, message: "Please sign in." };
  if ((session as any).role !== "ADMIN") return { ok: false as const, status: 403, message: "Admin access required." };
  return { ok: true as const, email: session.user.email };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const a = await assertAdmin();
  if (!a.ok) return NextResponse.json({ message: a.message }, { status: a.status });

  const patch = PatchBody.parse(await req.json());
  const product = await prisma.product.update({ where: { id: params.id }, data: patch });
  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const a = await assertAdmin();
  if (!a.ok) return NextResponse.json({ message: a.message }, { status: a.status });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
