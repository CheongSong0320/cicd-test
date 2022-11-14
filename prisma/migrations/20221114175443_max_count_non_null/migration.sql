/*
  Warnings:

  - Made the column `maxCount` on table `CommunityClubPerson` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxCount` on table `CommunityClubTimeLimit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommunityClubPerson" ALTER COLUMN "maxCount" SET NOT NULL;

-- AlterTable
ALTER TABLE "CommunityClubTimeLimit" ALTER COLUMN "maxCount" SET NOT NULL;
