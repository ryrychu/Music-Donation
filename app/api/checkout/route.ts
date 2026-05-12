import { NextResponse } from "next/server";

import { buildCheckoutSessionParams } from "@/lib/checkout";
import { getStripe } from "@/lib/stripe";
import { validateDonationAmount } from "@/lib/donation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const amount = typeof body === "object" && body !== null && "amount" in body ? (body as { amount: unknown }).amount : undefined;
  const validation = validateDonationAmount(amount);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.create(buildCheckoutSessionParams(validation.cents));

  return NextResponse.json({ url: session.url });
}
