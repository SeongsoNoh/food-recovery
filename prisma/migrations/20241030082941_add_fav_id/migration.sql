/*
  Warnings:

  - The primary key for the `Fav` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Fav` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Fav_userId_productId_key";

-- AlterTable
ALTER TABLE "Fav" DROP CONSTRAINT "Fav_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Fav_pkey" PRIMARY KEY ("userId", "productId");
