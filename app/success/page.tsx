import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

import { album } from "@/lib/album";
import { formatCurrency } from "@/lib/donation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <main className="page-center">
        <section className="status-panel">
          <h1>Payment status</h1>
          <p>No Stripe Checkout session was found on this page.</p>
          <div className="status-actions">
            <Link className="secondary-button" href="/">
              Return to album
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const access = await prisma.access.findUnique({
    where: { stripeSessionId: sessionId },
  });

  return (
    <main className="page-center">
      <section className="status-panel">
        {access ? (
          <>
            <p className="eyebrow">
              <CheckCircle2 size={16} aria-hidden="true" /> Unlocked
            </p>
            <h1>{album.albumTitle}</h1>
            <p>
              Your {formatCurrency(access.donationAmountCents)} donation is confirmed. The private download page is ready, and a backup link has been sent to {access.email}.
            </p>
            <div className="status-actions">
              <Link className="primary-button" href={`/download/${access.token}`}>
                Open Download Page
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">
              <Clock size={16} aria-hidden="true" /> Confirming
            </p>
            <h1>Payment received</h1>
            <p>Stripe is still delivering the verified payment event. Refresh in a moment and the download link will appear here.</p>
            <div className="status-actions">
              <Link className="primary-button" href={`/success?session_id=${encodeURIComponent(sessionId)}`}>
                Refresh Status
              </Link>
              <Link className="secondary-button" href="/">
                Return to album
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
