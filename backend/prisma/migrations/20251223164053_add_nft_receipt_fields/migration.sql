/*
  Warnings:

  - A unique constraint covering the columns `[nftTokenId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "nftMetadata" JSONB,
ADD COLUMN     "nftMetadataUrl" TEXT,
ADD COLUMN     "nftMintTxHash" TEXT,
ADD COLUMN     "nftMintedAt" TIMESTAMP(3),
ADD COLUMN     "nftTokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_nftTokenId_key" ON "public"."Order"("nftTokenId");

-- CreateIndex
CREATE INDEX "Order_nftTokenId_idx" ON "public"."Order"("nftTokenId");
