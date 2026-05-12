import Link from "next/link";
import { AlertTriangle, Clock, Disc3 } from "lucide-react";

import { DownloadButton } from "@/components/DownloadButton";
import { album } from "@/lib/album";
import { formatCurrency } from "@/lib/donation";
import { getAccessByToken } from "@/lib/access";

export const dynamic = "force-dynamic";

type DownloadPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params;
  const status = await getAccessByToken(token);

  if (status.state === "missing") {
    return <UnavailablePanel title="Link not found" message="This download link does not match an active album unlock." />;
  }

  if (status.state === "expired") {
    return <UnavailablePanel title="Link expired" message="This private download link has expired." />;
  }

  const access = status.access;

  return (
    <main className="page-center">
      <section className="status-panel">
        <p className="eyebrow">
          <Disc3 size={16} aria-hidden="true" /> Private Download
        </p>
        <h1>{album.albumTitle}</h1>
        <p>
          Unlocked for {access.email} with a {formatCurrency(access.donationAmountCents)} donation. This page can create a short-lived ZIP download link until{" "}
          {access.expiresAt.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          .
        </p>
        <div className="status-actions">
          <DownloadButton token={token} />
          <Link className="secondary-button" href="/">
            Back to Album
          </Link>
        </div>
      </section>
    </main>
  );
}

function UnavailablePanel({ title, message }: { title: string; message: string }) {
  return (
    <main className="page-center">
      <section className="status-panel">
        <p className="eyebrow">
          {title === "Link expired" ? <Clock size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />} Access
        </p>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="status-actions">
          <Link className="secondary-button" href="/">
            Return to album
          </Link>
        </div>
      </section>
    </main>
  );
}
