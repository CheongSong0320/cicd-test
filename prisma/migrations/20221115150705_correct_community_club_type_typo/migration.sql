/*
  Warnings:

  - The values [PRESON_TIME_LIMIT] on the enum `CommunityClubType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommunityClubType_new" AS ENUM ('PERSON', 'PERSON_TIME_LIMIT', 'SEAT', 'SEAT_TIME_LMIT');
ALTER TABLE "CommunityClub" ALTER COLUMN "type" TYPE "CommunityClubType_new" USING ("type"::text::"CommunityClubType_new");
ALTER TYPE "CommunityClubType" RENAME TO "CommunityClubType_old";
ALTER TYPE "CommunityClubType_new" RENAME TO "CommunityClubType";
DROP TYPE "CommunityClubType_old";
COMMIT;
