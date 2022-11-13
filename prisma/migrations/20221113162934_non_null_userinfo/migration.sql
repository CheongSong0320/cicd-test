/*
  Warnings:

  - Made the column `userName` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userPhone` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userType` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "userName" SET NOT NULL,
ALTER COLUMN "userPhone" SET NOT NULL,
ALTER COLUMN "userType" SET NOT NULL;
