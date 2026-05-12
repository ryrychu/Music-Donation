import { describe, expect, it, vi } from "vitest";

import { buildCheckoutSessionParams } from "@/lib/checkout";

describe("buildCheckoutSessionParams", () => {
  it("creates a one-time Stripe Checkout donation session for the selected amount", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://music.example");

    const params = buildCheckoutSessionParams(2500);

    expect(params.mode).toBe("payment");
    expect(params.submit_type).toBe("donate");
    expect(params.success_url).toBe("https://music.example/success?session_id={CHECKOUT_SESSION_ID}");
    expect(params.cancel_url).toBe("https://music.example/?canceled=true");
    expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(2500);
    expect(params.line_items?.[0]?.price_data?.currency).toBe("usd");
    expect(params.metadata?.donationAmountCents).toBe("2500");

    vi.unstubAllEnvs();
  });
});
