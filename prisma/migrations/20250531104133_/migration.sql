/*
  Warnings:

  - You are about to drop the column `dti_number` on the `MSME` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminSectors" DROP CONSTRAINT "AdminSectors_adminId_fkey";

-- AlterTable
ALTER TABLE "MSME" DROP COLUMN "dti_number";

-- AddForeignKey
ALTER TABLE "AdminSectors" ADD CONSTRAINT "AdminSectors_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
