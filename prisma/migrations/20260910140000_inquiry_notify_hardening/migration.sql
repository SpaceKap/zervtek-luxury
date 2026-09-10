-- Prevent historical leads (pre-outbox) from being treated as undelivered.
UPDATE "Inquiry"
SET "notifyStatus" = 'SENT'
WHERE "notifyStatus" = 'PENDING'
  AND "notifyAttempts" = 0;

-- Per-channel delivery tracking
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyEmailStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyWebhookStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- Soft lock for atomic claim
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyLockedUntil" TIMESTAMP(3);

-- Full notification payload snapshot for retries
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "notifyPayload" JSONB;

-- Align channel status with overall for rows already closed out
UPDATE "Inquiry"
SET
  "notifyEmailStatus" = CASE
    WHEN "notifyStatus" IN ('SENT', 'SKIPPED') THEN "notifyStatus"
    WHEN "notifyStatus" = 'FAILED' THEN 'FAILED'
    ELSE "notifyEmailStatus"
  END,
  "notifyWebhookStatus" = CASE
    WHEN "notifyStatus" IN ('SENT', 'SKIPPED') THEN "notifyStatus"
    WHEN "notifyStatus" = 'FAILED' THEN 'FAILED'
    ELSE "notifyWebhookStatus"
  END
WHERE "notifyStatus" IN ('SENT', 'SKIPPED', 'FAILED');
