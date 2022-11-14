/*
  Warnings:

  - Changed the type of `reservation_time_interval` on the `CommunityClubPerson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reservation_time_interval` on the `CommunityClubSeat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CommunityClubTimeInterval" AS ENUM ('YEAR', 'MONTH', 'DAY');

-- AlterTable
ALTER TABLE "CommunityClubPerson" DROP COLUMN "reservation_time_interval",
ADD COLUMN     "reservation_time_interval" "CommunityClubTimeInterval" NOT NULL;

-- AlterTable
ALTER TABLE "CommunityClubSeat" DROP COLUMN "reservation_time_interval",
ADD COLUMN     "reservation_time_interval" "CommunityClubTimeInterval" NOT NULL;
