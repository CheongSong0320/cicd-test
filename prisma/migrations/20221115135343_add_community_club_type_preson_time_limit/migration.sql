-- AlterEnum
ALTER TYPE "CommunityClubType" ADD VALUE 'PRESON_TIME_LIMIT';

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CommunityClubPersonTimeLimit" (
    "id" SERIAL NOT NULL,
    "maxCount" INTEGER NOT NULL,
    "reservationTimeInterval" INTEGER NOT NULL,
    "openTime" INTEGER NOT NULL,
    "closedTime" INTEGER NOT NULL,
    "maxTimeInterval" INTEGER NOT NULL,
    "communityClubId" INTEGER NOT NULL,

    CONSTRAINT "CommunityClubPersonTimeLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityClubPersonTimeLimit_communityClubId_key" ON "CommunityClubPersonTimeLimit"("communityClubId");

-- AddForeignKey
ALTER TABLE "CommunityClubPersonTimeLimit" ADD CONSTRAINT "CommunityClubPersonTimeLimit_communityClubId_fkey" FOREIGN KEY ("communityClubId") REFERENCES "CommunityClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
