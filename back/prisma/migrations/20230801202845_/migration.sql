-- CreateTable
CREATE TABLE "ChannelToMuted" (
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "ChannelToMuted_pkey" PRIMARY KEY ("userId","channelId")
);

-- CreateTable
CREATE TABLE "ChannelToBanned" (
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "ChannelToBanned_pkey" PRIMARY KEY ("userId","channelId")
);

-- AddForeignKey
ALTER TABLE "ChannelToMuted" ADD CONSTRAINT "ChannelToMuted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelToMuted" ADD CONSTRAINT "ChannelToMuted_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelToBanned" ADD CONSTRAINT "ChannelToBanned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelToBanned" ADD CONSTRAINT "ChannelToBanned_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
