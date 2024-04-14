/*
  Warnings:

  - You are about to drop the column `country` on the `OrderAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `OrderAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryId` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "isPaid" SET DEFAULT false;

-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "country",
ADD COLUMN     "countryId" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ALTER COLUMN "address2" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderAddress_orderId_key" ON "OrderAddress"("orderId");

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
