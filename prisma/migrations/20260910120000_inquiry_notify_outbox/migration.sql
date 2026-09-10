-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyLastError" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyLastAttemptAt" TIMESTAMP(3);
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyNextRetryAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Inquiry_notifyStatus_notifyNextRetryAt_idx" ON "Inquiry"("notifyStatus", "notifyNextRetryAt");
