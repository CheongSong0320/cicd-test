/*
  Warnings:

  - Made the column `maxCount` on table `CommunityClubSeat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommunityClubSeat" ALTER COLUMN "maxCount" SET NOT NULL;
