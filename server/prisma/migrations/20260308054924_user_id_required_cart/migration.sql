/*
  Warnings:

  - Made the column `userid` on table `cart` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "userid" SET NOT NULL;
