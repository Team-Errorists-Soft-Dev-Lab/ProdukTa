/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "isPending" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Post";
