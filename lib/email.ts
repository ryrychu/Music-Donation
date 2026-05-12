import { Resend } from "resend";

import { album } from "@/lib/album";
import { appUrl } from "@/lib/env";
import { formatCurrency } from "@/lib/donation";

type AccessEmailInput = {
  email: string;
  token: string;
  donationAmountCents: number;
  expiresAt: Date;
};

let resend: Resend | null = null;

export function accessUrl(token: string): string {
  return `${appUrl()}/download/${encodeURIComponent(token)}`;
}

export function buildAccessEmail(input: AccessEmailInput) {
  const url = accessUrl(input.token);
  const donation = formatCurrency(input.donationAmountCents);
  const expiry = input.expiresAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  return {
    to: input.email,
    subject: `Your ${album.albumTitle} download is ready`,
    text: [
      `Thanks for supporting ${album.artistName} with ${donation}.`,
      "",
      `Your private download page is ready: ${url}`,
      "",
      `This access link expires on ${expiry} UTC.`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1b1b1f">
        <h1 style="font-size:24px">${album.albumTitle} is ready</h1>
        <p>Thanks for supporting ${album.artistName} with <strong>${donation}</strong>.</p>
        <p><a href="${url}" style="background:#111827;color:#ffffff;padding:12px 18px;border-radius:6px;text-decoration:none">Open download page</a></p>
        <p>This access link expires on ${expiry} UTC.</p>
      </div>
    `,
  };
}

export async function sendAccessEmail(input: AccessEmailInput): Promise<{ skipped: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("Skipping Resend email because RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.");
    return { skipped: true };
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  const email = buildAccessEmail(input);
  await resend.emails.send({
    from,
    ...email,
  });

  return { skipped: false };
}
