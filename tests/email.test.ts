import { describe, expect, it, vi } from "vitest";

import { accessUrl, buildAccessEmail } from "@/lib/email";

describe("access email", () => {
  it("builds the secure download URL from the token", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://music.example");

    expect(accessUrl("tok_123")).toBe("https://music.example/download/tok_123");

    vi.unstubAllEnvs();
  });

  it("includes the private download link in text and html payloads", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://music.example");

    const email = buildAccessEmail({
      email: "fan@example.com",
      token: "tok_456",
      donationAmountCents: 2200,
      expiresAt: new Date("2026-01-02T12:00:00.000Z"),
    });

    expect(email.to).toBe("fan@example.com");
    expect(email.subject).toContain("download is ready");
    expect(email.text).toContain("https://music.example/download/tok_456");
    expect(email.html).toContain("https://music.example/download/tok_456");
    expect(email.text).toContain("$22.00");

    vi.unstubAllEnvs();
  });
});
