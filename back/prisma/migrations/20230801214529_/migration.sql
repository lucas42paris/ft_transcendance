/*
  Warnings:

  - You are about to drop the column `Muted` on the `ChannelToUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChannelToUser" DROP COLUMN "Muted",
ADD COLUMN     "muted" BOOLEAN NOT NULL DEFAULT false;
