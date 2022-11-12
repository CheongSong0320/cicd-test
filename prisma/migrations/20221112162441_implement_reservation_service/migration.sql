/*
  Warnings:

  - Added the required column `community_club_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'READY', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommunityClubTarget" AS ENUM ('ALL', 'INDIVIDUAL', 'HOUSE');

-- CreateEnum
CREATE TYPE "CommunityClubType" AS ENUM ('PERSON', 'SEAT', 'SEAT_TIME_LMIT');

-- CreateEnum
CREATE TYPE "CommunityClubRestCycle" AS ENUM ('YEAR', 'MONTH', 'DAY');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "community_club_id" INTEGER NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "ReservationStatus" NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CommunityClub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "target" "CommunityClubTarget" NOT NULL,
    "type" "CommunityClubType" NOT NULL,
    "free_count_per_house" INTEGER NOT NULL DEFAULT 0,
    "max_count_per_house" INTEGER,
    "reset_cycle" "CommunityClubRestCycle" NOT NULL,
    "sign_off_on" BOOLEAN NOT NULL,
    "is_wating" BOOLEAN NOT NULL,
    "memo" TEXT NOT NULL,
    "apartment_id" INTEGER NOT NULL,

    CONSTRAINT "CommunityClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityClubPerson" (
    "id" SERIAL NOT NULL,
    "max_count" INTEGER,
    "reservation_open_date" TIMESTAMP(3) NOT NULL,
    "reservation_time_interval" INTEGER NOT NULL,
    "community_club_id" INTEGER NOT NULL,

    CONSTRAINT "CommunityClubPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityClubSeat" (
    "id" SERIAL NOT NULL,
    "max_count" INTEGER,
    "reservation_open_date" TIMESTAMP(3) NOT NULL,
    "reservation_time_interval" INTEGER NOT NULL,
    "community_club_id" INTEGER NOT NULL,

    CONSTRAINT "CommunityClubSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityClubTimeLimit" (
    "id" SERIAL NOT NULL,
    "max_count" INTEGER,
    "reservation_time_interval" INTEGER NOT NULL,
    "open_time" TIMESTAMP(3) NOT NULL,
    "closed_time" TIMESTAMP(3) NOT NULL,
    "max_time_interval" INTEGER NOT NULL,
    "community_club_id" INTEGER NOT NULL,

    CONSTRAINT "CommunityClubTimeLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubPerson_community_club_id_key" ON "CommunityClubPerson"("community_club_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubSeat_community_club_id_key" ON "CommunityClubSeat"("community_club_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubTimeLimit_community_club_id_key" ON "CommunityClubTimeLimit"("community_club_id");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_community_club_id_fkey" FOREIGN KEY ("community_club_id") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityClubPerson" ADD CONSTRAINT "CommunityClubPerson_community_club_id_fkey" FOREIGN KEY ("community_club_id") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityClubSeat" ADD CONSTRAINT "CommunityClubSeat_community_club_id_fkey" FOREIGN KEY ("community_club_id") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityClubTimeLimit" ADD CONSTRAINT "CommunityClubTimeLimit_community_club_id_fkey" FOREIGN KEY ("community_club_id") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
