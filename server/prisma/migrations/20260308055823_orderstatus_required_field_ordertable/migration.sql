/*
  Warnings:

  - Made the column `orderstatus` on table `ordertable` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ordertable" ALTER COLUMN "orderstatus" SET NOT NULL;
