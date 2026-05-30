# Sellio — Built for sellers, powered by AI

AI-powered workflow automation for E-commerce & Retail store owners (Shopify, WooCommerce).

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL (Supabase)
- **Auth**: NextAuth.js (Google + Email magic link)
- **Payments**: Razorpay
- **AI**: OpenAI GPT-4o
- **Email**: Resend
- **Deployment**: Vercel

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `NEXTAUTH_SECRET` | Random secret — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL (https://sellio.io in prod) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `OPENAI_API_KEY` | From platform.openai.com |
| `RAZORPAY_KEY_ID` | From Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Set in Razorpay webhook settings |
| `RAZORPAY_STARTER_PLAN_ID` | Create plan in Razorpay Dashboard |
| `RAZORPAY_GROWTH_PLAN_ID` | Create plan in Razorpay Dashboard |
| `RAZORPAY_PRO_PLAN_ID` | Create plan in Razorpay Dashboard |
| `RESEND_API_KEY` | From resend.com |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

## Vercel Deployment

1. Push to GitHub
2. Import repo at vercel.com/new
3. Add all environment variables in Vercel project settings
4. Deploy — Vercel Cron runs automations every hour automatically

## Features
- 6 automation types: Abandoned Cart, Low Stock Alert, Weekly Report, Auto Reply, Order Follow-up, Review Request
- AI-powered reports via GPT-4o
- Razorpay subscription billing (Starter ₹2,499 · Growth ₹6,499 · Pro ₹16,499/mo)
- Google OAuth + Email magic link auth
- Full dashboard with analytics, stores, reports, billing

© 2025 Sellio. All rights reserved.
