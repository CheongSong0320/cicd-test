/*
  Warnings:

  - Changed the type of `reservation_open_date` on the `CommunityClubPerson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reservation_open_date` on the `CommunityClubSeat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CommunityClubPerson" DROP COLUMN "reservation_open_date",
ADD COLUMN     "reservation_open_date" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CommunityClubSeat" DROP COLUMN "reservation_open_date",
ADD COLUMN     "reservation_open_date" INTEGER NOT NULL;
