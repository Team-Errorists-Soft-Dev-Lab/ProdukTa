/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Visitor` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Visitor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip,msmeId]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastVisited` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `msmeId` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Visitor_ip_key";

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "createdAt",
DROP COLUMN "userAgent",
ADD COLUMN     "lastVisited" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "msmeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ExportLog" (
    "id" SERIAL NOT NULL,
    "msmeId" INTEGER NOT NULL,
    "exportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_ip_msmeId_key" ON "Visitor"("ip", "msmeId");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_msmeId_fkey" FOREIGN KEY ("msmeId") REFERENCES "MSME"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportLog" ADD CONSTRAINT "ExportLog_msmeId_fkey" FOREIGN KEY ("msmeId") REFERENCES "MSME"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
