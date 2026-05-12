export function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function downloadTokenTtlHours(): number {
  return readPositiveInteger("DOWNLOAD_TOKEN_TTL_HOURS", 72);
}

export function signedDownloadTtlSeconds(): number {
  return readPositiveInteger("SIGNED_DOWNLOAD_TTL_SECONDS", 300);
}

export function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
