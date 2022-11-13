/*
  Warnings:

  - You are about to drop the column `apartment_id` on the `CommunityClub` table. All the data in the column will be lost.
  - You are about to drop the column `free_count_per_house` on the `CommunityClub` table. All the data in the column will be lost.
  - You are about to drop the column `is_wating` on the `CommunityClub` table. All the data in the column will be lost.
  - You are about to drop the column `max_count_per_house` on the `CommunityClub` table. All the data in the column will be lost.
  - You are about to drop the column `reset_cycle` on the `CommunityClub` table. All the data in the column will be lost.
  - You are about to drop the column `sign_off_on` on the `CommunityClub` table. All the data in the column will be lost.
  - You are about to drop the column `community_club_id` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `apartmentId` to the `CommunityClub` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isWating` to the `CommunityClub` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetCycle` to the `CommunityClub` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signOffOn` to the `CommunityClub` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityClubId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_community_club_id_fkey";

-- AlterTable
ALTER TABLE "CommunityClub" DROP COLUMN "apartment_id",
DROP COLUMN "free_count_per_house",
DROP COLUMN "is_wating",
DROP COLUMN "max_count_per_house",
DROP COLUMN "reset_cycle",
DROP COLUMN "sign_off_on",
ADD COLUMN     "apartmentId" INTEGER NOT NULL,
ADD COLUMN     "freeCountPerHouse" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isWating" BOOLEAN NOT NULL,
ADD COLUMN     "maxCountPerHouse" INTEGER,
ADD COLUMN     "resetCycle" "CommunityClubRestCycle" NOT NULL,
ADD COLUMN     "signOffOn" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "community_club_id",
DROP COLUMN "end_date",
DROP COLUMN "start_date",
DROP COLUMN "user_id",
ADD COLUMN     "communityClubId" INTEGER NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_communityClubId_fkey" FOREIGN KEY ("communityClubId") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
