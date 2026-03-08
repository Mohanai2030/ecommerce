/*
  Warnings:

  - Made the column `userid` on table `ordertable` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ordertable" ALTER COLUMN "userid" SET NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "price" REAL NOT NULL;
