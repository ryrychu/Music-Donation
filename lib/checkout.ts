import type Stripe from "stripe";

import { album } from "@/lib/album";
import { appUrl } from "@/lib/env";

export function buildCheckoutSessionParams(amountCents: number): Stripe.Checkout.SessionCreateParams {
  const baseUrl = appUrl();

  return {
    mode: "payment",
    submit_type: "donate",
    payment_method_types: ["card"],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?canceled=true`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `${album.artistName} - ${album.albumTitle}`,
            description: "Digital album unlock",
          },
        },
      },
    ],
    metadata: {
      albumTitle: album.albumTitle,
      artistName: album.artistName,
      donationAmountCents: String(amountCents),
    },
  };
}
