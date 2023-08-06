/*
  Warnings:

  - You are about to drop the `_ChannelAdmins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChannelAdmins" DROP CONSTRAINT "_ChannelAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelAdmins" DROP CONSTRAINT "_ChannelAdmins_B_fkey";

-- DropTable
DROP TABLE "_ChannelAdmins";

-- CreateTable
CREATE TABLE "ChannelToUser" (
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "ChannelToUser_pkey" PRIMARY KEY ("userId","channelId")
);

-- AddForeignKey
ALTER TABLE "ChannelToUser" ADD CONSTRAINT "ChannelToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelToUser" ADD CONSTRAINT "ChannelToUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
