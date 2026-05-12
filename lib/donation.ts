export const MIN_DONATION_CENTS = 100;
export const MAX_DONATION_CENTS = 100_000;
export const DEFAULT_DONATION_CENTS = 1_500;

export type DonationValidationResult =
  | { ok: true; cents: number; dollars: string }
  | { ok: false; error: string };

export function validateDonationAmount(input: unknown): DonationValidationResult {
  if (typeof input !== "string" && typeof input !== "number") {
    return { ok: false, error: "Enter a donation amount." };
  }

  const raw = String(input).trim();
  if (!raw) {
    return { ok: false, error: "Enter a donation amount." };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
    return { ok: false, error: "Use dollars and cents only." };
  }

  const [whole, decimal = ""] = raw.split(".");
  const cents = Number.parseInt(whole, 10) * 100 + Number.parseInt(decimal.padEnd(2, "0") || "0", 10);

  if (!Number.isSafeInteger(cents)) {
    return { ok: false, error: "Enter a valid donation amount." };
  }

  if (cents < MIN_DONATION_CENTS) {
    return { ok: false, error: "The minimum donation is $1." };
  }

  if (cents > MAX_DONATION_CENTS) {
    return { ok: false, error: "The maximum donation is $1,000." };
  }

  return { ok: true, cents, dollars: formatDollars(cents) };
}

export function formatDollars(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrency(cents: number): string {
  return `$${formatDollars(cents)}`;
}
