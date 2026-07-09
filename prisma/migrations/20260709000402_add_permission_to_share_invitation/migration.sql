/*
  Warnings:

  - Added the required column `permission` to the `ShareInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShareInvitation" ADD COLUMN     "permission" "SharePermission" NOT NULL;
