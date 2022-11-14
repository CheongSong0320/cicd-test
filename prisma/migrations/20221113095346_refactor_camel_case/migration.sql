/*
  Warnings:

  - You are about to drop the column `community_club_id` on the `CommunityClubPerson` table. All the data in the column will be lost.
  - You are about to drop the column `max_count` on the `CommunityClubPerson` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_open_date` on the `CommunityClubPerson` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_time_interval` on the `CommunityClubPerson` table. All the data in the column will be lost.
  - You are about to drop the column `community_club_id` on the `CommunityClubSeat` table. All the data in the column will be lost.
  - You are about to drop the column `max_count` on the `CommunityClubSeat` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_open_date` on the `CommunityClubSeat` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_time_interval` on the `CommunityClubSeat` table. All the data in the column will be lost.
  - You are about to drop the column `closed_time` on the `CommunityClubTimeLimit` table. All the data in the column will be lost.
  - You are about to drop the column `community_club_id` on the `CommunityClubTimeLimit` table. All the data in the column will be lost.
  - You are about to drop the column `max_count` on the `CommunityClubTimeLimit` table. All the data in the column will be lost.
  - You are about to drop the column `max_time_interval` on the `CommunityClubTimeLimit` table. All the data in the column will be lost.
  - You are about to drop the column `open_time` on the `CommunityClubTimeLimit` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_time_interval` on the `CommunityClubTimeLimit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[communityClubId]` on the table `CommunityClubPerson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[communityClubId]` on the table `CommunityClubSeat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[communityClubId]` on the table `CommunityClubTimeLimit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `communityClubId` to the `CommunityClubPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationOpenDate` to the `CommunityClubPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationTimeInterval` to the `CommunityClubPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityClubId` to the `CommunityClubSeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationOpenDate` to the `CommunityClubSeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationTimeInterval` to the `CommunityClubSeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closedTime` to the `CommunityClubTimeLimit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communityClubId` to the `CommunityClubTimeLimit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTimeInterval` to the `CommunityClubTimeLimit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `CommunityClubTimeLimit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationTimeInterval` to the `CommunityClubTimeLimit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommunityClubPerson" DROP CONSTRAINT "CommunityClubPerson_community_club_id_fkey";

-- DropForeignKey
ALTER TABLE "CommunityClubSeat" DROP CONSTRAINT "CommunityClubSeat_community_club_id_fkey";

-- DropForeignKey
ALTER TABLE "CommunityClubTimeLimit" DROP CONSTRAINT "CommunityClubTimeLimit_community_club_id_fkey";

-- DropIndex
DROP INDEX "CommunityClubPerson_community_club_id_key";

-- DropIndex
DROP INDEX "CommunityClubSeat_community_club_id_key";

-- DropIndex
DROP INDEX "CommunityClubTimeLimit_community_club_id_key";

-- AlterTable
ALTER TABLE "CommunityClubPerson" DROP COLUMN "community_club_id",
DROP COLUMN "max_count",
DROP COLUMN "reservation_open_date",
DROP COLUMN "reservation_time_interval",
ADD COLUMN     "communityClubId" INTEGER NOT NULL,
ADD COLUMN     "maxCount" INTEGER,
ADD COLUMN     "reservationOpenDate" INTEGER NOT NULL,
ADD COLUMN     "reservationTimeInterval" "CommunityClubTimeInterval" NOT NULL;

-- AlterTable
ALTER TABLE "CommunityClubSeat" DROP COLUMN "community_club_id",
DROP COLUMN "max_count",
DROP COLUMN "reservation_open_date",
DROP COLUMN "reservation_time_interval",
ADD COLUMN     "communityClubId" INTEGER NOT NULL,
ADD COLUMN     "maxCount" INTEGER,
ADD COLUMN     "reservationOpenDate" INTEGER NOT NULL,
ADD COLUMN     "reservationTimeInterval" "CommunityClubTimeInterval" NOT NULL;

-- AlterTable
ALTER TABLE "CommunityClubTimeLimit" DROP COLUMN "closed_time",
DROP COLUMN "community_club_id",
DROP COLUMN "max_count",
DROP COLUMN "max_time_interval",
DROP COLUMN "open_time",
DROP COLUMN "reservation_time_interval",
ADD COLUMN     "closedTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "communityClubId" INTEGER NOT NULL,
ADD COLUMN     "maxCount" INTEGER,
ADD COLUMN     "maxTimeInterval" INTEGER NOT NULL,
ADD COLUMN     "openTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reservationTimeInterval" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubPerson_communityClubId_key" ON "CommunityClubPerson"("communityClubId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubSeat_communityClubId_key" ON "CommunityClubSeat"("communityClubId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubTimeLimit_communityClubId_key" ON "CommunityClubTimeLimit"("communityClubId");

-- AddForeignKey
ALTER TABLE "CommunityClubPerson" ADD CONSTRAINT "CommunityClubPerson_communityClubId_fkey" FOREIGN KEY ("communityClubId") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityClubSeat" ADD CONSTRAINT "CommunityClubSeat_communityClubId_fkey" FOREIGN KEY ("communityClubId") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityClubTimeLimit" ADD CONSTRAINT "CommunityClubTimeLimit_communityClubId_fkey" FOREIGN KEY ("communityClubId") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
