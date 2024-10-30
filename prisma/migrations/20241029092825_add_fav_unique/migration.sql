/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `Fav` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fav_userId_productId_key" ON "Fav"("userId", "productId");
