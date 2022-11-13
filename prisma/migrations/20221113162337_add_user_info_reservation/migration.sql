-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('HOUSEHOLDER', 'MEMBER', 'ETC');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "userName" TEXT,
ADD COLUMN     "userPhone" TEXT,
ADD COLUMN     "userType" "UserType";
