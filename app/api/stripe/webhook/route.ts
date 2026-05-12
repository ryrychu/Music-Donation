import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createAccessForCheckoutSession } from "@/lib/access";
import { requiredEnv } from "@/lib/env";
import { sendAccessEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event;

  try {
    event = getStripe().webhooks.constructEvent(payload, signature, requiredEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const access = await createAccessForCheckoutSession(session);
      await sendAccessEmail({
        email: access.email,
        token: access.token,
        donationAmountCents: access.donationAmountCents,
        expiresAt: access.expiresAt,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not create album access." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
