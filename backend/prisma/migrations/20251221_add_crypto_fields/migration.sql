-- AlterTable
ALTER TABLE "Order" ADD COLUMN "cryptoAmount" DOUBLE PRECISION,
ADD COLUMN "cryptoExchangeRate" DOUBLE PRECISION,
ADD COLUMN "cryptoVerifiedAt" TIMESTAMP(3),
ADD COLUMN "cryptoConfirmations" INTEGER;
