/*
  Warnings:

  - Added the required column `latitude` to the `MSME` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `MSME` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MSME" ADD COLUMN     "facebookPage" TEXT,
ADD COLUMN     "instagramPage" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "majorProductLines" TEXT[],
ADD COLUMN     "productGallery" TEXT[];

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_ip_key" ON "Visitor"("ip");
