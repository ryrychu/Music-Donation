import { NextResponse } from "next/server";

import { getAccessByToken, markDownloaded } from "@/lib/access";
import { AlbumStorageError, createSignedAlbumDownloadUrl } from "@/lib/storage";

export const runtime = "nodejs";

type DownloadRouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(_request: Request, { params }: DownloadRouteContext) {
  const { token } = await params;
  const status = await getAccessByToken(token);

  if (status.state === "missing") {
    return NextResponse.json({ error: "Download link not found." }, { status: 404 });
  }

  if (status.state === "expired") {
    return NextResponse.json({ error: "Download link expired." }, { status: 410 });
  }

  let signed;

  try {
    signed = await createSignedAlbumDownloadUrl();
  } catch (error) {
    if (error instanceof AlbumStorageError && error.code === "object_not_found") {
      return NextResponse.json(
        {
          error: "Album ZIP not found in Supabase Storage. Check SUPABASE_STORAGE_BUCKET and SUPABASE_ALBUM_OBJECT_PATH.",
        },
        { status: 404 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Could not prepare the album download." }, { status: 500 });
  }

  await markDownloaded(status.access.id);

  return NextResponse.json(signed);
}
