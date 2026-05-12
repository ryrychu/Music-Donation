import { describe, expect, it } from "vitest";

import { getAccessStatus, isPaidCheckoutSession } from "@/lib/access";

describe("getAccessStatus", () => {
  it("rejects missing access records", () => {
    expect(getAccessStatus(null).state).toBe("missing");
  });

  it("rejects expired access records", () => {
    const now = new Date("2026-01-01T12:00:00.000Z");
    expect(getAccessStatus({ expiresAt: new Date("2026-01-01T11:59:59.000Z") }, now).state).toBe("expired");
  });

  it("accepts unexpired access records", () => {
    const now = new Date("2026-01-01T12:00:00.000Z");
    expect(getAccessStatus({ expiresAt: new Date("2026-01-01T12:00:01.000Z") }, now).state).toBe("valid");
  });
});

describe("isPaidCheckoutSession", () => {
  it("only unlocks paid one-time checkout sessions", () => {
    expect(
      isPaidCheckoutSession({
        mode: "payment",
        payment_status: "paid",
        amount_total: 1500,
      } as never),
    ).toBe(true);

    expect(
      isPaidCheckoutSession({
        mode: "subscription",
        payment_status: "paid",
        amount_total: 1500,
      } as never),
    ).toBe(false);

    expect(
      isPaidCheckoutSession({
        mode: "payment",
        payment_status: "unpaid",
        amount_total: 1500,
      } as never),
    ).toBe(false);
  });
});
