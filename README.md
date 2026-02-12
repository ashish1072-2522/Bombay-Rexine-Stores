# Bombay Rexine Stores

Production-ready e-commerce starter:
- Search bar + dropdown navigation
- Products, categories, discounts, payments info
- Wishlist, cart, orders
- Admin inventory + product/category/discount management
- COD + Razorpay starter

## Quick start
1) docker compose up -d
2) npm install
3) cp .env.example .env
4) npx prisma generate
5) npx prisma migrate dev --name init
6) npm run db:seed
7) npm run dev

Seed logins:
- admin@bombayrexine.in / Admin@1234
- user@bombayrexine.in / User@1234
