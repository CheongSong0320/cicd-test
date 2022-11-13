-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "membershipId" INTEGER;

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
