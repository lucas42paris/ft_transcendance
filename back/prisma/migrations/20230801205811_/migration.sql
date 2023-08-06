/*
  Warnings:

  - You are about to drop the `ChannelToBanned` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelToMuted` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Muted` to the `ChannelToUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banned` to the `ChannelToUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `ChannelToUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChannelToBanned" DROP CONSTRAINT "ChannelToBanned_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelToBanned" DROP CONSTRAINT "ChannelToBanned_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelToMuted" DROP CONSTRAINT "ChannelToMuted_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelToMuted" DROP CONSTRAINT "ChannelToMuted_userId_fkey";

-- AlterTable
ALTER TABLE "ChannelToUser" ADD COLUMN     "Muted" BOOLEAN NOT NULL,
ADD COLUMN     "banned" BOOLEAN NOT NULL,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "ChannelToBanned";

-- DropTable
DROP TABLE "ChannelToMuted";
