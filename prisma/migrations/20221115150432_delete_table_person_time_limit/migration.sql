/*
  Warnings:

  - You are about to drop the `CommunityClubPersonTimeLimit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityClubPersonTimeLimit" DROP CONSTRAINT "CommunityClubPersonTimeLimit_communityClubId_fkey";

-- DropTable
DROP TABLE "CommunityClubPersonTimeLimit";
