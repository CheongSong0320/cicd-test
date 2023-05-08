-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "statusUpdateDate" DROP NOT NULL,
ALTER COLUMN "statusUpdateDate" DROP DEFAULT;
