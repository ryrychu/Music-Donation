import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { requiredEnv, signedDownloadTtlSeconds } from "@/lib/env";

let client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: requiredEnv("S3_REGION"),
      endpoint: requiredEnv("S3_ENDPOINT"),
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
        secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY"),
      },
    });
  }

  return client;
}

export async function createSignedAlbumDownloadUrl(): Promise<{ url: string; expiresInSeconds: number }> {
  const expiresInSeconds = signedDownloadTtlSeconds();
  const command = new GetObjectCommand({
    Bucket: requiredEnv("S3_BUCKET_NAME"),
    Key: requiredEnv("S3_ALBUM_OBJECT_KEY"),
    ResponseContentDisposition: 'attachment; filename="night-signal.zip"',
  });

  const url = await getSignedUrl(getS3Client(), command, {
    expiresIn: expiresInSeconds,
  });

  return { url, expiresInSeconds };
}
