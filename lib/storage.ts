import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { requiredEnv, signedDownloadTtlSeconds } from "@/lib/env";

let client: SupabaseClient | null = null;

export class AlbumStorageError extends Error {
  constructor(
    message: string,
    readonly code: "object_not_found" | "storage_error",
  ) {
    super(message);
    this.name = "AlbumStorageError";
  }
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!client) {
    client = createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SECRET_KEY"), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}

export async function createSignedAlbumDownloadUrl(): Promise<{ url: string; expiresInSeconds: number }> {
  const expiresInSeconds = signedDownloadTtlSeconds();
  const { data, error } = await getSupabaseAdminClient()
    .storage
    .from(requiredEnv("SUPABASE_STORAGE_BUCKET"))
    .createSignedUrl(requiredEnv("SUPABASE_ALBUM_OBJECT_PATH"), expiresInSeconds, {
      download: "night-signal.zip",
    });

  if (error || !data?.signedUrl) {
    const message = error?.message || "Could not create a signed Supabase Storage URL.";
    const code = message.toLowerCase().includes("object not found") ? "object_not_found" : "storage_error";
    throw new AlbumStorageError(message, code);
  }

  return { url: data.signedUrl, expiresInSeconds };
}
