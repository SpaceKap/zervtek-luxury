-- CreateTable
CREATE TABLE "FxRate" (
    "id" TEXT NOT NULL,
    "jpyPerUnit" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'frankfurter',
    "asOfDate" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FxRate_pkey" PRIMARY KEY ("id")
);
