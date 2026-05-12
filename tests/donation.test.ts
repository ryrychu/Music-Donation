import { describe, expect, it } from "vitest";

import { validateDonationAmount } from "@/lib/donation";

describe("validateDonationAmount", () => {
  it("accepts whole dollars and cents inside the allowed range", () => {
    expect(validateDonationAmount("1")).toMatchObject({ ok: true, cents: 100 });
    expect(validateDonationAmount("15.50")).toMatchObject({ ok: true, cents: 1550 });
    expect(validateDonationAmount(1000)).toMatchObject({ ok: true, cents: 100000 });
  });

  it("rejects empty and malformed input", () => {
    expect(validateDonationAmount("")).toMatchObject({ ok: false });
    expect(validateDonationAmount("abc")).toMatchObject({ ok: false });
    expect(validateDonationAmount("12.345")).toMatchObject({ ok: false });
  });

  it("rejects amounts below one dollar", () => {
    expect(validateDonationAmount("0.99")).toMatchObject({ ok: false, error: "The minimum donation is $1." });
  });

  it("rejects amounts above one thousand dollars", () => {
    expect(validateDonationAmount("1000.01")).toMatchObject({ ok: false, error: "The maximum donation is $1,000." });
  });
});
