/*
  Warnings:

  - Made the column `dong` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ho` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "dong" SET NOT NULL,
ALTER COLUMN "ho" SET NOT NULL;
