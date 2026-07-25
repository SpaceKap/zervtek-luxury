-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT,
    "year" INTEGER NOT NULL,
    "registrationMonth" INTEGER,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "transmission" TEXT,
    "fuelType" TEXT,
    "drivetrain" TEXT,
    "steering" TEXT,
    "bodyType" TEXT,
    "engineCc" INTEGER,
    "exteriorColor" TEXT,
    "interiorColor" TEXT,
    "location" TEXT,
    "vin" TEXT,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "images" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "statusBeforeUnavailable" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdByType" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdByName" TEXT,
    "sourceType" TEXT,
    "sourceListingId" TEXT,
    "sourceUrl" TEXT,
    "idempotencyKey" TEXT,
    "lastAvailabilityCheckAt" TIMESTAMP(3),
    "lastAvailabilityResult" TEXT,
    "consecutiveUnavailableChecks" INTEGER NOT NULL DEFAULT 0,
    "availabilityCheckLocked" BOOLEAN NOT NULL DEFAULT false,
    "availabilityEvidence" TEXT,
    "availabilityHttpStatus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleImage" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "sha256" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "originalPath" TEXT NOT NULL,
    "largePath" TEXT NOT NULL,
    "mediumPath" TEXT NOT NULL,
    "thumbnailPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityCheck" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "httpStatus" INTEGER,
    "evidence" TEXT,
    "errorMessage" TEXT,
    "checkedBy" TEXT NOT NULL,

    CONSTRAINT "AvailabilityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "message" TEXT,
    "vehicleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HermesAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "vehicleId" TEXT,
    "ip" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HermesAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_idempotencyKey_key" ON "Vehicle"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Vehicle_make_idx" ON "Vehicle"("make");

-- CreateIndex
CREATE INDEX "Vehicle_bodyType_idx" ON "Vehicle"("bodyType");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");

-- CreateIndex
CREATE INDEX "Vehicle_featured_idx" ON "Vehicle"("featured");

-- CreateIndex
CREATE INDEX "Vehicle_createdByType_idx" ON "Vehicle"("createdByType");

-- CreateIndex
CREATE INDEX "Vehicle_lastAvailabilityCheckAt_idx" ON "Vehicle"("lastAvailabilityCheckAt");

-- CreateIndex
CREATE INDEX "VehicleImage_vehicleId_sortOrder_idx" ON "VehicleImage"("vehicleId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleImage_vehicleId_sha256_key" ON "VehicleImage"("vehicleId", "sha256");

-- CreateIndex
CREATE INDEX "AvailabilityCheck_vehicleId_checkedAt_idx" ON "AvailabilityCheck"("vehicleId", "checkedAt");

-- CreateIndex
CREATE INDEX "HermesAuditLog_createdAt_idx" ON "HermesAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "HermesAuditLog_action_idx" ON "HermesAuditLog"("action");

-- AddForeignKey
ALTER TABLE "VehicleImage" ADD CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityCheck" ADD CONSTRAINT "AvailabilityCheck_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

