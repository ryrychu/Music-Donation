import Stripe from "stripe";

import { requiredEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(requiredEnv("STRIPE_SECRET_KEY"));
  }

  return stripe;
}
