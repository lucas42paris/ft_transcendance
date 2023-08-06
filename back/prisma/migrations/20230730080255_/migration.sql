-- CreateTable
CREATE TABLE "_ChannelAdmins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelAdmins_AB_unique" ON "_ChannelAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelAdmins_B_index" ON "_ChannelAdmins"("B");

-- AddForeignKey
ALTER TABLE "_ChannelAdmins" ADD CONSTRAINT "_ChannelAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmins" ADD CONSTRAINT "_ChannelAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
