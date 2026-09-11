-- Allow listings without a dealer price (inquire for price / POA).
ALTER TABLE "Vehicle" ALTER COLUMN "price" DROP NOT NULL;
