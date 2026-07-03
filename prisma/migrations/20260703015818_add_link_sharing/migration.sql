-- CreateEnum
CREATE TYPE "ShareInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('VIEW', 'EDIT', 'MANAGE');

-- CreateTable
CREATE TABLE "ShareInvitation" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" "ShareInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "ShareInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareInvitationLink" (
    "id" SERIAL NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "linkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareInvitationLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedLink" (
    "id" SERIAL NOT NULL,
    "invitationId" INTEGER,
    "linkId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "permission" "SharePermission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShareInvitation_ownerId_idx" ON "ShareInvitation"("ownerId");

-- CreateIndex
CREATE INDEX "ShareInvitation_receiverId_idx" ON "ShareInvitation"("receiverId");

-- CreateIndex
CREATE INDEX "ShareInvitation_status_idx" ON "ShareInvitation"("status");

-- CreateIndex
CREATE INDEX "ShareInvitation_receiverId_status_idx" ON "ShareInvitation"("receiverId", "status");

-- CreateIndex
CREATE INDEX "ShareInvitation_ownerId_receiverId_idx" ON "ShareInvitation"("ownerId", "receiverId");

-- CreateIndex
CREATE INDEX "ShareInvitationLink_invitationId_idx" ON "ShareInvitationLink"("invitationId");

-- CreateIndex
CREATE INDEX "ShareInvitationLink_linkId_idx" ON "ShareInvitationLink"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "ShareInvitationLink_invitationId_linkId_key" ON "ShareInvitationLink"("invitationId", "linkId");

-- CreateIndex
CREATE INDEX "SharedLink_receiverId_idx" ON "SharedLink"("receiverId");

-- CreateIndex
CREATE INDEX "SharedLink_linkId_idx" ON "SharedLink"("linkId");

-- CreateIndex
CREATE INDEX "SharedLink_invitationId_idx" ON "SharedLink"("invitationId");

-- CreateIndex
CREATE INDEX "SharedLink_receiverId_permission_idx" ON "SharedLink"("receiverId", "permission");

-- CreateIndex
CREATE INDEX "SharedLink_receiverId_createdAt_idx" ON "SharedLink"("receiverId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SharedLink_linkId_receiverId_key" ON "SharedLink"("linkId", "receiverId");

-- AddForeignKey
ALTER TABLE "ShareInvitation" ADD CONSTRAINT "ShareInvitation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareInvitation" ADD CONSTRAINT "ShareInvitation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareInvitationLink" ADD CONSTRAINT "ShareInvitationLink_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "ShareInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareInvitationLink" ADD CONSTRAINT "ShareInvitationLink_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedLink" ADD CONSTRAINT "SharedLink_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedLink" ADD CONSTRAINT "SharedLink_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
