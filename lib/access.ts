import { randomBytes } from "crypto";
import type { Access } from "@prisma/client";
import type Stripe from "stripe";

import { downloadTokenTtlHours } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export type AccessStatus =
  | { state: "missing" }
  | { state: "expired"; access: AccessLike }
  | { state: "valid"; access: AccessLike };

export type AccessLike = {
  expiresAt: Date;
};

export function getAccessStatus<TAccess extends AccessLike>(
  access: TAccess | null,
  now = new Date(),
): AccessStatus & ({ access?: TAccess } | Record<string, never>) {
  if (!access) {
    return { state: "missing" };
  }

  if (access.expiresAt.getTime() <= now.getTime()) {
    return { state: "expired", access };
  }

  return { state: "valid", access };
}

export function isPaidCheckoutSession(session: Stripe.Checkout.Session): boolean {
  return session.mode === "payment" && session.payment_status === "paid" && typeof session.amount_total === "number";
}

export async function createAccessForCheckoutSession(session: Stripe.Checkout.Session): Promise<Access> {
  if (!isPaidCheckoutSession(session)) {
    throw new Error(`Checkout session ${session.id} is not a paid one-time payment.`);
  }

  const existing = await prisma.access.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (existing) {
    return existing;
  }

  const email = session.customer_details?.email || session.customer_email;
  if (!email) {
    throw new Error(`Checkout session ${session.id} does not include an email address.`);
  }

  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const expiresAt = new Date(Date.now() + downloadTokenTtlHours() * 60 * 60 * 1000);

  return prisma.access.create({
    data: {
      token: randomBytes(32).toString("base64url"),
      email,
      donationAmountCents: session.amount_total ?? 0,
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntent,
      expiresAt,
    },
  });
}

export async function getAccessByToken(token: string): Promise<AccessStatus & { access?: Access }> {
  const access = await prisma.access.findUnique({
    where: { token },
  });

  return getAccessStatus(access) as AccessStatus & { access?: Access };
}

export async function markDownloaded(id: string): Promise<void> {
  await prisma.access.update({
    where: { id },
    data: {
      downloadedAt: new Date(),
      downloadCount: {
        increment: 1,
      },
    },
  });
}
