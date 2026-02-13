import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

async function main() {
  const categories = ["Car Covers","Seat Covers","Floor Mats","Steering Covers","Car Perfumes","Phone Holders","Dash Cams","Wiper Blades"];
  const cat = {};
  for (const name of categories) {
    const c = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) }
    });
    cat[name] = c;
  }

  await prisma.user.upsert({
    where: { email: "admin@bombayrexine.in" },
    update: {},
    create: { email: "admin@bombayrexine.in", name: "Admin", role: "ADMIN", passwordHash: await bcrypt.hash("Admin@1234", 10) }
  });
  await prisma.user.upsert({
    where: { email: "user@bombayrexine.in" },
    update: {},
    create: { email: "user@bombayrexine.in", name: "Customer", role: "USER", passwordHash: await bcrypt.hash("User@1234", 10) }
  });

  const products = [
    { name:"Premium Seat Cover Set (Black)", category:"Seat Covers", description:"Comfort-fit seat cover set for Indian cars. Durable stitching, easy to clean.", pricePaise:399900, stock:25, images:["https://images.unsplash.com/photo-1511910849309-0dffb878d1c5?w=1200&q=80"] },
    { name:"All Weather Floor Mats", category:"Floor Mats", description:"Anti-skid, easy wash floor mats. Keeps cabin clean during monsoons.", pricePaise:189900, stock:40, images:["https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200&q=80"] },
    { name:"Compact Dash Cam (1080p)", category:"Dash Cams", description:"Wide-angle dash cam with loop recording. Reliable video for daily driving.", pricePaise:459900, stock:15, images:["https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80"] }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: { name:p.name, description:p.description, pricePaise:p.pricePaise, stock:p.stock, images:p.images, categoryId: cat[p.category].id },
      create: { name:p.name, slug: slugify(p.name), description:p.description, pricePaise:p.pricePaise, stock:p.stock, images:p.images, categoryId: cat[p.category].id }
    });
  }

  const seat = cat["Seat Covers"];
  await prisma.discount.upsert({
    where: { couponCode: "WELCOME10" },
    update: { active: true },
    create: { name:"Welcome 10% Off", type:"PERCENT", value:10, couponCode:"WELCOME10", categoryId: seat.id, active:true }
  });

  console.log("Seed done.");
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(async ()=>{ await prisma.$disconnect(); });
