# Music Donation MVP

A mobile-first Next.js App Router MVP for a pay-what-you-want digital album release. Fans preview tracks, choose a one-time donation, pay through Stripe Checkout test mode, and receive a token-protected download page plus a Resend confirmation email.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in Stripe, Resend, and private S3-compatible storage settings.

3. Create the local SQLite database:

   ```bash
   npm run db:push
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

## Storage

The full album ZIP is never stored in `public/`. Upload it to private S3-compatible storage and set `S3_ALBUM_OBJECT_KEY` to the object key. The app only returns a short-lived signed URL after a valid token check.
