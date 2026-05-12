import { NextResponse } from "next/server";

import { getAccessByToken, markDownloaded } from "@/lib/access";
import { createSignedAlbumDownloadUrl } from "@/lib/storage";

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

  const signed = await createSignedAlbumDownloadUrl();
  await markDownloaded(status.access.id);

  return NextResponse.json(signed);
}
