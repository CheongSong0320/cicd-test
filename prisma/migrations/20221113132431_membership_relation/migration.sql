/*
  Warnings:

  - Added the required column `communityClubId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "communityClubId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_communityClubId_fkey" FOREIGN KEY ("communityClubId") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
