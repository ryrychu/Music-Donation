CREATE TABLE "Access" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "donationAmountCents" INTEGER NOT NULL,
  "stripeSessionId" TEXT NOT NULL,
  "stripePaymentIntentId" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "downloadedAt" TIMESTAMP(3),
  "downloadCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Access_token_key" ON "Access"("token");

CREATE UNIQUE INDEX "Access_stripeSessionId_key" ON "Access"("stripeSessionId");
