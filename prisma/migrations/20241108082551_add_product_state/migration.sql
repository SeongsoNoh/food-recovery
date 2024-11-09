/*
  Warnings:

  - Added the required column `saleId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "buyerId" INTEGER,
ADD COLUMN     "state" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "saleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "purchaseId" INTEGER NOT NULL;
