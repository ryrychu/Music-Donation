# Music Donation MVP

A mobile-first Next.js App Router MVP for a pay-what-you-want digital album release. Fans preview tracks, choose a one-time donation, pay through Stripe Checkout test mode, and receive a token-protected download page plus a Resend confirmation email.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in Supabase, Stripe, and Resend settings.

3. Apply the Prisma schema to Supabase Postgres:

   ```bash
   npm run db:migrate
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

## Stripe Webhook

Create a webhook endpoint for:

```text
POST /api/stripe/webhook
```

Subscribe to `checkout.session.completed`. For local testing, forward events to `http://localhost:3000/api/stripe/webhook` and use the forwarded signing secret as `STRIPE_WEBHOOK_SECRET`.

## Supabase

Use Supabase for both the database and private album storage.

### Database

Set `DATABASE_URL` to the Supavisor transaction pooler connection string on port `6543`. Set `DIRECT_URL` to the session pooler or direct connection string for Prisma migrations.

### Storage

Create a private bucket, for example `album-downloads`, then upload the full album ZIP at the path configured by `SUPABASE_ALBUM_OBJECT_PATH`. The full album ZIP is never stored in `public/`. The app only creates a short-lived Supabase signed URL after a valid payment token check.

Use a Supabase secret key for `SUPABASE_SECRET_KEY`, and keep it server-side only. Do not prefix it with `NEXT_PUBLIC_`.

## Deploy To Vercel

Add the values from `.env.example` in Vercel Project Settings. For the build command, use:

```bash
npm run vercel-build
```

That command generates Prisma Client, applies committed migrations to Supabase Postgres, and builds the Next.js app.
