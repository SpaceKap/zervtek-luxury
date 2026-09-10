-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "clientRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Inquiry_clientRequestId_key" ON "Inquiry"("clientRequestId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "VehicleSlugRedirect" (
    "id" TEXT NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleSlugRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "VehicleSlugRedirect_fromSlug_key" ON "VehicleSlugRedirect"("fromSlug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VehicleSlugRedirect_toSlug_idx" ON "VehicleSlugRedirect"("toSlug");
