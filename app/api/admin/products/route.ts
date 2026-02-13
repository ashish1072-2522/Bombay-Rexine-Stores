import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateBody = z.object({
  name: z.string().min(3),
  description: z.string().min(0).default(""),
  pricePaise: z.number().int().min(0),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).optional()
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { ok: false as const, status: 401, message: "Please sign in." };
  if ((session as any).role !== "ADMIN") return { ok: false as const, status: 403, message: "Admin access required." };
  return { ok: true as const, email: session.user.email };
}

export async function GET() {
  const a = await assertAdmin();
  if (!a.ok) return NextResponse.json({ message: a.message }, { status: a.status });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { category: { select: { name: true } } } });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const a = await assertAdmin();
  if (!a.ok) return NextResponse.json({ message: a.message }, { status: a.status });

  const body = CreateBody.parse(await req.json());
  const slug = slugify(body.name);

  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ message: "A product with a similar name already exists." }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description ?? "",
      pricePaise: body.pricePaise,
      stock: body.stock,
      images: body.images ?? [],
      categoryId: body.categoryId
    }
  });

  return NextResponse.json({ product });
}
