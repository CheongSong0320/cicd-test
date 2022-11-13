/*
  Warnings:

  - Changed the type of `closedTime` on the `CommunityClubTimeLimit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `openTime` on the `CommunityClubTimeLimit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CommunityClubTimeLimit" DROP COLUMN "closedTime",
ADD COLUMN     "closedTime" INTEGER NOT NULL,
DROP COLUMN "openTime",
ADD COLUMN     "openTime" INTEGER NOT NULL;
